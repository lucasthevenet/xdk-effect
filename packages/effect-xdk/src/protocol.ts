/* oxlint-disable anti-slop/no-shape-in-symbol-names -- Context.Service.Shape is Effect's API for extracting a service type. */
/**
 * XProtocol — hand-written, following Distilled's Coinbase protocol layout.
 * API.make owns execution, context capture, and retries. This module owns X's
 * wire format, request signing, app-token exchange, and response decoding.
 * The memoized protocol never captures caller credentials or an HttpClient.
 */
import * as API from "@distilled.cloud/core/api";
import { ConfigError, HTTP_STATUS_MAP } from "@distilled.cloud/core/errors";
import { mapKeys } from "@distilled.cloud/core/protocol-http";
import { parseRetryAfterForStatus } from "@distilled.cloud/core/retry-after";
import * as Context from "effect/Context";
import type * as Crypto from "effect/Crypto";
import * as Duration from "effect/Duration";
import * as Deferred from "effect/Deferred";
import * as Exit from "effect/Exit";
import * as Effect from "effect/Effect";
import * as Encoding from "effect/Encoding";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";
import * as HttpClient from "effect/unstable/http/HttpClient";
import type * as HttpClientError from "effect/unstable/http/HttpClientError";
import * as HttpClientRequest from "effect/unstable/http/HttpClientRequest";
import type * as HttpClientResponse from "effect/unstable/http/HttpClientResponse";
import {
  signOAuth1,
  selectAuthentication,
  type XAuthentication,
} from "./auth.ts";
import {
  Credentials,
  type OAuth1Credentials,
  type ResolvedCredentials,
} from "./credentials.ts";
import {
  UnknownXError,
  XAuthenticationError,
  XInputError,
  XParseError,
  XTokenExpired,
  type DefaultErrors,
} from "./errors.ts";
import { prepareOperation } from "./operation-wire.ts";
import type { OperationDefinition } from "./operation-types.ts";
import { operations } from "./operations.ts";
export type XAuthKind = "app" | "user";
import type { XJsonValue } from "./types.ts";

export type XOpError =
  | DefaultErrors
  | ConfigError
  | HttpClientError.HttpClientError;
export type XOpContext = Credentials | HttpClient.HttpClient | Crypto.Crypto;

/** Override auth context on the calling Effect; endpoint security is still enforced. */
export const AuthContext = Context.Reference<XAuthKind | undefined>(
  "XAuthContext",
  { defaultValue: () => undefined },
);
export const withAuth = (auth: XAuthKind) =>
  Effect.provideService(AuthContext, auth);

type EncodeArgs = Parameters<
  Context.Service.Shape<typeof API.Protocol>["encode"]
>[0];
type DecodeArgs = Parameters<
  Context.Service.Shape<typeof API.Protocol>["decode"]
>[0];
type Resolver = Context.Service.Shape<typeof Credentials>;
interface BearerTokens {
  appBearerToken?: string;
  userAccessToken?: string;
}

const definitions = new Map<string, OperationDefinition>(
  Object.entries(operations),
);
const definitionOf = (config: API.ProtocolOperationConfig) => {
  const definition = definitions.get(config.operationName ?? "");
  if (!definition)
    throw new Error(`Unknown generated X operation: ${config.operationName}`);
  return definition;
};

const unredact = (config: ResolvedCredentials): XAuthentication => {
  if (config.type === "oauth1")
    return {
      apiKey: Redacted.value(config.apiKey),
      apiSecret: Redacted.value(config.apiSecret),
      accessToken: Redacted.value(config.accessToken),
      accessTokenSecret: Redacted.value(config.accessTokenSecret),
    };
  const tokens: BearerTokens = {};
  if (config.appBearerToken)
    tokens.appBearerToken = Redacted.value(config.appBearerToken);
  if (config.userAccessToken)
    tokens.userAccessToken = Redacted.value(config.userAccessToken);
  return tokens;
};

const encodeCredential = (value: string) =>
  encodeURIComponent(value).replace(
    /[!'()*]/gu,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );

const TokenResponse = Schema.Struct({
  token_type: Schema.Literal("bearer"),
  access_token: Schema.String,
});
const exchangeToken = (config: OAuth1Credentials) =>
  Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient;
    const key = Redacted.value(config.apiKey);
    const secret = Redacted.value(config.apiSecret);
    if (!key.trim() || !secret.trim())
      return yield* Effect.fail(
        new XAuthenticationError("X API key and secret must not be empty"),
      );
    const basic = Encoding.encodeBase64(
      `${encodeCredential(key)}:${encodeCredential(secret)}`,
    );
    const response = yield* client.execute(
      HttpClientRequest.post(new URL("/oauth2/token", config.apiBaseUrl)).pipe(
        HttpClientRequest.setHeader("Authorization", `Basic ${basic}`),
        HttpClientRequest.bodyUrlParams({ grant_type: "client_credentials" }),
      ),
    );
    if (response.status < 200 || response.status >= 300) {
      return yield* Effect.fail(
        new XAuthenticationError(
          `X app-only token exchange failed (HTTP ${response.status})`,
        ),
      );
    }
    // Do not expose OAuth response payloads or headers in failures.
    const body = yield* response.json.pipe(
      Effect.mapError(
        () =>
          new XAuthenticationError(
            "X returned a malformed app-only token response",
          ),
      ),
    );
    const token = yield* Schema.decodeUnknownEffect(TokenResponse)(body).pipe(
      Effect.mapError(
        () =>
          new XAuthenticationError(
            "X returned a malformed app-only token response",
          ),
      ),
    );
    if (!token.access_token.trim())
      return yield* Effect.fail(
        new XAuthenticationError("X returned an empty app-only token"),
      );
    return token.access_token;
  });

