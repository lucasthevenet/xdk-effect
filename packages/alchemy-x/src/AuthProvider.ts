import * as Clock from "effect/Clock";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Match from "effect/Match";
import * as Redacted from "effect/Redacted";
import {
  AUTH_ERROR_URL,
  AUTH_SUCCESS_URL,
  AuthError,
  AuthProviderLayer,
  type ConfigureContext,
} from "alchemy/Auth/AuthProvider";
import {
  credentialsFilePath,
  CredentialsStore,
  displayRedacted,
  profileCredentialsDirPath,
} from "alchemy/Auth/Credentials";
import { retryOnce } from "alchemy/Auth/Env";
import * as Clank from "alchemy/Util/Clank";
import {
  createOAuth2Client,
  createXClient,
  type OAuth2Client,
  type OAuth2Token,
} from "distilled-x";
import {
  parseXOAuthScopes,
  readEnvCredentials,
  isStoredOAuthApp,
  isStoredOAuthTokens,
  X_AUTH_PROVIDER_NAME,
  X_OAUTH_APP_STORE_KEY,
  X_OAUTH_DEFAULT_REDIRECT_URI,
  X_OAUTH_DEFAULT_SCOPES,
  X_OAUTH_TOKENS_STORE_KEY,
  X_TOKEN_REFRESH_WINDOW_MS,
  type XAuthConfig,
  type XResolvedCredentials,
  type XStoredOAuthApp,
  type XStoredOAuthTokens,
} from "./AuthEnvironment.ts";
import { repairStoredCredentialPermissionsWith } from "./CredentialFiles.ts";

const OAUTH_CALLBACK_TIMEOUT_MS = 5 * 60_000;

const authError = (message: string, cause?: unknown): AuthError =>
  cause === undefined
    ? new AuthError({ message })
    : new AuthError({ message, cause });

const mapAuthError =
  (message: string) =>
  (cause: unknown): AuthError =>
    cause instanceof AuthError ? cause : authError(message, cause);

const oauthPromise = <A>(
  message: string,
  evaluate: () => Promise<A>,
): Effect.Effect<A, AuthError> =>
  Effect.tryPromise({
    try: evaluate,
    catch: (cause) => authError(message, cause),
  });

type XOAuthLoopbackModule = typeof import("./OAuthLoopback.ts");

// Keep the Node-only listener behind an opaque package self-import. Worker
// bundlers cannot accidentally pull `node:http` into the receiver graph.
// SAFETY: the package export resolves this specifier to the OAuthLoopback
// module on Node/Bun and rejects it under the Worker condition.
const loadOAuthLoopback = (specifier: string) =>
  import(specifier) as Promise<XOAuthLoopbackModule>;

const parseScopes = parseXOAuthScopes;

const validateRedirectUri = (input: string): Effect.Effect<string, AuthError> =>
  Effect.try({
    try: () => {
      const value = input.trim();
      const url = new URL(value);
      if (url.protocol !== "http:" || url.hostname !== "127.0.0.1") {
        throw new TypeError(
          "X OAuth redirect URI must be an http://127.0.0.1 loopback URL",
        );
      }
      const port = Number(url.port);
      if (
        url.port === "" ||
        !Number.isInteger(port) ||
        port < 1 ||
        port > 65_535
      ) {
        throw new TypeError(
          "X OAuth redirect URI must include an explicit port between 1 and 65535",
        );
      }
      if (
        url.username !== "" ||
        url.password !== "" ||
        url.search !== "" ||
        url.hash !== ""
      ) {
        throw new TypeError(
          "X OAuth redirect URI cannot contain credentials, a query, or a fragment",
        );
      }
      return url.toString();
    },
    catch: (cause) =>
      authError(
        cause instanceof Error
          ? cause.message
          : "X OAuth redirect URI is invalid",
        cause,
      ),
  });

