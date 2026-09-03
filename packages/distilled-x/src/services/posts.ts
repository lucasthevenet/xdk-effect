// AUTO-GENERATED from xdevplatform/xdk@84c26540df30c0b798e50e34151c56d5d262ba1c; do not edit.
import * as S from "@distilled.cloud/core/schema";
import * as T from "../traits.ts";
import {
  makeOperation,
  makeBinaryOperation,
  makeStreamOperation,
} from "../operation.ts";
import { operations } from "../operations.ts";
export interface CreatePostsEditOptions {
  /** The ID of the Post being edited. */
  previous_post_id: string;
}
export const CreatePostsEditOptions = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    previous_post_id: S.String,
  }),
).annotate({
  identifier: "CreatePostsEditOptions",
}) as any as S.Schema<CreatePostsEditOptions>;

export interface CreatePostsGeo {
  /** Place ID for geo tagging. */
  place_id: string;
}
export const CreatePostsGeo = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    place_id: S.String,
  }),
).annotate({ identifier: "CreatePostsGeo" }) as any as S.Schema<CreatePostsGeo>;

export interface CreatePostsMediaCallToActionsAppInstall {
  /** Apple App Store iPhone app id. */
  app_store_id?: string;
  /** Apple App Store iPad app id. */
  ipad_app_store_id?: string;
  /** Google Play Store app id. */
  play_store_id?: string;
}
export const CreatePostsMediaCallToActionsAppInstall = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      app_store_id: S.optional(S.String),
      ipad_app_store_id: S.optional(S.String),
      play_store_id: S.optional(S.String),
    }),
).annotate({
  identifier: "CreatePostsMediaCallToActionsAppInstall",
}) as any as S.Schema<CreatePostsMediaCallToActionsAppInstall>;

export interface CreatePostsMediaCallToActionsVisitSite {
  /** HTTPS URL the CTA links to. */
  url: string;
}
export const CreatePostsMediaCallToActionsVisitSite = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      url: S.String,
    }),
).annotate({
  identifier: "CreatePostsMediaCallToActionsVisitSite",
}) as any as S.Schema<CreatePostsMediaCallToActionsVisitSite>;

export type CreatePostsMediaCallToActionsWatchNow =
  CreatePostsMediaCallToActionsVisitSite;
export const CreatePostsMediaCallToActionsWatchNow =
  CreatePostsMediaCallToActionsVisitSite;

export interface CreatePostsMediaCallToActions {
  /** App Install CTA. At least one store id should be provided. */
  app_install?: CreatePostsMediaCallToActionsAppInstall;
  /** Visit Site CTA. */
  visit_site?: CreatePostsMediaCallToActionsVisitSite;
  /** Watch Now CTA. */
  watch_now?: CreatePostsMediaCallToActionsVisitSite;
}
export const CreatePostsMediaCallToActions = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    app_install: S.optional(CreatePostsMediaCallToActionsAppInstall),
    visit_site: S.optional(CreatePostsMediaCallToActionsVisitSite),
    watch_now: S.optional(CreatePostsMediaCallToActionsVisitSite),
  }),
).annotate({
  identifier: "CreatePostsMediaCallToActions",
}) as any as S.Schema<CreatePostsMediaCallToActions>;

/** Media IDs to attach to the tweet. */
export type CreatePostsMediaMediaIdsList = Array<string>;
export const CreatePostsMediaMediaIdsList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<CreatePostsMediaMediaIdsList>;

/** User IDs tagged in the media. */
export type CreatePostsMediaTaggedUserIdsList = Array<string>;
export const CreatePostsMediaTaggedUserIdsList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<CreatePostsMediaTaggedUserIdsList>;

export interface CreatePostsMedia {
  /** Call-to-action button rendered on the media entity. */
  call_to_actions?: CreatePostsMediaCallToActions;
  /** Description for the media, rendered on the Post card for video and Amplify content. */
  description?: string;
  /** When true, the media's asset URLs do not expire and external syndicated playback is allowed. */
  embeddable?: boolean;
  /** Media IDs to attach to the tweet. */
  media_ids: CreatePostsMediaMediaIdsList;
  /** Media id whose asset is used as the preview image. */
  preview_media_id?: string;
  /** User IDs tagged in the media. */
  tagged_user_ids?: CreatePostsMediaTaggedUserIdsList;
  /** Title for the media, rendered on the Post card for video and Amplify content. */
  title?: string;
}
export const CreatePostsMedia = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    call_to_actions: S.optional(CreatePostsMediaCallToActions),
    description: S.optional(S.String),
    embeddable: S.optional(S.Boolean),
    media_ids: CreatePostsMediaMediaIdsList,
    preview_media_id: S.optional(S.String),
    tagged_user_ids: S.optional(CreatePostsMediaTaggedUserIdsList),
    title: S.optional(S.String),
  }),
).annotate({
  identifier: "CreatePostsMedia",
}) as any as S.Schema<CreatePostsMedia>;

/** Poll options (2-4 choices, 1-25 characters each). */
export type CreatePostsPollOptionsList = Array<string>;
export const CreatePostsPollOptionsList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<CreatePostsPollOptionsList>;

/** Who can reply to the poll Tweet. Accepted for compatibility; it carries no backend argument and is dropped before the mutation is issued (see `translate_body`). */
export type CreatePostsPollReplySettings =
  | "following"
  | "mentionedUsers"
  | "subscribers"
  | "verified";
export const CreatePostsPollReplySettings = /*@__PURE__*/ S.String;

export interface CreatePostsPoll {
  /** Duration of the poll in minutes. */
  duration_minutes: number;
  /** Poll options (2-4 choices, 1-25 characters each). */
  options: CreatePostsPollOptionsList;
  /** Who can reply to the poll Tweet. Accepted for compatibility; it carries no backend argument and is dropped before the mutation is issued (see `translate_body`). */
  reply_settings?: CreatePostsPollReplySettings | (string & {});
}
export const CreatePostsPoll = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    duration_minutes: S.Number,
    options: CreatePostsPollOptionsList,
    reply_settings: S.optional(CreatePostsPollReplySettings),
  }),
).annotate({
  identifier: "CreatePostsPoll",
}) as any as S.Schema<CreatePostsPoll>;

/** User IDs to exclude from the reply thread. */
export type CreatePostsReplyExcludeReplyUserIdsList = Array<string>;
export const CreatePostsReplyExcludeReplyUserIdsList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<CreatePostsReplyExcludeReplyUserIdsList>;

export interface CreatePostsReply {
  /** If true, reply metadata is automatically populated. Accepted for compatibility; it carries no backend argument and is dropped before the mutation is issued (see `translate_body`). */
  auto_populate_reply_metadata?: boolean;
  /** User IDs to exclude from the reply thread. */
  exclude_reply_user_ids?: CreatePostsReplyExcludeReplyUserIdsList;
  /** The ID of the tweet being replied to. */
  in_reply_to_tweet_id: string;
}
export const CreatePostsReply = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    auto_populate_reply_metadata: S.optional(S.Boolean),
    exclude_reply_user_ids: S.optional(CreatePostsReplyExcludeReplyUserIdsList),
    in_reply_to_tweet_id: S.String,
  }),
).annotate({
  identifier: "CreatePostsReply",
}) as any as S.Schema<CreatePostsReply>;

/** Who can reply to this tweet. */
export type CreatePostsRequestReplySettings =
  | "following"
  | "mentionedUsers"
  | "subscribers"
  | "verified";
export const CreatePostsRequestReplySettings = /*@__PURE__*/ S.String;

export interface CreatePostsRequest {
  /** Card URI parameter. */
  card_uri?: string;
  /** Community to post the tweet to. */
  community_id?: string;
  /** Direct message deep link. */
  direct_message_deep_link?: string;
  /** Edit an existing tweet rather than creating a new one. */
  edit_options?: CreatePostsEditOptions;
  /** Restrict tweet to super followers. */
  for_super_followers_only?: boolean;
  /** Geo location for the tweet. */
  geo?: CreatePostsGeo;
  /** Disclose that the tweet contains AI-generated media. */
  made_with_ai?: boolean;
  /** Media attachments. */
  media?: CreatePostsMedia;
  /** If true, the tweet is not shown in the public timeline. */
  nullcast?: boolean;
  /** Disclose that the tweet is a paid partnership. */
  paid_partnership?: boolean;
  /** Poll configuration. */
  poll?: CreatePostsPoll;
  /** Tweet ID to quote. */
  quote_tweet_id?: string;
  /** Tweet reply configuration. */
  reply?: CreatePostsReply;
  /** Who can reply to this tweet. */
  reply_settings?: CreatePostsRequestReplySettings | (string & {});
  /** Share an exclusive (super-follower) tweet with all followers. */
  share_with_followers?: boolean;
  /** Text of the tweet. Required unless media is provided. Defaulted to an empty string so it is always sent: the backend's `tweet_text` variable is non-null and rejects an absent value. */
  text?: string;
}
export const CreatePostsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    card_uri: S.optional(S.String),
    community_id: S.optional(S.String),
    direct_message_deep_link: S.optional(S.String),
    edit_options: S.optional(CreatePostsEditOptions),
    for_super_followers_only: S.optional(S.Boolean),
    geo: S.optional(CreatePostsGeo),
    made_with_ai: S.optional(S.Boolean),
    media: S.optional(CreatePostsMedia),
    nullcast: S.optional(S.Boolean),
    paid_partnership: S.optional(S.Boolean),
    poll: S.optional(CreatePostsPoll),
    quote_tweet_id: S.optional(S.String),
    reply: S.optional(CreatePostsReply),
    reply_settings: S.optional(CreatePostsRequestReplySettings),
    share_with_followers: S.optional(S.Boolean),
    text: S.optional(S.String),
  }).pipe(T.Http({ method: "POST", uri: "/2/tweets", code: 200 })),
).annotate({
  identifier: "CreatePostsRequest",
}) as any as S.Schema<CreatePostsRequest>;

/** Post IDs in this Post's edit history chain. */
export type CreatePostsResponseDataEditHistoryPostIdsList = Array<string>;
export const CreatePostsResponseDataEditHistoryPostIdsList =
  /*@__PURE__*/ S.Array(
    S.String,
  ) as any as S.Schema<CreatePostsResponseDataEditHistoryPostIdsList>;

export interface CreatePostsResponseData {
  /** Post IDs in this Post's edit history chain. */
  edit_history_post_ids?: CreatePostsResponseDataEditHistoryPostIdsList;
  /** Unique identifier of the created Post. */
  id: string;
  /** The content of the created Post. */
  text: string;
}
export const CreatePostsResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    edit_history_post_ids: S.optional(
      CreatePostsResponseDataEditHistoryPostIdsList,
    ),
    id: S.String,
    text: S.String,
  }),
).annotate({
  identifier: "CreatePostsResponseData",
}) as any as S.Schema<CreatePostsResponseData>;

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
export type CreatePostsResponseErrorsList = Array<Problem>;
export const CreatePostsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<CreatePostsResponseErrorsList>;

export interface CreatePostsResponse {
  data?: CreatePostsResponseData;
  errors?: CreatePostsResponseErrorsList;
}
export const CreatePostsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(CreatePostsResponseData),
    errors: S.optional(CreatePostsResponseErrorsList),
  }),
).annotate({
  identifier: "CreatePostsResponse",
}) as any as S.Schema<CreatePostsResponse>;

export interface CreateUsersBookmarkRequest {
  id: string;
  /** Optional ID of the Bookmark folder to add the Post to. When omitted, the Post is added to the user's top-level Bookmarks only. */
  folder_id?: string;
  /** The ID of the Post to add to the user's Bookmarks. */
  tweet_id: string;
}
export const CreateUsersBookmarkRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    folder_id: S.optional(S.String),
    tweet_id: S.String,
  }).pipe(
    T.Http({ method: "POST", uri: "/2/users/{id}/bookmarks", code: 200 }),
  ),
).annotate({
  identifier: "CreateUsersBookmarkRequest",
}) as any as S.Schema<CreateUsersBookmarkRequest>;

export interface CreateUsersBookmarkResponseData {
  /** Indicates whether the Post is bookmarked by the user. */
  bookmarked: boolean;
}
export const CreateUsersBookmarkResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    bookmarked: S.Boolean,
  }),
).annotate({
  identifier: "CreateUsersBookmarkResponseData",
}) as any as S.Schema<CreateUsersBookmarkResponseData>;

export type CreateUsersBookmarkResponseErrorsList = Array<Problem>;
export const CreateUsersBookmarkResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<CreateUsersBookmarkResponseErrorsList>;

