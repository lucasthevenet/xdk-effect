import * as Hmac from "effect-xdk/Hmac";
import * as BrowserCrypto from "@effect/platform-browser/BrowserCrypto";
import { expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import { CredentialsFromEnv } from "effect-xdk/Credentials";
import { getUsersMe } from "effect-xdk/users";
import { getWebhooks } from "effect-xdk/webhooks";
import * as AccountActivity from "effect-xdk/account-activity";
import { requireXData } from "../../src/internal.ts";

const liveTest = process.env.X_LIVE === "1" ? test : test.skip;
const mutationTest =
  process.env.X_LIVE === "1" && process.env.X_LIVE_MUTATE === "1"
    ? test
    : test.skip;
const run = <A, E>(effect: Effect.Effect<A, E, AccountActivity.XOpContext>) =>
  Effect.runPromise(
    effect.pipe(
      Effect.provide(CredentialsFromEnv),
      Effect.provide(FetchHttpClient.layer),
      Effect.provide(BrowserCrypto.layer),
      Effect.provide(Hmac.layerSubtle),
    ),
  );

liveTest("reads the OAuth user and app webhooks", async () => {
  await run(
    Effect.gen(function* () {
      const [identity, webhooks] = yield* Effect.all(
        [getUsersMe({}), getWebhooks({})],
        { concurrency: 2 },
      );
      expect(
        (yield* requireXData(identity, "reading the live user")).id,
      ).toBeTruthy();
      expect(
        Array.isArray(yield* requireXData(webhooks, "listing live webhooks")),
      ).toBe(true);
    }),
  );
});

mutationTest(
  "creates and removes Account Activity with OAuth 1.0a user context",
  async () => {
    const webhook_id = process.env.X_LIVE_WEBHOOK_ID;
    if (!webhook_id) throw new Error("Missing X_LIVE_WEBHOOK_ID");
    await run(
      Effect.gen(function* () {
        const user_id = (yield* requireXData(
          yield* getUsersMe({}),
          "reading the live user",
        )).id;
        const before = yield* requireXData(
          yield* AccountActivity.getAccountActivitySubscriptions({
            webhook_id,
          }),
          "checking existing live subscriptions",
        );
        if (
          !before.subscriptions ||
          before.subscriptions.some((entry) => entry.user_id === user_id)
        )
          return yield* Effect.die(
            new Error("Cannot establish an unowned live subscription slot"),
          );
        yield* Effect.acquireUseRelease(
          AccountActivity.createAccountActivitySubscription({
            webhook_id,
          }).pipe(
            Effect.flatMap((response) =>
              requireXData(response, "creating a live subscription"),
            ),
            Effect.tap((data) =>
              Effect.sync(() => expect(data.subscribed).toBe(true)),
            ),
          ),
          () =>
            AccountActivity.validateAccountActivitySubscription({
              webhook_id,
            }).pipe(
              Effect.flatMap((response) =>
                requireXData(response, "validating a live subscription"),
              ),
              Effect.tap((data) =>
                Effect.sync(() => expect(data.subscribed).toBe(true)),
              ),
            ),
          () =>
            AccountActivity.deleteAccountActivitySubscription({
              webhook_id,
              user_id,
            }).pipe(Effect.orDie),
        );
      }),
    );
  },
);
