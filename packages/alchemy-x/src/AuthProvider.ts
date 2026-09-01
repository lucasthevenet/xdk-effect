import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import {
  AuthProviderLayer,
  type ConfigureContext,
} from "alchemy/Auth/AuthProvider";
import { displayRedacted } from "alchemy/Auth/Credentials";
import * as Clank from "alchemy/Util/Clank";
import {
  readEnvCredentials,
  X_AUTH_PROVIDER_NAME,
  type XAuthConfig,
  type XResolvedCredentials,
} from "./AuthEnvironment.ts";

const environmentConfig = { method: "env" } as const satisfies XAuthConfig;

const configure = (_profileName: string, context: ConfigureContext) =>
  Effect.gen(function* () {
    if (context.reason !== undefined) yield* Clank.info(context.reason);
    yield* Clank.info(
      "X credentials are read from X_BEARER_TOKEN, X_API_SECRET, and X_ACCESS_TOKEN.",
    );
    return environmentConfig;
  });

const read = (_profileName: string, _config: XAuthConfig) =>
  readEnvCredentials();

const login = (_profileName: string, _config: XAuthConfig) =>
  readEnvCredentials().pipe(Effect.asVoid);

const logout = (_profileName: string, _config: XAuthConfig) => Effect.void;

const prettyPrint = (_profileName: string, _config: XAuthConfig) =>
  readEnvCredentials().pipe(
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
        ...(credentials.accessTokenExpiresAt !== undefined
          ? [
              Console.log(
                `  accessTokenExpiresAt: ${new Date(credentials.accessTokenExpiresAt).toISOString()}`,
              ),
            ]
          : []),
        ...(credentials.oauthScopes !== undefined
          ? [Console.log(`  scopes: ${credentials.oauthScopes.join(" ")}`)]
          : []),
        Console.log(`  source: ${source}`),
      ]).pipe(Effect.asVoid);
    }),
  );

/** Build the environment-only registration layer for X's AuthProvider. */
export const makeXAuth = () =>
  AuthProviderLayer<XAuthConfig, XResolvedCredentials>()(X_AUTH_PROVIDER_NAME, {
    configure,
    login,
    logout,
    prettyPrint,
    read,
  });

/** Default environment-only X AuthProvider registration layer. */
export const XAuth = makeXAuth();
