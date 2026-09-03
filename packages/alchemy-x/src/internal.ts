import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { HTTP_STATUS_MAP, UnknownXError } from "effect-xdk";

export class XAdoptionRequired extends Schema.TaggedError<XAdoptionRequired>()(
  "XAdoptionRequired",
  {
    message: Schema.String,
    resourceType: Schema.String,
    remoteId: Schema.String,
  },
) {}

export class XResponseError extends Schema.TaggedError<XResponseError>()(
  "XResponseError",
  { message: Schema.String, body: Schema.Unknown },
) {}

interface Envelope<T> {
  readonly data?: T;
  readonly errors?: unknown;
}

const Errors = Schema.Array(Schema.Record(Schema.String, Schema.Json));

/** Partial or errors-only responses cannot establish resource ownership. */
export const assertXAuthoritative = (
  response: Envelope<unknown>,
  operation: string,
): Effect.Effect<void, XResponseError> =>
  response.errors !== undefined &&
  (!Schema.is(Errors)(response.errors) || response.errors.length > 0)
    ? Effect.fail(
        new XResponseError({
          message: `X returned partial errors while ${operation}`,
          body: response,
        }),
      )
    : Effect.void;

export const requireXData = <T>(response: Envelope<T>, operation: string) =>
  assertXAuthoritative(response, operation).pipe(
    Effect.andThen(() =>
      response.data === undefined
        ? Effect.fail(
            new XResponseError({
              message: `X did not return data while ${operation}`,
              body: response,
            }),
          )
        : Effect.succeed(response.data),
    ),
  );

const statusErrors = new Map(
  Object.entries(HTTP_STATUS_MAP).map(([status, error]) => [
    Number(status),
    error,
  ]),
);

export const isXStatus = (cause: unknown, status: number): boolean => {
  const ErrorClass = statusErrors.get(status);
  return (
    (ErrorClass !== undefined && cause instanceof ErrorClass) ||
    (cause instanceof UnknownXError && cause.status === status)
  );
};

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