const oauthClientFor = (app: {
  readonly clientId: string;
  readonly clientSecret?: string | Redacted.Redacted<string>;
}): OAuth2Client => {
  const clientSecret = app.clientSecret;
  if (clientSecret === undefined) {
    return createOAuth2Client({ clientId: app.clientId });
  }
  const secretValue = Redacted.isRedacted(clientSecret)
    ? Redacted.value(clientSecret)
    : clientSecret;
  return createOAuth2Client({
    clientId: app.clientId,
    clientSecret: () => secretValue,
  });
};

interface XResolvedCredentialsBuilder extends XResolvedCredentials {
  userId?: string;
}

interface XStoredOAuthAppBuilder extends XStoredOAuthApp {
  clientSecret?: string;
}

interface XStoredOAuthTokensBuilder extends XStoredOAuthTokens {
  refreshToken?: string;
  userId?: string;
}

const credentialsFromStored = (
  app: XStoredOAuthApp,
  tokens: XStoredOAuthTokens,
): XResolvedCredentials => {
  const credentials: XResolvedCredentialsBuilder = {
    type: "oauth2",
    appBearerToken: Redacted.make(app.appBearerToken),
    userAccessToken: Redacted.make(tokens.accessToken),
    consumerSecret: Redacted.make(app.consumerSecret),
    clientId: app.clientId,
    accessTokenExpiresAt: tokens.expiresAt,
    oauthScopes: tokens.scopes,
    source: { type: "oauth", details: X_OAUTH_TOKENS_STORE_KEY },
  };
  if (tokens.userId !== undefined) credentials.userId = tokens.userId;
  return credentials;
};

const assertCallbackMatchesRedirect = (
  callback: URL,
  redirectUri: string,
): void => {
  const redirect = new URL(redirectUri);
  if (
    callback.protocol !== redirect.protocol ||
    callback.hostname !== redirect.hostname ||
    callback.port !== redirect.port ||
    callback.pathname !== redirect.pathname
  ) {
    throw new TypeError(
      `The pasted callback URL must start with ${redirect.origin}${redirect.pathname}`,
    );
  }
};

const exchangeCallback = (
  oauth: OAuth2Client,
  callback: string | URL,
  input: {
    readonly redirectUri: string;
    readonly state: string;
    readonly codeVerifier: string;
  },
): Effect.Effect<OAuth2Token, AuthError> =>
  Effect.gen(function* () {
    const code = yield* Effect.try({
      try: () => {
        const url =
          callback instanceof URL ? callback : new URL(callback.trim());
        assertCallbackMatchesRedirect(url, input.redirectUri);
        return oauth.parseAuthorizationCallback(url, input.state).code;
      },
      catch: (cause) => authError("Invalid X OAuth callback", cause),
    });
    return yield* oauthPromise("X OAuth code exchange failed", () =>
      oauth.exchangeCode({
        code,
        codeVerifier: input.codeVerifier,
        redirectUri: input.redirectUri,
      }),
    );
  });

const promptOAuthApp = (): Effect.Effect<XStoredOAuthApp, AuthError> =>
  Effect.gen(function* () {
    const clientId = (yield* Clank.text({
      message: "X OAuth 2.0 Client ID",
      validate: (value) =>
        value.trim().length > 0 ? undefined : "Client ID is required",
    }).pipe(retryOnce)).trim();
    const clientSecretInput = yield* Clank.password({
      message:
        "X OAuth 2.0 Client Secret (optional; leave blank for a public client)",
    }).pipe(retryOnce);
    const clientSecret = clientSecretInput.trim() || undefined;
    const appBearerToken = (yield* Clank.password({
      message: "X App Bearer Token (app-only API access)",
      validate: (value) =>
        value.trim().length > 0 ? undefined : "App bearer token is required",
    }).pipe(retryOnce)).trim();
    const consumerSecret = (yield* Clank.password({
      message: "X API Consumer Secret (webhook CRC/signature verification)",
      validate: (value) =>
        value.trim().length > 0 ? undefined : "API consumer secret is required",
    }).pipe(retryOnce)).trim();
    const redirectUri = yield* validateRedirectUri(
      yield* Clank.text({
        message: "X OAuth callback URI (register this exact URI in X)",
        defaultValue: X_OAUTH_DEFAULT_REDIRECT_URI,
        validate: (value) =>
          value.trim().length > 0 ? undefined : "Callback URI is required",
      }).pipe(retryOnce),
    );
    const requestedScopes = parseScopes(
      yield* Clank.text({
        message: "X OAuth scopes (space or comma separated)",
        defaultValue: X_OAUTH_DEFAULT_SCOPES.join(" "),
        validate: (value) =>
          parseScopes(value).length > 0
            ? undefined
            : "At least one scope is required",
      }).pipe(retryOnce),
    );
    const scopes = requestedScopes.includes("offline.access")
      ? requestedScopes
      : [...requestedScopes, "offline.access"];
    if (!requestedScopes.includes("offline.access")) {
      yield* Clank.info(
        "X: added offline.access so Alchemy can refresh the OAuth token.",
      );
    }

    const app: XStoredOAuthAppBuilder = {
      type: "x-oauth-app",
      clientId,
      appBearerToken,
      consumerSecret,
      redirectUri,
      scopes,
    };
    if (clientSecret !== undefined) app.clientSecret = clientSecret;
    return app;
  });

