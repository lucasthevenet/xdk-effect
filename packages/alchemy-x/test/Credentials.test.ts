import { describe, expect, test } from "bun:test";
import * as ConfigProvider from "effect/ConfigProvider";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import { AuthProviders, type AuthProvider } from "alchemy/Auth/AuthProvider";
import {
  AlchemyProfile,
  CONFIG_VERSION,
  type ProfileService,
} from "alchemy/Auth/Profile";
import {
  readEnvCredentials,
  X_AUTH_PROVIDER_NAME,
  type XAuthConfig,
  type XResolvedCredentials,
} from "../src/AuthEnvironment.ts";
import { fromAuthProvider, fromEnv, XCredentials } from "../src/Credentials.ts";

const environment = {
  X_API_KEY: "api-key",
  X_API_SECRET: "api-secret",
  X_ACCESS_TOKEN: "user-token",
  X_ACCESS_TOKEN_SECRET: "token-secret",
};

const profileSelecting = (selected: XAuthConfig): ProfileService => ({
  readConfig: Effect.succeed({
    version: CONFIG_VERSION,
    profiles: { default: { [X_AUTH_PROVIDER_NAME]: selected } },
  }),
  writeConfig: () => Effect.void,
  getProfile: () => Effect.succeed({ [X_AUTH_PROVIDER_NAME]: selected }),
  setProfile: () => Effect.void,
  deleteProfile: () => Effect.succeed(true),
  loadOrConfigure: <Config extends { method: string }>() =>
    // SAFETY: Tests register the X provider with the matching XAuthConfig.
    Effect.succeed(selected as Config),
});

describe("X credential resolution", () => {
  for (const method of ["env", "stored"] as const) {
    test(`shares one lazy client and token cache for ${method} credentials`, async () => {
      let reads = 0;
      let exchanges = 0;
      const requests: Request[] = [];
      const auth = {
        kind: "AuthProvider",
        name: X_AUTH_PROVIDER_NAME,
        configure: () => Effect.succeed({ method }),
        login: () => Effect.void,
        logout: () => Effect.void,
        prettyPrint: () => Effect.void,
        read: () => {
          reads++;
          return method === "env"
            ? readEnvCredentials()
            : Effect.succeed({
                type: "oauth1" as const,
                apiKey: Redacted.make(environment.X_API_KEY),
                apiSecret: Redacted.make(environment.X_API_SECRET),
                accessToken: Redacted.make(environment.X_ACCESS_TOKEN),
                accessTokenSecret: Redacted.make(
                  environment.X_ACCESS_TOKEN_SECRET,
                ),
                source: { type: "stored" as const },
              });
        },
      } satisfies AuthProvider<XAuthConfig, XResolvedCredentials>;
      const credentials = fromAuthProvider({
        runtime: {
          fetch: async (input, init) => {
            const request = new Request(input, init);
            if (new URL(request.url).pathname === "/oauth2/token") {
              exchanges++;
              return Response.json({
                token_type: "bearer",
                access_token: "derived-app-token",
              });
            }
            requests.push(request);
            return Response.json({
              data:
                new URL(request.url).pathname === "/2/users/me"
                  ? { id: "42" }
                  : [],
            });
          },
        },
      }).pipe(
        Layer.provide(
          Layer.mergeAll(
            Layer.succeed(AuthProviders, { [X_AUTH_PROVIDER_NAME]: auth }),
            Layer.succeed(AlchemyProfile, profileSelecting({ method })),
          ),
        ),
      );

      await Effect.runPromise(
        Effect.gen(function* () {
          expect(reads).toBe(0);
          expect(exchanges).toBe(0);
          const first = yield* XCredentials;
          const second = yield* XCredentials;
          expect(first).toBe(second);
          expect(reads).toBe(1);
          expect(exchanges).toBe(0);
          expect(first.source.type).toBe(method);
          expect(Redacted.value(first.accessTokenSecret)).toBe(
            environment.X_ACCESS_TOKEN_SECRET,
          );
          yield* Effect.promise(() => first.client.users.getMe());
          expect(exchanges).toBe(0);
          yield* Effect.promise(() =>
            Promise.all([
              first.client.webhooks.list(),
              second.client.webhooks.list(),
            ]),
          );
        }).pipe(
          Effect.provide(credentials),
          Effect.provideService(
            ConfigProvider.ConfigProvider,
            ConfigProvider.fromEnvRecord(environment),
          ),
        ),
      );
      expect(exchanges).toBe(1);
      expect(
        requests.map((request) => request.headers.get("authorization")),
      ).toEqual([
        expect.stringContaining('oauth_token="user-token"'),
        "Bearer derived-app-token",
        "Bearer derived-app-token",
      ]);
    });
  }

  test("fromEnv also caches credentials and its client", async () => {
    const [first, second] = await Effect.runPromise(
      Effect.all([XCredentials, XCredentials]).pipe(
        Effect.provide(fromEnv()),
        Effect.provideService(
          ConfigProvider.ConfigProvider,
          ConfigProvider.fromEnvRecord(environment),
        ),
      ),
    );
    expect(first).toBe(second);
  });

  test("registering credential layers does not read secrets", async () => {
    await Effect.runPromise(
      Effect.void.pipe(
        Effect.provide(fromEnv()),
        Effect.provideService(
          ConfigProvider.ConfigProvider,
          ConfigProvider.fromEnvRecord({}),
        ),
      ),
    );
  });
});
