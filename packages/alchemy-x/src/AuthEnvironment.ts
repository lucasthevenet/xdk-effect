import * as Clock from "effect/Clock";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import { AuthError } from "alchemy/Auth/AuthProvider";
import { getEnv, getEnvRedactedRequired } from "alchemy/Auth/Env";

/** Canonical key used by Alchemy's AuthProvider registry. */
export const X_AUTH_PROVIDER_NAME = "X";

/** CredentialsStore key containing OAuth application configuration. */
export const X_OAUTH_APP_STORE_KEY = "x-oauth-app";

/** CredentialsStore key containing the user's rotating OAuth tokens. */
export const X_OAUTH_TOKENS_STORE_KEY = "x-oauth-tokens";

/** Default callback URI to register in the X developer portal. */
export const X_OAUTH_DEFAULT_REDIRECT_URI =
  "http://127.0.0.1:9976/auth/callback";

export const X_OAUTH_DEFAULT_SCOPES = [
  "tweet.read",
  "users.read",
  "dm.read",
  "dm.write",
  "offline.access",
] as const;

export const X_TOKEN_REFRESH_WINDOW_MS = 60_000;

/**
 * The only X data stored in `~/.alchemy/profiles.json`.
 * Secrets and OAuth application configuration live in CredentialsStore.
 */
export type XAuthConfig = { method: "env" } | { method: "oauth" };

export interface XStoredOAuthApp {
  readonly type: "x-oauth-app";
  readonly clientId: string;
  readonly clientSecret?: string;
  readonly appBearerToken: string;
  readonly consumerSecret: string;
  readonly redirectUri: string;
  readonly scopes: readonly string[];
}

export interface XStoredOAuthTokens {
  readonly type: "x-oauth-tokens";
  readonly accessToken: string;
  readonly refreshToken?: string;
  readonly expiresAt: number;
  readonly scopes: readonly string[];
  readonly userId?: string;
}

export interface XResolvedCredentials {
  readonly type: "oauth2";
  readonly appBearerToken: Redacted.Redacted<string>;
  readonly userAccessToken: Redacted.Redacted<string>;
  readonly consumerSecret: Redacted.Redacted<string>;
  readonly clientId?: string;
  readonly userId?: string;
  readonly accessTokenExpiresAt?: number;
  readonly oauthScopes?: readonly string[];
  readonly source: {
    readonly type: XAuthConfig["method"];
    readonly details?: string;
  };
}

export interface XResolvedAppCredentials {
  readonly appBearerToken: Redacted.Redacted<string>;
  readonly consumerSecret: Redacted.Redacted<string>;
  readonly clientId?: string;
  readonly source: {
    readonly type: XAuthConfig["method"];
    readonly details?: string;
  };
}

export const isStoredOAuthApp = (value: unknown): value is XStoredOAuthApp => {
  if (value === null || typeof value !== "object") return false;
  const app = value as Record<string, unknown>;
  return (
    app.type === "x-oauth-app" &&
    typeof app.clientId === "string" &&
    app.clientId.length > 0 &&
    (app.clientSecret === undefined || typeof app.clientSecret === "string") &&
    typeof app.appBearerToken === "string" &&
    app.appBearerToken.length > 0 &&
    typeof app.consumerSecret === "string" &&
    app.consumerSecret.length > 0 &&
    typeof app.redirectUri === "string" &&
    Array.isArray(app.scopes) &&
    app.scopes.length > 0 &&
    app.scopes.every((scope) => typeof scope === "string" && scope.length > 0)
  );
};

export const isStoredOAuthTokens = (
  value: unknown,
): value is XStoredOAuthTokens => {
  if (value === null || typeof value !== "object") return false;
  const tokens = value as Record<string, unknown>;
  return (
    tokens.type === "x-oauth-tokens" &&
    typeof tokens.accessToken === "string" &&
    tokens.accessToken.length > 0 &&
    (tokens.refreshToken === undefined ||
      typeof tokens.refreshToken === "string") &&
    typeof tokens.expiresAt === "number" &&
    Number.isFinite(tokens.expiresAt) &&
    Array.isArray(tokens.scopes) &&
    tokens.scopes.every(
      (scope) => typeof scope === "string" && scope.length > 0,
    ) &&
    (tokens.userId === undefined || typeof tokens.userId === "string")
  );
};

