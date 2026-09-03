// AUTO-GENERATED from xdevplatform/xdk@84c26540df30c0b798e50e34151c56d5d262ba1c; do not edit.
import * as S from "@distilled.cloud/core/schema";
import * as T from "../traits.ts";
import {
  makeOperation,
  makeBinaryOperation,
  makeStreamOperation,
} from "../operation.ts";
import { operations } from "../operations.ts";
export interface FollowListRequest {
  id: string;
  list_id: string;
}
export const FollowListRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    list_id: S.String,
  }).pipe(
    T.Http({ method: "POST", uri: "/2/users/{id}/followed_lists", code: 200 }),
  ),
).annotate({
  identifier: "FollowListRequest",
}) as any as S.Schema<FollowListRequest>;

export interface FollowListResponseData {
  /** Whether the user is following the List. */
  following: boolean;
}
export const FollowListResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    following: S.Boolean,
  }),
).annotate({
  identifier: "FollowListResponseData",
}) as any as S.Schema<FollowListResponseData>;

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
export type FollowListResponseErrorsList = Array<Problem>;
export const FollowListResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<FollowListResponseErrorsList>;

export interface FollowListResponse {
  data?: FollowListResponseData;
  errors?: FollowListResponseErrorsList;
}
export const FollowListResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(FollowListResponseData),
    errors: S.optional(FollowListResponseErrorsList),
  }),
).annotate({
  identifier: "FollowListResponse",
}) as any as S.Schema<FollowListResponse>;

export interface FollowUserRequest {
  id: string;
  target_user_id: string;
}
export const FollowUserRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    target_user_id: S.String,
  }).pipe(
    T.Http({ method: "POST", uri: "/2/users/{id}/following", code: 200 }),
  ),
).annotate({
  identifier: "FollowUserRequest",
}) as any as S.Schema<FollowUserRequest>;

export interface FollowUserResponseData {
  /** Whether the source User is following the target User. */
  following: boolean;
  /** Whether the follow request is pending the target User's approval. */
  pending_follow: boolean;
}
export const FollowUserResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    following: S.Boolean,
    pending_follow: S.Boolean,
  }),
).annotate({
  identifier: "FollowUserResponseData",
}) as any as S.Schema<FollowUserResponseData>;

export type FollowUserResponseErrorsList = Array<Problem>;
export const FollowUserResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<FollowUserResponseErrorsList>;

export interface FollowUserResponse {
  data?: FollowUserResponseData;
  errors?: FollowUserResponseErrorsList;
}
export const FollowUserResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(FollowUserResponseData),
    errors: S.optional(FollowUserResponseErrorsList),
  }),
).annotate({
  identifier: "FollowUserResponse",
}) as any as S.Schema<FollowUserResponse>;

export type GetUsersAffiliatesRequestUserFieldsItem =
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "name"
  | "parody"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscribes_to_you"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const GetUsersAffiliatesRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetUsersAffiliatesRequestUserFieldsList = Array<
  GetUsersAffiliatesRequestUserFieldsItem | (string & {})
>;
export const GetUsersAffiliatesRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetUsersAffiliatesRequestUserFieldsItem,
) as any as S.Schema<GetUsersAffiliatesRequestUserFieldsList>;

export type GetUsersAffiliatesRequestExpansionsItem =
  | "affiliation"
  | "most_recent_post_id"
  | "pinned_post_id";
export const GetUsersAffiliatesRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetUsersAffiliatesRequestExpansionsList = Array<
  GetUsersAffiliatesRequestExpansionsItem | (string & {})
>;
export const GetUsersAffiliatesRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetUsersAffiliatesRequestExpansionsItem,
) as any as S.Schema<GetUsersAffiliatesRequestExpansionsList>;

export type GetUsersAffiliatesRequestPostFieldsItem =
  | "article"
  | "article_title"
  | "attachments"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "entities"
  | "geo"
  | "id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_post"
  | "note_request_suggestions"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const GetUsersAffiliatesRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetUsersAffiliatesRequestPostFieldsList = Array<
  GetUsersAffiliatesRequestPostFieldsItem | (string & {})
>;
export const GetUsersAffiliatesRequestPostFieldsList = /*@__PURE__*/ S.Array(
  GetUsersAffiliatesRequestPostFieldsItem,
) as any as S.Schema<GetUsersAffiliatesRequestPostFieldsList>;

export interface GetUsersAffiliatesRequest {
  id: string;
  max_results?: number;
  /** A 64-bit signed integer. */
  pagination_token?: string;
  /** A comma separated list of User fields to display. */
  user_fields?: GetUsersAffiliatesRequestUserFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetUsersAffiliatesRequestExpansionsList;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetUsersAffiliatesRequestPostFieldsList;
}
export const GetUsersAffiliatesRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
    user_fields: S.optional(
      GetUsersAffiliatesRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    expansions: S.optional(
      GetUsersAffiliatesRequestExpansionsList.pipe(T.Query()),
    ),
    post_fields: S.optional(
      GetUsersAffiliatesRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
  }).pipe(
    T.Http({ method: "GET", uri: "/2/users/{id}/affiliates", code: 200 }),
  ),
).annotate({
  identifier: "GetUsersAffiliatesRequest",
}) as any as S.Schema<GetUsersAffiliatesRequest>;

/** A list of unique identifiers of the accounts this User is affiliated with. */
export type UserAffiliationUserIdList = Array<string>;
export const UserAffiliationUserIdList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<UserAffiliationUserIdList>;

/** Metadata about a user's affiliation. */
export interface UserAffiliation {
  /** URL of the affiliation badge image shown on the User's profile. */
  badge_url?: string | null;
  /** Description of the affiliation. */
  description?: string | null;
  /** URL associated with the affiliation. */
  url?: string | null;
  /** A list of unique identifiers of the accounts this User is affiliated with. */
  user_id?: UserAffiliationUserIdList | null;
}
export const UserAffiliation = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    badge_url: S.optional(S.NullOr(S.String)),
    description: S.optional(S.NullOr(S.String)),
    url: S.optional(S.NullOr(S.String)),
    user_id: S.optional(S.NullOr(UserAffiliationUserIdList)),
  }),
).annotate({
  identifier: "UserAffiliation",
}) as any as S.Schema<UserAffiliation>;

/** A connection between the authenticated User and this User. */
export type UserConnectionStatusItem =
  | "blocking"
  | "follow_request_received"
  | "follow_request_sent"
  | "followed_by"
  | "following"
  | "muting";
export const UserConnectionStatusItem = /*@__PURE__*/ S.String;

/** Returns detailed information about the relationship between two users. */
export type UserConnectionStatus = Array<UserConnectionStatusItem>;
export const UserConnectionStatus = /*@__PURE__*/ S.Array(
  UserConnectionStatusItem,
) as any as S.Schema<UserConnectionStatus>;

/** A hashtag or cashtag entity. */
export interface UserEntitiesDescriptionCashtagsItem {
  /** End index in the text (exclusive). */
  end: number;
  /** Start index in the text (inclusive). */
  start: number;
  tag: string;
}
export const UserEntitiesDescriptionCashtagsItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    end: S.Number,
    start: S.Number,
    tag: S.String,
  }),
).annotate({
  identifier: "UserEntitiesDescriptionCashtagsItem",
}) as any as S.Schema<UserEntitiesDescriptionCashtagsItem>;

export type UserEntitiesDescriptionCashtagsList =
  Array<UserEntitiesDescriptionCashtagsItem>;
export const UserEntitiesDescriptionCashtagsList = /*@__PURE__*/ S.Array(
  UserEntitiesDescriptionCashtagsItem,
) as any as S.Schema<UserEntitiesDescriptionCashtagsList>;

/** A hashtag or cashtag entity. */
export type UserEntitiesDescriptionHashtagsItem =
  UserEntitiesDescriptionCashtagsItem;
export const UserEntitiesDescriptionHashtagsItem =
  UserEntitiesDescriptionCashtagsItem;

export type UserEntitiesDescriptionHashtagsList =
  Array<UserEntitiesDescriptionCashtagsItem>;
export const UserEntitiesDescriptionHashtagsList = /*@__PURE__*/ S.Array(
  UserEntitiesDescriptionCashtagsItem,
) as any as S.Schema<UserEntitiesDescriptionHashtagsList>;

/** A user mention entity. */
export interface UserEntitiesDescriptionMentionsItem {
  end: number;
  id?: string | null;
  start: number;
  username: string;
}
export const UserEntitiesDescriptionMentionsItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    end: S.Number,
    id: S.optional(S.NullOr(S.String)),
    start: S.Number,
    username: S.String,
  }),
).annotate({
  identifier: "UserEntitiesDescriptionMentionsItem",
}) as any as S.Schema<UserEntitiesDescriptionMentionsItem>;

export type UserEntitiesDescriptionMentionsList =
  Array<UserEntitiesDescriptionMentionsItem>;
export const UserEntitiesDescriptionMentionsList = /*@__PURE__*/ S.Array(
  UserEntitiesDescriptionMentionsItem,
) as any as S.Schema<UserEntitiesDescriptionMentionsList>;

/** A preview image for a linked page. */
export interface UserEntitiesDescriptionUrlsItemImagesItem {
  height?: number | null;
  url?: string | null;
  width?: number | null;
}
export const UserEntitiesDescriptionUrlsItemImagesItem =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      height: S.optional(S.NullOr(S.Number)),
      url: S.optional(S.NullOr(S.String)),
      width: S.optional(S.NullOr(S.Number)),
    }),
  ).annotate({
    identifier: "UserEntitiesDescriptionUrlsItemImagesItem",
  }) as any as S.Schema<UserEntitiesDescriptionUrlsItemImagesItem>;

export type UserEntitiesDescriptionUrlsItemImagesList =
  Array<UserEntitiesDescriptionUrlsItemImagesItem>;
export const UserEntitiesDescriptionUrlsItemImagesList = /*@__PURE__*/ S.Array(
  UserEntitiesDescriptionUrlsItemImagesItem,
) as any as S.Schema<UserEntitiesDescriptionUrlsItemImagesList>;

/** A URL entity found in profile text. */
export interface UserEntitiesDescriptionUrlsItem {
  /** Description of the linked page, when available. */
  description?: string | null;
  /** The URL as displayed in the Post text. */
  display_url?: string | null;
  end: number;
  /** The fully resolved URL. */
  expanded_url?: string | null;
  images?: UserEntitiesDescriptionUrlsItemImagesList | null;
  media_key?: string | null;
  start: number;
  /** HTTP status from resolving the URL. */
  status?: number | null;
  /** Title of the linked page, when available. */
  title?: string | null;
  /** The final destination after following redirects. */
  unwound_url?: string | null;
  /** The t.co shortened URL. */
  url: string;
}
export const UserEntitiesDescriptionUrlsItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    description: S.optional(S.NullOr(S.String)),
    display_url: S.optional(S.NullOr(S.String)),
    end: S.Number,
    expanded_url: S.optional(S.NullOr(S.String)),
    images: S.optional(S.NullOr(UserEntitiesDescriptionUrlsItemImagesList)),
    media_key: S.optional(S.NullOr(S.String)),
    start: S.Number,
    status: S.optional(S.NullOr(S.Number)),
    title: S.optional(S.NullOr(S.String)),
    unwound_url: S.optional(S.NullOr(S.String)),
    url: S.String,
  }),
).annotate({
  identifier: "UserEntitiesDescriptionUrlsItem",
}) as any as S.Schema<UserEntitiesDescriptionUrlsItem>;

export type UserEntitiesDescriptionUrlsList =
  Array<UserEntitiesDescriptionUrlsItem>;
export const UserEntitiesDescriptionUrlsList = /*@__PURE__*/ S.Array(
  UserEntitiesDescriptionUrlsItem,
) as any as S.Schema<UserEntitiesDescriptionUrlsList>;

/** Entities found in the User's bio. */
export interface UserEntitiesDescription {
  cashtags?: UserEntitiesDescriptionCashtagsList | null;
  hashtags?: UserEntitiesDescriptionHashtagsList | null;
  mentions?: UserEntitiesDescriptionMentionsList | null;
  urls?: UserEntitiesDescriptionUrlsList | null;
}
export const UserEntitiesDescription = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    cashtags: S.optional(S.NullOr(UserEntitiesDescriptionCashtagsList)),
    hashtags: S.optional(S.NullOr(UserEntitiesDescriptionHashtagsList)),
    mentions: S.optional(S.NullOr(UserEntitiesDescriptionMentionsList)),
    urls: S.optional(S.NullOr(UserEntitiesDescriptionUrlsList)),
  }),
).annotate({
  identifier: "UserEntitiesDescription",
}) as any as S.Schema<UserEntitiesDescription>;

/** A preview image for a linked page. */
export type UserEntitiesUrlUrlsItemImagesItem =
  UserEntitiesDescriptionUrlsItemImagesItem;
export const UserEntitiesUrlUrlsItemImagesItem =
  UserEntitiesDescriptionUrlsItemImagesItem;

export type UserEntitiesUrlUrlsItemImagesList =
  Array<UserEntitiesDescriptionUrlsItemImagesItem>;
export const UserEntitiesUrlUrlsItemImagesList = /*@__PURE__*/ S.Array(
  UserEntitiesDescriptionUrlsItemImagesItem,
) as any as S.Schema<UserEntitiesUrlUrlsItemImagesList>;

/** A URL entity found in profile text. */
export interface UserEntitiesUrlUrlsItem {
  /** Description of the linked page, when available. */
  description?: string | null;
  /** The URL as displayed in the Post text. */
  display_url?: string | null;
  end: number;
  /** The fully resolved URL. */
  expanded_url?: string | null;
  images?: UserEntitiesUrlUrlsItemImagesList | null;
  media_key?: string | null;
  start: number;
  /** HTTP status from resolving the URL. */
  status?: number | null;
  /** Title of the linked page, when available. */
  title?: string | null;
  /** The final destination after following redirects. */
  unwound_url?: string | null;
  /** The t.co shortened URL. */
  url: string;
}
export const UserEntitiesUrlUrlsItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    description: S.optional(S.NullOr(S.String)),
    display_url: S.optional(S.NullOr(S.String)),
    end: S.Number,
    expanded_url: S.optional(S.NullOr(S.String)),
    images: S.optional(S.NullOr(UserEntitiesUrlUrlsItemImagesList)),
    media_key: S.optional(S.NullOr(S.String)),
    start: S.Number,
    status: S.optional(S.NullOr(S.Number)),
    title: S.optional(S.NullOr(S.String)),
    unwound_url: S.optional(S.NullOr(S.String)),
    url: S.String,
  }),
).annotate({
  identifier: "UserEntitiesUrlUrlsItem",
}) as any as S.Schema<UserEntitiesUrlUrlsItem>;

export type UserEntitiesUrlUrlsList = Array<UserEntitiesUrlUrlsItem>;
export const UserEntitiesUrlUrlsList = /*@__PURE__*/ S.Array(
  UserEntitiesUrlUrlsItem,
) as any as S.Schema<UserEntitiesUrlUrlsList>;

/** Entities for the User's profile website URL. */
export interface UserEntitiesUrl {
  urls?: UserEntitiesUrlUrlsList | null;
}
export const UserEntitiesUrl = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    urls: S.optional(S.NullOr(UserEntitiesUrlUrlsList)),
  }),
).annotate({
  identifier: "UserEntitiesUrl",
}) as any as S.Schema<UserEntitiesUrl>;

