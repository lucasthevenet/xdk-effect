import { afterAll, expect, test } from "bun:test";
import { createHmac } from "node:crypto";
import * as Cloudflare from "alchemy/Cloudflare";
import * as ConfigProvider from "effect/ConfigProvider";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import * as HttpRouter from "effect/unstable/http/HttpRouter";
import { Routes } from "../src/worker.ts";

const env = {
  API_KEY: "test-api-key",
  API_SECRET: "test-api-secret",
  ACCESS_TOKEN: "test-access-token",
  ACCESS_TOKEN_SECRET: "test-access-token-secret",
};

const { handler: handleRequest, dispose } = HttpRouter.toWebHandler(
  Routes.pipe(
    Layer.provide(
      Layer.succeed(
        ConfigProvider.ConfigProvider,
        ConfigProvider.fromUnknown(env),
      ),
    ),
  ),
  { disableLogger: true },
);

afterAll(dispose);

test.each([
  ["/", 200],
  ["/webhook?crc_token=challenge", 200],
  ["/missing", 404],
] as const)("Alchemy Worker bridge serves %s", async (path, status) => {
  const response = await Effect.runPromise(
    Effect.scoped(
      Effect.gen(function* () {
        const handler = yield* HttpRouter.toHttpEffect(Routes);
        const request = Cloudflare.makeRequestHandler(handler)({
          kind: "Cloudflare.Workers.WorkerEvent",
          type: "fetch",
          input: new Request(`https://example.com${path}`),
        });
        if (request === undefined)
          return yield* Effect.die("Worker did not handle fetch");
        return yield* request;
      }),
    ).pipe(
      Effect.provideService(
        ConfigProvider.ConfigProvider,
        ConfigProvider.fromUnknown(env),
      ),
      Effect.provideService(
        FetchHttpClient.Fetch,
        Object.assign(async () => Response.json({ data: { id: "42" } }), {
          preconnect: fetch.preconnect,
        }),
      ),
    ),
  );
  expect(response.status).toBe(status);
  if (path === "/")
    expect(await response.json()).toEqual({ data: { id: "42" } });
  if (path.startsWith("/webhook"))
    expect(await response.json()).toHaveProperty("response_token");
});

const run = (
  request: Request,
  fetcher: typeof fetch = fetch,
  bindings: Partial<typeof env> = env,
) =>
  handleRequest(
    request,
    Context.make(
      ConfigProvider.ConfigProvider,
      ConfigProvider.fromUnknown(bindings),
    ).pipe(Context.add(FetchHttpClient.Fetch, fetcher)),
  );

test("GET / reads the authenticated X account on every request", async () => {
  const account = { data: { id: "42", name: "Example", username: "example" } };
  let calls = 0;
  const fetcher = Object.assign(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      calls++;
      const request = new Request(input, init);
      expect(request.url).toBe("https://api.x.com/2/users/me");
      expect(request.method).toBe("GET");
      expect(request.headers.get("authorization")).toStartWith("OAuth ");
      return Response.json(account);
    },
    { preconnect: fetch.preconnect },
  );

  for (let index = 0; index < 2; index++) {
    const response = await run(new Request("https://example.com/"), fetcher);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(await response.json()).toEqual(account);
  }
  expect(calls).toBe(2);
});

test("API failures return a sanitized 502", async () => {
  const response = await run(
    new Request("https://example.com/"),
    Object.assign(
      async () => Response.json({ detail: "test-api-secret" }, { status: 401 }),
      { preconnect: fetch.preconnect },
    ),
  );
  expect(response.status).toBe(502);
  expect(await response.json()).toEqual({ error: "X request failed" });
});

test("redacted configuration supplies the OAuth1 signing credentials", async () => {
  const response = await run(
    new Request("https://example.com/"),
    Object.assign(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const request = new Request(input, init);
        expect(request.url).toBe("https://api.x.com/2/users/me");
        expect(request.headers.get("authorization")).toContain(
          'oauth_consumer_key="test-api-key"',
        );
        expect(request.headers.get("authorization")).toContain(
          'oauth_token="test-access-token"',
        );
        return Response.json({ data: { id: "42" } });
      },
      { preconnect: fetch.preconnect },
    ),
  );
  expect(response.status).toBe(200);
});

test("missing secret configuration fails without calling X or exposing details", async () => {
  let calls = 0;
  const response = await run(
    new Request("https://example.com/"),
    Object.assign(
      async () => {
        calls++;
        return Response.json({});
      },
      { preconnect: fetch.preconnect },
    ),
    {},
  );
  expect(calls).toBe(0);
  expect(response.status).toBe(502);
  expect(await response.json()).toEqual({ error: "X request failed" });
});

test("webhook route reads its secret from ConfigProvider", async () => {
  const response = await run(
    new Request("https://example.com/webhook?crc_token=challenge"),
  );
  expect(response.status).toBe(200);
  expect(await response.json()).toHaveProperty("response_token");
});

test("router preserves raw signed webhook bodies and rejects invalid signatures", async () => {
  const body = '{ "for_user_id": "42", "text": "café" }';
  const signature = `sha256=${createHmac("sha256", env.API_SECRET).update(body).digest("base64")}`;
  const deliver = (header: string) =>
    run(
      new Request("https://example.com/webhook", {
        method: "POST",
        body,
        headers: { "x-twitter-webhooks-signature": header },
      }),
    );
  const valid = await deliver(signature);
  expect(valid.status).toBe(200);
  expect(await valid.json()).toEqual({ ok: true });
  const invalid = await deliver("sha256=AA==");
  expect(invalid.status).toBe(401);
  expect(await invalid.json()).toEqual({ error: "Invalid signature" });
});

test("webhook helper rejects unsupported methods through the router", async () => {
  const response = await run(
    new Request("https://example.com/webhook", { method: "PUT" }),
  );
  expect(response.status).toBe(405);
  expect(response.headers.get("allow")).toBe("GET, POST");
});

test("router handles HEAD / with an empty response body", async () => {
  const response = await run(
    new Request("https://example.com/", { method: "HEAD" }),
    Object.assign(async () => Response.json({ data: { id: "42" } }), {
      preconnect: fetch.preconnect,
    }),
  );
  expect(response.status).toBe(200);
  expect(await response.text()).toBe("");
});

test("other paths and methods do not call X", async () => {
  let calls = 0;
  const fetcher = Object.assign(
    async () => {
      calls++;
      return Response.json({});
    },
    { preconnect: fetch.preconnect },
  );
  expect(
    (await run(new Request("https://example.com/other"), fetcher)).status,
  ).toBe(404);
  const response = await run(
    new Request("https://example.com/", { method: "POST" }),
    fetcher,
  );
  expect(response.status).toBe(404);
  expect(calls).toBe(0);
});
