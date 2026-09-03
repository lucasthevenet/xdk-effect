import { describe, expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import * as Fiber from "effect/Fiber";
import * as Layer from "effect/Layer";
import * as Stream from "effect/Stream";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import { fromOAuth1, fromBearer } from "../src/credentials.ts";
import * as Retry from "../src/retry.ts";
import { withAuth } from "../src/protocol.ts";
import { getUsersMe } from "../src/services/users.ts";
import {
  createPosts,
  getPostsById,
  createUsersBookmark,
} from "../src/services/posts.ts";
import { getWebhooks } from "../src/services/webhooks.ts";
import { mediaUpload } from "../src/services/media.ts";
import { chatMediaDownload } from "../src/services/chats.ts";
import { streamPostsSample } from "../src/services/stream.ts";
import { getOpenApiSpec } from "../src/services/general.ts";
import {
  ServiceUnavailable,
  XAuthenticationError,
  XParseError,
  XInputError,
} from "../src/errors.ts";
type FetchLike = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

const credentials = {
  apiKey: "key",
  apiSecret: "secret",
  accessToken: "token",
  accessTokenSecret: "token-secret",
};
const transport = (runtime: { readonly fetch: FetchLike }) =>
  Layer.mergeAll(
    FetchHttpClient.layer,
    Layer.succeed(
      FetchHttpClient.Fetch,
      Object.assign(runtime.fetch, { preconnect: fetch.preconnect }),
    ),
    Layer.succeed(FetchHttpClient.RequestInit, { redirect: "error" }),
    Layer.succeed(Retry.Retry, { while: () => false }),
  );
const live = (runtime: { readonly fetch: FetchLike }) =>
  Layer.merge(fromOAuth1(credentials), transport(runtime));
const me = { data: { id: "1", name: "Alchemy", username: "alchemy" } };

describe("generated Effect operations", () => {
  test("does not attach credentials to an unauthenticated spec operation", async () => {
    const document = { openapi: "3.0.0" };
    const result = await Effect.runPromise(
      getOpenApiSpec({}).pipe(
        Effect.provide(
          live({
            fetch: async (_url, init) => {
              expect(new Headers(init?.headers).has("authorization")).toBe(
                false,
              );
              return Response.json(document);
            },
          }),
        ),
      ),
    );
    expect(result).toEqual(document);
  });
  test("is lazy, signs user requests, and serializes CSV query names", async () => {
    const requests: Request[] = [];
    const layer = live({
      fetch: async (url, init) => {
        requests.push(new Request(url, init));
        return Response.json(
          { ...me, future_field: true },
          { headers: { "x-rate-limit-remaining": "9" } },
        );
      },
    });
    const effect = getUsersMe({ user_fields: ["id", "username"] }).pipe(
      Effect.provide(layer),
    );
    expect(requests).toHaveLength(0);
    const result = await Effect.runPromise(effect);
    expect(result).toMatchObject({ ...me, future_field: true });
    expect(
      new URL(requests[0]!.url).searchParams.getAll("user.fields"),
    ).toEqual(["id,username"]);
    expect(requests[0]!.headers.get("authorization")).toStartWith("OAuth ");
    expect(requests[0]!.redirect).toBe("error");
  });

  test("uses generated paths and JSON bodies for endpoints outside the original adapter", async () => {
    const requests: Request[] = [];
    const response = {
      data: { id: "42", text: "hello", edit_history_tweet_ids: ["42"] },
    };
    await Effect.runPromise(
      Effect.gen(function* () {
        yield* createPosts({
          text: "hello",
          reply: { in_reply_to_tweet_id: "1" },
        });
        yield* getPostsById({ id: "a/b?c", post_fields: ["id", "text"] }).pipe(
          withAuth("user"),
        );
      }).pipe(
        Effect.provide(
          live({
            fetch: async (url, init) => {
              requests.push(new Request(url, init));
              return Response.json(response);
            },
          }),
        ),
      ),
    );
    expect(await requests[0]!.json()).toEqual({
      text: "hello",
      reply: { in_reply_to_tweet_id: "1" },
    });
    expect(new URL(requests[1]!.url).pathname).toBe("/2/tweets/a%2Fb%3Fc");
  });

  test("validates input before I/O and puts decoding failures in the error channel", async () => {
    let calls = 0;
    const layer = live({
      fetch: async () => {
        calls++;
        return Response.json({ data: { id: 1 } });
      },
    });
    const input = await Effect.runPromise(
      getPostsById({
        // @ts-expect-error Runtime validation also protects untyped callers.
        id: 42,
      }).pipe(Effect.flip, Effect.provide(layer)),
    );
    expect(input).toBeInstanceOf(XInputError);
    expect(calls).toBe(0);
    const output = await Effect.runPromise(
      getUsersMe({}).pipe(Effect.flip, Effect.provide(layer)),
    );
    expect(output).toBeInstanceOf(XParseError);
  });

  test("uses declared auth alternatives and rejects OAuth2-only calls with OAuth1 credentials", async () => {
    let calls = 0;
    const error = await Effect.runPromise(
      createUsersBookmark({ id: "1", tweet_id: "2" }).pipe(
        Effect.flip,
        Effect.provide(
          live({
            fetch: async () => {
              calls++;
              return Response.json({});
            },
          }),
        ),
      ),
    );
    expect(error).toBeInstanceOf(XAuthenticationError);
    expect(calls).toBe(0);
    const result = await Effect.runPromise(
      createUsersBookmark({ id: "1", tweet_id: "2" }).pipe(
        Effect.provide(
          Layer.merge(
            fromBearer({ userAccessToken: "oauth2" }),
            transport({
              fetch: async (_url, init) => {
                expect(new Headers(init?.headers).get("authorization")).toBe(
                  "Bearer oauth2",
                );
                return Response.json({ data: { bookmarked: true } });
              },
            }),
          ),
        ),
      ),
    );
    expect(result.data?.bookmarked).toBe(true);
  });

  test("shares an automatically exchanged app token across generated calls in one layer", async () => {
    let exchanges = 0;
    await Effect.runPromise(
      Effect.all([getWebhooks({}), getWebhooks({})], {
        concurrency: "unbounded",
      }).pipe(
        Effect.provide(
          live({
            fetch: async (url, init) => {
              if (new URL(url.toString()).pathname === "/oauth2/token") {
                exchanges++;
                return Response.json({
                  token_type: "bearer",
                  access_token: "app",
                });
              }
              expect(new Headers(init?.headers).get("authorization")).toBe(
                "Bearer app",
              );
              return Response.json({ data: [] });
            },
          }),
        ),
      ),
    );
    expect(exchanges).toBe(1);
  });

  test("exposes catchable API errors without replaying POSTs", async () => {
    let calls = 0;
    const error = await Effect.runPromise(
      createPosts({ text: "hello" }).pipe(
        Effect.flip,
        Effect.provide(
          live({
            fetch: async () => {
              calls++;
              return Response.json({ title: "Unavailable" }, { status: 503 });
            },
          }),
        ),
      ),
    );
    expect(error).toBeInstanceOf(ServiceUnavailable);
    expect(calls).toBe(1);
    const status = await Effect.runPromise(
      getUsersMe({}).pipe(
        Effect.catchTag("Forbidden", (failure) => Effect.succeed(failure._tag)),
        Effect.provide(
          live({
            fetch: async () =>
              Response.json({ title: "Forbidden" }, { status: 403 }),
          }),
        ),
      ),
    );
    expect(status).toBe("Forbidden");
  });

  test("interrupting an Effect aborts the underlying fetch", async () => {
    const started = Promise.withResolvers<AbortSignal>();
    const fiber = Effect.runFork(
      getUsersMe({}).pipe(
        Effect.provide(
          live({
            fetch: async (_url, init) => {
              const signal = init!.signal!;
              started.resolve(signal);
              return new Promise<Response>((_resolve, reject) =>
                signal.addEventListener("abort", () => reject(signal.reason), {
                  once: true,
                }),
              );
            },
          }),
        ),
      ),
    );
    const signal = await started.promise;
    await Effect.runPromise(Fiber.interrupt(fiber));
    expect(signal.aborted).toBe(true);
  });

  test("uploads Blob media as multipart under the spec's field name; strings remain JSON", async () => {
    const requests: Request[] = [];
    await Effect.runPromise(
      Effect.gen(function* () {
        yield* mediaUpload({
          media: new Blob(["image"]),
          media_category: "tweet_image",
        });
        yield* mediaUpload({
          media: "aW1hZ2U=",
          media_category: "tweet_image",
        });
      }).pipe(
        Effect.provide(
          live({
            fetch: async (url, init) => {
              requests.push(new Request(url, init));
              return Response.json({});
            },
          }),
        ),
      ),
    );
    const form = await requests[0]!.formData();
    expect(form.get("media_category")).toBe("tweet_image");
    const file = form.get("media");
    expect(file).toBeInstanceOf(Blob);
    if (file instanceof Blob) expect(await file.text()).toBe("image");
    expect(await requests[1]!.json()).toEqual({
      media: "aW1hZ2U=",
      media_category: "tweet_image",
    });
  });

  test("returns binary downloads as bytes, not JSON", async () => {
    const bytes = new Uint8Array([0, 255, 17, 3]);
    const result = await Effect.runPromise(
      chatMediaDownload({ id: "1", media_hash_key: "key" }).pipe(
        Effect.provide(live({ fetch: async () => new Response(bytes) })),
      ),
    );
    expect(result).toEqual(bytes);
  });

  test("streams chunked NDJSON, ignores heartbeats, and cancels on early termination", async () => {
    let cancelled = false;
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        for (const text of [
          '\r\n{"data":',
          '{"id":"1","text":"hi","edit_history_tweet_ids":["1"]}}\n\n',
        ])
          controller.enqueue(new TextEncoder().encode(text));
      },
      cancel() {
        cancelled = true;
      },
    });
    const result = await Effect.runPromise(
      streamPostsSample({}).pipe(
        Stream.unwrap,
        Stream.take(1),
        Stream.runCollect,
        Effect.provide(
          Layer.merge(
            fromBearer({ appBearerToken: "app" }),
            transport({ fetch: async () => new Response(body) }),
          ),
        ),
      ),
    );
    expect(result).toHaveLength(1);
    expect(result[0]?.data?.id).toBe("1");
    expect(cancelled).toBe(true);
  });

  test("malformed streaming records fail in the typed channel", async () => {
    const error = await Effect.runPromise(
      streamPostsSample({}).pipe(
        Stream.unwrap,
        Stream.runCollect,
        Effect.flip,
        Effect.provide(
          Layer.merge(
            fromBearer({ appBearerToken: "app" }),
            transport({ fetch: async () => new Response("not json\n") }),
          ),
        ),
      ),
    );
    expect(error).toBeInstanceOf(XParseError);
  });
});
