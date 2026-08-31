import * as Config from "effect/Config";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import {
  AuthError,
  AuthProviders,
  getAuthProvider,
} from "alchemy/Auth/AuthProvider";
import { CredentialsStore } from "alchemy/Auth/Credentials";
import { ALCHEMY_PROFILE, AlchemyProfile } from "alchemy/Auth/Profile";
import {
  createXClient as createDistilledXClient,
  type XClient,
  type XClientConfig,
} from "distilled-x";
import {
  isStoredOAuthApp,
  readEnvAppCredentials,
  X_AUTH_PROVIDER_NAME,
  X_OAUTH_APP_STORE_KEY,
  type XAuthConfig,
  type XResolvedAppCredentials,
  type XResolvedCredentials,
  readEnvCredentials,
} from "./AuthEnvironment.ts";
import { repairStoredCredentialPermissionsWith } from "./CredentialFiles.ts";

export type XCredentialsSource =
  | XResolvedCredentials["source"]
  | { readonly type: "credentials"; readonly details?: string };

export interface XCredentialsService {
  readonly client: XClient;
  readonly appBearerToken: Redacted.Redacted<string>;
  readonly userAccessToken: Redacted.Redacted<string>;
  readonly consumerSecret: Redacted.Redacted<string>;
  readonly userId?: string;
  readonly clientId?: string;
  readonly oauthScopes?: readonly string[];
  readonly source: XCredentialsSource;
}

export interface XAppCredentialsService {
  readonly client: XClient;
  readonly appBearerToken: Redacted.Redacted<string>;
  readonly consumerSecret: Redacted.Redacted<string>;
  readonly clientId?: string;
  readonly source: XCredentialsSource;
}

export interface XCredentialsInput {
  readonly appBearerToken: string | Redacted.Redacted<string>;
  readonly userAccessToken: string | Redacted.Redacted<string>;
  readonly consumerSecret: string | Redacted.Redacted<string>;
  readonly userId?: string;
  readonly clientId?: string;
  readonly oauthScopes?: readonly string[];
  readonly source?: XCredentialsSource;
}

export type XAppCredentialsInput = Pick<
  XCredentialsInput,
  "appBearerToken" | "consumerSecret" | "clientId" | "source"
>;

export type XClientOptions = Omit<
  XClientConfig,
  "appBearerToken" | "userAccessToken"
>;

const toRedacted = (
  value: string | Redacted.Redacted<string>,
): Redacted.Redacted<string> =>
  typeof value === "string" ? Redacted.make(value) : value;

/** Create a distilled-x client without exposing Redacted token values. */
export const createXClient = (
  credentials: Pick<XCredentialsInput, "appBearerToken" | "userAccessToken">,
  options: XClientOptions = {},
): XClient => {
  const appBearerToken = toRedacted(credentials.appBearerToken);
  const userAccessToken = toRedacted(credentials.userAccessToken);
  return createDistilledXClient({
    ...options,
    appBearerToken: () => Redacted.value(appBearerToken),
    userAccessToken: () => Redacted.value(userAccessToken),
  });
};

const createAppClient = (
  credentials: Pick<XAppCredentialsInput, "appBearerToken">,
  options: XClientOptions = {},
): XClient => {
  const appBearerToken = toRedacted(credentials.appBearerToken);
  return createDistilledXClient({
    ...options,
    appBearerToken: () => Redacted.value(appBearerToken),
  });
};

const make = (
  input: XCredentialsInput,
  options?: XClientOptions,
): XCredentialsService => {
  const appBearerToken = toRedacted(input.appBearerToken);
  const userAccessToken = toRedacted(input.userAccessToken);
  const consumerSecret = toRedacted(input.consumerSecret);
  return {
    client: createXClient({ appBearerToken, userAccessToken }, options),
    appBearerToken,
    userAccessToken,
    consumerSecret,
    ...(input.userId !== undefined ? { userId: input.userId } : {}),
    ...(input.clientId !== undefined ? { clientId: input.clientId } : {}),
    ...(input.oauthScopes !== undefined
      ? { oauthScopes: input.oauthScopes }
      : {}),
    source: input.source ?? { type: "credentials" },
  };
};

const fromResolved = (
  credentials: XResolvedCredentials,
  options?: XClientOptions,
): XCredentialsService =>
  make(
    {
      appBearerToken: credentials.appBearerToken,
      userAccessToken: credentials.userAccessToken,
      consumerSecret: credentials.consumerSecret,
      ...(credentials.userId !== undefined
        ? { userId: credentials.userId }
        : {}),
      ...(credentials.clientId !== undefined
        ? { clientId: credentials.clientId }
        : {}),
      ...(credentials.oauthScopes !== undefined
        ? { oauthScopes: credentials.oauthScopes }
        : {}),
      source: credentials.source,
    },
    options,
  );

const makeApp = (
  input: XAppCredentialsInput,
  options?: XClientOptions,
): XAppCredentialsService => {
  const appBearerToken = toRedacted(input.appBearerToken);
  const consumerSecret = toRedacted(input.consumerSecret);
  return {
    client: createAppClient({ appBearerToken }, options),
    appBearerToken,
    consumerSecret,
    ...(input.clientId !== undefined ? { clientId: input.clientId } : {}),
    source: input.source ?? { type: "credentials" },
  };
};

