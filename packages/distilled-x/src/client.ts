import { XApiError, XDecodeError, XTransportError } from "./errors.ts";
import { runtime, type XRuntimeOptions } from "./runtime.ts";
import {
  createAuthentication,
  selectAuthentication,
  type XAuthentication,
} from "./auth.ts";
import { prepareOperation } from "./operation-wire.ts";
import type { OperationDefinition } from "./operation-types.ts";
import { operations } from "./operations.ts";
export type {
  XCredentials,
  XBearerCredentials,
  XAuthentication,
} from "./auth.ts";
import type {
  XAccountActivitySubscriptionStatus,
  XAccountActivitySubscriptions,
  XActivitySubscription,
  XActivitySubscriptionInput,
  XEnvelope,
  XJsonObject,
  XJsonValue,
  XProblem,
  XRateLimit,
  XResult,
  XUser,
  XWebhook,
  XWebhookValidation,
} from "./types.ts";

export const X_API_ORIGIN = "https://api.x.com";

export type XAuthKind = "app" | "user";

export interface XRequestOptions {
  readonly query?: Readonly<
    Record<
      string,
      | string
      | number
      | boolean
      | readonly (string | number | boolean)[]
      | undefined
    >
  >;
  readonly json?: unknown;
  /** Internal transport support for generated multipart and streaming calls. */
  readonly rawBody?: FormData;
  readonly responseType?: "json" | "response";
  readonly security?: OperationDefinition["security"];
  readonly headers?: HeadersInit;
  readonly signal?: AbortSignal;
  readonly auth?: XAuthKind;
  readonly retryNonIdempotent?: boolean;
}

export type XClientConfig = XAuthentication & XClientOptions;

export interface XClientOptions {
  readonly apiOrigin?: string;
  readonly runtime?: XRuntimeOptions;
  readonly retry?: {
    readonly maxAttempts?: number;
    readonly baseDelayMs?: number;
    readonly maxDelayMs?: number;
  };
}

interface MutableRateLimit {
  limit?: number;
  remaining?: number;
  resetAt?: Date;
}
type XResponseBody = XJsonValue | undefined;
type XHttpMethod = "DELETE" | "GET" | "POST" | "PUT";

const isJsonObject = (value: XJsonValue | undefined): value is XJsonObject =>
  value !== undefined &&
  value !== null &&
  !Array.isArray(value) &&
  Object(value) === value;

const isString = (value: XJsonValue | undefined): value is string =>
  typeof value === "string";

const isNumber = (value: XJsonValue | undefined): value is number =>
  value !== undefined && Number.isFinite(value);

const isBoolean = (value: XJsonValue | undefined): value is boolean =>
  value === true || value === false;

const isOptionalString = (value: XJsonValue | undefined): boolean =>
  value === undefined || isString(value);

const parseJson = (text: string): XJsonValue => JSON.parse(text);

const addQuery = (url: URL, query: XRequestOptions["query"]): void => {
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined) continue;
    url.searchParams.set(
      key,
      Array.isArray(value) ? value.join(",") : String(value),
    );
  }
};

const canRetryMethod = (
  method: XHttpMethod,
  retryNonIdempotent: boolean | undefined,
): boolean =>
  method === "GET" ||
  method === "PUT" ||
  method === "DELETE" ||
  retryNonIdempotent === true;

const requestInit = (
  method: XHttpMethod,
  headers: Headers,
  body: string | FormData | undefined,
  signal: AbortSignal | undefined,
): RequestInit => {
  const init: RequestInit = { method, headers, redirect: "error" };
  if (body !== undefined) init.body = body;
  if (signal !== undefined) init.signal = signal;
  return init;
};

const decodeResponseBody = async (
  response: Response,
): Promise<XResponseBody> => {
  const text = await response.text();
  if (text.length === 0) return undefined;
  try {
    return parseJson(text);
  } catch (cause) {
    if (response.ok) {
      throw new XDecodeError(
        "X returned a malformed JSON response",
        response.status,
        text,
        { cause },
      );
    }
    return text;
  }
};

const canRetryResponse = (
  response: Response,
  retryableMethod: boolean,
  attempt: number,
  maxAttempts: number,
): boolean =>
  retryableMethod &&
  attempt < maxAttempts &&
  (response.status === 408 ||
    response.status === 429 ||
    response.status >= 500);