/** A list of metadata found in the User's profile description. */
export interface UserEntities {
  /** Entities found in the User's bio. */
  description?: UserEntitiesDescription | null;
  /** Entities for the User's profile website URL. */
  url?: UserEntitiesUrl | null;
}
export const UserEntities = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    description: S.optional(S.NullOr(UserEntitiesDescription)),
    url: S.optional(S.NullOr(UserEntitiesUrl)),
  }),
).annotate({ identifier: "UserEntities" }) as any as S.Schema<UserEntities>;

/** A list of metrics for this User. */
export interface UserPublicMetrics {
  /** Number of Users who follow this User. */
  followers_count: number;
  /** Number of Users this User follows. */
  following_count: number;
  /** Number of Posts this User has liked. */
  like_count?: number | null;
  /** Number of Lists that include this User. */
  listed_count: number;
  /** Number of media items posted by this User. */
  media_count?: number | null;
  /** Number of Posts (including Reposts) created by this User. */
  post_count: number;
}
export const UserPublicMetrics = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    followers_count: S.Number,
    following_count: S.Number,
    like_count: S.optional(S.NullOr(S.Number)),
    listed_count: S.Number,
    media_count: S.optional(S.NullOr(S.Number)),
    post_count: S.Number,
  }),
).annotate({
  identifier: "UserPublicMetrics",
}) as any as S.Schema<UserPublicMetrics>;

/** The subscription relationship between this User and you. */
export interface UserSubscription {
  /** Indicates if this User subscribes to you. */
  subscribes_to_you: boolean;
}
export const UserSubscription = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    subscribes_to_you: S.Boolean,
  }),
).annotate({
  identifier: "UserSubscription",
}) as any as S.Schema<UserSubscription>;

/** A list of countries (as ISO 3166-1 alpha-2 codes) where this content is withheld. */
export type UserWithheldCountryCodesList = Array<string>;
export const UserWithheldCountryCodesList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<UserWithheldCountryCodesList>;

/** The scope of the withholding. Only present, with the value "user", when the entire User is withheld. */
export type UserWithheldScope = "user";
export const UserWithheldScope = /*@__PURE__*/ S.String;

/** Withholding details for withheld content. */
export interface UserWithheld {
  /** A list of countries (as ISO 3166-1 alpha-2 codes) where this content is withheld. */
  country_codes?: UserWithheldCountryCodesList | null;
  /** The scope of the withholding. Only present, with the value "user", when the entire User is withheld. */
  scope?: UserWithheldScope | null;
}
export const UserWithheld = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    country_codes: S.optional(S.NullOr(UserWithheldCountryCodesList)),
    scope: S.optional(S.NullOr(UserWithheldScope)),
  }),
).annotate({ identifier: "UserWithheld" }) as any as S.Schema<UserWithheld>;

export interface User {
  affiliation?: UserAffiliation;
  confirmed_email?: string;
  connection_status?: UserConnectionStatus;
  /** Creation time of this User. */
  created_at?: string;
  /** The text of this User's profile description (also known as bio), if the User provided one. */
  description?: string;
  entities?: UserEntities;
  /** Unique identifier of this User. */
  id?: string;
  /** Indicates if this User has completed identity verification. */
  is_identity_verified?: boolean;
  /** The location specified in the User's profile, if the User provided one. As this is a freeform value, it may not indicate a valid location. */
  location?: string;
  /** Unique identifier of this User's most recent Post. */
  most_recent_post_id?: string;
  /** The friendly name of this User, as shown on their profile. */
  name?: string;
  /** Indicates if this User is a parody account. */
  parody?: boolean;
  /** Unique identifier of this User's pinned Post. */
  pinned_post_id?: string;
  /** The URL to the profile banner for this User. */
  profile_banner_url?: string;
  /** The URL to the profile image for this User. */
  profile_image_url?: string;
  /** Indicates if this User has chosen to protect their Posts (in other words, if this User's Posts are private). */
  protected?: boolean;
  public_metrics?: UserPublicMetrics;
  /** Indicates if you can send a DM to this User. */
  receives_your_dm?: boolean;
  /** Indicates if this User subscribes to you. */
  subscribes_to_you?: boolean;
  subscription?: UserSubscription;
  /** The X Blue subscription type of the user, e.g.: Basic, Premium, PremiumPlus or None. */
  subscription_type?: string;
  /** The URL specified in the User's profile. */
  url?: string;
  /** The X handle (screen name) of this User. */
  username?: string;
  /** Indicates if this User is a verified X User. */
  verified?: boolean;
  /** The number of verified followers of this User. */
  verified_followers_count?: number;
  /** The X Blue verified type of the user, e.g.: blue, government, business or none. */
  verified_type?: string;
  withheld?: UserWithheld;
}
export const User = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    affiliation: S.optional(UserAffiliation),
    confirmed_email: S.optional(S.String),
    connection_status: S.optional(UserConnectionStatus),
    created_at: S.optional(S.String),
    description: S.optional(S.String),
    entities: S.optional(UserEntities),
    id: S.optional(S.String),
    is_identity_verified: S.optional(S.Boolean),
    location: S.optional(S.String),
    most_recent_post_id: S.optional(S.String),
    name: S.optional(S.String),
    parody: S.optional(S.Boolean),
    pinned_post_id: S.optional(S.String),
    profile_banner_url: S.optional(S.String),
    profile_image_url: S.optional(S.String),
    protected: S.optional(S.Boolean),
    public_metrics: S.optional(UserPublicMetrics),
    receives_your_dm: S.optional(S.Boolean),
    subscribes_to_you: S.optional(S.Boolean),
    subscription: S.optional(UserSubscription),
    subscription_type: S.optional(S.String),
    url: S.optional(S.String),
    username: S.optional(S.String),
    verified: S.optional(S.Boolean),
    verified_followers_count: S.optional(S.Number),
    verified_type: S.optional(S.String),
    withheld: S.optional(UserWithheld),
  }),
).annotate({ identifier: "User" }) as any as S.Schema<User>;

export type GetUsersAffiliatesResponseDataList = Array<User>;
export const GetUsersAffiliatesResponseDataList = /*@__PURE__*/ S.Array(
  User,
) as any as S.Schema<GetUsersAffiliatesResponseDataList>;

export type GetUsersAffiliatesResponseErrorsList = Array<Problem>;
export const GetUsersAffiliatesResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersAffiliatesResponseErrorsList>;

/** Nonpublic engagement metrics for the media at the time of the request. */
export interface MediaNonPublicMetrics {
  /** Number of users who started playback (0% quartile) of this video. */
  playback_0_count?: number | null;
  /** Number of users who completed playback (100% quartile) of this video. */
  playback_100_count?: number | null;
  /** Number of users who watched at least 25% of this video. */
  playback_25_count?: number | null;
  /** Number of users who watched at least 50% of this video. */
  playback_50_count?: number | null;
  /** Number of users who watched at least 75% of this video. */
  playback_75_count?: number | null;
}
export const MediaNonPublicMetrics = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    playback_0_count: S.optional(S.NullOr(S.Number)),
    playback_100_count: S.optional(S.NullOr(S.Number)),
    playback_25_count: S.optional(S.NullOr(S.Number)),
    playback_50_count: S.optional(S.NullOr(S.Number)),
    playback_75_count: S.optional(S.NullOr(S.Number)),
  }),
).annotate({
  identifier: "MediaNonPublicMetrics",
}) as any as S.Schema<MediaNonPublicMetrics>;

/** Organic nonpublic engagement metrics for the media at the time of the request. */
export interface MediaOrganicMetrics {
  /** Number of users who started playback (0% quartile) of this video. */
  playback_0_count?: number | null;
  /** Number of users who completed playback (100% quartile) of this video. */
  playback_100_count?: number | null;
  /** Number of users who watched at least 25% of this video. */
  playback_25_count?: number | null;
  /** Number of users who watched at least 50% of this video. */
  playback_50_count?: number | null;
  /** Number of users who watched at least 75% of this video. */
  playback_75_count?: number | null;
  /** The number of organic views of this video. Null when the backend returns quartile data without a view count. */
  view_count?: number | null;
}
export const MediaOrganicMetrics = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    playback_0_count: S.optional(S.NullOr(S.Number)),
    playback_100_count: S.optional(S.NullOr(S.Number)),
    playback_25_count: S.optional(S.NullOr(S.Number)),
    playback_50_count: S.optional(S.NullOr(S.Number)),
    playback_75_count: S.optional(S.NullOr(S.Number)),
    view_count: S.optional(S.NullOr(S.Number)),
  }),
).annotate({
  identifier: "MediaOrganicMetrics",
}) as any as S.Schema<MediaOrganicMetrics>;

/** Promoted nonpublic engagement metrics for the media at the time of the request. */
export interface MediaPromotedMetrics {
  /** Number of users who started playback (0% quartile) of this video. */
  playback_0_count?: number | null;
  /** Number of users who completed playback (100% quartile) of this video. */
  playback_100_count?: number | null;
  /** Number of users who watched at least 25% of this video. */
  playback_25_count?: number | null;
  /** Number of users who watched at least 50% of this video. */
  playback_50_count?: number | null;
  /** Number of users who watched at least 75% of this video. */
  playback_75_count?: number | null;
  /** The number of promoted views of this video. Null when the backend returns quartile data without a view count. */
  view_count?: number | null;
}
export const MediaPromotedMetrics = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    playback_0_count: S.optional(S.NullOr(S.Number)),
    playback_100_count: S.optional(S.NullOr(S.Number)),
    playback_25_count: S.optional(S.NullOr(S.Number)),
    playback_50_count: S.optional(S.NullOr(S.Number)),
    playback_75_count: S.optional(S.NullOr(S.Number)),
    view_count: S.optional(S.NullOr(S.Number)),
  }),
).annotate({
  identifier: "MediaPromotedMetrics",
}) as any as S.Schema<MediaPromotedMetrics>;

/** Public engagement metrics for the media at the time of the request. */
export interface MediaPublicMetrics {
  /** The number of times this video has been viewed. */
  view_count: number;
}
export const MediaPublicMetrics = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    view_count: S.Number,
  }),
).annotate({
  identifier: "MediaPublicMetrics",
}) as any as S.Schema<MediaPublicMetrics>;

/** A single playback or display variant of a media object. */
export interface MediaVariantsItem {
  /** The bit rate of this variant, in bits per second. Absent for playlist variants. */
  bit_rate?: number | null;
  /** The MIME type of this variant, for example "video/mp4" or "application/x-mpegURL". */
  content_type?: string | null;
  /** The URL to this media variant. */
  url?: string | null;
}
export const MediaVariantsItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    bit_rate: S.optional(S.NullOr(S.Number)),
    content_type: S.optional(S.NullOr(S.String)),
    url: S.optional(S.NullOr(S.String)),
  }),
).annotate({
  identifier: "MediaVariantsItem",
}) as any as S.Schema<MediaVariantsItem>;

/** Each media object may have multiple display or playback variants, with different resolutions or formats. */
export type MediaVariants = Array<MediaVariantsItem>;
export const MediaVariants = /*@__PURE__*/ S.Array(
  MediaVariantsItem,
) as any as S.Schema<MediaVariants>;

export interface Media {
  alt_text?: string;
  duration_ms?: number;
  height?: number;
  media_key?: string;
  non_public_metrics?: MediaNonPublicMetrics;
  organic_metrics?: MediaOrganicMetrics;
  preview_image_url?: string;
  promoted_metrics?: MediaPromotedMetrics;
  public_metrics?: MediaPublicMetrics;
  type?: string;
  url?: string;
  variants?: MediaVariants;
  width?: number;
}
export const Media = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    alt_text: S.optional(S.String),
    duration_ms: S.optional(S.Number),
    height: S.optional(S.Number),
    media_key: S.optional(S.String),
    non_public_metrics: S.optional(MediaNonPublicMetrics),
    organic_metrics: S.optional(MediaOrganicMetrics),
    preview_image_url: S.optional(S.String),
    promoted_metrics: S.optional(MediaPromotedMetrics),
    public_metrics: S.optional(MediaPublicMetrics),
    type: S.optional(S.String),
    url: S.optional(S.String),
    variants: S.optional(MediaVariants),
    width: S.optional(S.Number),
  }),
).annotate({ identifier: "Media" }) as any as S.Schema<Media>;

export type ExpansionsMediaList = Array<Media>;
export const ExpansionsMediaList = /*@__PURE__*/ S.Array(
  Media,
) as any as S.Schema<ExpansionsMediaList>;

/** A list of unique identifiers of the Places that contain this place. */
export type PlaceContainedWithin = Array<string>;
export const PlaceContainedWithin = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<PlaceContainedWithin>;

/** The bounding box as [southwest_longitude, southwest_latitude, northeast_longitude, northeast_latitude]. */
export type PlaceGeoBboxList = Array<number>;
export const PlaceGeoBboxList = /*@__PURE__*/ S.Array(
  S.Number,
) as any as S.Schema<PlaceGeoBboxList>;

export type PlaceGeoType = "Feature";
export const PlaceGeoType = /*@__PURE__*/ S.String;

/** The geographic location of this place, expressed as a GeoJSON Feature. */
export interface PlaceGeo {
  /** The bounding box as [southwest_longitude, southwest_latitude, northeast_longitude, northeast_latitude]. */
  bbox: PlaceGeoBboxList;
  /** Additional GeoJSON feature properties. */
  properties: unknown;
  /** The GeoJSON feature type. */
  type: PlaceGeoType;
}
export const PlaceGeo = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    bbox: PlaceGeoBboxList,
    properties: S.Unknown,
    type: PlaceGeoType,
  }),
).annotate({ identifier: "PlaceGeo" }) as any as S.Schema<PlaceGeo>;

export interface Place {
  contained_within?: PlaceContainedWithin;
  country?: string;
  country_code?: string;
  full_name?: string;
  geo?: PlaceGeo;
  id?: string;
  name?: string;
  place_type?: string;
}
export const Place = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    contained_within: S.optional(PlaceContainedWithin),
    country: S.optional(S.String),
    country_code: S.optional(S.String),
    full_name: S.optional(S.String),
    geo: S.optional(PlaceGeo),
    id: S.optional(S.String),
    name: S.optional(S.String),
    place_type: S.optional(S.String),
  }),
).annotate({ identifier: "Place" }) as any as S.Schema<Place>;

export type ExpansionsPlacesList = Array<Place>;
export const ExpansionsPlacesList = /*@__PURE__*/ S.Array(
  Place,
) as any as S.Schema<ExpansionsPlacesList>;

/** A single option (choice) available in a poll. */
export interface PollOptionsItem {
  /** The text label of this poll option. */
  label: string;
  /** The 1-based position of this option within the poll. */
  position: number;
  /** The number of votes this option has received. */
  votes: number;
}
export const PollOptionsItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    label: S.String,
    position: S.Number,
    votes: S.Number,
  }),
).annotate({
  identifier: "PollOptionsItem",
}) as any as S.Schema<PollOptionsItem>;

/** The list of options (choices) available in this poll. */
export type PollOptions = Array<PollOptionsItem>;
export const PollOptions = /*@__PURE__*/ S.Array(
  PollOptionsItem,
) as any as S.Schema<PollOptions>;

