import * as Effect from "effect/Effect";
import * as Encoding from "effect/Encoding";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { ownedBytes, utf8 } from "./runtime.ts";

export const X_WEBHOOK_SIGNATURE_HEADER = "x-twitter-webhooks-signature";

export class XWebhookError extends Schema.TaggedError<XWebhookError>()(
  "XWebhookError",
  { message: Schema.String, cause: Schema.Unknown },
) {}

const hmacKey = (consumerSecret: string) =>
  globalThis.crypto.subtle.importKey(
    "raw",
    utf8(consumerSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );

export const createCrcResponse = (crcToken: string, consumerSecret: string) =>
  Effect.tryPromise({
    try: async (): Promise<{ readonly response_token: `sha256=${string}` }> => {
      const key = await hmacKey(consumerSecret);
      const signature = await globalThis.crypto.subtle.sign(
        "HMAC",
        key,
        utf8(crcToken),
      );
      return {
        response_token: `sha256=${Encoding.encodeBase64(new Uint8Array(signature))}`,
      };
    },
    catch: (cause) =>
      new XWebhookError({ message: "Could not create X CRC response", cause }),
  });

export const verifyWebhookSignature = (input: {
  readonly rawBody: Uint8Array;
  readonly signature: string | null | undefined;
  readonly consumerSecret: string;
}) =>
  Effect.tryPromise({
    try: async () => {
      if (!input.signature?.startsWith("sha256=")) return false;
      const signature = Encoding.decodeBase64(
        input.signature.slice("sha256=".length),
      );
      if (Result.isFailure(signature)) return false;
      const key = await hmacKey(input.consumerSecret);
      return globalThis.crypto.subtle.verify(
        "HMAC",
        key,
        ownedBytes(signature.success),
        ownedBytes(input.rawBody),
      );
    },
    catch: (cause) =>
      new XWebhookError({
        message: "Could not verify X webhook signature",
        cause,
      }),
  });

export const verifyWebhookRequest = (
  request: Request,
  consumerSecret: string,
) =>
  Effect.tryPromise({
    try: () => request.clone().arrayBuffer(),
    catch: (cause) =>
      new XWebhookError({ message: "Could not read X webhook request", cause }),
  }).pipe(
    Effect.flatMap((body) =>
      verifyWebhookSignature({
        rawBody: new Uint8Array(body),
        signature: request.headers.get(X_WEBHOOK_SIGNATURE_HEADER),
        consumerSecret,
      }),
    ),
  );