export interface CreateUsersBookmarkResponse {
  data?: CreateUsersBookmarkResponseData;
  errors?: CreateUsersBookmarkResponseErrorsList;
}
export const CreateUsersBookmarkResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(CreateUsersBookmarkResponseData),
    errors: S.optional(CreateUsersBookmarkResponseErrorsList),
  }),
).annotate({
  identifier: "CreateUsersBookmarkResponse",
}) as any as S.Schema<CreateUsersBookmarkResponse>;

export interface DeletePostsRequest {
  id: string;
}
export const DeletePostsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
  }).pipe(T.Http({ method: "DELETE", uri: "/2/tweets/{id}", code: 200 })),
).annotate({
  identifier: "DeletePostsRequest",
}) as any as S.Schema<DeletePostsRequest>;

export interface DeletePostsResponseData {
  /** Whether the Post was deleted. */
  deleted: boolean;
}
export const DeletePostsResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    deleted: S.Boolean,
  }),
).annotate({
  identifier: "DeletePostsResponseData",
}) as any as S.Schema<DeletePostsResponseData>;

export type DeletePostsResponseErrorsList = Array<Problem>;
export const DeletePostsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<DeletePostsResponseErrorsList>;

export interface DeletePostsResponse {
  data?: DeletePostsResponseData;
  errors?: DeletePostsResponseErrorsList;
}
export const DeletePostsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(DeletePostsResponseData),
    errors: S.optional(DeletePostsResponseErrorsList),
  }),
).annotate({
  identifier: "DeletePostsResponse",
}) as any as S.Schema<DeletePostsResponse>;

export type GetPostsAnalyticsRequestIdsList = Array<string>;
export const GetPostsAnalyticsRequestIdsList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<GetPostsAnalyticsRequestIdsList>;

export type GetPostsAnalyticsRequestGranularity =
  | "hourly"
  | "weekly"
  | "daily"
  | "total";
export const GetPostsAnalyticsRequestGranularity = /*@__PURE__*/ S.String;

export type GetPostsAnalyticsRequestAnalyticsFieldsItem =
  | "app_install_attempts"
  | "app_opens"
  | "bookmarks"
  | "detail_expands"
  | "email_tweet"
  | "engagements"
  | "follows"
  | "hashtag_clicks"
  | "id"
  | "impressions"
  | "likes"
  | "media_views"
  | "permalink_clicks"
  | "quote_tweets"
  | "replies"
  | "retweets"
  | "shares"
  | "timestamp"
  | "timestamped_metrics"
  | "unfollows"
  | "unlikes"
  | "url_clicks"
  | "user_profile_clicks";
export const GetPostsAnalyticsRequestAnalyticsFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a Analytics object. */
export type GetPostsAnalyticsRequestAnalyticsFieldsList = Array<
  GetPostsAnalyticsRequestAnalyticsFieldsItem | (string & {})
>;
export const GetPostsAnalyticsRequestAnalyticsFieldsList =
  /*@__PURE__*/ S.Array(
    GetPostsAnalyticsRequestAnalyticsFieldsItem,
  ) as any as S.Schema<GetPostsAnalyticsRequestAnalyticsFieldsList>;

export interface GetPostsAnalyticsRequest {
  ids: GetPostsAnalyticsRequestIdsList;
  start_time: string;
  end_time: string;
  granularity?: GetPostsAnalyticsRequestGranularity | (string & {});
  /** A comma separated list of Analytics fields to display. */
  analytics_fields?: GetPostsAnalyticsRequestAnalyticsFieldsList;
}
export const GetPostsAnalyticsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    ids: GetPostsAnalyticsRequestIdsList.pipe(T.Query()),
    start_time: S.String.pipe(T.Query()),
    end_time: S.String.pipe(T.Query()),
    granularity: S.optional(
      GetPostsAnalyticsRequestGranularity.pipe(T.Query()),
    ),
    analytics_fields: S.optional(
      GetPostsAnalyticsRequestAnalyticsFieldsList.pipe(
        T.Query("analytics.fields"),
      ),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/tweets/analytics", code: 200 })),
).annotate({
  identifier: "GetPostsAnalyticsRequest",
}) as any as S.Schema<GetPostsAnalyticsRequest>;

/** Engagement metric counts for this bucket. */
export interface AnalyticsTimestampedMetricsItemMetrics {
  app_install_attempts?: number | null;
  app_opens?: number | null;
  bookmarks?: number | null;
  detail_expands?: number | null;
  email_tweet?: number | null;
  engagements?: number | null;
  follows?: number | null;
  hashtag_clicks?: number | null;
  impressions?: number | null;
  likes?: number | null;
  media_views?: number | null;
  permalink_clicks?: number | null;
  quote_tweets?: number | null;
  replies?: number | null;
  retweets?: number | null;
  shares?: number | null;
  unfollows?: number | null;
  unlikes?: number | null;
  url_clicks?: number | null;
  user_profile_clicks?: number | null;
}
export const AnalyticsTimestampedMetricsItemMetrics = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      app_install_attempts: S.optional(S.NullOr(S.Number)),
      app_opens: S.optional(S.NullOr(S.Number)),
      bookmarks: S.optional(S.NullOr(S.Number)),
      detail_expands: S.optional(S.NullOr(S.Number)),
      email_tweet: S.optional(S.NullOr(S.Number)),
      engagements: S.optional(S.NullOr(S.Number)),
      follows: S.optional(S.NullOr(S.Number)),
      hashtag_clicks: S.optional(S.NullOr(S.Number)),
      impressions: S.optional(S.NullOr(S.Number)),
      likes: S.optional(S.NullOr(S.Number)),
      media_views: S.optional(S.NullOr(S.Number)),
      permalink_clicks: S.optional(S.NullOr(S.Number)),
      quote_tweets: S.optional(S.NullOr(S.Number)),
      replies: S.optional(S.NullOr(S.Number)),
      retweets: S.optional(S.NullOr(S.Number)),
      shares: S.optional(S.NullOr(S.Number)),
      unfollows: S.optional(S.NullOr(S.Number)),
      unlikes: S.optional(S.NullOr(S.Number)),
      url_clicks: S.optional(S.NullOr(S.Number)),
      user_profile_clicks: S.optional(S.NullOr(S.Number)),
    }),
).annotate({
  identifier: "AnalyticsTimestampedMetricsItemMetrics",
}) as any as S.Schema<AnalyticsTimestampedMetricsItemMetrics>;

export interface AnalyticsTimestampedMetricsItem {
  /** Engagement metric counts for this bucket. */
  metrics?: AnalyticsTimestampedMetricsItemMetrics | null;
  /** Start of the metrics bucket, as an ISO 8601 date-time. */
  timestamp?: string | null;
}
export const AnalyticsTimestampedMetricsItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    metrics: S.optional(S.NullOr(AnalyticsTimestampedMetricsItemMetrics)),
    timestamp: S.optional(S.NullOr(S.String)),
  }),
).annotate({
  identifier: "AnalyticsTimestampedMetricsItem",
}) as any as S.Schema<AnalyticsTimestampedMetricsItem>;

/** Time-bucketed engagement metrics for the Post, one entry per granularity bucket. */
export type AnalyticsTimestampedMetrics =
  Array<AnalyticsTimestampedMetricsItem>;
export const AnalyticsTimestampedMetrics = /*@__PURE__*/ S.Array(
  AnalyticsTimestampedMetricsItem,
) as any as S.Schema<AnalyticsTimestampedMetrics>;

export interface Analytics {
  app_install_attempts?: number;
  app_opens?: number;
  bookmarks?: number;
  detail_expands?: number;
  email_tweet?: number;
  engagements?: number;
  follows?: number;
  hashtag_clicks?: number;
  id?: string;
  impressions?: number;
  likes?: number;
  media_views?: number;
  permalink_clicks?: number;
  quote_tweets?: number;
  replies?: number;
  retweets?: number;
  shares?: number;
  timestamp?: string;
  timestamped_metrics?: AnalyticsTimestampedMetrics;
  unfollows?: number;
  unlikes?: number;
  url_clicks?: number;
  user_profile_clicks?: number;
}
export const Analytics = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    app_install_attempts: S.optional(S.Number),
    app_opens: S.optional(S.Number),
    bookmarks: S.optional(S.Number),
    detail_expands: S.optional(S.Number),
    email_tweet: S.optional(S.Number),
    engagements: S.optional(S.Number),
    follows: S.optional(S.Number),
    hashtag_clicks: S.optional(S.Number),
    id: S.optional(S.String),
    impressions: S.optional(S.Number),
    likes: S.optional(S.Number),
    media_views: S.optional(S.Number),
    permalink_clicks: S.optional(S.Number),
    quote_tweets: S.optional(S.Number),
    replies: S.optional(S.Number),
    retweets: S.optional(S.Number),
    shares: S.optional(S.Number),
    timestamp: S.optional(S.String),
    timestamped_metrics: S.optional(AnalyticsTimestampedMetrics),
    unfollows: S.optional(S.Number),
    unlikes: S.optional(S.Number),
    url_clicks: S.optional(S.Number),
    user_profile_clicks: S.optional(S.Number),
  }),
).annotate({ identifier: "Analytics" }) as any as S.Schema<Analytics>;

export type GetPostsAnalyticsResponseDataList = Array<Analytics>;
export const GetPostsAnalyticsResponseDataList = /*@__PURE__*/ S.Array(
  Analytics,
) as any as S.Schema<GetPostsAnalyticsResponseDataList>;

export type GetPostsAnalyticsResponseErrorsList = Array<Problem>;
export const GetPostsAnalyticsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetPostsAnalyticsResponseErrorsList>;

export interface GetPostsAnalyticsResponse {
  data?: GetPostsAnalyticsResponseDataList;
  errors?: GetPostsAnalyticsResponseErrorsList;
}
export const GetPostsAnalyticsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetPostsAnalyticsResponseDataList),
    errors: S.optional(GetPostsAnalyticsResponseErrorsList),
  }),
).annotate({
  identifier: "GetPostsAnalyticsResponse",
}) as any as S.Schema<GetPostsAnalyticsResponse>;

export type GetPostsByIdRequestPostFieldsItem =
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
export const GetPostsByIdRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetPostsByIdRequestPostFieldsList = Array<
  GetPostsByIdRequestPostFieldsItem | (string & {})
>;
export const GetPostsByIdRequestPostFieldsList = /*@__PURE__*/ S.Array(
  GetPostsByIdRequestPostFieldsItem,
) as any as S.Schema<GetPostsByIdRequestPostFieldsList>;

export type GetPostsByIdRequestExpansionsItem =
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
export const GetPostsByIdRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetPostsByIdRequestExpansionsList = Array<
  GetPostsByIdRequestExpansionsItem | (string & {})
>;
export const GetPostsByIdRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetPostsByIdRequestExpansionsItem,
) as any as S.Schema<GetPostsByIdRequestExpansionsList>;

export type GetPostsByIdRequestUserFieldsItem =
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
export const GetPostsByIdRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetPostsByIdRequestUserFieldsList = Array<
  GetPostsByIdRequestUserFieldsItem | (string & {})
>;
export const GetPostsByIdRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetPostsByIdRequestUserFieldsItem,
) as any as S.Schema<GetPostsByIdRequestUserFieldsList>;

export type GetPostsByIdRequestMediaFieldsItem =
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
export const GetPostsByIdRequestMediaFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Media object. */
export type GetPostsByIdRequestMediaFieldsList = Array<
  GetPostsByIdRequestMediaFieldsItem | (string & {})
>;
export const GetPostsByIdRequestMediaFieldsList = /*@__PURE__*/ S.Array(
  GetPostsByIdRequestMediaFieldsItem,
) as any as S.Schema<GetPostsByIdRequestMediaFieldsList>;

export type GetPostsByIdRequestPollFieldsItem =
  | "duration_minutes"
  | "end_datetime"
  | "id"
  | "options"
  | "voting_status";
export const GetPostsByIdRequestPollFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Poll object. */
export type GetPostsByIdRequestPollFieldsList = Array<
  GetPostsByIdRequestPollFieldsItem | (string & {})
>;
export const GetPostsByIdRequestPollFieldsList = /*@__PURE__*/ S.Array(
  GetPostsByIdRequestPollFieldsItem,
) as any as S.Schema<GetPostsByIdRequestPollFieldsList>;

export type GetPostsByIdRequestPlaceFieldsItem =
  | "contained_within"
  | "country"
  | "country_code"
  | "full_name"
  | "geo"
  | "id"
  | "name"
  | "place_type";
export const GetPostsByIdRequestPlaceFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Place object. */
export type GetPostsByIdRequestPlaceFieldsList = Array<
  GetPostsByIdRequestPlaceFieldsItem | (string & {})
>;
export const GetPostsByIdRequestPlaceFieldsList = /*@__PURE__*/ S.Array(
  GetPostsByIdRequestPlaceFieldsItem,
) as any as S.Schema<GetPostsByIdRequestPlaceFieldsList>;

