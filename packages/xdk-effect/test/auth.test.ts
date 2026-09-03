import * as Hmac from "xdk-effect/Hmac";
import * as PlatformError from "effect/PlatformError";
import * as Crypto from "effect/Crypto";
import * as Clock from "effect/Clock";
import * as BunCrypto from "@effect/platform-bun/BunCrypto";
import { describe, expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import { fromOAuth1, fromBearer } from "../src/credentials.ts";
import { signOAuth1 } from "../src/auth.ts";
import { XAuthenticationError } from "../src/errors.ts";
import { getWebhooks, createWebhooks } from "../src/services/webhooks.ts";
import { getUsersMe } from "../src/services/users.ts";
import * as Retry from "../src/retry.ts";

const credentials = {
  apiKey: "api-key",
  apiSecret: "api-secret",
  accessToken: "user-token",
  accessTokenSecret: "token-secret",
};
type FetchLike = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;
const transport = (fetcher: FetchLike) =>
  Layer.mergeAll(
    FetchHttpClient.layer,
    BunCrypto.layer,
    Hmac.layerSubtle,
    Layer.succeed(
      FetchHttpClient.Fetch,
      Object.assign(fetcher, { preconnect: fetch.preconnect }),
    ),
  );
const oauthFields = (header: string) =>
  Object.fromEntries(
    header
      .slice(6)
      .split(", ")
      .map((field) => {
        const i = field.indexOf("=");
        return [field.slice(0, i), decodeURIComponent(field.slice(i + 2, -1))];
      }),
  );

describe("OAuth1 signing", () => {
  test("matches the independent fixed HMAC-SHA1 signing vector", async () => {
    const clock = await Effect.runPromise(Clock.Clock);
    const injectedCrypto = Crypto.make({
      randomBytes: (size) => new Uint8Array(size),
      digest: () =>
        Effect.die("OAuth1 signing must use native HMAC, not a plain digest"),
    });
    const header = await Effect.runPromise(
      signOAuth1(
        {
          apiKey: "xvz1evFS4wEEPTGEFPHBog",
          apiSecret: "kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw",
          accessToken: "370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb",
          accessTokenSecret: "LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE",
        },
        "POST",
        new URL(
          "https://api.x.com/1.1/statuses/update.json?include_entities=true&status=Hello+Ladies+%2B+Gentlemen%2C+a+signed+OAuth+request%21",
        ),
      ).pipe(
        Effect.provideService(Crypto.Crypto, injectedCrypto),
        Effect.provide(Hmac.layerSubtle),
        Effect.provideService(Clock.Clock, {
          ...clock,
          currentTimeMillis: Effect.succeed(1_318_622_958_000),
        }),
      ),
    );
    const fields = oauthFields(header);
    expect(fields.oauth_signature).toBe("EPgFPcQDRmt3XvFz55qcpbFk9Bg=");
    expect(fields.oauth_nonce).toBe("A".repeat(43));
    expect(fields.oauth_timestamp).toBe("1318622958");
    expect(header).not.toContain("LswwdoUa");
  });

  test("rejects empty credentials before I/O", async () => {
    let calls = 0;
    const error = await Effect.runPromise(
      getUsersMe({}).pipe(
        Effect.flip,
        Effect.provide(fromOAuth1({ ...credentials, accessToken: "" })),
        Effect.provide(
          transport(async () => {
            calls++;
            return Response.json({});
          }),
        ),
      ),
    );
    expect(error).toBeInstanceOf(XAuthenticationError);
    expect(calls).toBe(0);
  });
});

describe("native authentication", () => {
  for (const mode of ["http", "json", "shape", "empty", "transport"] as const) {
    test(`failed ${mode} token exchanges are redacted and not cached`, async () => {
      let exchanges = 0;
      const layer = Layer.merge(
        fromOAuth1(credentials),
        transport(async (url) => {
          if (new URL(url.toString()).pathname !== "/oauth2/token")
            return Response.json({ data: [] });
          exchanges++;
          if (exchanges > 1)
            return Response.json({ token_type: "bearer", access_token: "app" });
          if (mode === "transport") throw new Error("transport failure");
          if (mode === "http")
            return Response.json(
              { access_token: "secret-token" },
              { status: 400 },
            );
          if (mode === "json") return new Response("secret-token");
          if (mode === "empty")
            return Response.json({ token_type: "bearer", access_token: "" });
          return Response.json({
            token_type: "unexpected",
            access_token: "secret-token",
          });
        }),
      );
      await Effect.runPromise(
        Effect.gen(function* () {
          const error = yield* getWebhooks({}).pipe(Retry.none, Effect.flip);
          expect(JSON.stringify(error)).not.toContain("secret-token");
          expect(yield* getWebhooks({})).toEqual({ data: [] });
        }).pipe(Effect.provide(layer)),
      );
      expect(exchanges).toBe(2);
    });
  }

  test("does not replay writes after a revoked derived token", async () => {
    let writes = 0;
    let exchanges = 0;
    await Effect.runPromise(
      Effect.gen(function* () {
        yield* createWebhooks({ url: "https://example.com/events" }).pipe(
          Effect.flip,
        );
        expect(writes).toBe(1);
        yield* getWebhooks({});
      }).pipe(
        Effect.provide(
          Layer.merge(
            fromOAuth1(credentials),
            transport(async (url, init) => {
              if (new URL(url.toString()).pathname === "/oauth2/token") {
                exchanges++;
                return Response.json({
                  token_type: "bearer",
                  access_token: `app-${exchanges}`,
                });
              }
              if (init?.method === "POST") {
                writes++;
                return Response.json({}, { status: 401 });
              }
              return Response.json({ data: [] });
            }),
          ),
        ),
      ),
    );
    expect(exchanges).toBe(2);
  });

  test("explicit app and user tokens use their own context without token exchange", async () => {
    const headers: string[] = [];
    await Effect.runPromise(
      Effect.all([getWebhooks({}), getUsersMe({})]).pipe(
        Effect.provide(
          fromBearer({ appBearerToken: "app", userAccessToken: "user" }),
        ),
        Effect.provide(
          transport(async (url, init) => {
            expect(new URL(url.toString()).pathname).not.toBe("/oauth2/token");
            headers.push(new Headers(init?.headers).get("authorization")!);
            return Response.json(
              new URL(url.toString()).pathname === "/2/users/me"
                ? { data: { id: "1", name: "Test", username: "test" } }
                : { data: [] },
            );
          }),
        ),
      ),
    );
    expect(headers).toEqual(["Bearer app", "Bearer user"]);
  });
});

test("generated operations use the call-time HMAC service", async () => {
  const signatures: string[] = [];
  const signedInputs: Hmac.HmacInput[] = [];
  const signer = (byte: number) =>
    Hmac.Hmac.of({
      sign: (input) =>
        Effect.sync(() => {
          signedInputs.push(input);
          return new Uint8Array([byte]);
        }),
      verify: () => Effect.die("OAuth1 must not verify"),
    });
  await Effect.runPromise(
    Effect.gen(function* () {
      for (const byte of [1, 2]) {
        yield* getUsersMe({}).pipe(
          Effect.provideService(Hmac.Hmac, signer(byte)),
        );
      }
    }).pipe(
      Effect.provide(fromOAuth1(credentials)),
      Effect.provide(
        transport(async (_url, init) => {
          signatures.push(
            oauthFields(new Headers(init?.headers).get("authorization")!)
              .oauth_signature!,
          );
          return Response.json({
            data: { id: "1", name: "Test", username: "test" },
          });
        }),
      ),
    ),
  );
  expect(signatures).toEqual(["AQ==", "Ag=="]);
  expect(signedInputs).toHaveLength(2);
  expect(signedInputs[0]?.hash).toBe("SHA-1");
  expect(new TextDecoder().decode(signedInputs[0]?.key)).toBe(
    "api-secret&token-secret",
  );
});

test("HMAC signing failures become authentication errors before HTTP requests", async () => {
  let requests = 0;
  const failure = new Hmac.HmacError({ method: "sign", cause: "unavailable" });
  const error = await Effect.runPromise(
    getUsersMe({}).pipe(
      Effect.provideService(
        Hmac.Hmac,
        Hmac.Hmac.of({
          sign: () => Effect.fail(failure),
          verify: () => Effect.die("OAuth1 must not verify"),
        }),
      ),
      Effect.provide(fromOAuth1(credentials)),
      Effect.provide(
        transport(async () => {
          requests++;
          return Response.json({});
        }),
      ),
      Effect.flip,
    ),
  );
  expect(error).toBeInstanceOf(XAuthenticationError);
  expect(requests).toBe(0);
});

test("OAuth1 nonce failures fail before HTTP requests", async () => {
  const live = await Effect.runPromise(
    Crypto.Crypto.pipe(Effect.provide(BunCrypto.layer)),
  );
  let requests = 0;
  const error = await Effect.runPromise(
    getUsersMe({}).pipe(
      Effect.provideService(
        Crypto.Crypto,
        Crypto.Crypto.of({
          ...live,
          randomBytes: () =>
            Effect.fail(
              PlatformError.badArgument({
                module: "Crypto",
                method: "randomBytes",
                description: "unavailable",
              }),
            ),
        }),
      ),
      Effect.provide(fromOAuth1(credentials)),
      Effect.provide(
        transport(async () => {
          requests++;
          return Response.json({});
        }),
      ),
      Effect.flip,
    ),
  );
  expect(error).toBeInstanceOf(XAuthenticationError);
  expect(requests).toBe(0);
});
