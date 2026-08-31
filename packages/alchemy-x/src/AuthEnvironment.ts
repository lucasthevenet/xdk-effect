import * as Clock from "effect/Clock";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as Schema from "effect/Schema";
import { AuthError } from "alchemy/Auth/AuthProvider";
import { getEnv, getEnvRedactedRequired } from "alchemy/Auth/Env";

/** Canonical key used by Alchemy's AuthProvider registry. */
export const X_AUTH_PROVIDER_NAME = "X";

/** CredentialsStore key containing OAuth application configuration. */
export const X_OAUTH_APP_STORE_KEY = "x-oauth-app";

/** CredentialsStore key containing the user's rotating OAuth tokens. */
export const X_OAUTH_TOKENS_STORE_KEY = "x-oauth-tokens";

/** Default callback URI to register in the X developer portal. */
export const X_OAUTH_DEFAULT_REDIRECT_URI =
  "http://127.0.0.1:9976/auth/callback";

export const X_OAUTH_DEFAULT_SCOPES = [
  "tweet.read",
  "users.read",
  "dm.read",
  "dm.write",
  "offline.access",
] as const;

export const X_TOKEN_REFRESH_WINDOW_MS = 60_000;

/**
 * The only X data stored in `~/.alchemy/profiles.json`.
 * Secrets and OAuth application configuration live in CredentialsStore.
 */
export type XAuthConfig = { method: "env" } | { method: "oauth" };

export interface XStoredOAuthApp {
  readonly type: "x-oauth-app";
  readonly clientId: string;
  readonly clientSecret?: string;
  readonly appBearerToken: string;
  readonly consumerSecret: string;
  readonly redirectUri: string;
  readonly scopes: readonly string[];
}

export interface XStoredOAuthTokens {
  readonly type: "x-oauth-tokens";
  readonly accessToken: string;
  readonly refreshToken?: string;
  readonly expiresAt: number;
  readonly scopes: readonly string[];
  readonly userId?: string;
}

export interface XResolvedCredentials {
  readonly type: "oauth2";
  readonly appBearerToken: Redacted.Redacted<string>;
  readonly userAccessToken: Redacted.Redacted<string>;
  readonly consumerSecret: Redacted.Redacted<string>;
  readonly clientId?: string;
  readonly userId?: string;
  readonly accessTokenExpiresAt?: number;
  readonly oauthScopes?: readonly string[];
  readonly source: {
    readonly type: XAuthConfig["method"];
    readonly details?: string;
  };
}

export interface XResolvedAppCredentials {
  readonly appBearerToken: Redacted.Redacted<string>;
  readonly consumerSecret: Redacted.Redacted<string>;
  readonly clientId?: string;
  readonly source: {
    readonly type: XAuthConfig["method"];
    readonly details?: string;
  };
}

interface XResolvedAppCredentialsBuilder {
  appBearerToken: Redacted.Redacted<string>;
  consumerSecret: Redacted.Redacted<string>;
  clientId?: string;
  source: XResolvedAppCredentials["source"];
}

interface XResolvedCredentialsBuilder {
  type: "oauth2";
  appBearerToken: Redacted.Redacted<string>;
  userAccessToken: Redacted.Redacted<string>;
  consumerSecret: Redacted.Redacted<string>;
  clientId?: string;
  accessTokenExpiresAt?: number;
  oauthScopes?: readonly string[];
  source: XResolvedCredentials["source"];
}

const StoredOAuthAppSchema = Schema.Struct({
  type: Schema.Literal("x-oauth-app"),
  clientId: Schema.NonEmptyString,
  clientSecret: Schema.optionalKey(Schema.String),
  appBearerToken: Schema.NonEmptyString,
  consumerSecret: Schema.NonEmptyString,
  redirectUri: Schema.String,
  scopes: Schema.NonEmptyArray(Schema.NonEmptyString),
});

const StoredOAuthTokensSchema = Schema.Struct({
  type: Schema.Literal("x-oauth-tokens"),
  accessToken: Schema.NonEmptyString,
  refreshToken: Schema.optionalKey(Schema.String),
  expiresAt: Schema.Finite,
  scopes: Schema.Array(Schema.NonEmptyString),
  userId: Schema.optionalKey(Schema.String),
});