/** Build the registration layer for X's Alchemy AuthProvider. */
export const makeXAuth = () =>
  AuthProviderLayer<XAuthConfig, XResolvedCredentials>()(
    X_AUTH_PROVIDER_NAME,
    Effect.gen(function* () {
      const store = yield* CredentialsStore;
      const fs = yield* FileSystem.FileSystem;

      const secureWrite = <T>(profileName: string, key: string, value: T) =>
        Effect.gen(function* () {
          const directory = profileCredentialsDirPath(profileName);
          const file = credentialsFilePath(profileName, key);
          yield* fs.makeDirectory(directory, {
            recursive: true,
            mode: 0o700,
          });
          // `mode` only applies on creation. chmod both an existing file and
          // the final file so upgrades also repair permissive credentials.
          yield* fs.chmod(directory, 0o700);
          if (yield* fs.exists(file)) yield* fs.chmod(file, 0o600);
          yield* fs.writeFileString(file, JSON.stringify(value, null, 2), {
            mode: 0o600,
          });
          yield* fs.chmod(file, 0o600);
        });

      const writeApp = (profileName: string, app: XStoredOAuthApp) =>
        secureWrite(profileName, X_OAUTH_APP_STORE_KEY, app).pipe(
          Effect.mapError(mapAuthError("Could not save X OAuth app settings")),
        );

      const writeTokens = (profileName: string, tokens: XStoredOAuthTokens) =>
        secureWrite(profileName, X_OAUTH_TOKENS_STORE_KEY, tokens).pipe(
          Effect.mapError(mapAuthError("Could not save X OAuth tokens")),
        );

      const secureRead = <T>(profileName: string, key: string) =>
        repairStoredCredentialPermissionsWith(fs, profileName, [key]).pipe(
          Effect.mapError(
            mapAuthError("Could not secure stored X OAuth credentials"),
          ),
          Effect.flatMap(() => store.read<T>(profileName, key)),
        );

      const readApp = (
        profileName: string,
      ): Effect.Effect<XStoredOAuthApp, AuthError> =>
        secureRead<unknown>(profileName, X_OAUTH_APP_STORE_KEY).pipe(
          Effect.flatMap((value) =>
            isStoredOAuthApp(value)
              ? validateRedirectUri(value.redirectUri).pipe(Effect.as(value))
              : Effect.fail(
                  authError(
                    "X OAuth app settings not found. Run: alchemy login --configure",
                  ),
                ),
          ),
        );

      const readTokens = (
        profileName: string,
      ): Effect.Effect<XStoredOAuthTokens, AuthError> =>
        secureRead<unknown>(profileName, X_OAUTH_TOKENS_STORE_KEY).pipe(
          Effect.flatMap((value) =>
            isStoredOAuthTokens(value)
              ? Effect.succeed(value)
              : Effect.fail(
                  authError(
                    "X OAuth tokens not found. Run: alchemy login --configure",
                  ),
                ),
          ),
        );

      const refreshTokens = Effect.fn(function* (
        profileName: string,
        app: XStoredOAuthApp,
        tokens: XStoredOAuthTokens,
      ) {
        if (!tokens.refreshToken) {
          return yield* authError(
            "X OAuth refresh token is missing. Re-authorize with the offline.access scope.",
          );
        }
        const oauth = oauthClientFor(app);
        const refreshed = yield* oauthPromise(
          "X OAuth token refresh failed",
          () => oauth.refreshToken({ refreshToken: tokens.refreshToken! }),
        );
        const now = yield* Clock.currentTimeMillis;
        const fresh: XStoredOAuthTokensBuilder = {
          type: "x-oauth-tokens",
          accessToken: refreshed.access_token,
          refreshToken: refreshed.refresh_token ?? tokens.refreshToken,
          expiresAt: now + refreshed.expires_in * 1_000,
          scopes:
            refreshed.scope !== undefined
              ? parseScopes(refreshed.scope)
              : tokens.scopes,
        };
        if (tokens.userId !== undefined) fresh.userId = tokens.userId;
        // X may rotate refresh tokens. Persist before returning the access
        // token so no later consumer can observe an uncommitted rotation.
        yield* writeTokens(profileName, fresh);
        return fresh;
      });

      const discoverUserId = (
        app: XStoredOAuthApp,
        accessToken: string,
      ): Effect.Effect<string | undefined> =>
        oauthPromise("Could not discover the authenticated X user", () =>
          createXClient({
            appBearerToken: () => app.appBearerToken,
            userAccessToken: () => accessToken,
          }).users.getMe(),
        ).pipe(
          Effect.map((result) => result.value.data?.id),
          Effect.catch(() => Effect.succeed(undefined)),
        );

      const oauthLogin = Effect.fn(function* (
        profileName: string,
        app: XStoredOAuthApp,
      ) {
        const oauth = oauthClientFor(app);
        const authorization = yield* oauthPromise(
          "Could not create the X OAuth authorization request",
          () =>
            oauth.createAuthorizationRequest({
              redirectUri: app.redirectUri,
              scopes: app.scopes,
            }),
        );
        const callbackInput = {
          redirectUri: app.redirectUri,
          state: authorization.state,
          codeVerifier: authorization.codeVerifier,
        };
        // Keep the Node-only loopback server outside Worker module graphs and
        // bind it before the browser can redirect back to us.
        const listenerResult = yield* Effect.tryPromise({
          try: () =>
            loadOAuthLoopback("alchemy-x/internal/oauth-loopback").then(
              ({ startXOAuthLoopback }) =>
                startXOAuthLoopback({
                  redirectUri: app.redirectUri,
                  state: authorization.state,
                  successUrl: AUTH_SUCCESS_URL,
                  errorUrl: AUTH_ERROR_URL,
                }),
            ),
          catch: (cause) =>
            authError("Could not start the X OAuth callback server", cause),
        }).pipe(Effect.result);
        const listener =
          listenerResult._tag === "Success"
            ? listenerResult.success
            : undefined;
        if (listenerResult._tag === "Failure") {
          yield* Clank.warn(
            "X: the local callback listener is unavailable; paste the callback URL after authorizing.",
          );
        }

        const login = Effect.gen(function* () {
          yield* Clank.info("X: opening browser for OAuth 2.0 PKCE login...");
          yield* Clank.info(authorization.url);
          yield* Clank.openUrl(authorization.url).pipe(
            Effect.catch(() =>
              Clank.warn(
                "X: could not open the browser automatically. Open the URL above manually.",
              ),
            ),
          );
          yield* Clank.info(
            listener === undefined
              ? "X: waiting for the callback URL for up to five minutes."
              : `X: waiting on ${app.redirectUri} for up to five minutes.`,
          );

          const manualCallback = Clank.text({
            message: "Paste the full X OAuth callback URL",
            placeholder: `${app.redirectUri}?state=...&code=...`,
            validate: (value) =>
              value.trim().length > 0 ? undefined : "Paste the callback URL",
          }).pipe(retryOnce);
          const callback =
            listener === undefined
              ? yield* manualCallback
              : yield* Effect.raceFirst(
                  Effect.tryPromise({
                    try: () => listener.callback,
                    catch: (cause) =>
                      authError("X OAuth callback listener failed", cause),
                  }),
                  manualCallback,
                );
          const token = yield* exchangeCallback(oauth, callback, callbackInput);
          if (listener !== undefined) {
            yield* Effect.promise(() => listener.finish(true)).pipe(
              Effect.ignore,
            );
          }
          return token;
        }).pipe(
          Effect.timeoutOrElse({
            duration: OAUTH_CALLBACK_TIMEOUT_MS,
            orElse: () =>
              Effect.fail(
                authError("X OAuth authorization timed out after five minutes"),
              ),
          }),
        );
        const token = yield* listener === undefined
          ? login
          : login.pipe(
              Effect.ensuring(
                Effect.promise(() => listener.finish(false)).pipe(
                  Effect.ignore,
                ),
              ),
            );
        const now = yield* Clock.currentTimeMillis;
        const userId = yield* discoverUserId(app, token.access_token);
        const tokens: XStoredOAuthTokensBuilder = {
          type: "x-oauth-tokens",
          accessToken: token.access_token,
          expiresAt: now + token.expires_in * 1_000,
          scopes:
            token.scope !== undefined ? parseScopes(token.scope) : app.scopes,
        };
        if (token.refresh_token !== undefined) {
          tokens.refreshToken = token.refresh_token;
        }
        if (userId !== undefined) tokens.userId = userId;
        yield* writeTokens(profileName, tokens);
        yield* Clank.success("X: OAuth credentials saved.");
        return tokens;
      });

      const resolveOAuth = Effect.fn(function* (profileName: string) {
        const app = yield* readApp(profileName);
        const tokens = yield* readTokens(profileName);
        const now = yield* Clock.currentTimeMillis;
        const fresh =
          tokens.expiresAt > now + X_TOKEN_REFRESH_WINDOW_MS
            ? tokens
            : yield* refreshTokens(profileName, app, tokens).pipe(
                Effect.mapError((cause) =>
                  authError(
                    "X OAuth refresh failed. Run: alchemy login --configure",
                    cause,
                  ),
                ),
              );
        return credentialsFromStored(app, fresh);
      });

      const configure = (profileName: string, context: ConfigureContext) =>
        Effect.gen(function* () {
          if (context.ci) return { method: "env" as const };
          if (context.reason !== undefined) {
            yield* Clank.info(context.reason);
          }
          const method = yield* Clank.select<XAuthConfig["method"]>({
            message: "X authentication method",
            options: [
              {
                value: "oauth",
                label: "OAuth 2.0 PKCE",
                hint: "browser login with automatic token refresh",
              },
              {
                value: "env",
                label: "Environment Variables",
                hint: "X_BEARER_TOKEN + X_API_SECRET + X_ACCESS_TOKEN",
              },
            ],
          }).pipe(retryOnce);
          if (method === "env") return { method: "env" as const };

          const app = yield* promptOAuthApp();
          yield* writeApp(profileName, app);
          yield* oauthLogin(profileName, app);
          return { method: "oauth" as const };
        }).pipe(
          Effect.mapError(mapAuthError("Failed to configure X credentials")),
        );

      const read = (
        profileName: string,
        config: XAuthConfig,
      ): Effect.Effect<XResolvedCredentials, AuthError> =>
        Match.value(config).pipe(
          Match.when({ method: "env" }, () => readEnvCredentials()),
          Match.when({ method: "oauth" }, () => resolveOAuth(profileName)),
          Match.exhaustive,
        );

      const login = (profileName: string, config: XAuthConfig) =>
        Match.value(config).pipe(
          Match.when({ method: "env" }, () =>
            readEnvCredentials().pipe(Effect.asVoid),
          ),
          Match.when({ method: "oauth" }, () =>
            Effect.gen(function* () {
              const app = yield* readApp(profileName);
              const stored = yield* store.read<unknown>(
                profileName,
                X_OAUTH_TOKENS_STORE_KEY,
              );
              if (isStoredOAuthTokens(stored) && stored.refreshToken) {
                const refreshed = yield* refreshTokens(
                  profileName,
                  app,
                  stored,
                ).pipe(Effect.result);
                if (refreshed._tag === "Success") {
                  yield* Clank.success("X: OAuth credentials refreshed.");
                  return;
                }
                yield* Clank.warn(
                  "X: the stored refresh token could not be refreshed; starting a new browser login.",
                );
              }
              yield* oauthLogin(profileName, app);
            }).pipe(Effect.asVoid),
          ),
          Match.exhaustive,
        );

      const logout = (
        profileName: string,
        config: XAuthConfig,
      ): Effect.Effect<void, AuthError> =>
        Match.value(config).pipe(
          Match.when({ method: "env" }, () => Effect.void),
          Match.when({ method: "oauth" }, () =>
            Effect.gen(function* () {
              const [appValue, tokenValue] = yield* Effect.all([
                secureRead<unknown>(profileName, X_OAUTH_APP_STORE_KEY),
                secureRead<unknown>(profileName, X_OAUTH_TOKENS_STORE_KEY),
              ]);
              if (
                isStoredOAuthApp(appValue) &&
                isStoredOAuthTokens(tokenValue)
              ) {
                const oauth = oauthClientFor(appValue);
                const tokens = [
                  tokenValue.accessToken,
                  ...(tokenValue.refreshToken !== undefined &&
                  tokenValue.refreshToken !== tokenValue.accessToken
                    ? [tokenValue.refreshToken]
                    : []),
                ];
                yield* Effect.forEach(tokens, (token) =>
                  oauthPromise("X OAuth token revocation failed", () =>
                    oauth.revokeToken({ token }),
                  ).pipe(
                    Effect.catch((cause) =>
                      Clank.warn(
                        `X: remote token revocation failed; removing local credentials anyway (${cause.message}).`,
                      ),
                    ),
                  ),
                );
              }
              yield* Effect.all([
                store.delete(profileName, X_OAUTH_TOKENS_STORE_KEY),
                store.delete(profileName, X_OAUTH_APP_STORE_KEY),
              ]);
              yield* Clank.success("X: OAuth credentials removed.");
            }),
          ),
          Match.exhaustive,
        );

      const prettyPrint = (profileName: string, config: XAuthConfig) =>
        Match.value(config).pipe(
          Match.when({ method: "env" }, () => readEnvCredentials()),
          Match.when({ method: "oauth" }, () =>
            Effect.all([readApp(profileName), readTokens(profileName)]).pipe(
              Effect.map(([app, tokens]) => credentialsFromStored(app, tokens)),
            ),
          ),
          Match.exhaustive,
          Effect.flatMap((credentials) => {
            const source = credentials.source.details
              ? `${credentials.source.type} - ${credentials.source.details}`
              : credentials.source.type;
            return Effect.all([
              Console.log(
                `  appBearerToken: ${displayRedacted(credentials.appBearerToken, 6)}`,
              ),
              Console.log(
                `  userAccessToken: ${displayRedacted(credentials.userAccessToken, 6)}`,
              ),
              Console.log(
                `  consumerSecret: ${displayRedacted(credentials.consumerSecret, 4)}`,
              ),
              ...(credentials.clientId !== undefined
                ? [Console.log(`  clientId: ${credentials.clientId}`)]
                : []),
              ...(credentials.userId !== undefined
                ? [Console.log(`  userId: ${credentials.userId}`)]
                : []),
              ...(credentials.accessTokenExpiresAt !== undefined
                ? [
                    Console.log(
                      `  accessTokenExpiresAt: ${new Date(credentials.accessTokenExpiresAt).toISOString()}`,
                    ),
                  ]
                : []),
              ...(credentials.oauthScopes !== undefined
                ? [
                    Console.log(
                      `  scopes: ${credentials.oauthScopes.join(" ")}`,
                    ),
                  ]
                : []),
              Console.log(`  source: ${source}`),
            ]).pipe(Effect.asVoid);
          }),
        );

      return { configure, login, logout, prettyPrint, read };
    }),
  );

/** Default X AuthProvider registration layer. */
export const XAuth = makeXAuth();