export interface Poll {
  duration_minutes?: number;
  end_datetime?: string;
  id?: string;
  options?: PollOptions;
  voting_status?: string;
}
export const Poll = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    duration_minutes: S.optional(S.Number),
    end_datetime: S.optional(S.String),
    id: S.optional(S.String),
    options: S.optional(PollOptions),
    voting_status: S.optional(S.String),
  }),
).annotate({ identifier: "Poll" }) as any as S.Schema<Poll>;

export type ExpansionsPollsList = Array<Poll>;
export const ExpansionsPollsList = /*@__PURE__*/ S.Array(
  Poll,
) as any as S.Schema<ExpansionsPollsList>;

/** Media keys of media attached to this Post. */
export type PostAttachmentsMediaKeysList = Array<string>;
export const PostAttachmentsMediaKeysList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<PostAttachmentsMediaKeysList>;

/** IDs of the source Posts the attached media originated from. */
export type PostAttachmentsMediaSourceTweetIdList = Array<string>;
export const PostAttachmentsMediaSourceTweetIdList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<PostAttachmentsMediaSourceTweetIdList>;

/** IDs of polls attached to this Post. */
export type PostAttachmentsPollIdsList = Array<string>;
export const PostAttachmentsPollIdsList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<PostAttachmentsPollIdsList>;

/** Specifies the type of attachments (if any) present in this Post. */
export interface PostAttachments {
  /** Media keys of media attached to this Post. */
  media_keys?: PostAttachmentsMediaKeysList | null;
  /** IDs of the source Posts the attached media originated from. */
  media_source_tweet_id?: PostAttachmentsMediaSourceTweetIdList | null;
  /** IDs of polls attached to this Post. */
  poll_ids?: PostAttachmentsPollIdsList | null;
}
export const PostAttachments = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    media_keys: S.optional(S.NullOr(PostAttachmentsMediaKeysList)),
    media_source_tweet_id: S.optional(
      S.NullOr(PostAttachmentsMediaSourceTweetIdList),
    ),
    poll_ids: S.optional(S.NullOr(PostAttachmentsPollIdsList)),
  }),
).annotate({
  identifier: "PostAttachments",
}) as any as S.Schema<PostAttachments>;

/** A domain or entity referenced by a context annotation. */
export interface PostContextAnnotationsItemDomain {
  description?: string | null;
  id?: string | null;
  name?: string | null;
}
export const PostContextAnnotationsItemDomain = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    description: S.optional(S.NullOr(S.String)),
    id: S.optional(S.NullOr(S.String)),
    name: S.optional(S.NullOr(S.String)),
  }),
).annotate({
  identifier: "PostContextAnnotationsItemDomain",
}) as any as S.Schema<PostContextAnnotationsItemDomain>;

/** A domain or entity referenced by a context annotation. */
export type PostContextAnnotationsItemEntity = PostContextAnnotationsItemDomain;
export const PostContextAnnotationsItemEntity =
  PostContextAnnotationsItemDomain;

/** A single inferred annotation about the Post (domain and entity context). */
export interface PostContextAnnotationsItem {
  /** The domain (broad category) this annotation belongs to. */
  domain: PostContextAnnotationsItemDomain;
  /** The specific entity recognized within the domain. */
  entity: PostContextAnnotationsItemDomain;
}
export const PostContextAnnotationsItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    domain: PostContextAnnotationsItemDomain,
    entity: PostContextAnnotationsItemDomain,
  }),
).annotate({
  identifier: "PostContextAnnotationsItem",
}) as any as S.Schema<PostContextAnnotationsItem>;

/** Annotations inferred about the Post (domain and entity context). */
export type PostContextAnnotations = Array<PostContextAnnotationsItem>;
export const PostContextAnnotations = /*@__PURE__*/ S.Array(
  PostContextAnnotationsItem,
) as any as S.Schema<PostContextAnnotations>;

/** The inclusive start and exclusive end indices of the displayable content of the Post. */
export type PostDisplayTextRange = Array<number>;
export const PostDisplayTextRange = /*@__PURE__*/ S.Array(
  S.Number,
) as any as S.Schema<PostDisplayTextRange>;

/** Indicates how much longer (if at all) this Post can be edited. */
export interface PostEditControls {
  /** The time until which this Post can be edited. */
  editable_until?: string | null;
  /** Number of edits still allowed for this Post. */
  edits_remaining?: number | null;
  /** Indicates whether this Post is eligible to be edited. */
  is_edit_eligible?: boolean | null;
}
export const PostEditControls = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    editable_until: S.optional(S.NullOr(S.String)),
    edits_remaining: S.optional(S.NullOr(S.Number)),
    is_edit_eligible: S.optional(S.NullOr(S.Boolean)),
  }),
).annotate({
  identifier: "PostEditControls",
}) as any as S.Schema<PostEditControls>;

/** A list of Post IDs in this Post's edit history chain. */
export type PostEditHistoryPostIdsList = Array<string>;
export const PostEditHistoryPostIdsList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<PostEditHistoryPostIdsList>;

/** A hashtag or cashtag entity. */
export type PostEntitiesCashtagsItem = UserEntitiesDescriptionCashtagsItem;
export const PostEntitiesCashtagsItem = UserEntitiesDescriptionCashtagsItem;

export type PostEntitiesCashtagsList =
  Array<UserEntitiesDescriptionCashtagsItem>;
export const PostEntitiesCashtagsList = /*@__PURE__*/ S.Array(
  UserEntitiesDescriptionCashtagsItem,
) as any as S.Schema<PostEntitiesCashtagsList>;

/** A hashtag or cashtag entity. */
export type PostEntitiesHashtagsItem = UserEntitiesDescriptionCashtagsItem;
export const PostEntitiesHashtagsItem = UserEntitiesDescriptionCashtagsItem;

export type PostEntitiesHashtagsList =
  Array<UserEntitiesDescriptionCashtagsItem>;
export const PostEntitiesHashtagsList = /*@__PURE__*/ S.Array(
  UserEntitiesDescriptionCashtagsItem,
) as any as S.Schema<PostEntitiesHashtagsList>;

/** A user mention entity. */
export interface PostEntitiesMentionsItem {
  end: number;
  id?: string | null;
  start: number;
  username?: string | null;
}
export const PostEntitiesMentionsItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    end: S.Number,
    id: S.optional(S.NullOr(S.String)),
    start: S.Number,
    username: S.optional(S.NullOr(S.String)),
  }),
).annotate({
  identifier: "PostEntitiesMentionsItem",
}) as any as S.Schema<PostEntitiesMentionsItem>;

export type PostEntitiesMentionsList = Array<PostEntitiesMentionsItem>;
export const PostEntitiesMentionsList = /*@__PURE__*/ S.Array(
  PostEntitiesMentionsItem,
) as any as S.Schema<PostEntitiesMentionsList>;

/** A preview image for a linked page. */
export type PostEntitiesUrlsItemImagesItem =
  UserEntitiesDescriptionUrlsItemImagesItem;
export const PostEntitiesUrlsItemImagesItem =
  UserEntitiesDescriptionUrlsItemImagesItem;

export type PostEntitiesUrlsItemImagesList =
  Array<UserEntitiesDescriptionUrlsItemImagesItem>;
export const PostEntitiesUrlsItemImagesList = /*@__PURE__*/ S.Array(
  UserEntitiesDescriptionUrlsItemImagesItem,
) as any as S.Schema<PostEntitiesUrlsItemImagesList>;

/** A URL entity found in the Post text, enriched with link metadata. */
export interface PostEntitiesUrlsItem {
  /** Description of the linked page, when available. */
  description?: string | null;
  /** The URL as displayed in the Post text. */
  display_url?: string | null;
  end: number;
  /** The fully resolved URL. */
  expanded_url?: string | null;
  images?: PostEntitiesUrlsItemImagesList | null;
  media_key?: string | null;
  start: number;
  /** HTTP status from resolving the URL. */
  status?: number | null;
  /** Title of the linked page, when available. */
  title?: string | null;
  /** The final destination after following redirects. */
  unwound_url?: string | null;
  /** The t.co shortened URL. */
  url?: string | null;
}
export const PostEntitiesUrlsItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    description: S.optional(S.NullOr(S.String)),
    display_url: S.optional(S.NullOr(S.String)),
    end: S.Number,
    expanded_url: S.optional(S.NullOr(S.String)),
    images: S.optional(S.NullOr(PostEntitiesUrlsItemImagesList)),
    media_key: S.optional(S.NullOr(S.String)),
    start: S.Number,
    status: S.optional(S.NullOr(S.Number)),
    title: S.optional(S.NullOr(S.String)),
    unwound_url: S.optional(S.NullOr(S.String)),
    url: S.optional(S.NullOr(S.String)),
  }),
).annotate({
  identifier: "PostEntitiesUrlsItem",
}) as any as S.Schema<PostEntitiesUrlsItem>;

export type PostEntitiesUrlsList = Array<PostEntitiesUrlsItem>;
export const PostEntitiesUrlsList = /*@__PURE__*/ S.Array(
  PostEntitiesUrlsItem,
) as any as S.Schema<PostEntitiesUrlsList>;

/** A list of metadata entities (hashtags, mentions, URLs) found in the Post text. */
export interface PostEntities {
  cashtags?: PostEntitiesCashtagsList | null;
  hashtags?: PostEntitiesHashtagsList | null;
  mentions?: PostEntitiesMentionsList | null;
  urls?: PostEntitiesUrlsList | null;
}
export const PostEntities = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    cashtags: S.optional(S.NullOr(PostEntitiesCashtagsList)),
    hashtags: S.optional(S.NullOr(PostEntitiesHashtagsList)),
    mentions: S.optional(S.NullOr(PostEntitiesMentionsList)),
    urls: S.optional(S.NullOr(PostEntitiesUrlsList)),
  }),
).annotate({ identifier: "PostEntities" }) as any as S.Schema<PostEntities>;

/** [longitude, latitude]. */
export type PostGeoCoordinatesCoordinatesList = Array<number>;
export const PostGeoCoordinatesCoordinatesList = /*@__PURE__*/ S.Array(
  S.Number,
) as any as S.Schema<PostGeoCoordinatesCoordinatesList>;

/** The GeoJSON geometry type. */
export type PostGeoCoordinatesType = "Point";
export const PostGeoCoordinatesType = /*@__PURE__*/ S.String;

/** A GeoJSON Point geometry. */
export interface PostGeoCoordinates {
  /** [longitude, latitude]. */
  coordinates: PostGeoCoordinatesCoordinatesList;
  /** The GeoJSON geometry type. */
  type: PostGeoCoordinatesType;
}
export const PostGeoCoordinates = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    coordinates: PostGeoCoordinatesCoordinatesList,
    type: PostGeoCoordinatesType,
  }),
).annotate({
  identifier: "PostGeoCoordinates",
}) as any as S.Schema<PostGeoCoordinates>;

/** The location tagged on the Post, if the user provided one. */
export interface PostGeo {
  /** A GeoJSON Point geometry. */
  coordinates?: PostGeoCoordinates | null;
  /** The unique identifier of the tagged place. */
  place_id?: string | null;
}
export const PostGeo = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    coordinates: S.optional(S.NullOr(PostGeoCoordinates)),
    place_id: S.optional(S.NullOr(S.String)),
  }),
).annotate({ identifier: "PostGeo" }) as any as S.Schema<PostGeo>;

/** A Community-Notes media match for this Post. */
export interface PostMatchedMediaNotesItem {
  /** The status of the media note match. */
  match_status?: string | null;
  /** The matched note's unique identifier. */
  note_id?: string | null;
}
export const PostMatchedMediaNotesItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    match_status: S.optional(S.NullOr(S.String)),
    note_id: S.optional(S.NullOr(S.String)),
  }),
).annotate({
  identifier: "PostMatchedMediaNotesItem",
}) as any as S.Schema<PostMatchedMediaNotesItem>;

/** Community-Notes media matches for this Post. */
export type PostMatchedMediaNotes = Array<PostMatchedMediaNotesItem>;
export const PostMatchedMediaNotes = /*@__PURE__*/ S.Array(
  PostMatchedMediaNotesItem,
) as any as S.Schema<PostMatchedMediaNotes>;

/** Metadata for one media item attached to this Post. */
export interface PostMediaMetadataItem {
  /** Alternative text describing the media for accessibility. */
  alt_text?: string | null;
  /** Description of the media. */
  description?: string | null;
  /** The unique identifier of the media. */
  media_key?: string | null;
  /** Title of the media. */
  title?: string | null;
}
export const PostMediaMetadataItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    alt_text: S.optional(S.NullOr(S.String)),
    description: S.optional(S.NullOr(S.String)),
    media_key: S.optional(S.NullOr(S.String)),
    title: S.optional(S.NullOr(S.String)),
  }),
).annotate({
  identifier: "PostMediaMetadataItem",
}) as any as S.Schema<PostMediaMetadataItem>;

/** Metadata for media attached to this Post. */
export type PostMediaMetadata = Array<PostMediaMetadataItem>;
export const PostMediaMetadata = /*@__PURE__*/ S.Array(
  PostMediaMetadataItem,
) as any as S.Schema<PostMediaMetadata>;

/** A hashtag or cashtag entity. */
export type PostNotePostEntitiesCashtagsItem =
  UserEntitiesDescriptionCashtagsItem;
export const PostNotePostEntitiesCashtagsItem =
  UserEntitiesDescriptionCashtagsItem;

export type PostNotePostEntitiesCashtagsList =
  Array<UserEntitiesDescriptionCashtagsItem>;
export const PostNotePostEntitiesCashtagsList = /*@__PURE__*/ S.Array(
  UserEntitiesDescriptionCashtagsItem,
) as any as S.Schema<PostNotePostEntitiesCashtagsList>;

/** A hashtag or cashtag entity. */
export type PostNotePostEntitiesHashtagsItem =
  UserEntitiesDescriptionCashtagsItem;
export const PostNotePostEntitiesHashtagsItem =
  UserEntitiesDescriptionCashtagsItem;

export type PostNotePostEntitiesHashtagsList =
  Array<UserEntitiesDescriptionCashtagsItem>;
export const PostNotePostEntitiesHashtagsList = /*@__PURE__*/ S.Array(
  UserEntitiesDescriptionCashtagsItem,
) as any as S.Schema<PostNotePostEntitiesHashtagsList>;

/** A user mention entity. */
export type PostNotePostEntitiesMentionsItem = PostEntitiesMentionsItem;
export const PostNotePostEntitiesMentionsItem = PostEntitiesMentionsItem;

export type PostNotePostEntitiesMentionsList = Array<PostEntitiesMentionsItem>;
export const PostNotePostEntitiesMentionsList = /*@__PURE__*/ S.Array(
  PostEntitiesMentionsItem,
) as any as S.Schema<PostNotePostEntitiesMentionsList>;

/** A URL entity found in note Post text. */
export interface PostNotePostEntitiesUrlsItem {
  display_url?: string | null;
  end: number;
  expanded_url?: string | null;
  start: number;
  url?: string | null;
}
export const PostNotePostEntitiesUrlsItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    display_url: S.optional(S.NullOr(S.String)),
    end: S.Number,
    expanded_url: S.optional(S.NullOr(S.String)),
    start: S.Number,
    url: S.optional(S.NullOr(S.String)),
  }),
).annotate({
  identifier: "PostNotePostEntitiesUrlsItem",
}) as any as S.Schema<PostNotePostEntitiesUrlsItem>;

