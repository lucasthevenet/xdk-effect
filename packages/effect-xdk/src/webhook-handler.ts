import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";
import * as Hmac from "./hmac.ts";
import {
  createCrcResponse,
  verifyWebhookSignature,
  XWebhookError,
  X_WEBHOOK_SIGNATURE_HEADER,
} from "./webhooks.ts";

export interface WebhookHandlerConfig<E = never, R = never> {
  /** The app's API secret, not the access-token secret. */
  readonly consumerSecret: string | Redacted.Redacted<string>;
  /** Receives verified JSON. Decode a narrower event schema inside this Effect if needed. */
  readonly onEvent: (event: Schema.JsonObject) => Effect.Effect<void, E, R>;
  /** Maximum raw delivery size, default 5 MiB. */
  readonly maxBodyBytes?: number;
}

class BodyTooLarge extends Schema.TaggedError<BodyTooLarge>()(
  "BodyTooLarge",
  {},
) {}

const readBody = (request: Request, limit: number) =>
  Effect.gen(function* () {
    const declared = Number(request.headers.get("content-length"));
    if (declared > limit) return yield* Effect.fail(new BodyTooLarge());
    const body = request.body;
    if (body === null) return new Uint8Array();
    let size = 0;
    const chunks = yield* Stream.fromReadableStream({
      evaluate: () => body,
      onError: (cause) =>
        new XWebhookError({
          message: "Could not read X webhook request",
          cause,
        }),
    }).pipe(
      Stream.mapEffect((chunk) => {
        size += chunk.byteLength;
        return size > limit
          ? Effect.fail(new BodyTooLarge())
          : Effect.succeed(chunk);
      }),
      Stream.runCollect,
    );
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return bytes;
  });

const json = (status: number, body: Schema.JsonObject) =>
  Response.json(body, {
    status,
    headers: { "cache-control": "no-store" },
  });

/**
 * Mount at your webhook route. CRC and invalid requests become HTTP responses;
 * processing failures stay in the Effect error channel and are never acknowledged.
 * Request bodies are consumed. No webhook registration or server is started.
 */
export const createWebhookHandler = <E, R>(
  config: WebhookHandlerConfig<E, R>,
): ((request: Request) => Effect.Effect<Response, E | XWebhookError, R>) => {
  const limit = config.maxBodyBytes ?? 5 * 1024 * 1024;
  if (!Number.isSafeInteger(limit) || limit <= 0)
    throw new RangeError("maxBodyBytes must be a positive safe integer");
  const secret = Redacted.isRedacted(config.consumerSecret)
    ? config.consumerSecret
    : Redacted.make(config.consumerSecret);
  return (request) =>
    Effect.gen(function* () {
      if (request.method === "GET") {
        const token = new URL(request.url).searchParams.get("crc_token");
        if (!token) return json(400, { error: "Missing crc_token" });
        const result = yield* createCrcResponse(
          token,
          Redacted.value(secret),
        ).pipe(Effect.provide(Hmac.layerSubtle));
        return json(200, result);
      }
      if (request.method !== "POST")
        return new Response(null, {
          status: 405,
          headers: { allow: "GET, POST" },
        });
      const signature = request.headers.get(X_WEBHOOK_SIGNATURE_HEADER);
      if (!signature?.startsWith("sha256="))
        return json(401, { error: "Invalid signature" });
      const body = yield* readBody(request, limit).pipe(Effect.result);
      if (body._tag === "Failure") {
        if (body.failure._tag === "BodyTooLarge")
          return json(413, { error: "Payload too large" });
        return json(400, { error: "Could not read request body" });
      }
      const valid = yield* verifyWebhookSignature({
        rawBody: body.success,
        signature,
        consumerSecret: Redacted.value(secret),
      }).pipe(Effect.provide(Hmac.layerSubtle));
      if (!valid) return json(401, { error: "Invalid signature" });
      const parsed = yield* Schema.decodeUnknownEffect(
        Schema.fromJsonString(Schema.Record(Schema.String, Schema.Json)),
      )(new TextDecoder().decode(body.success)).pipe(Effect.result);
      if (parsed._tag === "Failure")
        return json(400, { error: "Invalid JSON object" });
      yield* config.onEvent(parsed.success);
      return json(200, { ok: true });
    });
};
