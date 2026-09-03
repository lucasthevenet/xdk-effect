import { describe, expect, test } from "bun:test";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import { createCrcResponse, X_WEBHOOK_SIGNATURE_HEADER } from "effect-xdk";
import {
  consumeEvents,
  EventSource,
  type EventSourceOptions,
  type EventSourceService,
  type XEvent,
} from "../src/EventSource.ts";
import {
  eventSourcePath,
  makeEventReceiver,
} from "../src/internal/EventReceiver.ts";
import { stableJson } from "../src/internal.ts";

const secretValue = "x-api-consumer-secret";
const secret = Redacted.make(secretValue);
const receiverUrl = "https://events.example.com/__alchemy/x/events";

class HandlerRequirement extends Context.Service<
  HandlerRequirement,
  { readonly value: string }
>()("Test.HandlerRequirement") {}

type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

const requirementProbe = consumeEvents(() =>
  HandlerRequirement.pipe(Effect.asVoid),
);
const preservesHandlerRequirement: Same<
  Effect.Services<typeof requirementProbe>,
  EventSource | HandlerRequirement
> = true;

const signature = async (body: string) =>
  (await Effect.runPromise(createCrcResponse(body, secretValue)))
    .response_token;

const post = async (
  body: string,
  handler: (event: XEvent) => Effect.Effect<void, string> = () => Effect.void,
  suppliedSignature?: string,
  maximumBodyBytes?: number,
) => {
  const headers = new Headers({ "content-type": "application/json" });
  if (suppliedSignature !== undefined) {
    headers.set(X_WEBHOOK_SIGNATURE_HEADER, suppliedSignature);
  }
  const request = new Request(receiverUrl, {
    method: "POST",
    headers,
    body,
  });
  const receiver = makeEventReceiver(handler, secret, maximumBodyBytes);
  return Effect.runPromise(receiver(request));
};

describe("X event source contract", () => {
  test("delegates both consumeEvents overloads through the EventSource seam", async () => {
    const observed: EventSourceOptions[] = [];
    const source: EventSourceService = (options) =>
      Effect.sync(() => {
        observed.push(options);
      });

    await Effect.runPromise(
      Effect.gen(function* () {
        yield* consumeEvents(() => Effect.void);
        yield* consumeEvents(
          { name: "AccountEvents", accountActivity: true },
          () => Effect.void,
        );
      }).pipe(Effect.provideService(EventSource, source)),
    );

    expect(observed).toEqual([
      {},
      { name: "AccountEvents", accountActivity: true },
    ]);
  });

  test("preserves handler service requirements in the returned Effect", () => {
    expect(preservesHandlerRequirement).toBe(true);
  });

  test("provides and validates canonical receiver paths", () => {
    expect(eventSourcePath()).toBe("/__alchemy/x/events");
    expect(eventSourcePath("/api/x/events")).toBe("/api/x/events");
    expect(() => eventSourcePath("api/x/events")).toThrow("absolute canonical");
    expect(() => eventSourcePath("/api//x/events")).toThrow(
      "absolute canonical",
    );
    expect(() => eventSourcePath("/api/x/../events")).toThrow("dot segments");
    expect(() => eventSourcePath("/api/x?kind=events")).toThrow(
      "absolute canonical",
    );
  });

  test("canonicalizes equivalent activity filters for stable resource IDs", () => {
    expect(stableJson({ user_id: "42", nested: { b: 2, a: 1 } })).toBe(
      stableJson({ nested: { a: 1, b: 2 }, user_id: "42" }),
    );
  });
});

