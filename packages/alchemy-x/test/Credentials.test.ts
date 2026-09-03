import * as Hmac from "effect-xdk/Hmac";
import * as BrowserCrypto from "@effect/platform-browser/BrowserCrypto";
import { describe, expect, test } from "bun:test";
import * as ConfigProvider from "effect/ConfigProvider";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import * as HttpClient from "effect/unstable/http/HttpClient";
import * as HttpClientResponse from "effect/unstable/http/HttpClientResponse";
import { getUsersMe } from "effect-xdk/users";
import { getWebhooks } from "effect-xdk/webhooks";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
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
import {
  fromAuthProvider,
  fromCredentials,
  fromEnv,
  SdkCredentials,
  XCredentials,
} from "../src/Credentials.ts";

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
  test("bridges lazy Alchemy credentials into native generated operations", async () => {
    await Effect.runPromise(
      Effect.void.pipe(
        Effect.provide(SdkCredentials.pipe(Layer.provide(fromEnv()))),
        Effect.provideService(
          ConfigProvider.ConfigProvider,
          ConfigProvider.fromEnvRecord({}),
        ),
      ),
    );
    const client = HttpClient.make((request) =>
      Effect.sync(() => {
        expect(request.url).toBe("https://x-proxy.example/2/users/me");
        expect(request.headers.authorization).toContain(
          'oauth_token="user-token"',
        );
        return HttpClientResponse.fromWeb(
          request,
          Response.json({
            data: { id: "42", name: "Alchemy", username: "alchemy" },
          }),
        );
      }),
    );
    const result = await Effect.runPromise(
      getUsersMe({}).pipe(
        Effect.provide(
          SdkCredentials.pipe(
            Layer.provide(
              fromCredentials(
                {
                  apiKey: environment.X_API_KEY,
                  apiSecret: environment.X_API_SECRET,
                  accessToken: environment.X_ACCESS_TOKEN,
                  accessTokenSecret: environment.X_ACCESS_TOKEN_SECRET,
                },
                { apiBaseUrl: "https://x-proxy.example" },
              ),
            ),
          ),
        ),
        Effect.provideService(HttpClient.HttpClient, client),
        Effect.provide(BrowserCrypto.layer),
        Effect.provide(Hmac.layerSubtle),
      ),
    );
    expect(result.data?.id).toBe("42");
  });
  for (const method of ["env", "stored"] as const) {
    test(`shares lazy credentials and the native token cache for ${method} credentials`, async () => {
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
      const transport = Layer.mergeAll(
        FetchHttpClient.layer,
        BrowserCrypto.layer,
        Hmac.layerSubtle,
        Layer.succeed(
          FetchHttpClient.Fetch,
          Object.assign(
            async (input: RequestInfo | URL, init?: RequestInit) => {
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
                    ? { id: "42", name: "Alchemy", username: "alchemy" }
                    : [],
              });
            },
            { preconnect: fetch.preconnect },
          ),
        ),
      );
      const credentials = fromAuthProvider().pipe(
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
          yield* getUsersMe({});
          expect(exchanges).toBe(0);
          yield* Effect.all([getWebhooks({}), getWebhooks({})], {
            concurrency: 2,
          });
        }).pipe(
          Effect.provide(Layer.merge(credentials, transport)),
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

  test("fromEnv also caches credentials", async () => {
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
