import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";
import * as HttpRouter from "effect/unstable/http/HttpRouter";
import type * as HttpServerRequest from "effect/unstable/http/HttpServerRequest";
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse";
import type { Input } from "alchemy";
import * as AlchemyOutput from "alchemy/Output";
import {
  createCrcResponse,
  verifyWebhookSignature,
  X_WEBHOOK_SIGNATURE_HEADER,
  type XActivityEventType,
  type XActivityFilter,
  type XAuthKind,
  type XWebhookDelivery,
} from "distilled-x";
import {
  AccountActivitySubscription,
  currentUserId,
  type AccountActivitySubscriptionProps,
} from "./AccountActivitySubscription.ts";
import {
  ActivitySubscription,
  normalizeActivityEventType,
  type ActivitySubscriptionProps,
} from "./ActivitySubscription.ts";
import { XAppCredentials } from "./Credentials.ts";
import { normalizeWebhookUrl, stableId, stableJson } from "./internal.ts";
import { Webhook, type WebhookProps } from "./Webhook.ts";

export interface WebhookRouteActivity {
  /** Stable logical key. Required only when two entries share event/filter. */
  readonly name?: string;
  readonly eventType: XActivityEventType;
  readonly filter: XActivityFilter;
  readonly tag?: string;
  readonly auth?: XAuthKind;
}

export interface WebhookRouteOptions {
  /** Public deployment origin, often a Worker or server resource output. */
  readonly origin: Input<string>;
  /** @default /api/x/webhook */
  readonly path?: string;
  /** Defaults to the API consumer secret resolved by X.providers(). */
  readonly consumerSecret?:
    | string
    | Redacted.Redacted<string>
    | Config.Config<Redacted.Redacted<string>>;
  readonly revalidateInvalid?: boolean;
  /** Allow takeover of an exact registration that races with deployment. */
  readonly adoptExisting?: boolean;
  /** Granular X Activity subscriptions to provision after the webhook. */
  readonly activity?: readonly WebhookRouteActivity[];
  /** Provision full Account Activity for the authenticated OAuth user. */
  readonly accountActivity?: boolean;
  /** Maximum signed delivery size accepted by the public route. @default 5 MiB */
  readonly maxBodyBytes?: number;
}

interface WebhookPropsBuilder {
  url: WebhookProps["url"];
  revalidateInvalid?: boolean;
  adoptExisting?: boolean;
}

interface ActivitySubscriptionPropsBuilder {
  eventType: ActivitySubscriptionProps["eventType"];
  filter: ActivitySubscriptionProps["filter"];
  webhookId: ActivitySubscriptionProps["webhookId"];
  tag?: string;
  auth?: XAuthKind;
}

interface AccountActivitySubscriptionPropsBuilder {
  webhookId: AccountActivitySubscriptionProps["webhookId"];
  userId: AccountActivitySubscriptionProps["userId"];
  adoptExisting?: boolean;
}

export type WebhookHandler<E = unknown, R = never> = (
  delivery: XWebhookDelivery,
  request: HttpServerRequest.HttpServerRequest,
) => Effect.Effect<unknown, E, R>;

const XWebhookDeliveryMarker = Schema.Union([
  Schema.Struct({
    data: Schema.Struct({ event_type: Schema.String }),
  }),
  Schema.Struct({
    data: Schema.Struct({ id: Schema.String }),
    matching_rules: Schema.Array(
      Schema.Struct({
        id: Schema.String,
        tag: Schema.optionalKey(Schema.String),
      }),
    ),
  }),
  Schema.Struct({ for_user_id: Schema.String }),
  Schema.Struct({
    replay_job_status: Schema.Struct({
      webhook_id: Schema.String,
      job_state: Schema.String,
      job_id: Schema.String,
    }),
  }),
  Schema.Struct({
    user_event: Schema.Struct({
      revoke: Schema.Struct({
        source: Schema.Struct({ user_id: Schema.String }),
      }),
    }),
  }),
]);

const hasXWebhookDeliveryMarker = Schema.is(XWebhookDeliveryMarker);

/** A forward-compatible object boundary with a required X delivery marker. */
export const XWebhookPayload = Schema.declare<XWebhookDelivery>(
  hasXWebhookDeliveryMarker,
  {
    description:
      "An Account Activity, X Activity, replay job, or Filtered Stream delivery",
  },
);