export interface GetPostsByIdRequest {
  id: string;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetPostsByIdRequestPostFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetPostsByIdRequestExpansionsList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetPostsByIdRequestUserFieldsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: GetPostsByIdRequestMediaFieldsList;
  /** A comma separated list of Poll fields to display. */
  poll_fields?: GetPostsByIdRequestPollFieldsList;
  /** A comma separated list of Place fields to display. */
  place_fields?: GetPostsByIdRequestPlaceFieldsList;
}
export const GetPostsByIdRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    post_fields: S.optional(
      GetPostsByIdRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
    expansions: S.optional(GetPostsByIdRequestExpansionsList.pipe(T.Query())),
    user_fields: S.optional(
      GetPostsByIdRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    media_fields: S.optional(
      GetPostsByIdRequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
    poll_fields: S.optional(
      GetPostsByIdRequestPollFieldsList.pipe(T.Query("poll.fields")),
    ),
    place_fields: S.optional(
      GetPostsByIdRequestPlaceFieldsList.pipe(T.Query("place.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/tweets/{id}", code: 200 })),
).annotate({
  identifier: "GetPostsByIdRequest",
}) as any as S.Schema<GetPostsByIdRequest>;

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
export interface PostEntitiesCashtagsItem {
  /** End index in the text (exclusive). */
  end: number;
  /** Start index in the text (inclusive). */
  start: number;
  tag: string;
}
export const PostEntitiesCashtagsItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    end: S.Number,
    start: S.Number,
    tag: S.String,
  }),
).annotate({
  identifier: "PostEntitiesCashtagsItem",
}) as any as S.Schema<PostEntitiesCashtagsItem>;

export type PostEntitiesCashtagsList = Array<PostEntitiesCashtagsItem>;
export const PostEntitiesCashtagsList = /*@__PURE__*/ S.Array(
  PostEntitiesCashtagsItem,
) as any as S.Schema<PostEntitiesCashtagsList>;

/** A hashtag or cashtag entity. */
export type PostEntitiesHashtagsItem = PostEntitiesCashtagsItem;
export const PostEntitiesHashtagsItem = PostEntitiesCashtagsItem;

export type PostEntitiesHashtagsList = Array<PostEntitiesCashtagsItem>;
export const PostEntitiesHashtagsList = /*@__PURE__*/ S.Array(
  PostEntitiesCashtagsItem,
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
export interface PostEntitiesUrlsItemImagesItem {
  height?: number | null;
  url?: string | null;
  width?: number | null;
}
export const PostEntitiesUrlsItemImagesItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    height: S.optional(S.NullOr(S.Number)),
    url: S.optional(S.NullOr(S.String)),
    width: S.optional(S.NullOr(S.Number)),
  }),
).annotate({
  identifier: "PostEntitiesUrlsItemImagesItem",
}) as any as S.Schema<PostEntitiesUrlsItemImagesItem>;

export type PostEntitiesUrlsItemImagesList =
  Array<PostEntitiesUrlsItemImagesItem>;
export const PostEntitiesUrlsItemImagesList = /*@__PURE__*/ S.Array(
  PostEntitiesUrlsItemImagesItem,
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
export type PostNotePostEntitiesCashtagsItem = PostEntitiesCashtagsItem;
export const PostNotePostEntitiesCashtagsItem = PostEntitiesCashtagsItem;

export type PostNotePostEntitiesCashtagsList = Array<PostEntitiesCashtagsItem>;
export const PostNotePostEntitiesCashtagsList = /*@__PURE__*/ S.Array(
  PostEntitiesCashtagsItem,
) as any as S.Schema<PostNotePostEntitiesCashtagsList>;

/** A hashtag or cashtag entity. */
export type PostNotePostEntitiesHashtagsItem = PostEntitiesCashtagsItem;
export const PostNotePostEntitiesHashtagsItem = PostEntitiesCashtagsItem;

export type PostNotePostEntitiesHashtagsList = Array<PostEntitiesCashtagsItem>;
export const PostNotePostEntitiesHashtagsList = /*@__PURE__*/ S.Array(
  PostEntitiesCashtagsItem,
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

export type GetPostsByIdResponseErrorsList = Array<Problem>;
export const GetPostsByIdResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetPostsByIdResponseErrorsList>;

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
export type UserEntitiesDescriptionCashtagsItem = PostEntitiesCashtagsItem;
export const UserEntitiesDescriptionCashtagsItem = PostEntitiesCashtagsItem;

export type UserEntitiesDescriptionCashtagsList =
  Array<PostEntitiesCashtagsItem>;
export const UserEntitiesDescriptionCashtagsList = /*@__PURE__*/ S.Array(
  PostEntitiesCashtagsItem,
) as any as S.Schema<UserEntitiesDescriptionCashtagsList>;

/** A hashtag or cashtag entity. */
export type UserEntitiesDescriptionHashtagsItem = PostEntitiesCashtagsItem;
export const UserEntitiesDescriptionHashtagsItem = PostEntitiesCashtagsItem;

export type UserEntitiesDescriptionHashtagsList =
  Array<PostEntitiesCashtagsItem>;
export const UserEntitiesDescriptionHashtagsList = /*@__PURE__*/ S.Array(
  PostEntitiesCashtagsItem,
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
export type UserEntitiesDescriptionUrlsItemImagesItem =
  PostEntitiesUrlsItemImagesItem;
export const UserEntitiesDescriptionUrlsItemImagesItem =
  PostEntitiesUrlsItemImagesItem;

export type UserEntitiesDescriptionUrlsItemImagesList =
  Array<PostEntitiesUrlsItemImagesItem>;
export const UserEntitiesDescriptionUrlsItemImagesList = /*@__PURE__*/ S.Array(
  PostEntitiesUrlsItemImagesItem,
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
export type UserEntitiesUrlUrlsItemImagesItem = PostEntitiesUrlsItemImagesItem;
export const UserEntitiesUrlUrlsItemImagesItem = PostEntitiesUrlsItemImagesItem;

export type UserEntitiesUrlUrlsItemImagesList =
  Array<PostEntitiesUrlsItemImagesItem>;
export const UserEntitiesUrlUrlsItemImagesList = /*@__PURE__*/ S.Array(
  PostEntitiesUrlsItemImagesItem,
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

export interface GetPostsByIdResponse {
  data?: Post;
  errors?: GetPostsByIdResponseErrorsList;
  includes?: Expansions;
}
export const GetPostsByIdResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(Post),
    errors: S.optional(GetPostsByIdResponseErrorsList),
    includes: S.optional(Expansions),
  }),
).annotate({
  identifier: "GetPostsByIdResponse",
}) as any as S.Schema<GetPostsByIdResponse>;

export type GetPostsByIdsRequestIdsList = Array<string>;
export const GetPostsByIdsRequestIdsList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<GetPostsByIdsRequestIdsList>;

export type GetPostsByIdsRequestPostFieldsItem =
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
export const GetPostsByIdsRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetPostsByIdsRequestPostFieldsList = Array<
  GetPostsByIdsRequestPostFieldsItem | (string & {})
>;
export const GetPostsByIdsRequestPostFieldsList = /*@__PURE__*/ S.Array(
  GetPostsByIdsRequestPostFieldsItem,
) as any as S.Schema<GetPostsByIdsRequestPostFieldsList>;

export type GetPostsByIdsRequestExpansionsItem =
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
export const GetPostsByIdsRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetPostsByIdsRequestExpansionsList = Array<
  GetPostsByIdsRequestExpansionsItem | (string & {})
>;
export const GetPostsByIdsRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetPostsByIdsRequestExpansionsItem,
) as any as S.Schema<GetPostsByIdsRequestExpansionsList>;

export type GetPostsByIdsRequestUserFieldsItem =
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
export const GetPostsByIdsRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetPostsByIdsRequestUserFieldsList = Array<
  GetPostsByIdsRequestUserFieldsItem | (string & {})
>;
export const GetPostsByIdsRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetPostsByIdsRequestUserFieldsItem,
) as any as S.Schema<GetPostsByIdsRequestUserFieldsList>;

export type GetPostsByIdsRequestMediaFieldsItem =
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
export const GetPostsByIdsRequestMediaFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Media object. */
export type GetPostsByIdsRequestMediaFieldsList = Array<
  GetPostsByIdsRequestMediaFieldsItem | (string & {})
>;
export const GetPostsByIdsRequestMediaFieldsList = /*@__PURE__*/ S.Array(
  GetPostsByIdsRequestMediaFieldsItem,
) as any as S.Schema<GetPostsByIdsRequestMediaFieldsList>;

export type GetPostsByIdsRequestPollFieldsItem =
  | "duration_minutes"
  | "end_datetime"
  | "id"
  | "options"
  | "voting_status";
export const GetPostsByIdsRequestPollFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Poll object. */
export type GetPostsByIdsRequestPollFieldsList = Array<
  GetPostsByIdsRequestPollFieldsItem | (string & {})
>;
export const GetPostsByIdsRequestPollFieldsList = /*@__PURE__*/ S.Array(
  GetPostsByIdsRequestPollFieldsItem,
) as any as S.Schema<GetPostsByIdsRequestPollFieldsList>;

export type GetPostsByIdsRequestPlaceFieldsItem =
  | "contained_within"
  | "country"
  | "country_code"
  | "full_name"
  | "geo"
  | "id"
  | "name"
  | "place_type";
export const GetPostsByIdsRequestPlaceFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Place object. */
export type GetPostsByIdsRequestPlaceFieldsList = Array<
  GetPostsByIdsRequestPlaceFieldsItem | (string & {})
>;
export const GetPostsByIdsRequestPlaceFieldsList = /*@__PURE__*/ S.Array(
  GetPostsByIdsRequestPlaceFieldsItem,
) as any as S.Schema<GetPostsByIdsRequestPlaceFieldsList>;

export interface GetPostsByIdsRequest {
  ids: GetPostsByIdsRequestIdsList;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetPostsByIdsRequestPostFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetPostsByIdsRequestExpansionsList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetPostsByIdsRequestUserFieldsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: GetPostsByIdsRequestMediaFieldsList;
  /** A comma separated list of Poll fields to display. */
  poll_fields?: GetPostsByIdsRequestPollFieldsList;
  /** A comma separated list of Place fields to display. */
  place_fields?: GetPostsByIdsRequestPlaceFieldsList;
}
export const GetPostsByIdsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    ids: GetPostsByIdsRequestIdsList.pipe(T.Query()),
    post_fields: S.optional(
      GetPostsByIdsRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
    expansions: S.optional(GetPostsByIdsRequestExpansionsList.pipe(T.Query())),
    user_fields: S.optional(
      GetPostsByIdsRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    media_fields: S.optional(
      GetPostsByIdsRequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
    poll_fields: S.optional(
      GetPostsByIdsRequestPollFieldsList.pipe(T.Query("poll.fields")),
    ),
    place_fields: S.optional(
      GetPostsByIdsRequestPlaceFieldsList.pipe(T.Query("place.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/tweets", code: 200 })),
).annotate({
  identifier: "GetPostsByIdsRequest",
}) as any as S.Schema<GetPostsByIdsRequest>;

export type GetPostsByIdsResponseDataList = Array<Post>;
export const GetPostsByIdsResponseDataList = /*@__PURE__*/ S.Array(
  Post,
) as any as S.Schema<GetPostsByIdsResponseDataList>;

export type GetPostsByIdsResponseErrorsList = Array<Problem>;
export const GetPostsByIdsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetPostsByIdsResponseErrorsList>;

export interface GetPostsByIdsResponseMeta {
  /** Number of items in the data array. */
  result_count?: number;
}
export const GetPostsByIdsResponseMeta = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    result_count: S.optional(S.Number),
  }),
).annotate({
  identifier: "GetPostsByIdsResponseMeta",
}) as any as S.Schema<GetPostsByIdsResponseMeta>;

export interface GetPostsByIdsResponse {
  data?: GetPostsByIdsResponseDataList;
  errors?: GetPostsByIdsResponseErrorsList;
  includes?: Expansions;
  meta?: GetPostsByIdsResponseMeta;
}
export const GetPostsByIdsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetPostsByIdsResponseDataList),
    errors: S.optional(GetPostsByIdsResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(GetPostsByIdsResponseMeta),
  }),
).annotate({
  identifier: "GetPostsByIdsResponse",
}) as any as S.Schema<GetPostsByIdsResponse>;

export type GetPostsQuotedPostsRequestExcludeItem = "replies" | "retweets";
export const GetPostsQuotedPostsRequestExcludeItem = /*@__PURE__*/ S.String;

export type GetPostsQuotedPostsRequestExcludeList = Array<
  GetPostsQuotedPostsRequestExcludeItem | (string & {})
