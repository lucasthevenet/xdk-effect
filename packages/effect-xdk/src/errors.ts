import * as Schema from "effect/Schema";
import * as Category from "@distilled.cloud/core/category";
import type { HTTP_STATUS_MAP } from "@distilled.cloud/core/errors";

export {
  BadGateway,
  BadRequest,
  Conflict,
  ConfigError,
  Forbidden,
  GatewayTimeout,
  InternalServerError,
  Locked,
  NotFound,
  ServiceUnavailable,
  TooManyRequests,
  Unauthorized,
  UnprocessableEntity,
  HTTP_STATUS_MAP,
} from "@distilled.cloud/core/errors";

export class UnknownXError extends Schema.TaggedError<UnknownXError>()(
  "UnknownXError",
  {
    message: Schema.String,
    status: Schema.Number,
    body: Schema.Unknown,
  },
).pipe(Category.withServerError) {}

export class XParseError extends Schema.TaggedError<XParseError>()(
  "XParseError",
  {
    message: Schema.String,
    cause: Schema.Unknown,
  },
).pipe(Category.withParseError) {}

/** An internally minted app token was rejected; safe operations may refresh it. */
export class XTokenExpired extends Schema.TaggedError<XTokenExpired>()(
  "XTokenExpired",
  {
    message: Schema.String,
  },
).pipe(
  Category.withAuthError,
  Category.withRetryableError,
  Category.withRetryable(),
) {}

export type DefaultErrors =
  | InstanceType<(typeof HTTP_STATUS_MAP)[keyof typeof HTTP_STATUS_MAP]>
  | UnknownXError
  | XParseError
  | XTokenExpired
  | XAuthenticationError
  | XInputError;

export class XAuthenticationError extends Error {
  readonly _tag = "XAuthenticationError";
  override readonly name = "XAuthenticationError";
}

export class XInputError extends Error {
  readonly _tag = "XInputError";
  override readonly name = "XInputError";
}

export class XOAuthError extends Error {
  readonly _tag = "XOAuthError";
  override readonly name = "XOAuthError";

  constructor(
    readonly error: string,
    readonly errorDescription: string,
    readonly status?: number,
    readonly body?: Schema.Json,
  ) {
    super(errorDescription);
  }
}

export class XOAuthStateError extends Error {
  readonly _tag = "XOAuthStateError";
  override readonly name = "XOAuthStateError";

  constructor(message = "The OAuth callback state does not match") {
    super(message);
  }
}