export class XWebhookBodyTooLarge extends Schema.TaggedError<XWebhookBodyTooLarge>()(
  "XWebhookBodyTooLarge",
  {
    message: Schema.String,
    bytes: Schema.Number,
    maximumBytes: Schema.Number,
  },
) {}

const DEFAULT_MAX_BODY_BYTES = 5 * 1024 * 1024;

interface WebhookErrorResponse {
  readonly ok?: false;
  readonly error: string;
}

interface WebhookSuccessResponse {
  readonly ok: true;
}

interface WebhookCrcResponse {
  readonly response_token: `sha256=${string}`;
}

type WebhookResponse =
  | WebhookErrorResponse
  | WebhookSuccessResponse
  | WebhookCrcResponse;

const bodyLimit = (input: number): number => {
  if (!Number.isSafeInteger(input) || input <= 0) {
    throw new TypeError(
      "X webhook maxBodyBytes must be a positive safe integer",
    );
  }
  return input;
};

const readBody = (
  request: HttpServerRequest.HttpServerRequest,
  maximumBytes: number,
) => {
  const declaredBytes = Number(request.headers["content-length"]);
  if (Number.isSafeInteger(declaredBytes) && declaredBytes > maximumBytes) {
    return Effect.fail(
      new XWebhookBodyTooLarge({
        bytes: declaredBytes,
        maximumBytes,
        message: `X webhook body exceeds the ${maximumBytes}-byte limit`,
      }),
    );
  }
  interface BodyAccumulator {
    readonly chunks: Uint8Array[];
    bytes: number;
  }
  return Stream.runFoldEffect(
    request.stream,
    (): BodyAccumulator => ({ chunks: [], bytes: 0 }),
    (state, chunk) => {
      const bytes = state.bytes + chunk.byteLength;
      if (bytes > maximumBytes) {
        return Effect.fail(
          new XWebhookBodyTooLarge({
            bytes,
            maximumBytes,
            message: `X webhook body exceeds the ${maximumBytes}-byte limit`,
          }),
        );
      }
      state.chunks.push(chunk);
      state.bytes = bytes;
      return Effect.succeed(state);
    },
  ).pipe(
    Effect.map(({ chunks, bytes }) => {
      const body = new Uint8Array(bytes);
      let offset = 0;
      for (const chunk of chunks) {
        body.set(chunk, offset);
        offset += chunk.byteLength;
      }
      return body;
    }),
  );
};

const response = (status: number, body: WebhookResponse) =>
  HttpServerResponse.jsonUnsafe(body, {
    status,
    headers: { "cache-control": "no-store" },
  });

type RuntimeConsumerSecret<E = never, R = never> =
  | Redacted.Redacted<string>
  | Effect.Effect<Redacted.Redacted<string>, E, R>;

const runtimeConsumerSecret = <E, R>(input: RuntimeConsumerSecret<E, R>) =>
  Redacted.isRedacted(input) ? Effect.succeed(input) : input;

/** @internal Public for portable receiver conformance tests. */
export const makeWebhookHandler = <E, R, SecretE = never, SecretR = never>(
  handler: WebhookHandler<E, R>,
  consumerSecret: RuntimeConsumerSecret<SecretE, SecretR>,
  maximumBodyBytes = DEFAULT_MAX_BODY_BYTES,
) => {
  const maximumBytes = bodyLimit(maximumBodyBytes);
  return (request: HttpServerRequest.HttpServerRequest) =>
    Effect.gen(function* () {
      const secret = yield* runtimeConsumerSecret(consumerSecret).pipe(
        Effect.result,
      );
      if (Result.isFailure(secret)) {
        return response(500, { ok: false, error: "secret_unavailable" });
      }
      const rawResult = yield* readBody(request, maximumBytes).pipe(
        Effect.result,
      );
      if (Result.isFailure(rawResult)) {
        if (rawResult.failure instanceof XWebhookBodyTooLarge) {
          return response(413, { ok: false, error: "body_too_large" });
        }
        return response(400, { ok: false, error: "invalid_body" });
      }
      const rawBody = rawResult.success;
      const verified = yield* Effect.tryPromise({
        try: () =>
          verifyWebhookSignature({
            rawBody,
            signature: request.headers[X_WEBHOOK_SIGNATURE_HEADER],
            consumerSecret: Redacted.value(secret.success),
          }),
        catch: (cause) =>
          cause instanceof Error
            ? cause
            : new Error("Could not verify X webhook signature", { cause }),
      }).pipe(Effect.result);
      if (Result.isFailure(verified) || !verified.success) {
        return response(401, { ok: false, error: "invalid_signature" });
      }

      const decodedText = yield* Effect.try({
        try: () => new TextDecoder("utf-8", { fatal: true }).decode(rawBody),
        catch: (cause) => cause,
      }).pipe(Effect.result);
      if (Result.isFailure(decodedText)) {
        return response(400, { ok: false, error: "invalid_json" });
      }
      const decodedJson = yield* Schema.decodeUnknownEffect(
        Schema.fromJsonString(Schema.Unknown),
      )(decodedText.success).pipe(Effect.result);
      if (Result.isFailure(decodedJson)) {
        return response(400, { ok: false, error: "invalid_json" });
      }
      const payload = yield* Schema.decodeUnknownEffect(XWebhookPayload)(
        decodedJson.success,
      ).pipe(Effect.result);
      if (Result.isFailure(payload)) {
        return response(400, { ok: false, error: "invalid_payload" });
      }

      const handled = yield* handler(payload.success, request).pipe(
        Effect.result,
      );
      if (Result.isFailure(handled)) {
        return response(500, { ok: false, error: "handler_failed" });
      }
      return response(200, { ok: true });
    });
};

