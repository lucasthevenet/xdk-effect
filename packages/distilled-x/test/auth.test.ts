import { describe, expect, test } from "bun:test";
import {
  createXClient,
  XAuthenticationError,
  XApiError,
  type XCredentials,
} from "../src/index.ts";

const credentials = {
  apiKey: "api-key",
  apiSecret: "api-secret",
  accessToken: "user-token",
  accessTokenSecret: "token-secret",
} satisfies XCredentials;

const tokenResponse = (token = "derived-token") =>
  Response.json({ token_type: "bearer", access_token: token });
const isExchange = (input: RequestInfo | URL) =>
  new URL(input instanceof Request ? input.url : input.toString()).pathname ===
  "/oauth2/token";

const oauthFields = (request: Request) =>
  Object.fromEntries(
    request.headers
      .get("authorization")!
      .slice(6)
      .split(", ")
      .map((field) => {
        const separator = field.indexOf("=");
        return [
          field.slice(0, separator),
          decodeURIComponent(field.slice(separator + 2, -1)),
        ];
      }),
  );

describe("OAuth1 signing", () => {
  test("signs the normalized query using a fixed independent HMAC-SHA1 vector, excluding JSON", async () => {
    const requests: Request[] = [];
    const client = createXClient({
      apiKey: "xvz1evFS4wEEPTGEFPHBog",
      apiSecret: "kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw",
      accessToken: "370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb",
      accessTokenSecret: "LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE",
      runtime: {
        now: () => 1_318_622_958_000,
        crypto: {
          subtle: crypto.subtle,
          getRandomValues: (array) => {
            if (array)
              new Uint8Array(
                array.buffer,
                array.byteOffset,
                array.byteLength,
              ).fill(0);
            return array;
          },
        },
        fetch: async (input, init) => {
          requests.push(new Request(input, init));
          return Response.json({});
        },
      },
    });
    await client.request(
      "POST",
      "/1.1/statuses/update.json?include_entities=true",
      {
        query: { status: "Hello Ladies + Gentlemen, a signed OAuth request!" },
        json: { excluded: "JSON body must not enter the OAuth1 parameters" },
      },
    );
    expect(requests).toHaveLength(1);
    const fields = oauthFields(requests[0]!);
    // X's documented signing credentials, with a deterministic 32-zero-byte
    // nonce and status in the query. Expected digest independently computed
    // using node:crypto HMAC-SHA1 over the documented normalized base string.
    expect(fields.oauth_signature).toBe("EPgFPcQDRmt3XvFz55qcpbFk9Bg=");
    expect(fields.oauth_signature_method).toBe("HMAC-SHA1");
    expect(fields.oauth_timestamp).toBe("1318622958");
    expect(fields.oauth_nonce).toBe("A".repeat(43));
    expect(requests[0]!.headers.get("authorization")).not.toContain("LswwdoUa");
  });

  test("uses fresh nonces, timestamps, and lazy credentials for retries", async () => {
    const requests: Request[] = [];
    let now = 1_700_000_000_000;
    let token = "first-user";
    const client = createXClient({
      ...credentials,
      accessToken: () => token,
      runtime: {
        now: () => now,
        sleep: async () => {
          now += 1000;
          token = "second-user";
        },
        fetch: async (input, init) => {
          requests.push(new Request(input, init));
          return requests.length === 1
            ? Response.json({}, { status: 503 })
            : Response.json({ data: { id: "42" } });
        },
      },
    });
    await client.users.getMe();
    const first = oauthFields(requests[0]!);
    const second = oauthFields(requests[1]!);
    expect(first.oauth_nonce).not.toBe(second.oauth_nonce);
    expect(first.oauth_signature).not.toBe(second.oauth_signature);
    expect(first.oauth_token).toBe("first-user");
    expect(second.oauth_token).toBe("second-user");
    expect(Number(second.oauth_timestamp) - Number(first.oauth_timestamp)).toBe(
      1,
    );
  });

  test("rejects empty credentials before any network call", async () => {
    let calls = 0;
    const client = createXClient({
      ...credentials,
      accessTokenSecret: "",
      runtime: {
        fetch: async () => {
          calls++;
          return Response.json({});
        },
      },
    });
    await expect(client.users.getMe()).rejects.toBeInstanceOf(
      XAuthenticationError,
    );
    expect(calls).toBe(0);
  });
});