describe("X event receiver", () => {
  test("answers CRC with the X HMAC response", async () => {
    const request = new Request(`${receiverUrl}?crc_token=challenge`);
    const response = await Effect.runPromise(
      makeEventReceiver(() => Effect.void, secret)(request),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(
      await Effect.runPromise(createCrcResponse("challenge", secretValue)),
    );
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  test("requires a bounded, non-object CRC token", async () => {
    const receiver = makeEventReceiver(() => Effect.void, secret);
    const missing = await Effect.runPromise(receiver(new Request(receiverUrl)));
    const forgedBody = JSON.stringify({ for_user_id: "42" });
    const forgedUrl = new URL(receiverUrl);
    forgedUrl.searchParams.set("crc_token", forgedBody);
    const forged = await Effect.runPromise(receiver(new Request(forgedUrl)));
    const oversizedUrl = new URL(receiverUrl);
    oversizedUrl.searchParams.set("crc_token", "x".repeat(1_025));
    const oversized = await Effect.runPromise(
      receiver(new Request(oversizedUrl)),
    );

    expect(missing.status).toBe(400);
    expect(forged.status).toBe(400);
    expect(await forged.json()).toEqual({ error: "invalid_crc_token" });
    expect(oversized.status).toBe(400);
  });

  test("returns 500 when the runtime secret cannot be resolved", async () => {
    const receiver = makeEventReceiver(
      () => Effect.void,
      Effect.fail("unavailable"),
    );
    const response = await Effect.runPromise(
      receiver(new Request(`${receiverUrl}?crc_token=challenge`)),
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "secret_unavailable" });
  });

  test("rejects methods other than GET and POST", async () => {
    const response = await Effect.runPromise(
      makeEventReceiver(
        () => Effect.void,
        secret,
      )(new Request(receiverUrl, { method: "PUT" })),
    );

    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("GET, POST");
  });

  test("verifies untouched bytes before parsing and dispatch", async () => {
    const body = JSON.stringify({
      for_user_id: "42",
      tweet_create_events: [{ id_str: "100" }],
    });
    let delivered: XEvent | undefined;

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
      (event) =>
        Effect.sync(() => {
          delivered = event;
        }),
      await signature(body),
    );
    expect(success.status).toBe(200);
    expect(delivered).toEqual({
      kind: "account_activity",
      delivery: JSON.parse(body),
    });

    const tampered = `${body} `;
    expect(
      (await post(tampered, () => Effect.void, await signature(body))).status,
    ).toBe(401);
  });

  test("classifies X Activity deliveries", async () => {
    const delivery = {
      data: {
        event_type: "post.create",
        event_uuid: "event-1",
        filter: { user_id: "42" },
        payload: { id: "100" },
      },
    };
    const body = JSON.stringify(delivery);
    let event: XEvent | undefined;
    const response = await post(
      body,
      (received) => Effect.sync(() => (event = received)),
      await signature(body),
    );

    expect(response.status).toBe(200);
    expect(event).toEqual({ kind: "activity", delivery });
  });

  test("classifies Filtered Stream deliveries", async () => {
    const delivery = {
      data: { id: "100", text: "Alchemy" },
      matching_rules: [{ id: "rule-1", tag: "alchemy" }],
    };
    const body = JSON.stringify(delivery);
    let event: XEvent | undefined;
    const response = await post(
      body,
      (received) => Effect.sync(() => (event = received)),
      await signature(body),
    );

    expect(response.status).toBe(200);
    expect(event).toEqual({ kind: "filtered_stream", delivery });
  });

  test("classifies Account Activity OAuth revoke deliveries", async () => {
    const delivery = {
      user_event: {
        revoke: {
          source: { user_id: "42" },
          target: { app_id: "100" },
        },
      },
    };
    const body = JSON.stringify(delivery);
    let event: XEvent | undefined;
    const response = await post(
      body,
      (received) => Effect.sync(() => (event = received)),
      await signature(body),
    );

    expect(response.status).toBe(200);
    expect(event).toEqual({ kind: "account_activity", delivery });
  });

  test("classifies replay job status deliveries", async () => {
    const delivery = {
      replay_job_status: {
        webhook_id: "10",
        job_state: "Complete",
        job_state_description: "Delivered",
        job_id: "job-1",
      },
    };
    const body = JSON.stringify(delivery);
    let event: XEvent | undefined;
    const response = await post(
      body,
      (received) => Effect.sync(() => (event = received)),
      await signature(body),
    );

    expect(response.status).toBe(200);
    expect(event).toEqual({ kind: "replay_job", delivery });
  });

  test("rejects malformed known fields without dispatching", async () => {
    const malformedDeliveries = [
      {
        data: {
          event_type: "post.create",
          filter: "not-an-object",
        },
      },
      {
        data: { event_type: "post.create" },
        errors: "not-an-array",
      },
      {
        data: { id: "100", text: 42 },
        matching_rules: [{ id: "rule-1" }],
      },
      {
        for_user_id: "42",
        tweet_create_events: "not-an-array",
      },
      {
        replay_job_status: {
          webhook_id: "10",
          job_state: "Complete",
          job_state_description: 42,
          job_id: "job-1",
        },
      },
    ];
    let dispatches = 0;

    const responses = await Promise.all(
      malformedDeliveries.map(async (delivery) => {
        const body = JSON.stringify(delivery);
        return post(
          body,
          () => Effect.sync(() => dispatches++),
          await signature(body),
        );
      }),
    );

    expect(responses.map((response) => response.status)).toEqual([
      400, 400, 400, 400, 400,
    ]);
    expect(dispatches).toBe(0);
  });

  test("preserves forward-compatible JSON extension fields", async () => {
    const delivery = {
      data: {
        event_type: "post.create",
        future_data: { nested: [true, 42, null] },
      },
      future_envelope: { revision: 2 },
    };
    const body = JSON.stringify(delivery);
    let event: XEvent | undefined;
    const response = await post(
      body,
      (received) => Effect.sync(() => (event = received)),
      await signature(body),
    );

    expect(response.status).toBe(200);
    expect(event).toEqual({ kind: "activity", delivery });
  });

  test("rejects oversized bodies before dispatch", async () => {
    const body = JSON.stringify({ for_user_id: "42" });
    let dispatched = false;
    const response = await post(
      body,
      () => Effect.sync(() => (dispatched = true)),
      await signature(body),
      4,
    );

    expect(response.status).toBe(413);
    expect(dispatched).toBe(false);
  });

  test("rejects invalid body limits during receiver construction", () => {
    expect(() => makeEventReceiver(() => Effect.void, secret, 0)).toThrow(
      "positive safe integer",
    );
  });
});
