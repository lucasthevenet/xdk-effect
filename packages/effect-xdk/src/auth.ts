import * as Crypto from "effect/Crypto";
import * as Clock from "effect/Clock";
import * as Effect from "effect/Effect";
import * as Encoding from "effect/Encoding";
import { XAuthenticationError } from "./errors.ts";
import { Hmac } from "./hmac.ts";
import type { OperationDefinition } from "./operation-types.ts";

/** One credential set for user signing and internal app-token exchange. */
export interface XCredentials {
  readonly apiKey: string;
  readonly apiSecret: string;
  readonly accessToken: string;
  readonly accessTokenSecret: string;
}

/** Pre-issued app-only and/or OAuth2 user tokens, resolved by the credential Effect. */
export interface XBearerCredentials {
  readonly appBearerToken?: string;
  readonly userAccessToken?: string;
}

export type XAuthentication = XCredentials | XBearerCredentials;

/** Select only authentication schemes declared by this operation's spec. */
export const selectAuthentication = (
  credentials: XAuthentication,
  security: OperationDefinition["security"],
  preferred?: "app" | "user",
): "app" | "user" | undefined => {
  if (security.length === 0) return undefined;
  const oauth1 = "apiKey" in credentials;
  const app =
    security.includes("app") &&
    (oauth1 || credentials.appBearerToken !== undefined);
  const user = oauth1
    ? security.includes("oauth1")
    : security.includes("oauth2") && credentials.userAccessToken !== undefined;
  if (preferred !== "user" && app) return "app";
  if (preferred !== "app" && user) return "user";
  throw new XAuthenticationError(
    `This X operation requires ${security.join(" or ")} credentials${preferred ? ` in ${preferred} context` : ""}`,
  );
};

const encode = (value: string): string =>
  encodeURIComponent(value).replace(
    /[!'()*]/gu,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );

const required = (value: string, name: string): string => {
  if (!value.trim())
    throw new XAuthenticationError(`X ${name} must not be empty`);
  return value;
};

/** Internal OAuth1 signing primitive used by the Effect protocol. */
export const signOAuth1 = (
  credentials: XAuthentication,
  method: string,
  url: URL,
) =>
  Effect.gen(function* () {
    const [apiKey, apiSecret, accessToken, accessTokenSecret] =
      yield* Effect.try({
        try: () => {
          if (!("apiKey" in credentials)) {
            throw new XAuthenticationError(
              "X OAuth 1.0a credentials are required for request signing",
            );
          }
          return [
            required(credentials.apiKey, "API key"),
            required(credentials.apiSecret, "API secret"),
            required(credentials.accessToken, "access token"),
            required(credentials.accessTokenSecret, "access token secret"),
          ] as const;
        },
        catch: (cause) =>
          cause instanceof XAuthenticationError
            ? cause
            : new XAuthenticationError("Invalid X credentials", { cause }),
      });
    const crypto = yield* Crypto.Crypto;
    const nonce = yield* crypto.randomBytes(32);
    const now = yield* Clock.currentTimeMillis;
    const oauth = {
      oauth_consumer_key: apiKey,
      oauth_nonce: Encoding.encodeBase64Url(nonce),
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: String(Math.floor(now / 1000)),
      oauth_token: accessToken,
      oauth_version: "1.0",
    };
    // Neither JSON nor multipart bodies contribute OAuth1 signature parameters.
    const parameters = [...url.searchParams, ...Object.entries(oauth)]
      .filter(([key]) => key !== "oauth_signature")
      .map(([key, value]) => [encode(key), encode(value)] as const)
      .toSorted(([ak, av], [bk, bv]) =>
        ak < bk ? -1 : ak > bk ? 1 : av < bv ? -1 : av > bv ? 1 : 0,
      )
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    const baseString = [
      method.toUpperCase(),
      `${url.origin}${url.pathname}`,
      parameters,
    ]
      .map(encode)
      .join("&");
    const hmac = yield* Hmac;
    const signature = Encoding.encodeBase64(
      yield* hmac.sign({
        hash: "SHA-1",
        key: new TextEncoder().encode(`${encode(apiSecret)}&${encode(accessTokenSecret)}`),
        data: new TextEncoder().encode(baseString),
      }),
    );
    return `OAuth ${Object.entries({ ...oauth, oauth_signature: signature })
      .map(([name, value]) => `${encode(name)}="${encode(value)}"`)
      .join(", ")}`;
  }).pipe(
    Effect.mapError((cause) =>
      cause instanceof XAuthenticationError
        ? cause
        : new XAuthenticationError("X request signing failed", { cause }),
    ),
  );