describe("internal app-only token exchange", () => {
  test("is lazy, uses encoded API credentials only, and shares/caches concurrent exchanges", async () => {
    const requests: Request[] = [];
    let exchanges = 0;
    const client = createXClient({
      ...credentials,
      apiKey: "key /+",
      apiSecret: "secret:!'()*",
      runtime: {
        fetch: async (input, init) => {
          const request = new Request(input, init);
          requests.push(request);
          if (isExchange(input)) {
            exchanges++;
            expect(request.url).toBe("https://api.x.com/oauth2/token");
            expect(request.method).toBe("POST");
            expect(request.redirect).toBe("error");
            expect(atob(request.headers.get("authorization")!.slice(6))).toBe(
              "key%20%2F%2B:secret%3A%21%27%28%29%2A",
            );
            expect(await request.text()).toBe("grant_type=client_credentials");
            expect(request.headers.get("content-type")).toStartWith(
              "application/x-www-form-urlencoded",
            );
            return tokenResponse();
          }
          return Response.json({ data: [] });
        },
      },
    });
    expect(exchanges).toBe(0);
    await Promise.all([
      client.webhooks.list(),
      client.webhooks.list(),
      client.webhooks.list(),
    ]);
    await client.webhooks.list();
    expect(exchanges).toBe(1);
    expect(
      requests
        .filter((request) => !isExchange(request))
        .map((request) => request.headers.get("authorization")),
    ).toEqual(Array(4).fill("Bearer derived-token"));
  });

  test("refreshes the cache after an API key/secret provider rotates", async () => {
    let secret = "first";
    let exchanges = 0;
    const authorizations: (string | null)[] = [];
    const client = createXClient({
      ...credentials,
      apiSecret: () => secret,
      runtime: {
        fetch: async (input, init) => {
          if (isExchange(input)) return tokenResponse(`token-${++exchanges}`);
          authorizations.push(new Headers(init?.headers).get("authorization"));
          return Response.json({ data: [] });
        },
      },
    });
    await client.webhooks.list();
    secret = "second";
    await client.webhooks.list();
    expect(exchanges).toBe(2);
    expect(authorizations).toEqual(["Bearer token-1", "Bearer token-2"]);
  });

  for (const failure of [
    "http",
    "json",
    "shape",
    "empty",
    "transport",
  ] as const) {
    test(`does not cache a failed ${failure} exchange or expose token response secrets`, async () => {
      let exchanges = 0;
      let apiCalls = 0;
      const client = createXClient({
        ...credentials,
        runtime: {
          fetch: async (input) => {
            if (!isExchange(input)) {
              apiCalls++;
              return Response.json({ data: [] });
            }
            exchanges++;
            if (exchanges > 1) return tokenResponse();
            if (failure === "http")
              return Response.json(
                { access_token: "sensitive-response" },
                { status: 401 },
              );
            if (failure === "json") return new Response("sensitive-response");
            if (failure === "empty") return tokenResponse("");
            if (failure === "transport") throw new Error("connection failed");
            return Response.json({
              token_type: "unknown",
              access_token: "sensitive-response",
            });
          },
        },
      });
      const error = await client.webhooks.list().catch((cause: Error) => cause);
      expect(error).toBeInstanceOf(Error);
      expect(String(error)).not.toContain("sensitive-response");
      expect(apiCalls).toBe(0);
      await client.webhooks.list();
      expect(exchanges).toBe(2);
      expect(apiCalls).toBe(1);
    });
  }

  test("recovers from a revoked derived token on safe requests within the retry limit", async () => {
    let exchanges = 0;
    let calls = 0;
    const client = createXClient({
      ...credentials,
      runtime: {
        fetch: async (input) => {
          if (isExchange(input)) return tokenResponse(`token-${++exchanges}`);
          return ++calls === 1
            ? Response.json({}, { status: 401 })
            : Response.json({ data: [] });
        },
      },
    });
    await client.webhooks.list();
    expect(exchanges).toBe(2);
    expect(calls).toBe(2);
  });

  test("does not loop forever when X rejects every token", async () => {
    let exchanges = 0;
    const client = createXClient({
      ...credentials,
      retry: { maxAttempts: 2 },
      runtime: {
        fetch: async (input) =>
          isExchange(input)
            ? tokenResponse(`token-${++exchanges}`)
            : Response.json({}, { status: 401 }),
      },
    });
    await expect(client.webhooks.list()).rejects.toBeInstanceOf(XApiError);
    expect(exchanges).toBe(2);
  });

  test("invalidates a revoked token without automatically replaying POSTs", async () => {
    let exchanges = 0;
    let calls = 0;
    const client = createXClient({
      ...credentials,
      runtime: {
        fetch: async (input) => {
          if (isExchange(input)) return tokenResponse(`token-${++exchanges}`);
          calls++;
          return Response.json({}, { status: 401 });
        },
      },
    });
    await expect(
      client.webhooks.create({ url: "https://example.com" }),
    ).rejects.toBeInstanceOf(XApiError);
    expect(calls).toBe(1);
    await expect(
      client.webhooks.create({ url: "https://example.com" }),
    ).rejects.toBeInstanceOf(XApiError);
    expect(exchanges).toBe(2);
    expect(calls).toBe(2);
  });

  test("an aborted waiter does not cancel another caller's shared exchange", async () => {
    const started = Promise.withResolvers<void>();
    const finish = Promise.withResolvers<Response>();
    let exchanges = 0;
    let calls = 0;
    const client = createXClient({
      ...credentials,
      runtime: {
        fetch: async (input) => {
          if (isExchange(input)) {
            exchanges++;
            started.resolve();
            return finish.promise;
          }
          calls++;
          return Response.json({ data: [] });
        },
      },
    });
    const controller = new AbortController();
    const cancelled = client.webhooks
      .list({ signal: controller.signal })
      .catch((cause: Error) => cause);
    await started.promise;
    const other = client.webhooks.list();
    controller.abort(new Error("cancelled"));
    expect(await cancelled).toMatchObject({ message: "cancelled" });
    finish.resolve(tokenResponse());
    await other;
    expect(exchanges).toBe(1);
    expect(calls).toBe(1);
  });

  test("a pre-aborted request never starts token exchange", async () => {
    let calls = 0;
    const client = createXClient({
      ...credentials,
      runtime: {
        fetch: async () => {
          calls++;
          return tokenResponse();
        },
      },
    });
    await expect(
      client.webhooks.list({
        signal: AbortSignal.abort(new Error("cancelled")),
      }),
    ).rejects.toThrow("cancelled");
    expect(calls).toBe(0);
  });
});

