import {
  XApiError,
  XAuthenticationError,
  XDecodeError,
  XTransportError,
} from "./errors.ts";
import {
  resolveToken,
  runtime,
  type TokenProvider,
  type XRuntimeOptions,
} from "./runtime.ts";
import type {
  XAccountActivitySubscriptionStatus,
  XAccountActivitySubscriptions,
  XActivitySubscription,
  XActivitySubscriptionInput,
  XEnvelope,
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
  readonly headers?: HeadersInit;
  readonly signal?: AbortSignal;
  readonly auth?: XAuthKind;
  readonly retryNonIdempotent?: boolean;
}

export interface XClientConfig {
  readonly appBearerToken?: TokenProvider;
  readonly userAccessToken?: TokenProvider;
  readonly apiOrigin?: string;
  readonly runtime?: XRuntimeOptions;
  readonly retry?: {
    readonly maxAttempts?: number;
    readonly baseDelayMs?: number;
    readonly maxDelayMs?: number;
  };
}

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
  return {
    ...(limit !== undefined ? { limit } : {}),
    ...(remaining !== undefined ? { remaining } : {}),
    ...(reset !== undefined ? { resetAt: new Date(reset * 1000) } : {}),
  };
};

const problemsOf = (body: unknown): readonly XProblem[] => {
  if (body === null || typeof body !== "object") return [];
  const value = body as Record<string, unknown>;
  if (Array.isArray(value.errors)) {
    return value.errors.filter(
      (problem): problem is XProblem =>
        problem !== null && typeof problem === "object",
    );
  }
  if (
    typeof value.detail === "string" ||
    typeof value.title === "string" ||
    typeof value.message === "string"
  ) {
    return [value as XProblem];
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

const normalizeSubscription = (
  envelope: unknown,
): XActivitySubscription | undefined => {
  if (envelope === null || typeof envelope !== "object") return undefined;
  const value = envelope as Record<string, unknown>;
  const data =
    value.data !== null && typeof value.data === "object"
      ? (value.data as Record<string, unknown>)
      : value;
  const candidate =
    data.subscription !== null && typeof data.subscription === "object"
      ? (data.subscription as Record<string, unknown>)
      : data;
  const filter = candidate.filter as Record<string, unknown> | undefined;
  const qualifiers = filter?.qualifiers;
  const filterKeys = new Set(["user_id", "keyword", "direction", "qualifiers"]);
  if (
    typeof candidate.subscription_id !== "string" ||
    typeof candidate.event_type !== "string" ||
    filter === null ||
    typeof filter !== "object" ||
    Array.isArray(filter) ||
    !Object.keys(filter).every((key) => filterKeys.has(key)) ||
    (filter.user_id !== undefined && typeof filter.user_id !== "string") ||
    (filter.keyword !== undefined && typeof filter.keyword !== "string") ||
    (filter.direction !== undefined &&
      filter.direction !== "inbound" &&
      filter.direction !== "outbound") ||
    (qualifiers !== undefined &&
      (qualifiers === null ||
        typeof qualifiers !== "object" ||
        Array.isArray(qualifiers) ||
        !Object.values(qualifiers).every(
          (value) => typeof value === "string",
        ))) ||
    (candidate.tag !== undefined && typeof candidate.tag !== "string") ||
    (candidate.webhook_id !== undefined &&
      typeof candidate.webhook_id !== "string") ||
    (candidate.created_at !== undefined &&
      typeof candidate.created_at !== "string") ||
    (candidate.updated_at !== undefined &&
      typeof candidate.updated_at !== "string")
  ) {
    return undefined;
  }
  return candidate as unknown as XActivitySubscription;
};

const recordOf = (
  value: unknown,
  status: number,
  message: string,
): Record<string, unknown> => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new XDecodeError(message, status, JSON.stringify(value));
  }
  return value as Record<string, unknown>;
};

