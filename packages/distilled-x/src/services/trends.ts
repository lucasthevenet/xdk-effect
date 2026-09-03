// AUTO-GENERATED from xdevplatform/xdk@84c26540df30c0b798e50e34151c56d5d262ba1c; do not edit.
import * as S from "@distilled.cloud/core/schema";
import * as T from "../traits.ts";
import {
  makeOperation,
  makeBinaryOperation,
  makeStreamOperation,
} from "../operation.ts";
import { operations } from "../operations.ts";
export type GetTrendsPersonalizedTrendsRequestPersonalizedTrendFieldsItem =
  | "category"
  | "post_count"
  | "trend_name"
  | "trending_since";
export const GetTrendsPersonalizedTrendsRequestPersonalizedTrendFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a PersonalizedTrend object. */
export type GetTrendsPersonalizedTrendsRequestPersonalizedTrendFieldsList =
  Array<
    | GetTrendsPersonalizedTrendsRequestPersonalizedTrendFieldsItem
    | (string & {})
  >;
export const GetTrendsPersonalizedTrendsRequestPersonalizedTrendFieldsList =
  /*@__PURE__*/ S.Array(
    GetTrendsPersonalizedTrendsRequestPersonalizedTrendFieldsItem,
  ) as any as S.Schema<GetTrendsPersonalizedTrendsRequestPersonalizedTrendFieldsList>;

export interface GetTrendsPersonalizedTrendsRequest {
  /** A comma separated list of PersonalizedTrend fields to display. */
  personalized_trend_fields?: GetTrendsPersonalizedTrendsRequestPersonalizedTrendFieldsList;
}
export const GetTrendsPersonalizedTrendsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    personalized_trend_fields: S.optional(
      GetTrendsPersonalizedTrendsRequestPersonalizedTrendFieldsList.pipe(
        T.Query("personalized_trend.fields"),
      ),
    ),
  }).pipe(
    T.Http({ method: "GET", uri: "/2/users/personalized_trends", code: 200 }),
  ),
).annotate({
  identifier: "GetTrendsPersonalizedTrendsRequest",
}) as any as S.Schema<GetTrendsPersonalizedTrendsRequest>;

export interface PersonalizedTrend {
  category?: string;
  post_count?: string;
  trend_name?: string;
  trending_since?: string;
}
export const PersonalizedTrend = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    category: S.optional(S.String),
    post_count: S.optional(S.String),
    trend_name: S.optional(S.String),
    trending_since: S.optional(S.String),
  }),
).annotate({
  identifier: "PersonalizedTrend",
}) as any as S.Schema<PersonalizedTrend>;

export type GetTrendsPersonalizedTrendsResponseDataList =
  Array<PersonalizedTrend>;
export const GetTrendsPersonalizedTrendsResponseDataList =
  /*@__PURE__*/ S.Array(
    PersonalizedTrend,
  ) as any as S.Schema<GetTrendsPersonalizedTrendsResponseDataList>;

export type ResourceNotFoundProblemType =
  "https://api.x.com/2/problems/resource-not-found";
export const ResourceNotFoundProblemType = /*@__PURE__*/ S.String;

export interface ResourceNotFoundProblem {
  detail: string;
  parameter?: string;
  resource_id?: string;
  resource_type: string;
  status?: number;
  title: string;
  type: ResourceNotFoundProblemType;
  value?: string;
}
export const ResourceNotFoundProblem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    detail: S.String,
    parameter: S.optional(S.String),
    resource_id: S.optional(S.String),
    resource_type: S.String,
    status: S.optional(S.Number),
    title: S.String,
    type: ResourceNotFoundProblemType,
    value: S.optional(S.String),
  }),
).annotate({
  identifier: "ResourceNotFoundProblem",
}) as any as S.Schema<ResourceNotFoundProblem>;

export type InvalidRequestProblemType =
  "https://api.x.com/2/problems/invalid-request";
export const InvalidRequestProblemType = /*@__PURE__*/ S.String;

