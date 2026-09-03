import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { isResolved, type Input, Resource } from "alchemy";
import { Unowned } from "alchemy/AdoptPolicy";
import * as Provider from "alchemy/Provider";
import { XDecodeError } from "distilled-x";
import { XCredentials } from "./Credentials.ts";
import {
  callX,
  ignoreXNotFound,
  requireXData,
  XAdoptionRequired,
} from "./internal.ts";
import type * as X from "./Providers.ts";

export interface AccountActivitySubscriptionProps {
  readonly webhookId: Input<string>;
  /** X user ID that the OAuth token must identify. */
  readonly userId: Input<string>;
  /** Permit reconcile-time takeover of an exact, unowned semantic slot. */
  readonly adoptExisting?: boolean;
}

export interface AccountActivitySubscriptionAttributes {
  readonly webhookId: string;
  readonly userId: string;
  readonly subscribed: boolean;
}

export interface AccountActivitySubscription extends Resource<
  "X.AccountActivitySubscription",
  AccountActivitySubscriptionProps,
  AccountActivitySubscriptionAttributes,
  never,
  X.Providers
> {}

/** A full Account Activity subscription for the authenticated X user. @resource */
export const AccountActivitySubscription =
  Resource<AccountActivitySubscription>("X.AccountActivitySubscription");

export class XIdentityMismatch extends Schema.TaggedError<XIdentityMismatch>()(
  "XIdentityMismatch",
  {
    message: Schema.String,
    expectedUserId: Schema.String,
    actualUserId: Schema.String,
  },
) {}

export class XIdentityMissing extends Schema.TaggedError<XIdentityMissing>()(
  "XIdentityMissing",
  { message: Schema.String },
) {}

/** Resolve the current OAuth token's X user ID for direct resource declarations. */
export const currentUserId = Effect.gen(function* () {
  const { client } = yield* XCredentials;
  const identity = yield* callX(() => client.users.getMe());
  const userId = (yield* requireXData(
    identity,
    "reading the authenticated X user",
  )).id;
  return userId
    ? userId
    : yield* new XIdentityMissing({
        message: "X did not return the authenticated user identity",
      });
});

const subscribedUsers = Effect.fn(function* (webhookId: string) {
  const { client } = yield* XCredentials;
  const response = yield* callX(() =>
    client.accountActivity.listSubscriptions(webhookId),
  );
  const data = yield* requireXData(
    response,
    "listing X Account Activity subscriptions",
  );
  if (data.subscriptions === undefined) {
    return yield* Effect.fail(
      new XDecodeError(
        "X did not return the Account Activity subscription list",
        response.status,
        JSON.stringify(response.value),
      ),
    );
  }
  return data.subscriptions;
});

const deleteAccountActivitySubscription = Effect.fn(function* (
  webhookId: string,
  userId: string,
) {
  const { client } = yield* XCredentials;
  const deleted = yield* ignoreXNotFound(
    callX(() => client.accountActivity.deleteSubscription(webhookId, userId)),
  );
  if (
    deleted &&
    (yield* requireXData(
      deleted,
      "confirming X Account Activity unsubscription",
    )).subscribed !== false
  ) {
    return yield* Effect.fail(
      new XDecodeError(
        "X did not confirm Account Activity unsubscription",
        deleted.status,
        JSON.stringify(deleted.value),
      ),
    );
  }
});

const isResolvedStringInput = (
  value: Input<string> | undefined,
): value is string => typeof value === "string";

