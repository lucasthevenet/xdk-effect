import { mapKeys } from "@distilled.cloud/core/protocol-http";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";
import {
  createXClient,
  type XClient,
  type XClientConfig,
  type XRequestOptions,
} from "./client.ts";
import {
  XApiError,
  XAuthenticationError,
  XDecodeError,
  XInputError,
  XTransportError,
  type XError,
} from "./errors.ts";
import type { OperationDefinition } from "./operation-types.ts";
import type { XResult, XJsonValue } from "./types.ts";

/** One transport/auth cache per provided layer; construction performs no I/O. */
export class Client extends Context.Service<Client, XClient>()(
  "distilled-x/Client",
) {
  static layer = (config: XClientConfig) =>
    Layer.sync(Client, () => createXClient(config));
}

export type OperationOptions = Pick<
  XRequestOptions,
  "auth" | "headers" | "signal" | "retryNonIdempotent"
>;

const failure = (definition: OperationDefinition, cause: unknown): XError =>
  cause instanceof XApiError ||
  cause instanceof XAuthenticationError ||
  cause instanceof XDecodeError ||
  cause instanceof XInputError ||
  cause instanceof XTransportError
    ? cause
    : new XTransportError(
        `X ${definition.id} failed`,
        definition.method,
        definition.path,
        { cause },
      );

const send = <I extends object, R>(
  definition: OperationDefinition,
  inputSchema: () => Schema.Schema<I>,
  input: I,
  options: OperationOptions,
  responseType: "json" | "response",
): Effect.Effect<XResult<R>, XError, Client> =>
  Effect.gen(function* () {
    const parsed = yield* Schema.decodeUnknownEffect(
      Schema.toType(inputSchema()),
      { onExcessProperty: "error" },
    )(input).pipe(
      Effect.mapError(
        (cause) =>
          new XInputError(`Invalid input for ${definition.id}`, { cause }),
      ),
    );
    const client = yield* Client;
    return yield* Effect.tryPromise({
      try: (signal) =>
        client.requestOperation<R, I>(definition, parsed, {
          ...options,
          responseType,
          signal: options.signal
            ? AbortSignal.any([signal, options.signal])
            : signal,
        }),
      catch: (cause) => failure(definition, cause),
    });
  });

const decode = <O>(
  definition: OperationDefinition,
  schema: Schema.Schema<O>,
  result: XResult<unknown>,
): Effect.Effect<O, XDecodeError> =>
  Effect.gen(function* () {
    const mapped = yield* Effect.try({
      try: () => mapKeys(schema.ast, result.value, "decode"),
      catch: (cause) =>
        new XDecodeError(
          `Cannot map ${definition.id} response`,
          result.status,
          "",
          { cause },
        ),
    });
    return yield* Schema.decodeUnknownEffect(Schema.toType(schema), {
      onExcessProperty: "preserve",
    })(mapped).pipe(
      Effect.mapError(
        (cause) =>
          new XDecodeError(
            `Invalid ${definition.id} response`,
            result.status,
            "",
            { cause },
          ),
      ),
    );
  });

/** Generated operations are lazy Effects with typed errors and cancellation. */
export const makeOperation = <I extends object, O>(
  definition: OperationDefinition,
  inputSchema: () => Schema.Schema<I>,
  outputSchema: () => Schema.Schema<O>,
) => {
  const withResponse = (
    input: I,
    options: OperationOptions = {},
  ): Effect.Effect<XResult<O>, XError, Client> =>
    Effect.gen(function* () {
      const result = yield* send<I, unknown>(
        definition,
        inputSchema,
        input,
        options,
        "json",
      );
      const value = yield* decode(definition, outputSchema(), result);
      return { ...result, value };
    });
  return Object.assign(
    (
      input: I,
      options: OperationOptions = {},
    ): Effect.Effect<O, XError, Client> =>
      withResponse(input, options).pipe(Effect.map((result) => result.value)),
    { withResponse, operation: definition },
  );
};

export const makeBinaryOperation =
  <I extends object, O>(
    definition: OperationDefinition,
    inputSchema: () => Schema.Schema<I>,
    outputSchema: () => Schema.Schema<O>,
  ) =>
  (
    input: I,
    options: OperationOptions = {},
  ): Effect.Effect<O, XError, Client> =>
    Effect.gen(function* () {
      const result = yield* send<I, Response>(
        definition,
        inputSchema,
        input,
        options,
        "response",
      );
      const body = result.value.body;
      const chunks = body
        ? yield* Stream.fromReadableStream({
            evaluate: () => body,
            onError: (cause) => failure(definition, cause),
          }).pipe(Stream.runCollect)
        : [];
      const bytes = new Uint8Array(
        chunks.reduce((size, chunk) => size + chunk.length, 0),
      );
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.length;
      }
      return yield* decode(definition, outputSchema(), {
        ...result,
        value: bytes,
      });
    });

export const makeStreamOperation =
  <I extends object, O>(
    definition: OperationDefinition,
    inputSchema: () => Schema.Schema<I>,
    outputSchema: () => Schema.Schema<O>,
  ) =>
  (
    input: I,
    options: OperationOptions = {},
  ): Stream.Stream<O, XError, Client> =>
    Stream.unwrap(
      Effect.gen(function* () {
        const result = yield* send<I, Response>(
          definition,
          inputSchema,
          input,
          options,
          "response",
        );
        const body = result.value.body;
        if (!body)
          return Stream.fail(
            new XDecodeError(
              `Missing ${definition.id} stream`,
              result.status,
              "",
            ),
          );
        return Stream.fromReadableStream({
          evaluate: () => body,
          onError: (cause) => failure(definition, cause),
        }).pipe(
          Stream.decodeText(),
          Stream.splitLines,
          Stream.filter((line) => line.trim().length > 0),
          Stream.mapEffect((line) =>
            Effect.gen(function* () {
              const value = yield* Effect.try({
                try: (): XJsonValue => JSON.parse(line),
                catch: (cause) =>
                  new XDecodeError(
                    `Malformed ${definition.id} stream record`,
                    result.status,
                    line,
                    { cause },
                  ),
              });
              return yield* decode(definition, outputSchema(), {
                ...result,
                value,
              });
            }),
          ),
        );
      }),
    );
