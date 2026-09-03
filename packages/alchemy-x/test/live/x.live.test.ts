import { expect, test } from "bun:test";
import { createXClient } from "distilled-x";

const liveTest = process.env.X_LIVE === "1" ? test : test.skip;
const mutationTest =
  process.env.X_LIVE === "1" && process.env.X_LIVE_MUTATE === "1"
    ? test
    : test.skip;

const required = (name: string): string => {
  const value = process.env[name];
  if (!value)
    throw new Error(`Missing live-test environment variable: ${name}`);
  return value;
};

const client = () =>
  createXClient({
    apiKey: required("X_API_KEY"),
    apiSecret: required("X_API_SECRET"),
    accessToken: required("X_ACCESS_TOKEN"),
    accessTokenSecret: required("X_ACCESS_TOKEN_SECRET"),
  });

liveTest("reads the OAuth user and app webhooks", async () => {
  const x = client();
  const [identity, webhooks] = await Promise.all([
    x.users.getMe(),
    x.webhooks.list(),
  ]);

  expect(identity.value.data?.id).toBeTruthy();
  expect(Array.isArray(webhooks.value.data)).toBe(true);
});

mutationTest(
  "creates and removes Account Activity with OAuth 1.0a user context",
  async () => {
    const x = client();
    const webhookId = required("X_LIVE_WEBHOOK_ID");
    const identity = await x.users.getMe();
    const userId = identity.value.data?.id;
    if (!userId) throw new Error("X did not return the live OAuth user ID");

    const before = await x.accountActivity.listSubscriptions(webhookId);
    if (
      before.value.data?.subscriptions.some(
        (subscription) => subscription.user_id === userId,
      )
    ) {
      throw new Error(
        "Live user is already subscribed to this webhook; refusing to delete a pre-existing subscription",
      );
    }

    let created = false;
    try {
      const response = await x.accountActivity.createSubscription(webhookId);
      created = response.value.data?.subscribed === true;
      expect(created).toBe(true);

      const checked = await x.accountActivity.checkSubscription(webhookId);
      expect(checked.value.data?.subscribed).toBe(true);
    } finally {
      if (created) {
        await x.accountActivity.deleteSubscription(webhookId, userId);
      }
    }
  },
);