export interface InvalidRequestProblem {
  detail: string;
  parameter?: string;
  status?: number;
  title: string;
  type: InvalidRequestProblemType;
  value?: string;
}
export const InvalidRequestProblem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    detail: S.String,
    parameter: S.optional(S.String),
    status: S.optional(S.Number),
    title: S.String,
    type: InvalidRequestProblemType,
    value: S.optional(S.String),
  }),
).annotate({
  identifier: "InvalidRequestProblem",
}) as any as S.Schema<InvalidRequestProblem>;

export type NotAuthorizedForResourceProblemType =
  "https://api.x.com/2/problems/not-authorized-for-resource";
export const NotAuthorizedForResourceProblemType = /*@__PURE__*/ S.String;

export interface NotAuthorizedForResourceProblem {
  detail: string;
  parameter?: string;
  resource_id?: string;
  resource_type: string;
  section?: string;
  status?: number;
  title: string;
  type: NotAuthorizedForResourceProblemType;
  value?: string;
}
export const NotAuthorizedForResourceProblem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    detail: S.String,
    parameter: S.optional(S.String),
    resource_id: S.optional(S.String),
    resource_type: S.String,
    section: S.optional(S.String),
    status: S.optional(S.Number),
    title: S.String,
    type: NotAuthorizedForResourceProblemType,
    value: S.optional(S.String),
  }),
).annotate({
  identifier: "NotAuthorizedForResourceProblem",
}) as any as S.Schema<NotAuthorizedForResourceProblem>;

export type NotAuthorizedForFieldProblemType =
  "https://api.x.com/2/problems/not-authorized-for-field";
export const NotAuthorizedForFieldProblemType = /*@__PURE__*/ S.String;

export interface NotAuthorizedForFieldProblem {
  detail: string;
  field: string;
  parameter?: string;
  resource_id?: string;
  resource_type?: string;
  section?: string;
  status?: number;
  title: string;
  type: NotAuthorizedForFieldProblemType;
  value?: string;
}
export const NotAuthorizedForFieldProblem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    detail: S.String,
    field: S.String,
    parameter: S.optional(S.String),
    resource_id: S.optional(S.String),
    resource_type: S.optional(S.String),
    section: S.optional(S.String),
    status: S.optional(S.Number),
    title: S.String,
    type: NotAuthorizedForFieldProblemType,
    value: S.optional(S.String),
  }),
).annotate({
  identifier: "NotAuthorizedForFieldProblem",
}) as any as S.Schema<NotAuthorizedForFieldProblem>;

export type FieldUnauthorizedProblemType =
  "https://api.x.com/2/problems/field-unauthorized";
export const FieldUnauthorizedProblemType = /*@__PURE__*/ S.String;

export interface FieldUnauthorizedProblem {
  detail: string;
  field: string;
  resource_type?: string;
  section?: string;
  status?: number;
  title: string;
  type: FieldUnauthorizedProblemType;
}
export const FieldUnauthorizedProblem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    detail: S.String,
    field: S.String,
    resource_type: S.optional(S.String),
    section: S.optional(S.String),
    status: S.optional(S.Number),
    title: S.String,
    type: FieldUnauthorizedProblemType,
  }),
).annotate({
  identifier: "FieldUnauthorizedProblem",
}) as any as S.Schema<FieldUnauthorizedProblem>;

export type FieldHydrationFailureProblemType =
  "https://api.x.com/2/problems/field-hydration-failure";
export const FieldHydrationFailureProblemType = /*@__PURE__*/ S.String;

export interface FieldHydrationFailureProblem {
  detail: string;
  field: string;
  resource_type?: string;
  section?: string;
  status?: number;
  title: string;
  type: FieldHydrationFailureProblemType;
}
export const FieldHydrationFailureProblem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    detail: S.String,
    field: S.String,
    resource_type: S.optional(S.String),
    section: S.optional(S.String),
    status: S.optional(S.Number),
    title: S.String,
    type: FieldHydrationFailureProblemType,
  }),
).annotate({
  identifier: "FieldHydrationFailureProblem",
}) as any as S.Schema<FieldHydrationFailureProblem>;

