import { expect, test } from "bun:test";
import * as ConfigProvider from "effect/ConfigProvider";
import * as Effect from "effect/Effect";
import * as Fiber from "effect/Fiber";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import * as Schedule from "effect/Schedule";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import * as HttpClient from "effect/unstable/http/HttpClient";
import * as HttpClientResponse from "effect/unstable/http/HttpClientResponse";
import {
  Credentials,
  CredentialsFromEnv,
  fromBearer,
  fromOAuth1,
  oauth1Credentials,
} from "effect-xdk/Credentials";
import { ConfigError, TooManyRequests } from "effect-xdk/Errors";
import * as Retry from "effect-xdk/Retry";
import { getUsersMe } from "effect-xdk/users";
import { getWebhooks } from "effect-xdk/webhooks";
type FetchLike = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

const oauth1 = {
  apiKey: "key",
  apiSecret: "secret",
  accessToken: "token",
  accessTokenSecret: "token-secret",
};
const me = { data: { id: "1", name: "Alchemy", username: "alchemy" } };
const transport = (fetcher: FetchLike) =>
  Layer.mergeAll(
    FetchHttpClient.layer,
    Layer.succeed(
      FetchHttpClient.Fetch,
      Object.assign(fetcher, { preconnect: fetch.preconnect }),
    ),
  );

test("CredentialsFromEnv is lazy, redacted, and resolves the calling ConfigProvider", async () => {
  await Effect.runPromise(
    Effect.void.pipe(
      Effect.provide(CredentialsFromEnv),
      Effect.provideService(
        ConfigProvider.ConfigProvider,
        ConfigProvider.fromEnvRecord({}),
      ),
    ),
  );
  const resolve = Effect.flatten(Credentials).pipe(
    Effect.provide(CredentialsFromEnv),
  );
  const result = await Effect.runPromise(
    resolve.pipe(
      Effect.provideService(
        ConfigProvider.ConfigProvider,
        ConfigProvider.fromEnvRecord({
          X_API_KEY: "key",
          X_API_SECRET: "secret",
          X_ACCESS_TOKEN: "token",
          X_ACCESS_TOKEN_SECRET: "token-secret",
        }),
      ),
    ),
  );
  expect(result.type).toBe("oauth1");
  if (result.type !== "oauth1") throw new Error("Expected OAuth1 credentials");
  expect(Redacted.value(result.apiSecret)).toBe("secret");
  expect(JSON.stringify(result)).not.toContain('"secret"');
  const error = await Effect.runPromise(
    resolve.pipe(
      Effect.flip,
      Effect.provideService(
        ConfigProvider.ConfigProvider,
        ConfigProvider.fromEnvRecord({}),
      ),
    ),
  );
  expect(error).toBeInstanceOf(ConfigError);
});

test("yielding an operation captures context and call-time credentials override it", async () => {
  const headers: (string | null)[] = [];
  const layer = Layer.merge(
    fromBearer({ userAccessToken: "captured" }),
    transport(async (_url, init) => {
      headers.push(new Headers(init?.headers).get("authorization"));
      return Response.json(me);
    }),
  );
  const call = await Effect.runPromise(getUsersMe.pipe(Effect.provide(layer)));
  await Effect.runPromise(call({}));
  await Effect.runPromise(
    call({}).pipe(Effect.provide(fromBearer({ userAccessToken: "override" }))),
  );
  expect(headers).toEqual(["Bearer captured", "Bearer override"]);
});

test("credentials are resolved on every call, not captured by the process-wide protocol", async () => {
  let token = "first";
  const requests: string[] = [];
  const layer = Layer.merge(
    Layer.succeed(
      Credentials,
      Effect.sync(() => oauth1Credentials({ ...oauth1, accessToken: token })),
    ),
    transport(async (_url, init) => {
      requests.push(new Headers(init?.headers).get("authorization")!);
      return Response.json(me);
    }),
  );
  await Effect.runPromise(
    Effect.gen(function* () {
      yield* getUsersMe({});
      token = "second";
      yield* getUsersMe({});
    }).pipe(Effect.provide(layer)),
  );
  expect(requests[0]).toContain('oauth_token="first"');
  expect(requests[1]).toContain('oauth_token="second"');
});

