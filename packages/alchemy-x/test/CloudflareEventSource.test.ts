import { describe, expect, test } from "bun:test";
import type { ResourceLike } from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import { RuntimeContext } from "alchemy/RuntimeContext";
import { Stack } from "alchemy/Stack";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import {
  consumeEvents,
  EventSource,
  type EventSourceOptions,
  type XEvent,
} from "../src/EventSource.ts";
import { EventSourceLive } from "../src/Cloudflare.ts";
import { XCredentialsContext } from "../src/Credentials.ts";

const secret = Redacted.make("x-api-consumer-secret");
const workerOrigin = "https://events.example.com";

type ListenerResult =
  | Effect.Effect<Response | undefined>
  | Response
  | undefined;

type CapturedListener = (event: Cloudflare.WorkerEvent) => ListenerResult;

const makeHarness = () => {
  const capturedListeners: CapturedListener[] = [];
  let secretReads = 0;
  const bindings: string[] = [];
  const worker = {
    Type: "Test.Worker",
    id: "RuntimeWorker",
    LogicalId: "RuntimeWorker",
    url: workerOrigin,
    env: {},
    get: (_key: string) =>
      Effect.sync(() => {
        secretReads++;
        return secret;
      }),
    set: (key: string) =>
      Effect.sync(() => {
        bindings.push(key);
        return key;
      }),
    listen: (listener: CapturedListener) =>
      Effect.sync(() => {
        capturedListeners.push(listener);
      }),
    serve(handler: CapturedListener) {
      return this.listen(handler);
    },
  };

  return {
    bindings,
    worker,
    listener: (): CapturedListener => {
      const listener = capturedListeners[0];
      if (listener === undefined) {
        throw new Error(
          "The X event source did not register a Worker listener",
        );
      }
      return listener;
    },
    listeners: (): readonly CapturedListener[] => capturedListeners,
    secretReads: () => secretReads,
  };
};

type Harness = ReturnType<typeof makeHarness>;

const provideAdapter = <A, E>(
  effect: Effect.Effect<A, E, EventSource>,
  harness: Harness,
): Effect.Effect<A, E> =>
  effect.pipe(
    Effect.provide(EventSourceLive),
    // SAFETY: The fixture implements the Worker identity and listener boundary
    // exercised by EventSourceLive; provider/resource behavior stays real.
    Effect.provideService(Cloudflare.Worker.Self, harness.worker as never),
    // SAFETY: The same fixture implements the RuntimeContext binding operations
    // used by Output.named during event-source registration and delivery.
    Effect.provideService(RuntimeContext, harness.worker as never),
  );

const runAtRuntime = async <A, E>(effect: Effect.Effect<A, E>): Promise<A> => {
  const previous = globalThis.__ALCHEMY_RUNTIME__;
  globalThis.__ALCHEMY_RUNTIME__ = true;
  try {
    return await Effect.runPromise(effect);
  } finally {
    globalThis.__ALCHEMY_RUNTIME__ = previous;
  }
};

const runAtPlan = async <A, E>(effect: Effect.Effect<A, E>): Promise<A> => {
  const previous = globalThis.__ALCHEMY_RUNTIME__;
  globalThis.__ALCHEMY_RUNTIME__ = false;
  try {
    return await Effect.runPromise(effect);
  } finally {
    globalThis.__ALCHEMY_RUNTIME__ = previous;
  }
};

const fetchEvent = (request: Request): Cloudflare.WorkerEvent => {
  // SAFETY: EventSourceLive reads only this standard Request from a fetch event;
  // the omitted Cloudflare env/context fields are not part of this test seam.
  return {
    kind: "Cloudflare.Workers.WorkerEvent",
    type: "fetch",
    input: request,
  } as never;
};

const invalidUrlFetchEvent = (): Cloudflare.WorkerEvent => {
  // SAFETY: This intentionally malformed fetch fixture reaches only the
  // adapter's URL parser; its input must not reach the standard receiver.
  return {
    kind: "Cloudflare.Workers.WorkerEvent",
    type: "fetch",
    input: { url: "not a valid URL" },
  } as never;
};

const scheduledEvent = (): Cloudflare.WorkerEvent => {
  // SAFETY: EventSourceLive inspects only the event discriminant before
  // falling through, so no scheduled-event payload is needed here.
  return {
    kind: "Cloudflare.Workers.WorkerEvent",
    type: "scheduled",
  } as never;
};

const invoke = async (
  listener: CapturedListener,
  event: Cloudflare.WorkerEvent,
): Promise<Response | undefined> => {
  const result = listener(event);
  return Effect.isEffect(result) ? Effect.runPromise(result) : result;
};

const runnableEffects = (
  listeners: readonly CapturedListener[],
  event: Cloudflare.WorkerEvent,
): Effect.Effect<Response | undefined>[] =>
  listeners.flatMap((listener) => {
    const result = listener(event);
    if (result === undefined) return [];
    return [Effect.isEffect(result) ? result : Effect.succeed(result)];
  });

const register = (
  harness: Harness,
  options: EventSourceOptions = {},
  handler: (event: XEvent) => Effect.Effect<void> = () => Effect.void,
) => provideAdapter(consumeEvents(options, handler), harness);

const makePlanStack = () => {
  const resources: Record<string, ResourceLike> = {};
  return {
    name: "CloudflareEventSourceTest",
    stage: "test",
    resources,
    bindings: {},
    actions: {},
  };
};