export type ResourceUnavailableProblemType =
  "https://api.x.com/2/problems/resource-unavailable";
export const ResourceUnavailableProblemType = /*@__PURE__*/ S.String;

export interface ResourceUnavailableProblem {
  detail: string;
  resource_id?: string;
  resource_type: string;
  status?: number;
  title: string;
  type: ResourceUnavailableProblemType;
}
export const ResourceUnavailableProblem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    detail: S.String,
    resource_id: S.optional(S.String),
    resource_type: S.String,
    status: S.optional(S.Number),
    title: S.String,
    type: ResourceUnavailableProblemType,
  }),
).annotate({
  identifier: "ResourceUnavailableProblem",
}) as any as S.Schema<ResourceUnavailableProblem>;

export type DisallowedResourceProblemType =
  "https://api.x.com/2/problems/disallowed-resource";
export const DisallowedResourceProblemType = /*@__PURE__*/ S.String;

export interface DisallowedResourceProblem {
  detail: string;
  resource_id?: string;
  resource_type?: string;
  section?: string;
  status?: number;
  title: string;
  type: DisallowedResourceProblemType;
}
export const DisallowedResourceProblem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    detail: S.String,
    resource_id: S.optional(S.String),
    resource_type: S.optional(S.String),
    section: S.optional(S.String),
    status: S.optional(S.Number),
    title: S.String,
    type: DisallowedResourceProblemType,
  }),
).annotate({
  identifier: "DisallowedResourceProblem",
}) as any as S.Schema<DisallowedResourceProblem>;

export type InternalErrorProblemType =
  "https://api.x.com/2/problems/internal-error";
export const InternalErrorProblemType = /*@__PURE__*/ S.String;

export interface InternalErrorProblem {
  detail: string;
  status?: number;
  title: string;
  type: InternalErrorProblemType;
}
export const InternalErrorProblem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    detail: S.String,
    status: S.optional(S.Number),
    title: S.String,
    type: InternalErrorProblemType,
  }),
).annotate({
  identifier: "InternalErrorProblem",
}) as any as S.Schema<InternalErrorProblem>;

export type Problem =
  | ResourceNotFoundProblem
  | InvalidRequestProblem
  | NotAuthorizedForResourceProblem
  | NotAuthorizedForFieldProblem
  | FieldUnauthorizedProblem
  | FieldHydrationFailureProblem
  | ResourceUnavailableProblem
  | DisallowedResourceProblem
  | InternalErrorProblem;
export const Problem = /*@__PURE__*/ S.Unknown as any as S.Schema<Problem>;
export type GetTrendsPersonalizedTrendsResponseErrorsList = Array<Problem>;
export const GetTrendsPersonalizedTrendsResponseErrorsList =
  /*@__PURE__*/ S.Array(
    Problem,
  ) as any as S.Schema<GetTrendsPersonalizedTrendsResponseErrorsList>;

export interface GetTrendsPersonalizedTrendsResponse {
  data?: GetTrendsPersonalizedTrendsResponseDataList;
  errors?: GetTrendsPersonalizedTrendsResponseErrorsList;
}
export const GetTrendsPersonalizedTrendsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetTrendsPersonalizedTrendsResponseDataList),
    errors: S.optional(GetTrendsPersonalizedTrendsResponseErrorsList),
  }),
).annotate({
  identifier: "GetTrendsPersonalizedTrendsResponse",
}) as any as S.Schema<GetTrendsPersonalizedTrendsResponse>;

export const getTrendsPersonalizedTrends = /*@__PURE__*/ makeOperation<
  GetTrendsPersonalizedTrendsRequest,
  GetTrendsPersonalizedTrendsResponse
>(
  operations.getTrendsPersonalizedTrends,
  () => GetTrendsPersonalizedTrendsRequest,
  () => GetTrendsPersonalizedTrendsResponse,
);