export const isStoredOAuthApp = Schema.is(StoredOAuthAppSchema);

export const isStoredOAuthTokens = Schema.is(StoredOAuthTokensSchema);

const authError = (message: string, cause?: unknown): AuthError =>
  cause === undefined
    ? new AuthError({ message })
    : new AuthError({ message, cause });

export const parseXOAuthScopes = (input: string): readonly string[] => [
  ...new Set(
    input
      .split(/[\s,]+/u)
      .map((scope) => scope.trim())
      .filter((scope) => scope.length > 0),
  ),
];

const parseExpiresAt = (
  input: string | undefined,
): Effect.Effect<number | undefined, AuthError> => {
  if (input === undefined || input.trim() === "") {
    return Effect.succeed(undefined);
  }
  const value = input.trim();
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 0) {
    // Accept both Unix seconds and Unix milliseconds.
    return Effect.succeed(
      numeric < 100_000_000_000 ? numeric * 1_000 : numeric,
    );
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed)
    ? Effect.succeed(parsed)
    : Effect.fail(
        authError(
          "X_ACCESS_TOKEN_EXPIRES_AT must be an ISO date, Unix seconds, or Unix milliseconds",
        ),
      );
};

/** Resolve only the app credentials needed for CRC and app-auth operations. */
export const readEnvAppCredentials = (): Effect.Effect<
  XResolvedAppCredentials,
  AuthError
> =>
  Effect.gen(function* () {
    const appBearerToken = yield* getEnvRedactedRequired("X_BEARER_TOKEN");
    const consumerSecret = yield* getEnvRedactedRequired("X_API_SECRET");
    const clientIdValue = yield* getEnv("X_CLIENT_ID");
    const clientId = clientIdValue?.trim() || undefined;
    const credentials: XResolvedAppCredentialsBuilder = {
      appBearerToken,
      consumerSecret,
      source: {
        type: "env",
        details: "X_BEARER_TOKEN/X_API_SECRET",
      },
    };
    if (clientId !== undefined) credentials.clientId = clientId;
    return credentials satisfies XResolvedAppCredentials;
  });

/** Resolve the documented X environment-variable credential set. */
export const readEnvCredentials = (): Effect.Effect<
  XResolvedCredentials,
  AuthError
> =>
  Effect.gen(function* () {
    const app = yield* readEnvAppCredentials();
    const userAccessToken = yield* getEnvRedactedRequired("X_ACCESS_TOKEN");
    const configuredScopes = yield* getEnv("X_OAUTH_SCOPES");
    const oauthScopes =
      configuredScopes === undefined
        ? undefined
        : parseXOAuthScopes(configuredScopes);
    const accessTokenExpiresAt = yield* parseExpiresAt(
      yield* getEnv("X_ACCESS_TOKEN_EXPIRES_AT"),
    );
    const details = "X_BEARER_TOKEN/X_API_SECRET/X_ACCESS_TOKEN";

    if (accessTokenExpiresAt !== undefined) {
      const now = yield* Clock.currentTimeMillis;
      if (accessTokenExpiresAt <= now + X_TOKEN_REFRESH_WINDOW_MS) {
        return yield* Effect.fail(
          authError(
            "X_ACCESS_TOKEN is expired or expires within 60 seconds. Rotate the environment token externally or use stored OAuth (`alchemy login --configure`) so Alchemy can persist X's replacement refresh token safely.",
          ),
        );
      }
    }

    const credentials: XResolvedCredentialsBuilder = {
      type: "oauth2",
      appBearerToken: app.appBearerToken,
      userAccessToken,
      consumerSecret: app.consumerSecret,
      source: { type: "env", details },
    };
    if (app.clientId !== undefined) credentials.clientId = app.clientId;
    if (accessTokenExpiresAt !== undefined) {
      credentials.accessTokenExpiresAt = accessTokenExpiresAt;
    }
    if (oauthScopes !== undefined && oauthScopes.length > 0) {
      credentials.oauthScopes = oauthScopes;
    }
    return credentials satisfies XResolvedCredentials;
  });
