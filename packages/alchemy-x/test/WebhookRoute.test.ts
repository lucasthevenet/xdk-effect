import { describe, expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import { RuntimeContext } from "alchemy/RuntimeContext";
import * as HttpRouter from "effect/unstable/http/HttpRouter";
import * as HttpServerRequest from "effect/unstable/http/HttpServerRequest";
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse";
import { createCrcResponse, X_WEBHOOK_SIGNATURE_HEADER } from "distilled-x";
import {
  makeCrcHandler,
  makeWebhookHandler,
  resolveOrigin,
  WebhookRoute,
} from "../src/WebhookRoute.ts";
import { stableId, stableJson } from "../src/internal.ts";

const secretValue = "x-api-consumer-secret";
const secret = Redacted.make(secretValue);

const signature = async (body: string) =>
  (await createCrcResponse(body, secretValue)).response_token;

const post = async (
  body: string,
  handler: Parameters<typeof makeWebhookHandler>[0] = () => Effect.void,
  suppliedSignature?: string,
) => {
  const request = HttpServerRequest.fromWeb(
    new Request("https://events.example.com/api/x/webhook", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(suppliedSignature
          ? { [X_WEBHOOK_SIGNATURE_HEADER]: suppliedSignature }
          : {}),
      },
      body,
    }),
  );
  const result = await Effect.runPromise(
    makeWebhookHandler(handler, secret)(request),
  );
  return HttpServerResponse.toWeb(result);
};