export type PostNotePostEntitiesUrlsList = Array<PostNotePostEntitiesUrlsItem>;
export const PostNotePostEntitiesUrlsList = /*@__PURE__*/ S.Array(
  PostNotePostEntitiesUrlsItem,
) as any as S.Schema<PostNotePostEntitiesUrlsList>;

/** Metadata entities (hashtags, cashtags, mentions, URLs) found in the note Post text. */
export interface PostNotePostEntities {
  cashtags?: PostNotePostEntitiesCashtagsList | null;
  hashtags?: PostNotePostEntitiesHashtagsList | null;
  mentions?: PostNotePostEntitiesMentionsList | null;
  urls?: PostNotePostEntitiesUrlsList | null;
}
export const PostNotePostEntities = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    cashtags: S.optional(S.NullOr(PostNotePostEntitiesCashtagsList)),
    hashtags: S.optional(S.NullOr(PostNotePostEntitiesHashtagsList)),
    mentions: S.optional(S.NullOr(PostNotePostEntitiesMentionsList)),
    urls: S.optional(S.NullOr(PostNotePostEntitiesUrlsList)),
  }),
).annotate({
  identifier: "PostNotePostEntities",
}) as any as S.Schema<PostNotePostEntities>;

/** The full content of the Post, including text beyond 280 characters. */
export interface PostNotePost {
  /** Metadata entities (hashtags, cashtags, mentions, URLs) found in the note Post text. */
  entities?: PostNotePostEntities | null;
  /** The full note text of the Post. */
  text: string;
}
export const PostNotePost = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    entities: S.optional(S.NullOr(PostNotePostEntities)),
    text: S.String,
  }),
).annotate({ identifier: "PostNotePost" }) as any as S.Schema<PostNotePost>;

/** A Community-Notes request suggestion for this Post. */
export interface PostNoteRequestSuggestionsItem {
  /** A suggested source link supporting the note request. */
  source_link?: string | null;
  /** The text of the note request suggestion. */
  suggestion?: string | null;
  /** The unique identifier of the note request suggestion. */
  suggestion_id?: string | null;
}
export const PostNoteRequestSuggestionsItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    source_link: S.optional(S.NullOr(S.String)),
    suggestion: S.optional(S.NullOr(S.String)),
    suggestion_id: S.optional(S.NullOr(S.String)),
  }),
).annotate({
  identifier: "PostNoteRequestSuggestionsItem",
}) as any as S.Schema<PostNoteRequestSuggestionsItem>;

/** Community-Notes request suggestions for this Post. */
export type PostNoteRequestSuggestions = Array<PostNoteRequestSuggestionsItem>;
export const PostNoteRequestSuggestions = /*@__PURE__*/ S.Array(
  PostNoteRequestSuggestionsItem,
) as any as S.Schema<PostNoteRequestSuggestions>;

/** Engagement metrics for the Post at the time of the request. */
export interface PostPublicMetrics {
  /** Number of times this Post has been bookmarked. */
  bookmark_count: number;
  /** Number of times this Post has been viewed. */
  impression_count: number;
  /** Number of likes on this Post. */
  like_count: number;
  /** Number of quote Posts of this Post. */
  quote_count: number;
  /** Number of replies to this Post. */
  reply_count: number;
  /** Number of times this Post has been reposted. */
  repost_count: number;
}
export const PostPublicMetrics = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    bookmark_count: S.Number,
    impression_count: S.Number,
    like_count: S.Number,
    quote_count: S.Number,
    reply_count: S.Number,
    repost_count: S.Number,
  }),
).annotate({
  identifier: "PostPublicMetrics",
}) as any as S.Schema<PostPublicMetrics>;

/** The kind of Post-to-Post reference. */
export type PostReferencedPostsItemType = "retweeted" | "quoted" | "replied_to";
export const PostReferencedPostsItemType = /*@__PURE__*/ S.String;

/** A reference from this Post to another Post (repost, quote, or reply). */
export interface PostReferencedPostsItem {
  /** Unique identifier of the referenced Post. */
  id: string;
  /** How this Post references the other Post. */
  type: PostReferencedPostsItemType;
}
export const PostReferencedPostsItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String,
    type: PostReferencedPostsItemType,
  }),
).annotate({
  identifier: "PostReferencedPostsItem",
}) as any as S.Schema<PostReferencedPostsItem>;

/** A list of Posts this Post refers to. If the Post is a Retweet, Quote or Reply, it includes the referenced Post's type and ID. */
export type PostReferencedPosts = Array<PostReferencedPostsItem>;
export const PostReferencedPosts = /*@__PURE__*/ S.Array(
  PostReferencedPostsItem,
) as any as S.Schema<PostReferencedPosts>;

/** The scopes for this Post. */
export interface PostScopes {
  /** Indicates whether visibility of this Post is limited to the author's followers. */
  followers: boolean;
}
export const PostScopes = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    followers: S.Boolean,
  }),
).annotate({ identifier: "PostScopes" }) as any as S.Schema<PostScopes>;

/** URLs suggested as sources for this Post. */
export type PostSuggestedSourceLinks = Array<string>;
export const PostSuggestedSourceLinks = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<PostSuggestedSourceLinks>;

/** A suggested source URL for this Post with the number of times it was suggested. */
export interface PostSuggestedSourceLinksWithCountsItem {
  /** Number of times this source link was suggested. */
  count?: number | null;
  /** The suggested source URL. */
  url?: string | null;
}
export const PostSuggestedSourceLinksWithCountsItem = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      count: S.optional(S.NullOr(S.Number)),
      url: S.optional(S.NullOr(S.String)),
    }),
).annotate({
  identifier: "PostSuggestedSourceLinksWithCountsItem",
}) as any as S.Schema<PostSuggestedSourceLinksWithCountsItem>;

/** Suggested source URLs for this Post, each with the number of times it was suggested. */
export type PostSuggestedSourceLinksWithCounts =
  Array<PostSuggestedSourceLinksWithCountsItem>;
export const PostSuggestedSourceLinksWithCounts = /*@__PURE__*/ S.Array(
  PostSuggestedSourceLinksWithCountsItem,
) as any as S.Schema<PostSuggestedSourceLinksWithCounts>;

/** Uppercase ISO 3166-1 alpha-2 country codes where this content is withheld. */
export type PostWithheldCountryCodesList = Array<string>;
export const PostWithheldCountryCodesList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<PostWithheldCountryCodesList>;

/** Whether the withholding applies to a Post or a User. */
export type PostWithheldScope = "post" | "user";
export const PostWithheldScope = /*@__PURE__*/ S.String;

/** Withholding details for withheld content. */
export interface PostWithheld {
  /** Indicates whether this content is withheld due to a copyright claim. */
  copyright: boolean;
  /** Uppercase ISO 3166-1 alpha-2 country codes where this content is withheld. */
  country_codes: PostWithheldCountryCodesList;
  /** Whether the withholding applies to a Post or a User. */
  scope?: PostWithheldScope | null;
}
export const PostWithheld = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    copyright: S.Boolean,
    country_codes: PostWithheldCountryCodesList,
    scope: S.optional(S.NullOr(PostWithheldScope)),
  }),
).annotate({ identifier: "PostWithheld" }) as any as S.Schema<PostWithheld>;

export interface Post {
  article?: unknown;
  /** Metadata about the long-form Article attached to this Post, if any. */
  article_title?: unknown;
  attachments?: PostAttachments;
  /** Unique identifier of the author of this Post. */
  author_id?: string;
  card_uri?: string;
  /** The unique identifier of the Community this Post belongs to, if any. */
  community_id?: string;
  context_annotations?: PostContextAnnotations;
  /** The ID of the conversation this Post belongs to (matches the root Post's ID). */
  conversation_id?: string;
  /** Creation time of the Post. */
  created_at?: string;
  display_text_range?: PostDisplayTextRange;
  edit_controls?: PostEditControls;
  /** A list of Post IDs in this Post's edit history chain. */
  edit_history_post_ids?: PostEditHistoryPostIdsList;
  entities?: PostEntities;
  geo?: PostGeo;
  /** Unique identifier of this Post. */
  id?: string;
  /** Unique identifier of the User this Post is replying to. */
  in_reply_to_user_id?: string;
  /** Language of the Post, if detected by X. Returned as a BCP47 language tag. */
  lang?: string;
  matched_media_notes?: PostMatchedMediaNotes;
  media_metadata?: PostMediaMetadata;
  /** Nonpublic engagement metrics for the Post at the time of the request. */
  non_public_metrics?: unknown;
  note_post?: PostNotePost;
  note_request_suggestions?: PostNoteRequestSuggestions;
  /** Organic nonpublic engagement metrics for the Post at the time of the request. */
  organic_metrics?: unknown;
  /** Indicates if this Post is a paid partnership, i.e. it has been disclosed by the author as containing paid promotion. */
  paid_partnership?: boolean;
  /** Indicates if this Post contains URLs marked as sensitive, for example content suitable for mature audiences. */
  possibly_sensitive?: boolean;
  /** Promoted nonpublic engagement metrics for the Post at the time of the request. */
  promoted_metrics?: unknown;
  public_metrics?: PostPublicMetrics;
  referenced_posts?: PostReferencedPosts;
  /** Shows who can reply to this Post. */
  reply_settings?: string;
  scopes?: PostScopes;
  /** The name of the app the user posted from. This is deprecated. */
  source?: string;
  suggested_source_links?: PostSuggestedSourceLinks;
  suggested_source_links_with_counts?: PostSuggestedSourceLinksWithCounts;
  /** The content of the Post. */
  text?: string;
  username?: string;
  withheld?: PostWithheld;
}
export const Post = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    article: S.optional(S.Unknown),
    article_title: S.optional(S.Unknown),
    attachments: S.optional(PostAttachments),
    author_id: S.optional(S.String),
    card_uri: S.optional(S.String),
    community_id: S.optional(S.String),
    context_annotations: S.optional(PostContextAnnotations),
    conversation_id: S.optional(S.String),
    created_at: S.optional(S.String),
    display_text_range: S.optional(PostDisplayTextRange),
    edit_controls: S.optional(PostEditControls),
    edit_history_post_ids: S.optional(PostEditHistoryPostIdsList),
    entities: S.optional(PostEntities),
    geo: S.optional(PostGeo),
    id: S.optional(S.String),
    in_reply_to_user_id: S.optional(S.String),
    lang: S.optional(S.String),
    matched_media_notes: S.optional(PostMatchedMediaNotes),
    media_metadata: S.optional(PostMediaMetadata),
    non_public_metrics: S.optional(S.Unknown),
    note_post: S.optional(PostNotePost),
    note_request_suggestions: S.optional(PostNoteRequestSuggestions),
    organic_metrics: S.optional(S.Unknown),
    paid_partnership: S.optional(S.Boolean),
    possibly_sensitive: S.optional(S.Boolean),
    promoted_metrics: S.optional(S.Unknown),
    public_metrics: S.optional(PostPublicMetrics),
    referenced_posts: S.optional(PostReferencedPosts),
    reply_settings: S.optional(S.String),
    scopes: S.optional(PostScopes),
    source: S.optional(S.String),
    suggested_source_links: S.optional(PostSuggestedSourceLinks),
    suggested_source_links_with_counts: S.optional(
      PostSuggestedSourceLinksWithCounts,
    ),
    text: S.optional(S.String),
    username: S.optional(S.String),
    withheld: S.optional(PostWithheld),
  }),
).annotate({ identifier: "Post" }) as any as S.Schema<Post>;

export type ExpansionsPostsList = Array<Post>;
export const ExpansionsPostsList = /*@__PURE__*/ S.Array(
  Post,
) as any as S.Schema<ExpansionsPostsList>;

export interface Topic {
  description?: string;
  id?: string;
  name?: string;
}
export const Topic = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    description: S.optional(S.String),
    id: S.optional(S.String),
    name: S.optional(S.String),
  }),
).annotate({ identifier: "Topic" }) as any as S.Schema<Topic>;

export type ExpansionsTopicsList = Array<Topic>;
export const ExpansionsTopicsList = /*@__PURE__*/ S.Array(
  Topic,
) as any as S.Schema<ExpansionsTopicsList>;

export type ExpansionsUsersList = Array<User>;
export const ExpansionsUsersList = /*@__PURE__*/ S.Array(
  User,
) as any as S.Schema<ExpansionsUsersList>;

export interface Expansions {
  media?: ExpansionsMediaList;
  places?: ExpansionsPlacesList;
  polls?: ExpansionsPollsList;
  posts?: ExpansionsPostsList;
  topics?: ExpansionsTopicsList;
  users?: ExpansionsUsersList;
}
export const Expansions = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    media: S.optional(ExpansionsMediaList),
    places: S.optional(ExpansionsPlacesList),
    polls: S.optional(ExpansionsPollsList),
    posts: S.optional(ExpansionsPostsList),
    topics: S.optional(ExpansionsTopicsList),
    users: S.optional(ExpansionsUsersList),
  }),
).annotate({ identifier: "Expansions" }) as any as S.Schema<Expansions>;

export interface GetUsersAffiliatesResponseMeta {
  /** Pagination token for the next page of results. */
  next_token?: string;
  /** Pagination token for the previous page of results. */
  previous_token?: string;
  /** Number of items in the data array. */
  result_count?: number;
}
export const GetUsersAffiliatesResponseMeta = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    next_token: S.optional(S.String),
    previous_token: S.optional(S.String),
    result_count: S.optional(S.Number),
  }),
).annotate({
  identifier: "GetUsersAffiliatesResponseMeta",
}) as any as S.Schema<GetUsersAffiliatesResponseMeta>;

export interface GetUsersAffiliatesResponse {
  data?: GetUsersAffiliatesResponseDataList;
  errors?: GetUsersAffiliatesResponseErrorsList;
  includes?: Expansions;
  meta?: GetUsersAffiliatesResponseMeta;
}
export const GetUsersAffiliatesResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetUsersAffiliatesResponseDataList),
    errors: S.optional(GetUsersAffiliatesResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(GetUsersAffiliatesResponseMeta),
  }),
).annotate({
  identifier: "GetUsersAffiliatesResponse",
}) as any as S.Schema<GetUsersAffiliatesResponse>;

export type GetUsersBlockingRequestUserFieldsItem =
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "name"
  | "parody"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscribes_to_you"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const GetUsersBlockingRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetUsersBlockingRequestUserFieldsList = Array<
  GetUsersBlockingRequestUserFieldsItem | (string & {})
>;
export const GetUsersBlockingRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetUsersBlockingRequestUserFieldsItem,
) as any as S.Schema<GetUsersBlockingRequestUserFieldsList>;

export type GetUsersBlockingRequestExpansionsItem =
  | "affiliation"
  | "most_recent_post_id"
  | "pinned_post_id";
export const GetUsersBlockingRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetUsersBlockingRequestExpansionsList = Array<
  GetUsersBlockingRequestExpansionsItem | (string & {})
>;
export const GetUsersBlockingRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetUsersBlockingRequestExpansionsItem,
) as any as S.Schema<GetUsersBlockingRequestExpansionsList>;