interface AppToken {
  readonly key: string;
  readonly secret: string;
  readonly origin: string;
  readonly load: Effect.Effect<
    string,
    XAuthenticationError | HttpClientError.HttpClientError,
    HttpClient.HttpClient
  >;
  token?: string;
}

// Credentials resolvers and HttpClients are the isolation keys. No process-wide
// token is shared across apps, transports, credential overrides, or tests.
const tokens = new WeakMap<
  HttpClient.HttpClient,
  WeakMap<Resolver, AppToken>
>();
const appToken = (resolver: Resolver, config: OAuth1Credentials) =>
  Effect.uninterruptibleMask((restore) =>
    Effect.gen(function* () {
      const client = yield* HttpClient.HttpClient;
      let cache = tokens.get(client);
      if (!cache) {
        cache = new WeakMap();
        tokens.set(client, cache);
      }
      const key = Redacted.value(config.apiKey);
      const secret = Redacted.value(config.apiSecret);
      let entry = cache.get(resolver);
      if (
        !entry ||
        entry.key !== key ||
        entry.secret !== secret ||
        entry.origin !== config.apiBaseUrl
      ) {
        const pending = yield* Deferred.make<
          string,
          XAuthenticationError | HttpClientError.HttpClientError
        >();
        entry = {
          key,
          secret,
          origin: config.apiBaseUrl,
          load: Deferred.await(pending),
        };
        cache.set(resolver, entry);
        const current = entry;
        // One bounded, detached exchange serves all waiters. Cancelling a waiter
        // must not cancel another request's token exchange or cache interruption.
        yield* exchangeToken(config).pipe(
          Effect.timeoutOrElse({
            duration: "30 seconds",
            orElse: () =>
              Effect.fail(
                new XAuthenticationError("X app-token exchange timed out"),
              ),
          }),
          Effect.interruptible,
          Effect.exit,
          Effect.flatMap((exit) =>
            Effect.sync(() => {
              if (Exit.isSuccess(exit)) current.token = exit.value;
              else if (cache.get(resolver) === current) cache.delete(resolver);
            }).pipe(Effect.andThen(Deferred.done(pending, exit))),
          ),
          Effect.forkDetach,
        );
      }
      return yield* restore(entry.load);
    }),
  );

const invalidateToken = (response: HttpClientResponse.HttpClientResponse) =>
  Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient;
    const resolver = yield* Credentials;
    const cache = tokens.get(client);
    const entry = cache?.get(resolver);
    if (
      entry?.token &&
      response.request.headers.authorization === `Bearer ${entry.token}`
    ) {
      cache?.delete(resolver);
      return true;
    }
    return false;
  });

const encode = (args: EncodeArgs) =>
  Effect.gen(function* () {
    const definition = definitionOf(args.config);
    const resolver = yield* Credentials;
    const config = yield* resolver;
    const input = yield* Schema.decodeUnknownEffect(
      Schema.toType(Schema.make(args.inputAst)),
      { onExcessProperty: "error" },
    )(args.input).pipe(
      Effect.mapError(
        (cause) =>
          new XInputError(`Invalid input for ${definition.id}`, { cause }),
      ),
    );
    // SAFETY: Every generated X request schema describes an object; decoding
    // above validates that object before the binding serializer reads its fields.
    const prepared = yield* Effect.try({
      try: () => prepareOperation(definition, input as object),
      catch: (cause) =>
        new XInputError(`Cannot encode ${definition.id}`, { cause }),
    });
    const url = new URL(prepared.path, config.apiBaseUrl);
    const raw = unredact(config);
    const preferred = yield* AuthContext;
    const auth = yield* Effect.try({
      try: () => selectAuthentication(raw, definition.security, preferred),
      catch: (cause) =>
        cause instanceof XAuthenticationError
          ? cause
          : new XAuthenticationError("Invalid X authentication", { cause }),
    });
    let request = HttpClientRequest.make(definition.method)(url, {
      headers: new Headers(prepared.options.headers),
    });
    if (prepared.options.rawBody)
      request = HttpClientRequest.bodyFormData(
        request,
        prepared.options.rawBody,
      );
    else if (prepared.options.json !== undefined)
      request = yield* HttpClientRequest.bodyJson(
        request,
        prepared.options.json,
      ).pipe(
        Effect.mapError(
          (cause) =>
            new XInputError(`Invalid JSON for ${definition.id}`, { cause }),
        ),
      );
    if (auth === undefined) return request;
    let header: string;
    if (config.type === "bearer") {
      const token =
        auth === "app" ? config.appBearerToken : config.userAccessToken;
      if (!token || !Redacted.value(token).trim())
        return yield* Effect.fail(
          new XAuthenticationError(`X ${auth} token must not be empty`),
        );
      header = `Bearer ${Redacted.value(token)}`;
    } else if (auth === "app")
      header = `Bearer ${yield* appToken(resolver, config)}`;
    else header = yield* signOAuth1(raw, definition.method, url);
    return HttpClientRequest.setHeader(request, "Authorization", header);
  });

