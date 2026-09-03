/* oxlint-disable anti-slop/no-shape-in-symbol-names -- Context.Service.Shape is Effect's API for extracting a service type. */
/**
 * XProtocol — hand-written, following Distilled's Coinbase protocol layout.
 * API.make owns execution, context capture, and retries. This module owns X's
 * wire format, request signing, app-token exchange, and response decoding.
 * The memoized protocol never captures caller credentials or an HttpClient.
 */
import * as API from "@distilled.cloud/core/api";
import { ConfigError, HTTP_STATUS_MAP } from "@distilled.cloud/core/errors";
import {
  buildRequest,
  getAnn,
  getProps,
  getPropAnn,
  mapKeys,
} from "@distilled.cloud/core/protocol-http";
import { httpSymbol, type HttpTrait } from "@distilled.cloud/core/trait";
import { parseRetryAfterForStatus } from "@distilled.cloud/core/retry-after";
import * as Context from "effect/Context";
import type * as Crypto from "effect/Crypto";
import * as Duration from "effect/Duration";
import * as Deferred from "effect/Deferred";
import * as Exit from "effect/Exit";
import * as Effect from "effect/Effect";
import * as Encoding from "effect/Encoding";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
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
import type { Hmac } from "./hmac.ts";
import * as T from "./traits.ts";
export type XAuthKind = "app" | "user";

export type XOpError =
  | DefaultErrors
  | ConfigError
  | HttpClientError.HttpClientError;
export type XOpContext =
  | Credentials
  | HttpClient.HttpClient
  | Crypto.Crypto
  | Hmac;

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
    const operationName = args.config.operationName ?? "X operation";
    const resolver = yield* Credentials;
    const config = yield* resolver;
    const input = yield* Schema.decodeUnknownEffect(
      Schema.toType(Schema.make(args.inputAst)),
      { onExcessProperty: "error" },
    )(args.input).pipe(
      Effect.mapError(
        (cause) =>
          new XInputError(`Invalid input for ${operationName}`, { cause }),
      ),
    );
    const requestResult = yield* Effect.try({
      try: () => {
        // SAFETY: Every generated request schema validates an object before
        // these member-level adaptations run; core owns all HTTP bindings.
        const fields = input as Record<string, Schema.Json | Blob | undefined>;
        const wireInput = { ...fields };
        for (const prop of getProps(args.inputAst)) {
          const key = String(prop.name);
          const value = fields[key];
          if (
            getPropAnn(prop, T.csvQuerySymbol) === true &&
            Array.isArray(value)
          )
            wireInput[key] = value.join(",");
        }
        let inputAst = args.inputAst;
        if (
          getAnn(inputAst, T.multipartSymbol) === true &&
          Object.values(fields).some((value) => value instanceof Blob)
        ) {
          // SAFETY: Generated operation inputs carry core's HTTP trait.
          const http = getAnn(inputAst, httpSymbol) as HttpTrait;
          inputAst = Schema.make<Schema.Top>(inputAst).annotate({
            [httpSymbol]: { ...http, contentType: "multipart" },
          }).ast;
        }
        let request = buildRequest({
          input: wireInput,
          inputAst,
          // X's spec paths are absolute, including when overriding the origin.
          baseUrl: new URL(config.apiBaseUrl).origin,
        });
        if (
          request.body._tag === "Empty" &&
          getAnn(inputAst, T.requestBodySymbol) === true
        )
          request = HttpClientRequest.bodyJsonUnsafe(request, {});
        if (
          args.config.output &&
          getAnn(args.config.output.ast, T.responseSymbol) === "binary"
        )
          request = HttpClientRequest.setHeader(
            request,
            "Accept",
            "application/octet-stream",
          );
        return request;
      },
      catch: (cause) =>
        new XInputError(`Cannot encode ${operationName}`, { cause }),
    });
    const url = yield* Option.match(HttpClientRequest.toUrl(requestResult), {
      onSome: Effect.succeed,
      onNone: () =>
        Effect.fail(new XInputError(`Invalid URL for ${operationName}`)),
    });
    // SAFETY: The generator emits Security on every request schema, including [].
    const security = getAnn(args.inputAst, T.securitySymbol) as
      | readonly T.SecurityScheme[]
      | undefined;
    if (security === undefined)
      return yield* Effect.fail(
        new XInputError(`Missing security trait for ${operationName}`),
      );
    const raw = unredact(config);
    const preferred = yield* AuthContext;
    const auth = yield* Effect.try({
      try: () => selectAuthentication(raw, security, preferred),
      catch: (cause) =>
        cause instanceof XAuthenticationError
          ? cause
          : new XAuthenticationError("Invalid X authentication", { cause }),
    });
    const request = requestResult;
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
    else header = yield* signOAuth1(raw, request.method, url);
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
    const operationName = args.config.operationName ?? "X operation";
    const { response } = args;
    if (response.status === 401 && (yield* invalidateToken(response))) {
      yield* response.text.pipe(Effect.ignore);
      return yield* Effect.fail(
        new XTokenExpired({ message: "X rejected the cached app token" }),
      );
    }
    const outputSchema = Schema.toType(Schema.make(args.outputAst));
    const decodeValue = (value: Schema.Json | Uint8Array | undefined) =>
      Schema.decodeUnknownEffect(outputSchema, {
        onExcessProperty: "preserve",
      })(mapKeys(args.outputAst, value, "decode")).pipe(
        Effect.mapError(
          (cause) =>
            new XParseError({
              message: `Invalid ${operationName} response`,
              cause,
            }),
        ),
      );
    if (response.status >= 200 && response.status < 300) {
      if (getAnn(args.outputAst, T.responseSymbol) === "binary")
        return yield* response.arrayBuffer.pipe(
          Effect.flatMap((buffer) => decodeValue(new Uint8Array(buffer))),
        );
      if (getAnn(args.outputAst, T.responseSymbol) === "stream")
        return response.stream.pipe(
          Stream.decodeText(),
          Stream.splitLines,
          Stream.filter((line) => line.trim().length > 0),
          Stream.mapEffect((line) =>
            Effect.try({
              try: (): Schema.Json => JSON.parse(line),
              catch: (cause) =>
                new XParseError({
                  message: `Malformed ${operationName} stream record`,
                  cause,
                }),
            }).pipe(Effect.flatMap(decodeValue)),
          ),
        );
    }
    const text = yield* response.text;
    const body = yield* Effect.try({
      try: (): Schema.Json | undefined =>
        text.trim() ? JSON.parse(text) : undefined,
      catch: (cause) =>
        new XParseError({
          message: `Malformed ${operationName} response`,
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