>;
export const GetPostsQuotedPostsRequestExcludeList = /*@__PURE__*/ S.Array(
  GetPostsQuotedPostsRequestExcludeItem,
) as any as S.Schema<GetPostsQuotedPostsRequestExcludeList>;

export type GetPostsQuotedPostsRequestPostFieldsItem =
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
export const GetPostsQuotedPostsRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetPostsQuotedPostsRequestPostFieldsList = Array<
  GetPostsQuotedPostsRequestPostFieldsItem | (string & {})
>;
export const GetPostsQuotedPostsRequestPostFieldsList = /*@__PURE__*/ S.Array(
  GetPostsQuotedPostsRequestPostFieldsItem,
) as any as S.Schema<GetPostsQuotedPostsRequestPostFieldsList>;

export type GetPostsQuotedPostsRequestExpansionsItem =
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
export const GetPostsQuotedPostsRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetPostsQuotedPostsRequestExpansionsList = Array<
  GetPostsQuotedPostsRequestExpansionsItem | (string & {})
>;
export const GetPostsQuotedPostsRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetPostsQuotedPostsRequestExpansionsItem,
) as any as S.Schema<GetPostsQuotedPostsRequestExpansionsList>;

export type GetPostsQuotedPostsRequestUserFieldsItem =
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
export const GetPostsQuotedPostsRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetPostsQuotedPostsRequestUserFieldsList = Array<
  GetPostsQuotedPostsRequestUserFieldsItem | (string & {})
>;
export const GetPostsQuotedPostsRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetPostsQuotedPostsRequestUserFieldsItem,
) as any as S.Schema<GetPostsQuotedPostsRequestUserFieldsList>;

export type GetPostsQuotedPostsRequestMediaFieldsItem =
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
export const GetPostsQuotedPostsRequestMediaFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Media object. */
export type GetPostsQuotedPostsRequestMediaFieldsList = Array<
  GetPostsQuotedPostsRequestMediaFieldsItem | (string & {})
>;
export const GetPostsQuotedPostsRequestMediaFieldsList = /*@__PURE__*/ S.Array(
  GetPostsQuotedPostsRequestMediaFieldsItem,
) as any as S.Schema<GetPostsQuotedPostsRequestMediaFieldsList>;

export type GetPostsQuotedPostsRequestPollFieldsItem =
  | "duration_minutes"
  | "end_datetime"
  | "id"
  | "options"
  | "voting_status";
export const GetPostsQuotedPostsRequestPollFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Poll object. */
export type GetPostsQuotedPostsRequestPollFieldsList = Array<
  GetPostsQuotedPostsRequestPollFieldsItem | (string & {})
>;
export const GetPostsQuotedPostsRequestPollFieldsList = /*@__PURE__*/ S.Array(
  GetPostsQuotedPostsRequestPollFieldsItem,
) as any as S.Schema<GetPostsQuotedPostsRequestPollFieldsList>;

export type GetPostsQuotedPostsRequestPlaceFieldsItem =
  | "contained_within"
  | "country"
  | "country_code"
  | "full_name"
  | "geo"
  | "id"
  | "name"
  | "place_type";
export const GetPostsQuotedPostsRequestPlaceFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Place object. */
export type GetPostsQuotedPostsRequestPlaceFieldsList = Array<
  GetPostsQuotedPostsRequestPlaceFieldsItem | (string & {})
>;
export const GetPostsQuotedPostsRequestPlaceFieldsList = /*@__PURE__*/ S.Array(
  GetPostsQuotedPostsRequestPlaceFieldsItem,
) as any as S.Schema<GetPostsQuotedPostsRequestPlaceFieldsList>;

export interface GetPostsQuotedPostsRequest {
  id: string;
  max_results?: number;
  /** A base32hex-encoded pagination token. */
  pagination_token?: string;
  exclude?: GetPostsQuotedPostsRequestExcludeList;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetPostsQuotedPostsRequestPostFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetPostsQuotedPostsRequestExpansionsList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetPostsQuotedPostsRequestUserFieldsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: GetPostsQuotedPostsRequestMediaFieldsList;
  /** A comma separated list of Poll fields to display. */
  poll_fields?: GetPostsQuotedPostsRequestPollFieldsList;
  /** A comma separated list of Place fields to display. */
  place_fields?: GetPostsQuotedPostsRequestPlaceFieldsList;
}
export const GetPostsQuotedPostsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
    exclude: S.optional(GetPostsQuotedPostsRequestExcludeList.pipe(T.Query())),
    post_fields: S.optional(
      GetPostsQuotedPostsRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
    expansions: S.optional(
      GetPostsQuotedPostsRequestExpansionsList.pipe(T.Query()),
    ),
    user_fields: S.optional(
      GetPostsQuotedPostsRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    media_fields: S.optional(
      GetPostsQuotedPostsRequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
    poll_fields: S.optional(
      GetPostsQuotedPostsRequestPollFieldsList.pipe(T.Query("poll.fields")),
    ),
    place_fields: S.optional(
      GetPostsQuotedPostsRequestPlaceFieldsList.pipe(T.Query("place.fields")),
    ),
  }).pipe(
    T.Http({ method: "GET", uri: "/2/tweets/{id}/quote_tweets", code: 200 }),
  ),
).annotate({
  identifier: "GetPostsQuotedPostsRequest",
}) as any as S.Schema<GetPostsQuotedPostsRequest>;

export type GetPostsQuotedPostsResponseDataList = Array<Post>;
export const GetPostsQuotedPostsResponseDataList = /*@__PURE__*/ S.Array(
  Post,
) as any as S.Schema<GetPostsQuotedPostsResponseDataList>;

export type GetPostsQuotedPostsResponseErrorsList = Array<Problem>;
export const GetPostsQuotedPostsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetPostsQuotedPostsResponseErrorsList>;

export interface GetPostsQuotedPostsResponseMeta {
  /** Pagination token for the next page of results. */
  next_token?: string;
  /** Number of items in the data array. */
  result_count?: number;
}
export const GetPostsQuotedPostsResponseMeta = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    next_token: S.optional(S.String),
    result_count: S.optional(S.Number),
  }),
).annotate({
  identifier: "GetPostsQuotedPostsResponseMeta",
}) as any as S.Schema<GetPostsQuotedPostsResponseMeta>;

export interface GetPostsQuotedPostsResponse {
  data?: GetPostsQuotedPostsResponseDataList;
  errors?: GetPostsQuotedPostsResponseErrorsList;
  includes?: Expansions;
  meta?: GetPostsQuotedPostsResponseMeta;
}
export const GetPostsQuotedPostsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetPostsQuotedPostsResponseDataList),
    errors: S.optional(GetPostsQuotedPostsResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(GetPostsQuotedPostsResponseMeta),
  }),
).annotate({
  identifier: "GetPostsQuotedPostsResponse",
}) as any as S.Schema<GetPostsQuotedPostsResponse>;

export type GetPostsRepostedByRequestUserFieldsItem =
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
export const GetPostsRepostedByRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetPostsRepostedByRequestUserFieldsList = Array<
  GetPostsRepostedByRequestUserFieldsItem | (string & {})
>;
export const GetPostsRepostedByRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetPostsRepostedByRequestUserFieldsItem,
) as any as S.Schema<GetPostsRepostedByRequestUserFieldsList>;

export type GetPostsRepostedByRequestExpansionsItem =
  | "affiliation"
  | "most_recent_post_id"
  | "pinned_post_id";
export const GetPostsRepostedByRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetPostsRepostedByRequestExpansionsList = Array<
  GetPostsRepostedByRequestExpansionsItem | (string & {})
>;
export const GetPostsRepostedByRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetPostsRepostedByRequestExpansionsItem,
) as any as S.Schema<GetPostsRepostedByRequestExpansionsList>;

export type GetPostsRepostedByRequestPostFieldsItem =
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
export const GetPostsRepostedByRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetPostsRepostedByRequestPostFieldsList = Array<
  GetPostsRepostedByRequestPostFieldsItem | (string & {})
>;
export const GetPostsRepostedByRequestPostFieldsList = /*@__PURE__*/ S.Array(
  GetPostsRepostedByRequestPostFieldsItem,
) as any as S.Schema<GetPostsRepostedByRequestPostFieldsList>;

export interface GetPostsRepostedByRequest {
  id: string;
  max_results?: number;
  /** A base32hex-encoded pagination token. */
  pagination_token?: string;
  /** A comma separated list of User fields to display. */
  user_fields?: GetPostsRepostedByRequestUserFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetPostsRepostedByRequestExpansionsList;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetPostsRepostedByRequestPostFieldsList;
}
export const GetPostsRepostedByRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
    user_fields: S.optional(
      GetPostsRepostedByRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    expansions: S.optional(
      GetPostsRepostedByRequestExpansionsList.pipe(T.Query()),
    ),
    post_fields: S.optional(
      GetPostsRepostedByRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
  }).pipe(
    T.Http({ method: "GET", uri: "/2/tweets/{id}/retweeted_by", code: 200 }),
  ),
).annotate({
  identifier: "GetPostsRepostedByRequest",
}) as any as S.Schema<GetPostsRepostedByRequest>;

export type GetPostsRepostedByResponseDataList = Array<User>;
export const GetPostsRepostedByResponseDataList = /*@__PURE__*/ S.Array(
  User,
) as any as S.Schema<GetPostsRepostedByResponseDataList>;

export type GetPostsRepostedByResponseErrorsList = Array<Problem>;
export const GetPostsRepostedByResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetPostsRepostedByResponseErrorsList>;

export interface GetPostsRepostedByResponseMeta {
  /** Pagination token for the next page of results. */
  next_token?: string;
  /** Pagination token for the previous page of results. */
  previous_token?: string;
  /** Number of items in the data array. */
  result_count?: number;
}
export const GetPostsRepostedByResponseMeta = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    next_token: S.optional(S.String),
    previous_token: S.optional(S.String),
    result_count: S.optional(S.Number),
  }),
).annotate({
  identifier: "GetPostsRepostedByResponseMeta",
}) as any as S.Schema<GetPostsRepostedByResponseMeta>;

export interface GetPostsRepostedByResponse {
  data?: GetPostsRepostedByResponseDataList;
  errors?: GetPostsRepostedByResponseErrorsList;
  includes?: Expansions;
  meta?: GetPostsRepostedByResponseMeta;
}
export const GetPostsRepostedByResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetPostsRepostedByResponseDataList),
    errors: S.optional(GetPostsRepostedByResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(GetPostsRepostedByResponseMeta),
  }),
).annotate({
  identifier: "GetPostsRepostedByResponse",
}) as any as S.Schema<GetPostsRepostedByResponse>;

export type GetPostsRepostsRequestPostFieldsItem =
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
export const GetPostsRepostsRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetPostsRepostsRequestPostFieldsList = Array<
  GetPostsRepostsRequestPostFieldsItem | (string & {})
>;
export const GetPostsRepostsRequestPostFieldsList = /*@__PURE__*/ S.Array(
  GetPostsRepostsRequestPostFieldsItem,
) as any as S.Schema<GetPostsRepostsRequestPostFieldsList>;

export type GetPostsRepostsRequestExpansionsItem =
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
export const GetPostsRepostsRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetPostsRepostsRequestExpansionsList = Array<
  GetPostsRepostsRequestExpansionsItem | (string & {})
>;
export const GetPostsRepostsRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetPostsRepostsRequestExpansionsItem,
) as any as S.Schema<GetPostsRepostsRequestExpansionsList>;

export type GetPostsRepostsRequestUserFieldsItem =
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
export const GetPostsRepostsRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetPostsRepostsRequestUserFieldsList = Array<
  GetPostsRepostsRequestUserFieldsItem | (string & {})
>;
export const GetPostsRepostsRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetPostsRepostsRequestUserFieldsItem,
) as any as S.Schema<GetPostsRepostsRequestUserFieldsList>;

export type GetPostsRepostsRequestMediaFieldsItem =
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
export const GetPostsRepostsRequestMediaFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Media object. */
export type GetPostsRepostsRequestMediaFieldsList = Array<
  GetPostsRepostsRequestMediaFieldsItem | (string & {})
>;
export const GetPostsRepostsRequestMediaFieldsList = /*@__PURE__*/ S.Array(
  GetPostsRepostsRequestMediaFieldsItem,
) as any as S.Schema<GetPostsRepostsRequestMediaFieldsList>;

export type GetPostsRepostsRequestPollFieldsItem =
  | "duration_minutes"
  | "end_datetime"
  | "id"
  | "options"
  | "voting_status";
export const GetPostsRepostsRequestPollFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Poll object. */
export type GetPostsRepostsRequestPollFieldsList = Array<
  GetPostsRepostsRequestPollFieldsItem | (string & {})
