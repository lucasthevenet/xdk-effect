import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import {
  createCrcResponse,
  verifyWebhookSignature,
  X_WEBHOOK_SIGNATURE_HEADER,
  type XAccountActivityDelivery,
  type XActivityDelivery,
  type XFilteredStreamDelivery,
  type XReplayJobDelivery,
} from "effect-xdk";
import type { EventHandler, XEvent } from "../EventSource.ts";

export const DEFAULT_EVENT_PATH = "/__alchemy/x/events";
export const DEFAULT_MAX_BODY_BYTES = 5 * 1024 * 1024;

export type RuntimeConsumerSecret<E = never, R = never> =
  | Redacted.Redacted<string>
  | Effect.Effect<Redacted.Redacted<string>, E, R>;

interface ErrorResponse {
  readonly error: string;
}

interface SuccessResponse {
  readonly ok: true;
}

interface CrcResponse {
  readonly response_token: `sha256=${string}`;
}

type ReceiverResponse = CrcResponse | ErrorResponse | SuccessResponse;

interface BodySuccess {
  readonly kind: "success";
  readonly body: Uint8Array;
}

interface BodyTooLarge {
  readonly kind: "too_large";
}

type BodyResult = BodySuccess | BodyTooLarge;

const JsonExtensions = [Schema.Record(Schema.String, Schema.Json)] as const;

const Problem = Schema.StructWithRest(
  Schema.Struct({
    type: Schema.optionalKey(Schema.String),
    title: Schema.optionalKey(Schema.String),
    detail: Schema.optionalKey(Schema.String),
    status: Schema.optionalKey(Schema.Number),
    code: Schema.optionalKey(Schema.Number),
    message: Schema.optionalKey(Schema.String),
    parameter: Schema.optionalKey(Schema.String),
    value: Schema.optionalKey(Schema.String),
    resource_id: Schema.optionalKey(Schema.String),
    resource_type: Schema.optionalKey(Schema.String),
  }),
  JsonExtensions,
);

const ActivityFilter = Schema.StructWithRest(
  Schema.Struct({
    user_id: Schema.optionalKey(Schema.String),
    keyword: Schema.optionalKey(Schema.String),
    direction: Schema.optionalKey(Schema.Literals(["inbound", "outbound"])),
    qualifiers: Schema.optionalKey(Schema.Record(Schema.String, Schema.String)),
  }),
  JsonExtensions,
);

const ActivityData = Schema.StructWithRest(
  Schema.Struct({
    event_type: Schema.String,
    event_uuid: Schema.optionalKey(Schema.String),
    filter: Schema.optionalKey(ActivityFilter),
    includes: Schema.optionalKey(Schema.Json),
    payload: Schema.optionalKey(Schema.Json),
    tag: Schema.optionalKey(Schema.String),
  }),
  JsonExtensions,
);

const ActivityDelivery = Schema.StructWithRest(
  Schema.Struct({
    data: ActivityData,
    errors: Schema.optionalKey(Schema.Array(Problem)),
  }),
  JsonExtensions,
);

const FilteredStreamData = Schema.StructWithRest(
  Schema.Struct({
    id: Schema.String,
    text: Schema.optionalKey(Schema.String),
  }),
  JsonExtensions,
);

const FilteredStreamRule = Schema.StructWithRest(
  Schema.Struct({
    id: Schema.String,
    tag: Schema.optionalKey(Schema.String),
  }),
  JsonExtensions,
);

const FilteredStreamDelivery = Schema.StructWithRest(
  Schema.Struct({
    data: FilteredStreamData,
    matching_rules: Schema.Array(FilteredStreamRule),
    includes: Schema.optionalKey(Schema.Json),
  }),
  JsonExtensions,
);

const AccountActivityDelivery = Schema.StructWithRest(
  Schema.Struct({
    for_user_id: Schema.optionalKey(Schema.String),
    tweet_create_events: Schema.optionalKey(Schema.Array(Schema.Json)),
    tweet_delete_events: Schema.optionalKey(Schema.Array(Schema.Json)),
    favorite_events: Schema.optionalKey(Schema.Array(Schema.Json)),
    follow_events: Schema.optionalKey(Schema.Array(Schema.Json)),
    block_events: Schema.optionalKey(Schema.Array(Schema.Json)),
    mute_events: Schema.optionalKey(Schema.Array(Schema.Json)),
    user_event: Schema.optionalKey(Schema.Json),
    direct_message_events: Schema.optionalKey(Schema.Array(Schema.Json)),
    direct_message_indicate_typing_events: Schema.optionalKey(
      Schema.Array(Schema.Json),
    ),
    direct_message_mark_read_events: Schema.optionalKey(
      Schema.Array(Schema.Json),
    ),
  }),
  JsonExtensions,
);