test("API.make uses an injected HttpClient and Retry policy, re-signing each attempt", async () => {
  const headers: string[] = [];
  const client = HttpClient.make((request) =>
    Effect.sync(() => {
      headers.push(request.headers.authorization!);
      return HttpClientResponse.fromWeb(
        request,
        headers.length === 1
          ? new Response("gateway unavailable", { status: 503 })
          : Response.json(me),
      );
    }),
  );
  await Effect.runPromise(
    getUsersMe({}).pipe(
      Retry.policy({ while: () => true, schedule: Schedule.recurs(1) }),
      Effect.provide(fromOAuth1(oauth1)),
      Effect.provideService(HttpClient.HttpClient, client),
    ),
  );
  expect(headers).toHaveLength(2);
  expect(headers[0]).not.toBe(headers[1]);
});

test("native rate-limit errors use Distilled's shared HTTP error classes", async () => {
  const error = await Effect.runPromise(
    getUsersMe({}).pipe(
      Retry.none,
      Effect.flip,
      Effect.provide(
        Layer.merge(
          fromOAuth1(oauth1),
          transport(async () =>
            Response.json(
              { detail: "Slow down" },
              { status: 429, headers: { "retry-after": "2" } },
            ),
          ),
        ),
      ),
    ),
  );
  expect(error).toBeInstanceOf(TooManyRequests);
  expect(error.message).toBe("Slow down");
});

test("an interrupted waiter does not cancel the native shared app-token exchange", async () => {
  const started = Promise.withResolvers<void>();
  const response = Promise.withResolvers<Response>();
  let exchanges = 0;
  let exchangeSignal: AbortSignal | null | undefined;
  const layer = Layer.merge(
    fromOAuth1(oauth1),
    transport(async (url, init) => {
      if (new URL(url.toString()).pathname === "/oauth2/token") {
        exchanges++;
        exchangeSignal = init?.signal;
        started.resolve();
        return response.promise;
      }
      return Response.json({ data: [] });
    }),
  );
  const call = await Effect.runPromise(getWebhooks.pipe(Effect.provide(layer)));
  const first = Effect.runFork(call({}));
  await started.promise;
  const second = Effect.runFork(call({}));
  await Effect.runPromise(Fiber.interrupt(first));
  expect(exchangeSignal?.aborted).toBe(false);
  response.resolve(
    Response.json({ token_type: "bearer", access_token: "app" }),
  );
  expect(await Effect.runPromise(Fiber.join(second))).toEqual({ data: [] });
  expect(exchanges).toBe(1);
});

test("native app-token cache refreshes on credential rotation and revoked tokens", async () => {
  let key = "first";
  let exchanges = 0;
  let revoked = false;
  const layer = Layer.merge(
    Layer.succeed(
      Credentials,
      Effect.sync(() => oauth1Credentials({ ...oauth1, apiKey: key })),
    ),
    transport(async (url) => {
      if (new URL(url.toString()).pathname === "/oauth2/token") {
        exchanges++;
        return Response.json({
          token_type: "bearer",
          access_token: `app-${exchanges}`,
        });
      }
      if (revoked) {
        revoked = false;
        return Response.json({}, { status: 401 });
      }
      return Response.json({ data: [] });
    }),
  );
  await Effect.runPromise(
    Effect.gen(function* () {
      yield* getWebhooks({});
      yield* getWebhooks({});
      key = "second";
      yield* getWebhooks({});
      revoked = true;
      yield* getWebhooks({});
    }).pipe(
      Retry.policy({ while: () => true, schedule: Schedule.recurs(1) }),
      Effect.provide(layer),
    ),
  );
  expect(exchanges).toBe(3);
});
