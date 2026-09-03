// AUTO-GENERATED from xdevplatform/xdk@84c26540df30c0b798e50e34151c56d5d262ba1c; do not edit.
import * as S from "@distilled.cloud/core/schema";
import * as T from "../traits.ts";
import {
  makeOperation,
  makeBinaryOperation,
  makeStreamOperation,
} from "../operation.ts";
import { operations } from "../operations.ts";
export type GetCommunitiesByIdRequestCommunityFieldsItem =
  | "access"
  | "created_at"
  | "description"
  | "id"
  | "join_policy"
  | "member_count"
  | "name";
export const GetCommunitiesByIdRequestCommunityFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a Community object. */
export type GetCommunitiesByIdRequestCommunityFieldsList = Array<
  GetCommunitiesByIdRequestCommunityFieldsItem | (string & {})
>;
export const GetCommunitiesByIdRequestCommunityFieldsList =
  /*@__PURE__*/ S.Array(
    GetCommunitiesByIdRequestCommunityFieldsItem,
  ) as any as S.Schema<GetCommunitiesByIdRequestCommunityFieldsList>;

export interface GetCommunitiesByIdRequest {
  id: string;
  /** A comma separated list of Community fields to display. */
  community_fields?: GetCommunitiesByIdRequestCommunityFieldsList;
}
export const GetCommunitiesByIdRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    community_fields: S.optional(
      GetCommunitiesByIdRequestCommunityFieldsList.pipe(
        T.Query("community.fields"),
      ),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/communities/{id}", code: 200 })),
).annotate({
  identifier: "GetCommunitiesByIdRequest",
}) as any as S.Schema<GetCommunitiesByIdRequest>;

export interface Community {
  access?: string;
  created_at?: string;
  description?: string;
  id?: string;
  join_policy?: string;
  member_count?: number;
  name?: string;
}
export const Community = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    access: S.optional(S.String),
    created_at: S.optional(S.String),
    description: S.optional(S.String),
    id: S.optional(S.String),
    join_policy: S.optional(S.String),
    member_count: S.optional(S.Number),
    name: S.optional(S.String),
  }),
).annotate({ identifier: "Community" }) as any as S.Schema<Community>;

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
export type GetCommunitiesByIdResponseErrorsList = Array<Problem>;
export const GetCommunitiesByIdResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetCommunitiesByIdResponseErrorsList>;

export interface GetCommunitiesByIdResponse {
  data?: Community;
  errors?: GetCommunitiesByIdResponseErrorsList;
}
export const GetCommunitiesByIdResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(Community),
    errors: S.optional(GetCommunitiesByIdResponseErrorsList),
  }),
).annotate({
  identifier: "GetCommunitiesByIdResponse",
}) as any as S.Schema<GetCommunitiesByIdResponse>;

export type SearchCommunitiesRequestCommunityFieldsItem =
  | "access"
  | "created_at"
  | "description"
  | "id"
  | "join_policy"
  | "member_count"
  | "name";
export const SearchCommunitiesRequestCommunityFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a Community object. */
export type SearchCommunitiesRequestCommunityFieldsList = Array<
  SearchCommunitiesRequestCommunityFieldsItem | (string & {})
>;
export const SearchCommunitiesRequestCommunityFieldsList =
  /*@__PURE__*/ S.Array(
    SearchCommunitiesRequestCommunityFieldsItem,
  ) as any as S.Schema<SearchCommunitiesRequestCommunityFieldsList>;

export interface SearchCommunitiesRequest {
  query: string;
  max_results?: number;
  next_token?: string;
  pagination_token?: string;
  /** A comma separated list of Community fields to display. */
  community_fields?: SearchCommunitiesRequestCommunityFieldsList;
}
export const SearchCommunitiesRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    query: S.String.pipe(T.Query()),
    max_results: S.optional(S.Number.pipe(T.Query())),
    next_token: S.optional(S.String.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
    community_fields: S.optional(
      SearchCommunitiesRequestCommunityFieldsList.pipe(
        T.Query("community.fields"),
      ),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/communities/search", code: 200 })),
).annotate({
  identifier: "SearchCommunitiesRequest",
}) as any as S.Schema<SearchCommunitiesRequest>;

export type SearchCommunitiesResponseDataList = Array<Community>;
export const SearchCommunitiesResponseDataList = /*@__PURE__*/ S.Array(
  Community,
) as any as S.Schema<SearchCommunitiesResponseDataList>;

export type SearchCommunitiesResponseErrorsList = Array<Problem>;
export const SearchCommunitiesResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<SearchCommunitiesResponseErrorsList>;

export interface SearchCommunitiesResponseMeta {
  /** Pagination token for the next page of results. */
  next_token?: string;
}
export const SearchCommunitiesResponseMeta = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    next_token: S.optional(S.String),
  }),
).annotate({
  identifier: "SearchCommunitiesResponseMeta",
}) as any as S.Schema<SearchCommunitiesResponseMeta>;

export interface SearchCommunitiesResponse {
  data?: SearchCommunitiesResponseDataList;
  errors?: SearchCommunitiesResponseErrorsList;
  meta?: SearchCommunitiesResponseMeta;
}
export const SearchCommunitiesResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(SearchCommunitiesResponseDataList),
    errors: S.optional(SearchCommunitiesResponseErrorsList),
    meta: S.optional(SearchCommunitiesResponseMeta),
  }),
).annotate({
  identifier: "SearchCommunitiesResponse",
}) as any as S.Schema<SearchCommunitiesResponse>;

export const getCommunitiesById = /*@__PURE__*/ makeOperation<
  GetCommunitiesByIdRequest,
  GetCommunitiesByIdResponse
>(
  operations.getCommunitiesById,
  () => GetCommunitiesByIdRequest,
  () => GetCommunitiesByIdResponse,
);

export const searchCommunities = /*@__PURE__*/ makeOperation<
  SearchCommunitiesRequest,
  SearchCommunitiesResponse
>(
  operations.searchCommunities,
  () => SearchCommunitiesRequest,
  () => SearchCommunitiesResponse,
);