const numberHeader = (headers: Headers, name: string): number | undefined => {
  const value = headers.get(name);
  if (value === null) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const rateLimitOf = (headers: Headers): XRateLimit | undefined => {
  const limit = numberHeader(headers, "x-rate-limit-limit");
  const remaining = numberHeader(headers, "x-rate-limit-remaining");
  const reset = numberHeader(headers, "x-rate-limit-reset");
  if (limit === undefined && remaining === undefined && reset === undefined) {
    return undefined;
  }
  const rateLimit: MutableRateLimit = {};
  if (limit !== undefined) rateLimit.limit = limit;
  if (remaining !== undefined) rateLimit.remaining = remaining;
  if (reset !== undefined) rateLimit.resetAt = new Date(reset * 1000);
  return rateLimit;
};

const decodeProblem = (value: XJsonValue): XProblem | undefined => {
  if (!isJsonObject(value)) return undefined;
  if (
    !isOptionalString(value.type) ||
    !isOptionalString(value.title) ||
    !isOptionalString(value.detail) ||
    !isOptionalString(value.message) ||
    !isOptionalString(value.parameter) ||
    !isOptionalString(value.value) ||
    !isOptionalString(value.resource_id) ||
    !isOptionalString(value.resource_type) ||
    (value.status !== undefined && !isNumber(value.status)) ||
    (value.code !== undefined && !isNumber(value.code))
  ) {
    return undefined;
  }
  // SAFETY: Every declared XProblem field has been validated; extension fields
  // remain JSON values, matching XProblem's JSON extension contract.
  return value as XProblem;
};

const problemsOf = (body: XResponseBody): readonly XProblem[] => {
  if (!isJsonObject(body)) return [];
  if (Array.isArray(body.errors)) {
    return body.errors.flatMap((candidate) => {
      const problem = decodeProblem(candidate);
      return problem === undefined ? [] : [problem];
    });
  }
  const problem = decodeProblem(body);
  if (
    problem !== undefined &&
    (problem.detail !== undefined ||
      problem.title !== undefined ||
      problem.message !== undefined)
  ) {
    return [problem];
  }
  return [];
};

const errorMessage = (
  status: number,
  problems: readonly XProblem[],
): string => {
  const first = problems[0];
  return (
    first?.detail ?? first?.message ?? first?.title ?? `X API error ${status}`
  );
};

const isActivityFilter = (
  candidate: XJsonValue | undefined,
): candidate is XJsonObject => {
  if (!isJsonObject(candidate)) return false;
  const filterKeys = new Set(["user_id", "keyword", "direction", "qualifiers"]);
  if (!Object.keys(candidate).every((key) => filterKeys.has(key))) return false;
  if (!isOptionalString(candidate.user_id)) return false;
  if (!isOptionalString(candidate.keyword)) return false;
  if (
    candidate.direction !== undefined &&
    candidate.direction !== "inbound" &&
    candidate.direction !== "outbound"
  ) {
    return false;
  }
  if (candidate.qualifiers === undefined) return true;
  if (!isJsonObject(candidate.qualifiers)) return false;
  return Object.values(candidate.qualifiers).every(isString);
};

const unwrapSubscription = (envelope: XJsonValue): XJsonObject | undefined => {
  if (!isJsonObject(envelope)) return undefined;
  const data = isJsonObject(envelope.data) ? envelope.data : envelope;
  return isJsonObject(data.subscription) ? data.subscription : data;
};

const normalizeParsedSubscription = (
  envelope: XJsonValue,
): XActivitySubscription | undefined => {
  const candidate = unwrapSubscription(envelope);
  if (candidate === undefined) return undefined;
  if (!isString(candidate.subscription_id)) return undefined;
  if (!isString(candidate.event_type)) return undefined;
  if (!isActivityFilter(candidate.filter)) return undefined;
  if (!isOptionalString(candidate.tag)) return undefined;
  if (!isOptionalString(candidate.webhook_id)) return undefined;
  if (!isOptionalString(candidate.created_at)) return undefined;
  if (!isOptionalString(candidate.updated_at)) return undefined;
  // SAFETY: Required subscription fields, every optional declared field, and
  // the nested filter contract have been validated above.
  return candidate as XActivitySubscription;
};

const normalizeSubscription = <Payload>(
  envelope: Payload,
): XActivitySubscription | undefined => {
  try {
    const encoded = JSON.stringify(envelope);
    if (encoded === undefined) return undefined;
    return normalizeParsedSubscription(parseJson(encoded));
  } catch {
    return undefined;
  }
};

const recordOf = (
  value: XJsonValue,
  status: number,
  message: string,
): XJsonObject => {
  if (!isJsonObject(value)) {
    throw new XDecodeError(message, status, JSON.stringify(value));
  }
  return value;
};

const decodeEnvelopeProblems = (
  value: XJsonValue | undefined,
  status: number,
  message: string,
): readonly XProblem[] | undefined => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) {
    throw new XDecodeError(message, status, JSON.stringify(value));
  }
  const problems = value.map(decodeProblem);
  if (problems.some((problem) => problem === undefined)) {
    throw new XDecodeError(message, status, JSON.stringify(value));
  }
  // SAFETY: The undefined check above proves every mapped entry decoded.
  return problems as readonly XProblem[];
};