>;
export const GetPostsRepostsRequestPollFieldsList = /*@__PURE__*/ S.Array(
  GetPostsRepostsRequestPollFieldsItem,
) as any as S.Schema<GetPostsRepostsRequestPollFieldsList>;

export type GetPostsRepostsRequestPlaceFieldsItem =
  | "contained_within"
  | "country"
  | "country_code"
  | "full_name"
  | "geo"
  | "id"
  | "name"
  | "place_type";
export const GetPostsRepostsRequestPlaceFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Place object. */
export type GetPostsRepostsRequestPlaceFieldsList = Array<
  GetPostsRepostsRequestPlaceFieldsItem | (string & {})
>;
export const GetPostsRepostsRequestPlaceFieldsList = /*@__PURE__*/ S.Array(
  GetPostsRepostsRequestPlaceFieldsItem,
) as any as S.Schema<GetPostsRepostsRequestPlaceFieldsList>;

export interface GetPostsRepostsRequest {
  id: string;
  max_results?: number;
  /** A base32hex-encoded pagination token. */
  pagination_token?: string;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetPostsRepostsRequestPostFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetPostsRepostsRequestExpansionsList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetPostsRepostsRequestUserFieldsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: GetPostsRepostsRequestMediaFieldsList;
  /** A comma separated list of Poll fields to display. */
  poll_fields?: GetPostsRepostsRequestPollFieldsList;
  /** A comma separated list of Place fields to display. */
  place_fields?: GetPostsRepostsRequestPlaceFieldsList;
}
export const GetPostsRepostsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
    post_fields: S.optional(
      GetPostsRepostsRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
    expansions: S.optional(
      GetPostsRepostsRequestExpansionsList.pipe(T.Query()),
    ),
    user_fields: S.optional(
      GetPostsRepostsRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    media_fields: S.optional(
      GetPostsRepostsRequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
    poll_fields: S.optional(
      GetPostsRepostsRequestPollFieldsList.pipe(T.Query("poll.fields")),
    ),
    place_fields: S.optional(
      GetPostsRepostsRequestPlaceFieldsList.pipe(T.Query("place.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/tweets/{id}/retweets", code: 200 })),
).annotate({
  identifier: "GetPostsRepostsRequest",
}) as any as S.Schema<GetPostsRepostsRequest>;

export type GetPostsRepostsResponseDataList = Array<Post>;
export const GetPostsRepostsResponseDataList = /*@__PURE__*/ S.Array(
  Post,
) as any as S.Schema<GetPostsRepostsResponseDataList>;

export type GetPostsRepostsResponseErrorsList = Array<Problem>;
export const GetPostsRepostsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetPostsRepostsResponseErrorsList>;

export type GetPostsRepostsResponseMeta = GetPostsRepostedByResponseMeta;
export const GetPostsRepostsResponseMeta = GetPostsRepostedByResponseMeta;

export interface GetPostsRepostsResponse {
  data?: GetPostsRepostsResponseDataList;
  errors?: GetPostsRepostsResponseErrorsList;
  includes?: Expansions;
  meta?: GetPostsRepostedByResponseMeta;
}
export const GetPostsRepostsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetPostsRepostsResponseDataList),
    errors: S.optional(GetPostsRepostsResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(GetPostsRepostedByResponseMeta),
  }),
).annotate({
  identifier: "GetPostsRepostsResponse",
}) as any as S.Schema<GetPostsRepostsResponse>;

export type GetTrendsByWoeidRequestTrendFieldsItem =
  | "trend_name"
  | "tweet_count";
export const GetTrendsByWoeidRequestTrendFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Trend object. */
export type GetTrendsByWoeidRequestTrendFieldsList = Array<
  GetTrendsByWoeidRequestTrendFieldsItem | (string & {})
>;
export const GetTrendsByWoeidRequestTrendFieldsList = /*@__PURE__*/ S.Array(
  GetTrendsByWoeidRequestTrendFieldsItem,
) as any as S.Schema<GetTrendsByWoeidRequestTrendFieldsList>;

export interface GetTrendsByWoeidRequest {
  woeid: number;
  max_trends?: number;
  /** A comma separated list of Trend fields to display. */
  trend_fields?: GetTrendsByWoeidRequestTrendFieldsList;
}
export const GetTrendsByWoeidRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    woeid: S.Number.pipe(T.Label()),
    max_trends: S.optional(S.Number.pipe(T.Query())),
    trend_fields: S.optional(
      GetTrendsByWoeidRequestTrendFieldsList.pipe(T.Query("trend.fields")),
    ),
  }).pipe(
    T.Http({ method: "GET", uri: "/2/trends/by/woeid/{woeid}", code: 200 }),
  ),
).annotate({
  identifier: "GetTrendsByWoeidRequest",
}) as any as S.Schema<GetTrendsByWoeidRequest>;

export interface Trend {
  trend_name?: string;
  tweet_count?: number;
}
export const Trend = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    trend_name: S.optional(S.String),
    tweet_count: S.optional(S.Number),
  }),
).annotate({ identifier: "Trend" }) as any as S.Schema<Trend>;

export type GetTrendsByWoeidResponseDataList = Array<Trend>;
export const GetTrendsByWoeidResponseDataList = /*@__PURE__*/ S.Array(
  Trend,
) as any as S.Schema<GetTrendsByWoeidResponseDataList>;

export type GetTrendsByWoeidResponseErrorsList = Array<Problem>;
export const GetTrendsByWoeidResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetTrendsByWoeidResponseErrorsList>;

export interface GetTrendsByWoeidResponse {
  data?: GetTrendsByWoeidResponseDataList;
  errors?: GetTrendsByWoeidResponseErrorsList;
}
export const GetTrendsByWoeidResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetTrendsByWoeidResponseDataList),
    errors: S.optional(GetTrendsByWoeidResponseErrorsList),
  }),
).annotate({
  identifier: "GetTrendsByWoeidResponse",
}) as any as S.Schema<GetTrendsByWoeidResponse>;

export interface GetUsersBookmarkFoldersRequest {
  id: string;
  max_results?: number;
  /** A base32hex-encoded pagination token. */
  pagination_token?: string;
}
export const GetUsersBookmarkFoldersRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
  }).pipe(
    T.Http({
      method: "GET",
      uri: "/2/users/{id}/bookmarks/folders",
      code: 200,
    }),
  ),
).annotate({
  identifier: "GetUsersBookmarkFoldersRequest",
}) as any as S.Schema<GetUsersBookmarkFoldersRequest>;

export interface GetUsersBookmarkFoldersResponseData {
  /** Unique identifier of the bookmark folder. */
  id: string;
  /** Display name of the bookmark folder. */
  name: string;
}
export const GetUsersBookmarkFoldersResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
  }),
).annotate({
  identifier: "GetUsersBookmarkFoldersResponseData",
}) as any as S.Schema<GetUsersBookmarkFoldersResponseData>;

export type GetUsersBookmarkFoldersResponseDataList =
  Array<GetUsersBookmarkFoldersResponseData>;
export const GetUsersBookmarkFoldersResponseDataList = /*@__PURE__*/ S.Array(
  GetUsersBookmarkFoldersResponseData,
) as any as S.Schema<GetUsersBookmarkFoldersResponseDataList>;

export type GetUsersBookmarkFoldersResponseErrorsList = Array<Problem>;
export const GetUsersBookmarkFoldersResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersBookmarkFoldersResponseErrorsList>;

export interface GetUsersBookmarkFoldersResponse {
  data?: GetUsersBookmarkFoldersResponseDataList;
  errors?: GetUsersBookmarkFoldersResponseErrorsList;
}
export const GetUsersBookmarkFoldersResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetUsersBookmarkFoldersResponseDataList),
    errors: S.optional(GetUsersBookmarkFoldersResponseErrorsList),
  }),
).annotate({
  identifier: "GetUsersBookmarkFoldersResponse",
}) as any as S.Schema<GetUsersBookmarkFoldersResponse>;

export type GetUsersBookmarksRequestPostFieldsItem =
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
export const GetUsersBookmarksRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetUsersBookmarksRequestPostFieldsList = Array<
  GetUsersBookmarksRequestPostFieldsItem | (string & {})
>;
export const GetUsersBookmarksRequestPostFieldsList = /*@__PURE__*/ S.Array(
  GetUsersBookmarksRequestPostFieldsItem,
) as any as S.Schema<GetUsersBookmarksRequestPostFieldsList>;

export type GetUsersBookmarksRequestExpansionsItem =
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
export const GetUsersBookmarksRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetUsersBookmarksRequestExpansionsList = Array<
  GetUsersBookmarksRequestExpansionsItem | (string & {})
>;
export const GetUsersBookmarksRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetUsersBookmarksRequestExpansionsItem,
) as any as S.Schema<GetUsersBookmarksRequestExpansionsList>;

export type GetUsersBookmarksRequestUserFieldsItem =
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
export const GetUsersBookmarksRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetUsersBookmarksRequestUserFieldsList = Array<
  GetUsersBookmarksRequestUserFieldsItem | (string & {})
>;
export const GetUsersBookmarksRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetUsersBookmarksRequestUserFieldsItem,
) as any as S.Schema<GetUsersBookmarksRequestUserFieldsList>;

export type GetUsersBookmarksRequestMediaFieldsItem =
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
export const GetUsersBookmarksRequestMediaFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Media object. */
export type GetUsersBookmarksRequestMediaFieldsList = Array<
  GetUsersBookmarksRequestMediaFieldsItem | (string & {})
>;
export const GetUsersBookmarksRequestMediaFieldsList = /*@__PURE__*/ S.Array(
  GetUsersBookmarksRequestMediaFieldsItem,
) as any as S.Schema<GetUsersBookmarksRequestMediaFieldsList>;

export type GetUsersBookmarksRequestPollFieldsItem =
  | "duration_minutes"
  | "end_datetime"
  | "id"
  | "options"
  | "voting_status";
export const GetUsersBookmarksRequestPollFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Poll object. */
export type GetUsersBookmarksRequestPollFieldsList = Array<
  GetUsersBookmarksRequestPollFieldsItem | (string & {})
>;
export const GetUsersBookmarksRequestPollFieldsList = /*@__PURE__*/ S.Array(
  GetUsersBookmarksRequestPollFieldsItem,
) as any as S.Schema<GetUsersBookmarksRequestPollFieldsList>;

export type GetUsersBookmarksRequestPlaceFieldsItem =
  | "contained_within"
  | "country"
  | "country_code"
  | "full_name"
  | "geo"
  | "id"
  | "name"
  | "place_type";
export const GetUsersBookmarksRequestPlaceFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Place object. */
export type GetUsersBookmarksRequestPlaceFieldsList = Array<
  GetUsersBookmarksRequestPlaceFieldsItem | (string & {})
>;
export const GetUsersBookmarksRequestPlaceFieldsList = /*@__PURE__*/ S.Array(
  GetUsersBookmarksRequestPlaceFieldsItem,
) as any as S.Schema<GetUsersBookmarksRequestPlaceFieldsList>;

export interface GetUsersBookmarksRequest {
  id: string;
  max_results?: number;
  /** A base32hex-encoded pagination token. */
  pagination_token?: string;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetUsersBookmarksRequestPostFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetUsersBookmarksRequestExpansionsList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetUsersBookmarksRequestUserFieldsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: GetUsersBookmarksRequestMediaFieldsList;
  /** A comma separated list of Poll fields to display. */
  poll_fields?: GetUsersBookmarksRequestPollFieldsList;
  /** A comma separated list of Place fields to display. */
  place_fields?: GetUsersBookmarksRequestPlaceFieldsList;
}
export const GetUsersBookmarksRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
    post_fields: S.optional(
      GetUsersBookmarksRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
    expansions: S.optional(
      GetUsersBookmarksRequestExpansionsList.pipe(T.Query()),
    ),
    user_fields: S.optional(
      GetUsersBookmarksRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    media_fields: S.optional(
      GetUsersBookmarksRequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
    poll_fields: S.optional(
      GetUsersBookmarksRequestPollFieldsList.pipe(T.Query("poll.fields")),
    ),
    place_fields: S.optional(
      GetUsersBookmarksRequestPlaceFieldsList.pipe(T.Query("place.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/users/{id}/bookmarks", code: 200 })),
).annotate({
  identifier: "GetUsersBookmarksRequest",
}) as any as S.Schema<GetUsersBookmarksRequest>;

export type GetUsersBookmarksResponseDataList = Array<Post>;
export const GetUsersBookmarksResponseDataList = /*@__PURE__*/ S.Array(
  Post,
) as any as S.Schema<GetUsersBookmarksResponseDataList>;

export type GetUsersBookmarksResponseErrorsList = Array<Problem>;
export const GetUsersBookmarksResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersBookmarksResponseErrorsList>;

export type GetUsersBookmarksResponseMeta = GetPostsRepostedByResponseMeta;
export const GetUsersBookmarksResponseMeta = GetPostsRepostedByResponseMeta;

export interface GetUsersBookmarksResponse {
  data?: GetUsersBookmarksResponseDataList;
  errors?: GetUsersBookmarksResponseErrorsList;
  includes?: Expansions;
  meta?: GetPostsRepostedByResponseMeta;
}
export const GetUsersBookmarksResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetUsersBookmarksResponseDataList),
    errors: S.optional(GetUsersBookmarksResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(GetPostsRepostedByResponseMeta),
  }),
).annotate({
  identifier: "GetUsersBookmarksResponse",
}) as any as S.Schema<GetUsersBookmarksResponse>;

