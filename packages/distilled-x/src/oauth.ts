import { XOAuthError, XOAuthStateError } from "./errors.ts";
import {
  bytesToBase64,
  bytesToBase64Url,
  resolveToken,
  runtime,
  type TokenProvider,
  type XRuntimeOptions,
  utf8,
} from "./runtime.ts";
import type { XJsonObject, XJsonValue } from "./types.ts";

export const X_OAUTH_AUTHORIZE_URL = "https://x.com/i/oauth2/authorize";
export const X_OAUTH_TOKEN_URL = "https://api.x.com/2/oauth2/token";
export const X_OAUTH_REVOKE_URL = "https://api.x.com/2/oauth2/revoke";

export interface OAuth2Token {
  readonly access_token: string;
  readonly token_type: string;
  readonly expires_in: number;
  readonly scope?: string;
  readonly refresh_token?: string;
}

export interface OAuth2AuthorizationRequest {
  readonly url: string;
  readonly state: string;
  readonly codeVerifier: string;
  readonly codeChallenge: string;
}

export interface OAuth2AuthorizationCallback {
  readonly code: string;
}

export interface OAuth2ClientConfig {
  readonly clientId: string;
  readonly clientSecret?: TokenProvider;
  readonly authorizationUrl?: string;
  readonly tokenUrl?: string;
  readonly revokeUrl?: string;
  readonly runtime?: XRuntimeOptions;
}

const randomBytes = (
  count: number,
  crypto: Pick<Crypto, "getRandomValues">,
): Uint8Array => crypto.getRandomValues(new Uint8Array(count));

const isJsonObject = (value: XJsonValue): value is XJsonObject =>
  Object.prototype.toString.call(value) === "[object Object]";

const isJsonString = (value: XJsonValue | undefined): value is string =>
  Object.prototype.toString.call(value) === "[object String]";

const isJsonNumber = (value: XJsonValue | undefined): value is number =>
  Object.prototype.toString.call(value) === "[object Number]" &&
  Number.isFinite(Number(value));

const isSafeErrorField = (
  value: XJsonValue | undefined,
): value is boolean | number | string =>
  Object.prototype.toString.call(value) === "[object Boolean]" ||
  isJsonNumber(value) ||
  isJsonString(value);

const parseJson = async (
  response: Response,
): Promise<XJsonValue | undefined> => {
  const text = await response.text();
  if (!text) return undefined;
  try {
    // SAFETY: JSON.parse only returns values admitted by the recursive JSON
    // contract when parsing succeeds; functions, symbols, and undefined cannot
    // be represented by JSON text.
    return JSON.parse(text) as XJsonValue;
  } catch {
    return text;
  }
};

const oauthError = (
  body: XJsonValue | undefined,
  status: number,
  fallback: string,
): XOAuthError => {
  const value = body !== undefined && isJsonObject(body) ? body : undefined;
  const error = isJsonString(value?.error) ? value.error : "oauth_error";
  const description = isJsonString(value?.error_description)
    ? value.error_description
    : isJsonString(value?.detail)
      ? value.detail
      : fallback;
  const safeBody: Record<string, boolean | number | string> = {};
  if (value) {
    for (const key of [
      "error",
      "error_description",
      "detail",
      "title",
      "type",
      "status",
    ]) {
      const field = value[key];
      if (isSafeErrorField(field)) safeBody[key] = field;
    }
  }
  return new XOAuthError(
    error,
    description,
    status,
    value ? safeBody : undefined,
  );
};

const decodeToken = (
  body: XJsonValue | undefined,
  status: number,
): OAuth2Token => {
  if (body === undefined || !isJsonObject(body)) {
    throw new XOAuthError(
      "invalid_response",
      "X returned a malformed OAuth token response",
      status,
      undefined,
    );
  }
  if (
    !isJsonString(body.access_token) ||
    !isJsonString(body.token_type) ||
    !isJsonNumber(body.expires_in)
  ) {
    throw oauthError(body, status, "X returned an incomplete OAuth token");
  }
  const token: OAuth2Token = {
    access_token: body.access_token,
    token_type: body.token_type,
    expires_in: body.expires_in,
  };
  const scope = isJsonString(body.scope) ? body.scope : undefined;
  const refreshToken = isJsonString(body.refresh_token)
    ? body.refresh_token
    : undefined;
  if (scope !== undefined && refreshToken !== undefined) {
    return { ...token, scope, refresh_token: refreshToken };
  }
  if (scope !== undefined) return { ...token, scope };
  if (refreshToken !== undefined) {
    return { ...token, refresh_token: refreshToken };
  }
  return token;
};

