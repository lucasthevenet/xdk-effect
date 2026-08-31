import type { XJsonValue, XProblem, XRateLimit } from "./types.ts";

export class XTransportError extends Error {
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
  override readonly name = "XAuthenticationError";
}

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