export interface GetUsersBookmarksByFolderIdRequest {
  id: string;
  folder_id: string;
  max_results?: number;
  /** A base32hex-encoded pagination token. */
  pagination_token?: string;
}
export const GetUsersBookmarksByFolderIdRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    folder_id: S.String.pipe(T.Label()),
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
  }).pipe(
    T.Http({
      method: "GET",
      uri: "/2/users/{id}/bookmarks/folders/{folder_id}",
      code: 200,
    }),
  ),
).annotate({
  identifier: "GetUsersBookmarksByFolderIdRequest",
}) as any as S.Schema<GetUsersBookmarksByFolderIdRequest>;

export interface GetUsersBookmarksByFolderIdResponseDataItem {
  id: string;
}
export const GetUsersBookmarksByFolderIdResponseDataItem =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      id: S.String,
    }),
  ).annotate({
    identifier: "GetUsersBookmarksByFolderIdResponseDataItem",
  }) as any as S.Schema<GetUsersBookmarksByFolderIdResponseDataItem>;

/** The Posts in this bookmark folder, by ID. */
export type GetUsersBookmarksByFolderIdResponseDataList =
  Array<GetUsersBookmarksByFolderIdResponseDataItem>;
export const GetUsersBookmarksByFolderIdResponseDataList =
  /*@__PURE__*/ S.Array(
    GetUsersBookmarksByFolderIdResponseDataItem,
  ) as any as S.Schema<GetUsersBookmarksByFolderIdResponseDataList>;

export type GetUsersBookmarksByFolderIdResponseErrorsList = Array<Problem>;
export const GetUsersBookmarksByFolderIdResponseErrorsList =
  /*@__PURE__*/ S.Array(
    Problem,
  ) as any as S.Schema<GetUsersBookmarksByFolderIdResponseErrorsList>;

export interface GetUsersBookmarksByFolderIdResponse {
  /** The Posts in this bookmark folder, by ID. */
  data?: GetUsersBookmarksByFolderIdResponseDataList;
  errors?: GetUsersBookmarksByFolderIdResponseErrorsList;
}
export const GetUsersBookmarksByFolderIdResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetUsersBookmarksByFolderIdResponseDataList),
    errors: S.optional(GetUsersBookmarksByFolderIdResponseErrorsList),
  }),
).annotate({
  identifier: "GetUsersBookmarksByFolderIdResponse",
}) as any as S.Schema<GetUsersBookmarksByFolderIdResponse>;

export type GetUsersLikedPostsRequestPostFieldsItem =
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
export const GetUsersLikedPostsRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetUsersLikedPostsRequestPostFieldsList = Array<
  GetUsersLikedPostsRequestPostFieldsItem | (string & {})
>;
export const GetUsersLikedPostsRequestPostFieldsList = /*@__PURE__*/ S.Array(
  GetUsersLikedPostsRequestPostFieldsItem,
) as any as S.Schema<GetUsersLikedPostsRequestPostFieldsList>;

export type GetUsersLikedPostsRequestExpansionsItem =
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
export const GetUsersLikedPostsRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetUsersLikedPostsRequestExpansionsList = Array<
  GetUsersLikedPostsRequestExpansionsItem | (string & {})
>;
export const GetUsersLikedPostsRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetUsersLikedPostsRequestExpansionsItem,
) as any as S.Schema<GetUsersLikedPostsRequestExpansionsList>;

export type GetUsersLikedPostsRequestUserFieldsItem =
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
export const GetUsersLikedPostsRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetUsersLikedPostsRequestUserFieldsList = Array<
  GetUsersLikedPostsRequestUserFieldsItem | (string & {})
>;
export const GetUsersLikedPostsRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetUsersLikedPostsRequestUserFieldsItem,
) as any as S.Schema<GetUsersLikedPostsRequestUserFieldsList>;

export type GetUsersLikedPostsRequestMediaFieldsItem =
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
export const GetUsersLikedPostsRequestMediaFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Media object. */
export type GetUsersLikedPostsRequestMediaFieldsList = Array<
  GetUsersLikedPostsRequestMediaFieldsItem | (string & {})
>;
export const GetUsersLikedPostsRequestMediaFieldsList = /*@__PURE__*/ S.Array(
  GetUsersLikedPostsRequestMediaFieldsItem,
) as any as S.Schema<GetUsersLikedPostsRequestMediaFieldsList>;

export type GetUsersLikedPostsRequestPollFieldsItem =
  | "duration_minutes"
  | "end_datetime"
  | "id"
  | "options"
  | "voting_status";
export const GetUsersLikedPostsRequestPollFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Poll object. */
export type GetUsersLikedPostsRequestPollFieldsList = Array<
  GetUsersLikedPostsRequestPollFieldsItem | (string & {})
>;
export const GetUsersLikedPostsRequestPollFieldsList = /*@__PURE__*/ S.Array(
  GetUsersLikedPostsRequestPollFieldsItem,
) as any as S.Schema<GetUsersLikedPostsRequestPollFieldsList>;

export type GetUsersLikedPostsRequestPlaceFieldsItem =
  | "contained_within"
  | "country"
  | "country_code"
  | "full_name"
  | "geo"
  | "id"
  | "name"
  | "place_type";
export const GetUsersLikedPostsRequestPlaceFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Place object. */
export type GetUsersLikedPostsRequestPlaceFieldsList = Array<
  GetUsersLikedPostsRequestPlaceFieldsItem | (string & {})
>;
export const GetUsersLikedPostsRequestPlaceFieldsList = /*@__PURE__*/ S.Array(
  GetUsersLikedPostsRequestPlaceFieldsItem,
) as any as S.Schema<GetUsersLikedPostsRequestPlaceFieldsList>;

export interface GetUsersLikedPostsRequest {
  id: string;
  max_results?: number;
  /** A base32hex-encoded pagination token. */
  pagination_token?: string;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetUsersLikedPostsRequestPostFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetUsersLikedPostsRequestExpansionsList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetUsersLikedPostsRequestUserFieldsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: GetUsersLikedPostsRequestMediaFieldsList;
  /** A comma separated list of Poll fields to display. */
  poll_fields?: GetUsersLikedPostsRequestPollFieldsList;
  /** A comma separated list of Place fields to display. */
  place_fields?: GetUsersLikedPostsRequestPlaceFieldsList;
}
export const GetUsersLikedPostsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
    post_fields: S.optional(
      GetUsersLikedPostsRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
    expansions: S.optional(
      GetUsersLikedPostsRequestExpansionsList.pipe(T.Query()),
    ),
    user_fields: S.optional(
      GetUsersLikedPostsRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    media_fields: S.optional(
      GetUsersLikedPostsRequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
    poll_fields: S.optional(
      GetUsersLikedPostsRequestPollFieldsList.pipe(T.Query("poll.fields")),
    ),
    place_fields: S.optional(
      GetUsersLikedPostsRequestPlaceFieldsList.pipe(T.Query("place.fields")),
    ),
  }).pipe(
    T.Http({ method: "GET", uri: "/2/users/{id}/liked_tweets", code: 200 }),
  ),
).annotate({
  identifier: "GetUsersLikedPostsRequest",
}) as any as S.Schema<GetUsersLikedPostsRequest>;

export type GetUsersLikedPostsResponseDataList = Array<Post>;
export const GetUsersLikedPostsResponseDataList = /*@__PURE__*/ S.Array(
  Post,
) as any as S.Schema<GetUsersLikedPostsResponseDataList>;

export type GetUsersLikedPostsResponseErrorsList = Array<Problem>;
export const GetUsersLikedPostsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersLikedPostsResponseErrorsList>;

export type GetUsersLikedPostsResponseMeta = GetPostsRepostedByResponseMeta;
export const GetUsersLikedPostsResponseMeta = GetPostsRepostedByResponseMeta;

export interface GetUsersLikedPostsResponse {
  data?: GetUsersLikedPostsResponseDataList;
  errors?: GetUsersLikedPostsResponseErrorsList;
  includes?: Expansions;
  meta?: GetPostsRepostedByResponseMeta;
}
export const GetUsersLikedPostsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetUsersLikedPostsResponseDataList),
    errors: S.optional(GetUsersLikedPostsResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(GetPostsRepostedByResponseMeta),
  }),
).annotate({
  identifier: "GetUsersLikedPostsResponse",
}) as any as S.Schema<GetUsersLikedPostsResponse>;

export type GetUsersMentionsRequestPostFieldsItem =
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
export const GetUsersMentionsRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetUsersMentionsRequestPostFieldsList = Array<
  GetUsersMentionsRequestPostFieldsItem | (string & {})
>;
export const GetUsersMentionsRequestPostFieldsList = /*@__PURE__*/ S.Array(
  GetUsersMentionsRequestPostFieldsItem,
) as any as S.Schema<GetUsersMentionsRequestPostFieldsList>;

export type GetUsersMentionsRequestExpansionsItem =
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
export const GetUsersMentionsRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetUsersMentionsRequestExpansionsList = Array<
  GetUsersMentionsRequestExpansionsItem | (string & {})
>;
export const GetUsersMentionsRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetUsersMentionsRequestExpansionsItem,
) as any as S.Schema<GetUsersMentionsRequestExpansionsList>;

export type GetUsersMentionsRequestUserFieldsItem =
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
export const GetUsersMentionsRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetUsersMentionsRequestUserFieldsList = Array<
  GetUsersMentionsRequestUserFieldsItem | (string & {})
>;
export const GetUsersMentionsRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetUsersMentionsRequestUserFieldsItem,
) as any as S.Schema<GetUsersMentionsRequestUserFieldsList>;

export type GetUsersMentionsRequestMediaFieldsItem =
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
export const GetUsersMentionsRequestMediaFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Media object. */
export type GetUsersMentionsRequestMediaFieldsList = Array<
  GetUsersMentionsRequestMediaFieldsItem | (string & {})
>;
export const GetUsersMentionsRequestMediaFieldsList = /*@__PURE__*/ S.Array(
  GetUsersMentionsRequestMediaFieldsItem,
) as any as S.Schema<GetUsersMentionsRequestMediaFieldsList>;

export type GetUsersMentionsRequestPollFieldsItem =
  | "duration_minutes"
  | "end_datetime"
  | "id"
  | "options"
  | "voting_status";
export const GetUsersMentionsRequestPollFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Poll object. */
export type GetUsersMentionsRequestPollFieldsList = Array<
  GetUsersMentionsRequestPollFieldsItem | (string & {})
>;
export const GetUsersMentionsRequestPollFieldsList = /*@__PURE__*/ S.Array(
  GetUsersMentionsRequestPollFieldsItem,
) as any as S.Schema<GetUsersMentionsRequestPollFieldsList>;

export type GetUsersMentionsRequestPlaceFieldsItem =
  | "contained_within"
  | "country"
  | "country_code"
  | "full_name"
  | "geo"
  | "id"
  | "name"
  | "place_type";
export const GetUsersMentionsRequestPlaceFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Place object. */
export type GetUsersMentionsRequestPlaceFieldsList = Array<
  GetUsersMentionsRequestPlaceFieldsItem | (string & {})
>;
export const GetUsersMentionsRequestPlaceFieldsList = /*@__PURE__*/ S.Array(
  GetUsersMentionsRequestPlaceFieldsItem,
) as any as S.Schema<GetUsersMentionsRequestPlaceFieldsList>;

