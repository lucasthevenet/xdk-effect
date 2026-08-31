import { describe, expect, test } from "bun:test";
import * as ConfigProvider from "effect/ConfigProvider";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Layer from "effect/Layer";
import {
  AuthError,
  AuthProviders,
  type AuthProvider,
} from "alchemy/Auth/AuthProvider";
import {
  CredentialsStore,
  type CredentialsStoreService,
} from "alchemy/Auth/Credentials";
import { AlchemyProfile, type ProfileService } from "alchemy/Auth/Profile";
import {
  X_AUTH_PROVIDER_NAME,
  X_OAUTH_APP_STORE_KEY,
  type XAuthConfig,
  type XResolvedCredentials,
  type XStoredOAuthApp,
} from "../src/AuthEnvironment.ts";
import { fromAuthProvider, XAppCredentials } from "../src/Credentials.ts";

describe("X credential resolution", () => {
  test("app-only API calls do not read or refresh user OAuth", async () => {
    let userReads = 0;
    let authorization: string | null = null;
    const app = {
      type: "x-oauth-app",
      clientId: "client-id",
      appBearerToken: "app-bearer-token",
      consumerSecret: "consumer-secret",
      redirectUri: "http://127.0.0.1:9976/auth/callback",
      scopes: ["tweet.read", "offline.access"],
    } satisfies XStoredOAuthApp;
    // SAFETY: This local fake implements every AuthProvider operation used by
    // fromAuthProvider; `read` intentionally fails to prove app-only isolation.
    const auth = {
      kind: "AuthProvider",
      name: X_AUTH_PROVIDER_NAME,
      configure: () => Effect.succeed({ method: "oauth" as const }),
      login: () => Effect.void,
      logout: () => Effect.void,
      prettyPrint: () => Effect.void,
      read: () => {
        userReads += 1;
        return Effect.fail(
          new AuthError({ message: "expired user refresh token" }),
        );
      },
    } as AuthProvider<XAuthConfig, XResolvedCredentials>;
    const profile = {
      readConfig: Effect.succeed({ version: 0 as const, profiles: {} }),
      writeConfig: () => Effect.void,
      getProfile: () => Effect.succeed(undefined),
      setProfile: () => Effect.void,
      deleteProfile: () => Effect.succeed(false),
      loadOrConfigure: <Config extends { method: string }>() =>
        // SAFETY: This test only requests XAuthConfig, whose discriminant is
        // exactly the OAuth method returned by the profile fake.
        Effect.succeed({ method: "oauth" } as Config),
    } satisfies ProfileService;
    const store = {
      read: <T>(_profile: string, key: string) => {
        // SAFETY: The fake store contains the XStoredOAuthApp under its exact
        // credential key and returns undefined for every other requested type.
        return Effect.succeed(
          (key === X_OAUTH_APP_STORE_KEY ? app : undefined) as T | undefined,
        );
      },
      write: () => Effect.void,
      delete: () => Effect.void,
      deleteProfile: () => Effect.void,
    } satisfies CredentialsStoreService;
    const dependencies = Layer.mergeAll(
      Layer.succeed(AuthProviders, { [X_AUTH_PROVIDER_NAME]: auth }),
      Layer.succeed(AlchemyProfile, profile),
      Layer.succeed(CredentialsStore, store),
      Layer.succeed(
        FileSystem.FileSystem,
        FileSystem.makeNoop({ exists: () => Effect.succeed(false) }),
      ),
    );
    const credentials = fromAuthProvider({
      runtime: {
        fetch: async (_input, init) => {
          authorization = new Headers(init?.headers).get("authorization");
          return Response.json({ data: [] });
        },
      },
    }).pipe(Layer.provide(dependencies));

    const listed = await Effect.runPromise(
      Effect.gen(function* () {
        const { client } = yield* XAppCredentials;
        return yield* Effect.promise(() => client.webhooks.list());
      }).pipe(
        Effect.provide(credentials),
        Effect.provideService(
          ConfigProvider.ConfigProvider,
          ConfigProvider.fromEnvRecord({}),
        ),
      ),
    );

    expect(listed.value.data).toEqual([]);
    expect(authorization).toBe("Bearer app-bearer-token");
    expect(userReads).toBe(0);
  });
});
