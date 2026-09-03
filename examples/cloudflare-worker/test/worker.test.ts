import { expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import { handleRequest } from "../src/worker.ts";

const run = (request: Request, fetcher: typeof fetch) =>
  Effect.runPromise(
    handleRequest(request, {
      X_API_KEY: "test-api-key",
      X_API_SECRET: "test-api-secret",
      X_ACCESS_TOKEN: "test-access-token",
      X_ACCESS_TOKEN_SECRET: "test-access-token-secret",
    }).pipe(Effect.provideService(FetchHttpClient.Fetch, fetcher)),
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
  expect(response.status).toBe(405);
  expect(response.headers.get("allow")).toBe("GET");
  expect(calls).toBe(0);
});
