import type {
  CreateActivitySubscriptionFilter,
  CreateActivitySubscriptionRequestEventType,
} from "./services/activity.ts";
import * as Effect from "effect/Effect";
import * as Encoding from "effect/Encoding";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { Hmac } from "./hmac.ts";

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
      key: new TextEncoder().encode(consumerSecret),
      data: new TextEncoder().encode(crcToken),
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
      key: new TextEncoder().encode(input.consumerSecret),
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

/** JSON values used by open-ended webhook delivery fields. */
export type XJsonValue = Schema.Json;
export type XJsonObject = Schema.JsonObject;
export type XJsonArray = Schema.JsonArray;
export type XJsonPrimitive = null | boolean | number | string;

export interface XProblem extends XJsonObject {
  readonly type?: string;
  readonly title?: string;
  readonly detail?: string;
  readonly status?: number;
  readonly code?: number;
  readonly message?: string;
  readonly parameter?: string;
  readonly value?: string;
  readonly resource_id?: string;
  readonly resource_type?: string;
}

/** Event names from the spec plus delivery variants accepted by X. */
export type KnownXActivityEventType =
  | CreateActivitySubscriptionRequestEventType
  | "broadcast.start"
  | "broadcast.end"
  | "broadcast.chat"
  | "chat.conversation.join"
  | "chat.conversation.member_added"
  | "chat.conversation.member_removed"
  | "chat.conversation.admin_added"
  | "chat.conversation.admin_removed"
  | "chat.update.group_name"
  | "chat.update.restrictions"
  | "post.reply.create"
  | "post.quote.create"
  | "post.repost.create";

export type XActivityEventType =
  | KnownXActivityEventType
  | (string & Record<never, never>);

/** Generated subscription fields with delivery extensions and direction validation. */
export interface XActivityFilter
  extends
    XJsonObject,
    Omit<Readonly<CreateActivitySubscriptionFilter>, "direction"> {
  readonly direction?: "inbound" | "outbound";
  readonly qualifiers?: Readonly<Record<string, string>>;
}

export interface XAccountActivityDelivery extends XJsonObject {
  /** Most deliveries include this; OAuth revoke user_event payloads may not. */
  readonly for_user_id?: string;
  readonly tweet_create_events?: XJsonArray;
  readonly tweet_delete_events?: XJsonArray;
  readonly favorite_events?: XJsonArray;
  readonly follow_events?: XJsonArray;
  readonly block_events?: XJsonArray;
  readonly mute_events?: XJsonArray;
  readonly user_event?: XJsonValue;
  readonly direct_message_events?: XJsonArray;
  readonly direct_message_indicate_typing_events?: XJsonArray;
  readonly direct_message_mark_read_events?: XJsonArray;
}

export interface XActivityDeliveryData extends XJsonObject {
  readonly event_type: XActivityEventType;
  readonly event_uuid?: string;
  readonly filter?: XActivityFilter;
  readonly includes?: XJsonValue;
  readonly payload?: XJsonValue;
  readonly tag?: string;
}

export interface XActivityDelivery extends XJsonObject {
  readonly data: XActivityDeliveryData;
  readonly errors?: readonly XProblem[];
}

export interface XReplayJobStatus extends XJsonObject {
  readonly webhook_id: string;
  readonly job_state: string;
  readonly job_state_description?: string;
  readonly job_id: string;
}

export interface XReplayJobDelivery extends XJsonObject {
  readonly replay_job_status: XReplayJobStatus;
}

export interface XFilteredStreamData extends XJsonObject {
  readonly id: string;
  readonly text?: string;
}

export interface XFilteredStreamMatchingRule extends XJsonObject {
  readonly id: string;
  readonly tag?: string;
}

export interface XFilteredStreamDelivery extends XJsonObject {
  readonly data: XFilteredStreamData;
  readonly matching_rules: readonly XFilteredStreamMatchingRule[];
  readonly includes?: XJsonValue;
}

export type XWebhookDelivery =
  | XAccountActivityDelivery
  | XActivityDelivery
  | XFilteredStreamDelivery
  | XReplayJobDelivery;
