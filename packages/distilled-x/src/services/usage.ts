// AUTO-GENERATED from xdevplatform/xdk@84c26540df30c0b798e50e34151c56d5d262ba1c; do not edit.
import * as S from "@distilled.cloud/core/schema";
import * as T from "../traits.ts";
import {
  makeOperation,
  makeBinaryOperation,
  makeStreamOperation,
} from "../operation.ts";
import { operations } from "../operations.ts";
export type GetUsageRequestUsageFieldsItem =
  | "cap_reset_day"
  | "daily_client_app_usage"
  | "daily_project_usage"
  | "project_cap"
  | "project_id"
  | "project_usage";
export const GetUsageRequestUsageFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Usage object. */
export type GetUsageRequestUsageFieldsList = Array<
  GetUsageRequestUsageFieldsItem | (string & {})
>;
export const GetUsageRequestUsageFieldsList = /*@__PURE__*/ S.Array(
  GetUsageRequestUsageFieldsItem,
) as any as S.Schema<GetUsageRequestUsageFieldsList>;

export interface GetUsageRequest {
  days?: number;
  /** A comma separated list of Usage fields to display. */
  usage_fields?: GetUsageRequestUsageFieldsList;
}
export const GetUsageRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    days: S.optional(S.Number.pipe(T.Query())),
    usage_fields: S.optional(
      GetUsageRequestUsageFieldsList.pipe(T.Query("usage.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/usage/tweets", code: 200 })),
).annotate({
  identifier: "GetUsageRequest",
}) as any as S.Schema<GetUsageRequest>;

/** A single day's usage entry. */
export interface UsageDailyClientAppUsageItemUsageItem {
  /** The day of the usage entry, as an ISO 8601 date-time. */
  date: string;
  /** Number of Posts used on this day. */
  usage?: string | null;
}
export const UsageDailyClientAppUsageItemUsageItem = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      date: S.String,
      usage: S.optional(S.NullOr(S.String)),
    }),
).annotate({
  identifier: "UsageDailyClientAppUsageItemUsageItem",
}) as any as S.Schema<UsageDailyClientAppUsageItemUsageItem>;

/** Daily usage entries for this client app. */
export type UsageDailyClientAppUsageItemUsageList =
  Array<UsageDailyClientAppUsageItemUsageItem>;
export const UsageDailyClientAppUsageItemUsageList = /*@__PURE__*/ S.Array(
  UsageDailyClientAppUsageItemUsageItem,
) as any as S.Schema<UsageDailyClientAppUsageItemUsageList>;

/** Per-client-app daily Post usage entry. */
export interface UsageDailyClientAppUsageItem {
  /** Unique identifier of the client app. */
  client_app_id?: string | null;
  /** Daily usage entries for this client app. */
  usage?: UsageDailyClientAppUsageItemUsageList;
  /** Number of daily usage entries returned for this client app. */
  usage_result_count: number;
}
export const UsageDailyClientAppUsageItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    client_app_id: S.optional(S.NullOr(S.String)),
    usage: S.optional(UsageDailyClientAppUsageItemUsageList),
    usage_result_count: S.Number,
  }),
).annotate({
  identifier: "UsageDailyClientAppUsageItem",
}) as any as S.Schema<UsageDailyClientAppUsageItem>;

/** Per-client-app daily Post usage for the caller's project. */
export type UsageDailyClientAppUsage = Array<UsageDailyClientAppUsageItem>;
export const UsageDailyClientAppUsage = /*@__PURE__*/ S.Array(
  UsageDailyClientAppUsageItem,
) as any as S.Schema<UsageDailyClientAppUsage>;

/** A single day's usage entry. */
export type UsageDailyProjectUsageUsageItem =
  UsageDailyClientAppUsageItemUsageItem;
export const UsageDailyProjectUsageUsageItem =
  UsageDailyClientAppUsageItemUsageItem;

/** Daily usage entries for the project. */
export type UsageDailyProjectUsageUsageList =
  Array<UsageDailyClientAppUsageItemUsageItem>;
export const UsageDailyProjectUsageUsageList = /*@__PURE__*/ S.Array(
  UsageDailyClientAppUsageItemUsageItem,
) as any as S.Schema<UsageDailyProjectUsageUsageList>;

/** Project-level daily Post usage for the caller's project. */
export interface UsageDailyProjectUsage {
  /** Unique identifier of the project. */
  project_id?: string | null;
  /** Daily usage entries for the project. */
  usage?: UsageDailyProjectUsageUsageList | null;
}
export const UsageDailyProjectUsage = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    project_id: S.optional(S.NullOr(S.String)),
    usage: S.optional(S.NullOr(UsageDailyProjectUsageUsageList)),
  }),
).annotate({
  identifier: "UsageDailyProjectUsage",
}) as any as S.Schema<UsageDailyProjectUsage>;

export interface Usage2 {
  cap_reset_day?: number;
  daily_client_app_usage?: UsageDailyClientAppUsage;
  daily_project_usage?: UsageDailyProjectUsage;
  project_cap?: string;
  project_id?: string;
  project_usage?: string;
}
export const Usage2 = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    cap_reset_day: S.optional(S.Number),
    daily_client_app_usage: S.optional(UsageDailyClientAppUsage),
    daily_project_usage: S.optional(UsageDailyProjectUsage),
    project_cap: S.optional(S.String),
    project_id: S.optional(S.String),
    project_usage: S.optional(S.String),
  }),
).annotate({ identifier: "Usage2" }) as any as S.Schema<Usage2>;

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
export type GetUsageResponseErrorsList = Array<Problem>;
export const GetUsageResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsageResponseErrorsList>;

export interface GetUsageResponse {
  data?: Usage2;
  errors?: GetUsageResponseErrorsList;
}
export const GetUsageResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(Usage2),
    errors: S.optional(GetUsageResponseErrorsList),
  }),
).annotate({
  identifier: "GetUsageResponse",
}) as any as S.Schema<GetUsageResponse>;

export const getUsage = /*@__PURE__*/ makeOperation<
  GetUsageRequest,
  GetUsageResponse
>(
  operations.getUsage,
  () => GetUsageRequest,
  () => GetUsageResponse,
);