export type GetUsersBlockingRequestPostFieldsItem =
  | "article"
  | "article_title"
  | "attachments"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "entities"
  | "geo"
  | "id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_post"
  | "note_request_suggestions"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const GetUsersBlockingRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetUsersBlockingRequestPostFieldsList = Array<
  GetUsersBlockingRequestPostFieldsItem | (string & {})
>;
export const GetUsersBlockingRequestPostFieldsList = /*@__PURE__*/ S.Array(
  GetUsersBlockingRequestPostFieldsItem,
) as any as S.Schema<GetUsersBlockingRequestPostFieldsList>;

export interface GetUsersBlockingRequest {
  id: string;
  max_results?: number;
  pagination_token?: string;
  /** A comma separated list of User fields to display. */
  user_fields?: GetUsersBlockingRequestUserFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetUsersBlockingRequestExpansionsList;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetUsersBlockingRequestPostFieldsList;
}
export const GetUsersBlockingRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
    user_fields: S.optional(
      GetUsersBlockingRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    expansions: S.optional(
      GetUsersBlockingRequestExpansionsList.pipe(T.Query()),
    ),
    post_fields: S.optional(
      GetUsersBlockingRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/users/{id}/blocking", code: 200 })),
).annotate({
  identifier: "GetUsersBlockingRequest",
}) as any as S.Schema<GetUsersBlockingRequest>;

export type GetUsersBlockingResponseDataList = Array<User>;
export const GetUsersBlockingResponseDataList = /*@__PURE__*/ S.Array(
  User,
) as any as S.Schema<GetUsersBlockingResponseDataList>;

export type GetUsersBlockingResponseErrorsList = Array<Problem>;
export const GetUsersBlockingResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersBlockingResponseErrorsList>;

export type GetUsersBlockingResponseMeta = GetUsersAffiliatesResponseMeta;
export const GetUsersBlockingResponseMeta = GetUsersAffiliatesResponseMeta;

export interface GetUsersBlockingResponse {
  data?: GetUsersBlockingResponseDataList;
  errors?: GetUsersBlockingResponseErrorsList;
  includes?: Expansions;
  meta?: GetUsersAffiliatesResponseMeta;
}
export const GetUsersBlockingResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetUsersBlockingResponseDataList),
    errors: S.optional(GetUsersBlockingResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(GetUsersAffiliatesResponseMeta),
  }),
).annotate({
  identifier: "GetUsersBlockingResponse",
}) as any as S.Schema<GetUsersBlockingResponse>;

export type GetUsersByIdRequestUserFieldsItem =
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "name"
  | "parody"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscribes_to_you"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const GetUsersByIdRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetUsersByIdRequestUserFieldsList = Array<
  GetUsersByIdRequestUserFieldsItem | (string & {})
>;
export const GetUsersByIdRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetUsersByIdRequestUserFieldsItem,
) as any as S.Schema<GetUsersByIdRequestUserFieldsList>;

export type GetUsersByIdRequestExpansionsItem =
  | "affiliation"
  | "most_recent_post_id"
  | "pinned_post_id";
export const GetUsersByIdRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetUsersByIdRequestExpansionsList = Array<
  GetUsersByIdRequestExpansionsItem | (string & {})
>;
export const GetUsersByIdRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetUsersByIdRequestExpansionsItem,
) as any as S.Schema<GetUsersByIdRequestExpansionsList>;

export type GetUsersByIdRequestPostFieldsItem =
  | "article"
  | "article_title"
  | "attachments"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "entities"
  | "geo"
  | "id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_post"
  | "note_request_suggestions"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const GetUsersByIdRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetUsersByIdRequestPostFieldsList = Array<
  GetUsersByIdRequestPostFieldsItem | (string & {})
>;
export const GetUsersByIdRequestPostFieldsList = /*@__PURE__*/ S.Array(
  GetUsersByIdRequestPostFieldsItem,
) as any as S.Schema<GetUsersByIdRequestPostFieldsList>;

export interface GetUsersByIdRequest {
  id: string;
  /** A comma separated list of User fields to display. */
  user_fields?: GetUsersByIdRequestUserFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetUsersByIdRequestExpansionsList;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetUsersByIdRequestPostFieldsList;
}
export const GetUsersByIdRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    user_fields: S.optional(
      GetUsersByIdRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    expansions: S.optional(GetUsersByIdRequestExpansionsList.pipe(T.Query())),
    post_fields: S.optional(
      GetUsersByIdRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/users/{id}", code: 200 })),
).annotate({
  identifier: "GetUsersByIdRequest",
}) as any as S.Schema<GetUsersByIdRequest>;

export type GetUsersByIdResponseErrorsList = Array<Problem>;
export const GetUsersByIdResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersByIdResponseErrorsList>;

export interface GetUsersByIdResponse {
  data?: User;
  errors?: GetUsersByIdResponseErrorsList;
  includes?: Expansions;
}
export const GetUsersByIdResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(User),
    errors: S.optional(GetUsersByIdResponseErrorsList),
    includes: S.optional(Expansions),
  }),
).annotate({
  identifier: "GetUsersByIdResponse",
}) as any as S.Schema<GetUsersByIdResponse>;

export type GetUsersByIdsRequestIdsList = Array<string>;
export const GetUsersByIdsRequestIdsList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<GetUsersByIdsRequestIdsList>;

export type GetUsersByIdsRequestUserFieldsItem =
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "name"
  | "parody"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscribes_to_you"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const GetUsersByIdsRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetUsersByIdsRequestUserFieldsList = Array<
  GetUsersByIdsRequestUserFieldsItem | (string & {})
>;
export const GetUsersByIdsRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetUsersByIdsRequestUserFieldsItem,
) as any as S.Schema<GetUsersByIdsRequestUserFieldsList>;

export type GetUsersByIdsRequestExpansionsItem =
  | "affiliation"
  | "most_recent_post_id"
  | "pinned_post_id";
export const GetUsersByIdsRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetUsersByIdsRequestExpansionsList = Array<
  GetUsersByIdsRequestExpansionsItem | (string & {})
>;
export const GetUsersByIdsRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetUsersByIdsRequestExpansionsItem,
) as any as S.Schema<GetUsersByIdsRequestExpansionsList>;

export type GetUsersByIdsRequestPostFieldsItem =
  | "article"
  | "article_title"
  | "attachments"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "entities"
  | "geo"
  | "id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_post"
  | "note_request_suggestions"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const GetUsersByIdsRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetUsersByIdsRequestPostFieldsList = Array<
  GetUsersByIdsRequestPostFieldsItem | (string & {})
>;
export const GetUsersByIdsRequestPostFieldsList = /*@__PURE__*/ S.Array(
  GetUsersByIdsRequestPostFieldsItem,
) as any as S.Schema<GetUsersByIdsRequestPostFieldsList>;

export interface GetUsersByIdsRequest {
  ids: GetUsersByIdsRequestIdsList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetUsersByIdsRequestUserFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetUsersByIdsRequestExpansionsList;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetUsersByIdsRequestPostFieldsList;
}
export const GetUsersByIdsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    ids: GetUsersByIdsRequestIdsList.pipe(T.Query()),
    user_fields: S.optional(
      GetUsersByIdsRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    expansions: S.optional(GetUsersByIdsRequestExpansionsList.pipe(T.Query())),
    post_fields: S.optional(
      GetUsersByIdsRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/users", code: 200 })),
).annotate({
  identifier: "GetUsersByIdsRequest",
}) as any as S.Schema<GetUsersByIdsRequest>;

export type GetUsersByIdsResponseDataList = Array<User>;
export const GetUsersByIdsResponseDataList = /*@__PURE__*/ S.Array(
  User,
) as any as S.Schema<GetUsersByIdsResponseDataList>;

export type GetUsersByIdsResponseErrorsList = Array<Problem>;
export const GetUsersByIdsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersByIdsResponseErrorsList>;

export interface GetUsersByIdsResponse {
  data?: GetUsersByIdsResponseDataList;
  errors?: GetUsersByIdsResponseErrorsList;
  includes?: Expansions;
}
export const GetUsersByIdsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetUsersByIdsResponseDataList),
    errors: S.optional(GetUsersByIdsResponseErrorsList),
    includes: S.optional(Expansions),
  }),
).annotate({
  identifier: "GetUsersByIdsResponse",
}) as any as S.Schema<GetUsersByIdsResponse>;

export type GetUsersByUsernameRequestUserFieldsItem =
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "name"
  | "parody"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscribes_to_you"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const GetUsersByUsernameRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetUsersByUsernameRequestUserFieldsList = Array<
  GetUsersByUsernameRequestUserFieldsItem | (string & {})
>;
export const GetUsersByUsernameRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetUsersByUsernameRequestUserFieldsItem,
) as any as S.Schema<GetUsersByUsernameRequestUserFieldsList>;

export type GetUsersByUsernameRequestExpansionsItem =
  | "affiliation"
  | "most_recent_post_id"
  | "pinned_post_id";
export const GetUsersByUsernameRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetUsersByUsernameRequestExpansionsList = Array<
  GetUsersByUsernameRequestExpansionsItem | (string & {})
>;
export const GetUsersByUsernameRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetUsersByUsernameRequestExpansionsItem,
) as any as S.Schema<GetUsersByUsernameRequestExpansionsList>;

export type GetUsersByUsernameRequestPostFieldsItem =
  | "article"
  | "article_title"
  | "attachments"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "entities"
  | "geo"
  | "id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_post"
  | "note_request_suggestions"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const GetUsersByUsernameRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetUsersByUsernameRequestPostFieldsList = Array<
  GetUsersByUsernameRequestPostFieldsItem | (string & {})
>;
export const GetUsersByUsernameRequestPostFieldsList = /*@__PURE__*/ S.Array(
  GetUsersByUsernameRequestPostFieldsItem,
) as any as S.Schema<GetUsersByUsernameRequestPostFieldsList>;

export interface GetUsersByUsernameRequest {
  username: string;
  /** A comma separated list of User fields to display. */
  user_fields?: GetUsersByUsernameRequestUserFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetUsersByUsernameRequestExpansionsList;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetUsersByUsernameRequestPostFieldsList;
}
export const GetUsersByUsernameRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    username: S.String.pipe(T.Label()),
    user_fields: S.optional(
      GetUsersByUsernameRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    expansions: S.optional(
      GetUsersByUsernameRequestExpansionsList.pipe(T.Query()),
    ),
    post_fields: S.optional(
      GetUsersByUsernameRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
  }).pipe(
    T.Http({
      method: "GET",
      uri: "/2/users/by/username/{username}",
      code: 200,
    }),
  ),
).annotate({
  identifier: "GetUsersByUsernameRequest",
}) as any as S.Schema<GetUsersByUsernameRequest>;

export type GetUsersByUsernameResponseErrorsList = Array<Problem>;
export const GetUsersByUsernameResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersByUsernameResponseErrorsList>;

export interface GetUsersByUsernameResponse {
  data?: User;
  errors?: GetUsersByUsernameResponseErrorsList;
  includes?: Expansions;
}
export const GetUsersByUsernameResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(User),
    errors: S.optional(GetUsersByUsernameResponseErrorsList),
    includes: S.optional(Expansions),
  }),
).annotate({
  identifier: "GetUsersByUsernameResponse",
}) as any as S.Schema<GetUsersByUsernameResponse>;

export type GetUsersByUsernamesRequestUsernamesList = Array<string>;
export const GetUsersByUsernamesRequestUsernamesList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<GetUsersByUsernamesRequestUsernamesList>;

export type GetUsersByUsernamesRequestUserFieldsItem =
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "name"
  | "parody"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscribes_to_you"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const GetUsersByUsernamesRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetUsersByUsernamesRequestUserFieldsList = Array<
  GetUsersByUsernamesRequestUserFieldsItem | (string & {})
>;
export const GetUsersByUsernamesRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetUsersByUsernamesRequestUserFieldsItem,
) as any as S.Schema<GetUsersByUsernamesRequestUserFieldsList>;

export type GetUsersByUsernamesRequestExpansionsItem =
  | "affiliation"
  | "most_recent_post_id"
  | "pinned_post_id";
export const GetUsersByUsernamesRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetUsersByUsernamesRequestExpansionsList = Array<
  GetUsersByUsernamesRequestExpansionsItem | (string & {})
>;
export const GetUsersByUsernamesRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetUsersByUsernamesRequestExpansionsItem,
) as any as S.Schema<GetUsersByUsernamesRequestExpansionsList>;

export type GetUsersByUsernamesRequestPostFieldsItem =
  | "article"
  | "article_title"
  | "attachments"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "entities"
  | "geo"
  | "id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_post"
  | "note_request_suggestions"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const GetUsersByUsernamesRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetUsersByUsernamesRequestPostFieldsList = Array<
  GetUsersByUsernamesRequestPostFieldsItem | (string & {})
>;
export const GetUsersByUsernamesRequestPostFieldsList = /*@__PURE__*/ S.Array(
  GetUsersByUsernamesRequestPostFieldsItem,
) as any as S.Schema<GetUsersByUsernamesRequestPostFieldsList>;

export interface GetUsersByUsernamesRequest {
  usernames: GetUsersByUsernamesRequestUsernamesList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetUsersByUsernamesRequestUserFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetUsersByUsernamesRequestExpansionsList;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetUsersByUsernamesRequestPostFieldsList;
}
export const GetUsersByUsernamesRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    usernames: GetUsersByUsernamesRequestUsernamesList.pipe(T.Query()),
    user_fields: S.optional(
      GetUsersByUsernamesRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    expansions: S.optional(
      GetUsersByUsernamesRequestExpansionsList.pipe(T.Query()),
    ),
    post_fields: S.optional(
      GetUsersByUsernamesRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/users/by", code: 200 })),
).annotate({
  identifier: "GetUsersByUsernamesRequest",
}) as any as S.Schema<GetUsersByUsernamesRequest>;

export type GetUsersByUsernamesResponseDataList = Array<User>;
export const GetUsersByUsernamesResponseDataList = /*@__PURE__*/ S.Array(
  User,
) as any as S.Schema<GetUsersByUsernamesResponseDataList>;

export type GetUsersByUsernamesResponseErrorsList = Array<Problem>;
export const GetUsersByUsernamesResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersByUsernamesResponseErrorsList>;

export interface GetUsersByUsernamesResponse {
  data?: GetUsersByUsernamesResponseDataList;
  errors?: GetUsersByUsernamesResponseErrorsList;
  includes?: Expansions;
}
export const GetUsersByUsernamesResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetUsersByUsernamesResponseDataList),
    errors: S.optional(GetUsersByUsernamesResponseErrorsList),
    includes: S.optional(Expansions),
  }),
).annotate({
  identifier: "GetUsersByUsernamesResponse",
}) as any as S.Schema<GetUsersByUsernamesResponse>;

export type GetUsersFollowedListsRequestListFieldsItem =
  | "created_at"
  | "description"
  | "follower_count"
  | "id"
  | "member_count"
  | "name"
  | "private";
export const GetUsersFollowedListsRequestListFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a List object. */
export type GetUsersFollowedListsRequestListFieldsList = Array<
  GetUsersFollowedListsRequestListFieldsItem | (string & {})
>;
export const GetUsersFollowedListsRequestListFieldsList = /*@__PURE__*/ S.Array(
  GetUsersFollowedListsRequestListFieldsItem,
) as any as S.Schema<GetUsersFollowedListsRequestListFieldsList>;

