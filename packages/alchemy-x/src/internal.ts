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

const encodedBody = (value: unknown): string =>
  JSON.stringify(value) ?? String(value);

/**
 * Lifecycle observations must be authoritative. X can return a successful
 * errors-only or partial envelope, which is useful to imperative callers but
 * cannot safely drive create/delete decisions.
 */
const assertXAuthoritativeSync = <T extends XEnvelope<unknown>>(
  result: XResult<T>,
  operation: string,
): void => {
  const errors = result.value.errors as unknown;
  if (
    errors !== undefined &&
    (!Array.isArray(errors) ||
      errors.length > 0 ||
      !errors.every(
        (problem) => problem !== null && typeof problem === "object",
      ))
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

const canonicalJsonValue = (
  value: unknown,
  ancestors: ReadonlySet<object>,
): unknown => {
  if (Array.isArray(value)) {
    if (ancestors.has(value)) {
      throw new TypeError("Cannot canonicalize a cyclic JSON value");
    }
    const nested = new Set(ancestors).add(value);
    return value.map((entry) =>
      entry === undefined ||
      typeof entry === "function" ||
      typeof entry === "symbol"
        ? null
        : canonicalJsonValue(entry, nested),
    );
  }
  if (value !== null && typeof value === "object") {
    if (ancestors.has(value)) {
      throw new TypeError("Cannot canonicalize a cyclic JSON value");
    }
    const nested = new Set(ancestors).add(value);
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value).sort()) {
      const entry = (value as Record<string, unknown>)[key];
      if (
        entry !== undefined &&
        typeof entry !== "function" &&
        typeof entry !== "symbol"
      ) {
        result[key] = canonicalJsonValue(entry, nested);
      }
    }
    return result;
  }
  return value;
};

/** JSON encoding whose object-key order is stable across equivalent inputs. */
export const stableJson = (value: unknown): string => {
  const encoded = JSON.stringify(canonicalJsonValue(value, new Set()));
  if (encoded === undefined) {
    throw new TypeError("Value cannot be represented as JSON");
  }
  return encoded;
};

export const ignoreXNotFound = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
): Effect.Effect<A | undefined, Exclude<E, XApiError>, R> =>
  effect.pipe(
    Effect.catch((cause) =>
      isXStatus(cause, 404)
        ? Effect.succeed(undefined)
        : Effect.fail(cause as Exclude<E, XApiError>),
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
