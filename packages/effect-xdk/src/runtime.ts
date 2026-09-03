export const utf8 = (value: string): Uint8Array<ArrayBuffer> =>
  new TextEncoder().encode(value);

export const ownedBytes = (
  value: Uint8Array<ArrayBufferLike>,
): Uint8Array<ArrayBuffer> => new Uint8Array(value);