const AccountActivityMarker = Schema.Union([
  Schema.Struct({ for_user_id: Schema.String }),
  Schema.Struct({
    user_event: Schema.Struct({
      revoke: Schema.Struct({
        source: Schema.Struct({ user_id: Schema.String }),
      }),
    }),
  }),
]);

const ReplayJobStatus = Schema.StructWithRest(
  Schema.Struct({
    webhook_id: Schema.String,
    job_state: Schema.String,
    job_state_description: Schema.optionalKey(Schema.String),
    job_id: Schema.String,
  }),
  JsonExtensions,
);

const ReplayJobDelivery = Schema.StructWithRest(
  Schema.Struct({ replay_job_status: ReplayJobStatus }),
  JsonExtensions,
);

const hasAccountActivityMarker = Schema.is(AccountActivityMarker);
const hasActivityFields = Schema.is(ActivityDelivery);
const hasFilteredStreamFields = Schema.is(FilteredStreamDelivery);
const hasAccountActivityFields = Schema.is(AccountActivityDelivery);
const hasReplayJobFields = Schema.is(ReplayJobDelivery);

const isActivityDelivery = (input: Schema.Json): input is XActivityDelivery =>
  hasActivityFields(input);

const isFilteredStreamDelivery = (
  input: Schema.Json,
): input is XFilteredStreamDelivery => hasFilteredStreamFields(input);

const isAccountActivityDelivery = (
  input: Schema.Json,
): input is XAccountActivityDelivery =>
  hasAccountActivityFields(input) && hasAccountActivityMarker(input);

const isReplayJobDelivery = (input: Schema.Json): input is XReplayJobDelivery =>
  hasReplayJobFields(input);

const bodyLimit = (input: number): number => {
  if (!Number.isSafeInteger(input) || input <= 0) {
    throw new TypeError(
      "X event receiver maxBodyBytes must be a positive safe integer",
    );
  }
  return input;
};

export const eventSourcePath = (input?: string): string => {
  const path = input ?? DEFAULT_EVENT_PATH;
  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.includes("\\") ||
    path.includes("//") ||
    path.includes("?") ||
    path.includes("#")
  ) {
    throw new TypeError(
      "X event path must be an absolute canonical path without duplicate slashes, a query, or a fragment",
    );
  }
  if (new URL(path, "https://alchemy.invalid").pathname !== path) {
    throw new TypeError("X event path must not contain dot segments");
  }
  return path;
};

const response = (status: number, body: ReceiverResponse): Response =>
  Response.json(body, {
    status,
    headers: { "cache-control": "no-store" },
  });

const resolveSecret = <E, R>(input: RuntimeConsumerSecret<E, R>) =>
  Redacted.isRedacted(input) ? Effect.succeed(input) : input;

const readBody = (
  request: Request,
  maximumBytes: number,
): Effect.Effect<BodyResult, Error> =>
  Effect.tryPromise({
    try: async () => {
      const contentLength = request.headers.get("content-length");
      if (contentLength !== null) {
        const declaredBytes = Number(contentLength);
        if (
          Number.isSafeInteger(declaredBytes) &&
          declaredBytes > maximumBytes
        ) {
          return { kind: "too_large" } as const;
        }
      }

      if (request.body === null) {
        return { kind: "success", body: new Uint8Array() } as const;
      }

      const reader = request.body.getReader();
      const chunks: Uint8Array[] = [];
      let bytes = 0;
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        bytes += chunk.value.byteLength;
        if (bytes > maximumBytes) {
          await reader.cancel("X event body is too large").catch(() => {});
          return { kind: "too_large" } as const;
        }
        chunks.push(chunk.value);
      }

      const body = new Uint8Array(bytes);
      let offset = 0;
      for (const chunk of chunks) {
        body.set(chunk, offset);
        offset += chunk.byteLength;
      }
      return { kind: "success", body } as const;
    },
    catch: (cause) =>
      cause instanceof Error
        ? cause
        : new Error("Could not read X event body", { cause }),
  });

