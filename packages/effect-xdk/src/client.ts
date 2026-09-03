import type * as API from "@distilled.cloud/core/api";
import * as BrowserCrypto from "@effect/platform-browser/BrowserCrypto";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import type * as Redacted from "effect/Redacted";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import * as HttpClient from "effect/unstable/http/HttpClient";
// oxlint-disable-next-line anti-slop-effect/no-service-constructor-imports -- Binds generated functions for the public client constructor, not an Effect service.
import { makeApi, type Api } from "./api.ts";
import {
  Credentials,
  DEFAULT_API_BASE_URL,
  oauth1Credentials,
  bearerCredentials,
  type OAuth1Config,
} from "./credentials.ts";
import * as Hmac from "./hmac.ts";
import type { XOpContext } from "./protocol.ts";

type Secret = string | Redacted.Redacted<string>;

export type ClientConfig = {
  readonly baseUrl?: string;
  /** Optional transport override, including for tests. */
  readonly httpClient?: HttpClient.HttpClient;
} & (
  | {
      readonly oauth1: Omit<OAuth1Config, "apiBaseUrl">;
      readonly bearerToken?: never;
      readonly accessToken?: never;
    }
  | {
      readonly oauth1?: never;
      readonly bearerToken: Secret;
      readonly accessToken?: Secret;
    }
  | {
      readonly oauth1?: never;
      readonly bearerToken?: Secret;
      readonly accessToken: Secret;
    }
);

/** @internal Used by the generated client groups. */
export interface BindOperation {
  <I, O, E>(
    operation: API.OperationMethod<I, O, E, XOpContext>,
  ): (input: I) => Effect.Effect<O, E>;
}

export interface Client {
  readonly Api: Api;
}

/** Configure a client without performing network I/O. Methods return lazy Effects. */
export const Client = (config: ClientConfig): Client => {
  const resolver = Effect.succeed(
    config.oauth1 !== undefined
      ? oauth1Credentials({
          ...config.oauth1,
          apiBaseUrl: config.baseUrl ?? DEFAULT_API_BASE_URL,
        })
      : bearerCredentials({
          appBearerToken: config.bearerToken,
          userAccessToken: config.accessToken,
          apiBaseUrl: config.baseUrl ?? DEFAULT_API_BASE_URL,
        }),
  );
  const http = config.httpClient;
  const defaults = Layer.mergeAll(
    Layer.succeed(Credentials, resolver),
    FetchHttpClient.layer,
    BrowserCrypto.layer,
    Hmac.layerSubtle,
  );
  let cached: Context.Context<XOpContext> | undefined;
  const context = Effect.suspend(() =>
    cached === undefined
      ? // These built-in layers own no resources. Retain their values, not a scope
        // or background runtime, so app-token caching has stable client identity.
        Effect.scoped(Layer.build(defaults)).pipe(
          Effect.map((services) => {
            cached = services;
            return services;
          }),
        )
      : Effect.succeed(cached),
  );
  const bind: BindOperation = (operation) => (input) =>
    Effect.flatMap(context, (services) => {
      const configured =
        http === undefined
          ? services
          : Context.add(services, HttpClient.HttpClient, http);
      return Effect.provide(operation(input), configured);
    });
  return { Api: makeApi(bind) };
};