export interface GetUsersMentionsRequest {
  id: string;
  max_results?: number;
  /** A base32hex-encoded pagination token. */
  pagination_token?: string;
  /** Must be on or after 2010-11-06. */
  start_time?: string;
  /** Must be on or after 2010-11-06. */
  end_time?: string;
  since_id?: string;
  until_id?: string;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetUsersMentionsRequestPostFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetUsersMentionsRequestExpansionsList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetUsersMentionsRequestUserFieldsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: GetUsersMentionsRequestMediaFieldsList;
  /** A comma separated list of Poll fields to display. */
  poll_fields?: GetUsersMentionsRequestPollFieldsList;
  /** A comma separated list of Place fields to display. */
  place_fields?: GetUsersMentionsRequestPlaceFieldsList;
}
export const GetUsersMentionsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
    start_time: S.optional(S.String.pipe(T.Query())),
    end_time: S.optional(S.String.pipe(T.Query())),
    since_id: S.optional(S.String.pipe(T.Query())),
    until_id: S.optional(S.String.pipe(T.Query())),
    post_fields: S.optional(
      GetUsersMentionsRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
    expansions: S.optional(
      GetUsersMentionsRequestExpansionsList.pipe(T.Query()),
    ),
    user_fields: S.optional(
      GetUsersMentionsRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    media_fields: S.optional(
      GetUsersMentionsRequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
    poll_fields: S.optional(
      GetUsersMentionsRequestPollFieldsList.pipe(T.Query("poll.fields")),
    ),
    place_fields: S.optional(
      GetUsersMentionsRequestPlaceFieldsList.pipe(T.Query("place.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/users/{id}/mentions", code: 200 })),
).annotate({
  identifier: "GetUsersMentionsRequest",
}) as any as S.Schema<GetUsersMentionsRequest>;

export type GetUsersMentionsResponseDataList = Array<Post>;
export const GetUsersMentionsResponseDataList = /*@__PURE__*/ S.Array(
  Post,
) as any as S.Schema<GetUsersMentionsResponseDataList>;

export type GetUsersMentionsResponseErrorsList = Array<Problem>;
export const GetUsersMentionsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersMentionsResponseErrorsList>;

export interface GetUsersMentionsResponseMeta {
  /** Most recent ID in the data array. */
  newest_id?: string;
  /** Pagination token for the next page of results. */
  next_token?: string;
  /** Oldest ID in the data array. */
  oldest_id?: string;
  /** Pagination token for the previous page of results. */
  previous_token?: string;
  /** Number of items in the data array. */
  result_count?: number;
}
export const GetUsersMentionsResponseMeta = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    newest_id: S.optional(S.String),
    next_token: S.optional(S.String),
    oldest_id: S.optional(S.String),
    previous_token: S.optional(S.String),
    result_count: S.optional(S.Number),
  }),
).annotate({
  identifier: "GetUsersMentionsResponseMeta",
}) as any as S.Schema<GetUsersMentionsResponseMeta>;

export interface GetUsersMentionsResponse {
  data?: GetUsersMentionsResponseDataList;
  errors?: GetUsersMentionsResponseErrorsList;
  includes?: Expansions;
  meta?: GetUsersMentionsResponseMeta;
}
export const GetUsersMentionsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetUsersMentionsResponseDataList),
    errors: S.optional(GetUsersMentionsResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(GetUsersMentionsResponseMeta),
  }),
).annotate({
  identifier: "GetUsersMentionsResponse",
}) as any as S.Schema<GetUsersMentionsResponse>;

export type GetUsersPostsRequestExcludeItem = "replies" | "retweets";
export const GetUsersPostsRequestExcludeItem = /*@__PURE__*/ S.String;

export type GetUsersPostsRequestExcludeList = Array<
  GetUsersPostsRequestExcludeItem | (string & {})
>;
export const GetUsersPostsRequestExcludeList = /*@__PURE__*/ S.Array(
  GetUsersPostsRequestExcludeItem,
) as any as S.Schema<GetUsersPostsRequestExcludeList>;

export type GetUsersPostsRequestPostFieldsItem =
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
export const GetUsersPostsRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetUsersPostsRequestPostFieldsList = Array<
  GetUsersPostsRequestPostFieldsItem | (string & {})
>;
export const GetUsersPostsRequestPostFieldsList = /*@__PURE__*/ S.Array(
  GetUsersPostsRequestPostFieldsItem,
) as any as S.Schema<GetUsersPostsRequestPostFieldsList>;

export type GetUsersPostsRequestExpansionsItem =
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
export const GetUsersPostsRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetUsersPostsRequestExpansionsList = Array<
  GetUsersPostsRequestExpansionsItem | (string & {})
>;
export const GetUsersPostsRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetUsersPostsRequestExpansionsItem,
) as any as S.Schema<GetUsersPostsRequestExpansionsList>;

export type GetUsersPostsRequestUserFieldsItem =
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
export const GetUsersPostsRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetUsersPostsRequestUserFieldsList = Array<
  GetUsersPostsRequestUserFieldsItem | (string & {})
>;
export const GetUsersPostsRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetUsersPostsRequestUserFieldsItem,
) as any as S.Schema<GetUsersPostsRequestUserFieldsList>;

export type GetUsersPostsRequestMediaFieldsItem =
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
export const GetUsersPostsRequestMediaFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Media object. */
export type GetUsersPostsRequestMediaFieldsList = Array<
  GetUsersPostsRequestMediaFieldsItem | (string & {})
>;
export const GetUsersPostsRequestMediaFieldsList = /*@__PURE__*/ S.Array(
  GetUsersPostsRequestMediaFieldsItem,
) as any as S.Schema<GetUsersPostsRequestMediaFieldsList>;

export type GetUsersPostsRequestPollFieldsItem =
  | "duration_minutes"
  | "end_datetime"
  | "id"
  | "options"
  | "voting_status";
export const GetUsersPostsRequestPollFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Poll object. */
export type GetUsersPostsRequestPollFieldsList = Array<
  GetUsersPostsRequestPollFieldsItem | (string & {})
>;
export const GetUsersPostsRequestPollFieldsList = /*@__PURE__*/ S.Array(
  GetUsersPostsRequestPollFieldsItem,
) as any as S.Schema<GetUsersPostsRequestPollFieldsList>;

export type GetUsersPostsRequestPlaceFieldsItem =
  | "contained_within"
  | "country"
  | "country_code"
  | "full_name"
  | "geo"
  | "id"
  | "name"
  | "place_type";
export const GetUsersPostsRequestPlaceFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Place object. */
export type GetUsersPostsRequestPlaceFieldsList = Array<
  GetUsersPostsRequestPlaceFieldsItem | (string & {})
>;
export const GetUsersPostsRequestPlaceFieldsList = /*@__PURE__*/ S.Array(
  GetUsersPostsRequestPlaceFieldsItem,
) as any as S.Schema<GetUsersPostsRequestPlaceFieldsList>;

export interface GetUsersPostsRequest {
  id: string;
  max_results?: number;
  /** A base32hex-encoded pagination token. */
  pagination_token?: string;
  /** Must be on or after 2010-11-06. */
  start_time?: string;
  /** Must be on or after 2010-11-06. */
  end_time?: string;
  since_id?: string;
  until_id?: string;
  exclude?: GetUsersPostsRequestExcludeList;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetUsersPostsRequestPostFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetUsersPostsRequestExpansionsList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetUsersPostsRequestUserFieldsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: GetUsersPostsRequestMediaFieldsList;
  /** A comma separated list of Poll fields to display. */
  poll_fields?: GetUsersPostsRequestPollFieldsList;
  /** A comma separated list of Place fields to display. */
  place_fields?: GetUsersPostsRequestPlaceFieldsList;
}
export const GetUsersPostsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
    start_time: S.optional(S.String.pipe(T.Query())),
    end_time: S.optional(S.String.pipe(T.Query())),
    since_id: S.optional(S.String.pipe(T.Query())),
    until_id: S.optional(S.String.pipe(T.Query())),
    exclude: S.optional(GetUsersPostsRequestExcludeList.pipe(T.Query())),
    post_fields: S.optional(
      GetUsersPostsRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
    expansions: S.optional(GetUsersPostsRequestExpansionsList.pipe(T.Query())),
    user_fields: S.optional(
      GetUsersPostsRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    media_fields: S.optional(
      GetUsersPostsRequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
    poll_fields: S.optional(
      GetUsersPostsRequestPollFieldsList.pipe(T.Query("poll.fields")),
    ),
    place_fields: S.optional(
      GetUsersPostsRequestPlaceFieldsList.pipe(T.Query("place.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/users/{id}/tweets", code: 200 })),
).annotate({
  identifier: "GetUsersPostsRequest",
}) as any as S.Schema<GetUsersPostsRequest>;

export type GetUsersPostsResponseDataList = Array<Post>;
export const GetUsersPostsResponseDataList = /*@__PURE__*/ S.Array(
  Post,
) as any as S.Schema<GetUsersPostsResponseDataList>;

export type GetUsersPostsResponseErrorsList = Array<Problem>;
export const GetUsersPostsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersPostsResponseErrorsList>;

export type GetUsersPostsResponseMeta = GetUsersMentionsResponseMeta;
export const GetUsersPostsResponseMeta = GetUsersMentionsResponseMeta;

export interface GetUsersPostsResponse {
  data?: GetUsersPostsResponseDataList;
  errors?: GetUsersPostsResponseErrorsList;
  includes?: Expansions;
  meta?: GetUsersMentionsResponseMeta;
}
export const GetUsersPostsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetUsersPostsResponseDataList),
    errors: S.optional(GetUsersPostsResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(GetUsersMentionsResponseMeta),
  }),
).annotate({
  identifier: "GetUsersPostsResponse",
}) as any as S.Schema<GetUsersPostsResponse>;

export type GetUsersTimelineRequestExcludeItem = "replies" | "retweets";
export const GetUsersTimelineRequestExcludeItem = /*@__PURE__*/ S.String;

export type GetUsersTimelineRequestExcludeList = Array<
  GetUsersTimelineRequestExcludeItem | (string & {})
>;
export const GetUsersTimelineRequestExcludeList = /*@__PURE__*/ S.Array(
  GetUsersTimelineRequestExcludeItem,
) as any as S.Schema<GetUsersTimelineRequestExcludeList>;

export type GetUsersTimelineRequestPostFieldsItem =
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
export const GetUsersTimelineRequestPostFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetUsersTimelineRequestPostFieldsList = Array<
  GetUsersTimelineRequestPostFieldsItem | (string & {})
>;
export const GetUsersTimelineRequestPostFieldsList = /*@__PURE__*/ S.Array(
  GetUsersTimelineRequestPostFieldsItem,
) as any as S.Schema<GetUsersTimelineRequestPostFieldsList>;

export type GetUsersTimelineRequestExpansionsItem =
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
export const GetUsersTimelineRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetUsersTimelineRequestExpansionsList = Array<
  GetUsersTimelineRequestExpansionsItem | (string & {})
>;
export const GetUsersTimelineRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetUsersTimelineRequestExpansionsItem,
) as any as S.Schema<GetUsersTimelineRequestExpansionsList>;

export type GetUsersTimelineRequestUserFieldsItem =
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
export const GetUsersTimelineRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetUsersTimelineRequestUserFieldsList = Array<
  GetUsersTimelineRequestUserFieldsItem | (string & {})
>;
export const GetUsersTimelineRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetUsersTimelineRequestUserFieldsItem,
) as any as S.Schema<GetUsersTimelineRequestUserFieldsList>;

export type GetUsersTimelineRequestMediaFieldsItem =
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
export const GetUsersTimelineRequestMediaFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Media object. */
export type GetUsersTimelineRequestMediaFieldsList = Array<
  GetUsersTimelineRequestMediaFieldsItem | (string & {})
>;
export const GetUsersTimelineRequestMediaFieldsList = /*@__PURE__*/ S.Array(
  GetUsersTimelineRequestMediaFieldsItem,
) as any as S.Schema<GetUsersTimelineRequestMediaFieldsList>;

export type GetUsersTimelineRequestPollFieldsItem =
  | "duration_minutes"
  | "end_datetime"
  | "id"
  | "options"
  | "voting_status";
export const GetUsersTimelineRequestPollFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Poll object. */
export type GetUsersTimelineRequestPollFieldsList = Array<
  GetUsersTimelineRequestPollFieldsItem | (string & {})
>;
export const GetUsersTimelineRequestPollFieldsList = /*@__PURE__*/ S.Array(
  GetUsersTimelineRequestPollFieldsItem,
) as any as S.Schema<GetUsersTimelineRequestPollFieldsList>;

export type GetUsersTimelineRequestPlaceFieldsItem =
  | "contained_within"
  | "country"
  | "country_code"
  | "full_name"
  | "geo"
  | "id"
  | "name"
  | "place_type";
export const GetUsersTimelineRequestPlaceFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Place object. */
export type GetUsersTimelineRequestPlaceFieldsList = Array<
  GetUsersTimelineRequestPlaceFieldsItem | (string & {})
>;
export const GetUsersTimelineRequestPlaceFieldsList = /*@__PURE__*/ S.Array(
  GetUsersTimelineRequestPlaceFieldsItem,
) as any as S.Schema<GetUsersTimelineRequestPlaceFieldsList>;

