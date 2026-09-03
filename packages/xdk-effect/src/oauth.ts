import * as Crypto from "effect/Crypto";
import * as Effect from "effect/Effect";
import * as Encoding from "effect/Encoding";
import * as Redacted from "effect/Redacted";
import * as HttpClient from "effect/unstable/http/HttpClient";
import * as HttpClientRequest from "effect/unstable/http/HttpClientRequest";
import { XOAuthError, XOAuthStateError } from "./errors.ts";
import type * as Schema from "effect/Schema";

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

export interface OAuth2Config {
  readonly clientId: string;
  readonly clientSecret?: string | Redacted.Redacted<string>;
  readonly authorizationUrl?: string;
  readonly tokenUrl?: string;
  readonly revokeUrl?: string;
}

const isJsonObject = (value: Schema.Json): value is Schema.JsonObject =>
  Object.prototype.toString.call(value) === "[object Object]";

const isJsonString = (value: Schema.Json | undefined): value is string =>
  Object.prototype.toString.call(value) === "[object String]";

const isJsonNumber = (value: Schema.Json | undefined): value is number =>
  Object.prototype.toString.call(value) === "[object Number]" &&
  Number.isFinite(Number(value));

const isSafeErrorField = (
  value: Schema.Json | undefined,
): value is boolean | number | string =>
  Object.prototype.toString.call(value) === "[object Boolean]" ||
  isJsonNumber(value) ||
  isJsonString(value);

const oauthError = (
  body: Schema.Json | undefined,
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
  body: Schema.Json | undefined,
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

const invalidResponse = () =>
  new XOAuthError("invalid_response", "X returned a malformed OAuth response");

/** HttpClient is supplied by the caller; interruption cancels the request. */
const oauthRequest = (
  config: OAuth2Config,
  url: string,
  form: Record<string, string>,
) =>
  Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient;
    let request = HttpClientRequest.post(url).pipe(
      HttpClientRequest.setHeader("Accept", "application/json"),
      HttpClientRequest.bodyUrlParams(
        config.clientSecret === undefined
          ? { ...form, client_id: config.clientId }
          : form,
      ),
    );
    if (config.clientSecret !== undefined) {
      const secret = Redacted.isRedacted(config.clientSecret)
        ? Redacted.value(config.clientSecret)
        : config.clientSecret;
      request = HttpClientRequest.setHeader(
        request,
        "Authorization",
        `Basic ${Encoding.encodeBase64(`${config.clientId}:${secret}`)}`,
      );
    }
    const response = yield* client
      .execute(request)
      .pipe(
        Effect.mapError(
          () => new XOAuthError("network_error", "The X OAuth request failed"),
        ),
      );
    const text = yield* response.text.pipe(Effect.mapError(invalidResponse));
    const body = yield* Effect.try({
      try: (): Schema.Json | undefined =>
        text.trim() ? JSON.parse(text) : undefined,
      catch: invalidResponse,
    });
    if (response.status < 200 || response.status >= 300)
      return yield* Effect.fail(
        oauthError(
          body,
          response.status,
          `X OAuth failed (${response.status})`,
        ),
      );
    return { body, status: response.status };
  });

const tokenRequest = (config: OAuth2Config, form: Record<string, string>) =>
  oauthRequest(config, config.tokenUrl ?? X_OAUTH_TOKEN_URL, form).pipe(
    Effect.flatMap(({ body, status }) =>
      Effect.try({
        try: () => decodeToken(body, status),
        catch: (cause) =>
          cause instanceof XOAuthError ? cause : invalidResponse(),
      }),
    ),
  );

export const createAuthorizationRequest = (
  config: OAuth2Config,
  input: {
    readonly redirectUri: string;
    readonly scopes: readonly string[];
    readonly state?: string;
  },
) =>
  Effect.gen(function* () {
    const crypto = yield* Crypto.Crypto;
    const state =
      input.state ?? Encoding.encodeBase64Url(yield* crypto.randomBytes(32));
    const codeVerifier = Encoding.encodeBase64Url(
      yield* crypto.randomBytes(64),
    );
    const codeChallenge = Encoding.encodeBase64Url(
      yield* crypto.digest("SHA-256", new TextEncoder().encode(codeVerifier)),
    );
    return yield* Effect.try({
      try: (): OAuth2AuthorizationRequest => {
        const url = new URL(config.authorizationUrl ?? X_OAUTH_AUTHORIZE_URL);
        for (const [key, value] of Object.entries({
          response_type: "code",
          client_id: config.clientId,
          redirect_uri: input.redirectUri,
          scope: input.scopes.join(" "),
          state,
          code_challenge: codeChallenge,
          code_challenge_method: "S256",
        }))
          url.searchParams.set(key, value);
        return { url: url.toString(), state, codeVerifier, codeChallenge };
      },
      catch: () =>
        new XOAuthError(
          "invalid_request",
          "Could not create OAuth authorization request",
        ),
    });
  }).pipe(
    Effect.mapError(
      () =>
        new XOAuthError(
          "invalid_request",
          "Could not create OAuth authorization request",
        ),
    ),
  );

export const parseAuthorizationCallback = (
  callback: string | URL,
  expectedState: string,
) =>
  Effect.try({
    try: () => {
      const url = callback instanceof URL ? callback : new URL(callback);
      if (url.searchParams.get("state") !== expectedState)
        throw new XOAuthStateError();
      const error = url.searchParams.get("error");
      if (error)
        throw new XOAuthError(
          error,
          url.searchParams.get("error_description") ??
            "The X OAuth authorization was denied",
        );
      const code = url.searchParams.get("code");
      if (!code)
        throw new XOAuthError(
          "invalid_request",
          "The X OAuth callback did not include an authorization code",
        );
      return { code };
    },
    catch: (cause) =>
      cause instanceof XOAuthError || cause instanceof XOAuthStateError
        ? cause
        : new XOAuthError("invalid_request", "Invalid OAuth callback URL"),
  });

export const exchangeCode = (
  config: OAuth2Config,
  input: {
    readonly code: string;
    readonly codeVerifier: string;
    readonly redirectUri: string;
  },
) =>
  tokenRequest(config, {
    grant_type: "authorization_code",
    code: input.code,
    code_verifier: input.codeVerifier,
    redirect_uri: input.redirectUri,
  });

export const refreshToken = (
  config: OAuth2Config,
  input: { readonly refreshToken: string },
) =>
  tokenRequest(config, {
    grant_type: "refresh_token",
    refresh_token: input.refreshToken,
  });

export const revokeToken = (
  config: OAuth2Config,
  input: { readonly token: string },
) =>
  oauthRequest(config, config.revokeUrl ?? X_OAUTH_REVOKE_URL, {
    token: input.token,
  }).pipe(Effect.asVoid);