export const AccountActivitySubscriptionProvider = () =>
  Provider.succeed(AccountActivitySubscription, {
    diff: Effect.fn(({ olds, news, output }) =>
      Effect.sync(() => {
        if (!isResolved(news)) return;
        const currentWebhookId = output?.webhookId ?? olds.webhookId;
        const priorUserId = output?.userId ?? olds.userId;
        if (
          isResolvedStringInput(currentWebhookId) &&
          isResolvedStringInput(priorUserId) &&
          (currentWebhookId !== news.webhookId || priorUserId !== news.userId)
        ) {
          // Account Activity supports independent semantic slots, so preserve
          // the old subscription until the new identity/slot is confirmed.
          return { action: "replace" } as const;
        }
        return undefined;
      }),
    ),

    read: Effect.fn(function* ({ olds, output }) {
      const webhookId = output?.webhookId ?? olds.webhookId;
      const userId = output?.userId ?? olds.userId;
      if (!isResolvedStringInput(webhookId) || !isResolvedStringInput(userId)) {
        return undefined;
      }
      const users = yield* subscribedUsers(webhookId);
      if (!users.some((entry) => entry.user_id === userId)) return undefined;
      const attributes = { webhookId, userId, subscribed: true } as const;
      return output ? attributes : Unowned(attributes);
    }),

    reconcile: Effect.fn(function* ({ news, output }) {
      const { client } = yield* XCredentials;
      const userId = yield* currentUserId;
      // SAFETY: Alchemy calls reconcile only after resolving every Input prop.
      const desiredUserId = news.userId as string;
      if (desiredUserId !== userId) {
        return yield* new XIdentityMismatch({
          expectedUserId: desiredUserId,
          actualUserId: userId,
          message:
            `This resource targets X user ${desiredUserId}, but the current OAuth token belongs to ${userId}. ` +
            "Update the declared user ID or restore the intended X_ACCESS_TOKEN.",
        });
      }
      // SAFETY: the same reconcile boundary guarantees a concrete webhook ID.
      const webhookId = news.webhookId as string;
      const users = yield* subscribedUsers(webhookId);
      const alreadySubscribed = users.some((entry) => entry.user_id === userId);
      const ownsDesired =
        output !== undefined &&
        output.webhookId === webhookId &&
        output.userId === userId;
      if (alreadySubscribed && !ownsDesired) {
        if (news.adoptExisting !== true) {
          return yield* new XAdoptionRequired({
            resourceType: "X.AccountActivitySubscription",
            remoteId: `${webhookId}:${userId}`,
            message:
              "An Account Activity subscription appeared after the ownership check. Refusing to claim the unmarked semantic slot. Re-run with Alchemy's normal adoption flow, or declare adoptExisting: true before a future race.",
          });
        }
      }
      if (!alreadySubscribed) {
        const created = yield* callX(() =>
          client.accountActivity.createSubscription(webhookId),
        ).pipe(Effect.result);
        if (created._tag === "Failure") {
          const raced = yield* subscribedUsers(webhookId);
          if (raced.some((entry) => entry.user_id === userId)) {
            if (news.adoptExisting !== true) {
              return yield* new XAdoptionRequired({
                resourceType: "X.AccountActivitySubscription",
                remoteId: `${webhookId}:${userId}`,
                message:
                  "An Account Activity subscription appeared after the ownership check. Refusing to adopt the unmarked semantic slot. Re-run with Alchemy's normal adoption flow, or declare adoptExisting: true before a future race.",
              });
            }
          } else {
            return yield* Effect.fail(created.failure);
          }
        } else if (
          (yield* requireXData(
            created.success,
            "confirming X Account Activity subscription",
          )).subscribed !== true
        ) {
          return yield* Effect.fail(
            new XDecodeError(
              "X did not confirm the Account Activity subscription",
              created.success.status,
              JSON.stringify(created.success.value),
            ),
          );
        }
      }
      if (
        output &&
        (output.webhookId !== webhookId || output.userId !== userId)
      ) {
        // An upstream Output can change after planning, causing Alchemy to
        // route this through update rather than replacement. Confirm the new
        // semantic slot first, then remove the old one explicitly.
        yield* deleteAccountActivitySubscription(
          output.webhookId,
          output.userId,
        );
      }
      return { webhookId, userId, subscribed: true };
    }),

    delete: Effect.fn(function* ({ output }) {
      yield* deleteAccountActivitySubscription(output.webhookId, output.userId);
    }),
  });
