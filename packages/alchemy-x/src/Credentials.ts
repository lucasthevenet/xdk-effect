import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import {
  AuthError,
  AuthProviders,
  getAuthProvider,
} from "alchemy/Auth/AuthProvider";
import { ALCHEMY_PROFILE } from "alchemy/Auth/Profile";
import {
  createXClient as createDistilledXClient,
  type XClient,
  type XClientConfig,
} from "distilled-x";
import {
  readEnvAppCredentials,
  X_AUTH_PROVIDER_NAME,
  type XAuthConfig,
  type XResolvedAppCredentials,
  type XResolvedCredentials,
  readEnvCredentials,
} from "./AuthEnvironment.ts";

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

interface XCredentialsServiceBuilder {
  client: XClient;
  appBearerToken: Redacted.Redacted<string>;
  userAccessToken: Redacted.Redacted<string>;
  consumerSecret: Redacted.Redacted<string>;
  userId?: string;
  clientId?: string;
  oauthScopes?: readonly string[];
  source: XCredentialsSource;
}

interface XCredentialsInputBuilder {
  appBearerToken: string | Redacted.Redacted<string>;
  userAccessToken: string | Redacted.Redacted<string>;
  consumerSecret: string | Redacted.Redacted<string>;
  userId?: string;
  clientId?: string;
  oauthScopes?: readonly string[];
  source?: XCredentialsSource;
}

interface XAppCredentialsServiceBuilder {
  client: XClient;
  appBearerToken: Redacted.Redacted<string>;
  consumerSecret: Redacted.Redacted<string>;
  clientId?: string;
  source: XCredentialsSource;
}

interface XAppCredentialsInputBuilder {
  appBearerToken: string | Redacted.Redacted<string>;
  consumerSecret: string | Redacted.Redacted<string>;
  clientId?: string;
  source?: XCredentialsSource;
}

const toRedacted = (
  value: string | Redacted.Redacted<string>,
): Redacted.Redacted<string> =>
  Redacted.isRedacted(value) ? value : Redacted.make(value);

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
  const credentials: XCredentialsServiceBuilder = {
    client: createXClient({ appBearerToken, userAccessToken }, options),
    appBearerToken,
    userAccessToken,
    consumerSecret,
    source: input.source ?? { type: "credentials" },
  };
  if (input.userId !== undefined) credentials.userId = input.userId;
  if (input.clientId !== undefined) credentials.clientId = input.clientId;
  if (input.oauthScopes !== undefined) {
    credentials.oauthScopes = input.oauthScopes;
  }
  return credentials;
};

const fromResolved = (
  credentials: XResolvedCredentials,
  options?: XClientOptions,
): XCredentialsService => {
  const input: XCredentialsInputBuilder = {
    appBearerToken: credentials.appBearerToken,
    userAccessToken: credentials.userAccessToken,
    consumerSecret: credentials.consumerSecret,
    source: credentials.source,
  };
  if (credentials.userId !== undefined) input.userId = credentials.userId;
  if (credentials.clientId !== undefined) input.clientId = credentials.clientId;
  if (credentials.oauthScopes !== undefined) {
    input.oauthScopes = credentials.oauthScopes;
  }
  return make(input, options);
};

const makeApp = (
  input: XAppCredentialsInput,
  options?: XClientOptions,
): XAppCredentialsService => {
  const appBearerToken = toRedacted(input.appBearerToken);
  const consumerSecret = toRedacted(input.consumerSecret);
  const credentials: XAppCredentialsServiceBuilder = {
    client: createAppClient({ appBearerToken }, options),
    appBearerToken,
    consumerSecret,
    source: input.source ?? { type: "credentials" },
  };
  if (input.clientId !== undefined) credentials.clientId = input.clientId;
  return credentials;
};

const fromResolvedApp = (
  credentials: XResolvedAppCredentials,
  options?: XClientOptions,
): XAppCredentialsService => {
  const input: XAppCredentialsInputBuilder = {
    appBearerToken: credentials.appBearerToken,
    consumerSecret: credentials.consumerSecret,
    source: credentials.source,
  };
  if (credentials.clientId !== undefined) input.clientId = credentials.clientId;
  return makeApp(input, options);
};

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

/** App-only credentials remain available when the user access token is stale. */
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

/** Resolve environment credentials through the registered AuthProvider lazily. */
export const fromAuthProvider = (
  options?: XClientOptions,
): Layer.Layer<
  XCredentialsContext | XAppCredentialsContext,
  never,
  AuthProviders
> =>
  Layer.unwrap(
    Effect.gen(function* () {
      const auth = yield* getAuthProvider<XAuthConfig, XResolvedCredentials>(
        X_AUTH_PROVIDER_NAME,
      );
      const profileName = yield* ALCHEMY_PROFILE;
      const userCredentials = yield* Effect.cached(
        Effect.suspend(() => auth.read(profileName, { method: "env" })).pipe(
          Effect.map((credentials) => fromResolved(credentials, options)),
          Effect.mapError(
            (cause) =>
              new AuthError({
                message: `Failed to resolve X credentials for profile '${profileName}': ${cause instanceof Error ? cause.message : String(cause)}`,
                cause,
              }),
          ),
          Effect.orDie,
        ),
      );
      const appCredentials = yield* Effect.cached(
        readEnvAppCredentials().pipe(
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
