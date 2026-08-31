import {
  base64ToBytes,
  bytesToBase64,
  ownedBytes,
  runtime,
  type XRuntimeOptions,
  utf8,
} from "./runtime.ts";

export const X_WEBHOOK_SIGNATURE_HEADER = "x-twitter-webhooks-signature";

const hmacKey = (
  consumerSecret: string,
  options?: XRuntimeOptions,
): Promise<CryptoKey> =>
  runtime(options).crypto.subtle.importKey(
    "raw",
    utf8(consumerSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );

export const createCrcResponse = async (
  crcToken: string,
  consumerSecret: string,
  options?: XRuntimeOptions,
): Promise<{ readonly response_token: `sha256=${string}` }> => {
  const platform = runtime(options);
  const key = await hmacKey(consumerSecret, platform);
  const signature = await platform.crypto.subtle.sign(
    "HMAC",
    key,
    utf8(crcToken),
  );
  return {
    response_token: `sha256=${bytesToBase64(new Uint8Array(signature))}`,
  };
};

export const verifyWebhookSignature = async (input: {
  readonly rawBody: Uint8Array;
  readonly signature: string | null | undefined;
  readonly consumerSecret: string;
  readonly runtime?: XRuntimeOptions;
}): Promise<boolean> => {
  if (!input.signature?.startsWith("sha256=")) return false;
  const signature = base64ToBytes(input.signature.slice("sha256=".length));
  if (!signature) return false;

  const platform = runtime(input.runtime);
  const key = await hmacKey(input.consumerSecret, platform);
  return platform.crypto.subtle.verify(
    "HMAC",
    key,
    ownedBytes(signature),
    ownedBytes(input.rawBody),
  );
};

export const verifyWebhookRequest = async (
  request: Request,
  consumerSecret: string,
  options?: XRuntimeOptions,
): Promise<boolean> => {
  const input = {
    rawBody: new Uint8Array(await request.clone().arrayBuffer()),
    signature: request.headers.get(X_WEBHOOK_SIGNATURE_HEADER),
    consumerSecret,
  };
  return options
    ? verifyWebhookSignature({ ...input, runtime: options })
    : verifyWebhookSignature(input);
};
