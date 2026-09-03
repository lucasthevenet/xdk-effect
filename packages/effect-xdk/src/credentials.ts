/**
 * X credentials — hand-written.
 *
 * Like Distilled's Coinbase/Cloudflare packages, Credentials holds an Effect
 * resolved on the calling fiber for every request. Secrets stay Redacted;
 * signing and app-token exchange belong to the protocol, not generated code.
 */
import { ConfigError } from "@distilled.cloud/core/errors";
import * as Config from "effect/Config";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";

export const DEFAULT_API_BASE_URL = "https://api.x.com";

export interface OAuth1Config {
  readonly apiKey: string | Redacted.Redacted<string>;
  readonly apiSecret: string | Redacted.Redacted<string>;
  readonly accessToken: string | Redacted.Redacted<string>;
  readonly accessTokenSecret: string | Redacted.Redacted<string>;
  readonly apiBaseUrl?: string;
}

export interface BearerConfig {
  readonly appBearerToken?: string | Redacted.Redacted<string> | undefined;
  readonly userAccessToken?: string | Redacted.Redacted<string> | undefined;
  readonly apiBaseUrl?: string;
}

export interface OAuth1Credentials {
  readonly type: "oauth1";
  readonly apiKey: Redacted.Redacted<string>;
  readonly apiSecret: Redacted.Redacted<string>;
  readonly accessToken: Redacted.Redacted<string>;
  readonly accessTokenSecret: Redacted.Redacted<string>;
  readonly apiBaseUrl: string;
}

export interface BearerCredentials {
  readonly type: "bearer";
  readonly appBearerToken?: Redacted.Redacted<string> | undefined;
  readonly userAccessToken?: Redacted.Redacted<string> | undefined;
  readonly apiBaseUrl: string;
}

export type ResolvedCredentials = OAuth1Credentials | BearerCredentials;

export class Credentials extends Context.Service<
  Credentials,
  Effect.Effect<ResolvedCredentials, ConfigError>
>()("XCredentials") {}

const redacted = (value: string | Redacted.Redacted<string>) =>
  Redacted.isRedacted(value) ? value : Redacted.make(value);

export const oauth1Credentials = (config: OAuth1Config): OAuth1Credentials => ({
  type: "oauth1",
  apiKey: redacted(config.apiKey),
  apiSecret: redacted(config.apiSecret),
  accessToken: redacted(config.accessToken),
  accessTokenSecret: redacted(config.accessTokenSecret),
  apiBaseUrl: config.apiBaseUrl ?? DEFAULT_API_BASE_URL,
});

export const bearerCredentials = (config: BearerConfig): BearerCredentials => {
  return {
    type: "bearer",
    apiBaseUrl: config.apiBaseUrl ?? DEFAULT_API_BASE_URL,
    appBearerToken:
      config.appBearerToken === undefined
        ? undefined
        : redacted(config.appBearerToken),
    userAccessToken:
      config.userAccessToken === undefined
        ? undefined
        : redacted(config.userAccessToken),
  };
};

export const fromOAuth1 = (config: OAuth1Config): Layer.Layer<Credentials> =>
  Layer.succeed(Credentials, Effect.succeed(oauth1Credentials(config)));

export const fromBearer = (config: BearerConfig): Layer.Layer<Credentials> =>
  Layer.succeed(Credentials, Effect.succeed(bearerCredentials(config)));

/** Resolve OAuth1 credentials from environment configuration. */
export const resolveFromEnv = Config.all({
  apiKey: Config.redacted("X_API_KEY"),
  apiSecret: Config.redacted("X_API_SECRET"),
  accessToken: Config.redacted("X_ACCESS_TOKEN"),
  accessTokenSecret: Config.redacted("X_ACCESS_TOKEN_SECRET"),
  apiBaseUrl: Config.string("X_API_BASE_URL").pipe(
    Config.withDefault(DEFAULT_API_BASE_URL),
  ),
}).pipe(
  Effect.map(oauth1Credentials),
  Effect.mapError(
    () =>
      new ConfigError({
        message:
          "X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, and X_ACCESS_TOKEN_SECRET are required",
      }),
  ),
);

export const fromEnv = (): Layer.Layer<Credentials> =>
  Layer.succeed(Credentials, resolveFromEnv);

export const CredentialsFromEnv = fromEnv();