const classifyEvent = (input: Schema.Json): XEvent | undefined => {
  if (isActivityDelivery(input)) {
    return { kind: "activity", delivery: input };
  }
  if (isFilteredStreamDelivery(input)) {
    return { kind: "filtered_stream", delivery: input };
  }
  if (isAccountActivityDelivery(input)) {
    return { kind: "account_activity", delivery: input };
  }
  if (isReplayJobDelivery(input)) {
    return { kind: "replay_job", delivery: input };
  }
  return undefined;
};

const decodeEvent = (body: Uint8Array) =>
  Effect.gen(function* () {
    const text = yield* Effect.try({
      try: () => new TextDecoder("utf-8", { fatal: true }).decode(body),
      catch: (cause) => cause,
    });
    const decoded = yield* Schema.decodeUnknownEffect(
      Schema.fromJsonString(Schema.Json),
    )(text);
    const event = classifyEvent(decoded);
    return event === undefined
      ? yield* Effect.fail(new TypeError("Invalid X event payload"))
      : event;
  });

const handleCrc = <SecretE, SecretR>(
  request: Request,
  secret: RuntimeConsumerSecret<SecretE, SecretR>,
): Effect.Effect<Response, never, SecretR> =>
  Effect.gen(function* () {
    const url = new URL(request.url);
    const token = url.searchParams.get("crc_token");
    const firstTokenCharacter = token?.trimStart()[0];
    if (
      !token ||
      firstTokenCharacter === "{" ||
      firstTokenCharacter === "[" ||
      new TextEncoder().encode(token).byteLength > 1_024
    ) {
      return response(400, { error: "invalid_crc_token" });
    }

    const resolvedSecret = yield* resolveSecret(secret).pipe(Effect.result);
    if (Result.isFailure(resolvedSecret)) {
      return response(500, { error: "secret_unavailable" });
    }
    const crc = yield* createCrcResponse(
      token,
      Redacted.value(resolvedSecret.success),
    ).pipe(Effect.result);
    return Result.isFailure(crc)
      ? response(500, { error: "crc_failed" })
      : response(200, crc.success);
  });

const handleDelivery = <E, R, SecretE, SecretR>(
  request: Request,
  handler: EventHandler<E, R>,
  secret: RuntimeConsumerSecret<SecretE, SecretR>,
  maximumBytes: number,
): Effect.Effect<Response, never, R | SecretR> =>
  Effect.gen(function* () {
    const resolvedSecret = yield* resolveSecret(secret).pipe(Effect.result);
    if (Result.isFailure(resolvedSecret)) {
      return response(500, { error: "secret_unavailable" });
    }

    const bodyResult = yield* readBody(request, maximumBytes).pipe(
      Effect.result,
    );
    if (Result.isFailure(bodyResult)) {
      return response(400, { error: "invalid_body" });
    }
    if (bodyResult.success.kind === "too_large") {
      return response(413, { error: "body_too_large" });
    }
    const rawBody = bodyResult.success.body;

    const verified = yield* verifyWebhookSignature({
      rawBody,
      signature: request.headers.get(X_WEBHOOK_SIGNATURE_HEADER),
      consumerSecret: Redacted.value(resolvedSecret.success),
    }).pipe(Effect.result);
    if (Result.isFailure(verified) || !verified.success) {
      return response(401, { error: "invalid_signature" });
    }

    const event = yield* decodeEvent(rawBody).pipe(Effect.result);
    if (Result.isFailure(event)) {
      return response(400, { error: "invalid_payload" });
    }
    const handled = yield* handler(event.success).pipe(Effect.result);
    return Result.isFailure(handled)
      ? response(500, { error: "handler_failed" })
      : response(200, { ok: true });
  });

export const makeEventReceiver = <E, R, SecretE = never, SecretR = never>(
  handler: EventHandler<E, R>,
  secret: RuntimeConsumerSecret<SecretE, SecretR>,
  maximumBodyBytes = DEFAULT_MAX_BODY_BYTES,
) => {
  const maximumBytes = bodyLimit(maximumBodyBytes);
  return (request: Request): Effect.Effect<Response, never, R | SecretR> => {
    if (request.method === "GET") return handleCrc(request, secret);
    if (request.method === "POST") {
      return handleDelivery(request, handler, secret, maximumBytes);
    }
    return Effect.succeed(
      new Response("method not allowed", {
        status: 405,
        headers: {
          allow: "GET, POST",
          "cache-control": "no-store",
        },
      }),
    );
  };
};
