import { expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import * as Encoding from "effect/Encoding";
import * as Hmac from "effect-xdk/Hmac";

const bytes = (value: string) => new TextEncoder().encode(value);

test.each([
  ["SHA-1", "b617318655057264e28bc0b6fb378c8ef146be00"],
  [
    "SHA-256",
    "b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7",
  ],
] as const)(
  "native HMAC matches the RFC vector for %s",
  async (hash, expected) => {
    const hmac = await Effect.runPromise(Hmac.makeSubtle(globalThis.crypto));
    // Non-zero offsets ensure only the selected bytes are signed and verified.
    const key = new Uint8Array(24).fill(0x0b).subarray(2, 22);
    const data = bytes("!Hi There!").subarray(1, 9);
    const input = { hash, key, data };
    const signature = await Effect.runPromise(hmac.sign(input));
    expect(Encoding.encodeHex(signature)).toBe(expected);
    const padded = new Uint8Array(signature.length + 2);
    padded.set(signature, 1);
    expect(
      await Effect.runPromise(
        hmac.verify({
          ...input,
          signature: padded.subarray(1, -1),
        }),
      ),
    ).toBeTrue();
    expect(
      await Effect.runPromise(
        hmac.verify({
          ...input,
          data: bytes("tampered"),
          signature,
        }),
      ),
    ).toBeFalse();
    expect(
      await Effect.runPromise(
        hmac.verify({
          ...input,
          key: bytes("wrong key"),
          signature,
        }),
      ),
    ).toBeFalse();
  },
);

test("native crypto failures stay in the typed HMAC error channel", async () => {
  const hmac = await Effect.runPromise(Hmac.makeSubtle(globalThis.crypto));
  const input: Hmac.HmacInput = {
    hash: "SHA-256",
    key: new Uint8Array(),
    data: bytes("message"),
  };
  const sign = await Effect.runPromise(hmac.sign(input).pipe(Effect.flip));
  const verify = await Effect.runPromise(
    hmac
      .verify({
        ...input,
        signature: new Uint8Array(32),
      })
      .pipe(Effect.flip),
  );
  expect(sign).toBeInstanceOf(Hmac.HmacError);
  expect(sign.method).toBe("sign");
  expect(verify).toBeInstanceOf(Hmac.HmacError);
  expect(verify.method).toBe("verify");
});
