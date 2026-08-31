export type FetchLike = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export type TokenProvider = string | (() => string | PromiseLike<string>);

export interface XRuntime {
  readonly fetch: FetchLike;
  readonly crypto: Pick<Crypto, "getRandomValues" | "subtle">;
  readonly now: () => number;
  readonly random: () => number;
  readonly sleep: (milliseconds: number, signal?: AbortSignal) => Promise<void>;
}

export type XRuntimeOptions = Partial<XRuntime>;
type AbortReason = AbortSignal["reason"];

const isTokenFactory = (
  provider: TokenProvider,
): provider is Exclude<TokenProvider, string> => Object(provider) === provider;

const abortError = (signal: AbortSignal): AbortReason =>
  signal.reason ?? new DOMException("The operation was aborted", "AbortError");

const sleep = (milliseconds: number, signal?: AbortSignal): Promise<void> => {
  if (signal?.aborted) return Promise.reject(abortError(signal));

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(done, Math.max(0, milliseconds));

    function done() {
      signal?.removeEventListener("abort", aborted);
      resolve();
    }

    function aborted() {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", aborted);
      reject(signal ? abortError(signal) : new Error("Aborted"));
    }

    signal?.addEventListener("abort", aborted, { once: true });
  });
};

export const runtime = (options: XRuntimeOptions = {}): XRuntime => {
  const fetchImpl = options.fetch ?? globalThis.fetch;
  const cryptoImpl = options.crypto ?? globalThis.crypto;

  if (!fetchImpl) {
    throw new Error("distilled-x requires a Fetch API implementation");
  }
  if (!cryptoImpl?.subtle || !cryptoImpl.getRandomValues) {
    throw new Error("distilled-x requires the Web Crypto API");
  }

  return {
    fetch: fetchImpl.bind(globalThis),
    crypto: cryptoImpl,
    now: options.now ?? Date.now,
    random: options.random ?? Math.random,
    sleep: options.sleep ?? sleep,
  };
};

export const resolveToken = async (provider: TokenProvider): Promise<string> =>
  isTokenFactory(provider) ? await provider() : provider;

export const utf8 = (value: string): Uint8Array<ArrayBuffer> =>
  new TextEncoder().encode(value);

export const ownedBytes = (
  value: Uint8Array<ArrayBufferLike>,
): Uint8Array<ArrayBuffer> => new Uint8Array(value);

export const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
};

export const base64ToBytes = (value: string): Uint8Array | undefined => {
  try {
    const binary = atob(value);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    return undefined;
  }
};

export const bytesToBase64Url = (bytes: Uint8Array): string =>
  bytesToBase64(bytes)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/u, "");