const fromResolvedApp = (
  credentials: XResolvedAppCredentials,
  options?: XClientOptions,
): XAppCredentialsService =>
  makeApp(
    {
      appBearerToken: credentials.appBearerToken,
      consumerSecret: credentials.consumerSecret,
      ...(credentials.clientId !== undefined
        ? { clientId: credentials.clientId }
        : {}),
      source: credentials.source,
    },
    options,
  );

/**
 * Provided tag. Its value intentionally remains lazy so registering provider
 * layers for `alchemy login` never tries to resolve credentials early.
 */
export class XCredentialsContext extends Context.Service<
  XCredentialsContext,
  Effect.Effect<XCredentialsService>
>()("X::Credentials") {}

/** Flattened accessor used by resources: `const { client } = yield* XCredentials`. */
export const XCredentials: Effect.Effect<
  XCredentialsService,
  never,
  XCredentialsContext
> = Effect.flatten(XCredentialsContext);

/** App-only credentials remain available when the user OAuth session is stale. */
export class XAppCredentialsContext extends Context.Service<
  XAppCredentialsContext,
  Effect.Effect<XAppCredentialsService>
>()("X::AppCredentials") {}

export const XAppCredentials: Effect.Effect<
  XAppCredentialsService,
  never,
  XAppCredentialsContext
> = Effect.flatten(XAppCredentialsContext);

/** Provide literal credentials, primarily for tests and explicit integrations. */
export const fromCredentials = (
  credentials: XCredentialsInput,
  options?: XClientOptions,
) =>
  Layer.mergeAll(
    Layer.succeed(
      XCredentialsContext,
      Effect.succeed(make(credentials, options)),
    ),
    Layer.succeed(
      XAppCredentialsContext,
      Effect.succeed(makeApp(credentials, options)),
    ),
  );

/** Resolve the documented X_* environment variables lazily. */
export const fromEnv = (options?: XClientOptions) =>
  Layer.mergeAll(
    Layer.succeed(
      XCredentialsContext,
      readEnvCredentials().pipe(
        Effect.map((credentials) => fromResolved(credentials, options)),
        Effect.orDie,
      ),
    ),
    Layer.succeed(
      XAppCredentialsContext,
      readEnvAppCredentials().pipe(
        Effect.map((credentials) => fromResolvedApp(credentials, options)),
        Effect.orDie,
      ),
    ),
  );

/** Resolve credentials through the configured Alchemy profile lazily. */
export const fromAuthProvider = (
  options?: XClientOptions,
): Layer.Layer<
  XCredentialsContext | XAppCredentialsContext,
  never,
  AlchemyProfile | AuthProviders | CredentialsStore | FileSystem.FileSystem
> =>
  Layer.unwrap(
    Effect.gen(function* () {
      const profile = yield* AlchemyProfile;
      const auth = yield* getAuthProvider<XAuthConfig, XResolvedCredentials>(
        X_AUTH_PROVIDER_NAME,
      );
      const store = yield* CredentialsStore;
      const fs = yield* FileSystem.FileSystem;
      const profileName = yield* ALCHEMY_PROFILE;
      const ci = yield* Config.boolean("CI").pipe(Config.withDefault(false));

      const config = yield* Effect.cached(
        profile.loadOrConfigure(auth, profileName, { ci }),
      );
      const userCredentials = yield* Effect.cached(
        config.pipe(
          Effect.flatMap((value) =>
            auth.read(profileName, value as XAuthConfig),
          ),
          Effect.map((credentials) => fromResolved(credentials, options)),
          Effect.mapError(
            (cause) =>
              new AuthError({
                message: `Failed to resolve X credentials for profile '${profileName}': ${(cause as { message?: string }).message ?? String(cause)}`,
                cause,
              }),
          ),
          Effect.orDie,
        ),
      );
      const appCredentials = yield* Effect.cached(
        config.pipe(
          Effect.flatMap((value) =>
            value.method === "env"
              ? readEnvAppCredentials()
              : repairStoredCredentialPermissionsWith(fs, profileName, [
                  X_OAUTH_APP_STORE_KEY,
                ]).pipe(
                  Effect.flatMap(() =>
                    store.read<unknown>(profileName, X_OAUTH_APP_STORE_KEY),
                  ),
                  Effect.flatMap((stored) =>
                    isStoredOAuthApp(stored)
                      ? Effect.succeed(stored)
                      : Effect.fail(
                          new AuthError({
                            message:
                              "X OAuth app settings not found. Run: alchemy login --configure",
                          }),
                        ),
                  ),
                  Effect.map((stored) => ({
                    appBearerToken: Redacted.make(stored.appBearerToken),
                    consumerSecret: Redacted.make(stored.consumerSecret),
                    clientId: stored.clientId,
                    source: {
                      type: "oauth" as const,
                      details: X_OAUTH_APP_STORE_KEY,
                    },
                  })),
                ),
          ),
          Effect.map((credentials) => fromResolvedApp(credentials, options)),
          Effect.mapError((cause) =>
            cause instanceof AuthError
              ? cause
              : new AuthError({
                  message: `Failed to resolve X app credentials for profile '${profileName}'`,
                  cause,
                }),
          ),
          Effect.orDie,
        ),
      );

      return Layer.mergeAll(
        Layer.succeed(XCredentialsContext, userCredentials),
        Layer.succeed(XAppCredentialsContext, appCredentials),
      );
    }).pipe(Effect.orDie),
  );
