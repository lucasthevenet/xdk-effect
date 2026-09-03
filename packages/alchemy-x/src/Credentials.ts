import * as Config from "effect/Config";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import {
  AuthError,
  AuthProviders,
  getAuthProvider,
} from "alchemy/Auth/AuthProvider";
import { ALCHEMY_PROFILE, AlchemyProfile } from "alchemy/Auth/Profile";
import {
  createXClient as createDistilledXClient,
  type XClient,
  type XClientOptions,
} from "distilled-x";
import {
  readEnvCredentials,
  X_AUTH_PROVIDER_NAME,
  type XAuthConfig,
  type XResolvedCredentials,
} from "./AuthEnvironment.ts";

export type XCredentialsSource =
  | XResolvedCredentials["source"]
  | { readonly type: "credentials"; readonly details?: string };

export interface XCredentialsInput {
  readonly apiKey: string | Redacted.Redacted<string>;
  readonly apiSecret: string | Redacted.Redacted<string>;
  readonly accessToken: string | Redacted.Redacted<string>;
  readonly accessTokenSecret: string | Redacted.Redacted<string>;
  readonly source?: XCredentialsSource;
}

export interface XCredentialsService {
  readonly client: XClient;
  readonly apiKey: Redacted.Redacted<string>;
  readonly apiSecret: Redacted.Redacted<string>;
  readonly accessToken: Redacted.Redacted<string>;
  readonly accessTokenSecret: Redacted.Redacted<string>;
  readonly source: XCredentialsSource;
}

export type { XClientOptions } from "distilled-x";

const toRedacted = (
  value: string | Redacted.Redacted<string>,
): Redacted.Redacted<string> =>
  Redacted.isRedacted(value) ? value : Redacted.make(value);

/** Both request authentication modes are handled internally by distilled-x. */
export const createXClient = (
  credentials: XCredentialsInput,
  options: XClientOptions = {},
): XClient => {
  const apiKey = toRedacted(credentials.apiKey);
  const apiSecret = toRedacted(credentials.apiSecret);
  const accessToken = toRedacted(credentials.accessToken);
  const accessTokenSecret = toRedacted(credentials.accessTokenSecret);
  return createDistilledXClient({
    ...options,
    apiKey: () => Redacted.value(apiKey),
    apiSecret: () => Redacted.value(apiSecret),
    accessToken: () => Redacted.value(accessToken),
    accessTokenSecret: () => Redacted.value(accessTokenSecret),
  });
};

const make = (
  input: XCredentialsInput,
  options?: XClientOptions,
): XCredentialsService => ({
  client: createXClient(input, options),
  apiKey: toRedacted(input.apiKey),
  apiSecret: toRedacted(input.apiSecret),
  accessToken: toRedacted(input.accessToken),
  accessTokenSecret: toRedacted(input.accessTokenSecret),
  source: input.source ?? { type: "credentials" },
});

/** Lazy so registering provider layers for `alchemy login` never reads credentials. */
export class XCredentialsContext extends Context.Service<
  XCredentialsContext,
  Effect.Effect<XCredentialsService>
>()("X::Credentials") {}

export const XCredentials: Effect.Effect<
  XCredentialsService,
  never,
  XCredentialsContext
> = Effect.flatten(XCredentialsContext);

export const fromCredentials = (
  credentials: XCredentialsInput,
  options?: XClientOptions,
) =>
  Layer.succeed(
    XCredentialsContext,
    Effect.succeed(make(credentials, options)),
  );

/** Cache the client as well as credentials so resources share its app token. */
export const fromEnv = (options?: XClientOptions) =>
  Layer.effect(
    XCredentialsContext,
    Effect.cached(
      readEnvCredentials().pipe(
        Effect.map((credentials) => make(credentials, options)),
        Effect.orDie,
      ),
    ),
  );

export const fromAuthProvider = (
  options?: XClientOptions,
): Layer.Layer<XCredentialsContext, never, AuthProviders | AlchemyProfile> =>
  Layer.effect(
    XCredentialsContext,
    Effect.gen(function* () {
      const profile = yield* AlchemyProfile;
      const auth = yield* getAuthProvider<XAuthConfig, XResolvedCredentials>(
        X_AUTH_PROVIDER_NAME,
      );
      const profileName = yield* ALCHEMY_PROFILE;
      const ci = yield* Config.boolean("CI").pipe(Config.withDefault(false));
      return yield* Effect.cached(
        profile.loadOrConfigure(auth, profileName, { ci }).pipe(
          Effect.flatMap((selected) => auth.read(profileName, selected)),
          Effect.map((credentials) => make(credentials, options)),
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
    }).pipe(Effect.orDie),
  );
