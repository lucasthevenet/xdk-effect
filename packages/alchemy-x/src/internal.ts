import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import {
  XApiError,
  XDecodeError,
  type XEnvelope,
  type XResult,
} from "distilled-x";

export class XAdoptionRequired extends Schema.TaggedError<XAdoptionRequired>()(
  "XAdoptionRequired",
  {
    message: Schema.String,
    resourceType: Schema.String,
    remoteId: Schema.String,
  },
) {}

export const callX = <A>(thunk: () => Promise<A>) =>
  Effect.tryPromise({
    try: thunk,
    catch: (cause) =>
      cause instanceof Error
        ? cause
        : new Error("X API request failed", { cause }),
  });

const encodedBody = (value: XEnvelope<unknown>): string =>
  JSON.stringify(value) ?? String(value);

const XErrorsEnvelopeSchema = Schema.Struct({
  errors: Schema.optional(
    Schema.Array(Schema.Record(Schema.String, Schema.Json)),
  ),
});
const isXErrorsEnvelope = Schema.is(XErrorsEnvelopeSchema);

/**
 * Lifecycle observations must be authoritative. X can return a successful
 * errors-only or partial envelope, which is useful to imperative callers but
 * cannot safely drive create/delete decisions.
 */
const assertXAuthoritativeSync = <T extends XEnvelope<unknown>>(
  result: XResult<T>,
  operation: string,
): void => {
  if (
    !isXErrorsEnvelope(result.value) ||
    (result.value.errors !== undefined && result.value.errors.length > 0)
  ) {
    throw new XDecodeError(
      `X returned partial errors while ${operation}`,
      result.status,
      encodedBody(result.value),
    );
  }
};

export const assertXAuthoritative = <T extends XEnvelope<unknown>>(
  result: XResult<T>,
  operation: string,
) =>
  Effect.try({
    try: () => assertXAuthoritativeSync(result, operation),
    catch: (cause) =>
      cause instanceof XDecodeError
        ? cause
        : new XDecodeError(
            `Could not validate X's response while ${operation}`,
            result.status,
            encodedBody(result.value),
            { cause },
          ),
  });

export const requireXData = <T>(
  result: XResult<XEnvelope<T>>,
  operation: string,
) =>
  Effect.try({
    try: () => {
      assertXAuthoritativeSync(result, operation);
      if (result.value.data === undefined) {
        throw new XDecodeError(
          `X did not return data while ${operation}`,
          result.status,
          encodedBody(result.value),
        );
      }
      return result.value.data;
    },
    catch: (cause) =>
      cause instanceof XDecodeError
        ? cause
        : new XDecodeError(
            `Could not validate X's response while ${operation}`,
            result.status,
            encodedBody(result.value),
            { cause },
          ),
  });

export const isXStatus = (cause: unknown, status: number): boolean =>
  cause instanceof XApiError && cause.status === status;

export const isDuplicateSubscription = (cause: unknown): boolean =>
  cause instanceof XApiError &&
  cause.problems.some((problem) => {
    const text = [problem.type, problem.title, problem.detail, problem.message]
      .filter((part): part is string => typeof part === "string")
      .join(" ")
      .toLowerCase();
    return (
      text.includes("duplicatesubscriptionfailed") ||
      text.includes("duplicate subscription") ||
      text.includes("already subscribed")
    );
  });

export const stableId = (value: string): string => {
  let hash = 0xcbf29ce484222325n;
  for (let index = 0; index < value.length; index++) {
    hash ^= BigInt(value.charCodeAt(index));
    hash = BigInt.asUintN(64, hash * 0x100000001b3n);
  }
  return hash.toString(36);
};

const isJsonObject = (value: Schema.Json): value is Schema.JsonObject =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const canonicalJsonValue = (
  value: Schema.Json,
  ancestors: ReadonlySet<Schema.JsonArray | Schema.JsonObject>,
): Schema.Json => {
  if (Array.isArray(value)) {
    if (ancestors.has(value)) {
      throw new TypeError("Cannot canonicalize a cyclic JSON value");
    }
    const nested = new Set(ancestors).add(value);
    return value.map((entry) => canonicalJsonValue(entry, nested));
  }
  if (isJsonObject(value)) {
    if (ancestors.has(value)) {
      throw new TypeError("Cannot canonicalize a cyclic JSON value");
    }
    const nested = new Set(ancestors).add(value);
    const result: Record<string, Schema.Json> = {};
    for (const key of Object.keys(value).toSorted()) {
      const entry = value[key];
      if (entry !== undefined) {
        result[key] = canonicalJsonValue(entry, nested);
      }
    }
    return result;
  }
  return value;
};

/** JSON encoding whose object-key order is stable across equivalent inputs. */
export const stableJson = (value: Schema.Json): string => {
  const encoded = JSON.stringify(canonicalJsonValue(value, new Set()));
  if (encoded === undefined) {
    throw new TypeError("Value cannot be represented as JSON");
  }
  return encoded;
};

export const ignoreXNotFound = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
): Effect.Effect<A | undefined, E, R> =>
  effect.pipe(
    Effect.catch((cause) =>
      isXStatus(cause, 404) ? Effect.succeed(undefined) : Effect.fail(cause),
    ),
  );

export const normalizeWebhookUrl = (input: string): string => {
  let url: URL;
  try {
    url = new URL(input);
  } catch (cause) {
    throw new TypeError("X webhook URL must be an absolute URL", { cause });
  }
  if (url.protocol !== "https:") {
    throw new TypeError("X webhook URL must use HTTPS");
  }
  if (url.username !== "" || url.password !== "") {
    throw new TypeError("X webhook URL must not contain credentials");
  }
  if (url.port !== "") {
    throw new TypeError("X webhook URL must not include an explicit port");
  }
  url.hash = "";
  const normalized = url.toString();
  if (normalized.length > 200) {
    throw new TypeError("X webhook URL must be at most 200 characters");
  }
  return normalized;
};
