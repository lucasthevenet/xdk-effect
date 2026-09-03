import * as Effect from "effect/Effect";
import type * as Redacted from "effect/Redacted";
import { AuthError } from "alchemy/Auth/AuthProvider";
import { getEnvRedactedRequired } from "alchemy/Auth/Env";

/** Canonical key used by Alchemy's AuthProvider registry. */
export const X_AUTH_PROVIDER_NAME = "X";

/** CredentialsStore key containing user-provided X credentials. */
export const X_STORED_CREDENTIALS_KEY = "x-stored";

/** Both sources supply the same OAuth 1.0a credential set. */
export type XAuthConfig = { method: "env" } | { method: "stored" };

export interface XStoredCredentials {
  readonly type: "oauth1";
  readonly apiKey: string;
  readonly apiSecret: string;
  readonly accessToken: string;
  readonly accessTokenSecret: string;
}

export interface XResolvedCredentials {
  readonly type: "oauth1";
  readonly apiKey: Redacted.Redacted<string>;
  readonly apiSecret: Redacted.Redacted<string>;
  readonly accessToken: Redacted.Redacted<string>;
  readonly accessTokenSecret: Redacted.Redacted<string>;
  readonly source: {
    readonly type: XAuthConfig["method"];
    readonly details?: string;
  };
}

/** Resolve the four credentials; app-only tokens are obtained by the SDK protocol. */
export const readEnvCredentials = (): Effect.Effect<
  XResolvedCredentials,
  AuthError
> =>
  Effect.gen(function* () {
    const apiKey = yield* getEnvRedactedRequired("X_API_KEY");
    const apiSecret = yield* getEnvRedactedRequired("X_API_SECRET");
    const accessToken = yield* getEnvRedactedRequired("X_ACCESS_TOKEN");
    const accessTokenSecret = yield* getEnvRedactedRequired(
      "X_ACCESS_TOKEN_SECRET",
    );
    return {
      type: "oauth1",
      apiKey,
      apiSecret,
      accessToken,
      accessTokenSecret,
      source: {
        type: "env",
        details: "X_API_KEY/X_API_SECRET/X_ACCESS_TOKEN/X_ACCESS_TOKEN_SECRET",
      },
    };
  });
