import { describe, expect, test } from "bun:test";
import {
  X_WEBHOOK_SIGNATURE_HEADER,
  createCrcResponse,
  verifyWebhookRequest,
  verifyWebhookSignature,
} from "../src/index.ts";

const consumerSecret = "consumer-secret";
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