const statusErrors = new Map(
  Object.entries(HTTP_STATUS_MAP).map(([status, error]) => [
    Number(status),
    error,
  ]),
);
const ErrorEnvelope = Schema.Struct({
  detail: Schema.optional(Schema.String),
  message: Schema.optional(Schema.String),
  title: Schema.optional(Schema.String),
});

const decode = (args: DecodeArgs) =>
  Effect.gen(function* () {
    const definition = definitionOf(args.config);
    const { response } = args;
    if (response.status === 401 && (yield* invalidateToken(response))) {
      yield* response.text.pipe(Effect.ignore);
      return yield* Effect.fail(
        new XTokenExpired({ message: "X rejected the cached app token" }),
      );
    }
    const outputSchema = Schema.toType(Schema.make(args.outputAst));
    const decodeValue = (value: XJsonValue | Uint8Array | undefined) =>
      Schema.decodeUnknownEffect(outputSchema, {
        onExcessProperty: "preserve",
      })(mapKeys(args.outputAst, value, "decode")).pipe(
        Effect.mapError(
          (cause) =>
            new XParseError({
              message: `Invalid ${definition.id} response`,
              cause,
            }),
        ),
      );
    if (response.status >= 200 && response.status < 300) {
      if (definition.response === "binary")
        return yield* response.arrayBuffer.pipe(
          Effect.flatMap((buffer) => decodeValue(new Uint8Array(buffer))),
        );
      if (definition.response === "stream")
        return response.stream.pipe(
          Stream.decodeText(),
          Stream.splitLines,
          Stream.filter((line) => line.trim().length > 0),
          Stream.mapEffect((line) =>
            Effect.try({
              try: (): XJsonValue => JSON.parse(line),
              catch: (cause) =>
                new XParseError({
                  message: `Malformed ${definition.id} stream record`,
                  cause,
                }),
            }).pipe(Effect.flatMap(decodeValue)),
          ),
        );
    }
    const text = yield* response.text;
    const body = yield* Effect.try({
      try: (): XJsonValue | undefined =>
        text.trim() ? JSON.parse(text) : undefined,
      catch: (cause) =>
        new XParseError({
          message: `Malformed ${definition.id} response`,
          cause,
        }),
    }).pipe(
      Effect.catchTag("XParseError", (error) =>
        response.status >= 200 && response.status < 300
          ? Effect.fail(error)
          : Effect.succeed(text),
      ),
    );
    if (response.status >= 200 && response.status < 300)
      return yield* decodeValue(body);
    const envelope = yield* Schema.decodeUnknownEffect(ErrorEnvelope)(
      body,
    ).pipe(
      Effect.orElseSucceed(() => ({
        detail: undefined,
        message: undefined,
        title: undefined,
      })),
    );
    const message =
      envelope.detail ??
      envelope.message ??
      envelope.title ??
      `X API error ${response.status}`;
    const ErrorClass = statusErrors.get(response.status);
    if (!ErrorClass)
      return yield* Effect.fail(
        new UnknownXError({ message, status: response.status, body }),
      );
    const resetAt = Number(response.headers["x-rate-limit-reset"]);
    const retryAfter =
      response.status === 429 && Number.isFinite(resetAt)
        ? Duration.millis(Math.max(0, resetAt * 1000 - Date.now()))
        : parseRetryAfterForStatus(response.status, response.headers);
    return yield* Effect.fail(new ErrorClass({ message, retryAfter }));
  });

export const XProtocol: Layer.Layer<API.Protocol> = Layer.succeed(
  API.Protocol,
  API.Protocol.of({
    // SAFETY: Core Protocol erases requirements/errors at this seam. Generated
    // API.OperationMethod declarations restore XOpContext and XOpError, as in
    // Distilled's Coinbase protocol. Resolution stays on each calling fiber.
    encode: (args) =>
      encode(args) as Effect.Effect<HttpClientRequest.HttpClientRequest>,
    // SAFETY: The matching generated operation declaration restores XOpError.
    decode: (args) => decode(args) as Effect.Effect<unknown>,
  }),
);
