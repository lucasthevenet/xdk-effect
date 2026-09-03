import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as Match from "effect/Match";
import * as Redacted from "effect/Redacted";
import * as Schema from "effect/Schema";
import {
  AuthError,
  AuthProviderLayer,
  type ConfigureContext,
} from "alchemy/Auth/AuthProvider";
import { CredentialsStore, displayRedacted } from "alchemy/Auth/Credentials";
import { retryOnce } from "alchemy/Auth/Env";
import { AlchemyProfile } from "alchemy/Auth/Profile";
import * as Clank from "alchemy/Util/Clank";
import {
  readEnvCredentials,
  X_AUTH_PROVIDER_NAME,
  X_STORED_CREDENTIALS_KEY,
  type XAuthConfig,
  type XResolvedCredentials,
  type XStoredCredentials,
} from "./AuthEnvironment.ts";

const options: Array<{
  readonly value: XAuthConfig["method"];
  readonly label: string;
  readonly hint: string;
}> = [
  {
    value: "env",
    label: "Environment Variables",
    hint: "OAuth 1.0a: X_API_KEY + X_API_SECRET + X_ACCESS_TOKEN + X_ACCESS_TOKEN_SECRET",
  },
  {
    value: "stored",
    label: "Stored Credentials",
    hint: "Access Token & Secret (OAuth 1.0a), stored in ~/.alchemy/credentials",
  },
];

const authError = (message: string, cause?: unknown): AuthError =>
  cause === undefined
    ? new AuthError({ message })
    : new AuthError({ message, cause });

const StoredCredentialsSchema = Schema.Struct({
  type: Schema.Literal("oauth1"),
  apiKey: Schema.NonEmptyString,
  apiSecret: Schema.NonEmptyString,
  accessToken: Schema.NonEmptyString,
  accessTokenSecret: Schema.NonEmptyString,
});

const decodeStoredCredentials = Schema.decodeUnknownEffect(
  StoredCredentialsSchema,
);

const AuthConfigSchema = Schema.Union([
  Schema.Struct({ method: Schema.Literal("env") }),
  Schema.Struct({ method: Schema.Literal("stored") }),
]);

const validateAuthConfig = (config: XAuthConfig) =>
  Schema.decodeUnknownEffect(AuthConfigSchema)(config).pipe(
    Effect.mapError(() =>
      authError(
        "X authentication profile uses an unsupported method. Run: alchemy login --configure",
      ),
    ),
  );

const fromStored = (credentials: XStoredCredentials): XResolvedCredentials => ({
  type: "oauth1",
  apiKey: Redacted.make(credentials.apiKey),
  apiSecret: Redacted.make(credentials.apiSecret),
  accessToken: Redacted.make(credentials.accessToken),
  accessTokenSecret: Redacted.make(credentials.accessTokenSecret),
  source: { type: "stored", details: X_STORED_CREDENTIALS_KEY },
});

const promptSecret = (message: string) =>
  Clank.password({
    message,
    validate: (value) => (value.trim().length === 0 ? "Required" : undefined),
  }).pipe(
    retryOnce,
    Effect.map((value) => value.trim()),
  );

