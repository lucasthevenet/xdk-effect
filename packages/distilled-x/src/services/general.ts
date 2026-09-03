// AUTO-GENERATED from xdevplatform/xdk@84c26540df30c0b798e50e34151c56d5d262ba1c; do not edit.
import * as S from "@distilled.cloud/core/schema";
import * as T from "../traits.ts";
import {
  makeOperation,
  makeBinaryOperation,
  makeStreamOperation,
} from "../operation.ts";
import { operations } from "../operations.ts";
export interface GetOpenApiSpecRequest {}
export const GetOpenApiSpecRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({}).pipe(
    T.Http({ method: "GET", uri: "/2/openapi.json", code: 200 }),
  ),
).annotate({
  identifier: "GetOpenApiSpecRequest",
}) as any as S.Schema<GetOpenApiSpecRequest>;

export type GetOpenApiSpecResponse = unknown;
export const GetOpenApiSpecResponse = /*@__PURE__*/ S.suspend(() =>
  S.Unknown.pipe(T.RawResponseRoot()),
).annotate({
  identifier: "GetOpenApiSpecResponse",
}) as any as S.Schema<GetOpenApiSpecResponse>;

export const getOpenApiSpec = /*@__PURE__*/ makeOperation<
  GetOpenApiSpecRequest,
  GetOpenApiSpecResponse
>(
  operations.getOpenApiSpec,
  () => GetOpenApiSpecRequest,
  () => GetOpenApiSpecResponse,
);
