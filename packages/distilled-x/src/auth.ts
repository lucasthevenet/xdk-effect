import { XAuthenticationError, XTransportError } from "./errors.ts";
import type { XJsonObject, XJsonValue } from "./types.ts";
import {
  bytesToBase64,
  bytesToBase64Url,
  resolveToken,
  utf8,
  type TokenProvider,
  type XRuntime,
} from "./runtime.ts";

/** One credential set for user signing and internal app-token exchange. */
export interface XCredentials {
  readonly apiKey: TokenProvider;
  readonly apiSecret: TokenProvider;
  readonly accessToken: TokenProvider;
  readonly accessTokenSecret: TokenProvider;
}

/** Pre-issued app-only and/or OAuth2 user tokens, including token providers. */
export interface XBearerCredentials {
  readonly appBearerToken?: TokenProvider;
  readonly userAccessToken?: TokenProvider;
}

export type XAuthentication = XCredentials | XBearerCredentials;

const encode = (value: string): string =>
  encodeURIComponent(value).replace(
    /[!'()*]/gu,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );

const required = async (
  value: TokenProvider,
  name: string,
): Promise<string> => {
  const resolved = await resolveToken(value);
  if (resolved.trim().length === 0) {
    throw new XAuthenticationError(`X ${name} must not be empty`);
  }
  return resolved;
};

// A caller can cancel its wait without cancelling the shared token exchange.
const withSignal = <T>(
  promise: Promise<T>,
  signal?: AbortSignal,
): Promise<T> => {
  if (!signal) return promise;
  return new Promise((resolve, reject) => {
    const aborted = () => reject(signal.reason);
    if (signal.aborted) aborted();
    else signal.addEventListener("abort", aborted, { once: true });
    promise.then(
      (value) => {
        signal.removeEventListener("abort", aborted);
        resolve(value);
      },
      (error) => {
        signal.removeEventListener("abort", aborted);
        reject(error);
      },
    );
  });
};

interface AppToken {
  readonly key: string;
  readonly secret: string;
  readonly promise: Promise<string>;
  token?: string;
}

interface TokenResponse extends XJsonObject {
  readonly token_type: "bearer";
  readonly access_token: string;
}

const isTokenResponse = (body: XJsonValue): body is TokenResponse =>
  body !== null &&
  typeof body === "object" &&
  "token_type" in body &&
  body.token_type === "bearer" &&
  "access_token" in body &&
  typeof body.access_token === "string" &&
  body.access_token.trim().length > 0;

/** Internal auth state is scoped to a client, never shared across apps. */
export const createAuthentication = (
  credentials: XAuthentication,
  platform: XRuntime,
  origin: string,
) => {
  let cached: AppToken | undefined;

  const exchange = async (key: string, secret: string): Promise<string> => {
    const url = new URL("/oauth2/token", origin);
    let response: Response;
    try {
      response = await platform.fetch(url, {
        method: "POST",
        redirect: "error",
        headers: {
          Authorization: `Basic ${bytesToBase64(utf8(`${encode(key)}:${encode(secret)}`))}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Accept: "application/json",
        },
        body: "grant_type=client_credentials",
      });
    } catch (cause) {
      throw new XTransportError(
        "The X app-only token exchange could not be completed",
        "POST",
        url.toString(),
        { cause },
      );
    }
    // Never expose a token response body in exceptions or logs.
    if (!response.ok) {
      await response.body?.cancel();
      throw new XAuthenticationError(
        `X app-only token exchange failed (HTTP ${response.status}). Check the API key and secret.`,
      );
    }
    let body: XJsonValue;
    try {
      body = await response.json();
    } catch {
      throw new XAuthenticationError(
        "X returned a malformed app-only token response",
      );
    }
    if (!isTokenResponse(body)) {
      throw new XAuthenticationError(
        "X returned a malformed app-only token response",
      );
    }
    return body.access_token;
  };

  const appToken = async (signal?: AbortSignal): Promise<string> => {
    if (!("apiKey" in credentials)) {
      throw new XAuthenticationError(
        "X API key and secret are required for app-token exchange",
      );
    }
    const [key, secret] = await Promise.all([
      required(credentials.apiKey, "API key"),
      required(credentials.apiSecret, "API secret"),
    ]);
    signal?.throwIfAborted();
    if (!cached || cached.key !== key || cached.secret !== secret) {
      const entry: AppToken = { key, secret, promise: exchange(key, secret) };
      cached = entry;
      // Clear failures so a later request can recover. Old exchanges must not
      // overwrite newer credentials when a token provider rotates its values.
      entry.promise.then(
        (token) => {
          entry.token = token;
        },
        () => {
          if (cached === entry) cached = undefined;
        },
      );
    }
    return withSignal(cached.promise, signal);
  };

  const sign = async (method: string, url: URL): Promise<string> => {
    if (!("apiKey" in credentials)) {
      throw new XAuthenticationError(
        "X OAuth 1.0a credentials are required for request signing",
      );
    }
    const [apiKey, apiSecret, accessToken, accessTokenSecret] =
      await Promise.all([
        required(credentials.apiKey, "API key"),
        required(credentials.apiSecret, "API secret"),
        required(credentials.accessToken, "access token"),
        required(credentials.accessTokenSecret, "access token secret"),
      ]);
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
    // JSON request bodies are not OAuth1 signature parameters. The client only
    // accepts JSON bodies, so query and OAuth header parameters are sufficient.
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
  };

  return {
    async authorize(
      kind: "app" | "user",
      method: string,
      url: URL,
      signal?: AbortSignal,
    ) {
      signal?.throwIfAborted();
      let header: string;
      if ("apiKey" in credentials) {
        header =
          kind === "app"
            ? `Bearer ${await appToken(signal)}`
            : await sign(method, url);
      } else {
        const provider =
          kind === "app"
            ? credentials.appBearerToken
            : credentials.userAccessToken;
        if (provider === undefined) {
          throw new XAuthenticationError(
            `${kind === "app" ? "App-only" : "User-context"} X credentials are required for this operation`,
          );
        }
        header = `Bearer ${await required(provider, `${kind} token`)}`;
      }
      signal?.throwIfAborted();
      return header;
    },
    invalidate(authorization: string) {
      if (
        cached?.token !== undefined &&
        authorization === `Bearer ${cached.token}`
      ) {
        cached = undefined;
        return true;
      }
      return false;
    },
  };
};