/** Build the stored/environment registration layer for X's AuthProvider. */
export const makeXAuth = () =>
  AuthProviderLayer<XAuthConfig, XResolvedCredentials>()(
    X_AUTH_PROVIDER_NAME,
    Effect.gen(function* () {
      const profiles = yield* AlchemyProfile;
      const store = yield* CredentialsStore;

      const readStored = (
        profileName: string,
      ): Effect.Effect<XStoredCredentials, AuthError> =>
        store
          .read<unknown>(profileName, X_STORED_CREDENTIALS_KEY)
          .pipe(
            Effect.flatMap((credentials) =>
              decodeStoredCredentials(credentials).pipe(
                Effect.mapError(() =>
                  authError(
                    "X stored OAuth 1.0a credentials are missing or invalid. Run: alchemy login --configure",
                  ),
                ),
              ),
            ),
          );

      const loginStored = Effect.fn(function* (profileName: string) {
        const apiKey = yield* promptSecret("X API Key (Consumer Key)");
        const apiSecret = yield* promptSecret("X API Secret (Consumer Secret)");
        const accessToken = yield* promptSecret("X Access Token (OAuth 1.0a)");
        const accessTokenSecret = yield* promptSecret(
          "X Access Token Secret (OAuth 1.0a)",
        );
        const credentials = {
          type: "oauth1",
          apiKey,
          apiSecret,
          accessToken,
          accessTokenSecret,
        } as const satisfies XStoredCredentials;

        yield* store.write(profileName, X_STORED_CREDENTIALS_KEY, credentials);
        yield* Clank.success("X: credentials saved.");
        return { method: "stored" as const };
      });

      const configureInteractive = (profileName: string) =>
        Clank.select({
          message: "X authentication method",
          options,
        }).pipe(
          Effect.flatMap((method) =>
            Match.value(method).pipe(
              Match.when("env", () =>
                Effect.succeed({ method: "env" as const }),
              ),
              Match.when("stored", () => loginStored(profileName)),
              Match.exhaustive,
            ),
          ),
        );

      const configure = (profileName: string, context: ConfigureContext) =>
        Effect.gen(function* () {
          if (context.ci) return { method: "env" as const };
          if (context.reason !== undefined) yield* Clank.info(context.reason);
          return yield* configureInteractive(profileName);
        }).pipe(
          Effect.mapError((cause) =>
            authError("Failed to configure X credentials", cause),
          ),
        );

      const read = (
        profileName: string,
        config: XAuthConfig,
      ): Effect.Effect<XResolvedCredentials, AuthError> =>
        validateAuthConfig(config).pipe(
          Effect.flatMap((validated) =>
            Match.value(validated).pipe(
              Match.when({ method: "env" }, () => readEnvCredentials()),
              Match.when({ method: "stored" }, () =>
                readStored(profileName).pipe(Effect.map(fromStored)),
              ),
              Match.exhaustive,
            ),
          ),
        );

      const logout = (profileName: string, config: XAuthConfig) =>
        validateAuthConfig(config).pipe(
          Effect.flatMap((validated) =>
            Match.value(validated).pipe(
              Match.when({ method: "env" }, () => Effect.void),
              Match.when({ method: "stored" }, () =>
                store
                  .delete(profileName, X_STORED_CREDENTIALS_KEY)
                  .pipe(
                    Effect.andThen(
                      Clank.success("X: stored credentials removed"),
                    ),
                  ),
              ),
              Match.exhaustive,
            ),
          ),
        );

      const login = (profileName: string, config: XAuthConfig) =>
        validateAuthConfig(config).pipe(
          Effect.flatMap((validated) =>
            Match.value(validated).pipe(
              Match.when({ method: "env" }, () =>
                readEnvCredentials().pipe(
                  Effect.matchEffect({
                    onSuccess: () => Effect.void,
                    onFailure: () =>
                      Effect.gen(function* () {
                        const next = yield* configureInteractive(profileName);
                        const existing =
                          yield* profiles.getProfile(profileName);
                        yield* profiles.setProfile(profileName, {
                          ...existing,
                          [X_AUTH_PROVIDER_NAME]: next,
                        });
                      }),
                  }),
                ),
              ),
              Match.when({ method: "stored" }, () =>
                readStored(profileName).pipe(
                  Effect.matchEffect({
                    onSuccess: () => Effect.void,
                    onFailure: () =>
                      loginStored(profileName).pipe(Effect.asVoid),
                  }),
                ),
              ),
              Match.exhaustive,
            ),
          ),
          Effect.mapError((cause) =>
            cause instanceof AuthError
              ? cause
              : authError("X login failed", cause),
          ),
        );

      const prettyPrint = (profileName: string, config: XAuthConfig) =>
        read(profileName, config).pipe(
          Effect.flatMap((credentials) => {
            const source = credentials.source.details
              ? `${credentials.source.type} - ${credentials.source.details}`
              : credentials.source.type;
            return Effect.all([
              Console.log(
                `  apiKey: ${displayRedacted(credentials.apiKey, 4)}`,
              ),
              Console.log(
                `  apiSecret: ${displayRedacted(credentials.apiSecret, 4)}`,
              ),
              Console.log(
                `  accessToken: ${displayRedacted(credentials.accessToken, 4)}`,
              ),
              Console.log(
                `  accessTokenSecret: ${displayRedacted(credentials.accessTokenSecret, 4)}`,
              ),
              Console.log(`  source: ${source}`),
            ]).pipe(Effect.asVoid);
          }),
        );

      return { configure, login, logout, prettyPrint, read };
    }),
  );

/** Default stored/environment X AuthProvider registration layer. */
export const XAuth = makeXAuth();