describe("explicit Bearer authentication remains supported by distilled-x", () => {
  test("uses separate lazy app and user Bearer tokens without exchanging credentials", async () => {
    const headers: (string | null)[] = [];
    let userToken = "user-1";
    const client = createXClient({
      appBearerToken: async () => "app-token",
      userAccessToken: () => userToken,
      runtime: {
        fetch: async (input, init) => {
          expect(isExchange(input)).toBe(false);
          headers.push(new Headers(init?.headers).get("authorization"));
          return Response.json({
            data:
              new URL(input.toString()).pathname === "/2/users/me"
                ? { id: "42" }
                : [],
          });
        },
      },
    });
    await client.users.getMe();
    userToken = "user-2";
    await client.users.getMe();
    await client.webhooks.list();
    expect(headers).toEqual([
      "Bearer user-1",
      "Bearer user-2",
      "Bearer app-token",
    ]);
  });

  test("reports missing user credentials and does not exchange or retry an explicit rejected token", async () => {
    let calls = 0;
    const client = createXClient({
      appBearerToken: "explicit",
      runtime: {
        fetch: async () => {
          calls++;
          return Response.json({}, { status: 401 });
        },
      },
    });
    await expect(client.users.getMe()).rejects.toBeInstanceOf(
      XAuthenticationError,
    );
    expect(calls).toBe(0);
    await expect(client.webhooks.list()).rejects.toBeInstanceOf(XApiError);
    expect(calls).toBe(1);
  });
});
