import type { XJsonValue, XProblem, XRateLimit } from "./types.ts";

export class XTransportError extends Error {
  readonly _tag = "XTransportError";
  override readonly name = "XTransportError";

  constructor(
    message: string,
    readonly method: string,
    readonly url: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
  }
}

export class XDecodeError extends Error {
  readonly _tag = "XDecodeError";
  override readonly name = "XDecodeError";

  constructor(
    message: string,
    readonly status: number,
    readonly body: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
  }
}

export class XApiError extends Error {
  readonly _tag = "XApiError";
  override readonly name = "XApiError";

  constructor(
    message: string,
    readonly status: number,
    readonly method: string,
    readonly url: string,
    readonly problems: readonly XProblem[],
    readonly body: XJsonValue | undefined,
    readonly rateLimit?: XRateLimit,
  ) {
    super(message);
  }
}

export class XAuthenticationError extends Error {
  readonly _tag = "XAuthenticationError";
  override readonly name = "XAuthenticationError";
}

export class XInputError extends Error {
  readonly _tag = "XInputError";
  override readonly name = "XInputError";
}

export type XError =
  | XApiError
  | XAuthenticationError
  | XDecodeError
  | XInputError
  | XTransportError;

export class XOAuthError extends Error {
  override readonly name = "XOAuthError";

  constructor(
    readonly error: string,
    readonly errorDescription: string,
    readonly status?: number,
    readonly body?: XJsonValue,
  ) {
    super(errorDescription);
  }
}

export class XOAuthStateError extends Error {
  override readonly name = "XOAuthStateError";

  constructor(message = "The OAuth callback state does not match") {
    super(message);
  }
}
