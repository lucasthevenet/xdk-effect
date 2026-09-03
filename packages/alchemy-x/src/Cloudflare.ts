import * as Hmac from "effect-xdk/Hmac";
import * as Cloudflare from "alchemy/Cloudflare";
import type { InputProps } from "alchemy/Input";
import * as Namespace from "alchemy/Namespace";
import * as Output from "alchemy/Output";
import {
  CurrentRuntimeContext,
  sanitizeKey,
  type BaseRuntimeContext,
} from "alchemy/RuntimeContext";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import {
  AccountActivitySubscription,
  currentUserId,
  type AccountActivitySubscriptionProps,
} from "./AccountActivitySubscription.ts";
import {
  ActivitySubscription,
  normalizeActivityEventType,
  type ActivitySubscriptionProps,
} from "./ActivitySubscription.ts";
import { XCredentials } from "./Credentials.ts";
import {
  EventSource,
  type EventHandler,
  type EventSourceOptions,
  type EventSourceService,
} from "./EventSource.ts";
import { stableId, stableJson } from "./internal.ts";
import * as EventReceiver from "./internal/EventReceiver.ts";
import { Webhook, type WebhookProps } from "./Webhook.ts";

interface WebhookPropsBuilder {
  url: WebhookProps["url"];
}

type Mutable<T> = { -readonly [Key in keyof T]: T[Key] };

type ActivitySubscriptionPropsBuilder = Mutable<
  InputProps<ActivitySubscriptionProps>
>;

interface AccountActivitySubscriptionPropsBuilder {
  webhookId: AccountActivitySubscriptionProps["webhookId"];
  userId: AccountActivitySubscriptionProps["userId"];
}

const webhookSecretEnvName = (
  workerLogicalId: string,
  compatibilityName?: string,
): string =>
  compatibilityName === undefined
    ? `ALCHEMY_X_WEBHOOK_SECRET_${sanitizeKey(workerLogicalId)}`
    : `ALCHEMY_X_${stableId(compatibilityName).toUpperCase()}_CONSUMER_SECRET`;

type CloudflareFetchRequest = Extract<
  Cloudflare.WorkerEvent,
  { readonly type: "fetch" }
>["input"];

type PortableRequest = CloudflareFetchRequest & Request;

type WorkerListener<A = unknown, R = never> = (
  event: Cloudflare.WorkerEvent,
) => Effect.Effect<A, never, R> | void;

type WorkerRoutingContext = Pick<
  Effect.Success<typeof Cloudflare.Worker>,
  "listen" | "serve"
>;

const isWorkerRoutingContext = (
  runtime: BaseRuntimeContext,
): runtime is BaseRuntimeContext & WorkerRoutingContext =>
  typeof runtime.serve === "function" &&
  "listen" in runtime &&
  typeof runtime.listen === "function";

// SAFETY: Cloudflare fetch events carry the runtime's WHATWG Request. The
// package's external worker declarations omit browser-only metadata fields,
// but the runtime object implements the standard Request used by the receiver.
const toStandardRequest = (input: CloudflareFetchRequest): Request =>
  input as PortableRequest;

const requestPath = (request: { readonly url: string }): string | undefined => {
  try {
    return new URL(request.url).pathname;
  } catch {
    return undefined;
  }
};

/**
 * Keep the Worker's default fetch handler from also claiming event-source
 * paths. Alchemy runs overlapping listeners concurrently and
 * discards both response values, so the exclusion has to happen before the
 * default listener returns an Effect.
 */
const excludeClaimedPathsFromDefaultFetch = (
  runtime: WorkerRoutingContext,
  paths: ReadonlySet<string>,
): void => {
  const serve = runtime.serve.bind(runtime);

  runtime.serve = (handler, options) => {
    const previousListen = runtime.listen;
    const filter =
      <A, R>(listener: WorkerListener<A, R>): WorkerListener<A, R> =>
      (event) => {
        if (
          Cloudflare.isWorkerEvent(event) &&
          event.type === "fetch" &&
          paths.has(requestPath(event.input) ?? "")
        ) {
          return undefined;
        }
        return listener(event);
      };

    // SAFETY: `serve` registers a concrete Worker listener; this wrapper keeps
    // both overloads while adding only a path predicate to that listener.
    runtime.listen = (<A, R>(listener: WorkerListener<A, R>) =>
      previousListen(filter(listener))) as typeof runtime.listen;
    try {
      return serve(handler, options);
    } finally {
      runtime.listen = previousListen;
    }
  };
};

const activityLogicalId = (
  activity: NonNullable<EventSourceOptions["activity"]>[number],
): string =>
  stableId(
    activity.name !== undefined
      ? `name:${activity.name}`
      : stableJson([
          normalizeActivityEventType(activity.eventType),
          activity.filter,
        ]),
  );