const isOptionalCount = (value: XJsonValue | undefined): boolean =>
  value === undefined ||
  (isNumber(value) && Number.isInteger(value) && value >= 0);

const decodeEnvelopeMeta = (
  value: XJsonValue | undefined,
  status: number,
  message: string,
): XEnvelope<never>["meta"] => {
  if (value === undefined) return undefined;
  if (
    !isJsonObject(value) ||
    !isOptionalString(value.next_token) ||
    !isOptionalString(value.previous_token) ||
    !isOptionalCount(value.result_count) ||
    !isOptionalCount(value.total_subscriptions)
  ) {
    throw new XDecodeError(message, status, JSON.stringify(value));
  }
  return value;
};

const mapEnvelopeData = <T>(
  result: XResult<XResponseBody>,
  message: string,
  decode: (value: XJsonValue, status: number) => T,
): XResult<XEnvelope<T>> => {
  if (result.value === undefined) {
    throw new XDecodeError(message, result.status, "");
  }
  const envelope = recordOf(result.value, result.status, message);
  decodeEnvelopeProblems(envelope.errors, result.status, message);
  decodeEnvelopeMeta(envelope.meta, result.status, message);
  if (!("data" in envelope) || envelope.data === undefined) {
    // SAFETY: Envelope errors and metadata were decoded above; absent data is
    // allowed by XEnvelope for delete confirmations and partial responses.
    return { ...result, value: envelope as XEnvelope<T> };
  }
  const data = decode(envelope.data, result.status);
  // SAFETY: The source envelope was parsed JSON, envelope metadata was
  // validated, and `data` was decoded by the endpoint-specific decoder.
  const value = { ...envelope, data } as XEnvelope<T>;
  return {
    ...result,
    value,
  };
};

const requireEnvelopeData = <T>(
  result: XResult<XEnvelope<T>>,
  operation: string,
): T => {
  if (result.value.errors !== undefined && result.value.errors.length > 0) {
    throw new XDecodeError(
      `X returned partial errors while ${operation}`,
      result.status,
      JSON.stringify(result.value),
    );
  }
  if (result.value.data === undefined) {
    throw new XDecodeError(
      `X did not return data while ${operation}`,
      result.status,
      JSON.stringify(result.value),
    );
  }
  return result.value.data;
};

const decodeWebhook = (value: XJsonValue, status: number): XWebhook => {
  const webhook = recordOf(value, status, "X returned a malformed webhook");
  if (
    !isString(webhook.id) ||
    !isString(webhook.url) ||
    !isBoolean(webhook.valid) ||
    !isString(webhook.created_at)
  ) {
    throw new XDecodeError(
      "X returned an incomplete webhook",
      status,
      JSON.stringify(value),
    );
  }
  // SAFETY: Every declared XWebhook field is validated above; any additional
  // properties are parsed JSON and therefore valid unknown extension fields.
  return webhook as XWebhook;
};

const decodeWebhookList = (
  value: XJsonValue,
  status: number,
): readonly XWebhook[] => {
  if (!Array.isArray(value)) {
    throw new XDecodeError(
      "X returned a malformed webhook list",
      status,
      JSON.stringify(value),
    );
  }
  return value.map((webhook) => decodeWebhook(webhook, status));
};

