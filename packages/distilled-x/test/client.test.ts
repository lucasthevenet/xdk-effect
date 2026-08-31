import { describe, expect, test } from "bun:test";
import { XApiError, XDecodeError, createXClient } from "../src/index.ts";

describe("X API client", () => {
  test("uses user context for /users/me and app context for webhooks", async () => {
    const requests: Request[] = [];
    const client = createXClient({
      appBearerToken: async () => "app-token",
      userAccessToken: async () => "user-token",
      runtime: {
        fetch: async (input, init) => {
          const request = new Request(input, init);
          requests.push(request);
          return Response.json(
            new URL(request.url).pathname === "/2/users/me"
              ? { data: { id: "42", username: "alchemy" } }
              : { data: [], meta: { result_count: 0 } },
          );
        },
      },
    });

    await client.users.getMe();
    await client.webhooks.list();

    expect(
      requests.map((request) => request.headers.get("authorization")),
    ).toEqual(["Bearer user-token", "Bearer app-token"]);
  });

  test("surfaces X problem details and rate-limit metadata on errors", async () => {
    const client = createXClient({
      userAccessToken: "user-token",
      retry: { maxAttempts: 1 },
      runtime: {
        fetch: async () =>
          Response.json(
            {
              title: "Too Many Requests",
              detail: "Rate limit exceeded",
              type: "https://api.x.com/2/problems/rate-limit-exceeded",
            },
            {
              status: 429,
              headers: {
                "x-rate-limit-limit": "900",
                "x-rate-limit-remaining": "0",
                "x-rate-limit-reset": "1705420800",
              },
            },
          ),
      },
    });

    const error = await client.users.getMe().catch((cause) => cause);

    expect(error).toBeInstanceOf(XApiError);
    expect(error).toMatchObject({
      status: 429,
      message: "Rate limit exceeded",
      problems: [
        {
          title: "Too Many Requests",
          detail: "Rate limit exceeded",
          type: "https://api.x.com/2/problems/rate-limit-exceeded",
        },
      ],
      rateLimit: {
        limit: 900,
        remaining: 0,
        resetAt: new Date("2024-01-16T16:00:00.000Z"),
      },
    });
  });

  test("returns partial-success errors alongside data", async () => {
    const client = createXClient({
      userAccessToken: "user-token",
      runtime: {
        fetch: async () =>
          Response.json({
            data: { id: "42", username: "alchemy" },
            errors: [
              {
                resource_id: "missing",
                title: "Not Found Error",
                detail: "A related resource was unavailable",
              },
            ],
          }),
      },
    });

    const response = await client.users.getMe();

    expect(response.value).toEqual({
      data: { id: "42", username: "alchemy" },
      errors: [
        {
          resource_id: "missing",
          title: "Not Found Error",
          detail: "A related resource was unavailable",
        },
      ],
    });
  });

  test("rejects malformed typed endpoint envelopes", async () => {
    const client = createXClient({
      appBearerToken: "app-token",
      userAccessToken: "user-token",
      runtime: {
        fetch: async (input) => {
          const path = new URL(input.toString()).pathname;
          if (path === "/2/webhooks") {
            return Response.json({ data: { id: "not-an-array" } });
          }
          if (path === "/2/users/me") {
            return Response.json({ data: { id: 42 } });
          }
          if (path === "/2/activity/subscriptions") {
            return Response.json({
              data: [
                {
                  subscription_id: "1",
                  event_type: "post.create",
                  filter: { user_id: "42", unexpected: true },
                },
              ],
            });
          }
          return Response.json({
            data: { subscriptions: [{ user_id: 42 }] },
          });
        },
      },
    });

    await expect(client.webhooks.list()).rejects.toBeInstanceOf(XDecodeError);
    await expect(client.users.getMe()).rejects.toBeInstanceOf(XDecodeError);
    await expect(client.activity.listSubscriptions()).rejects.toBeInstanceOf(
      XDecodeError,
    );
    await expect(
      client.accountActivity.listSubscriptions("10"),
    ).rejects.toBeInstanceOf(XDecodeError);
  });

  test("rejects hostile object hooks without coercing parsed fields", async () => {
    const client = createXClient({
      userAccessToken: "user-token",
      runtime: {
        fetch: async () =>
          Response.json({ data: { id: { toString: "not-callable" } } }),
      },
    });

    await expect(client.users.getMe()).rejects.toBeInstanceOf(XDecodeError);
  });

  test("does not retry a 429 before x-rate-limit-reset", async () => {
    const now = 1_700_000_000_000;
    const delays: number[] = [];
    let attempts = 0;
    const client = createXClient({
      userAccessToken: "user-token",
      retry: { maxAttempts: 2, baseDelayMs: 10, maxDelayMs: 1_000 },
      runtime: {
        now: () => now,
        random: () => 0,
        sleep: async (milliseconds) => {
          delays.push(milliseconds);
        },
        fetch: async () => {
          attempts += 1;
          if (attempts === 1) {
            return Response.json(
              { title: "Too Many Requests" },
              {
                status: 429,
                headers: {
                  "x-rate-limit-reset": String(now / 1_000 + 10),
                },
              },
            );
          }
          return Response.json({ data: { id: "42" } });
        },
      },
    });

    const response = await client.users.getMe();

    expect(response.value.data?.id).toBe("42");
    expect(attempts).toBe(2);
    expect(delays).toEqual([10_000]);
  });

  test("does not retry a webhook-creation POST without explicit opt-in", async () => {
    let attempts = 0;
    const client = createXClient({
      appBearerToken: "app-token",
      retry: { maxAttempts: 3 },
      runtime: {
        fetch: async () => {
          attempts += 1;
          return Response.json(
            { title: "Service Unavailable" },
            { status: 503 },
          );
        },
        sleep: async () => undefined,
      },
    });

    await expect(
      client.webhooks.create({ url: "https://example.com/webhooks/x" }),
    ).rejects.toBeInstanceOf(XApiError);
    expect(attempts).toBe(1);
  });

  test("webhooks.ensure reuses an existing valid registration", async () => {
    const requests: Request[] = [];
    const existing = {
      id: "123",
      url: "https://example.com/webhooks/x",
      valid: true,
      created_at: "2026-08-31T00:00:00.000Z",
    };
    const client = createXClient({
      appBearerToken: "app-token",
      runtime: {
        fetch: async (input, init) => {
          requests.push(new Request(input, init));
          return Response.json({ data: [existing] });
        },
      },
    });

    const result = await client.webhooks.ensure({ url: existing.url });

    expect(result).toEqual({
      webhook: existing,
      disposition: "existing",
    });
    expect(requests.map((request) => request.method)).toEqual(["GET"]);
  });

  test("webhooks.ensure revalidates an existing invalid registration", async () => {
    const requests: Request[] = [];
    const existing = {
      id: "123",
      url: "https://example.com/webhooks/x",
      valid: false,
      created_at: "2026-08-31T00:00:00.000Z",
    };
    const client = createXClient({
      appBearerToken: "app-token",
      runtime: {
        fetch: async (input, init) => {
          const request = new Request(input, init);
          requests.push(request);
          if (requests.length === 1) {
            return Response.json({ data: [existing] });
          }
          if (request.method === "PUT") {
            return Response.json({ data: { attempted: true } });
          }
          return Response.json({ data: [{ ...existing, valid: true }] });
        },
      },
    });

    const result = await client.webhooks.ensure({ url: existing.url });

    expect(result).toEqual({
      webhook: { ...existing, valid: true },
      disposition: "revalidated",
    });
    expect(
      requests.map((request) => [
        request.method,
        new URL(request.url).pathname,
      ]),
    ).toEqual([
      ["GET", "/2/webhooks"],
      ["PUT", "/2/webhooks/123"],
      ["GET", "/2/webhooks"],
    ]);
  });

  test("webhooks.ensure registers a missing webhook", async () => {
    const requests: Request[] = [];
    const created = {
      id: "123",
      url: "https://example.com/webhooks/x",
      valid: true,
      created_at: "2026-08-31T00:00:00.000Z",
    };
    const client = createXClient({
      appBearerToken: "app-token",
      runtime: {
        fetch: async (input, init) => {
          const request = new Request(input, init);
          requests.push(request);
          return request.method === "GET"
            ? Response.json({ data: [], meta: { result_count: 0 } })
            : Response.json({ data: created });
        },
      },
    });

    const result = await client.webhooks.ensure({ url: created.url });

    expect(result).toEqual({ webhook: created, disposition: "created" });
    expect(
      requests.map((request) => [
        request.method,
        new URL(request.url).pathname,
      ]),
    ).toEqual([
      ["GET", "/2/webhooks"],
      ["POST", "/2/webhooks"],
    ]);
    expect(await requests[1]?.json()).toEqual({ url: created.url });
  });

  test("uses app context by default for public Activity API subscriptions", async () => {
    const requests: Request[] = [];
    const client = createXClient({
      appBearerToken: "app-token",
      userAccessToken: "user-token",
      runtime: {
        fetch: async (input, init) => {
          const request = new Request(input, init);
          requests.push(request);
          if (request.method === "GET") {
            return Response.json({ data: [], meta: { result_count: 0 } });
          }
          if (request.method === "DELETE") {
            return Response.json({ data: { deleted: true } });
          }
          return Response.json({
            data: {
              subscription_id: "subscription-1",
              event_type: "profile.update.bio",
              filter: { user_id: "42" },
            },
          });
        },
      },
    });

    await client.activity.listSubscriptions();
    await client.activity.createSubscription({
      event_type: "profile.update.bio",
      filter: { user_id: "42" },
      webhook_id: "webhook-1",
    });
    await client.activity.updateSubscription(
      "subscription-1",
      { tag: "updated" },
      { auth: "user" },
    );
    await client.activity.deleteSubscription("subscription-1", {
      auth: "user",
    });

    expect(
      requests.map((request) => request.headers.get("authorization")),
    ).toEqual([
      "Bearer app-token",
      "Bearer app-token",
      "Bearer app-token",
      "Bearer app-token",
    ]);
    expect(await requests[1]?.json()).toEqual({
      event_type: "profile.update.bio",
      filter: { user_id: "42" },
      webhook_id: "webhook-1",
    });
  });

  test("sends the required Account Activity body and models its list envelope", async () => {
    const requests: Request[] = [];
    const subscriptions = {
      application_id: "application-1",
      webhook_id: "webhook-1",
      webhook_url: "https://example.com/webhooks/x",
      subscriptions: [{ user_id: "42" }],
    };
    const client = createXClient({
      appBearerToken: "app-token",
      userAccessToken: "user-token",
      runtime: {
        fetch: async (input, init) => {
          const request = new Request(input, init);
          requests.push(request);
          return request.method === "POST"
            ? Response.json({ data: { subscribed: true } })
            : Response.json({ data: subscriptions });
        },
      },
    });

    await client.accountActivity.createSubscription("webhook-1");
    const listed = await client.accountActivity.listSubscriptions("webhook-1");

    expect(requests[0]?.headers.get("content-type")).toBe("application/json");
    expect(await requests[0]?.text()).toBe("{}");
    expect(
      requests.map((request) => request.headers.get("authorization")),
    ).toEqual(["Bearer user-token", "Bearer app-token"]);
    expect(listed.value.data).toEqual(subscriptions);
    expect(listed.value.data?.subscriptions).toEqual([{ user_id: "42" }]);
  });
});