describe("X webhook receiver", () => {
  test("resolves nested plan-time origins", async () => {
    const origin = await Effect.runPromise(
      resolveOrigin(
        Effect.succeed(Effect.succeed("https://events.example.com")) as never,
      ),
    );
    expect(origin).toBe("https://events.example.com");
  });

  test("canonicalizes equivalent activity filters for stable logical IDs", () => {
    expect(stableJson({ user_id: "42", nested: { b: 2, a: 1 } })).toBe(
      stableJson({ nested: { a: 1, b: 2 }, user_id: "42" }),
    );
  });

  test("answers CRC with the X HMAC response", async () => {
    const request = HttpServerRequest.fromWeb(
      new Request(
        "https://events.example.com/api/x/webhook?crc_token=challenge",
      ),
    );
    const result = await Effect.runPromise(makeCrcHandler(secret)(request));
    const response = HttpServerResponse.toWeb(result);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(
      await createCrcResponse("challenge", secretValue),
    );
  });

  test("requires the CRC token", async () => {
    const request = HttpServerRequest.fromWeb(
      new Request("https://events.example.com/api/x/webhook"),
    );
    const result = await Effect.runPromise(makeCrcHandler(secret)(request));
    expect(HttpServerResponse.toWeb(result).status).toBe(400);
  });

  test("does not expose a chosen-message POST signing oracle through CRC", async () => {
    const forgedBody = JSON.stringify({ for_user_id: "42" });
    const url = new URL("https://events.example.com/api/x/webhook");
    url.searchParams.set("crc_token", forgedBody);
    const request = HttpServerRequest.fromWeb(new Request(url));
    const result = await Effect.runPromise(makeCrcHandler(secret)(request));
    const crcResponse = HttpServerResponse.toWeb(result);

    expect(crcResponse.status).toBe(400);
    expect(await crcResponse.json()).toEqual({ error: "invalid_crc_token" });
  });

  test("verifies raw bytes before parsing and dispatching", async () => {
    const body = JSON.stringify({
      for_user_id: "42",
      tweet_create_events: [{ id_str: "100" }],
    });
    let delivered: unknown;

    expect((await post(body)).status).toBe(401);
    expect(
      (await post("not-json", () => Effect.void, await signature("not-json")))
        .status,
    ).toBe(400);
    expect(
      (await post("[]", () => Effect.void, await signature("[]"))).status,
    ).toBe(400);
    expect(
      (await post(body, () => Effect.fail("boom"), await signature(body)))
        .status,
    ).toBe(500);

    const success = await post(
      body,
      (payload) => Effect.sync(() => (delivered = payload)),
      await signature(body),
    );
    expect(success.status).toBe(200);
    expect(delivered).toEqual(JSON.parse(body));

    const tampered = `${body} `;
    expect(
      (await post(tampered, () => Effect.void, await signature(body))).status,
    ).toBe(401);
  });

  test("accepts the nested X Activity delivery envelope", async () => {
    const body = JSON.stringify({
      data: {
        event_type: "post.create",
        event_uuid: "event-1",
        filter: { user_id: "42" },
        payload: { id: "100" },
      },
    });
    expect(
      (await post(body, () => Effect.void, await signature(body))).status,
    ).toBe(200);
  });

  test("accepts an X Filtered Stream webhook delivery", async () => {
    const body = JSON.stringify({
      data: { id: "100", text: "Alchemy" },
      matching_rules: [{ id: "rule-1", tag: "alchemy" }],
    });
    expect(
      (await post(body, () => Effect.void, await signature(body))).status,
    ).toBe(200);
  });

  test("accepts an Account Activity OAuth revoke user_event", async () => {
    const body = JSON.stringify({
      user_event: {
        revoke: {
          source: { user_id: "42" },
          target: { app_id: "100" },
        },
      },
    });
    expect(
      (await post(body, () => Effect.void, await signature(body))).status,
    ).toBe(200);
  });

  test("accepts an Account Activity replay terminal status", async () => {
    const body = JSON.stringify({
      replay_job_status: {
        webhook_id: "10",
        job_state: "Complete",
        job_state_description: "Delivered",
        job_id: "job-1",
      },
    });
    expect(
      (await post(body, () => Effect.void, await signature(body))).status,
    ).toBe(200);
  });

  test("rejects an oversized body before dispatch", async () => {
    const body = JSON.stringify({ for_user_id: "42" });
    const request = HttpServerRequest.fromWeb(
      new Request("https://events.example.com/api/x/webhook", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "content-length": String(body.length),
          [X_WEBHOOK_SIGNATURE_HEADER]: await signature(body),
        },
        body,
      }),
    );
    const result = await Effect.runPromise(
      makeWebhookHandler(() => Effect.void, secret, 4)(request),
    );
    expect(HttpServerResponse.toWeb(result).status).toBe(413);
  });

  test("rejects invalid body limits during route construction", () => {
    expect(() => makeWebhookHandler(() => Effect.void, secret, 0)).toThrow(
      "positive safe integer",
    );
  });

  test.serial(
    "keeps provider credentials and resources out of runtime route initialization",
    async () => {
      const previous = globalThis.__ALCHEMY_RUNTIME__;
      const bindings: string[] = [];
      globalThis.__ALCHEMY_RUNTIME__ = true;
      try {
        const runtime = Layer.succeed(RuntimeContext, {
          Type: "Test.Runtime",
          id: "runtime",
          env: {},
          get: <A>() => Effect.succeed(Redacted.make(secretValue) as A),
          set: (key: string) =>
            Effect.sync(() => {
              bindings.push(key);
              return key;
            }),
        });
        await Effect.runPromise(
          Layer.build(
            Layer.provideMerge(
              WebhookRoute(
                "RuntimeOnly",
                {
                  origin: Effect.die("origin must stay plan-only"),
                  accountActivity: true,
                },
                () => Effect.void,
              ),
              Layer.mergeAll(HttpRouter.layer, runtime),
            ),
          ).pipe(Effect.scoped),
        );
        expect(bindings).toEqual([
          `ALCHEMY_X_${stableId("RuntimeOnly").toUpperCase()}_CONSUMER_SECRET`,
        ]);
      } finally {
        globalThis.__ALCHEMY_RUNTIME__ = previous;
      }
    },
  );
});
