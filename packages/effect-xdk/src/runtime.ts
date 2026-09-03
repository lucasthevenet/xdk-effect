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
