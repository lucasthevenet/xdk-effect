import * as Hmac from "effect-xdk/Hmac";
import { describe, expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import {
  X_WEBHOOK_SIGNATURE_HEADER,
  createCrcResponse as createCrcResponseEffect,
  verifyWebhookRequest as verifyWebhookRequestEffect,
  verifyWebhookSignature as verifyWebhookSignatureEffect,
  XWebhookError,
} from "../src/index.ts";

const consumerSecret = "consumer-secret";
const encode = (text: string) => new TextEncoder().encode(text);
const rawBody = new TextEncoder().encode(
  '{"event":"post.create","text":"café"}',
);
const signature = "sha256=gn+m4oIE2v2YpMqtbpxZjFZ5wK04OwpO3/GG2C+m3UA=";

describe("X webhook security", () => {
  test("creates the documented sha256 CRC response", async () => {
    await expect(
      createCrcResponse("challenge", consumerSecret),
    ).resolves.toEqual({
      response_token: "sha256=2RUZDVKjSpEV/C/r9ivMsVZJ4DFPAawjJFQQzY+6ba4=",
    });
  });

  test("verifies the signature against the exact raw UTF-8 bytes", async () => {
    await expect(
      verifyWebhookSignature({ rawBody, signature, consumerSecret }),
    ).resolves.toBeTrue();
    await expect(
      verifyWebhookSignature({
        rawBody: new TextEncoder().encode(
          '{"event":"post.create","text":"cafe"}',
        ),
        signature,
        consumerSecret,
      }),
    ).resolves.toBeFalse();
    await expect(
      verifyWebhookSignature({
        rawBody,
        signature: "sha256=not base64!",
        consumerSecret,
      }),
    ).resolves.toBeFalse();
    await expect(
      verifyWebhookSignature({
        rawBody,
        signature: null,
        consumerSecret,
      }),
    ).resolves.toBeFalse();
  });

  test.each([
    "sha256=",
    "sha256=AA==",
    "sha256=A===",
    "sha256=!!!!",
    "sha256=gn+m4oIE2v2YpMqtbpxZjFZ5wK04OwpO3/GG2C+m3UA==",
  ])("rejects malformed or wrong-length signatures: %s", async (invalid) => {
    await expect(
      verifyWebhookSignature({
        rawBody,
        signature: invalid,
        consumerSecret,
      }),
    ).resolves.toBeFalse();
  });

  test("verifies a Request without consuming its body", async () => {
    const request = new Request("https://example.com/webhooks/x", {
      method: "POST",
      headers: { [X_WEBHOOK_SIGNATURE_HEADER]: signature },
      body: rawBody,
    });

    await expect(
      verifyWebhookRequest(request, consumerSecret),
    ).resolves.toBeTrue();
    expect(await request.text()).toBe('{"event":"post.create","text":"café"}');
  });
});

test("webhook helpers use the injected signer and verifier", async () => {
  const signed: Hmac.HmacInput[] = [];
  const verified: (Hmac.HmacInput & { readonly signature: Uint8Array })[] = [];
  const hmac = Hmac.Hmac.of({
    sign: (input) =>
      Effect.sync(() => {
        signed.push(input);
        return new Uint8Array([0, 255]);
      }),
    verify: (input) =>
      Effect.sync(() => {
        verified.push(input);
        return false;
      }),
  });
  await Effect.runPromise(
    Effect.gen(function* () {
      expect(
        yield* createCrcResponseEffect("challenge", consumerSecret),
      ).toEqual({
        response_token: "sha256=AP8=",
      });
      expect(
        yield* verifyWebhookSignatureEffect({
          rawBody,
          signature: "sha256=AP8=",
          consumerSecret,
        }),
      ).toBeFalse();
      expect(
        yield* verifyWebhookSignatureEffect({
          rawBody,
          signature: "sha256=!!!!",
          consumerSecret,
        }),
      ).toBeFalse();
    }).pipe(Effect.provideService(Hmac.Hmac, hmac)),
  );
  expect(signed).toEqual([
    { hash: "SHA-256", key: encode(consumerSecret), data: encode("challenge") },
  ]);
  expect(verified).toEqual([
    {
      hash: "SHA-256",
      key: encode(consumerSecret),
      data: rawBody,
      signature: new Uint8Array([0, 255]),
    },
  ]);
});

test("injected HMAC failures retain the webhook error channel", async () => {
  const hmac = Hmac.Hmac.of({
    sign: () =>
      Effect.fail(new Hmac.HmacError({ method: "sign", cause: "unavailable" })),
    verify: () =>
      Effect.fail(
        new Hmac.HmacError({ method: "verify", cause: "unavailable" }),
      ),
  });
  await Effect.runPromise(
    Effect.gen(function* () {
      const crc = yield* createCrcResponseEffect(
        "challenge",
        consumerSecret,
      ).pipe(Effect.flip);
      const delivery = yield* verifyWebhookSignatureEffect({
        rawBody,
        signature,
        consumerSecret,
      }).pipe(Effect.flip);
      expect(crc).toBeInstanceOf(XWebhookError);
      expect(delivery).toBeInstanceOf(XWebhookError);
    }).pipe(Effect.provideService(Hmac.Hmac, hmac)),
  );
});

const createCrcResponse = (
  ...args: Parameters<typeof createCrcResponseEffect>
) =>
  Effect.runPromise(
    createCrcResponseEffect(...args).pipe(Effect.provide(Hmac.layerSubtle)),
  );

const verifyWebhookRequest = (
  ...args: Parameters<typeof verifyWebhookRequestEffect>
) =>
  Effect.runPromise(
    verifyWebhookRequestEffect(...args).pipe(Effect.provide(Hmac.layerSubtle)),
  );

const verifyWebhookSignature = (
  ...args: Parameters<typeof verifyWebhookSignatureEffect>
) =>
  Effect.runPromise(
    verifyWebhookSignatureEffect(...args).pipe(
      Effect.provide(Hmac.layerSubtle),
    ),
  );