const authError = (message: string, cause?: unknown): AuthError =>
  new AuthError({
    message,
    ...(cause !== undefined ? { cause } : {}),
  });

export const parseXOAuthScopes = (input: string): readonly string[] => [
  ...new Set(
    input
      .split(/[\s,]+/u)
      .map((scope) => scope.trim())
      .filter((scope) => scope.length > 0),
  ),
];

const parseExpiresAt = (
  input: string | undefined,
): Effect.Effect<number | undefined, AuthError> => {
  if (input === undefined || input.trim() === "") {
    return Effect.succeed(undefined);
  }
  const value = input.trim();
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 0) {
    // Accept both Unix seconds and Unix milliseconds.
    return Effect.succeed(
      numeric < 100_000_000_000 ? numeric * 1_000 : numeric,
    );
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed)
    ? Effect.succeed(parsed)
    : Effect.fail(
        authError(
          "X_ACCESS_TOKEN_EXPIRES_AT must be an ISO date, Unix seconds, or Unix milliseconds",
        ),
      );
};

/** Resolve only the app credentials needed for CRC and app-auth operations. */
export const readEnvAppCredentials = (): Effect.Effect<
  XResolvedAppCredentials,
  AuthError
> =>
  Effect.gen(function* () {
    const appBearerToken = yield* getEnvRedactedRequired("X_BEARER_TOKEN");
    const consumerSecret = yield* getEnvRedactedRequired("X_API_SECRET");
    const clientIdValue = yield* getEnv("X_CLIENT_ID");
    const clientId = clientIdValue?.trim() || undefined;
    return {
      appBearerToken,
      consumerSecret,
      ...(clientId !== undefined ? { clientId } : {}),
      source: {
        type: "env" as const,
        details: "X_BEARER_TOKEN/X_API_SECRET",
      },
    } satisfies XResolvedAppCredentials;
  });

/** Resolve the documented X environment-variable credential set. */
export const readEnvCredentials = (): Effect.Effect<
  XResolvedCredentials,
  AuthError
> =>
  Effect.gen(function* () {
    const app = yield* readEnvAppCredentials();
    const userAccessToken = yield* getEnvRedactedRequired("X_ACCESS_TOKEN");
    const configuredScopes = yield* getEnv("X_OAUTH_SCOPES");
    const oauthScopes =
      configuredScopes === undefined
        ? undefined
        : parseXOAuthScopes(configuredScopes);
    const accessTokenExpiresAt = yield* parseExpiresAt(
      yield* getEnv("X_ACCESS_TOKEN_EXPIRES_AT"),
    );
    const details = "X_BEARER_TOKEN/X_API_SECRET/X_ACCESS_TOKEN";

    if (accessTokenExpiresAt !== undefined) {
      const now = yield* Clock.currentTimeMillis;
      if (accessTokenExpiresAt <= now + X_TOKEN_REFRESH_WINDOW_MS) {
        return yield* Effect.fail(
          authError(
            "X_ACCESS_TOKEN is expired or expires within 60 seconds. Rotate the environment token externally or use stored OAuth (`alchemy login --configure`) so Alchemy can persist X's replacement refresh token safely.",
          ),
        );
      }
    }

    return {
      type: "oauth2" as const,
      appBearerToken: app.appBearerToken,
      userAccessToken,
      consumerSecret: app.consumerSecret,
      ...(app.clientId !== undefined ? { clientId: app.clientId } : {}),
      ...(accessTokenExpiresAt !== undefined ? { accessTokenExpiresAt } : {}),
      ...(oauthScopes !== undefined && oauthScopes.length > 0
        ? { oauthScopes }
        : {}),
      source: { type: "env" as const, details },
    } satisfies XResolvedCredentials;
  });