const decodeConfirmation =
  <Key extends "deleted" | "subscribed">(key: Key, label: string) =>
  (value: XJsonValue, status: number): Readonly<Record<Key, boolean>> => {
    const confirmation = recordOf(
      value,
      status,
      `X returned a malformed ${label} confirmation`,
    );
    if (!isBoolean(confirmation[key])) {
      throw new XDecodeError(
        `X did not include the ${label} confirmation`,
        status,
        JSON.stringify(value),
      );
    }
    // SAFETY: The requested confirmation key was decoded as a boolean.
    return confirmation as Readonly<Record<Key, boolean>>;
  };

const decodeWebhookValidation = (
  value: XJsonValue,
  status: number,
): XWebhookValidation => {
  const confirmation = recordOf(
    value,
    status,
    "X returned a malformed webhook validation confirmation",
  );
  if (!isBoolean(confirmation.valid) && !isBoolean(confirmation.attempted)) {
    throw new XDecodeError(
      "X did not include the webhook validation confirmation",
      status,
      JSON.stringify(value),
    );
  }
  if (
    (confirmation.valid !== undefined && !isBoolean(confirmation.valid)) ||
    (confirmation.attempted !== undefined && !isBoolean(confirmation.attempted))
  ) {
    throw new XDecodeError(
      "X returned an invalid webhook validation confirmation",
      status,
      JSON.stringify(value),
    );
  }
  // SAFETY: At least one validation flag exists and both flags, when present,
  // have been decoded as booleans.
  return confirmation as XWebhookValidation;
};

const decodeActivitySubscriptionList = (
  value: XJsonValue,
  status: number,
): readonly XActivitySubscription[] => {
  if (!Array.isArray(value)) {
    throw new XDecodeError(
      "X returned a malformed activity subscription list",
      status,
      JSON.stringify(value),
    );
  }
  return value.map((entry) => {
    const subscription = normalizeParsedSubscription(entry);
    if (!subscription) {
      throw new XDecodeError(
        "X returned an incomplete activity subscription",
        status,
        JSON.stringify(entry),
      );
    }
    return subscription;
  });
};

const decodeUser = (value: XJsonValue, status: number): XUser => {
  const user = recordOf(value, status, "X returned a malformed user");
  if (!isString(user.id)) {
    throw new XDecodeError(
      "X returned an incomplete user",
      status,
      JSON.stringify(value),
    );
  }
  // SAFETY: XUser requires only a string id; extension fields are valid JSON.
  return user as XUser;
};

const decodeAccountActivityStatus = (
  value: XJsonValue,
  status: number,
): XAccountActivitySubscriptionStatus =>
  decodeConfirmation("subscribed", "subscription")(value, status);

const isAccountSubscription = (value: XJsonValue): boolean =>
  isJsonObject(value) && isString(value.user_id);

const decodeAccountActivitySubscriptions = (
  value: XJsonValue,
  status: number,
): XAccountActivitySubscriptions => {
  const subscriptions = recordOf(
    value,
    status,
    "X returned a malformed Account Activity subscription list",
  );
  if (
    (subscriptions.application_id !== undefined &&
      !isString(subscriptions.application_id)) ||
    (subscriptions.webhook_id !== undefined &&
      !isString(subscriptions.webhook_id)) ||
    (subscriptions.webhook_url !== undefined &&
      !isString(subscriptions.webhook_url)) ||
    (subscriptions.subscriptions !== undefined &&
      (!Array.isArray(subscriptions.subscriptions) ||
        !subscriptions.subscriptions.every(isAccountSubscription)))
  ) {
    throw new XDecodeError(
      "X returned an incomplete Account Activity subscription list",
      status,
      JSON.stringify(value),
    );
  }
  // SAFETY: All declared optional fields and every nested user id were
  // validated above; remaining properties are JSON extension fields.
  return subscriptions as XAccountActivitySubscriptions;
};

