import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { deepEqual, isResolved, type Input, Resource } from "alchemy";
import { Unowned } from "alchemy/AdoptPolicy";
import * as Provider from "alchemy/Provider";
import {
  XDecodeError,
  type XActivityEventType,
  type XActivityFilter,
  type XActivitySubscription as ApiSubscription,
  type XAuthKind,
} from "distilled-x";
import { XAppCredentials, XCredentials } from "./Credentials.ts";
import {
  assertXAuthoritative,
  callX,
  ignoreXNotFound,
  requireXData,
  stableId,
} from "./internal.ts";
import type * as X from "./Providers.ts";

export interface ActivitySubscriptionProps {
  readonly eventType: XActivityEventType;
  readonly filter: XActivityFilter;
  readonly webhookId: Input<string>;
  /** A non-empty caller label. Defaults to an Alchemy ownership tag. */
  readonly tag?: string;
  /**
   * Override request authentication. Public events default to app context;
   * private chat, DM, like, mute, and block events default to user context.
   */
  readonly auth?: XAuthKind;
}

export interface ActivitySubscriptionAttributes {
  readonly subscriptionId: string;
  readonly eventType: XActivityEventType;
  readonly filter: XActivityFilter;
  readonly webhookId?: string;
  readonly tag?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface ActivitySubscription extends Resource<
  "X.ActivitySubscription",
  ActivitySubscriptionProps,
  ActivitySubscriptionAttributes,
  never,
  X.Providers
> {}

/** A granular X Activity subscription delivered to an X webhook. @resource */
export const ActivitySubscription = Resource<ActivitySubscription>(
  "X.ActivitySubscription",
);

const toAttributes = (
  subscription: ApiSubscription,
): ActivitySubscriptionAttributes => ({
  subscriptionId: subscription.subscription_id,
  eventType: subscription.event_type,
  filter: subscription.filter,
  ...(subscription.webhook_id !== undefined
    ? { webhookId: subscription.webhook_id }
    : {}),
  ...(subscription.tag !== undefined ? { tag: subscription.tag } : {}),
  ...(subscription.created_at !== undefined
    ? { createdAt: subscription.created_at }
    : {}),
  ...(subscription.updated_at !== undefined
    ? { updatedAt: subscription.updated_at }
    : {}),
});

const ownershipTag = (
  instanceId: string,
  fqn: string,
  explicit?: string,
): string => {
  const marker = `alchemy:${stableId(`${instanceId}\0${fqn}`)}`;
  const value = explicit === undefined ? marker : `${marker}:${explicit}`;
  if (value.length === 0 || value.length > 200) {
    throw new TypeError("X activity subscription tag must be 1-200 characters");
  }
  return value;
};

const USER_CONTEXT_EVENTS = new Set<XActivityEventType>([
  "broadcast.chat",
  "post.mention.create",
  "post.reply.create",
  "post.quote.create",
  "post.repost.create",
]);

const USER_CONTEXT_PREFIXES = ["chat.", "dm.", "like.", "mute.", "block."];

/** Map deprecated request aliases to the canonical value X returns. */
export const normalizeActivityEventType = (
  eventType: XActivityEventType,
): XActivityEventType =>
  eventType === "chat.conversation_join" ? "chat.conversation.join" : eventType;

export const defaultActivityAuth = (eventType: XActivityEventType): XAuthKind =>
  USER_CONTEXT_EVENTS.has(normalizeActivityEventType(eventType)) ||
  USER_CONTEXT_PREFIXES.some((prefix) => eventType.startsWith(prefix))
    ? "user"
    : "app";

export class XOAuthScopeMissing extends Schema.TaggedError<XOAuthScopeMissing>()(
  "XOAuthScopeMissing",
  {
    message: Schema.String,
    eventType: Schema.String,
    requiredScope: Schema.String,
  },
) {}

const requiredActivityScope = (
  eventType: XActivityEventType,
): string | undefined => {
  const normalized = normalizeActivityEventType(eventType);
  if (normalized === "broadcast.chat") return "broadcast.read";
  if (normalized.startsWith("chat.") || normalized.startsWith("dm.")) {
    return "dm.read";
  }
  if (normalized.startsWith("like.")) return "like.read";
  if (normalized.startsWith("mute.")) return "mute.read";
  if (normalized.startsWith("block.")) return "block.read";
  if (normalized.startsWith("post.")) return "tweet.read";
  return undefined;
};

const sameSubscription = (
  subscription: ApiSubscription,
  desired: {
    readonly eventType: XActivityEventType;
    readonly filter: XActivityFilter;
    readonly webhookId: string;
    readonly tag: string;
  },
): boolean =>
  normalizeActivityEventType(subscription.event_type) ===
    normalizeActivityEventType(desired.eventType) &&
  deepEqual(subscription.filter, desired.filter) &&
  subscription.webhook_id === desired.webhookId &&
  subscription.tag === desired.tag;

const listAll = Effect.fn(function* () {
  const { client } = yield* XAppCredentials;
  const pages = yield* callX(async () => {
    const values = [];
    for await (const page of client.activity.iterateSubscriptions({
      auth: "app",
    })) {
      values.push(page);
    }
    return values;
  });
  const subscriptions: ApiSubscription[] = [];
  for (const page of pages) {
    subscriptions.push(
      ...(yield* requireXData(page, "listing X Activity subscriptions")),
    );
  }
  return subscriptions;
});

const deleteActivitySubscription = Effect.fn(function* (
  subscriptionId: string,
) {
  const { client } = yield* XAppCredentials;
  const deleted = yield* ignoreXNotFound(
    callX(() => client.activity.deleteSubscription(subscriptionId)),
  );
  if (
    deleted &&
    (yield* requireXData(
      deleted,
      "confirming X Activity subscription deletion",
    )).deleted !== true
  ) {
    return yield* Effect.fail(
      new XDecodeError(
        "X did not confirm activity subscription deletion",
        deleted.status,
        JSON.stringify(deleted.value),
      ),
    );
  }
});

export const ActivitySubscriptionProvider = () =>
  Provider.succeed(ActivitySubscription, {
    diff: Effect.fn(function* ({ olds, news }) {
      if (!isResolved(news)) return;
      if (
        normalizeActivityEventType(olds.eventType) !==
          normalizeActivityEventType(news.eventType) ||
        !deepEqual(olds.filter, news.filter)
      ) {
        return { action: "replace" } as const;
      }
      return undefined;
    }),

    read: Effect.fn(function* ({ fqn, instanceId, olds, output }) {
      const subscriptions = yield* listAll();
      if (!output) {
        const desired = {
          eventType: normalizeActivityEventType(olds.eventType),
          filter: olds.filter,
          webhookId: olds.webhookId as string,
          tag: ownershipTag(instanceId, fqn, olds.tag),
        };
        const owned = subscriptions.find((candidate) =>
          sameSubscription(candidate, desired),
        );
        if (owned) return toAttributes(owned);

        // An explicit caller tag is also a useful natural key for intentional
        // adoption. It is upgraded to the reserved ownership tag on reconcile.
        if (olds.tag !== undefined) {
          const adoptable = subscriptions.find(
            (candidate) =>
              normalizeActivityEventType(candidate.event_type) ===
                normalizeActivityEventType(olds.eventType) &&
              deepEqual(candidate.filter, olds.filter) &&
              candidate.webhook_id === olds.webhookId &&
              candidate.tag === olds.tag,
          );
          if (adoptable) return Unowned(toAttributes(adoptable));
        }
        return undefined;
      }
      const observed = subscriptions.find(
        (candidate) => candidate.subscription_id === output.subscriptionId,
      );
      return observed ? toAttributes(observed) : undefined;
    }),

    reconcile: Effect.fn(function* ({ fqn, instanceId, news, output }) {
      const appCredentials = yield* XAppCredentials;
      const tag = ownershipTag(instanceId, fqn, news.tag);
      const webhookId = news.webhookId as string;
      const desired = {
        eventType: normalizeActivityEventType(news.eventType),
        filter: news.filter,
        webhookId,
        tag,
      };
      const subscriptions = yield* listAll();
      const observed =
        subscriptions.find(
          (candidate) => candidate.subscription_id === output?.subscriptionId,
        ) ??
        subscriptions.find((candidate) => sameSubscription(candidate, desired));

      const auth = news.auth ?? defaultActivityAuth(news.eventType);
      const requiredScope =
        auth === "user" ? requiredActivityScope(news.eventType) : undefined;

      const createDesired = Effect.gen(function* () {
        const userCredentials =
          auth === "user" ? yield* XCredentials : undefined;
        if (
          requiredScope !== undefined &&
          userCredentials?.oauthScopes !== undefined &&
          !userCredentials.oauthScopes.includes(requiredScope)
        ) {
          return yield* new XOAuthScopeMissing({
            eventType: news.eventType,
            requiredScope,
            message: `X Activity event ${news.eventType} needs OAuth scope ${requiredScope}. Re-run alchemy login --configure and authorize that scope.`,
          });
        }
        const client = userCredentials?.client ?? appCredentials.client;
        const created = yield* callX(() =>
          client.activity.createSubscription(
            {
              event_type: desired.eventType,
              filter: desired.filter,
              webhook_id: desired.webhookId,
              tag: desired.tag,
            },
            { auth },
          ),
        );
        yield* assertXAuthoritative(
          created,
          "creating an X Activity subscription",
        );
        const responseSubscription = client.activity.normalizeSubscription(
          created.value,
        );
        if (
          responseSubscription &&
          sameSubscription(responseSubscription, desired)
        ) {
          return responseSubscription;
        }

        // X's response schema permits webhook_id/tag to be omitted. Re-read
        // before committing so a nominal 2xx cannot silently lose delivery
        // routing or the ownership marker.
        const refreshed = (yield* listAll()).find((candidate) =>
          responseSubscription
            ? candidate.subscription_id === responseSubscription.subscription_id
            : sameSubscription(candidate, desired),
        );
        if (!refreshed || !sameSubscription(refreshed, desired)) {
          return yield* Effect.fail(
            new XDecodeError(
              "X did not expose the created Activity subscription with the declared webhook and ownership tag",
              created.status,
              JSON.stringify(created.value),
            ),
          );
        }
        return refreshed;
      });

      const deduplicateDesired = Effect.fn(function* (
        fallback: ApiSubscription,
      ) {
        const matches = (yield* listAll())
          .filter((candidate) => sameSubscription(candidate, desired))
          .sort((left, right) =>
            left.subscription_id.localeCompare(right.subscription_id),
          );
        const winner = matches[0] ?? fallback;
        for (const duplicate of matches.slice(1)) {
          yield* deleteActivitySubscription(duplicate.subscription_id);
        }
        return winner;
      });

      const createOrRecover = Effect.gen(function* () {
        const created = yield* createDesired.pipe(Effect.result);
        if (created._tag === "Success") {
          return yield* deduplicateDesired(created.success);
        }
        const raced = (yield* listAll()).find((candidate) =>
          sameSubscription(candidate, desired),
        );
        return raced
          ? yield* deduplicateDesired(raced)
          : yield* Effect.fail(created.failure);
      });

      if (!observed) {
        return toAttributes(yield* createOrRecover);
      }

      if (
        normalizeActivityEventType(observed.event_type) !== desired.eventType ||
        !deepEqual(observed.filter, desired.filter)
      ) {
        // Immutable drift is repaired create-first so a failed create never
        // interrupts delivery from the currently-owned subscription.
        const matching = subscriptions.find((candidate) =>
          sameSubscription(candidate, desired),
        );
        const replacement = matching
          ? yield* deduplicateDesired(matching)
          : yield* createOrRecover;
        if (replacement.subscription_id !== observed.subscription_id) {
          yield* deleteActivitySubscription(observed.subscription_id);
        }
        return toAttributes(replacement);
      }

      if (observed.webhook_id !== webhookId || observed.tag !== tag) {
        const updated = yield* callX(() =>
          appCredentials.client.activity.updateSubscription(
            observed.subscription_id,
            {
              webhook_id: webhookId,
              tag,
            },
          ),
        );
        yield* assertXAuthoritative(
          updated,
          "updating an X Activity subscription",
        );
        const normalized = appCredentials.client.activity.normalizeSubscription(
          updated.value,
        );
        const refreshed =
          normalized && sameSubscription(normalized, desired)
            ? normalized
            : (yield* listAll()).find(
                (candidate) =>
                  candidate.subscription_id === observed.subscription_id,
              );
        if (!refreshed || !sameSubscription(refreshed, desired)) {
          return yield* Effect.fail(
            new XDecodeError(
              "X did not expose the updated Activity subscription with the declared webhook and ownership tag",
              updated.status,
              JSON.stringify(updated.value),
            ),
          );
        }
        return toAttributes(yield* deduplicateDesired(refreshed));
      }

      return toAttributes(yield* deduplicateDesired(observed));
    }),

    list: Effect.fn(function* () {
      return (yield* listAll()).map(toAttributes);
    }),

    delete: Effect.fn(function* ({ fqn, instanceId, olds, output }) {
      const subscriptions = yield* listAll();
      const tag = output.tag ?? ownershipTag(instanceId, fqn, olds.tag);
      const webhookId = output.webhookId ?? olds.webhookId;
      const ownedIds = new Set(
        subscriptions
          .filter(
            (candidate) =>
              candidate.subscription_id === output.subscriptionId ||
              (candidate.tag === tag &&
                normalizeActivityEventType(candidate.event_type) ===
                  normalizeActivityEventType(output.eventType) &&
                deepEqual(candidate.filter, output.filter) &&
                candidate.webhook_id === webhookId),
          )
          .map((candidate) => candidate.subscription_id),
      );
      ownedIds.add(output.subscriptionId);
      yield* Effect.forEach(ownedIds, deleteActivitySubscription, {
        concurrency: 1,
      });
    }),
  });
