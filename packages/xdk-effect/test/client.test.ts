import { expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import * as Fiber from "effect/Fiber";
import * as Stream from "effect/Stream";
import * as HttpClient from "effect/unstable/http/HttpClient";
import * as HttpClientResponse from "effect/unstable/http/HttpClientResponse";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import * as X from "../src/index.ts";

const me = { data: { id: "42", name: "Example", username: "example" } };
const oauth1 = {
  apiKey: "key",
  apiSecret: "secret",
  accessToken: "token",
  accessTokenSecret: "token-secret",
};

test("constructor binds all generated operations without exposing schemas", () => {
  const client = X.Client({ accessToken: "token" });
  expect(client).not.toHaveProperty("Api");
  expect(Object.keys(client).toSorted()).toEqual(
    Object.keys(X.Services).toSorted(),
  );
  let count = 0;
  for (const [name, group] of Object.entries(X.Services)) {
    // SAFETY: Client and Services share the same generated group names.
    const bound = client[name as keyof typeof client];
    const operations = Object.keys(group)
      .filter((key) => /^[a-z]/u.test(key))
      .toSorted();
    expect(Object.keys(bound).toSorted()).toEqual(operations);
    count += operations.length;
  }
  expect(count).toBe(171);
});

test("constructor and method calls are lazy, return Effects, and sign user reads", async () => {
  let calls = 0;
  const httpClient = HttpClient.make((request, url) =>
    Effect.sync(() => {
      calls++;
      expect(url.toString()).toBe("https://example.com/2/users/me");
      expect(request.headers.authorization).toStartWith("OAuth ");
      return HttpClientResponse.fromWeb(request, Response.json(me));
    }),
  );
  const client = X.Client({
    oauth1,
    baseUrl: "https://example.com",
    httpClient,
  });
  const effect: Effect.Effect<X.Services.users.GetUsersMeResponse, X.XOpError> =
    client.users.getUsersMe({});
  expect(Effect.isEffect(effect)).toBe(true);
  expect(calls).toBe(0);
  expect(await Effect.runPromise(effect)).toEqual(me);
  expect(await Effect.runPromise(effect)).toEqual(me);
  expect(calls).toBe(2);
});

test("separate clients keep bearer credentials isolated on a shared transport", async () => {
  const seen: string[] = [];
  const httpClient = HttpClient.make((request) =>
    Effect.sync(() => {
      seen.push(request.headers.authorization!);
      return HttpClientResponse.fromWeb(request, Response.json(me));
    }),
  );
  const first = X.Client({ accessToken: "first", httpClient });
  const second = X.Client({ accessToken: "second", httpClient });
  await Effect.runPromise(
    Effect.all(
      [
        first.users.getUsersMe({}),
        second.users.getUsersMe({}),
        first.users.getUsersMe({}),
      ],
      { concurrency: "unbounded" },
    ),
  );
  expect(seen.toSorted()).toEqual([
    "Bearer first",
    "Bearer first",
    "Bearer second",
  ]);
});

test("OAuth1 app-token exchange is reused across client operations", async () => {
  let exchanges = 0;
  const httpClient = HttpClient.make((request, url) =>
    Effect.sync(() => {
      if (url.pathname === "/oauth2/token") {
        exchanges++;
        return HttpClientResponse.fromWeb(
          request,
          Response.json({ token_type: "bearer", access_token: "app-token" }),
        );
      }
      expect(request.headers.authorization).toBe("Bearer app-token");
      return HttpClientResponse.fromWeb(
        request,
        Response.json({ meta: { result_count: 0 } }),
      );
    }),
  );
  const client = X.Client({ oauth1, httpClient });
  await Effect.runPromise(
    Effect.gen(function* () {
      yield* client.webhooks.getWebhooks({});
      yield* client.webhooks.getWebhooks({});
    }),
  );
  expect(exchanges).toBe(1);
});

test("concurrent first calls share the default transport and derived app token", async () => {
  let exchanges = 0;
  const fetcher = Object.assign(
    async (input: RequestInfo | URL) => {
      if (
        new URL(input instanceof Request ? input.url : input).pathname ===
        "/oauth2/token"
      ) {
        exchanges++;
        return Response.json({
          token_type: "bearer",
          access_token: "app-token",
        });
      }
      return Response.json({ meta: { result_count: 0 } });
    },
    { preconnect: fetch.preconnect },
  );
  const client = X.Client({ oauth1 });
  await Effect.runPromise(
    Effect.all(
      Array.from({ length: 5 }, () => client.webhooks.getWebhooks({})),
      { concurrency: "unbounded" },
    ).pipe(Effect.provideService(FetchHttpClient.Fetch, fetcher)),
  );
  expect(exchanges).toBe(1);
});

test("typed errors and per-call auth selection remain composable", async () => {
  const httpClient = HttpClient.make((request) =>
    Effect.sync(() => {
      expect(request.headers.authorization).toBe("Bearer user");
      return HttpClientResponse.fromWeb(
        request,
        Response.json({ detail: "invalid" }, { status: 401 }),
      );
    }),
  );
  const client = X.Client({
    bearerToken: "app",
    accessToken: "user",
    httpClient,
  });
  const error = await Effect.runPromise(
    client.posts
      .getPostsById({ id: "1" })
      .pipe(X.withAuth("user"), Effect.flip),
  );
  expect(error._tag).toBe("Unauthorized");
});

test("returned streams remain usable after the operation's context is provided", async () => {
  let cancelled = false;
  const httpClient = HttpClient.make((request) =>
    Effect.sync(() =>
      HttpClientResponse.fromWeb(
        request,
        new Response(
          new ReadableStream({
            start(controller) {
              controller.enqueue(
                new TextEncoder().encode(
                  '{"data":{"id":"1","text":"hello"}}\n',
                ),
              );
            },
            cancel() {
              cancelled = true;
            },
          }),
        ),
      ),
    ),
  );
  const client = X.Client({ bearerToken: "app", httpClient });
  const events = await Effect.runPromise(
    client.stream
      .streamPostsSample({})
      .pipe(Stream.unwrap, Stream.take(1), Stream.runCollect),
  );
  expect(events).toEqual([{ data: { id: "1", text: "hello" } }]);
  expect(cancelled).toBe(true);
});

test("interrupting a bound operation cancels its transport", async () => {
  let cancelled = false;
  const httpClient = HttpClient.make(() =>
    Effect.never.pipe(
      Effect.onInterrupt(() =>
        Effect.sync(() => {
          cancelled = true;
        }),
      ),
    ),
  );
  const client = X.Client({ accessToken: "user", httpClient });
  await Effect.runPromise(
    Effect.gen(function* () {
      const fiber = yield* client.users.getUsersMe({}).pipe(Effect.forkChild);
      yield* Effect.yieldNow;
      yield* Fiber.interrupt(fiber);
    }),
  );
  expect(cancelled).toBe(true);
});