export const createXClient = (config: XClientConfig) => {
  const platform = runtime(config.runtime);
  const base = new URL(config.apiOrigin ?? X_API_ORIGIN);
  base.pathname = base.pathname.replace(/\/+$/u, "");
  const maxAttempts = Math.max(1, config.retry?.maxAttempts ?? 3);
  const baseDelayMs = Math.max(0, config.retry?.baseDelayMs ?? 250);
  const maxDelayMs = Math.max(baseDelayMs, config.retry?.maxDelayMs ?? 30_000);

  const authentication = createAuthentication(config, platform, base.origin);

  const request = async <T>(
    method: XHttpMethod,
    path: `/${string}`,
    options: XRequestOptions = {},
  ): Promise<XResult<T>> => {
    const url = new URL(path, base);
    if (url.origin !== base.origin) {
      throw new TypeError("X request paths must stay on the configured origin");
    }
    addQuery(url, options.query);
    const auth = options.security
      ? selectAuthentication(config, options.security, options.auth)
      : (options.auth ?? "user");
    const retryableMethod = canRetryMethod(method, options.retryNonIdempotent);

    const fetchAttempt = async (
      attempt: number,
    ): Promise<Response | undefined> => {
      const headers = new Headers(options.headers);
      if (!headers.has("Accept")) headers.set("Accept", "application/json");
      if (auth)
        headers.set(
          "Authorization",
          await authentication.authorize(auth, method, url, options.signal),
        );
      else headers.delete("Authorization");
      const body =
        options.rawBody ??
        (options.json === undefined ? undefined : JSON.stringify(options.json));
      if (options.rawBody) headers.delete("Content-Type");
      else if (body !== undefined)
        headers.set("Content-Type", "application/json");

      try {
        const response = await platform.fetch(
          url,
          requestInit(method, headers, body, options.signal),
        );
        if (
          response.status === 401 &&
          auth === "app" &&
          authentication.invalidate(headers.get("Authorization")!)
        ) {
          // A rejected write is not automatically replayed. The next call can
          // obtain a fresh token; safe/idempotent requests may recover here.
          if (retryableMethod && attempt < maxAttempts) {
            await response.body?.cancel();
            return undefined;
          }
        }
        return response;
      } catch (cause) {
        if (options.signal?.aborted) throw cause;
        if (retryableMethod && attempt < maxAttempts) {
          const delay = Math.min(
            maxDelayMs,
            baseDelayMs * 2 ** (attempt - 1) * (0.5 + platform.random()),
          );
          await platform.sleep(delay, options.signal);
          return undefined;
        }
        throw new XTransportError(
          "The X API request could not be completed",
          method,
          url.toString(),
          { cause },
        );
      }
    };

    for (let attempt = 1; ; attempt++) {
      const response = await fetchAttempt(attempt);
      if (response === undefined) continue;
      const rateLimit = rateLimitOf(response.headers);
      const decoded =
        response.ok && options.responseType === "response"
          ? response
          : await decodeResponseBody(response);

      if (canRetryResponse(response, retryableMethod, attempt, maxAttempts)) {
        const resetDelay = rateLimit?.resetAt
          ? rateLimit.resetAt.getTime() - platform.now()
          : undefined;
        const backoff =
          baseDelayMs * 2 ** (attempt - 1) * (0.5 + platform.random());
        await platform.sleep(
          resetDelay === undefined
            ? Math.min(maxDelayMs, Math.max(0, backoff))
            : Math.max(0, resetDelay),
          options.signal,
        );
        continue;
      }

      if (!response.ok) {
        // SAFETY: Non-success responses are always decoded as JSON/text above.
        const errorBody = decoded as XResponseBody;
        const problems = problemsOf(errorBody);
        throw new XApiError(
          errorMessage(response.status, problems),
          response.status,
          method,
          url.toString(),
          problems,
          errorBody,
          rateLimit,
        );
      }

      // SAFETY: `request<T>` is the intentionally untyped low-level escape
      // hatch. Typed endpoints immediately decode this parsed JSON value.
      const value = decoded as T;
      const result: XResult<T> = {
        value,
        status: response.status,
        headers: response.headers,
      };
      if (rateLimit === undefined) return result;
      return { ...result, rateLimit };
    }
  };

  const requestOperation = <T, I extends object = object>(
    definition: OperationDefinition,
    input: I,
    options: XRequestOptions = {},
  ): Promise<XResult<T>> => {
    const prepared = prepareOperation(definition, input);
    const headers = new Headers(prepared.options.headers);
    new Headers(options.headers).forEach((value, name) =>
      headers.set(name, value),
    );
    return request<T>(definition.method, prepared.path, {
      ...prepared.options,
      ...options,
      headers,
      security: definition.security,
    });
  };

  const listWebhooks = async (options: XRequestOptions = {}) =>
    mapEnvelopeData(
      await requestOperation<XResponseBody>(
        operations.getWebhooks,
        {},
        {
          ...options,
          auth: "app",
        },
      ),
      "X returned a malformed webhook envelope",
      decodeWebhookList,
    );

  return {
    request,
    requestOperation,

    users: {
      async getMe(options: XRequestOptions = {}) {
        return mapEnvelopeData(
          await requestOperation<XResponseBody>(
            operations.getUsersMe,
            {},
            {
              ...options,
              auth: "user",
            },
          ),
          "X returned a malformed user envelope",
          decodeUser,
        );
      },
    },

    webhooks: {
      list: listWebhooks,

      async create(
        input: { readonly url: string },
        options: XRequestOptions = {},
      ) {
        return mapEnvelopeData(
          await requestOperation<XResponseBody>(
            operations.createWebhooks,
            input,
            {
              ...options,
              auth: "app",
            },
          ),
          "X returned a malformed webhook envelope",
          decodeWebhook,
        );
      },

      async validate(webhookId: string, options: XRequestOptions = {}) {
        return mapEnvelopeData(
          await requestOperation<XResponseBody>(
            operations.validateWebhooks,
            { webhook_id: webhookId },
            { ...options, auth: "app" },
          ),
          "X returned a malformed webhook validation envelope",
          decodeWebhookValidation,
        );
      },

      async delete(webhookId: string, options: XRequestOptions = {}) {
        return mapEnvelopeData(
          await requestOperation<XResponseBody>(
            operations.deleteWebhooks,
            { webhook_id: webhookId },
            { ...options, auth: "app" },
          ),
          "X returned a malformed webhook deletion envelope",
          decodeConfirmation("deleted", "webhook deletion"),
        );
      },

      async ensure(input: {
        readonly url: string;
        readonly revalidateInvalid?: boolean;
        readonly signal?: AbortSignal;
      }): Promise<{
        readonly webhook: XWebhook;
        readonly disposition: "existing" | "created" | "revalidated";
      }> {
        const requestOptions = input.signal ? { signal: input.signal } : {};
        const listed = await listWebhooks(requestOptions);
        const existing = requireEnvelopeData(
          listed,
          "listing webhooks for automatic registration",
        ).find((webhook) => webhook.url === input.url);
        if (existing && (existing.valid || input.revalidateInvalid === false)) {
          return { webhook: existing, disposition: "existing" };
        }
        if (existing) {
          await this.validate(existing.id, requestOptions);
          const relisted = await listWebhooks(requestOptions);
          const validated = requireEnvelopeData(
            relisted,
            "confirming webhook revalidation",
          ).find((candidate) => candidate.id === existing.id);
          if (!validated || !validated.valid) {
            throw new XDecodeError(
              validated
                ? "X webhook remained invalid after revalidation"
                : "X did not expose the revalidated webhook",
              relisted.status,
              JSON.stringify(relisted.value),
            );
          }
          return {
            webhook: validated,
            disposition: "revalidated",
          };
        }
        try {
          const created = await this.create({ url: input.url }, requestOptions);
          if (!created.value.data) {
            throw new XDecodeError(
              "X did not return the created webhook",
              created.status,
              JSON.stringify(created.value),
            );
          }
          return { webhook: created.value.data, disposition: "created" };
        } catch (error) {
          if (!(error instanceof XApiError)) throw error;
          const raced = await listWebhooks(requestOptions);
          const webhook = requireEnvelopeData(
            raced,
            "checking a webhook creation race",
          ).find((candidate) => candidate.url === input.url);
          if (!webhook) throw error;
          return { webhook, disposition: "existing" };
        }
      },
    },

    activity: {
      async listSubscriptions(
        input: {
          readonly maxResults?: number;
          readonly paginationToken?: string;
          readonly auth?: XAuthKind;
          readonly signal?: AbortSignal;
        } = {},
      ) {
        const listOptions: XRequestOptions = {
          auth: input.auth ?? "app",
          query: {
            max_results: input.maxResults,
            pagination_token: input.paginationToken,
          },
        };
        const options =
          input.signal === undefined
            ? listOptions
            : { ...listOptions, signal: input.signal };
        return mapEnvelopeData(
          await requestOperation<XResponseBody>(
            operations.getActivitySubscriptions,
            {},
            options,
          ),
          "X returned a malformed activity subscription envelope",
          decodeActivitySubscriptionList,
        );
      },

      async *iterateSubscriptions(
        input: {
          readonly maxResults?: number;
          readonly auth?: XAuthKind;
          readonly signal?: AbortSignal;
        } = {},
      ): AsyncIterable<XResult<XEnvelope<readonly XActivitySubscription[]>>> {
        const seen = new Set<string>();
        let paginationToken: string | undefined;
        do {
          const pageInput =
            paginationToken === undefined
              ? input
              : { ...input, paginationToken };
          const page = await this.listSubscriptions(pageInput);
          yield page;
          paginationToken = page.value.meta?.next_token;
          if (paginationToken && seen.has(paginationToken)) {
            throw new XDecodeError(
              "X repeated an activity pagination token",
              page.status,
              JSON.stringify(page.value),
            );
          }
          if (paginationToken) seen.add(paginationToken);
        } while (paginationToken);
      },

      createSubscription(
        input: XActivitySubscriptionInput,
        options: XRequestOptions = {},
      ) {
        return requestOperation<XEnvelope<unknown>>(
          operations.createActivitySubscription,
          input,
          { ...options, auth: options.auth ?? "app" },
        );
      },

      updateSubscription(
        subscriptionId: string,
        input: { readonly tag?: string; readonly webhook_id?: string },
        options: XRequestOptions = {},
      ) {
        return requestOperation<XEnvelope<unknown>>(
          operations.updateActivitySubscription,
          { ...input, subscription_id: subscriptionId },
          { ...options, auth: "app" },
        );
      },

      async deleteSubscription(
        subscriptionId: string,
        options: XRequestOptions = {},
      ) {
        return mapEnvelopeData(
          await requestOperation<XResponseBody>(
            operations.deleteActivitySubscription,
            { subscription_id: subscriptionId },
            { ...options, auth: "app" },
          ),
          "X returned a malformed activity deletion envelope",
          decodeConfirmation("deleted", "activity deletion"),
        );
      },

      normalizeSubscription,
    },

    accountActivity: {
      async checkSubscription(
        webhookId: string,
        options: XRequestOptions = {},
      ) {
        return mapEnvelopeData(
          await requestOperation<XResponseBody>(
            operations.validateAccountActivitySubscription,
            { webhook_id: webhookId },
            { ...options, auth: "user" },
          ),
          "X returned a malformed Account Activity status envelope",
          decodeAccountActivityStatus,
        );
      },

      async createSubscription(
        webhookId: string,
        options: XRequestOptions = {},
      ) {
        return mapEnvelopeData(
          await requestOperation<XResponseBody>(
            operations.createAccountActivitySubscription,
            { webhook_id: webhookId },
            { ...options, auth: "user", json: {} },
          ),
          "X returned a malformed Account Activity status envelope",
          decodeAccountActivityStatus,
        );
      },

      async listSubscriptions(
        webhookId: string,
        options: XRequestOptions = {},
      ) {
        return mapEnvelopeData(
          await requestOperation<XResponseBody>(
            operations.getAccountActivitySubscriptions,
            { webhook_id: webhookId },
            { ...options, auth: "app" },
          ),
          "X returned a malformed Account Activity list envelope",
          decodeAccountActivitySubscriptions,
        );
      },

      async deleteSubscription(
        webhookId: string,
        userId: string,
        options: XRequestOptions = {},
      ) {
        return mapEnvelopeData(
          await requestOperation<XResponseBody>(
            operations.deleteAccountActivitySubscription,
            { webhook_id: webhookId, user_id: userId },
            { ...options, auth: "app" },
          ),
          "X returned a malformed Account Activity status envelope",
          decodeAccountActivityStatus,
        );
      },
    },
  };
};

export type XClient = ReturnType<typeof createXClient>;
