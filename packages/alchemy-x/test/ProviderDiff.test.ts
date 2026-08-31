import { describe, expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import {
  AccountActivitySubscription,
  AccountActivitySubscriptionProvider,
} from "../src/AccountActivitySubscription.ts";
import {
  ActivitySubscription,
  ActivitySubscriptionProvider,
} from "../src/ActivitySubscription.ts";
import { Webhook, WebhookProvider } from "../src/Webhook.ts";

const input = {
  id: "Resource",
  fqn: "Resource",
  instanceId: "test",
  oldBindings: [],
  newBindings: [],
  output: undefined,
};

describe("Alchemy X provider diffs", () => {
  test("updates webhook URL changes inside one collision-checked provider action", async () => {
    const diff = await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* Webhook.Provider;
        return yield* provider.diff!({
          ...input,
          olds: { url: "https://old.example.com/x" },
          news: { url: "https://new.example.com/x" },
        });
      }).pipe(Effect.provide(WebhookProvider())),
    );

    expect(diff).toEqual({ action: "update" });
  });

  test("updates a webhook when only revalidation policy changes", async () => {
    const diff = await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* Webhook.Provider;
        return yield* provider.diff!({
          ...input,
          olds: {
            url: "https://events.example.com/x",
            revalidateInvalid: false,
          },
          news: {
            url: "https://events.example.com/x",
            revalidateInvalid: true,
          },
        });
      }).pipe(Effect.provide(WebhookProvider())),
    );

    expect(diff).toBeUndefined();
  });

  test("resumes creates whose upstream outputs were unresolved", async () => {
    const [webhookDiff, accountDiff] = await Effect.runPromise(
      Effect.all([
        Effect.gen(function* () {
          const provider = yield* Webhook.Provider;
          // SAFETY: This fixture intentionally recreates an interrupted plan in
          // which a required upstream Output had not resolved into stored props.
          return yield* provider.diff!({
            ...input,
            olds: { url: undefined as never },
            news: { url: "https://events.example.com/x" },
          });
        }).pipe(Effect.provide(WebhookProvider())),
        Effect.gen(function* () {
          const provider = yield* AccountActivitySubscription.Provider;
          // SAFETY: Both required identities are deliberately absent to model
          // the same unresolved-Output retry state accepted by the provider.
          return yield* provider.diff!({
            ...input,
            olds: { webhookId: undefined as never, userId: undefined as never },
            news: { webhookId: "10", userId: "42" },
          });
        }).pipe(Effect.provide(AccountActivitySubscriptionProvider())),
      ]),
    );

    expect(webhookDiff).toBeUndefined();
    expect(accountDiff).toBeUndefined();
  });

  test("replaces immutable Activity fields but not mutable routing", async () => {
    const immutable = await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* ActivitySubscription.Provider;
        return yield* provider.diff!({
          ...input,
          olds: {
            eventType: "post.create",
            filter: { user_id: "1" },
            webhookId: "10",
          },
          news: {
            eventType: "post.create",
            filter: { user_id: "2" },
            webhookId: "10",
          },
        });
      }).pipe(Effect.provide(ActivitySubscriptionProvider())),
    );
    const mutable = await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* ActivitySubscription.Provider;
        return yield* provider.diff!({
          ...input,
          olds: {
            eventType: "post.create",
            filter: { user_id: "1" },
            webhookId: "10",
          },
          news: {
            eventType: "post.create",
            filter: { user_id: "1" },
            webhookId: "11",
          },
        });
      }).pipe(Effect.provide(ActivitySubscriptionProvider())),
    );

    expect(immutable).toEqual({ action: "replace" });
    expect(mutable).toBeUndefined();
  });

  test("replaces Account Activity when the webhook changes", async () => {
    const diff = await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* AccountActivitySubscription.Provider;
        return yield* provider.diff!({
          ...input,
          olds: { webhookId: "10", userId: "42" },
          news: { webhookId: "11", userId: "42" },
        });
      }).pipe(Effect.provide(AccountActivitySubscriptionProvider())),
    );

    expect(diff).toEqual({ action: "replace" });
  });

  test("uses live output identity when retry props already contain the new values", async () => {
    const [webhookDiff, accountDiff] = await Effect.runPromise(
      Effect.all([
        Effect.gen(function* () {
          const provider = yield* Webhook.Provider;
          return yield* provider.diff!({
            ...input,
            output: {
              webhookId: "10",
              url: "https://old.example.com/x",
              valid: true,
              createdAt: "2026-08-31T00:00:00Z",
            },
            olds: { url: "https://new.example.com/x" },
            news: { url: "https://new.example.com/x" },
          });
        }).pipe(Effect.provide(WebhookProvider())),
        Effect.gen(function* () {
          const provider = yield* AccountActivitySubscription.Provider;
          return yield* provider.diff!({
            ...input,
            output: { webhookId: "10", userId: "42", subscribed: true },
            olds: { webhookId: "11", userId: "42" },
            news: { webhookId: "11", userId: "42" },
          });
        }).pipe(Effect.provide(AccountActivitySubscriptionProvider())),
      ]),
    );

    expect(webhookDiff).toEqual({ action: "update" });
    expect(accountDiff).toEqual({ action: "replace" });
  });
});
