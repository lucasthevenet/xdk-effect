import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";

export class HmacError extends Schema.TaggedError<HmacError>()("HmacError", {
  method: Schema.Literals(["sign", "verify"]),
  cause: Schema.Unknown,
}) {}

export interface HmacInput {
  readonly hash: "SHA-1" | "SHA-256";
  readonly key: Uint8Array;
  readonly data: Uint8Array;
}

/** Keyed signing and verification for OAuth1 and X webhooks. */
export class Hmac extends Context.Service<
  Hmac,
  {
    readonly sign: (input: HmacInput) => Effect.Effect<Uint8Array, HmacError>;
    readonly verify: (
      input: HmacInput & { readonly signature: Uint8Array },
    ) => Effect.Effect<boolean, HmacError>;
  }
>()("effect-xdk/Hmac") {}

/** Wrap a host's Web Crypto implementation in the Hmac service. */
export const makeSubtle = (crypto: Crypto): Effect.Effect<Hmac["Service"]> =>
  Effect.sync(() =>
    Hmac.of({
      sign: (input) =>
        Effect.tryPromise({
          try: async () => {
            const key = await crypto.subtle.importKey(
              "raw",
              new Uint8Array(input.key),
              { name: "HMAC", hash: input.hash },
              false,
              ["sign"],
            );
            return new Uint8Array(
              await crypto.subtle.sign("HMAC", key, new Uint8Array(input.data)),
            );
          },
          catch: (cause) => new HmacError({ method: "sign", cause }),
        }),
      verify: (input) =>
        Effect.tryPromise({
          try: async () => {
            const key = await crypto.subtle.importKey(
              "raw",
              new Uint8Array(input.key),
              { name: "HMAC", hash: input.hash },
              false,
              ["verify"],
            );
            return crypto.subtle.verify(
              "HMAC",
              key,
              new Uint8Array(input.signature),
              new Uint8Array(input.data),
            );
          },
          catch: (cause) => new HmacError({ method: "verify", cause }),
        }),
    }),
  );

/** Uses the runtime's native Web Crypto, resolved when the layer is built. */
export const layerSubtle: Layer.Layer<Hmac> = Layer.effect(
  Hmac,
  Effect.suspend(() => makeSubtle(globalThis.crypto)),
);
