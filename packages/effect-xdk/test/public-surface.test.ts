import { expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import * as X from "../src/index.ts";
import manifest from "../package.json";

test("the package exposes only Effect-native SDK operations and async helpers", () => {
  expect(X).not.toHaveProperty("createXClient");
  expect(X).not.toHaveProperty("createOAuth2Client");
  expect(X).not.toHaveProperty("runtime");
  for (const path of ["./Client", "./client", "./auth", "./runtime"] as const) {
    expect(manifest.exports[path]).toBeNull();
  }
  expect(Effect.isEffect(X.Services.users.getUsersMe({}))).toBe(true);
  expect(Effect.isEffect(X.createCrcResponse("challenge", "secret"))).toBe(
    true,
  );
  expect(
    Effect.isEffect(
      X.verifyWebhookSignature({
        rawBody: new Uint8Array(),
        signature: null,
        consumerSecret: "secret",
      }),
    ),
  ).toBe(true);
  expect(
    Effect.isEffect(
      X.exchangeCode(
        { clientId: "client" },
        {
          code: "code",
          codeVerifier: "verifier",
          redirectUri: "https://example.com/callback",
        },
      ),
    ),
  ).toBe(true);
});
