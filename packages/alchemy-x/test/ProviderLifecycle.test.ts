import * as Hmac from "effect-xdk/Hmac";
import * as BrowserCrypto from "@effect/platform-browser/BrowserCrypto";
import { afterEach, describe, expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { Unowned } from "alchemy/AdoptPolicy";
import { XParseError } from "effect-xdk";
import type { CreateActivitySubscriptionRequest as XActivitySubscriptionInput } from "effect-xdk/activity";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import {
  AccountActivitySubscription,
  AccountActivitySubscriptionProvider,
} from "../src/AccountActivitySubscription.ts";
import {
  ActivitySubscription,
  ActivitySubscriptionProvider,
} from "../src/ActivitySubscription.ts";
import * as Credentials from "../src/Credentials.ts";
import { XAdoptionRequired, XResponseError } from "../src/internal.ts";
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
  Layer.mergeAll(
    Credentials.fromCredentials(
      {
        apiKey: "api-key",
        apiSecret: "api-secret",
        accessToken: "user-token",
        accessTokenSecret: "token-secret",
      },
      { apiBaseUrl: server!.url.origin },
    ),
    FetchHttpClient.layer,
    BrowserCrypto.layer,
    Hmac.layerSubtle,
    Layer.succeed(
      FetchHttpClient.Fetch,
      Object.assign(
        async (input: RequestInfo | URL, init?: RequestInit) =>
          new URL(input.toString()).pathname === "/oauth2/token"
            ? Response.json({ token_type: "bearer", access_token: "app-token" })
            : fetch(input, init),
        { preconnect: fetch.preconnect },
      ),
    ),
  );

describe("Alchemy X provider ownership and reconciliation", () => {
  for (const mode of ["complete", "repeated", "invalid"] as const) {
    test(`native Activity pagination handles ${mode} metadata`, async () => {
      const tokens: (string | null)[] = [];
      server = Bun.serve({
        port: 0,
        fetch: (request) => {
          const token = new URL(request.url).searchParams.get(
            "pagination_token",
          );
          tokens.push(token);
          return Response.json({
            data: token
              ? [
                  {
                    subscription_id: "20",
                    event_type: "post.create",
                    filter: { user_id: "42" },
                    webhook_id: "10",
                  },
                ]
              : [],
            meta:
              mode === "invalid"
                ? { next_token: 42 }
                : {
                    next_token:
                      mode === "repeated" || !token ? "next" : undefined,
                  },
          });
        },
      });
      const result = await Effect.runPromise(
        Effect.gen(function* () {
          const provider = yield* ActivitySubscription.Provider;
          return yield* provider.read!({
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
          }).pipe(Effect.result);
        }).pipe(
          Effect.provide(
            Layer.mergeAll(ActivitySubscriptionProvider(), credentials()),
          ),
        ),
      );
      if (mode === "complete") {
        expect(result._tag).toBe("Success");
        if (result._tag === "Success")
          expect(result.success?.subscriptionId).toBe("20");
      } else {
        expect(result._tag).toBe("Failure");
        if (result._tag === "Failure")
          expect(result.failure).toBeInstanceOf(XResponseError);
      }
      expect(tokens).toEqual(mode === "invalid" ? [null] : [null, "next"]);
    });
  }

  test("native NotFound errors make deletion idempotent", async () => {
    server = Bun.serve({
      port: 0,
      fetch: () => Response.json({ detail: "gone" }, { status: 404 }),
    });
    await Effect.runPromise(
      Effect.gen(function* () {
        const provider = yield* Webhook.Provider;
        yield* provider.delete({
          ...lifecycle,
          olds: { url: "https://example.com/x" },
          output: {
            webhookId: "10",
            url: "https://example.com/x",
            valid: true,
            createdAt: "2026-01-01",
          },
        });
      }).pipe(Effect.provide(Layer.mergeAll(WebhookProvider(), credentials()))),
    );
  });

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

    expect(error).toBeInstanceOf(XResponseError);
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

    expect(error).toBeInstanceOf(XResponseError);
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

    expect(error).toBeInstanceOf(XResponseError);
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

    expect(error).toBeInstanceOf(XParseError);
  });

  test("rejects an Activity delete without deleted: true confirmation", async () => {
    server = Bun.serve({
      port: 0,
      fetch: (request) =>
        Response.json({
          data: request.method === "GET" ? [] : { deleted: false },
        }),
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

    expect(error).toBeInstanceOf(XResponseError);
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
          ? Response.json({
              data: { id: "42", name: "Alchemy", username: "alchemy" },
            })
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
      fetch: async (request) => {
        const path = new URL(request.url).pathname;
        requests.push([request.method, path]);
        if (path === "/2/users/me") {
          return Response.json({
            data: { id: "42", name: "Alchemy", username: "alchemy" },
          });
        }
        if (request.method === "GET") {
          return Response.json({
            data: { webhook_id: "11", subscriptions: [] },
          });
        }
        if (request.method === "POST") {
          expect(request.headers.get("content-type")).toContain(
            "application/json",
          );
          expect(await request.json()).toEqual({});
          expect(request.headers.get("authorization")).toStartWith("OAuth ");
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

    expect(error).toBeInstanceOf(XResponseError);
  });
});
