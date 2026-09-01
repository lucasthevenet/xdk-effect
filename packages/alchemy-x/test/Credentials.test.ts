import { describe, expect, test } from "bun:test";
import * as ConfigProvider from "effect/ConfigProvider";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import {
  AuthError,
  AuthProviders,
  type AuthProvider,
} from "alchemy/Auth/AuthProvider";
import {
  readEnvCredentials,
  X_AUTH_PROVIDER_NAME,
  type XAuthConfig,
  type XResolvedCredentials,
} from "../src/AuthEnvironment.ts";
import {
  fromAuthProvider,
  XAppCredentials,
  XCredentials,
} from "../src/Credentials.ts";

describe("X credential resolution", () => {
  test("app-only API calls need no profile or user access token", async () => {
    let userReads = 0;
    let authorization: string | null = null;
    // SAFETY: This local fake implements every AuthProvider operation used by
    // fromAuthProvider; read intentionally fails to prove app-only isolation.
    const auth = {
      kind: "AuthProvider",
      name: X_AUTH_PROVIDER_NAME,
      configure: () => Effect.succeed({ method: "env" as const }),
      login: () => Effect.void,
      logout: () => Effect.void,
      prettyPrint: () => Effect.void,
      read: () => {
        userReads++;
        return Effect.fail(
          new AuthError({ message: "X_ACCESS_TOKEN was not supplied" }),
        );
      },
    } as AuthProvider<XAuthConfig, XResolvedCredentials>;
    const dependencies = Layer.succeed(AuthProviders, {
      [X_AUTH_PROVIDER_NAME]: auth,
    });
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
          ConfigProvider.fromEnvRecord({
            X_BEARER_TOKEN: "app-bearer-token",
            X_API_SECRET: "consumer-secret",
          }),
        ),
      ),
    );

    expect(listed.value.data).toEqual([]);
    expect(authorization).toBe("Bearer app-bearer-token");
    expect(userReads).toBe(0);
  });

  test("resolves user environment credentials without a profile", async () => {
    const auth = {
      kind: "AuthProvider",
      name: X_AUTH_PROVIDER_NAME,
      configure: () => Effect.succeed({ method: "env" as const }),
      login: () => Effect.void,
      logout: () => Effect.void,
      prettyPrint: () => Effect.void,
      read: () => readEnvCredentials(),
    } satisfies AuthProvider<XAuthConfig, XResolvedCredentials>;
    const credentials = fromAuthProvider().pipe(
      Layer.provide(
        Layer.succeed(AuthProviders, { [X_AUTH_PROVIDER_NAME]: auth }),
      ),
    );

    const resolved = await Effect.runPromise(
      XCredentials.pipe(
        Effect.provide(credentials),
        Effect.provideService(
          ConfigProvider.ConfigProvider,
          ConfigProvider.fromEnvRecord({
            X_BEARER_TOKEN: "app-bearer-token",
            X_API_SECRET: "consumer-secret",
            X_ACCESS_TOKEN: "user-access-token",
          }),
        ),
      ),
    );

    expect(Redacted.value(resolved.userAccessToken)).toBe("user-access-token");
    expect(resolved.source.type).toBe("env");
  });
});
