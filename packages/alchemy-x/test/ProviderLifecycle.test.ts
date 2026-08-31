import { afterEach, describe, expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { Unowned } from "alchemy/AdoptPolicy";
import { XDecodeError, type XActivitySubscriptionInput } from "distilled-x";
import {
  AccountActivitySubscription,
  AccountActivitySubscriptionProvider,
} from "../src/AccountActivitySubscription.ts";
import {
  ActivitySubscription,
  ActivitySubscriptionProvider,
} from "../src/ActivitySubscription.ts";
import * as Credentials from "../src/Credentials.ts";
import { XAdoptionRequired } from "../src/internal.ts";
import { Webhook, WebhookProvider } from "../src/Webhook.ts";

let server: ReturnType<typeof Bun.serve> | undefined;

afterEach(() => {
  server?.stop(true);
  server = undefined;
});

// SAFETY: Provider unit tests do not exercise the opaque Alchemy session; an
// uninhabited placeholder satisfies the lifecycle harness without fabricating it.
const lifecycle = {
  id: "Resource",
  fqn: "Resource",
  instanceId: "test-instance",
  session: {} as never,
  bindings: [],
};

const credentials = () =>
  Credentials.fromCredentials(
    {
      appBearerToken: "app-token",
      userAccessToken: "user-token",
      consumerSecret: "consumer-secret",
      userId: "42",
    },
    { apiOrigin: server!.url.origin },
  );

describe("Alchemy X provider ownership and reconciliation", () => {
  test("skips recovery reads while upstream outputs are unresolved", async () => {
    let requests = 0;
    server = Bun.serve({
      port: 0,
      fetch: () => {
        requests++;
        return Response.json({ data: [] });
      },
    });

    const [webhook, account] = await Effect.runPromise(
      Effect.all([
        Effect.gen(function* () {
          const provider = yield* Webhook.Provider;
          // SAFETY: The missing URL recreates a persisted create whose upstream
          // Output was unresolved, which cannot be expressed by WebhookProps.
          return yield* provider.read!({
            ...lifecycle,
            olds: { url: undefined as never },
            output: undefined,
          });
        }).pipe(
          Effect.provide(Layer.mergeAll(WebhookProvider(), credentials())),
        ),
        Effect.gen(function* () {
          const provider = yield* AccountActivitySubscription.Provider;
          // SAFETY: Both identities are deliberately absent to model an
          // interrupted deployment before its upstream Outputs resolved.
          return yield* provider.read!({
            ...lifecycle,
            olds: {
              webhookId: undefined as never,
              userId: undefined as never,
            },
            output: undefined,
          });
        }).pipe(
          Effect.provide(
            Layer.mergeAll(
              AccountActivitySubscriptionProvider(),
              credentials(),
            ),
          ),
        ),
      ]),
    );

    expect(webhook).toBeUndefined();
    expect(account).toBeUndefined();
    expect(requests).toBe(0);
  });

  test("marks a cold matching webhook as unowned", async () => {
    server = Bun.serve({
      port: 0,
      fetch: () =>
        Response.json({
          data: [
            {
              id: "10",
              url: "https://events.example.com/x",
              valid: true,
              created_at: "2026-08-31T00:00:00Z",
            },
          ],
        }),
    });

    const observed = await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* Webhook.Provider;
        return yield* provider.read!({
          ...lifecycle,
          olds: { url: "https://events.example.com/x" },
          output: undefined,
        });
      }).pipe(Effect.provide(Layer.mergeAll(WebhookProvider(), credentials()))),
    );

    expect(Unowned.is(observed)).toBe(true);
  });

  test("does not treat an errors-only webhook list as an empty account", async () => {
    server = Bun.serve({
      port: 0,
      fetch: () =>
        Response.json({ errors: [{ detail: "partial backend failure" }] }),
    });

    const error = await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* Webhook.Provider;
        return yield* provider.read!({
          ...lifecycle,
          olds: { url: "https://events.example.com/x" },
          output: undefined,
        }).pipe(Effect.flip);
      }).pipe(Effect.provide(Layer.mergeAll(WebhookProvider(), credentials()))),
    );

    expect(error).toBeInstanceOf(XDecodeError);
  });

  test("refuses a webhook that appears after the ownership read", async () => {
    server = Bun.serve({
      port: 0,
      fetch: () =>
        Response.json({
          data: [
            {
              id: "10",
              url: "https://events.example.com/x",
              valid: true,
              created_at: "2026-08-31T00:00:00Z",
            },
          ],
        }),
    });

    const error = await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* Webhook.Provider;
        return yield* provider
          .reconcile({
            ...lifecycle,
            news: { url: "https://events.example.com/x" },
            olds: undefined,
            output: undefined,
          })
          .pipe(Effect.flip);
      }).pipe(Effect.provide(Layer.mergeAll(WebhookProvider(), credentials()))),
    );

    expect(error).toBeInstanceOf(XAdoptionRequired);
  });

  test("explicit resource adoption recovers a raced webhook create", async () => {
    const webhook = {
      id: "10",
      url: "https://events.example.com/x",
      valid: true,
      created_at: "2026-08-31T00:00:00Z",
    };
    server = Bun.serve({
      port: 0,
      fetch: () => Response.json({ data: [webhook] }),
    });

    const output = await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* Webhook.Provider;
        return yield* provider.reconcile({
          ...lifecycle,
          news: { url: webhook.url, adoptExisting: true },
          olds: undefined,
          output: undefined,
        });
      }).pipe(Effect.provide(Layer.mergeAll(WebhookProvider(), credentials()))),
    );

    expect(output.webhookId).toBe("10");
  });

  test("revalidates and relists a newly-created invalid webhook before converging", async () => {
    const requests: Array<readonly [string, string]> = [];
    let listCount = 0;
    const webhook = {
      id: "10",
      url: "https://events.example.com/x",
      valid: false,
      created_at: "2026-08-31T00:00:00Z",
    };
    server = Bun.serve({
      port: 0,
      fetch: (request) => {
        const { pathname } = new URL(request.url);
        requests.push([request.method, pathname]);
        if (request.method === "GET") {
          listCount += 1;
          return Response.json({
            data: listCount === 1 ? [] : [{ ...webhook, valid: listCount > 1 }],
          });
        }
        if (request.method === "POST") {
          return Response.json({ data: webhook });
        }
        return Response.json({ data: { valid: true } });
      },
    });

    const output = await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* Webhook.Provider;
        return yield* provider.reconcile({
          ...lifecycle,
          news: { url: webhook.url },
          olds: undefined,
          output: undefined,
        });
      }).pipe(Effect.provide(Layer.mergeAll(WebhookProvider(), credentials()))),
    );

    expect(output).toEqual({
      webhookId: "10",
      url: webhook.url,
      valid: true,
      createdAt: webhook.created_at,
    });
    expect(requests).toEqual([
      ["GET", "/2/webhooks"],
      ["POST", "/2/webhooks"],
      ["PUT", "/2/webhooks/10"],
      ["GET", "/2/webhooks"],
    ]);
  });

  test("fails when a newly-created webhook remains invalid after revalidation", async () => {
    let listCount = 0;
    const webhook = {
      id: "10",
      url: "https://events.example.com/x",
      valid: false,
      created_at: "2026-08-31T00:00:00Z",
    };
    server = Bun.serve({
      port: 0,
      fetch: (request) => {
        if (request.method === "GET") {
          listCount += 1;
          return Response.json({ data: listCount === 1 ? [] : [webhook] });
        }
        if (request.method === "POST") {
          return Response.json({ data: webhook });
        }
        return Response.json({ data: { valid: false } });
      },
    });

    const error = await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* Webhook.Provider;
        return yield* provider
          .reconcile({
            ...lifecycle,
            news: { url: webhook.url },
            olds: undefined,
            output: undefined,
          })
          .pipe(Effect.flip);
      }).pipe(Effect.provide(Layer.mergeAll(WebhookProvider(), credentials()))),
    );

    expect(error).toBeInstanceOf(XDecodeError);
  });

  test("rejects a webhook delete without deleted: true confirmation", async () => {
    server = Bun.serve({
      port: 0,
      fetch: () => Response.json({ data: { deleted: false } }),
    });

    const error = await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* Webhook.Provider;
        return yield* provider
          .delete({
            ...lifecycle,
            olds: { url: "https://events.example.com/x" },
            output: {
              webhookId: "10",
              url: "https://events.example.com/x",
              valid: true,
              createdAt: "2026-08-31T00:00:00Z",
            },
          })
          .pipe(Effect.flip);
      }).pipe(Effect.provide(Layer.mergeAll(WebhookProvider(), credentials()))),
    );

    expect(error).toBeInstanceOf(XDecodeError);
  });

  test("marks an explicitly-tagged cold Activity subscription as unowned", async () => {
    server = Bun.serve({
      port: 0,
      fetch: () =>
        Response.json({
          data: [
            {
              subscription_id: "20",
              event_type: "post.create",
              filter: { user_id: "42" },
              webhook_id: "10",
              tag: "manual",
            },
          ],
        }),
    });

    const observed = await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* ActivitySubscription.Provider;
        return yield* provider.read!({
          ...lifecycle,
          olds: {
            eventType: "post.create",
            filter: { user_id: "42" },
            webhookId: "10",
            tag: "manual",
          },
          output: undefined,
        });
      }).pipe(
        Effect.provide(
          Layer.mergeAll(ActivitySubscriptionProvider(), credentials()),
        ),
      ),
    );

    expect(Unowned.is(observed)).toBe(true);
  });

  test("creates public Activity with app auth and an ownership tag", async () => {
    let authorization: string | null = null;
    let requestBody: XActivitySubscriptionInput | undefined;
    server = Bun.serve({
      port: 0,
      fetch: async (request) => {
        if (request.method === "GET") return Response.json({ data: [] });
        authorization = request.headers.get("authorization");
        // SAFETY: The provider under test is invoked with a complete
        // XActivitySubscriptionInput below; this captures its JSON serialization.
        requestBody = (await request.json()) as XActivitySubscriptionInput;
        return Response.json({
          data: {
            subscription: {
              subscription_id: "20",
              event_type: requestBody.event_type,
              filter: requestBody.filter,
              webhook_id: requestBody.webhook_id,
              tag: requestBody.tag,
            },
          },
        });
      },
    });

    const output = await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* ActivitySubscription.Provider;
        return yield* provider.reconcile({
          ...lifecycle,
          news: {
            eventType: "post.create",
            filter: { user_id: "42" },
            webhookId: "10",
          },
          olds: undefined,
          output: undefined,
        });
      }).pipe(
        Effect.provide(
          Layer.mergeAll(ActivitySubscriptionProvider(), credentials()),
        ),
      ),
    );

    expect(authorization).toBe("Bearer app-token");
    expect(requestBody?.tag).toMatch(/^alchemy:/);
    expect(output.subscriptionId).toBe("20");
  });

  test("rejects a malformed errors field on Activity create", async () => {
    let requestBody: XActivitySubscriptionInput | undefined;
    server = Bun.serve({
      port: 0,
      fetch: async (request) => {
        if (request.method === "GET") return Response.json({ data: [] });
        // SAFETY: The provider sends XActivitySubscriptionInput JSON; the
        // captured value is echoed only to make the nominal data authoritative.
        requestBody = (await request.json()) as XActivitySubscriptionInput;
        return Response.json({
          data: {
            subscription: {
              subscription_id: "20",
              event_type: requestBody.event_type,
              filter: requestBody.filter,
              webhook_id: requestBody.webhook_id,
              tag: requestBody.tag,
            },
          },
          errors: {},
        });
      },
    });

    const error = await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* ActivitySubscription.Provider;
        return yield* provider
          .reconcile({
            ...lifecycle,
            news: {
              eventType: "post.create",
              filter: { user_id: "42" },
              webhookId: "10",
            },
            olds: undefined,
            output: undefined,
          })
          .pipe(Effect.flip);
      }).pipe(
        Effect.provide(
          Layer.mergeAll(ActivitySubscriptionProvider(), credentials()),
        ),
      ),
    );

    expect(error).toBeInstanceOf(XDecodeError);
  });

  test("rejects an Activity delete without deleted: true confirmation", async () => {
    server = Bun.serve({
      port: 0,
      fetch: () => Response.json({ data: {} }),
    });

    const error = await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* ActivitySubscription.Provider;
        return yield* provider
          .delete({
            ...lifecycle,
            olds: {
              eventType: "post.create",
              filter: { user_id: "42" },
              webhookId: "10",
            },
            output: {
              subscriptionId: "20",
              eventType: "post.create",
              filter: { user_id: "42" },
              webhookId: "10",
            },
          })
          .pipe(Effect.flip);
      }).pipe(
        Effect.provide(
          Layer.mergeAll(ActivitySubscriptionProvider(), credentials()),
        ),
      ),
    );

    expect(error).toBeInstanceOf(XDecodeError);
  });

  test("marks a cold Account Activity subscription as unowned", async () => {
    server = Bun.serve({
      port: 0,
      fetch: () =>
        Response.json({
          data: {
            webhook_id: "10",
            subscriptions: [{ user_id: "42" }],
          },
        }),
    });

    const observed = await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* AccountActivitySubscription.Provider;
        return yield* provider.read!({
          ...lifecycle,
          olds: { webhookId: "10", userId: "42" },
          output: undefined,
        });
      }).pipe(
        Effect.provide(
          Layer.mergeAll(AccountActivitySubscriptionProvider(), credentials()),
        ),
      ),
    );

    expect(Unowned.is(observed)).toBe(true);
  });

  test("refuses Account Activity that appears after the ownership read", async () => {
    server = Bun.serve({
      port: 0,
      fetch: (request) =>
        new URL(request.url).pathname === "/2/users/me"
          ? Response.json({ data: { id: "42" } })
          : Response.json({
              data: {
                webhook_id: "10",
                subscriptions: [{ user_id: "42" }],
              },
            }),
    });

    const error = await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* AccountActivitySubscription.Provider;
        return yield* provider
          .reconcile({
            ...lifecycle,
            news: { webhookId: "10", userId: "42" },
            olds: undefined,
            output: undefined,
          })
          .pipe(Effect.flip);
      }).pipe(
        Effect.provide(
          Layer.mergeAll(AccountActivitySubscriptionProvider(), credentials()),
        ),
      ),
    );

    expect(error).toBeInstanceOf(XAdoptionRequired);
  });

  test("moves Account Activity create-first when an Output webhook changes", async () => {
    const requests: Array<readonly [string, string]> = [];
    server = Bun.serve({
      port: 0,
      fetch: (request) => {
        const path = new URL(request.url).pathname;
        requests.push([request.method, path]);
        if (path === "/2/users/me") {
          return Response.json({ data: { id: "42" } });
        }
        if (request.method === "GET") {
          return Response.json({
            data: { webhook_id: "11", subscriptions: [] },
          });
        }
        if (request.method === "POST") {
          return Response.json({ data: { subscribed: true } });
        }
        return Response.json({ data: { subscribed: false } });
      },
    });

    const output = await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* AccountActivitySubscription.Provider;
        return yield* provider.reconcile({
          ...lifecycle,
          news: { webhookId: "11", userId: "42" },
          olds: { webhookId: "10", userId: "42" },
          output: { webhookId: "10", userId: "42", subscribed: true },
        });
      }).pipe(
        Effect.provide(
          Layer.mergeAll(AccountActivitySubscriptionProvider(), credentials()),
        ),
      ),
    );

    expect(output).toEqual({ webhookId: "11", userId: "42", subscribed: true });
    expect(requests).toEqual([
      ["GET", "/2/users/me"],
      ["GET", "/2/account_activity/webhooks/11/subscriptions/all/list"],
      ["POST", "/2/account_activity/webhooks/11/subscriptions/all"],
      ["DELETE", "/2/account_activity/webhooks/10/subscriptions/42/all"],
    ]);
  });

  test("rejects an Account Activity delete without subscribed: false confirmation", async () => {
    server = Bun.serve({
      port: 0,
      fetch: () => Response.json({ data: { subscribed: true } }),
    });

    const error = await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* AccountActivitySubscription.Provider;
        return yield* provider
          .delete({
            ...lifecycle,
            olds: { webhookId: "10", userId: "42" },
            output: { webhookId: "10", userId: "42", subscribed: true },
          })
          .pipe(Effect.flip);
      }).pipe(
        Effect.provide(
          Layer.mergeAll(AccountActivitySubscriptionProvider(), credentials()),
        ),
      ),
    );

    expect(error).toBeInstanceOf(XDecodeError);
  });
});
