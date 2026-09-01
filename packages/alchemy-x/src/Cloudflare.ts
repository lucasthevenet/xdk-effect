import * as Cloudflare from "alchemy/Cloudflare";
import type { InputProps } from "alchemy/Input";
import * as Namespace from "alchemy/Namespace";
import * as Output from "alchemy/Output";
import { sanitizeKey } from "alchemy/RuntimeContext";
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
import { XAppCredentials } from "./Credentials.ts";
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

// SAFETY: Cloudflare fetch events carry the runtime's WHATWG Request. The
// package's external worker declarations omit browser-only metadata fields,
// but the runtime object implements the standard Request used by the receiver.
const toStandardRequest = (input: CloudflareFetchRequest): Request =>
  input as PortableRequest;

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

const notFound = (): Response => new Response("Not Found", { status: 404 });

/**
 * X event source for Cloudflare Workers.
 *
 * Planning provisions the app-wide webhook and requested subscriptions after
 * the Worker URL becomes reachable. Runtime initialization claims the exact
 * event path and delegates CRC and signed deliveries to the shared receiver.
 *
 * This adapter must be the Worker's only fetch listener with Alchemy beta.75.
 * That runtime combines simultaneous fetch responses by discarding both, so a
 * second Worker `fetch` handler is unsupported. Unmatched paths receive 404.
 * Set a stable EventSource `name` before the first persistent deployment;
 * unnamed resource identities follow the Worker's logical namespace.
 */
export const EventSourceLive = Layer.effect(
  EventSource,
  Effect.gen(function* () {
    const worker = yield* Cloudflare.Worker;
    // Yielding the resource classes erases their provider requirements here;
    // the stack satisfies those requirements through X.providers() at plan time.
    const createWebhook = yield* Webhook;
    const createActivitySubscription = yield* ActivitySubscription;
    const createAccountActivitySubscription =
      yield* AccountActivitySubscription;
    let registered = false;

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
      const consumerSecret = yield* Output.named(
        Output.fromEffect(
          XAppCredentials.pipe(
            Effect.map((credentials) => credentials.consumerSecret),
          ),
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

        const request = toStandardRequest(event.input);
        let pathname: string;
        try {
          pathname = new URL(request.url).pathname;
        } catch {
          return Effect.succeed(notFound());
        }
        if (pathname !== path) return Effect.succeed(notFound());
        return receive(request);
      });
    }) as EventSourceService;
  }),
);