export const createOAuth2Client = (config: OAuth2ClientConfig) => {
  const platform = runtime(config.runtime);
  const authorizationUrl = config.authorizationUrl ?? X_OAUTH_AUTHORIZE_URL;
  const tokenUrl = config.tokenUrl ?? X_OAUTH_TOKEN_URL;
  const revokeUrl = config.revokeUrl ?? X_OAUTH_REVOKE_URL;
  const clientSecretProvider = config.clientSecret;
  const confidential = clientSecretProvider !== undefined;

  const tokenRequest = async (form: Record<string, string>) => {
    const headers = new Headers({
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    });
    if (clientSecretProvider !== undefined) {
      const clientSecret = await resolveToken(clientSecretProvider);
      headers.set(
        "Authorization",
        `Basic ${bytesToBase64(utf8(`${config.clientId}:${clientSecret}`))}`,
      );
    }

    let response: Response;
    try {
      response = await platform.fetch(tokenUrl, {
        method: "POST",
        headers,
        body: new URLSearchParams(
          confidential
            ? Object.fromEntries(
                Object.entries(form).filter(([key]) => key !== "client_id"),
              )
            : form,
        ).toString(),
      });
    } catch {
      throw new XOAuthError(
        "network_error",
        "The X OAuth token request failed",
        undefined,
        undefined,
      );
    }
    const body = await parseJson(response);
    if (!response.ok) {
      throw oauthError(
        body,
        response.status,
        `X OAuth failed (${response.status})`,
      );
    }
    return decodeToken(body, response.status);
  };

  return {
    async createAuthorizationRequest(input: {
      readonly redirectUri: string;
      readonly scopes: readonly string[];
      readonly state?: string;
    }): Promise<OAuth2AuthorizationRequest> {
      const state =
        input.state ?? bytesToBase64Url(randomBytes(32, platform.crypto));
      const codeVerifier = bytesToBase64Url(randomBytes(64, platform.crypto));
      const digest = await platform.crypto.subtle.digest(
        "SHA-256",
        utf8(codeVerifier),
      );
      const codeChallenge = bytesToBase64Url(new Uint8Array(digest));
      const url = new URL(authorizationUrl);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("client_id", config.clientId);
      url.searchParams.set("redirect_uri", input.redirectUri);
      url.searchParams.set("scope", input.scopes.join(" "));
      url.searchParams.set("state", state);
      url.searchParams.set("code_challenge", codeChallenge);
      url.searchParams.set("code_challenge_method", "S256");
      return {
        url: url.toString(),
        state,
        codeVerifier,
        codeChallenge,
      };
    },

    parseAuthorizationCallback(
      callback: string | URL,
      expectedState: string,
    ): OAuth2AuthorizationCallback {
      const url = callback instanceof URL ? callback : new URL(callback);
      const state = url.searchParams.get("state");
      if (state !== expectedState) throw new XOAuthStateError();
      const error = url.searchParams.get("error");
      if (error) {
        throw new XOAuthError(
          error,
          url.searchParams.get("error_description") ??
            "The X OAuth authorization was denied",
        );
      }
      const code = url.searchParams.get("code");
      if (!code) {
        throw new XOAuthError(
          "invalid_request",
          "The X OAuth callback did not include an authorization code",
        );
      }
      return { code };
    },

    exchangeCode(input: {
      readonly code: string;
      readonly codeVerifier: string;
      readonly redirectUri: string;
    }): Promise<OAuth2Token> {
      return tokenRequest({
        grant_type: "authorization_code",
        code: input.code,
        code_verifier: input.codeVerifier,
        client_id: config.clientId,
        redirect_uri: input.redirectUri,
      });
    },

    refreshToken(input: {
      readonly refreshToken: string;
    }): Promise<OAuth2Token> {
      return tokenRequest({
        grant_type: "refresh_token",
        refresh_token: input.refreshToken,
        client_id: config.clientId,
      });
    },

    async revokeToken(input: { readonly token: string }): Promise<void> {
      const headers = new Headers({
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      });
      if (config.clientSecret) {
        const secret = await resolveToken(config.clientSecret);
        headers.set(
          "Authorization",
          `Basic ${bytesToBase64(utf8(`${config.clientId}:${secret}`))}`,
        );
      }
      const response = await platform.fetch(revokeUrl, {
        method: "POST",
        headers,
        body: (() => {
          const form = new URLSearchParams({ token: input.token });
          if (!confidential) form.set("client_id", config.clientId);
          return form.toString();
        })(),
      });
      const body = await parseJson(response);
      if (!response.ok) {
        throw oauthError(
          body,
          response.status,
          `X OAuth revoke failed (${response.status})`,
        );
      }
    },
  };
};

export type OAuth2Client = ReturnType<typeof createOAuth2Client>;