export interface GetUsersTimelineRequest {
  id: string;
  max_results?: number;
  /** A base32hex-encoded pagination token. */
  pagination_token?: string;
  /** Must be on or after 2010-11-06. */
  start_time?: string;
  /** Must be on or after 2010-11-06. */
  end_time?: string;
  since_id?: string;
  until_id?: string;
  exclude?: GetUsersTimelineRequestExcludeList;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetUsersTimelineRequestPostFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetUsersTimelineRequestExpansionsList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetUsersTimelineRequestUserFieldsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: GetUsersTimelineRequestMediaFieldsList;
  /** A comma separated list of Poll fields to display. */
  poll_fields?: GetUsersTimelineRequestPollFieldsList;
  /** A comma separated list of Place fields to display. */
  place_fields?: GetUsersTimelineRequestPlaceFieldsList;
}
export const GetUsersTimelineRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
    start_time: S.optional(S.String.pipe(T.Query())),
    end_time: S.optional(S.String.pipe(T.Query())),
    since_id: S.optional(S.String.pipe(T.Query())),
    until_id: S.optional(S.String.pipe(T.Query())),
    exclude: S.optional(GetUsersTimelineRequestExcludeList.pipe(T.Query())),
    post_fields: S.optional(
      GetUsersTimelineRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
    expansions: S.optional(
      GetUsersTimelineRequestExpansionsList.pipe(T.Query()),
    ),
    user_fields: S.optional(
      GetUsersTimelineRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    media_fields: S.optional(
      GetUsersTimelineRequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
    poll_fields: S.optional(
      GetUsersTimelineRequestPollFieldsList.pipe(T.Query("poll.fields")),
    ),
    place_fields: S.optional(
      GetUsersTimelineRequestPlaceFieldsList.pipe(T.Query("place.fields")),
    ),
  }).pipe(
    T.Http({
      method: "GET",
      uri: "/2/users/{id}/timelines/reverse_chronological",
      code: 200,
    }),
  ),
).annotate({
  identifier: "GetUsersTimelineRequest",
}) as any as S.Schema<GetUsersTimelineRequest>;

export type GetUsersTimelineResponseDataList = Array<Post>;
export const GetUsersTimelineResponseDataList = /*@__PURE__*/ S.Array(
  Post,
) as any as S.Schema<GetUsersTimelineResponseDataList>;

export type GetUsersTimelineResponseErrorsList = Array<Problem>;
export const GetUsersTimelineResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersTimelineResponseErrorsList>;

export type GetUsersTimelineResponseMeta = GetUsersMentionsResponseMeta;
export const GetUsersTimelineResponseMeta = GetUsersMentionsResponseMeta;

export interface GetUsersTimelineResponse {
  data?: GetUsersTimelineResponseDataList;
  errors?: GetUsersTimelineResponseErrorsList;
  includes?: Expansions;
  meta?: GetUsersMentionsResponseMeta;
}
export const GetUsersTimelineResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetUsersTimelineResponseDataList),
    errors: S.optional(GetUsersTimelineResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(GetUsersMentionsResponseMeta),
  }),
).annotate({
  identifier: "GetUsersTimelineResponse",
}) as any as S.Schema<GetUsersTimelineResponse>;

export interface HidePostsReplyRequest {
  tweet_id: string;
  /** Whether the reply should be hidden. */
  hidden: boolean;
}
export const HidePostsReplyRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    tweet_id: S.String.pipe(T.Label()),
    hidden: S.Boolean,
  }).pipe(
    T.Http({ method: "PUT", uri: "/2/tweets/{tweet_id}/hidden", code: 200 }),
  ),
).annotate({
  identifier: "HidePostsReplyRequest",
}) as any as S.Schema<HidePostsReplyRequest>;

export interface HidePostsReplyResponseData {
  /** Whether the reply is hidden. */
  hidden?: boolean;
}
export const HidePostsReplyResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    hidden: S.optional(S.Boolean),
  }),
).annotate({
  identifier: "HidePostsReplyResponseData",
}) as any as S.Schema<HidePostsReplyResponseData>;

export type HidePostsReplyResponseErrorsList = Array<Problem>;
export const HidePostsReplyResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<HidePostsReplyResponseErrorsList>;

export interface HidePostsReplyResponse {
  data?: HidePostsReplyResponseData;
  errors?: HidePostsReplyResponseErrorsList;
}
export const HidePostsReplyResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(HidePostsReplyResponseData),
    errors: S.optional(HidePostsReplyResponseErrorsList),
  }),
).annotate({
  identifier: "HidePostsReplyResponse",
}) as any as S.Schema<HidePostsReplyResponse>;

export interface RepostPostRequest {
  id: string;
  tweet_id: string;
}
export const RepostPostRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    tweet_id: S.String,
  }).pipe(T.Http({ method: "POST", uri: "/2/users/{id}/retweets", code: 200 })),
).annotate({
  identifier: "RepostPostRequest",
}) as any as S.Schema<RepostPostRequest>;

export interface RepostPostResponseData {
  /** The ID of the reposted Post. */
  rest_id: string;
  /** Indicates whether the user reposted the Post. */
  retweeted: boolean;
}
export const RepostPostResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    rest_id: S.String,
    retweeted: S.Boolean,
  }),
).annotate({
  identifier: "RepostPostResponseData",
}) as any as S.Schema<RepostPostResponseData>;

export type RepostPostResponseErrorsList = Array<Problem>;
export const RepostPostResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<RepostPostResponseErrorsList>;

export interface RepostPostResponse {
  data?: RepostPostResponseData;
  errors?: RepostPostResponseErrorsList;
}
export const RepostPostResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(RepostPostResponseData),
    errors: S.optional(RepostPostResponseErrorsList),
  }),
).annotate({
  identifier: "RepostPostResponse",
}) as any as S.Schema<RepostPostResponse>;

export interface UnrepostPostRequest {
  id: string;
  source_tweet_id: string;
}
export const UnrepostPostRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    source_tweet_id: S.String.pipe(T.Label()),
  }).pipe(
    T.Http({
      method: "DELETE",
      uri: "/2/users/{id}/retweets/{source_tweet_id}",
      code: 200,
    }),
  ),
).annotate({
  identifier: "UnrepostPostRequest",
}) as any as S.Schema<UnrepostPostRequest>;

export interface UnrepostPostResponseData {
  /** Whether the Post is reposted. */
  retweeted: boolean;
}
export const UnrepostPostResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    retweeted: S.Boolean,
  }),
).annotate({
  identifier: "UnrepostPostResponseData",
}) as any as S.Schema<UnrepostPostResponseData>;

export type UnrepostPostResponseErrorsList = Array<Problem>;
export const UnrepostPostResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<UnrepostPostResponseErrorsList>;

export interface UnrepostPostResponse {
  data?: UnrepostPostResponseData;
  errors?: UnrepostPostResponseErrorsList;
}
export const UnrepostPostResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(UnrepostPostResponseData),
    errors: S.optional(UnrepostPostResponseErrorsList),
  }),
).annotate({
  identifier: "UnrepostPostResponse",
}) as any as S.Schema<UnrepostPostResponse>;

export const createPosts = /*@__PURE__*/ makeOperation<
  CreatePostsRequest,
  CreatePostsResponse
>(
  operations.createPosts,
  () => CreatePostsRequest,
  () => CreatePostsResponse,
);

export const createUsersBookmark = /*@__PURE__*/ makeOperation<
  CreateUsersBookmarkRequest,
  CreateUsersBookmarkResponse
>(
  operations.createUsersBookmark,
  () => CreateUsersBookmarkRequest,
  () => CreateUsersBookmarkResponse,
);

export const deletePosts = /*@__PURE__*/ makeOperation<
  DeletePostsRequest,
  DeletePostsResponse
>(
  operations.deletePosts,
  () => DeletePostsRequest,
  () => DeletePostsResponse,
);

export const getPostsAnalytics = /*@__PURE__*/ makeOperation<
  GetPostsAnalyticsRequest,
  GetPostsAnalyticsResponse
>(
  operations.getPostsAnalytics,
  () => GetPostsAnalyticsRequest,
  () => GetPostsAnalyticsResponse,
);

export const getPostsById = /*@__PURE__*/ makeOperation<
  GetPostsByIdRequest,
  GetPostsByIdResponse
>(
  operations.getPostsById,
  () => GetPostsByIdRequest,
  () => GetPostsByIdResponse,
);

export const getPostsByIds = /*@__PURE__*/ makeOperation<
  GetPostsByIdsRequest,
  GetPostsByIdsResponse
>(
  operations.getPostsByIds,
  () => GetPostsByIdsRequest,
  () => GetPostsByIdsResponse,
);

export const getPostsQuotedPosts = /*@__PURE__*/ makeOperation<
  GetPostsQuotedPostsRequest,
  GetPostsQuotedPostsResponse
>(
  operations.getPostsQuotedPosts,
  () => GetPostsQuotedPostsRequest,
  () => GetPostsQuotedPostsResponse,
);

export const getPostsRepostedBy = /*@__PURE__*/ makeOperation<
  GetPostsRepostedByRequest,
  GetPostsRepostedByResponse
>(
  operations.getPostsRepostedBy,
  () => GetPostsRepostedByRequest,
  () => GetPostsRepostedByResponse,
);

export const getPostsReposts = /*@__PURE__*/ makeOperation<
  GetPostsRepostsRequest,
  GetPostsRepostsResponse
>(
  operations.getPostsReposts,
  () => GetPostsRepostsRequest,
  () => GetPostsRepostsResponse,
);

export const getTrendsByWoeid = /*@__PURE__*/ makeOperation<
  GetTrendsByWoeidRequest,
  GetTrendsByWoeidResponse
>(
  operations.getTrendsByWoeid,
  () => GetTrendsByWoeidRequest,
  () => GetTrendsByWoeidResponse,
);

export const getUsersBookmarkFolders = /*@__PURE__*/ makeOperation<
  GetUsersBookmarkFoldersRequest,
  GetUsersBookmarkFoldersResponse
>(
  operations.getUsersBookmarkFolders,
  () => GetUsersBookmarkFoldersRequest,
  () => GetUsersBookmarkFoldersResponse,
);

export const getUsersBookmarks = /*@__PURE__*/ makeOperation<
  GetUsersBookmarksRequest,
  GetUsersBookmarksResponse
>(
  operations.getUsersBookmarks,
  () => GetUsersBookmarksRequest,
  () => GetUsersBookmarksResponse,
);

export const getUsersBookmarksByFolderId = /*@__PURE__*/ makeOperation<
  GetUsersBookmarksByFolderIdRequest,
  GetUsersBookmarksByFolderIdResponse
>(
  operations.getUsersBookmarksByFolderId,
  () => GetUsersBookmarksByFolderIdRequest,
  () => GetUsersBookmarksByFolderIdResponse,
);

export const getUsersLikedPosts = /*@__PURE__*/ makeOperation<
  GetUsersLikedPostsRequest,
  GetUsersLikedPostsResponse
>(
  operations.getUsersLikedPosts,
  () => GetUsersLikedPostsRequest,
  () => GetUsersLikedPostsResponse,
);

export const getUsersMentions = /*@__PURE__*/ makeOperation<
  GetUsersMentionsRequest,
  GetUsersMentionsResponse
>(
  operations.getUsersMentions,
  () => GetUsersMentionsRequest,
  () => GetUsersMentionsResponse,
);

export const getUsersPosts = /*@__PURE__*/ makeOperation<
  GetUsersPostsRequest,
  GetUsersPostsResponse
>(
  operations.getUsersPosts,
  () => GetUsersPostsRequest,
  () => GetUsersPostsResponse,
);

export const getUsersTimeline = /*@__PURE__*/ makeOperation<
  GetUsersTimelineRequest,
  GetUsersTimelineResponse
>(
  operations.getUsersTimeline,
  () => GetUsersTimelineRequest,
  () => GetUsersTimelineResponse,
);

export const hidePostsReply = /*@__PURE__*/ makeOperation<
  HidePostsReplyRequest,
  HidePostsReplyResponse
>(
  operations.hidePostsReply,
  () => HidePostsReplyRequest,
  () => HidePostsReplyResponse,
);

export const repostPost = /*@__PURE__*/ makeOperation<
  RepostPostRequest,
  RepostPostResponse
>(
  operations.repostPost,
  () => RepostPostRequest,
  () => RepostPostResponse,
);

export const unrepostPost = /*@__PURE__*/ makeOperation<
  UnrepostPostRequest,
  UnrepostPostResponse
>(
  operations.unrepostPost,
  () => UnrepostPostRequest,
  () => UnrepostPostResponse,
);