const registerAtPlan = (
  harness: Harness,
  stack: ReturnType<typeof makePlanStack>,
  options: EventSourceOptions,
) =>
  register(harness, options).pipe(
    // SAFETY: This in-memory Stack exposes every collection Resource uses to
    // register logical declarations; no provider or remote API is involved.
    Effect.provideService(Stack, stack as never),
    // SAFETY: Account Activity planning reads only users.getMe from this
    // boundary fixture; its response is a complete successful X envelope.
    Effect.provideService(
      XCredentialsContext,
      Effect.succeed({
        client: {
          users: {
            getMe: async () => ({
              value: { data: { id: "42" } },
              status: 200,
              headers: new Headers(),
            }),
          },
        },
      }) as never,
    ),
  );

describe("Cloudflare X event source", () => {
  test.serial("claims the exact event path and answers X CRC", async () => {
    const harness = makeHarness();
    await runAtRuntime(register(harness));

    const response = await invoke(
      harness.listener(),
      fetchEvent(
        new Request(`${workerOrigin}/__alchemy/x/events?crc_token=challenge`),
      ),
    );
    if (!(response instanceof Response)) {
      throw new Error("The claimed X event path did not return a response");
    }

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      response_token: "sha256=irqx1dRy5JW4DFxmzGWVFxG6lpxvhlzN6u8gBADXKl0=",
    });
    expect(harness.bindings).toEqual([
      "ALCHEMY_X_WEBHOOK_SECRET_RuntimeWorker",
    ]);
    expect(harness.secretReads()).toBe(1);
  });

  test.serial(
    "claims its path without also running the Worker's default fetch",
    async () => {
      const harness = makeHarness();
      let defaultFetches = 0;
      await runAtRuntime(register(harness, { path: "/api/x/webhook" }));
      await Effect.runPromise(
        harness.worker.serve(() =>
          Effect.sync(() => {
            defaultFetches++;
            return new Response("default");
          }),
        ),
      );

      const claimed = runnableEffects(
        harness.listeners(),
        fetchEvent(
          new Request(`${workerOrigin}/api/x/webhook?crc_token=challenge`),
        ),
      );
      expect(claimed).toHaveLength(1);
      const claimedResponse = await Effect.runPromise(claimed[0]!);
      expect(claimedResponse?.status).toBe(200);
      expect(defaultFetches).toBe(0);

      const unclaimed = runnableEffects(
        harness.listeners(),
        fetchEvent(new Request(`${workerOrigin}/health`)),
      );
      expect(unclaimed).toHaveLength(1);
      const unclaimedResponse = await Effect.runPromise(unclaimed[0]!);
      expect(await unclaimedResponse?.text()).toBe("default");
      expect(defaultFetches).toBe(1);
    },
  );

  test.serial(
    "falls through for unclaimed and malformed fetch URLs",
    async () => {
      const harness = makeHarness();
      await runAtRuntime(register(harness));

      const unmatched = await invoke(
        harness.listener(),
        fetchEvent(new Request(`${workerOrigin}/health`)),
      );
      const malformed = await invoke(
        harness.listener(),
        invalidUrlFetchEvent(),
      );

      expect(unmatched).toBeUndefined();
      expect(malformed).toBeUndefined();
      expect(harness.secretReads()).toBe(0);
    },
  );

  test.serial("falls through for non-fetch Worker events", async () => {
    const harness = makeHarness();
    await runAtRuntime(register(harness));

    const response = await invoke(harness.listener(), scheduledEvent());

    expect(response).toBeUndefined();
    expect(harness.secretReads()).toBe(0);
  });

  test.serial("rejects a second event source on the same Worker", async () => {
    const harness = makeHarness();
    const program = provideAdapter(
      Effect.gen(function* () {
        yield* consumeEvents(() => Effect.void);
        yield* consumeEvents(() => Effect.void);
      }),
      harness,
    );

    await expect(runAtRuntime(program)).rejects.toThrow(
      "Only one X event source can be registered per Cloudflare Worker",
    );
  });

  test.serial("keeps all remote resource work out of runtime", async () => {
    const harness = makeHarness();

    await runAtRuntime(
      register(
        harness,
        {
          accountActivity: true,
          activity: [
            {
              eventType: "post.mention.create",
              filter: { user_id: "42" },
            },
          ],
        },
        () => Effect.void,
      ),
    );

    expect(harness.listener()).toBeFunction();
    expect(harness.bindings).toEqual([
      "ALCHEMY_X_WEBHOOK_SECRET_RuntimeWorker",
    ]);
  });

  test.serial(
    "keeps named migration identities and namespaces unnamed resources",
    async () => {
      const subscriptions = {
        accountActivity: true,
        activity: [
          {
            eventType: "post.mention.create",
            filter: { user_id: "42" },
          },
        ],
      } as const;
      const unnamedHarness = makeHarness();
      const unnamedStack = makePlanStack();
      await runAtPlan(
        registerAtPlan(unnamedHarness, unnamedStack, subscriptions),
      );

      const namedHarness = makeHarness();
      const namedStack = makePlanStack();
      await runAtPlan(
        registerAtPlan(namedHarness, namedStack, {
          ...subscriptions,
          name: "Legacy",
        }),
      );

      expect(Object.keys(unnamedStack.resources)).toEqual([
        "RuntimeWorker/Webhook",
        "RuntimeWorker/Activity3brea5rlrod1o",
        "RuntimeWorker/AccountActivity",
      ]);
      expect(unnamedHarness.bindings).toEqual([
        "ALCHEMY_X_WEBHOOK_SECRET_RuntimeWorker",
      ]);
      expect(Object.keys(namedStack.resources)).toEqual([
        "LegacyWebhook",
        "LegacyActivity3brea5rlrod1o",
        "LegacyAccountActivity",
      ]);
      expect(namedHarness.bindings).toEqual([
        "ALCHEMY_X_1MSURLSSPB932_CONSUMER_SECRET",
      ]);
    },
  );
});
