import * as Effect from "effect/Effect";
import { XAuthenticationError } from "./errors.ts";
import type { OperationDefinition } from "./operation-types.ts";
import { bytesToBase64, bytesToBase64Url, utf8 } from "./runtime.ts";

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
  platform: {
    readonly crypto: Pick<Crypto, "getRandomValues" | "subtle">;
    readonly now: () => number;
  },
  method: string,
  url: URL,
) =>
  Effect.tryPromise({
    try: async () => {
      if (!("apiKey" in credentials)) {
        throw new XAuthenticationError(
          "X OAuth 1.0a credentials are required for request signing",
        );
      }
      const [apiKey, apiSecret, accessToken, accessTokenSecret] = [
        required(credentials.apiKey, "API key"),
        required(credentials.apiSecret, "API secret"),
        required(credentials.accessToken, "access token"),
        required(credentials.accessTokenSecret, "access token secret"),
      ] as const;
      const oauth = {
        oauth_consumer_key: apiKey,
        oauth_nonce: bytesToBase64Url(
          platform.crypto.getRandomValues(new Uint8Array(32)),
        ),
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: String(Math.floor(platform.now() / 1000)),
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
      const key = await platform.crypto.subtle.importKey(
        "raw",
        utf8(`${encode(apiSecret)}&${encode(accessTokenSecret)}`),
        { name: "HMAC", hash: "SHA-1" },
        false,
        ["sign"],
      );
      const signature = bytesToBase64(
        new Uint8Array(
          await platform.crypto.subtle.sign("HMAC", key, utf8(baseString)),
        ),
      );
      return `OAuth ${Object.entries({ ...oauth, oauth_signature: signature })
        .map(([name, value]) => `${encode(name)}="${encode(value)}"`)
        .join(", ")}`;
    },
    catch: (cause) =>
      cause instanceof XAuthenticationError
        ? cause
        : new XAuthenticationError("X request signing failed", { cause }),
  });