const mapEnvelopeData = <T>(
  result: XResult<unknown>,
  message: string,
  decode: (value: unknown, status: number) => T,
): XResult<XEnvelope<T>> => {
  const envelope = recordOf(result.value, result.status, message);
  if (
    (envelope.errors !== undefined &&
      (!Array.isArray(envelope.errors) ||
        !envelope.errors.every(
          (error) => error !== null && typeof error === "object",
        ))) ||
    (envelope.meta !== undefined &&
      (envelope.meta === null ||
        typeof envelope.meta !== "object" ||
        Array.isArray(envelope.meta)))
  ) {
    throw new XDecodeError(message, result.status, JSON.stringify(envelope));
  }
  if (envelope.meta !== undefined) {
    const meta = envelope.meta as Record<string, unknown>;
    if (
      (meta.next_token !== undefined && typeof meta.next_token !== "string") ||
      (meta.previous_token !== undefined &&
        typeof meta.previous_token !== "string") ||
      [meta.result_count, meta.total_subscriptions].some(
        (count) =>
          count !== undefined &&
          (typeof count !== "number" || !Number.isInteger(count) || count < 0),
      )
    ) {
      throw new XDecodeError(message, result.status, JSON.stringify(envelope));
    }
  }
  if (!("data" in envelope) || envelope.data === undefined) {
    return { ...result, value: envelope as XEnvelope<T> };
  }
  const data = decode(envelope.data, result.status);
  return {
    ...result,
    value: { ...envelope, data } as XEnvelope<T>,
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

const decodeWebhook = (value: unknown, status: number): XWebhook => {
  const webhook = recordOf(value, status, "X returned a malformed webhook");
  if (
    typeof webhook.id !== "string" ||
    typeof webhook.url !== "string" ||
    typeof webhook.valid !== "boolean" ||
    typeof webhook.created_at !== "string"
  ) {
    throw new XDecodeError(
      "X returned an incomplete webhook",
      status,
      JSON.stringify(value),
    );
  }
  return webhook as unknown as XWebhook;
};

const decodeWebhookList = (
  value: unknown,
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
  (value: unknown, status: number): Readonly<Record<Key, boolean>> => {
    const confirmation = recordOf(
      value,
      status,
      `X returned a malformed ${label} confirmation`,
    );
    if (typeof confirmation[key] !== "boolean") {
      throw new XDecodeError(
        `X did not include the ${label} confirmation`,
        status,
        JSON.stringify(value),
      );
    }
    return confirmation as Readonly<Record<Key, boolean>>;
  };

const decodeWebhookValidation = (
  value: unknown,
  status: number,
): XWebhookValidation => {
  const confirmation = recordOf(
    value,
    status,
    "X returned a malformed webhook validation confirmation",
  );
  if (
    typeof confirmation.valid !== "boolean" &&
    typeof confirmation.attempted !== "boolean"
  ) {
    throw new XDecodeError(
      "X did not include the webhook validation confirmation",
      status,
      JSON.stringify(value),
    );
  }
  if (
    (confirmation.valid !== undefined &&
      typeof confirmation.valid !== "boolean") ||
    (confirmation.attempted !== undefined &&
      typeof confirmation.attempted !== "boolean")
  ) {
    throw new XDecodeError(
      "X returned an invalid webhook validation confirmation",
      status,
      JSON.stringify(value),
    );
  }
  return confirmation as XWebhookValidation;
};

const decodeActivitySubscriptionList = (
  value: unknown,
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
    const subscription = normalizeSubscription(entry);
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

const decodeUser = (value: unknown, status: number): XUser => {
  const user = recordOf(value, status, "X returned a malformed user");
  if (typeof user.id !== "string") {
    throw new XDecodeError(
      "X returned an incomplete user",
      status,
      JSON.stringify(value),
    );
  }
  return user as unknown as XUser;
};

const decodeAccountActivityStatus = (
  value: unknown,
  status: number,
): XAccountActivitySubscriptionStatus =>
  decodeConfirmation("subscribed", "subscription")(
    value,
    status,
  ) as XAccountActivitySubscriptionStatus;

const decodeAccountActivitySubscriptions = (
  value: unknown,
  status: number,
): XAccountActivitySubscriptions => {
  const subscriptions = recordOf(
    value,
    status,
    "X returned a malformed Account Activity subscription list",
  );
  if (
    (subscriptions.application_id !== undefined &&
      typeof subscriptions.application_id !== "string") ||
    (subscriptions.webhook_id !== undefined &&
      typeof subscriptions.webhook_id !== "string") ||
    (subscriptions.webhook_url !== undefined &&
      typeof subscriptions.webhook_url !== "string") ||
    (subscriptions.subscriptions !== undefined &&
      (!Array.isArray(subscriptions.subscriptions) ||
        !subscriptions.subscriptions.every(
          (entry) =>
            entry !== null &&
            typeof entry === "object" &&
            typeof (entry as Record<string, unknown>).user_id === "string",
        )))
  ) {
    throw new XDecodeError(
      "X returned an incomplete Account Activity subscription list",
      status,
      JSON.stringify(value),
    );
  }
  return subscriptions as unknown as XAccountActivitySubscriptions;
};

export const createXClient = (config: XClientConfig) => {
  const platform = runtime(config.runtime);
  const base = new URL(config.apiOrigin ?? X_API_ORIGIN);
  base.pathname = base.pathname.replace(/\/+$/u, "");
  const maxAttempts = Math.max(1, config.retry?.maxAttempts ?? 3);
  const baseDelayMs = Math.max(0, config.retry?.baseDelayMs ?? 250);
  const maxDelayMs = Math.max(baseDelayMs, config.retry?.maxDelayMs ?? 30_000);

  const authToken = async (kind: XAuthKind): Promise<string> => {
    const provider =
      kind === "app" ? config.appBearerToken : config.userAccessToken;
    if (!provider) {
      throw new XAuthenticationError(
        `${kind === "app" ? "App-only" : "User-context"} X credentials are required for this operation`,
      );
    }
    return resolveToken(provider);
  };

  const request = async <T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: `/${string}`,
    options: XRequestOptions = {},
  ): Promise<XResult<T>> => {
    const url = new URL(path, base);
    if (url.origin !== base.origin) {
      throw new TypeError("X request paths must stay on the configured origin");
    }
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value === undefined) continue;
      url.searchParams.set(
        key,
        Array.isArray(value) ? value.join(",") : String(value),
      );
    }
    const retryableMethod =
      method === "GET" ||
      method === "PUT" ||
      method === "DELETE" ||
      options.retryNonIdempotent === true;

    for (let attempt = 1; ; attempt++) {
      const headers = new Headers(options.headers);
      headers.set("Accept", "application/json");
      headers.set(
        "Authorization",
        `Bearer ${await authToken(options.auth ?? "user")}`,
      );
      let body: BodyInit | undefined;
      if (options.json !== undefined) {
        headers.set("Content-Type", "application/json");
        body = JSON.stringify(options.json);
      }

      let response: Response;
      try {
        response = await platform.fetch(url, {
          method,
          headers,
          ...(body !== undefined ? { body } : {}),
          ...(options.signal ? { signal: options.signal } : {}),
        });
      } catch (cause) {
        if (options.signal?.aborted) throw cause;
        if (retryableMethod && attempt < maxAttempts) {
          const delay = Math.min(
            maxDelayMs,
            baseDelayMs * 2 ** (attempt - 1) * (0.5 + platform.random()),
          );
          await platform.sleep(delay, options.signal);
          continue;
        }
        throw new XTransportError(
          "The X API request could not be completed",
          method,
          url.toString(),
          { cause },
        );
      }

      const rateLimit = rateLimitOf(response.headers);
      const text = await response.text();
      let decoded: unknown = undefined;
      if (text.length > 0) {
        try {
          decoded = JSON.parse(text) as unknown;
        } catch (cause) {
          if (response.ok) {
            throw new XDecodeError(
              "X returned a malformed JSON response",
              response.status,
              text,
              { cause },
            );
          }
          decoded = text;
        }
      }

      const shouldRetry =
        retryableMethod &&
        attempt < maxAttempts &&
        (response.status === 408 ||
          response.status === 429 ||
          response.status >= 500);
      if (shouldRetry) {
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
        const problems = problemsOf(decoded);
        throw new XApiError(
          errorMessage(response.status, problems),
          response.status,
          method,
          url.toString(),
          problems,
          decoded,
          rateLimit,
        );
      }

      return {
        value: decoded as T,
        status: response.status,
        headers: response.headers,
        ...(rateLimit ? { rateLimit } : {}),
      };
    }
  };

  const listWebhooks = async (options: XRequestOptions = {}) =>
    mapEnvelopeData(
      await request<unknown>("GET", "/2/webhooks", {
        ...options,
        auth: "app",
      }),
      "X returned a malformed webhook envelope",
      decodeWebhookList,
    );

  return {
    request,

    users: {
      async getMe(options: XRequestOptions = {}) {
        return mapEnvelopeData(
          await request<unknown>("GET", "/2/users/me", {
            ...options,
            auth: "user",
          }),
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
          await request<unknown>("POST", "/2/webhooks", {
            ...options,
            auth: "app",
            json: input,
          }),
          "X returned a malformed webhook envelope",
          decodeWebhook,
        );
      },

      async validate(webhookId: string, options: XRequestOptions = {}) {
        return mapEnvelopeData(
          await request<unknown>(
            "PUT",
            `/2/webhooks/${encodeURIComponent(webhookId)}`,
            { ...options, auth: "app" },
          ),
          "X returned a malformed webhook validation envelope",
          decodeWebhookValidation,
        );
      },

      async delete(webhookId: string, options: XRequestOptions = {}) {
        return mapEnvelopeData(
          await request<unknown>(
            "DELETE",
            `/2/webhooks/${encodeURIComponent(webhookId)}`,
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
        return mapEnvelopeData(
          await request<unknown>("GET", "/2/activity/subscriptions", {
            auth: input.auth ?? "app",
            query: {
              max_results: input.maxResults,
              pagination_token: input.paginationToken,
            },
            ...(input.signal ? { signal: input.signal } : {}),
          }),
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
          const page = await this.listSubscriptions({
            ...input,
            ...(paginationToken ? { paginationToken } : {}),
          });
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
        return request<XEnvelope<unknown>>(
          "POST",
          "/2/activity/subscriptions",
          { ...options, auth: options.auth ?? "app", json: input },
        );
      },

      updateSubscription(
        subscriptionId: string,
        input: { readonly tag?: string; readonly webhook_id?: string },
        options: XRequestOptions = {},
      ) {
        return request<XEnvelope<unknown>>(
          "PUT",
          `/2/activity/subscriptions/${encodeURIComponent(subscriptionId)}`,
          { ...options, auth: "app", json: input },
        );
      },

      async deleteSubscription(
        subscriptionId: string,
        options: XRequestOptions = {},
      ) {
        return mapEnvelopeData(
          await request<unknown>(
            "DELETE",
            `/2/activity/subscriptions/${encodeURIComponent(subscriptionId)}`,
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
          await request<unknown>(
            "GET",
            `/2/account_activity/webhooks/${encodeURIComponent(webhookId)}/subscriptions/all`,
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
          await request<unknown>(
            "POST",
            `/2/account_activity/webhooks/${encodeURIComponent(webhookId)}/subscriptions/all`,
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
          await request<unknown>(
            "GET",
            `/2/account_activity/webhooks/${encodeURIComponent(webhookId)}/subscriptions/all/list`,
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
          await request<unknown>(
            "DELETE",
            `/2/account_activity/webhooks/${encodeURIComponent(webhookId)}/subscriptions/${encodeURIComponent(userId)}/all`,
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
