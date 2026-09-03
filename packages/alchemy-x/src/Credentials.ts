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
  DEFAULT_API_BASE_URL,
  Credentials as SdkCredentialsContext,
  oauth1Credentials,
} from "effect-xdk";
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
  readonly apiBaseUrl?: string;
  readonly apiKey: Redacted.Redacted<string>;
  readonly apiSecret: Redacted.Redacted<string>;
  readonly accessToken: Redacted.Redacted<string>;
  readonly accessTokenSecret: Redacted.Redacted<string>;
  readonly source: XCredentialsSource;
}

export interface XCredentialsOptions {
  readonly apiBaseUrl?: string;
}

const toRedacted = (
  value: string | Redacted.Redacted<string>,
): Redacted.Redacted<string> =>
  Redacted.isRedacted(value) ? value : Redacted.make(value);

const make = (
  input: XCredentialsInput,
  options?: XCredentialsOptions,
): XCredentialsService => ({
  apiBaseUrl: options?.apiBaseUrl ?? DEFAULT_API_BASE_URL,
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

/** Supply native SDK operations with Alchemy's same lazy, redacted credentials. */
export const SdkCredentials = Layer.effect(
  SdkCredentialsContext,
  Effect.map(XCredentialsContext, (resolve) =>
    resolve.pipe(Effect.map(oauth1Credentials)),
  ),
);

export const fromCredentials = (
  credentials: XCredentialsInput,
  options?: XCredentialsOptions,
) =>
  SdkCredentials.pipe(
    Layer.provideMerge(
      Layer.succeed(
        XCredentialsContext,
        Effect.succeed(make(credentials, options)),
      ),
    ),
  );

/** Resolve credentials lazily once per layer; the SDK protocol owns token caching. */
export const fromEnv = (options?: XCredentialsOptions) =>
  SdkCredentials.pipe(
    Layer.provideMerge(
      Layer.effect(
        XCredentialsContext,
        Effect.cached(
          readEnvCredentials().pipe(
            Effect.map((credentials) => make(credentials, options)),
            Effect.orDie,
          ),
        ),
      ),
    ),
  );

export const fromAuthProvider = (
  options?: XCredentialsOptions,
): Layer.Layer<
  XCredentialsContext | SdkCredentialsContext,
  never,
  AuthProviders | AlchemyProfile
> =>
  SdkCredentials.pipe(
    Layer.provideMerge(
      Layer.effect(
        XCredentialsContext,
        Effect.gen(function* () {
          const profile = yield* AlchemyProfile;
          const auth = yield* getAuthProvider<
            XAuthConfig,
            XResolvedCredentials
          >(X_AUTH_PROVIDER_NAME);
          const profileName = yield* ALCHEMY_PROFILE;
          const ci = yield* Config.boolean("CI").pipe(
            Config.withDefault(false),
          );
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
      ),
    ),
  );
