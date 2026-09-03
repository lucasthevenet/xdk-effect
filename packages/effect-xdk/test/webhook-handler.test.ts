import { createHmac } from "node:crypto";
import { expect, test } from "bun:test";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as X from "../src/index.ts";

const secret = "app-secret";
const sign = (body: string) =>
  `sha256=${createHmac("sha256", secret).update(body).digest("base64")}`;
const delivery = (body: string, signature = sign(body)) =>
  new Request("https://example.com/webhook", {
    method: "POST",
    body,
    headers: { "x-twitter-webhooks-signature": signature },
  });

test("CRC uses the app secret and never invokes the callback", async () => {
  const handler = X.createWebhookHandler({
    consumerSecret: Redacted.make(secret),
    onEvent: () => Effect.die("unexpected delivery"),
  });
  const response = await Effect.runPromise(
    handler(new Request("https://example.com/webhook?crc_token=challenge")),
  );
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ response_token: sign("challenge") });
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(
    (
      await Effect.runPromise(
        handler(new Request("https://example.com/webhook")),
      )
    ).status,
  ).toBe(400);
  const unsupported = await Effect.runPromise(
    handler(new Request("https://example.com/webhook", { method: "DELETE" })),
  );
  expect(unsupported.status).toBe(405);
  expect(unsupported.headers.get("allow")).toBe("GET, POST");
});

test("valid raw UTF-8 deliveries are verified and processed before acknowledgment", async () => {
  let processed = false;
  const body = '{ "for_user_id": "42", "text": "café" }';
  const handler = X.createWebhookHandler({
    consumerSecret: secret,
    onEvent: (event) =>
      Effect.sync(() => {
        expect(event).toEqual({ for_user_id: "42", text: "café" });
        processed = true;
      }),
  });
  const effect = handler(delivery(body));
  expect(processed).toBe(false);
  const response = await Effect.runPromise(effect);
  expect(processed).toBe(true);
  expect(response.status).toBe(200);
});

test.each(["", "sha256=!!!!", "sha256=AA==", sign("different body")])(
  "rejects invalid signatures before callback: %s",
  async (signature) => {
    const handler = X.createWebhookHandler({
      consumerSecret: secret,
      onEvent: () => Effect.die("must not run"),
    });
    expect(
      (await Effect.runPromise(handler(delivery("{}", signature)))).status,
    ).toBe(401);
  },
);

test.each(["not json", "null", "[]", "42"])(
  "rejects signed non-object payload: %s",
  async (body) => {
    const handler = X.createWebhookHandler({
      consumerSecret: secret,
      onEvent: () => Effect.die("must not run"),
    });
    expect((await Effect.runPromise(handler(delivery(body)))).status).toBe(400);
  },
);

test("callback requirements and failures stay in the Effect channel", async () => {
  class Receiver extends Context.Service<
    Receiver,
    { readonly fail: boolean }
  >()("test/Receiver") {}
  const handler = X.createWebhookHandler({
    consumerSecret: secret,
    onEvent: () =>
      Effect.gen(function* () {
        const receiver = yield* Receiver;
        if (receiver.fail)
          return yield* Effect.fail("processing failed" as const);
      }),
  });
  const effect: Effect.Effect<
    Response,
    X.XWebhookError | "processing failed",
    Receiver
  > = handler(delivery("{}"));
  expect(
    await Effect.runPromise(
      effect.pipe(Effect.provideService(Receiver, { fail: true }), Effect.flip),
    ),
  ).toBe("processing failed");
});

test("limits streamed bodies without trusting content-length, cancelling oversized input", async () => {
  let cancelled = false;
  const request = new Request("https://example.com/webhook", {
    method: "POST",
    headers: {
      "x-twitter-webhooks-signature": sign("{}"),
      "content-length": "1",
    },
    body: new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(11));
      },
      cancel() {
        cancelled = true;
      },
    }),
  });
  const handler = X.createWebhookHandler({
    consumerSecret: secret,
    maxBodyBytes: 10,
    onEvent: () => Effect.die("must not run"),
  });
  expect((await Effect.runPromise(handler(request))).status).toBe(413);
  expect(cancelled).toBe(true);
});

test.each([0, -1, 1.5, Infinity])(
  "rejects invalid body limit %s",
  (maxBodyBytes) => {
    expect(() =>
      X.createWebhookHandler({
        consumerSecret: secret,
        maxBodyBytes,
        onEvent: () => Effect.void,
      }),
    ).toThrow(RangeError);
  },
);