/** @internal Resolves literal, Config, and Effect-valued origins. */
export const resolveOrigin = (
  input:
    | string
    | Config.Config<string>
    | Effect.Effect<string, unknown, unknown>,
): Effect.Effect<string, unknown, unknown> =>
  Effect.gen(function* () {
    let current: unknown = input;
    for (let depth = 0; depth < 8; depth++) {
      if (Schema.is(Schema.String)(current)) return current;
      if (Config.isConfig(current)) {
        current = yield* current;
        continue;
      }
      if (Effect.isEffect(current)) {
        current = yield* current;
        continue;
      }
      break;
    }
    return yield* Effect.die(
      new TypeError("X webhook origin must resolve to a string"),
    );
  });

const callbackUrlInput = (
  origin: WebhookRouteOptions["origin"],
  path: string,
): Input<string> => {
  if (AlchemyOutput.isOutput(origin)) {
    return origin.pipe(
      AlchemyOutput.map((resolved) => callbackUrl(resolved, path)),
    );
  }
  return AlchemyOutput.fromEffect(
    resolveOrigin(origin).pipe(
      Effect.map((resolved) => callbackUrl(resolved, path)),
      Effect.orDie,
    ),
  );
};

const resolveConsumerSecret = (input: WebhookRouteOptions["consumerSecret"]) =>
  Effect.gen(function* () {
    if (Schema.is(Schema.String)(input)) return Redacted.make(input);
    if (Redacted.isRedacted(input)) return input;
    if (input && Config.isConfig(input)) return yield* input;
    const credentials = yield* XAppCredentials;
    return credentials.consumerSecret;
  });

const isPathInput = (path: string): path is HttpRouter.PathInput =>
  path === "*" || path.startsWith("/");

const routePath = (input?: string): HttpRouter.PathInput => {
  const path = input?.startsWith("/") ? input : `/${input ?? "api/x/webhook"}`;
  if (
    path.startsWith("//") ||
    path.includes("\\") ||
    path.includes("//") ||
    path.includes("?") ||
    path.includes("#")
  ) {
    throw new TypeError(
      "X webhook path must be an absolute canonical path without duplicate slashes, a query, or a fragment",
    );
  }
  const canonical = new URL(path, "https://alchemy.invalid").pathname;
  if (canonical !== path) {
    throw new TypeError("X webhook path must not contain dot segments");
  }
  if (!isPathInput(path)) {
    throw new TypeError("X webhook path must begin with a slash");
  }
  return path;
};

const callbackUrl = (origin: string, path: string): string => {
  const base = new URL(origin);
  if (base.protocol !== "https:") {
    throw new TypeError("X webhook origin must use HTTPS");
  }
  if (
    base.username !== "" ||
    base.password !== "" ||
    base.port !== "" ||
    (base.pathname !== "" && base.pathname !== "/") ||
    base.search !== "" ||
    base.hash !== ""
  ) {
    throw new TypeError(
      "X webhook origin must contain only an HTTPS scheme and public host (no credentials, port, path, query, or fragment)",
    );
  }
  if (
    base.hostname === "localhost" ||
    base.hostname === "127.0.0.1" ||
    base.hostname === "::1" ||
    base.hostname === "[::1]"
  ) {
    throw new TypeError("X webhook origin must be publicly reachable");
  }
  return normalizeWebhookUrl(new URL(path, base).toString());
};