/**
 * X event source for Cloudflare Workers.
 *
 * Planning provisions the app-wide webhook and requested subscriptions after
 * the Worker URL becomes reachable. Runtime initialization claims the exact
 * event path and delegates CRC and signed deliveries to the shared receiver.
 *
 * The Worker's normal fetch handler continues to own every unclaimed path.
 * Alchemy discards simultaneous listener responses, so the adapter
 * excludes this source's path from the listener registered by Worker.serve.
 * Set a stable EventSource `name` before the first persistent deployment;
 * unnamed resource identities follow the Worker's logical namespace.
 */
export const EventSourceLive = Layer.effect(
  EventSource,
  Effect.gen(function* () {
    const worker = yield* Cloudflare.Worker;
    const runtime = yield* CurrentRuntimeContext;
    if (!runtime || !isWorkerRoutingContext(runtime)) {
      return yield* Effect.die(
        new TypeError(
          "X.Cloudflare.EventSourceLive requires a Worker runtime with listen and serve",
        ),
      );
    }
    // Yielding the resource classes erases their provider requirements here;
    // the stack satisfies those requirements through X.providers() at plan time.
    const createWebhook = yield* Webhook;
    const createActivitySubscription = yield* ActivitySubscription;
    const createAccountActivitySubscription =
      yield* AccountActivitySubscription;
    const paths = new Set<string>();
    let registered = false;
    // Platform copies runtime methods onto the Worker instance but invokes
    // serve on the original runtime. Wrap that object, not its resource copy.
    excludeClaimedPathsFromDefaultFetch(runtime, paths);

    // SAFETY: Resource constructors are satisfied by X.providers() during
    // planning. Worker.listen deliberately retains the handler environment R
    // so its services propagate to the Worker composition root.
    return Effect.fn(function* <E, R>(
      options: EventSourceOptions,
      handler: EventHandler<E, R>,
    ) {
      if (registered) {
        return yield* Effect.die(
          new TypeError(
            "Only one X event source can be registered per Cloudflare Worker",
          ),
        );
      }
      registered = true;

      const path = EventReceiver.eventSourcePath(options.path);
      paths.add(path);
      const consumerSecret = yield* Output.named(
        Output.fromEffect(
          XCredentials.pipe(Effect.map((credentials) => credentials.apiSecret)),
        ),
        webhookSecretEnvName(worker.LogicalId, options.name),
      );

      if (!globalThis["__ALCHEMY_RUNTIME__"]) {
        const declareResources = Effect.gen(function* () {
          const webhookProps: WebhookPropsBuilder = {
            url: Output.interpolate`${worker.url}${path}`,
          };
          const webhookId =
            options.name === undefined ? "Webhook" : `${options.name}Webhook`;
          const webhook = yield* createWebhook(webhookId, webhookProps);

          const activityIds = new Set<string>();
          for (const activity of options.activity ?? []) {
            const id = activityLogicalId(activity);
            if (activityIds.has(id)) {
              return yield* Effect.die(
                new TypeError(
                  "Duplicate X activity declaration; provide a unique activity name",
                ),
              );
            }
            activityIds.add(id);

            const props: ActivitySubscriptionPropsBuilder = {
              eventType: activity.eventType,
              filter: activity.filter,
              webhookId: webhook.webhookId,
            };
            if (activity.tag !== undefined) props.tag = activity.tag;
            if (activity.auth !== undefined) props.auth = activity.auth;
            const activityId =
              options.name === undefined
                ? `Activity${id}`
                : `${options.name}Activity${id}`;
            yield* createActivitySubscription(activityId, props);
          }

          if (options.accountActivity) {
            const props: AccountActivitySubscriptionPropsBuilder = {
              webhookId: webhook.webhookId,
              userId: yield* currentUserId,
            };
            const accountActivityId =
              options.name === undefined
                ? "AccountActivity"
                : `${options.name}AccountActivity`;
            yield* createAccountActivitySubscription(accountActivityId, props);
          }
        });

        // A compatibility name keeps the exact ambient resource identities
        // created by WebhookRoute. New declarations live below the Worker.
        yield* options.name === undefined
          ? Namespace.push(worker.LogicalId, declareResources)
          : declareResources;
      }

      const receive =
        options.maxBodyBytes === undefined
          ? EventReceiver.makeEventReceiver(handler, consumerSecret)
          : EventReceiver.makeEventReceiver(
              handler,
              consumerSecret,
              options.maxBodyBytes,
            );

      yield* worker.listen((event) => {
        if (!Cloudflare.isWorkerEvent(event) || event.type !== "fetch") return;

        if (requestPath(event.input) !== path) return;
        return receive(toStandardRequest(event.input)).pipe(
          Effect.provide(Hmac.layerSubtle),
        );
      });
    }) as EventSourceService;
  }),
);