export type GetUsersFollowedListsRequestExpansionsItem = "owner_id";
export const GetUsersFollowedListsRequestExpansionsItem =
  /*@__PURE__*/ S.String;

export type GetUsersFollowedListsRequestExpansionsList = Array<
  GetUsersFollowedListsRequestExpansionsItem | (string & {})
>;
export const GetUsersFollowedListsRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetUsersFollowedListsRequestExpansionsItem,
) as any as S.Schema<GetUsersFollowedListsRequestExpansionsList>;

export type GetUsersFollowedListsRequestUserFieldsItem =
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "name"
  | "parody"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscribes_to_you"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const GetUsersFollowedListsRequestUserFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetUsersFollowedListsRequestUserFieldsList = Array<
  GetUsersFollowedListsRequestUserFieldsItem | (string & {})
>;
export const GetUsersFollowedListsRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetUsersFollowedListsRequestUserFieldsItem,
) as any as S.Schema<GetUsersFollowedListsRequestUserFieldsList>;

export interface GetUsersFollowedListsRequest {
  id: string;
  max_results?: number;
  /** A 64-bit signed integer. */
  pagination_token?: string;
  /** A comma separated list of List fields to display. */
  list_fields?: GetUsersFollowedListsRequestListFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetUsersFollowedListsRequestExpansionsList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetUsersFollowedListsRequestUserFieldsList;
}
export const GetUsersFollowedListsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
    list_fields: S.optional(
      GetUsersFollowedListsRequestListFieldsList.pipe(T.Query("list.fields")),
    ),
    expansions: S.optional(
      GetUsersFollowedListsRequestExpansionsList.pipe(T.Query()),
    ),
    user_fields: S.optional(
      GetUsersFollowedListsRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
  }).pipe(
    T.Http({ method: "GET", uri: "/2/users/{id}/followed_lists", code: 200 }),
  ),
).annotate({
  identifier: "GetUsersFollowedListsRequest",
}) as any as S.Schema<GetUsersFollowedListsRequest>;

export interface List {
  created_at?: string;
  description?: string;
  follower_count?: number;
  id?: string;
  member_count?: number;
  name?: string;
  owner_id?: string;
  private?: boolean;
}
export const List = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    created_at: S.optional(S.String),
    description: S.optional(S.String),
    follower_count: S.optional(S.Number),
    id: S.optional(S.String),
    member_count: S.optional(S.Number),
    name: S.optional(S.String),
    owner_id: S.optional(S.String),
    private: S.optional(S.Boolean),
  }),
).annotate({ identifier: "List" }) as any as S.Schema<List>;

export type GetUsersFollowedListsResponseDataList = Array<List>;
export const GetUsersFollowedListsResponseDataList = /*@__PURE__*/ S.Array(
  List,
) as any as S.Schema<GetUsersFollowedListsResponseDataList>;

export type GetUsersFollowedListsResponseErrorsList = Array<Problem>;
export const GetUsersFollowedListsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersFollowedListsResponseErrorsList>;

export type GetUsersFollowedListsResponseMeta = GetUsersAffiliatesResponseMeta;
export const GetUsersFollowedListsResponseMeta = GetUsersAffiliatesResponseMeta;

export interface GetUsersFollowedListsResponse {
  data?: GetUsersFollowedListsResponseDataList;
  errors?: GetUsersFollowedListsResponseErrorsList;
  includes?: Expansions;
  meta?: GetUsersAffiliatesResponseMeta;
}
export const GetUsersFollowedListsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetUsersFollowedListsResponseDataList),
    errors: S.optional(GetUsersFollowedListsResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(GetUsersAffiliatesResponseMeta),
  }),
).annotate({
  identifier: "GetUsersFollowedListsResponse",
}) as any as S.Schema<GetUsersFollowedListsResponse>;

export type GetUsersFollowersRequestUserFieldsItem =
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "name"
  | "parody"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscribes_to_you"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const GetUsersFollowersRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetUsersFollowersRequestUserFieldsList = Array<
  GetUsersFollowersRequestUserFieldsItem | (string & {})
>;
export const GetUsersFollowersRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetUsersFollowersRequestUserFieldsItem,
) as any as S.Schema<GetUsersFollowersRequestUserFieldsList>;

export type GetUsersFollowersRequestExpansionsItem =
  | "affiliation"
  | "most_recent_post_id"
  | "pinned_post_id";
export const GetUsersFollowersRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetUsersFollowersRequestExpansionsList = Array<
  GetUsersFollowersRequestExpansionsItem | (string & {})
>;
export const GetUsersFollowersRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetUsersFollowersRequestExpansionsItem,
) as any as S.Schema<GetUsersFollowersRequestExpansionsList>;

export type GetUsersFollowersRequestPostFieldsItem =
  | "article"
  | "article_title"
  | "attachments"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "entities"
  | "geo"
  | "id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_post"
  | "note_request_suggestions"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const GetUsersFollowersRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetUsersFollowersRequestPostFieldsList = Array<
  GetUsersFollowersRequestPostFieldsItem | (string & {})
>;
export const GetUsersFollowersRequestPostFieldsList = /*@__PURE__*/ S.Array(
  GetUsersFollowersRequestPostFieldsItem,
) as any as S.Schema<GetUsersFollowersRequestPostFieldsList>;

export interface GetUsersFollowersRequest {
  id: string;
  max_results?: number;
  /** A base32hex-encoded pagination token. */
  pagination_token?: string;
  /** A comma separated list of User fields to display. */
  user_fields?: GetUsersFollowersRequestUserFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetUsersFollowersRequestExpansionsList;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetUsersFollowersRequestPostFieldsList;
}
export const GetUsersFollowersRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
    user_fields: S.optional(
      GetUsersFollowersRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    expansions: S.optional(
      GetUsersFollowersRequestExpansionsList.pipe(T.Query()),
    ),
    post_fields: S.optional(
      GetUsersFollowersRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/users/{id}/followers", code: 200 })),
).annotate({
  identifier: "GetUsersFollowersRequest",
}) as any as S.Schema<GetUsersFollowersRequest>;

export type GetUsersFollowersResponseDataList = Array<User>;
export const GetUsersFollowersResponseDataList = /*@__PURE__*/ S.Array(
  User,
) as any as S.Schema<GetUsersFollowersResponseDataList>;

export type GetUsersFollowersResponseErrorsList = Array<Problem>;
export const GetUsersFollowersResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersFollowersResponseErrorsList>;

export type GetUsersFollowersResponseMeta = GetUsersAffiliatesResponseMeta;
export const GetUsersFollowersResponseMeta = GetUsersAffiliatesResponseMeta;

export interface GetUsersFollowersResponse {
  data?: GetUsersFollowersResponseDataList;
  errors?: GetUsersFollowersResponseErrorsList;
  includes?: Expansions;
  meta?: GetUsersAffiliatesResponseMeta;
}
export const GetUsersFollowersResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetUsersFollowersResponseDataList),
    errors: S.optional(GetUsersFollowersResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(GetUsersAffiliatesResponseMeta),
  }),
).annotate({
  identifier: "GetUsersFollowersResponse",
}) as any as S.Schema<GetUsersFollowersResponse>;

export type GetUsersFollowingRequestUserFieldsItem =
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "name"
  | "parody"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscribes_to_you"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const GetUsersFollowingRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetUsersFollowingRequestUserFieldsList = Array<
  GetUsersFollowingRequestUserFieldsItem | (string & {})
>;
export const GetUsersFollowingRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetUsersFollowingRequestUserFieldsItem,
) as any as S.Schema<GetUsersFollowingRequestUserFieldsList>;

export type GetUsersFollowingRequestExpansionsItem =
  | "affiliation"
  | "most_recent_post_id"
  | "pinned_post_id";
export const GetUsersFollowingRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetUsersFollowingRequestExpansionsList = Array<
  GetUsersFollowingRequestExpansionsItem | (string & {})
>;
export const GetUsersFollowingRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetUsersFollowingRequestExpansionsItem,
) as any as S.Schema<GetUsersFollowingRequestExpansionsList>;

export type GetUsersFollowingRequestPostFieldsItem =
  | "article"
  | "article_title"
  | "attachments"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "entities"
  | "geo"
  | "id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_post"
  | "note_request_suggestions"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const GetUsersFollowingRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetUsersFollowingRequestPostFieldsList = Array<
  GetUsersFollowingRequestPostFieldsItem | (string & {})
>;
export const GetUsersFollowingRequestPostFieldsList = /*@__PURE__*/ S.Array(
  GetUsersFollowingRequestPostFieldsItem,
) as any as S.Schema<GetUsersFollowingRequestPostFieldsList>;

export interface GetUsersFollowingRequest {
  id: string;
  max_results?: number;
  /** A base32hex-encoded pagination token. */
  pagination_token?: string;
  /** A comma separated list of User fields to display. */
  user_fields?: GetUsersFollowingRequestUserFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetUsersFollowingRequestExpansionsList;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetUsersFollowingRequestPostFieldsList;
}
export const GetUsersFollowingRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
    user_fields: S.optional(
      GetUsersFollowingRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    expansions: S.optional(
      GetUsersFollowingRequestExpansionsList.pipe(T.Query()),
    ),
    post_fields: S.optional(
      GetUsersFollowingRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/users/{id}/following", code: 200 })),
).annotate({
  identifier: "GetUsersFollowingRequest",
}) as any as S.Schema<GetUsersFollowingRequest>;

export type GetUsersFollowingResponseDataList = Array<User>;
export const GetUsersFollowingResponseDataList = /*@__PURE__*/ S.Array(
  User,
) as any as S.Schema<GetUsersFollowingResponseDataList>;

export type GetUsersFollowingResponseErrorsList = Array<Problem>;
export const GetUsersFollowingResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersFollowingResponseErrorsList>;

export type GetUsersFollowingResponseMeta = GetUsersAffiliatesResponseMeta;
export const GetUsersFollowingResponseMeta = GetUsersAffiliatesResponseMeta;

export interface GetUsersFollowingResponse {
  data?: GetUsersFollowingResponseDataList;
  errors?: GetUsersFollowingResponseErrorsList;
  includes?: Expansions;
  meta?: GetUsersAffiliatesResponseMeta;
}
export const GetUsersFollowingResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetUsersFollowingResponseDataList),
    errors: S.optional(GetUsersFollowingResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(GetUsersAffiliatesResponseMeta),
  }),
).annotate({
  identifier: "GetUsersFollowingResponse",
}) as any as S.Schema<GetUsersFollowingResponse>;

export type GetUsersListMembershipsRequestListFieldsItem =
  | "created_at"
  | "description"
  | "follower_count"
  | "id"
  | "member_count"
  | "name"
  | "private";
export const GetUsersListMembershipsRequestListFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a List object. */
export type GetUsersListMembershipsRequestListFieldsList = Array<
  GetUsersListMembershipsRequestListFieldsItem | (string & {})
>;
export const GetUsersListMembershipsRequestListFieldsList =
  /*@__PURE__*/ S.Array(
    GetUsersListMembershipsRequestListFieldsItem,
  ) as any as S.Schema<GetUsersListMembershipsRequestListFieldsList>;

export type GetUsersListMembershipsRequestExpansionsItem = "owner_id";
export const GetUsersListMembershipsRequestExpansionsItem =
  /*@__PURE__*/ S.String;

export type GetUsersListMembershipsRequestExpansionsList = Array<
  GetUsersListMembershipsRequestExpansionsItem | (string & {})
>;
export const GetUsersListMembershipsRequestExpansionsList =
  /*@__PURE__*/ S.Array(
    GetUsersListMembershipsRequestExpansionsItem,
  ) as any as S.Schema<GetUsersListMembershipsRequestExpansionsList>;

export type GetUsersListMembershipsRequestUserFieldsItem =
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "name"
  | "parody"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscribes_to_you"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const GetUsersListMembershipsRequestUserFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetUsersListMembershipsRequestUserFieldsList = Array<
  GetUsersListMembershipsRequestUserFieldsItem | (string & {})
>;
export const GetUsersListMembershipsRequestUserFieldsList =
  /*@__PURE__*/ S.Array(
    GetUsersListMembershipsRequestUserFieldsItem,
  ) as any as S.Schema<GetUsersListMembershipsRequestUserFieldsList>;

export interface GetUsersListMembershipsRequest {
  id: string;
  max_results?: number;
  pagination_token?: string;
  /** A comma separated list of List fields to display. */
  list_fields?: GetUsersListMembershipsRequestListFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetUsersListMembershipsRequestExpansionsList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetUsersListMembershipsRequestUserFieldsList;
}
export const GetUsersListMembershipsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
    list_fields: S.optional(
      GetUsersListMembershipsRequestListFieldsList.pipe(T.Query("list.fields")),
    ),
    expansions: S.optional(
      GetUsersListMembershipsRequestExpansionsList.pipe(T.Query()),
    ),
    user_fields: S.optional(
      GetUsersListMembershipsRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
  }).pipe(
    T.Http({ method: "GET", uri: "/2/users/{id}/list_memberships", code: 200 }),
  ),
).annotate({
  identifier: "GetUsersListMembershipsRequest",
}) as any as S.Schema<GetUsersListMembershipsRequest>;

export type GetUsersListMembershipsResponseDataList = Array<List>;
export const GetUsersListMembershipsResponseDataList = /*@__PURE__*/ S.Array(
  List,
) as any as S.Schema<GetUsersListMembershipsResponseDataList>;

export type GetUsersListMembershipsResponseErrorsList = Array<Problem>;
export const GetUsersListMembershipsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersListMembershipsResponseErrorsList>;

export type GetUsersListMembershipsResponseMeta =
  GetUsersAffiliatesResponseMeta;
export const GetUsersListMembershipsResponseMeta =
  GetUsersAffiliatesResponseMeta;

export interface GetUsersListMembershipsResponse {
  data?: GetUsersListMembershipsResponseDataList;
  errors?: GetUsersListMembershipsResponseErrorsList;
  includes?: Expansions;
  meta?: GetUsersAffiliatesResponseMeta;
}
export const GetUsersListMembershipsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetUsersListMembershipsResponseDataList),
    errors: S.optional(GetUsersListMembershipsResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(GetUsersAffiliatesResponseMeta),
  }),
).annotate({
  identifier: "GetUsersListMembershipsResponse",
}) as any as S.Schema<GetUsersListMembershipsResponse>;

export type GetUsersMeRequestUserFieldsItem =
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "name"
  | "parody"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscribes_to_you"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const GetUsersMeRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetUsersMeRequestUserFieldsList = Array<
  GetUsersMeRequestUserFieldsItem | (string & {})
>;
export const GetUsersMeRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetUsersMeRequestUserFieldsItem,
) as any as S.Schema<GetUsersMeRequestUserFieldsList>;

export type GetUsersMeRequestExpansionsItem =
  | "affiliation"
  | "most_recent_post_id"
  | "pinned_post_id";
export const GetUsersMeRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetUsersMeRequestExpansionsList = Array<
  GetUsersMeRequestExpansionsItem | (string & {})
>;
export const GetUsersMeRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetUsersMeRequestExpansionsItem,
) as any as S.Schema<GetUsersMeRequestExpansionsList>;