/** @internal Public for receiver conformance tests. */
export const makeCrcHandler =
  <E = never, R = never>(consumerSecret: RuntimeConsumerSecret<E, R>) =>
  (request: HttpServerRequest.HttpServerRequest) =>
    Effect.gen(function* () {
      const url = new URL(request.url, "https://alchemy.invalid");
      const token = url.searchParams.get("crc_token");
      const firstTokenCharacter = token?.trimStart()[0];
      // X intentionally uses the same HMAC key and construction for CRC and
      // POST signatures. Never sign an object-shaped token: otherwise this
      // public GET route becomes a chosen-message signing oracle for a forged
      // webhook delivery whose raw JSON bytes equal the token.
      if (
        !token ||
        firstTokenCharacter === "{" ||
        firstTokenCharacter === "[" ||
        new TextEncoder().encode(token).byteLength > 1_024
      ) {
        return response(400, { error: "invalid_crc_token" });
      }
      const secret = yield* runtimeConsumerSecret(consumerSecret);
      const crc = yield* Effect.tryPromise({
        try: () => createCrcResponse(token, Redacted.value(secret)),
        catch: (cause) =>
          cause instanceof Error
            ? cause
            : new Error("Could not create X CRC response", { cause }),
      });
      return response(200, crc);
    }).pipe(
      Effect.catch(() =>
        Effect.succeed(response(500, { error: "crc_failed" })),
      ),
    );

/**
 * Mount a CRC/signature-verified X receiver and declaratively register its
 * remote webhook and optional activity subscriptions.
 */
export const WebhookRoute = <E, R>(
  name: string,
  options: WebhookRouteOptions,
  handler: WebhookHandler<E, R>,
) =>
  Layer.effectDiscard(
    Effect.gen(function* () {
      const path = routePath(options.path);
      const consumerSecret = yield* AlchemyOutput.named(
        AlchemyOutput.fromEffect(
          resolveConsumerSecret(options.consumerSecret).pipe(Effect.orDie),
        ),
        `ALCHEMY_X_${stableId(name).toUpperCase()}_CONSUMER_SECRET`,
      );

      if (!globalThis["__ALCHEMY_RUNTIME__"]) {
        const webhookProps: WebhookPropsBuilder = {
          url: callbackUrlInput(options.origin, path),
        };
        if (options.revalidateInvalid !== undefined) {
          webhookProps.revalidateInvalid = options.revalidateInvalid;
        }
        if (options.adoptExisting !== undefined) {
          webhookProps.adoptExisting = options.adoptExisting;
        }
        const webhook = yield* Webhook(`${name}Webhook`, webhookProps);

        const activityIds = new Set<string>();
        for (const subscription of options.activity ?? []) {
          const key = stableId(
            subscription.name !== undefined
              ? `name:${subscription.name}`
              : stableJson([
                  normalizeActivityEventType(subscription.eventType),
                  subscription.filter,
                ]),
          );
          if (activityIds.has(key)) {
            return yield* Effect.die(
              new TypeError(
                "Duplicate X activity declaration; provide a unique activity name",
              ),
            );
          }
          activityIds.add(key);
          const activityProps: ActivitySubscriptionPropsBuilder = {
            eventType: subscription.eventType,
            filter: subscription.filter,
            webhookId: webhook.webhookId,
          };
          if (subscription.tag !== undefined) {
            activityProps.tag = subscription.tag;
          }
          if (subscription.auth !== undefined) {
            activityProps.auth = subscription.auth;
          }
          yield* ActivitySubscription(`${name}Activity${key}`, activityProps);
        }
        if (options.accountActivity) {
          const userId = yield* currentUserId;
          const accountActivityProps: AccountActivitySubscriptionPropsBuilder =
            {
              webhookId: webhook.webhookId,
              userId,
            };
          if (options.adoptExisting !== undefined) {
            accountActivityProps.adoptExisting = options.adoptExisting;
          }
          yield* AccountActivitySubscription(
            `${name}AccountActivity`,
            accountActivityProps,
          );
        }
      }

      const router = yield* HttpRouter.HttpRouter;
      yield* router.add("GET", path, makeCrcHandler(consumerSecret));
      yield* router.add(
        "POST",
        path,
        makeWebhookHandler(
          handler,
          consumerSecret,
          options.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES,
        ),
      );
    }).pipe(Effect.orDie),
  );

/** Concise event-source alias for {@link WebhookRoute}. */
export const events = WebhookRoute;
