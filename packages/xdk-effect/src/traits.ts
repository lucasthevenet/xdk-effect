import { makeAnnotation } from "@distilled.cloud/core/trait";

export {
  Body,
  Header,
  Query,
  Label,
  Http,
  HttpBody,
} from "@distilled.cloud/core/trait";
export {
  RawResponse,
  RawResponseRoot,
} from "@distilled.cloud/core/protocol-rest";

export type SecurityScheme = "oauth1" | "oauth2" | "app";
export const securitySymbol = Symbol.for("xdk-effect/security");
/** Authentication alternatives declared by this operation's OpenAPI security. */
export const Security = (schemes: readonly SecurityScheme[]) =>
  makeAnnotation(securitySymbol, schemes);

export const csvQuerySymbol = Symbol.for("xdk-effect/csv-query");
/** OpenAPI form query parameters with explode: false. */
export const CsvQuery = (enabled = true) =>
  makeAnnotation(csvQuerySymbol, enabled);

export const multipartSymbol = Symbol.for("xdk-effect/multipart");
/** Select multipart when a body field is a Blob; otherwise send JSON. */
export const Multipart = (enabled = true) =>
  makeAnnotation(multipartSymbol, enabled);

export const requestBodySymbol = Symbol.for("xdk-effect/request-body");
/** Preserve an explicit empty JSON body when all body fields are omitted. */
export const RequestBody = (enabled = true) =>
  makeAnnotation(requestBodySymbol, enabled);

export const responseSymbol = Symbol.for("xdk-effect/response");
/** Non-JSON transport mode; streams decode each record with the payload schema. */
export const Response = (mode: "binary" | "stream") =>
  makeAnnotation(responseSymbol, mode);
