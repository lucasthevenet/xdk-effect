import * as Effect from "effect/Effect";
import * as Encoding from "effect/Encoding";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { Hmac } from "./hmac.ts";
import { utf8 } from "./runtime.ts";

export const X_WEBHOOK_SIGNATURE_HEADER = "x-twitter-webhooks-signature";

export class XWebhookError extends Schema.TaggedError<XWebhookError>()(
  "XWebhookError",
  { message: Schema.String, cause: Schema.Unknown },
) {}

export const createCrcResponse = (crcToken: string, consumerSecret: string) =>
  Effect.gen(function* () {
    const hmac = yield* Hmac;
    const signature = yield* hmac.sign({
      hash: "SHA-256",
      key: utf8(consumerSecret),
      data: utf8(crcToken),
    });
    return {
      response_token: `sha256=${Encoding.encodeBase64(signature)}` as const,
    };
  }).pipe(
    Effect.mapError(
      (cause) =>
        new XWebhookError({
          message: "Could not create X CRC response",
          cause,
        }),
    ),
  );

export const verifyWebhookSignature = (input: {
  readonly rawBody: Uint8Array;
  readonly signature: string | null | undefined;
  readonly consumerSecret: string;
}) =>
  Effect.gen(function* () {
    if (!input.signature?.startsWith("sha256=")) return false;
    const signature = Encoding.decodeBase64(
      input.signature.slice("sha256=".length),
    );
    if (Result.isFailure(signature)) return false;
    const hmac = yield* Hmac;
    return yield* hmac.verify({
      hash: "SHA-256",
      key: utf8(input.consumerSecret),
      signature: signature.success,
      data: input.rawBody,
    });
  }).pipe(
    Effect.mapError(
      (cause) =>
        new XWebhookError({
          message: "Could not verify X webhook signature",
          cause,
        }),
    ),
  );

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