export type GetUsersMeRequestPostFieldsItem =
  | "article"
  | "article_title"
  | "attachments"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "entities"
  | "geo"
  | "id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_post"
  | "note_request_suggestions"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const GetUsersMeRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetUsersMeRequestPostFieldsList = Array<
  GetUsersMeRequestPostFieldsItem | (string & {})
>;
export const GetUsersMeRequestPostFieldsList = /*@__PURE__*/ S.Array(
  GetUsersMeRequestPostFieldsItem,
) as any as S.Schema<GetUsersMeRequestPostFieldsList>;

export interface GetUsersMeRequest {
  /** A comma separated list of User fields to display. */
  user_fields?: GetUsersMeRequestUserFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetUsersMeRequestExpansionsList;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetUsersMeRequestPostFieldsList;
}
export const GetUsersMeRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    user_fields: S.optional(
      GetUsersMeRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    expansions: S.optional(GetUsersMeRequestExpansionsList.pipe(T.Query())),
    post_fields: S.optional(
      GetUsersMeRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/users/me", code: 200 })),
).annotate({
  identifier: "GetUsersMeRequest",
}) as any as S.Schema<GetUsersMeRequest>;

export type GetUsersMeResponseErrorsList = Array<Problem>;
export const GetUsersMeResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersMeResponseErrorsList>;

export interface GetUsersMeResponse {
  data?: User;
  errors?: GetUsersMeResponseErrorsList;
  includes?: Expansions;
}
export const GetUsersMeResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(User),
    errors: S.optional(GetUsersMeResponseErrorsList),
    includes: S.optional(Expansions),
  }),
).annotate({
  identifier: "GetUsersMeResponse",
}) as any as S.Schema<GetUsersMeResponse>;

export type GetUsersMutingRequestUserFieldsItem =
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "name"
  | "parody"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscribes_to_you"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const GetUsersMutingRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetUsersMutingRequestUserFieldsList = Array<
  GetUsersMutingRequestUserFieldsItem | (string & {})
>;
export const GetUsersMutingRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetUsersMutingRequestUserFieldsItem,
) as any as S.Schema<GetUsersMutingRequestUserFieldsList>;

export type GetUsersMutingRequestExpansionsItem =
  | "affiliation"
  | "most_recent_post_id"
  | "pinned_post_id";
export const GetUsersMutingRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetUsersMutingRequestExpansionsList = Array<
  GetUsersMutingRequestExpansionsItem | (string & {})
>;
export const GetUsersMutingRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetUsersMutingRequestExpansionsItem,
) as any as S.Schema<GetUsersMutingRequestExpansionsList>;

export type GetUsersMutingRequestPostFieldsItem =
  | "article"
  | "article_title"
  | "attachments"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "entities"
  | "geo"
  | "id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_post"
  | "note_request_suggestions"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const GetUsersMutingRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetUsersMutingRequestPostFieldsList = Array<
  GetUsersMutingRequestPostFieldsItem | (string & {})
>;
export const GetUsersMutingRequestPostFieldsList = /*@__PURE__*/ S.Array(
  GetUsersMutingRequestPostFieldsItem,
) as any as S.Schema<GetUsersMutingRequestPostFieldsList>;

export interface GetUsersMutingRequest {
  id: string;
  max_results?: number;
  pagination_token?: string;
  /** A comma separated list of User fields to display. */
  user_fields?: GetUsersMutingRequestUserFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetUsersMutingRequestExpansionsList;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetUsersMutingRequestPostFieldsList;
}
export const GetUsersMutingRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
    user_fields: S.optional(
      GetUsersMutingRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    expansions: S.optional(GetUsersMutingRequestExpansionsList.pipe(T.Query())),
    post_fields: S.optional(
      GetUsersMutingRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/users/{id}/muting", code: 200 })),
).annotate({
  identifier: "GetUsersMutingRequest",
}) as any as S.Schema<GetUsersMutingRequest>;

export type GetUsersMutingResponseDataList = Array<User>;
export const GetUsersMutingResponseDataList = /*@__PURE__*/ S.Array(
  User,
) as any as S.Schema<GetUsersMutingResponseDataList>;

export type GetUsersMutingResponseErrorsList = Array<Problem>;
export const GetUsersMutingResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersMutingResponseErrorsList>;

export type GetUsersMutingResponseMeta = GetUsersAffiliatesResponseMeta;
export const GetUsersMutingResponseMeta = GetUsersAffiliatesResponseMeta;

export interface GetUsersMutingResponse {
  data?: GetUsersMutingResponseDataList;
  errors?: GetUsersMutingResponseErrorsList;
  includes?: Expansions;
  meta?: GetUsersAffiliatesResponseMeta;
}
export const GetUsersMutingResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetUsersMutingResponseDataList),
    errors: S.optional(GetUsersMutingResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(GetUsersAffiliatesResponseMeta),
  }),
).annotate({
  identifier: "GetUsersMutingResponse",
}) as any as S.Schema<GetUsersMutingResponse>;

export type GetUsersOwnedListsRequestListFieldsItem =
  | "created_at"
  | "description"
  | "follower_count"
  | "id"
  | "member_count"
  | "name"
  | "private";
export const GetUsersOwnedListsRequestListFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a List object. */
export type GetUsersOwnedListsRequestListFieldsList = Array<
  GetUsersOwnedListsRequestListFieldsItem | (string & {})
>;
export const GetUsersOwnedListsRequestListFieldsList = /*@__PURE__*/ S.Array(
  GetUsersOwnedListsRequestListFieldsItem,
) as any as S.Schema<GetUsersOwnedListsRequestListFieldsList>;

export type GetUsersOwnedListsRequestExpansionsItem = "owner_id";
export const GetUsersOwnedListsRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetUsersOwnedListsRequestExpansionsList = Array<
  GetUsersOwnedListsRequestExpansionsItem | (string & {})
>;
export const GetUsersOwnedListsRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetUsersOwnedListsRequestExpansionsItem,
) as any as S.Schema<GetUsersOwnedListsRequestExpansionsList>;

export type GetUsersOwnedListsRequestUserFieldsItem =
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "name"
  | "parody"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscribes_to_you"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const GetUsersOwnedListsRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetUsersOwnedListsRequestUserFieldsList = Array<
  GetUsersOwnedListsRequestUserFieldsItem | (string & {})
>;
export const GetUsersOwnedListsRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetUsersOwnedListsRequestUserFieldsItem,
) as any as S.Schema<GetUsersOwnedListsRequestUserFieldsList>;

export interface GetUsersOwnedListsRequest {
  id: string;
  max_results?: number;
  /** A 64-bit signed integer. */
  pagination_token?: string;
  /** A comma separated list of List fields to display. */
  list_fields?: GetUsersOwnedListsRequestListFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetUsersOwnedListsRequestExpansionsList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetUsersOwnedListsRequestUserFieldsList;
}
export const GetUsersOwnedListsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
    list_fields: S.optional(
      GetUsersOwnedListsRequestListFieldsList.pipe(T.Query("list.fields")),
    ),
    expansions: S.optional(
      GetUsersOwnedListsRequestExpansionsList.pipe(T.Query()),
    ),
    user_fields: S.optional(
      GetUsersOwnedListsRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
  }).pipe(
    T.Http({ method: "GET", uri: "/2/users/{id}/owned_lists", code: 200 }),
  ),
).annotate({
  identifier: "GetUsersOwnedListsRequest",
}) as any as S.Schema<GetUsersOwnedListsRequest>;

export type GetUsersOwnedListsResponseDataList = Array<List>;
export const GetUsersOwnedListsResponseDataList = /*@__PURE__*/ S.Array(
  List,
) as any as S.Schema<GetUsersOwnedListsResponseDataList>;

export type GetUsersOwnedListsResponseErrorsList = Array<Problem>;
export const GetUsersOwnedListsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersOwnedListsResponseErrorsList>;

export type GetUsersOwnedListsResponseMeta = GetUsersAffiliatesResponseMeta;
export const GetUsersOwnedListsResponseMeta = GetUsersAffiliatesResponseMeta;

export interface GetUsersOwnedListsResponse {
  data?: GetUsersOwnedListsResponseDataList;
  errors?: GetUsersOwnedListsResponseErrorsList;
  includes?: Expansions;
  meta?: GetUsersAffiliatesResponseMeta;
}
export const GetUsersOwnedListsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetUsersOwnedListsResponseDataList),
    errors: S.optional(GetUsersOwnedListsResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(GetUsersAffiliatesResponseMeta),
  }),
).annotate({
  identifier: "GetUsersOwnedListsResponse",
}) as any as S.Schema<GetUsersOwnedListsResponse>;

export type GetUsersPinnedListsRequestListFieldsItem =
  | "created_at"
  | "description"
  | "follower_count"
  | "id"
  | "member_count"
  | "name"
  | "private";
export const GetUsersPinnedListsRequestListFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a List object. */
export type GetUsersPinnedListsRequestListFieldsList = Array<
  GetUsersPinnedListsRequestListFieldsItem | (string & {})
>;
export const GetUsersPinnedListsRequestListFieldsList = /*@__PURE__*/ S.Array(
  GetUsersPinnedListsRequestListFieldsItem,
) as any as S.Schema<GetUsersPinnedListsRequestListFieldsList>;

export type GetUsersPinnedListsRequestExpansionsItem = "owner_id";
export const GetUsersPinnedListsRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetUsersPinnedListsRequestExpansionsList = Array<
  GetUsersPinnedListsRequestExpansionsItem | (string & {})
>;
export const GetUsersPinnedListsRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetUsersPinnedListsRequestExpansionsItem,
) as any as S.Schema<GetUsersPinnedListsRequestExpansionsList>;

export type GetUsersPinnedListsRequestUserFieldsItem =
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "name"
  | "parody"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscribes_to_you"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const GetUsersPinnedListsRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetUsersPinnedListsRequestUserFieldsList = Array<
  GetUsersPinnedListsRequestUserFieldsItem | (string & {})
>;
export const GetUsersPinnedListsRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetUsersPinnedListsRequestUserFieldsItem,
) as any as S.Schema<GetUsersPinnedListsRequestUserFieldsList>;

export interface GetUsersPinnedListsRequest {
  id: string;
  /** A comma separated list of List fields to display. */
  list_fields?: GetUsersPinnedListsRequestListFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetUsersPinnedListsRequestExpansionsList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetUsersPinnedListsRequestUserFieldsList;
}
export const GetUsersPinnedListsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    list_fields: S.optional(
      GetUsersPinnedListsRequestListFieldsList.pipe(T.Query("list.fields")),
    ),
    expansions: S.optional(
      GetUsersPinnedListsRequestExpansionsList.pipe(T.Query()),
    ),
    user_fields: S.optional(
      GetUsersPinnedListsRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
  }).pipe(
    T.Http({ method: "GET", uri: "/2/users/{id}/pinned_lists", code: 200 }),
  ),
).annotate({
  identifier: "GetUsersPinnedListsRequest",
}) as any as S.Schema<GetUsersPinnedListsRequest>;

export type GetUsersPinnedListsResponseDataList = Array<List>;
export const GetUsersPinnedListsResponseDataList = /*@__PURE__*/ S.Array(
  List,
) as any as S.Schema<GetUsersPinnedListsResponseDataList>;

export type GetUsersPinnedListsResponseErrorsList = Array<Problem>;
export const GetUsersPinnedListsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersPinnedListsResponseErrorsList>;

export interface GetUsersPinnedListsResponseMeta {
  /** Number of items in the data array. */
  result_count?: number;
}
export const GetUsersPinnedListsResponseMeta = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    result_count: S.optional(S.Number),
  }),
).annotate({
  identifier: "GetUsersPinnedListsResponseMeta",
}) as any as S.Schema<GetUsersPinnedListsResponseMeta>;

export interface GetUsersPinnedListsResponse {
  data?: GetUsersPinnedListsResponseDataList;
  errors?: GetUsersPinnedListsResponseErrorsList;
  includes?: Expansions;
  meta?: GetUsersPinnedListsResponseMeta;
}
export const GetUsersPinnedListsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetUsersPinnedListsResponseDataList),
    errors: S.optional(GetUsersPinnedListsResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(GetUsersPinnedListsResponseMeta),
  }),
).annotate({
  identifier: "GetUsersPinnedListsResponse",
}) as any as S.Schema<GetUsersPinnedListsResponse>;

export type GetUsersRepostsOfMeRequestPostFieldsItem =
  | "article"
  | "article_title"
  | "attachments"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "entities"
  | "geo"
  | "id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_post"
  | "note_request_suggestions"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const GetUsersRepostsOfMeRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetUsersRepostsOfMeRequestPostFieldsList = Array<
  GetUsersRepostsOfMeRequestPostFieldsItem | (string & {})
>;
export const GetUsersRepostsOfMeRequestPostFieldsList = /*@__PURE__*/ S.Array(
  GetUsersRepostsOfMeRequestPostFieldsItem,
) as any as S.Schema<GetUsersRepostsOfMeRequestPostFieldsList>;

export type GetUsersRepostsOfMeRequestExpansionsItem =
  | "article.cover_media"
  | "article.media_entities"
  | "attachments.media_keys"
  | "attachments.media_source_tweet"
  | "attachments.poll_ids"
  | "author_id"
  | "edit_history_post_ids"
  | "entities.mentions.username"
  | "geo.place_id"
  | "in_reply_to_user_id"
  | "referenced_posts"
  | "username";
export const GetUsersRepostsOfMeRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetUsersRepostsOfMeRequestExpansionsList = Array<
  GetUsersRepostsOfMeRequestExpansionsItem | (string & {})
>;
export const GetUsersRepostsOfMeRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetUsersRepostsOfMeRequestExpansionsItem,
) as any as S.Schema<GetUsersRepostsOfMeRequestExpansionsList>;

export type GetUsersRepostsOfMeRequestUserFieldsItem =
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "name"
  | "parody"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscribes_to_you"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const GetUsersRepostsOfMeRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetUsersRepostsOfMeRequestUserFieldsList = Array<
  GetUsersRepostsOfMeRequestUserFieldsItem | (string & {})
>;
export const GetUsersRepostsOfMeRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetUsersRepostsOfMeRequestUserFieldsItem,
) as any as S.Schema<GetUsersRepostsOfMeRequestUserFieldsList>;

export type GetUsersRepostsOfMeRequestMediaFieldsItem =
  | "alt_text"
  | "duration_ms"
  | "height"
  | "media_key"
  | "non_public_metrics"
  | "organic_metrics"
  | "preview_image_url"
  | "promoted_metrics"
  | "public_metrics"
  | "type"
  | "url"
  | "variants"
  | "width";
export const GetUsersRepostsOfMeRequestMediaFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Media object. */
export type GetUsersRepostsOfMeRequestMediaFieldsList = Array<
  GetUsersRepostsOfMeRequestMediaFieldsItem | (string & {})
>;
export const GetUsersRepostsOfMeRequestMediaFieldsList = /*@__PURE__*/ S.Array(
  GetUsersRepostsOfMeRequestMediaFieldsItem,
) as any as S.Schema<GetUsersRepostsOfMeRequestMediaFieldsList>;

export type GetUsersRepostsOfMeRequestPollFieldsItem =
  | "duration_minutes"
  | "end_datetime"
  | "id"
  | "options"
  | "voting_status";
export const GetUsersRepostsOfMeRequestPollFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Poll object. */
export type GetUsersRepostsOfMeRequestPollFieldsList = Array<
  GetUsersRepostsOfMeRequestPollFieldsItem | (string & {})
>;
export const GetUsersRepostsOfMeRequestPollFieldsList = /*@__PURE__*/ S.Array(
  GetUsersRepostsOfMeRequestPollFieldsItem,
) as any as S.Schema<GetUsersRepostsOfMeRequestPollFieldsList>;

export type GetUsersRepostsOfMeRequestPlaceFieldsItem =
  | "contained_within"
  | "country"
  | "country_code"
  | "full_name"
  | "geo"
  | "id"
  | "name"
  | "place_type";
export const GetUsersRepostsOfMeRequestPlaceFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Place object. */
export type GetUsersRepostsOfMeRequestPlaceFieldsList = Array<
  GetUsersRepostsOfMeRequestPlaceFieldsItem | (string & {})
>;
export const GetUsersRepostsOfMeRequestPlaceFieldsList = /*@__PURE__*/ S.Array(
  GetUsersRepostsOfMeRequestPlaceFieldsItem,
) as any as S.Schema<GetUsersRepostsOfMeRequestPlaceFieldsList>;

export interface GetUsersRepostsOfMeRequest {
  max_results?: number;
  /** A base32hex-encoded pagination token. */
  pagination_token?: string;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetUsersRepostsOfMeRequestPostFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetUsersRepostsOfMeRequestExpansionsList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetUsersRepostsOfMeRequestUserFieldsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: GetUsersRepostsOfMeRequestMediaFieldsList;
  /** A comma separated list of Poll fields to display. */
  poll_fields?: GetUsersRepostsOfMeRequestPollFieldsList;
  /** A comma separated list of Place fields to display. */
  place_fields?: GetUsersRepostsOfMeRequestPlaceFieldsList;
}
export const GetUsersRepostsOfMeRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
    post_fields: S.optional(
      GetUsersRepostsOfMeRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
    expansions: S.optional(
      GetUsersRepostsOfMeRequestExpansionsList.pipe(T.Query()),
    ),
    user_fields: S.optional(
      GetUsersRepostsOfMeRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    media_fields: S.optional(
      GetUsersRepostsOfMeRequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
    poll_fields: S.optional(
      GetUsersRepostsOfMeRequestPollFieldsList.pipe(T.Query("poll.fields")),
    ),
    place_fields: S.optional(
      GetUsersRepostsOfMeRequestPlaceFieldsList.pipe(T.Query("place.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/users/reposts_of_me", code: 200 })),
).annotate({
  identifier: "GetUsersRepostsOfMeRequest",
}) as any as S.Schema<GetUsersRepostsOfMeRequest>;

export type GetUsersRepostsOfMeResponseDataList = Array<Post>;
export const GetUsersRepostsOfMeResponseDataList = /*@__PURE__*/ S.Array(
  Post,
) as any as S.Schema<GetUsersRepostsOfMeResponseDataList>;

export type GetUsersRepostsOfMeResponseErrorsList = Array<Problem>;
export const GetUsersRepostsOfMeResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersRepostsOfMeResponseErrorsList>;

export type GetUsersRepostsOfMeResponseMeta = GetUsersAffiliatesResponseMeta;
export const GetUsersRepostsOfMeResponseMeta = GetUsersAffiliatesResponseMeta;

export interface GetUsersRepostsOfMeResponse {
  data?: GetUsersRepostsOfMeResponseDataList;
  errors?: GetUsersRepostsOfMeResponseErrorsList;
  includes?: Expansions;
  meta?: GetUsersAffiliatesResponseMeta;
}
export const GetUsersRepostsOfMeResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetUsersRepostsOfMeResponseDataList),
    errors: S.optional(GetUsersRepostsOfMeResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(GetUsersAffiliatesResponseMeta),
  }),
).annotate({
  identifier: "GetUsersRepostsOfMeResponse",
}) as any as S.Schema<GetUsersRepostsOfMeResponse>;

export interface MuteUserRequest {
  id: string;
  target_user_id: string;
}
export const MuteUserRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    target_user_id: S.String,
  }).pipe(T.Http({ method: "POST", uri: "/2/users/{id}/muting", code: 200 })),
).annotate({
  identifier: "MuteUserRequest",
}) as any as S.Schema<MuteUserRequest>;

export interface MuteUserResponseData {
  /** Whether the source User is muting the target User. */
  muting: boolean;
}
export const MuteUserResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    muting: S.Boolean,
  }),
).annotate({
  identifier: "MuteUserResponseData",
}) as any as S.Schema<MuteUserResponseData>;

export type MuteUserResponseErrorsList = Array<Problem>;
export const MuteUserResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<MuteUserResponseErrorsList>;

export interface MuteUserResponse {
  data?: MuteUserResponseData;
  errors?: MuteUserResponseErrorsList;
}
export const MuteUserResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(MuteUserResponseData),
    errors: S.optional(MuteUserResponseErrorsList),
  }),
).annotate({
  identifier: "MuteUserResponse",
}) as any as S.Schema<MuteUserResponse>;

export type SearchUsersRequestUserFieldsItem =
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "name"
  | "parody"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscribes_to_you"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const SearchUsersRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type SearchUsersRequestUserFieldsList = Array<
  SearchUsersRequestUserFieldsItem | (string & {})
>;
export const SearchUsersRequestUserFieldsList = /*@__PURE__*/ S.Array(
  SearchUsersRequestUserFieldsItem,
) as any as S.Schema<SearchUsersRequestUserFieldsList>;

export type SearchUsersRequestExpansionsItem =
  | "affiliation"
  | "most_recent_post_id"
  | "pinned_post_id";
export const SearchUsersRequestExpansionsItem = /*@__PURE__*/ S.String;

export type SearchUsersRequestExpansionsList = Array<
  SearchUsersRequestExpansionsItem | (string & {})
>;
export const SearchUsersRequestExpansionsList = /*@__PURE__*/ S.Array(
  SearchUsersRequestExpansionsItem,
) as any as S.Schema<SearchUsersRequestExpansionsList>;

export type SearchUsersRequestPostFieldsItem =
  | "article"
  | "article_title"
  | "attachments"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "entities"
  | "geo"
  | "id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_post"
  | "note_request_suggestions"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const SearchUsersRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type SearchUsersRequestPostFieldsList = Array<
  SearchUsersRequestPostFieldsItem | (string & {})
>;
export const SearchUsersRequestPostFieldsList = /*@__PURE__*/ S.Array(
  SearchUsersRequestPostFieldsItem,
) as any as S.Schema<SearchUsersRequestPostFieldsList>;

export interface SearchUsersRequest {
  query: string;
  max_results?: number;
  next_token?: string;
  /** A comma separated list of User fields to display. */
  user_fields?: SearchUsersRequestUserFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: SearchUsersRequestExpansionsList;
  /** A comma separated list of Post fields to display. */
  post_fields?: SearchUsersRequestPostFieldsList;
}
export const SearchUsersRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    query: S.String.pipe(T.Query()),
    max_results: S.optional(S.Number.pipe(T.Query())),
    next_token: S.optional(S.String.pipe(T.Query())),
    user_fields: S.optional(
      SearchUsersRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    expansions: S.optional(SearchUsersRequestExpansionsList.pipe(T.Query())),
    post_fields: S.optional(
      SearchUsersRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/users/search", code: 200 })),
).annotate({
  identifier: "SearchUsersRequest",
}) as any as S.Schema<SearchUsersRequest>;

export type SearchUsersResponseDataList = Array<User>;
export const SearchUsersResponseDataList = /*@__PURE__*/ S.Array(
  User,
) as any as S.Schema<SearchUsersResponseDataList>;

export type SearchUsersResponseErrorsList = Array<Problem>;
export const SearchUsersResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<SearchUsersResponseErrorsList>;

export interface SearchUsersResponseMeta {
  /** Pagination token for the next page of results. */
  next_token?: string;
  /** Pagination token for the previous page of results. */
  previous_token?: string;
}
export const SearchUsersResponseMeta = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    next_token: S.optional(S.String),
    previous_token: S.optional(S.String),
  }),
).annotate({
  identifier: "SearchUsersResponseMeta",
}) as any as S.Schema<SearchUsersResponseMeta>;

export interface SearchUsersResponse {
  data?: SearchUsersResponseDataList;
  errors?: SearchUsersResponseErrorsList;
  includes?: Expansions;
  meta?: SearchUsersResponseMeta;
}
export const SearchUsersResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(SearchUsersResponseDataList),
    errors: S.optional(SearchUsersResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(SearchUsersResponseMeta),
  }),
).annotate({
  identifier: "SearchUsersResponse",
}) as any as S.Schema<SearchUsersResponse>;

export interface UnfollowUserRequest {
  source_user_id: string;
  target_user_id: string;
}
export const UnfollowUserRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    source_user_id: S.String.pipe(T.Label()),
    target_user_id: S.String.pipe(T.Label()),
  }).pipe(
    T.Http({
      method: "DELETE",
      uri: "/2/users/{source_user_id}/following/{target_user_id}",
      code: 200,
    }),
  ),
).annotate({
  identifier: "UnfollowUserRequest",
}) as any as S.Schema<UnfollowUserRequest>;

export interface UnfollowUserResponseData {
  /** Whether the user is followed. */
  following: boolean;
}
export const UnfollowUserResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    following: S.Boolean,
  }),
).annotate({
  identifier: "UnfollowUserResponseData",
}) as any as S.Schema<UnfollowUserResponseData>;

export type UnfollowUserResponseErrorsList = Array<Problem>;
export const UnfollowUserResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<UnfollowUserResponseErrorsList>;

export interface UnfollowUserResponse {
  data?: UnfollowUserResponseData;
  errors?: UnfollowUserResponseErrorsList;
}
export const UnfollowUserResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(UnfollowUserResponseData),
    errors: S.optional(UnfollowUserResponseErrorsList),
  }),
).annotate({
  identifier: "UnfollowUserResponse",
}) as any as S.Schema<UnfollowUserResponse>;

export const followList = /*@__PURE__*/ makeOperation<
  FollowListRequest,
  FollowListResponse
>(
  operations.followList,
  () => FollowListRequest,
  () => FollowListResponse,
);

export const followUser = /*@__PURE__*/ makeOperation<
  FollowUserRequest,
  FollowUserResponse
>(
  operations.followUser,
  () => FollowUserRequest,
  () => FollowUserResponse,
);

export const getUsersAffiliates = /*@__PURE__*/ makeOperation<
  GetUsersAffiliatesRequest,
  GetUsersAffiliatesResponse
>(
  operations.getUsersAffiliates,
  () => GetUsersAffiliatesRequest,
  () => GetUsersAffiliatesResponse,
);

export const getUsersBlocking = /*@__PURE__*/ makeOperation<
  GetUsersBlockingRequest,
  GetUsersBlockingResponse
>(
  operations.getUsersBlocking,
  () => GetUsersBlockingRequest,
  () => GetUsersBlockingResponse,
);

export const getUsersById = /*@__PURE__*/ makeOperation<
  GetUsersByIdRequest,
  GetUsersByIdResponse
>(
  operations.getUsersById,
  () => GetUsersByIdRequest,
  () => GetUsersByIdResponse,
);

export const getUsersByIds = /*@__PURE__*/ makeOperation<
  GetUsersByIdsRequest,
  GetUsersByIdsResponse
>(
  operations.getUsersByIds,
  () => GetUsersByIdsRequest,
  () => GetUsersByIdsResponse,
);

export const getUsersByUsername = /*@__PURE__*/ makeOperation<
  GetUsersByUsernameRequest,
  GetUsersByUsernameResponse
>(
  operations.getUsersByUsername,
  () => GetUsersByUsernameRequest,
  () => GetUsersByUsernameResponse,
);

export const getUsersByUsernames = /*@__PURE__*/ makeOperation<
  GetUsersByUsernamesRequest,
  GetUsersByUsernamesResponse
>(
  operations.getUsersByUsernames,
  () => GetUsersByUsernamesRequest,
  () => GetUsersByUsernamesResponse,
);

export const getUsersFollowedLists = /*@__PURE__*/ makeOperation<
  GetUsersFollowedListsRequest,
  GetUsersFollowedListsResponse
>(
  operations.getUsersFollowedLists,
  () => GetUsersFollowedListsRequest,
  () => GetUsersFollowedListsResponse,
);

export const getUsersFollowers = /*@__PURE__*/ makeOperation<
  GetUsersFollowersRequest,
  GetUsersFollowersResponse
>(
  operations.getUsersFollowers,
  () => GetUsersFollowersRequest,
  () => GetUsersFollowersResponse,
);

export const getUsersFollowing = /*@__PURE__*/ makeOperation<
  GetUsersFollowingRequest,
  GetUsersFollowingResponse
>(
  operations.getUsersFollowing,
  () => GetUsersFollowingRequest,
  () => GetUsersFollowingResponse,
);

export const getUsersListMemberships = /*@__PURE__*/ makeOperation<
  GetUsersListMembershipsRequest,
  GetUsersListMembershipsResponse
>(
  operations.getUsersListMemberships,
  () => GetUsersListMembershipsRequest,
  () => GetUsersListMembershipsResponse,
);

export const getUsersMe = /*@__PURE__*/ makeOperation<
  GetUsersMeRequest,
  GetUsersMeResponse
>(
  operations.getUsersMe,
  () => GetUsersMeRequest,
  () => GetUsersMeResponse,
);

export const getUsersMuting = /*@__PURE__*/ makeOperation<
  GetUsersMutingRequest,
  GetUsersMutingResponse
>(
  operations.getUsersMuting,
  () => GetUsersMutingRequest,
  () => GetUsersMutingResponse,
);

export const getUsersOwnedLists = /*@__PURE__*/ makeOperation<
  GetUsersOwnedListsRequest,
  GetUsersOwnedListsResponse
>(
  operations.getUsersOwnedLists,
  () => GetUsersOwnedListsRequest,
  () => GetUsersOwnedListsResponse,
);

export const getUsersPinnedLists = /*@__PURE__*/ makeOperation<
  GetUsersPinnedListsRequest,
  GetUsersPinnedListsResponse
>(
  operations.getUsersPinnedLists,
  () => GetUsersPinnedListsRequest,
  () => GetUsersPinnedListsResponse,
);

export const getUsersRepostsOfMe = /*@__PURE__*/ makeOperation<
  GetUsersRepostsOfMeRequest,
  GetUsersRepostsOfMeResponse
>(
  operations.getUsersRepostsOfMe,
  () => GetUsersRepostsOfMeRequest,
  () => GetUsersRepostsOfMeResponse,
);

export const muteUser = /*@__PURE__*/ makeOperation<
  MuteUserRequest,
  MuteUserResponse
>(
  operations.muteUser,
  () => MuteUserRequest,
  () => MuteUserResponse,
);

export const searchUsers = /*@__PURE__*/ makeOperation<
  SearchUsersRequest,
  SearchUsersResponse
>(
  operations.searchUsers,
  () => SearchUsersRequest,
  () => SearchUsersResponse,
);

export const unfollowUser = /*@__PURE__*/ makeOperation<
  UnfollowUserRequest,
  UnfollowUserResponse
>(
  operations.unfollowUser,
  () => UnfollowUserRequest,
  () => UnfollowUserResponse,
);
