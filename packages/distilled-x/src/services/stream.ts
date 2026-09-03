// AUTO-GENERATED from xdevplatform/xdk@84c26540df30c0b798e50e34151c56d5d262ba1c; do not edit.
import * as S from "@distilled.cloud/core/schema";
import * as T from "../traits.ts";
import {
  makeOperation,
  makeBinaryOperation,
  makeStreamOperation,
} from "../operation.ts";
import { operations } from "../operations.ts";
export interface ActivityStreamRequest {
  /** The number of minutes of backfill requested. */
  backfill_minutes?: number;
  /** YYYY-MM-DDTHH:mm:ssZ. The earliest UTC timestamp from which the activities will be provided. */
  start_time?: string;
  /** YYYY-MM-DDTHH:mm:ssZ. The latest UTC timestamp from which the activities will be provided. */
  end_time?: string;
}
export const ActivityStreamRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    backfill_minutes: S.optional(S.Number.pipe(T.Query())),
    start_time: S.optional(S.String.pipe(T.Query())),
    end_time: S.optional(S.String.pipe(T.Query())),
  }).pipe(T.Http({ method: "GET", uri: "/2/activity/stream", code: 200 })),
).annotate({
  identifier: "ActivityStreamRequest",
}) as any as S.Schema<ActivityStreamRequest>;

/** Optional direction filter for directional events. */
export type ActivitySubscriptionFilterDirection = "inbound" | "outbound";
export const ActivitySubscriptionFilterDirection = /*@__PURE__*/ S.String;

/** An XAA subscription filter. */
export interface ActivitySubscriptionFilter {
  /** Optional direction filter for directional events. */
  direction?: ActivitySubscriptionFilterDirection;
  keyword?: string;
  user_id?: string;
}
export const ActivitySubscriptionFilter = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    direction: S.optional(ActivitySubscriptionFilterDirection),
    keyword: S.optional(S.String),
    user_id: S.optional(S.String),
  }),
).annotate({
  identifier: "ActivitySubscriptionFilter",
}) as any as S.Schema<ActivitySubscriptionFilter>;

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

export interface ProfileUpdateActivityResponsePayload {
  after?: string;
  before?: string;
}
export const ProfileUpdateActivityResponsePayload = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      after: S.optional(S.String),
      before: S.optional(S.String),
    }),
).annotate({
  identifier: "ProfileUpdateActivityResponsePayload",
}) as any as S.Schema<ProfileUpdateActivityResponsePayload>;

export interface NewsActivityResponsePayload {
  category?: string;
  headline?: string;
  hook?: string;
  summary?: string;
}
export const NewsActivityResponsePayload = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    category: S.optional(S.String),
    headline: S.optional(S.String),
    hook: S.optional(S.String),
    summary: S.optional(S.String),
  }),
).annotate({
  identifier: "NewsActivityResponsePayload",
}) as any as S.Schema<NewsActivityResponsePayload>;

export interface FollowActivityResponsePayload {
  source?: User;
  target?: User;
}
export const FollowActivityResponsePayload = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    source: S.optional(User),
    target: S.optional(User),
  }),
).annotate({
  identifier: "FollowActivityResponsePayload",
}) as any as S.Schema<FollowActivityResponsePayload>;

/** The identity of a deleted Post. */
export interface PostDeleteActivityResponsePayload {
  author_id: string;
  id: string;
}
export const PostDeleteActivityResponsePayload = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    author_id: S.String,
    id: S.String,
  }),
).annotate({
  identifier: "PostDeleteActivityResponsePayload",
}) as any as S.Schema<PostDeleteActivityResponsePayload>;

/** A Like event, with the tweet author user and the tweet being liked */
export interface LikeWithPostAuthor {
  /** Creation time of the Tweet. */
  created_at?: string;
  id?: string;
  liked_tweet_id?: string;
  /** Timestamp in milliseconds of creation. */
  timestamp_ms?: number;
  tweet_author_id?: string;
}
export const LikeWithPostAuthor = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    created_at: S.optional(S.String),
    id: S.optional(S.String),
    liked_tweet_id: S.optional(S.String),
    timestamp_ms: S.optional(S.Number),
    tweet_author_id: S.optional(S.String),
  }),
).annotate({
  identifier: "LikeWithPostAuthor",
}) as any as S.Schema<LikeWithPostAuthor>;

export type ActivityStreamingResponsePayload =
  | ProfileUpdateActivityResponsePayload
  | NewsActivityResponsePayload
  | FollowActivityResponsePayload
  | Post
  | PostDeleteActivityResponsePayload
  | LikeWithPostAuthor;
export const ActivityStreamingResponsePayload =
  /*@__PURE__*/ S.Unknown as any as S.Schema<ActivityStreamingResponsePayload>;
export interface ActivityStreamResponseData {
  event_type?: string;
  event_uuid?: string;
  filter?: ActivitySubscriptionFilter;
  includes?: Expansions;
  payload?: ActivityStreamingResponsePayload;
  tag?: string;
}
export const ActivityStreamResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    event_type: S.optional(S.String),
    event_uuid: S.optional(S.String),
    filter: S.optional(ActivitySubscriptionFilter),
    includes: S.optional(Expansions),
    payload: S.optional(ActivityStreamingResponsePayload),
    tag: S.optional(S.String),
  }),
).annotate({
  identifier: "ActivityStreamResponseData",
}) as any as S.Schema<ActivityStreamResponseData>;

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
export type ActivityStreamResponseErrorsList = Array<Problem>;
export const ActivityStreamResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<ActivityStreamResponseErrorsList>;

/** An activity event or error that can be returned by the x activity streaming API. */
export interface ActivityStreamResponse {
  data?: ActivityStreamResponseData;
  errors?: ActivityStreamResponseErrorsList;
}
export const ActivityStreamResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(ActivityStreamResponseData),
    errors: S.optional(ActivityStreamResponseErrorsList),
  }),
).annotate({
  identifier: "ActivityStreamResponse",
}) as any as S.Schema<ActivityStreamResponse>;

export interface GetRuleCountsRequest {
  rules_count_fields?: string;
}
export const GetRuleCountsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    rules_count_fields: S.optional(
      S.String.pipe(T.Query("rules_count.fields")),
    ),
  }).pipe(
    T.Http({
      method: "GET",
      uri: "/2/tweets/search/stream/rules/counts",
      code: 200,
    }),
  ),
).annotate({
  identifier: "GetRuleCountsRequest",
}) as any as S.Schema<GetRuleCountsRequest>;

export interface GetRuleCountsResponseDataAllProjectClientApps {
  /** Unique identifier of the client application. */
  client_app_id?: string;
  /** Number of rules configured for the client application. */
  rule_count: number;
}
export const GetRuleCountsResponseDataAllProjectClientApps =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      client_app_id: S.optional(S.String),
      rule_count: S.Number,
    }),
  ).annotate({
    identifier: "GetRuleCountsResponseDataAllProjectClientApps",
  }) as any as S.Schema<GetRuleCountsResponseDataAllProjectClientApps>;

/** Per-client-app rule counts across the project. */
export type GetRuleCountsResponseDataAllProjectClientAppsList =
  Array<GetRuleCountsResponseDataAllProjectClientApps>;
export const GetRuleCountsResponseDataAllProjectClientAppsList =
  /*@__PURE__*/ S.Array(
    GetRuleCountsResponseDataAllProjectClientApps,
  ) as any as S.Schema<GetRuleCountsResponseDataAllProjectClientAppsList>;

export type GetRuleCountsResponseDataClientAppRulesCount =
  GetRuleCountsResponseDataAllProjectClientApps;
export const GetRuleCountsResponseDataClientAppRulesCount =
  GetRuleCountsResponseDataAllProjectClientApps;

export interface GetRuleCountsResponseData {
  /** Per-client-app rule counts across the project. */
  all_project_client_apps?: GetRuleCountsResponseDataAllProjectClientAppsList;
  /** Maximum number of rules allowed per client application. */
  cap_per_client_app: string;
  /** Maximum number of rules allowed across the project. */
  cap_per_project: string;
  /** The calling client application's own rule count. */
  client_app_rules_count: GetRuleCountsResponseDataAllProjectClientApps;
  /** Number of rules across every client application in the project. */
  project_rules_count: string;
}
export const GetRuleCountsResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    all_project_client_apps: S.optional(
      GetRuleCountsResponseDataAllProjectClientAppsList,
    ),
    cap_per_client_app: S.String,
    cap_per_project: S.String,
    client_app_rules_count: GetRuleCountsResponseDataAllProjectClientApps,
    project_rules_count: S.String,
  }),
).annotate({
  identifier: "GetRuleCountsResponseData",
}) as any as S.Schema<GetRuleCountsResponseData>;

export type GetRuleCountsResponseErrorsList = Array<Problem>;
export const GetRuleCountsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetRuleCountsResponseErrorsList>;

export interface GetRuleCountsResponse {
  data?: GetRuleCountsResponseData;
  errors?: GetRuleCountsResponseErrorsList;
}
export const GetRuleCountsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetRuleCountsResponseData),
    errors: S.optional(GetRuleCountsResponseErrorsList),
  }),
).annotate({
  identifier: "GetRuleCountsResponse",
}) as any as S.Schema<GetRuleCountsResponse>;

export interface StreamLabelsComplianceRequest {
  /** The number of minutes of backfill requested. */
  backfill_minutes?: number;
  /** YYYY-MM-DDTHH:mm:ssZ. The earliest UTC timestamp from which the Post labels will be provided. */
  start_time?: string;
  /** YYYY-MM-DDTHH:mm:ssZ. The latest UTC timestamp from which the Post labels will be provided. */
  end_time?: string;
}
export const StreamLabelsComplianceRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    backfill_minutes: S.optional(S.Number.pipe(T.Query())),
    start_time: S.optional(S.String.pipe(T.Query())),
    end_time: S.optional(S.String.pipe(T.Query())),
  }).pipe(T.Http({ method: "GET", uri: "/2/tweets/label/stream", code: 200 })),
).annotate({
  identifier: "StreamLabelsComplianceRequest",
}) as any as S.Schema<StreamLabelsComplianceRequest>;

export type PostNoticeTweet = PostDeleteActivityResponsePayload;
export const PostNoticeTweet = PostDeleteActivityResponsePayload;

export interface PostNotice {
  /** If the label is being applied or removed. Possible values are ‘apply’ or ‘remove’. */
  application: string;
  /** Information shown on the Tweet label */
  details?: string;
  /** Event time. */
  event_at: string;
  /** The type of label on the Tweet */
  event_type: string;
  /** Link to more information about this kind of label */
  extended_details_url?: string;
  /** Title/header of the Tweet label */
  label_title?: string;
  tweet: PostDeleteActivityResponsePayload;
}
export const PostNotice = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    application: S.String,
    details: S.optional(S.String),
    event_at: S.String,
    event_type: S.String,
    extended_details_url: S.optional(S.String),
    label_title: S.optional(S.String),
    tweet: PostDeleteActivityResponsePayload,
  }),
).annotate({ identifier: "PostNotice" }) as any as S.Schema<PostNotice>;

export interface PostNoticeSchema {
  public_tweet_notice: PostNotice;
}
export const PostNoticeSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    public_tweet_notice: PostNotice,
  }),
).annotate({
  identifier: "PostNoticeSchema",
}) as any as S.Schema<PostNoticeSchema>;

export type PostUnviewableTweet = PostDeleteActivityResponsePayload;
export const PostUnviewableTweet = PostDeleteActivityResponsePayload;

export interface PostUnviewable {
  /** If the label is being applied or removed. Possible values are ‘apply’ or ‘remove’. */
  application: string;
  /** Event time. */
  event_at: string;
  tweet: PostDeleteActivityResponsePayload;
}
export const PostUnviewable = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    application: S.String,
    event_at: S.String,
    tweet: PostDeleteActivityResponsePayload,
  }),
).annotate({ identifier: "PostUnviewable" }) as any as S.Schema<PostUnviewable>;

export interface PostUnviewableSchema {
  public_tweet_unviewable: PostUnviewable;
}
export const PostUnviewableSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    public_tweet_unviewable: PostUnviewable,
  }),
).annotate({
  identifier: "PostUnviewableSchema",
}) as any as S.Schema<PostUnviewableSchema>;

/** Tweet label data. */
export type PostLabelData = PostNoticeSchema | PostUnviewableSchema;
export const PostLabelData =
  /*@__PURE__*/ S.Unknown as any as S.Schema<PostLabelData>;
/** Tweet Label event. */
export interface StreamLabelsComplianceResponseCase0 {
  data: PostLabelData;
}
export const StreamLabelsComplianceResponseCase0 = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: PostLabelData,
  }),
).annotate({
  identifier: "StreamLabelsComplianceResponseCase0",
}) as any as S.Schema<StreamLabelsComplianceResponseCase0>;

export type StreamLabelsComplianceResponseCase1ErrorsList = Array<Problem>;
export const StreamLabelsComplianceResponseCase1ErrorsList =
  /*@__PURE__*/ S.Array(
    Problem,
  ) as any as S.Schema<StreamLabelsComplianceResponseCase1ErrorsList>;

export interface StreamLabelsComplianceResponseCase1 {
  errors: StreamLabelsComplianceResponseCase1ErrorsList;
}
export const StreamLabelsComplianceResponseCase1 = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    errors: StreamLabelsComplianceResponseCase1ErrorsList,
  }),
).annotate({
  identifier: "StreamLabelsComplianceResponseCase1",
}) as any as S.Schema<StreamLabelsComplianceResponseCase1>;

/** Tweet label stream events. */
export type StreamLabelsComplianceResponse =
  | StreamLabelsComplianceResponseCase0
  | StreamLabelsComplianceResponseCase1;
export const StreamLabelsComplianceResponse =
  /*@__PURE__*/ S.Unknown as any as S.Schema<StreamLabelsComplianceResponse>;
export type StreamLabelsComplianceResponse2 = StreamLabelsComplianceResponse;
export const StreamLabelsComplianceResponse2 = /*@__PURE__*/ S.suspend(() =>
  StreamLabelsComplianceResponse.pipe(T.RawResponseRoot()),
).annotate({
  identifier: "StreamLabelsComplianceResponse2",
}) as any as S.Schema<StreamLabelsComplianceResponse2>;

export interface StreamLikesComplianceRequest {
  /** The number of minutes of backfill requested. */
  backfill_minutes?: number;
  /** YYYY-MM-DDTHH:mm:ssZ. The earliest UTC timestamp from which the Likes Compliance events will be provided. */
  start_time?: string;
  /** YYYY-MM-DDTHH:mm:ssZ. The latest UTC timestamp from which the Likes Compliance events will be provided. */
  end_time?: string;
}
export const StreamLikesComplianceRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    backfill_minutes: S.optional(S.Number.pipe(T.Query())),
    start_time: S.optional(S.String.pipe(T.Query())),
    end_time: S.optional(S.String.pipe(T.Query())),
  }).pipe(
    T.Http({ method: "GET", uri: "/2/likes/compliance/stream", code: 200 }),
  ),
).annotate({
  identifier: "StreamLikesComplianceRequest",
}) as any as S.Schema<StreamLikesComplianceRequest>;

export interface UnlikeComplianceSchemaFavorite {
  id: string;
  user_id: string;
}
export const UnlikeComplianceSchemaFavorite = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String,
    user_id: S.String,
  }),
).annotate({
  identifier: "UnlikeComplianceSchemaFavorite",
}) as any as S.Schema<UnlikeComplianceSchemaFavorite>;

export interface UnlikeComplianceSchema {
  /** Event time. */
  event_at: string;
  favorite: UnlikeComplianceSchemaFavorite;
}
export const UnlikeComplianceSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    event_at: S.String,
    favorite: UnlikeComplianceSchemaFavorite,
  }),
).annotate({
  identifier: "UnlikeComplianceSchema",
}) as any as S.Schema<UnlikeComplianceSchema>;

export interface LikeComplianceSchema {
  delete: UnlikeComplianceSchema;
}
export const LikeComplianceSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    delete: UnlikeComplianceSchema,
  }),
).annotate({
  identifier: "LikeComplianceSchema",
}) as any as S.Schema<LikeComplianceSchema>;

/** Compliance event. */
export interface StreamLikesComplianceResponseCase0 {
  data: LikeComplianceSchema;
}
export const StreamLikesComplianceResponseCase0 = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: LikeComplianceSchema,
  }),
).annotate({
  identifier: "StreamLikesComplianceResponseCase0",
}) as any as S.Schema<StreamLikesComplianceResponseCase0>;

export type StreamLikesComplianceResponseCase1ErrorsList = Array<Problem>;
export const StreamLikesComplianceResponseCase1ErrorsList =
  /*@__PURE__*/ S.Array(
    Problem,
  ) as any as S.Schema<StreamLikesComplianceResponseCase1ErrorsList>;

export interface StreamLikesComplianceResponseCase1 {
  errors: StreamLikesComplianceResponseCase1ErrorsList;
}
export const StreamLikesComplianceResponseCase1 = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    errors: StreamLikesComplianceResponseCase1ErrorsList,
  }),
).annotate({
  identifier: "StreamLikesComplianceResponseCase1",
}) as any as S.Schema<StreamLikesComplianceResponseCase1>;

/** Likes compliance stream events. */
export type StreamLikesComplianceResponse =
  | StreamLikesComplianceResponseCase0
  | StreamLikesComplianceResponseCase1;
export const StreamLikesComplianceResponse =
  /*@__PURE__*/ S.Unknown as any as S.Schema<StreamLikesComplianceResponse>;
export type StreamLikesComplianceResponse2 = StreamLikesComplianceResponse;
export const StreamLikesComplianceResponse2 = /*@__PURE__*/ S.suspend(() =>
  StreamLikesComplianceResponse.pipe(T.RawResponseRoot()),
).annotate({
  identifier: "StreamLikesComplianceResponse2",
}) as any as S.Schema<StreamLikesComplianceResponse2>;

export type StreamLikesFirehoseRequestLikeWithTweetAuthorFieldsItem =
  | "attachments_media_keys"
  | "created_at"
  | "id"
  | "liked_tweet_author_id"
  | "liked_tweet_id"
  | "timestamp_ms";
export const StreamLikesFirehoseRequestLikeWithTweetAuthorFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamLikesFirehoseRequestLikeWithTweetAuthorFieldsList = Array<
  StreamLikesFirehoseRequestLikeWithTweetAuthorFieldsItem | (string & {})
>;
export const StreamLikesFirehoseRequestLikeWithTweetAuthorFieldsList =
  /*@__PURE__*/ S.Array(
    StreamLikesFirehoseRequestLikeWithTweetAuthorFieldsItem,
  ) as any as S.Schema<StreamLikesFirehoseRequestLikeWithTweetAuthorFieldsList>;

export type StreamLikesFirehoseRequestExpansionsItem =
  | "attachments.media_keys"
  | "liked_tweet_author_id"
  | "liked_tweet_id";
export const StreamLikesFirehoseRequestExpansionsItem = /*@__PURE__*/ S.String;

export type StreamLikesFirehoseRequestExpansionsList = Array<
  StreamLikesFirehoseRequestExpansionsItem | (string & {})
>;
export const StreamLikesFirehoseRequestExpansionsList = /*@__PURE__*/ S.Array(
  StreamLikesFirehoseRequestExpansionsItem,
) as any as S.Schema<StreamLikesFirehoseRequestExpansionsList>;

export type StreamLikesFirehoseRequestMediaFieldsItem =
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
export const StreamLikesFirehoseRequestMediaFieldsItem = /*@__PURE__*/ S.String;

export type StreamLikesFirehoseRequestMediaFieldsList = Array<
  StreamLikesFirehoseRequestMediaFieldsItem | (string & {})
>;
export const StreamLikesFirehoseRequestMediaFieldsList = /*@__PURE__*/ S.Array(
  StreamLikesFirehoseRequestMediaFieldsItem,
) as any as S.Schema<StreamLikesFirehoseRequestMediaFieldsList>;

export type StreamLikesFirehoseRequestUserFieldsItem =
  | "affiliation"
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "most_recent_tweet_id"
  | "name"
  | "parody"
  | "pinned_tweet_id"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const StreamLikesFirehoseRequestUserFieldsItem = /*@__PURE__*/ S.String;

export type StreamLikesFirehoseRequestUserFieldsList = Array<
  StreamLikesFirehoseRequestUserFieldsItem | (string & {})
>;
export const StreamLikesFirehoseRequestUserFieldsList = /*@__PURE__*/ S.Array(
  StreamLikesFirehoseRequestUserFieldsItem,
) as any as S.Schema<StreamLikesFirehoseRequestUserFieldsList>;

export type StreamLikesFirehoseRequestTweetFieldsItem =
  | "article"
  | "attachments"
  | "author_id"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "edit_history_tweet_ids"
  | "entities"
  | "geo"
  | "id"
  | "in_reply_to_user_id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_request_suggestions"
  | "note_tweet"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "referenced_tweets"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const StreamLikesFirehoseRequestTweetFieldsItem = /*@__PURE__*/ S.String;

export type StreamLikesFirehoseRequestTweetFieldsList = Array<
  StreamLikesFirehoseRequestTweetFieldsItem | (string & {})
>;
export const StreamLikesFirehoseRequestTweetFieldsList = /*@__PURE__*/ S.Array(
  StreamLikesFirehoseRequestTweetFieldsItem,
) as any as S.Schema<StreamLikesFirehoseRequestTweetFieldsList>;

export interface StreamLikesFirehoseRequest {
  /** The number of minutes of backfill requested. */
  backfill_minutes?: number;
  /** The partition number. */
  partition: number;
  /** YYYY-MM-DDTHH:mm:ssZ. The earliest UTC timestamp to which the Likes will be provided. */
  start_time?: string;
  /** YYYY-MM-DDTHH:mm:ssZ. The latest UTC timestamp to which the Posts will be provided. */
  end_time?: string;
  /** A comma separated list of LikeWithTweetAuthor fields to display. */
  like_with_tweet_author_fields?: StreamLikesFirehoseRequestLikeWithTweetAuthorFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: StreamLikesFirehoseRequestExpansionsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: StreamLikesFirehoseRequestMediaFieldsList;
  /** A comma separated list of User fields to display. */
  user_fields?: StreamLikesFirehoseRequestUserFieldsList;
  /** A comma separated list of Tweet fields to display. */
  tweet_fields?: StreamLikesFirehoseRequestTweetFieldsList;
}
export const StreamLikesFirehoseRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    backfill_minutes: S.optional(S.Number.pipe(T.Query())),
    partition: S.Number.pipe(T.Query()),
    start_time: S.optional(S.String.pipe(T.Query())),
    end_time: S.optional(S.String.pipe(T.Query())),
    like_with_tweet_author_fields: S.optional(
      StreamLikesFirehoseRequestLikeWithTweetAuthorFieldsList.pipe(
        T.Query("like_with_tweet_author.fields"),
      ),
    ),
    expansions: S.optional(
      StreamLikesFirehoseRequestExpansionsList.pipe(T.Query()),
    ),
    media_fields: S.optional(
      StreamLikesFirehoseRequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
    user_fields: S.optional(
      StreamLikesFirehoseRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    tweet_fields: S.optional(
      StreamLikesFirehoseRequestTweetFieldsList.pipe(T.Query("tweet.fields")),
    ),
  }).pipe(
    T.Http({ method: "GET", uri: "/2/likes/firehose/stream", code: 200 }),
  ),
).annotate({
  identifier: "StreamLikesFirehoseRequest",
}) as any as S.Schema<StreamLikesFirehoseRequest>;

export type StreamLikesFirehoseResponseErrorsList = Array<Problem>;
export const StreamLikesFirehoseResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<StreamLikesFirehoseResponseErrorsList>;

export interface StreamLikesFirehoseResponse {
  data?: LikeWithPostAuthor;
  errors?: StreamLikesFirehoseResponseErrorsList;
  includes?: Expansions;
}
export const StreamLikesFirehoseResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(LikeWithPostAuthor),
    errors: S.optional(StreamLikesFirehoseResponseErrorsList),
    includes: S.optional(Expansions),
  }),
).annotate({
  identifier: "StreamLikesFirehoseResponse",
}) as any as S.Schema<StreamLikesFirehoseResponse>;

export type StreamLikesSample10RequestLikeWithTweetAuthorFieldsItem =
  | "attachments_media_keys"
  | "created_at"
  | "id"
  | "liked_tweet_author_id"
  | "liked_tweet_id"
  | "timestamp_ms";
export const StreamLikesSample10RequestLikeWithTweetAuthorFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamLikesSample10RequestLikeWithTweetAuthorFieldsList = Array<
  StreamLikesSample10RequestLikeWithTweetAuthorFieldsItem | (string & {})
>;
export const StreamLikesSample10RequestLikeWithTweetAuthorFieldsList =
  /*@__PURE__*/ S.Array(
    StreamLikesSample10RequestLikeWithTweetAuthorFieldsItem,
  ) as any as S.Schema<StreamLikesSample10RequestLikeWithTweetAuthorFieldsList>;

export type StreamLikesSample10RequestExpansionsItem =
  | "attachments.media_keys"
  | "liked_tweet_author_id"
  | "liked_tweet_id";
export const StreamLikesSample10RequestExpansionsItem = /*@__PURE__*/ S.String;

export type StreamLikesSample10RequestExpansionsList = Array<
  StreamLikesSample10RequestExpansionsItem | (string & {})
>;
export const StreamLikesSample10RequestExpansionsList = /*@__PURE__*/ S.Array(
  StreamLikesSample10RequestExpansionsItem,
) as any as S.Schema<StreamLikesSample10RequestExpansionsList>;

export type StreamLikesSample10RequestMediaFieldsItem =
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
export const StreamLikesSample10RequestMediaFieldsItem = /*@__PURE__*/ S.String;

export type StreamLikesSample10RequestMediaFieldsList = Array<
  StreamLikesSample10RequestMediaFieldsItem | (string & {})
>;
export const StreamLikesSample10RequestMediaFieldsList = /*@__PURE__*/ S.Array(
  StreamLikesSample10RequestMediaFieldsItem,
) as any as S.Schema<StreamLikesSample10RequestMediaFieldsList>;

export type StreamLikesSample10RequestUserFieldsItem =
  | "affiliation"
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "most_recent_tweet_id"
  | "name"
  | "parody"
  | "pinned_tweet_id"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const StreamLikesSample10RequestUserFieldsItem = /*@__PURE__*/ S.String;

export type StreamLikesSample10RequestUserFieldsList = Array<
  StreamLikesSample10RequestUserFieldsItem | (string & {})
>;
export const StreamLikesSample10RequestUserFieldsList = /*@__PURE__*/ S.Array(
  StreamLikesSample10RequestUserFieldsItem,
) as any as S.Schema<StreamLikesSample10RequestUserFieldsList>;

export type StreamLikesSample10RequestTweetFieldsItem =
  | "article"
  | "attachments"
  | "author_id"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "edit_history_tweet_ids"
  | "entities"
  | "geo"
  | "id"
  | "in_reply_to_user_id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_request_suggestions"
  | "note_tweet"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "referenced_tweets"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const StreamLikesSample10RequestTweetFieldsItem = /*@__PURE__*/ S.String;

export type StreamLikesSample10RequestTweetFieldsList = Array<
  StreamLikesSample10RequestTweetFieldsItem | (string & {})
>;
export const StreamLikesSample10RequestTweetFieldsList = /*@__PURE__*/ S.Array(
  StreamLikesSample10RequestTweetFieldsItem,
) as any as S.Schema<StreamLikesSample10RequestTweetFieldsList>;

export interface StreamLikesSample10Request {
  /** The number of minutes of backfill requested. */
  backfill_minutes?: number;
  /** The partition number. */
  partition: number;
  /** YYYY-MM-DDTHH:mm:ssZ. The earliest UTC timestamp to which the Likes will be provided. */
  start_time?: string;
  /** YYYY-MM-DDTHH:mm:ssZ. The latest UTC timestamp to which the Posts will be provided. */
  end_time?: string;
  /** A comma separated list of LikeWithTweetAuthor fields to display. */
  like_with_tweet_author_fields?: StreamLikesSample10RequestLikeWithTweetAuthorFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: StreamLikesSample10RequestExpansionsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: StreamLikesSample10RequestMediaFieldsList;
  /** A comma separated list of User fields to display. */
  user_fields?: StreamLikesSample10RequestUserFieldsList;
  /** A comma separated list of Tweet fields to display. */
  tweet_fields?: StreamLikesSample10RequestTweetFieldsList;
}
export const StreamLikesSample10Request = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    backfill_minutes: S.optional(S.Number.pipe(T.Query())),
    partition: S.Number.pipe(T.Query()),
    start_time: S.optional(S.String.pipe(T.Query())),
    end_time: S.optional(S.String.pipe(T.Query())),
    like_with_tweet_author_fields: S.optional(
      StreamLikesSample10RequestLikeWithTweetAuthorFieldsList.pipe(
        T.Query("like_with_tweet_author.fields"),
      ),
    ),
    expansions: S.optional(
      StreamLikesSample10RequestExpansionsList.pipe(T.Query()),
    ),
    media_fields: S.optional(
      StreamLikesSample10RequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
    user_fields: S.optional(
      StreamLikesSample10RequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    tweet_fields: S.optional(
      StreamLikesSample10RequestTweetFieldsList.pipe(T.Query("tweet.fields")),
    ),
  }).pipe(
    T.Http({ method: "GET", uri: "/2/likes/sample10/stream", code: 200 }),
  ),
).annotate({
  identifier: "StreamLikesSample10Request",
}) as any as S.Schema<StreamLikesSample10Request>;

export type StreamLikesSample10ResponseErrorsList = Array<Problem>;
export const StreamLikesSample10ResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<StreamLikesSample10ResponseErrorsList>;

export interface StreamLikesSample10Response {
  data?: LikeWithPostAuthor;
  errors?: StreamLikesSample10ResponseErrorsList;
  includes?: Expansions;
}
export const StreamLikesSample10Response = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(LikeWithPostAuthor),
    errors: S.optional(StreamLikesSample10ResponseErrorsList),
    includes: S.optional(Expansions),
  }),
).annotate({
  identifier: "StreamLikesSample10Response",
}) as any as S.Schema<StreamLikesSample10Response>;

export type StreamPostsRequestTweetFieldsItem =
  | "article"
  | "attachments"
  | "author_id"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "edit_history_tweet_ids"
  | "entities"
  | "geo"
  | "id"
  | "in_reply_to_user_id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_request_suggestions"
  | "note_tweet"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "referenced_tweets"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const StreamPostsRequestTweetFieldsItem = /*@__PURE__*/ S.String;

export type StreamPostsRequestTweetFieldsList = Array<
  StreamPostsRequestTweetFieldsItem | (string & {})
>;
export const StreamPostsRequestTweetFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsRequestTweetFieldsItem,
) as any as S.Schema<StreamPostsRequestTweetFieldsList>;

export type StreamPostsRequestExpansionsItem =
  | "article.cover_media"
  | "article.media_entities"
  | "attachments.media_keys"
  | "attachments.media_source_tweet"
  | "attachments.poll_ids"
  | "author_id"
  | "edit_history_tweet_ids"
  | "entities.mentions.username"
  | "geo.place_id"
  | "in_reply_to_user_id"
  | "entities.note.mentions.username"
  | "referenced_tweets.id"
  | "referenced_tweets.id.attachments.media_keys"
  | "referenced_tweets.id.author_id";
export const StreamPostsRequestExpansionsItem = /*@__PURE__*/ S.String;

export type StreamPostsRequestExpansionsList = Array<
  StreamPostsRequestExpansionsItem | (string & {})
>;
export const StreamPostsRequestExpansionsList = /*@__PURE__*/ S.Array(
  StreamPostsRequestExpansionsItem,
) as any as S.Schema<StreamPostsRequestExpansionsList>;

export type StreamPostsRequestMediaFieldsItem =
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
export const StreamPostsRequestMediaFieldsItem = /*@__PURE__*/ S.String;

export type StreamPostsRequestMediaFieldsList = Array<
  StreamPostsRequestMediaFieldsItem | (string & {})
>;
export const StreamPostsRequestMediaFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsRequestMediaFieldsItem,
) as any as S.Schema<StreamPostsRequestMediaFieldsList>;

export type StreamPostsRequestPollFieldsItem =
  | "duration_minutes"
  | "end_datetime"
  | "id"
  | "options"
  | "voting_status";
export const StreamPostsRequestPollFieldsItem = /*@__PURE__*/ S.String;

export type StreamPostsRequestPollFieldsList = Array<
  StreamPostsRequestPollFieldsItem | (string & {})
>;
export const StreamPostsRequestPollFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsRequestPollFieldsItem,
) as any as S.Schema<StreamPostsRequestPollFieldsList>;

export type StreamPostsRequestUserFieldsItem =
  | "affiliation"
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "most_recent_tweet_id"
  | "name"
  | "parody"
  | "pinned_tweet_id"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const StreamPostsRequestUserFieldsItem = /*@__PURE__*/ S.String;

export type StreamPostsRequestUserFieldsList = Array<
  StreamPostsRequestUserFieldsItem | (string & {})
>;
export const StreamPostsRequestUserFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsRequestUserFieldsItem,
) as any as S.Schema<StreamPostsRequestUserFieldsList>;

export type StreamPostsRequestPlaceFieldsItem =
  | "contained_within"
  | "country"
  | "country_code"
  | "full_name"
  | "geo"
  | "id"
  | "name"
  | "place_type";
export const StreamPostsRequestPlaceFieldsItem = /*@__PURE__*/ S.String;

export type StreamPostsRequestPlaceFieldsList = Array<
  StreamPostsRequestPlaceFieldsItem | (string & {})
>;
export const StreamPostsRequestPlaceFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsRequestPlaceFieldsItem,
) as any as S.Schema<StreamPostsRequestPlaceFieldsList>;

export interface StreamPostsRequest {
  /** The number of minutes of backfill requested. */
  backfill_minutes?: number;
  /** YYYY-MM-DDTHH:mm:ssZ. The earliest UTC timestamp to which the Posts will be provided. */
  start_time?: string;
  /** YYYY-MM-DDTHH:mm:ssZ. The latest UTC timestamp to which the Posts will be provided. */
  end_time?: string;
  /** A comma separated list of Tweet fields to display. */
  tweet_fields?: StreamPostsRequestTweetFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: StreamPostsRequestExpansionsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: StreamPostsRequestMediaFieldsList;
  /** A comma separated list of Poll fields to display. */
  poll_fields?: StreamPostsRequestPollFieldsList;
  /** A comma separated list of User fields to display. */
  user_fields?: StreamPostsRequestUserFieldsList;
  /** A comma separated list of Place fields to display. */
  place_fields?: StreamPostsRequestPlaceFieldsList;
}
export const StreamPostsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    backfill_minutes: S.optional(S.Number.pipe(T.Query())),
    start_time: S.optional(S.String.pipe(T.Query())),
    end_time: S.optional(S.String.pipe(T.Query())),
    tweet_fields: S.optional(
      StreamPostsRequestTweetFieldsList.pipe(T.Query("tweet.fields")),
    ),
    expansions: S.optional(StreamPostsRequestExpansionsList.pipe(T.Query())),
    media_fields: S.optional(
      StreamPostsRequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
    poll_fields: S.optional(
      StreamPostsRequestPollFieldsList.pipe(T.Query("poll.fields")),
    ),
    user_fields: S.optional(
      StreamPostsRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    place_fields: S.optional(
      StreamPostsRequestPlaceFieldsList.pipe(T.Query("place.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/tweets/search/stream", code: 200 })),
).annotate({
  identifier: "StreamPostsRequest",
}) as any as S.Schema<StreamPostsRequest>;

export type StreamPostsResponseErrorsList = Array<Problem>;
export const StreamPostsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<StreamPostsResponseErrorsList>;

export interface StreamPostsResponseMatchingRulesItem {
  id: string;
  tag?: string;
}
export const StreamPostsResponseMatchingRulesItem = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      id: S.String,
      tag: S.optional(S.String),
    }),
).annotate({
  identifier: "StreamPostsResponseMatchingRulesItem",
}) as any as S.Schema<StreamPostsResponseMatchingRulesItem>;

/** The list of rules which matched the Tweet */
export type StreamPostsResponseMatchingRulesList =
  Array<StreamPostsResponseMatchingRulesItem>;
export const StreamPostsResponseMatchingRulesList = /*@__PURE__*/ S.Array(
  StreamPostsResponseMatchingRulesItem,
) as any as S.Schema<StreamPostsResponseMatchingRulesList>;

/** A Tweet or error that can be returned by the streaming Tweet API. The values returned with a successful streamed Tweet includes the user provided rules that the Tweet matched. */
export interface StreamPostsResponse {
  data?: Post;
  errors?: StreamPostsResponseErrorsList;
  includes?: Expansions;
  /** The list of rules which matched the Tweet */
  matching_rules?: StreamPostsResponseMatchingRulesList;
}
export const StreamPostsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(Post),
    errors: S.optional(StreamPostsResponseErrorsList),
    includes: S.optional(Expansions),
    matching_rules: S.optional(StreamPostsResponseMatchingRulesList),
  }),
).annotate({
  identifier: "StreamPostsResponse",
}) as any as S.Schema<StreamPostsResponse>;

export interface StreamPostsComplianceRequest {
  /** The number of minutes of backfill requested. */
  backfill_minutes?: number;
  /** The partition number. */
  partition: number;
  /** YYYY-MM-DDTHH:mm:ssZ. The earliest UTC timestamp from which the Post Compliance events will be provided. */
  start_time?: string;
  /** YYYY-MM-DDTHH:mm:ssZ. The latest UTC timestamp from which the Post Compliance events will be provided. */
  end_time?: string;
}
export const StreamPostsComplianceRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    backfill_minutes: S.optional(S.Number.pipe(T.Query())),
    partition: S.Number.pipe(T.Query()),
    start_time: S.optional(S.String.pipe(T.Query())),
    end_time: S.optional(S.String.pipe(T.Query())),
  }).pipe(
    T.Http({ method: "GET", uri: "/2/tweets/compliance/stream", code: 200 }),
  ),
).annotate({
  identifier: "StreamPostsComplianceRequest",
}) as any as S.Schema<StreamPostsComplianceRequest>;

export type PostComplianceSchemaTweet = PostDeleteActivityResponsePayload;
export const PostComplianceSchemaTweet = PostDeleteActivityResponsePayload;

export interface PostComplianceSchema {
  /** Event time. */
  event_at: string;
  quote_tweet_id?: string;
  tweet: PostDeleteActivityResponsePayload;
}
export const PostComplianceSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    event_at: S.String,
    quote_tweet_id: S.optional(S.String),
    tweet: PostDeleteActivityResponsePayload,
  }),
).annotate({
  identifier: "PostComplianceSchema",
}) as any as S.Schema<PostComplianceSchema>;

export interface PostDeleteComplianceSchema {
  delete: PostComplianceSchema;
}
export const PostDeleteComplianceSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    delete: PostComplianceSchema,
  }),
).annotate({
  identifier: "PostDeleteComplianceSchema",
}) as any as S.Schema<PostDeleteComplianceSchema>;

export type PostTakedownComplianceSchemaTweet =
  PostDeleteActivityResponsePayload;
export const PostTakedownComplianceSchemaTweet =
  PostDeleteActivityResponsePayload;

export type PostTakedownComplianceSchemaWithheldInCountriesList = Array<string>;
export const PostTakedownComplianceSchemaWithheldInCountriesList =
  /*@__PURE__*/ S.Array(
    S.String,
  ) as any as S.Schema<PostTakedownComplianceSchemaWithheldInCountriesList>;

export interface PostTakedownComplianceSchema {
  /** Event time. */
  event_at: string;
  quote_tweet_id?: string;
  tweet: PostDeleteActivityResponsePayload;
  withheld_in_countries: PostTakedownComplianceSchemaWithheldInCountriesList;
}
export const PostTakedownComplianceSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    event_at: S.String,
    quote_tweet_id: S.optional(S.String),
    tweet: PostDeleteActivityResponsePayload,
    withheld_in_countries: PostTakedownComplianceSchemaWithheldInCountriesList,
  }),
).annotate({
  identifier: "PostTakedownComplianceSchema",
}) as any as S.Schema<PostTakedownComplianceSchema>;

export interface PostWithheldComplianceSchema {
  withheld: PostTakedownComplianceSchema;
}
export const PostWithheldComplianceSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    withheld: PostTakedownComplianceSchema,
  }),
).annotate({
  identifier: "PostWithheldComplianceSchema",
}) as any as S.Schema<PostWithheldComplianceSchema>;

export interface PostDropComplianceSchema {
  drop: PostComplianceSchema;
}
export const PostDropComplianceSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    drop: PostComplianceSchema,
  }),
).annotate({
  identifier: "PostDropComplianceSchema",
}) as any as S.Schema<PostDropComplianceSchema>;

export interface PostUndropComplianceSchema {
  undrop: PostComplianceSchema;
}
export const PostUndropComplianceSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    undrop: PostComplianceSchema,
  }),
).annotate({
  identifier: "PostUndropComplianceSchema",
}) as any as S.Schema<PostUndropComplianceSchema>;

export type PostEditComplianceObjectSchemaEditTweetIdsList = Array<string>;
export const PostEditComplianceObjectSchemaEditTweetIdsList =
  /*@__PURE__*/ S.Array(
    S.String,
  ) as any as S.Schema<PostEditComplianceObjectSchemaEditTweetIdsList>;

export interface PostEditComplianceObjectSchemaTweet {
  id: string;
}
export const PostEditComplianceObjectSchemaTweet = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String,
  }),
).annotate({
  identifier: "PostEditComplianceObjectSchemaTweet",
}) as any as S.Schema<PostEditComplianceObjectSchemaTweet>;

export interface PostEditComplianceObjectSchema {
  edit_tweet_ids: PostEditComplianceObjectSchemaEditTweetIdsList;
  /** Event time. */
  event_at: string;
  initial_tweet_id: string;
  tweet: PostEditComplianceObjectSchemaTweet;
}
export const PostEditComplianceObjectSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    edit_tweet_ids: PostEditComplianceObjectSchemaEditTweetIdsList,
    event_at: S.String,
    initial_tweet_id: S.String,
    tweet: PostEditComplianceObjectSchemaTweet,
  }),
).annotate({
  identifier: "PostEditComplianceObjectSchema",
}) as any as S.Schema<PostEditComplianceObjectSchema>;

export interface PostEditComplianceSchema {
  tweet_edit: PostEditComplianceObjectSchema;
}
export const PostEditComplianceSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    tweet_edit: PostEditComplianceObjectSchema,
  }),
).annotate({
  identifier: "PostEditComplianceSchema",
}) as any as S.Schema<PostEditComplianceSchema>;

/** Tweet compliance data. */
export type PostComplianceData =
  | PostDeleteComplianceSchema
  | PostWithheldComplianceSchema
  | PostDropComplianceSchema
  | PostUndropComplianceSchema
  | PostEditComplianceSchema;
export const PostComplianceData =
  /*@__PURE__*/ S.Unknown as any as S.Schema<PostComplianceData>;
/** Compliance event. */
export interface StreamPostsComplianceResponseCase0 {
  data: PostComplianceData;
}
export const StreamPostsComplianceResponseCase0 = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: PostComplianceData,
  }),
).annotate({
  identifier: "StreamPostsComplianceResponseCase0",
}) as any as S.Schema<StreamPostsComplianceResponseCase0>;

export type StreamPostsComplianceResponseCase1ErrorsList = Array<Problem>;
export const StreamPostsComplianceResponseCase1ErrorsList =
  /*@__PURE__*/ S.Array(
    Problem,
  ) as any as S.Schema<StreamPostsComplianceResponseCase1ErrorsList>;

export interface StreamPostsComplianceResponseCase1 {
  errors: StreamPostsComplianceResponseCase1ErrorsList;
}
export const StreamPostsComplianceResponseCase1 = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    errors: StreamPostsComplianceResponseCase1ErrorsList,
  }),
).annotate({
  identifier: "StreamPostsComplianceResponseCase1",
}) as any as S.Schema<StreamPostsComplianceResponseCase1>;

/** Tweet compliance stream events. */
export type StreamPostsComplianceResponse =
  | StreamPostsComplianceResponseCase0
  | StreamPostsComplianceResponseCase1;
export const StreamPostsComplianceResponse =
  /*@__PURE__*/ S.Unknown as any as S.Schema<StreamPostsComplianceResponse>;
export type StreamPostsComplianceResponse2 = StreamPostsComplianceResponse;
export const StreamPostsComplianceResponse2 = /*@__PURE__*/ S.suspend(() =>
  StreamPostsComplianceResponse.pipe(T.RawResponseRoot()),
).annotate({
  identifier: "StreamPostsComplianceResponse2",
}) as any as S.Schema<StreamPostsComplianceResponse2>;

export type StreamPostsFirehoseRequestTweetFieldsItem =
  | "article"
  | "attachments"
  | "author_id"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "edit_history_tweet_ids"
  | "entities"
  | "geo"
  | "id"
  | "in_reply_to_user_id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_request_suggestions"
  | "note_tweet"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "referenced_tweets"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const StreamPostsFirehoseRequestTweetFieldsItem = /*@__PURE__*/ S.String;

export type StreamPostsFirehoseRequestTweetFieldsList = Array<
  StreamPostsFirehoseRequestTweetFieldsItem | (string & {})
>;
export const StreamPostsFirehoseRequestTweetFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsFirehoseRequestTweetFieldsItem,
) as any as S.Schema<StreamPostsFirehoseRequestTweetFieldsList>;

export type StreamPostsFirehoseRequestExpansionsItem =
  | "article.cover_media"
  | "article.media_entities"
  | "attachments.media_keys"
  | "attachments.media_source_tweet"
  | "attachments.poll_ids"
  | "author_id"
  | "edit_history_tweet_ids"
  | "entities.mentions.username"
  | "geo.place_id"
  | "in_reply_to_user_id"
  | "entities.note.mentions.username"
  | "referenced_tweets.id"
  | "referenced_tweets.id.attachments.media_keys"
  | "referenced_tweets.id.author_id";
export const StreamPostsFirehoseRequestExpansionsItem = /*@__PURE__*/ S.String;

export type StreamPostsFirehoseRequestExpansionsList = Array<
  StreamPostsFirehoseRequestExpansionsItem | (string & {})
>;
export const StreamPostsFirehoseRequestExpansionsList = /*@__PURE__*/ S.Array(
  StreamPostsFirehoseRequestExpansionsItem,
) as any as S.Schema<StreamPostsFirehoseRequestExpansionsList>;

export type StreamPostsFirehoseRequestMediaFieldsItem =
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
export const StreamPostsFirehoseRequestMediaFieldsItem = /*@__PURE__*/ S.String;

export type StreamPostsFirehoseRequestMediaFieldsList = Array<
  StreamPostsFirehoseRequestMediaFieldsItem | (string & {})
>;
export const StreamPostsFirehoseRequestMediaFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsFirehoseRequestMediaFieldsItem,
) as any as S.Schema<StreamPostsFirehoseRequestMediaFieldsList>;

export type StreamPostsFirehoseRequestPollFieldsItem =
  | "duration_minutes"
  | "end_datetime"
  | "id"
  | "options"
  | "voting_status";
export const StreamPostsFirehoseRequestPollFieldsItem = /*@__PURE__*/ S.String;

export type StreamPostsFirehoseRequestPollFieldsList = Array<
  StreamPostsFirehoseRequestPollFieldsItem | (string & {})
>;
export const StreamPostsFirehoseRequestPollFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsFirehoseRequestPollFieldsItem,
) as any as S.Schema<StreamPostsFirehoseRequestPollFieldsList>;

export type StreamPostsFirehoseRequestUserFieldsItem =
  | "affiliation"
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "most_recent_tweet_id"
  | "name"
  | "parody"
  | "pinned_tweet_id"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const StreamPostsFirehoseRequestUserFieldsItem = /*@__PURE__*/ S.String;

export type StreamPostsFirehoseRequestUserFieldsList = Array<
  StreamPostsFirehoseRequestUserFieldsItem | (string & {})
>;
export const StreamPostsFirehoseRequestUserFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsFirehoseRequestUserFieldsItem,
) as any as S.Schema<StreamPostsFirehoseRequestUserFieldsList>;

export type StreamPostsFirehoseRequestPlaceFieldsItem =
  | "contained_within"
  | "country"
  | "country_code"
  | "full_name"
  | "geo"
  | "id"
  | "name"
  | "place_type";
export const StreamPostsFirehoseRequestPlaceFieldsItem = /*@__PURE__*/ S.String;

export type StreamPostsFirehoseRequestPlaceFieldsList = Array<
  StreamPostsFirehoseRequestPlaceFieldsItem | (string & {})
>;
export const StreamPostsFirehoseRequestPlaceFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsFirehoseRequestPlaceFieldsItem,
) as any as S.Schema<StreamPostsFirehoseRequestPlaceFieldsList>;

export interface StreamPostsFirehoseRequest {
  /** The number of minutes of backfill requested. */
  backfill_minutes?: number;
  /** A comma separated list of Tweet fields to display. */
  tweet_fields?: StreamPostsFirehoseRequestTweetFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: StreamPostsFirehoseRequestExpansionsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: StreamPostsFirehoseRequestMediaFieldsList;
  /** A comma separated list of Poll fields to display. */
  poll_fields?: StreamPostsFirehoseRequestPollFieldsList;
  /** A comma separated list of User fields to display. */
  user_fields?: StreamPostsFirehoseRequestUserFieldsList;
  /** A comma separated list of Place fields to display. */
  place_fields?: StreamPostsFirehoseRequestPlaceFieldsList;
  /** The partition number. */
  partition: number;
  /** YYYY-MM-DDTHH:mm:ssZ. The earliest UTC timestamp to which the Posts will be provided. */
  start_time?: string;
  /** YYYY-MM-DDTHH:mm:ssZ. The latest UTC timestamp to which the Posts will be provided. */
  end_time?: string;
}
export const StreamPostsFirehoseRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    backfill_minutes: S.optional(S.Number.pipe(T.Query())),
    tweet_fields: S.optional(
      StreamPostsFirehoseRequestTweetFieldsList.pipe(T.Query("tweet.fields")),
    ),
    expansions: S.optional(
      StreamPostsFirehoseRequestExpansionsList.pipe(T.Query()),
    ),
    media_fields: S.optional(
      StreamPostsFirehoseRequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
    poll_fields: S.optional(
      StreamPostsFirehoseRequestPollFieldsList.pipe(T.Query("poll.fields")),
    ),
    user_fields: S.optional(
      StreamPostsFirehoseRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    place_fields: S.optional(
      StreamPostsFirehoseRequestPlaceFieldsList.pipe(T.Query("place.fields")),
    ),
    partition: S.Number.pipe(T.Query()),
    start_time: S.optional(S.String.pipe(T.Query())),
    end_time: S.optional(S.String.pipe(T.Query())),
  }).pipe(
    T.Http({ method: "GET", uri: "/2/tweets/firehose/stream", code: 200 }),
  ),
).annotate({
  identifier: "StreamPostsFirehoseRequest",
}) as any as S.Schema<StreamPostsFirehoseRequest>;

export type StreamPostsFirehoseResponseErrorsList = Array<Problem>;
export const StreamPostsFirehoseResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<StreamPostsFirehoseResponseErrorsList>;

export interface StreamPostsFirehoseResponse {
  data?: Post;
  errors?: StreamPostsFirehoseResponseErrorsList;
  includes?: Expansions;
}
export const StreamPostsFirehoseResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(Post),
    errors: S.optional(StreamPostsFirehoseResponseErrorsList),
    includes: S.optional(Expansions),
  }),
).annotate({
  identifier: "StreamPostsFirehoseResponse",
}) as any as S.Schema<StreamPostsFirehoseResponse>;

export type StreamPostsFirehoseEnRequestTweetFieldsItem =
  | "article"
  | "attachments"
  | "author_id"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "edit_history_tweet_ids"
  | "entities"
  | "geo"
  | "id"
  | "in_reply_to_user_id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_request_suggestions"
  | "note_tweet"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "referenced_tweets"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const StreamPostsFirehoseEnRequestTweetFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehoseEnRequestTweetFieldsList = Array<
  StreamPostsFirehoseEnRequestTweetFieldsItem | (string & {})
>;
export const StreamPostsFirehoseEnRequestTweetFieldsList =
  /*@__PURE__*/ S.Array(
    StreamPostsFirehoseEnRequestTweetFieldsItem,
  ) as any as S.Schema<StreamPostsFirehoseEnRequestTweetFieldsList>;

export type StreamPostsFirehoseEnRequestExpansionsItem =
  | "article.cover_media"
  | "article.media_entities"
  | "attachments.media_keys"
  | "attachments.media_source_tweet"
  | "attachments.poll_ids"
  | "author_id"
  | "edit_history_tweet_ids"
  | "entities.mentions.username"
  | "geo.place_id"
  | "in_reply_to_user_id"
  | "entities.note.mentions.username"
  | "referenced_tweets.id"
  | "referenced_tweets.id.attachments.media_keys"
  | "referenced_tweets.id.author_id";
export const StreamPostsFirehoseEnRequestExpansionsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehoseEnRequestExpansionsList = Array<
  StreamPostsFirehoseEnRequestExpansionsItem | (string & {})
>;
export const StreamPostsFirehoseEnRequestExpansionsList = /*@__PURE__*/ S.Array(
  StreamPostsFirehoseEnRequestExpansionsItem,
) as any as S.Schema<StreamPostsFirehoseEnRequestExpansionsList>;

export type StreamPostsFirehoseEnRequestMediaFieldsItem =
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
export const StreamPostsFirehoseEnRequestMediaFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehoseEnRequestMediaFieldsList = Array<
  StreamPostsFirehoseEnRequestMediaFieldsItem | (string & {})
>;
export const StreamPostsFirehoseEnRequestMediaFieldsList =
  /*@__PURE__*/ S.Array(
    StreamPostsFirehoseEnRequestMediaFieldsItem,
  ) as any as S.Schema<StreamPostsFirehoseEnRequestMediaFieldsList>;

export type StreamPostsFirehoseEnRequestPollFieldsItem =
  | "duration_minutes"
  | "end_datetime"
  | "id"
  | "options"
  | "voting_status";
export const StreamPostsFirehoseEnRequestPollFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehoseEnRequestPollFieldsList = Array<
  StreamPostsFirehoseEnRequestPollFieldsItem | (string & {})
>;
export const StreamPostsFirehoseEnRequestPollFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsFirehoseEnRequestPollFieldsItem,
) as any as S.Schema<StreamPostsFirehoseEnRequestPollFieldsList>;

export type StreamPostsFirehoseEnRequestUserFieldsItem =
  | "affiliation"
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "most_recent_tweet_id"
  | "name"
  | "parody"
  | "pinned_tweet_id"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const StreamPostsFirehoseEnRequestUserFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehoseEnRequestUserFieldsList = Array<
  StreamPostsFirehoseEnRequestUserFieldsItem | (string & {})
>;
export const StreamPostsFirehoseEnRequestUserFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsFirehoseEnRequestUserFieldsItem,
) as any as S.Schema<StreamPostsFirehoseEnRequestUserFieldsList>;

export type StreamPostsFirehoseEnRequestPlaceFieldsItem =
  | "contained_within"
  | "country"
  | "country_code"
  | "full_name"
  | "geo"
  | "id"
  | "name"
  | "place_type";
export const StreamPostsFirehoseEnRequestPlaceFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehoseEnRequestPlaceFieldsList = Array<
  StreamPostsFirehoseEnRequestPlaceFieldsItem | (string & {})
>;
export const StreamPostsFirehoseEnRequestPlaceFieldsList =
  /*@__PURE__*/ S.Array(
    StreamPostsFirehoseEnRequestPlaceFieldsItem,
  ) as any as S.Schema<StreamPostsFirehoseEnRequestPlaceFieldsList>;

export interface StreamPostsFirehoseEnRequest {
  /** The number of minutes of backfill requested. */
  backfill_minutes?: number;
  /** A comma separated list of Tweet fields to display. */
  tweet_fields?: StreamPostsFirehoseEnRequestTweetFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: StreamPostsFirehoseEnRequestExpansionsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: StreamPostsFirehoseEnRequestMediaFieldsList;
  /** A comma separated list of Poll fields to display. */
  poll_fields?: StreamPostsFirehoseEnRequestPollFieldsList;
  /** A comma separated list of User fields to display. */
  user_fields?: StreamPostsFirehoseEnRequestUserFieldsList;
  /** A comma separated list of Place fields to display. */
  place_fields?: StreamPostsFirehoseEnRequestPlaceFieldsList;
  /** The partition number. */
  partition: number;
  /** YYYY-MM-DDTHH:mm:ssZ. The earliest UTC timestamp to which the Posts will be provided. */
  start_time?: string;
  /** YYYY-MM-DDTHH:mm:ssZ. The latest UTC timestamp to which the Posts will be provided. */
  end_time?: string;
}
export const StreamPostsFirehoseEnRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    backfill_minutes: S.optional(S.Number.pipe(T.Query())),
    tweet_fields: S.optional(
      StreamPostsFirehoseEnRequestTweetFieldsList.pipe(T.Query("tweet.fields")),
    ),
    expansions: S.optional(
      StreamPostsFirehoseEnRequestExpansionsList.pipe(T.Query()),
    ),
    media_fields: S.optional(
      StreamPostsFirehoseEnRequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
    poll_fields: S.optional(
      StreamPostsFirehoseEnRequestPollFieldsList.pipe(T.Query("poll.fields")),
    ),
    user_fields: S.optional(
      StreamPostsFirehoseEnRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    place_fields: S.optional(
      StreamPostsFirehoseEnRequestPlaceFieldsList.pipe(T.Query("place.fields")),
    ),
    partition: S.Number.pipe(T.Query()),
    start_time: S.optional(S.String.pipe(T.Query())),
    end_time: S.optional(S.String.pipe(T.Query())),
  }).pipe(
    T.Http({
      method: "GET",
      uri: "/2/tweets/firehose/stream/lang/en",
      code: 200,
    }),
  ),
).annotate({
  identifier: "StreamPostsFirehoseEnRequest",
}) as any as S.Schema<StreamPostsFirehoseEnRequest>;

export type StreamPostsFirehoseEnResponseErrorsList = Array<Problem>;
export const StreamPostsFirehoseEnResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<StreamPostsFirehoseEnResponseErrorsList>;

export interface StreamPostsFirehoseEnResponse {
  data?: Post;
  errors?: StreamPostsFirehoseEnResponseErrorsList;
  includes?: Expansions;
}
export const StreamPostsFirehoseEnResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(Post),
    errors: S.optional(StreamPostsFirehoseEnResponseErrorsList),
    includes: S.optional(Expansions),
  }),
).annotate({
  identifier: "StreamPostsFirehoseEnResponse",
}) as any as S.Schema<StreamPostsFirehoseEnResponse>;

export type StreamPostsFirehoseJaRequestTweetFieldsItem =
  | "article"
  | "attachments"
  | "author_id"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "edit_history_tweet_ids"
  | "entities"
  | "geo"
  | "id"
  | "in_reply_to_user_id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_request_suggestions"
  | "note_tweet"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "referenced_tweets"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const StreamPostsFirehoseJaRequestTweetFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehoseJaRequestTweetFieldsList = Array<
  StreamPostsFirehoseJaRequestTweetFieldsItem | (string & {})
>;
export const StreamPostsFirehoseJaRequestTweetFieldsList =
  /*@__PURE__*/ S.Array(
    StreamPostsFirehoseJaRequestTweetFieldsItem,
  ) as any as S.Schema<StreamPostsFirehoseJaRequestTweetFieldsList>;

export type StreamPostsFirehoseJaRequestExpansionsItem =
  | "article.cover_media"
  | "article.media_entities"
  | "attachments.media_keys"
  | "attachments.media_source_tweet"
  | "attachments.poll_ids"
  | "author_id"
  | "edit_history_tweet_ids"
  | "entities.mentions.username"
  | "geo.place_id"
  | "in_reply_to_user_id"
  | "entities.note.mentions.username"
  | "referenced_tweets.id"
  | "referenced_tweets.id.attachments.media_keys"
  | "referenced_tweets.id.author_id";
export const StreamPostsFirehoseJaRequestExpansionsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehoseJaRequestExpansionsList = Array<
  StreamPostsFirehoseJaRequestExpansionsItem | (string & {})
>;
export const StreamPostsFirehoseJaRequestExpansionsList = /*@__PURE__*/ S.Array(
  StreamPostsFirehoseJaRequestExpansionsItem,
) as any as S.Schema<StreamPostsFirehoseJaRequestExpansionsList>;

export type StreamPostsFirehoseJaRequestMediaFieldsItem =
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
export const StreamPostsFirehoseJaRequestMediaFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehoseJaRequestMediaFieldsList = Array<
  StreamPostsFirehoseJaRequestMediaFieldsItem | (string & {})
>;
export const StreamPostsFirehoseJaRequestMediaFieldsList =
  /*@__PURE__*/ S.Array(
    StreamPostsFirehoseJaRequestMediaFieldsItem,
  ) as any as S.Schema<StreamPostsFirehoseJaRequestMediaFieldsList>;

export type StreamPostsFirehoseJaRequestPollFieldsItem =
  | "duration_minutes"
  | "end_datetime"
  | "id"
  | "options"
  | "voting_status";
export const StreamPostsFirehoseJaRequestPollFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehoseJaRequestPollFieldsList = Array<
  StreamPostsFirehoseJaRequestPollFieldsItem | (string & {})
>;
export const StreamPostsFirehoseJaRequestPollFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsFirehoseJaRequestPollFieldsItem,
) as any as S.Schema<StreamPostsFirehoseJaRequestPollFieldsList>;

export type StreamPostsFirehoseJaRequestUserFieldsItem =
  | "affiliation"
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "most_recent_tweet_id"
  | "name"
  | "parody"
  | "pinned_tweet_id"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const StreamPostsFirehoseJaRequestUserFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehoseJaRequestUserFieldsList = Array<
  StreamPostsFirehoseJaRequestUserFieldsItem | (string & {})
>;
export const StreamPostsFirehoseJaRequestUserFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsFirehoseJaRequestUserFieldsItem,
) as any as S.Schema<StreamPostsFirehoseJaRequestUserFieldsList>;

export type StreamPostsFirehoseJaRequestPlaceFieldsItem =
  | "contained_within"
  | "country"
  | "country_code"
  | "full_name"
  | "geo"
  | "id"
  | "name"
  | "place_type";
export const StreamPostsFirehoseJaRequestPlaceFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehoseJaRequestPlaceFieldsList = Array<
  StreamPostsFirehoseJaRequestPlaceFieldsItem | (string & {})
>;
export const StreamPostsFirehoseJaRequestPlaceFieldsList =
  /*@__PURE__*/ S.Array(
    StreamPostsFirehoseJaRequestPlaceFieldsItem,
  ) as any as S.Schema<StreamPostsFirehoseJaRequestPlaceFieldsList>;

export interface StreamPostsFirehoseJaRequest {
  /** The number of minutes of backfill requested. */
  backfill_minutes?: number;
  /** A comma separated list of Tweet fields to display. */
  tweet_fields?: StreamPostsFirehoseJaRequestTweetFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: StreamPostsFirehoseJaRequestExpansionsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: StreamPostsFirehoseJaRequestMediaFieldsList;
  /** A comma separated list of Poll fields to display. */
  poll_fields?: StreamPostsFirehoseJaRequestPollFieldsList;
  /** A comma separated list of User fields to display. */
  user_fields?: StreamPostsFirehoseJaRequestUserFieldsList;
  /** A comma separated list of Place fields to display. */
  place_fields?: StreamPostsFirehoseJaRequestPlaceFieldsList;
  /** The partition number. */
  partition: number;
  /** YYYY-MM-DDTHH:mm:ssZ. The earliest UTC timestamp to which the Posts will be provided. */
  start_time?: string;
  /** YYYY-MM-DDTHH:mm:ssZ. The latest UTC timestamp to which the Posts will be provided. */
  end_time?: string;
}
export const StreamPostsFirehoseJaRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    backfill_minutes: S.optional(S.Number.pipe(T.Query())),
    tweet_fields: S.optional(
      StreamPostsFirehoseJaRequestTweetFieldsList.pipe(T.Query("tweet.fields")),
    ),
    expansions: S.optional(
      StreamPostsFirehoseJaRequestExpansionsList.pipe(T.Query()),
    ),
    media_fields: S.optional(
      StreamPostsFirehoseJaRequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
    poll_fields: S.optional(
      StreamPostsFirehoseJaRequestPollFieldsList.pipe(T.Query("poll.fields")),
    ),
    user_fields: S.optional(
      StreamPostsFirehoseJaRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    place_fields: S.optional(
      StreamPostsFirehoseJaRequestPlaceFieldsList.pipe(T.Query("place.fields")),
    ),
    partition: S.Number.pipe(T.Query()),
    start_time: S.optional(S.String.pipe(T.Query())),
    end_time: S.optional(S.String.pipe(T.Query())),
  }).pipe(
    T.Http({
      method: "GET",
      uri: "/2/tweets/firehose/stream/lang/ja",
      code: 200,
    }),
  ),
).annotate({
  identifier: "StreamPostsFirehoseJaRequest",
}) as any as S.Schema<StreamPostsFirehoseJaRequest>;

export type StreamPostsFirehoseJaResponseErrorsList = Array<Problem>;
export const StreamPostsFirehoseJaResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<StreamPostsFirehoseJaResponseErrorsList>;

export interface StreamPostsFirehoseJaResponse {
  data?: Post;
  errors?: StreamPostsFirehoseJaResponseErrorsList;
  includes?: Expansions;
}
export const StreamPostsFirehoseJaResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(Post),
    errors: S.optional(StreamPostsFirehoseJaResponseErrorsList),
    includes: S.optional(Expansions),
  }),
).annotate({
  identifier: "StreamPostsFirehoseJaResponse",
}) as any as S.Schema<StreamPostsFirehoseJaResponse>;

export type StreamPostsFirehoseKoRequestTweetFieldsItem =
  | "article"
  | "attachments"
  | "author_id"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "edit_history_tweet_ids"
  | "entities"
  | "geo"
  | "id"
  | "in_reply_to_user_id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_request_suggestions"
  | "note_tweet"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "referenced_tweets"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const StreamPostsFirehoseKoRequestTweetFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehoseKoRequestTweetFieldsList = Array<
  StreamPostsFirehoseKoRequestTweetFieldsItem | (string & {})
>;
export const StreamPostsFirehoseKoRequestTweetFieldsList =
  /*@__PURE__*/ S.Array(
    StreamPostsFirehoseKoRequestTweetFieldsItem,
  ) as any as S.Schema<StreamPostsFirehoseKoRequestTweetFieldsList>;

export type StreamPostsFirehoseKoRequestExpansionsItem =
  | "article.cover_media"
  | "article.media_entities"
  | "attachments.media_keys"
  | "attachments.media_source_tweet"
  | "attachments.poll_ids"
  | "author_id"
  | "edit_history_tweet_ids"
  | "entities.mentions.username"
  | "geo.place_id"
  | "in_reply_to_user_id"
  | "entities.note.mentions.username"
  | "referenced_tweets.id"
  | "referenced_tweets.id.attachments.media_keys"
  | "referenced_tweets.id.author_id";
export const StreamPostsFirehoseKoRequestExpansionsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehoseKoRequestExpansionsList = Array<
  StreamPostsFirehoseKoRequestExpansionsItem | (string & {})
>;
export const StreamPostsFirehoseKoRequestExpansionsList = /*@__PURE__*/ S.Array(
  StreamPostsFirehoseKoRequestExpansionsItem,
) as any as S.Schema<StreamPostsFirehoseKoRequestExpansionsList>;

export type StreamPostsFirehoseKoRequestMediaFieldsItem =
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
export const StreamPostsFirehoseKoRequestMediaFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehoseKoRequestMediaFieldsList = Array<
  StreamPostsFirehoseKoRequestMediaFieldsItem | (string & {})
>;
export const StreamPostsFirehoseKoRequestMediaFieldsList =
  /*@__PURE__*/ S.Array(
    StreamPostsFirehoseKoRequestMediaFieldsItem,
  ) as any as S.Schema<StreamPostsFirehoseKoRequestMediaFieldsList>;

export type StreamPostsFirehoseKoRequestPollFieldsItem =
  | "duration_minutes"
  | "end_datetime"
  | "id"
  | "options"
  | "voting_status";
export const StreamPostsFirehoseKoRequestPollFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehoseKoRequestPollFieldsList = Array<
  StreamPostsFirehoseKoRequestPollFieldsItem | (string & {})
>;
export const StreamPostsFirehoseKoRequestPollFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsFirehoseKoRequestPollFieldsItem,
) as any as S.Schema<StreamPostsFirehoseKoRequestPollFieldsList>;

export type StreamPostsFirehoseKoRequestUserFieldsItem =
  | "affiliation"
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "most_recent_tweet_id"
  | "name"
  | "parody"
  | "pinned_tweet_id"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const StreamPostsFirehoseKoRequestUserFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehoseKoRequestUserFieldsList = Array<
  StreamPostsFirehoseKoRequestUserFieldsItem | (string & {})
>;
export const StreamPostsFirehoseKoRequestUserFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsFirehoseKoRequestUserFieldsItem,
) as any as S.Schema<StreamPostsFirehoseKoRequestUserFieldsList>;

export type StreamPostsFirehoseKoRequestPlaceFieldsItem =
  | "contained_within"
  | "country"
  | "country_code"
  | "full_name"
  | "geo"
  | "id"
  | "name"
  | "place_type";
export const StreamPostsFirehoseKoRequestPlaceFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehoseKoRequestPlaceFieldsList = Array<
  StreamPostsFirehoseKoRequestPlaceFieldsItem | (string & {})
>;
export const StreamPostsFirehoseKoRequestPlaceFieldsList =
  /*@__PURE__*/ S.Array(
    StreamPostsFirehoseKoRequestPlaceFieldsItem,
  ) as any as S.Schema<StreamPostsFirehoseKoRequestPlaceFieldsList>;

export interface StreamPostsFirehoseKoRequest {
  /** The number of minutes of backfill requested. */
  backfill_minutes?: number;
  /** A comma separated list of Tweet fields to display. */
  tweet_fields?: StreamPostsFirehoseKoRequestTweetFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: StreamPostsFirehoseKoRequestExpansionsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: StreamPostsFirehoseKoRequestMediaFieldsList;
  /** A comma separated list of Poll fields to display. */
  poll_fields?: StreamPostsFirehoseKoRequestPollFieldsList;
  /** A comma separated list of User fields to display. */
  user_fields?: StreamPostsFirehoseKoRequestUserFieldsList;
  /** A comma separated list of Place fields to display. */
  place_fields?: StreamPostsFirehoseKoRequestPlaceFieldsList;
  /** The partition number. */
  partition: number;
  /** YYYY-MM-DDTHH:mm:ssZ. The earliest UTC timestamp to which the Posts will be provided. */
  start_time?: string;
  /** YYYY-MM-DDTHH:mm:ssZ. The latest UTC timestamp to which the Posts will be provided. */
  end_time?: string;
}
export const StreamPostsFirehoseKoRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    backfill_minutes: S.optional(S.Number.pipe(T.Query())),
    tweet_fields: S.optional(
      StreamPostsFirehoseKoRequestTweetFieldsList.pipe(T.Query("tweet.fields")),
    ),
    expansions: S.optional(
      StreamPostsFirehoseKoRequestExpansionsList.pipe(T.Query()),
    ),
    media_fields: S.optional(
      StreamPostsFirehoseKoRequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
    poll_fields: S.optional(
      StreamPostsFirehoseKoRequestPollFieldsList.pipe(T.Query("poll.fields")),
    ),
    user_fields: S.optional(
      StreamPostsFirehoseKoRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    place_fields: S.optional(
      StreamPostsFirehoseKoRequestPlaceFieldsList.pipe(T.Query("place.fields")),
    ),
    partition: S.Number.pipe(T.Query()),
    start_time: S.optional(S.String.pipe(T.Query())),
    end_time: S.optional(S.String.pipe(T.Query())),
  }).pipe(
    T.Http({
      method: "GET",
      uri: "/2/tweets/firehose/stream/lang/ko",
      code: 200,
    }),
  ),
).annotate({
  identifier: "StreamPostsFirehoseKoRequest",
}) as any as S.Schema<StreamPostsFirehoseKoRequest>;

export type StreamPostsFirehoseKoResponseErrorsList = Array<Problem>;
export const StreamPostsFirehoseKoResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<StreamPostsFirehoseKoResponseErrorsList>;

export interface StreamPostsFirehoseKoResponse {
  data?: Post;
  errors?: StreamPostsFirehoseKoResponseErrorsList;
  includes?: Expansions;
}
export const StreamPostsFirehoseKoResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(Post),
    errors: S.optional(StreamPostsFirehoseKoResponseErrorsList),
    includes: S.optional(Expansions),
  }),
).annotate({
  identifier: "StreamPostsFirehoseKoResponse",
}) as any as S.Schema<StreamPostsFirehoseKoResponse>;

export type StreamPostsFirehosePtRequestTweetFieldsItem =
  | "article"
  | "attachments"
  | "author_id"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "edit_history_tweet_ids"
  | "entities"
  | "geo"
  | "id"
  | "in_reply_to_user_id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_request_suggestions"
  | "note_tweet"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "referenced_tweets"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const StreamPostsFirehosePtRequestTweetFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehosePtRequestTweetFieldsList = Array<
  StreamPostsFirehosePtRequestTweetFieldsItem | (string & {})
>;
export const StreamPostsFirehosePtRequestTweetFieldsList =
  /*@__PURE__*/ S.Array(
    StreamPostsFirehosePtRequestTweetFieldsItem,
  ) as any as S.Schema<StreamPostsFirehosePtRequestTweetFieldsList>;

export type StreamPostsFirehosePtRequestExpansionsItem =
  | "article.cover_media"
  | "article.media_entities"
  | "attachments.media_keys"
  | "attachments.media_source_tweet"
  | "attachments.poll_ids"
  | "author_id"
  | "edit_history_tweet_ids"
  | "entities.mentions.username"
  | "geo.place_id"
  | "in_reply_to_user_id"
  | "entities.note.mentions.username"
  | "referenced_tweets.id"
  | "referenced_tweets.id.attachments.media_keys"
  | "referenced_tweets.id.author_id";
export const StreamPostsFirehosePtRequestExpansionsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehosePtRequestExpansionsList = Array<
  StreamPostsFirehosePtRequestExpansionsItem | (string & {})
>;
export const StreamPostsFirehosePtRequestExpansionsList = /*@__PURE__*/ S.Array(
  StreamPostsFirehosePtRequestExpansionsItem,
) as any as S.Schema<StreamPostsFirehosePtRequestExpansionsList>;

export type StreamPostsFirehosePtRequestMediaFieldsItem =
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
export const StreamPostsFirehosePtRequestMediaFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehosePtRequestMediaFieldsList = Array<
  StreamPostsFirehosePtRequestMediaFieldsItem | (string & {})
>;
export const StreamPostsFirehosePtRequestMediaFieldsList =
  /*@__PURE__*/ S.Array(
    StreamPostsFirehosePtRequestMediaFieldsItem,
  ) as any as S.Schema<StreamPostsFirehosePtRequestMediaFieldsList>;

export type StreamPostsFirehosePtRequestPollFieldsItem =
  | "duration_minutes"
  | "end_datetime"
  | "id"
  | "options"
  | "voting_status";
export const StreamPostsFirehosePtRequestPollFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehosePtRequestPollFieldsList = Array<
  StreamPostsFirehosePtRequestPollFieldsItem | (string & {})
>;
export const StreamPostsFirehosePtRequestPollFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsFirehosePtRequestPollFieldsItem,
) as any as S.Schema<StreamPostsFirehosePtRequestPollFieldsList>;

export type StreamPostsFirehosePtRequestUserFieldsItem =
  | "affiliation"
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "most_recent_tweet_id"
  | "name"
  | "parody"
  | "pinned_tweet_id"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const StreamPostsFirehosePtRequestUserFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehosePtRequestUserFieldsList = Array<
  StreamPostsFirehosePtRequestUserFieldsItem | (string & {})
>;
export const StreamPostsFirehosePtRequestUserFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsFirehosePtRequestUserFieldsItem,
) as any as S.Schema<StreamPostsFirehosePtRequestUserFieldsList>;

export type StreamPostsFirehosePtRequestPlaceFieldsItem =
  | "contained_within"
  | "country"
  | "country_code"
  | "full_name"
  | "geo"
  | "id"
  | "name"
  | "place_type";
export const StreamPostsFirehosePtRequestPlaceFieldsItem =
  /*@__PURE__*/ S.String;

export type StreamPostsFirehosePtRequestPlaceFieldsList = Array<
  StreamPostsFirehosePtRequestPlaceFieldsItem | (string & {})
>;
export const StreamPostsFirehosePtRequestPlaceFieldsList =
  /*@__PURE__*/ S.Array(
    StreamPostsFirehosePtRequestPlaceFieldsItem,
  ) as any as S.Schema<StreamPostsFirehosePtRequestPlaceFieldsList>;

export interface StreamPostsFirehosePtRequest {
  /** The number of minutes of backfill requested. */
  backfill_minutes?: number;
  /** A comma separated list of Tweet fields to display. */
  tweet_fields?: StreamPostsFirehosePtRequestTweetFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: StreamPostsFirehosePtRequestExpansionsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: StreamPostsFirehosePtRequestMediaFieldsList;
  /** A comma separated list of Poll fields to display. */
  poll_fields?: StreamPostsFirehosePtRequestPollFieldsList;
  /** A comma separated list of User fields to display. */
  user_fields?: StreamPostsFirehosePtRequestUserFieldsList;
  /** A comma separated list of Place fields to display. */
  place_fields?: StreamPostsFirehosePtRequestPlaceFieldsList;
  /** The partition number. */
  partition: number;
  /** YYYY-MM-DDTHH:mm:ssZ. The earliest UTC timestamp to which the Posts will be provided. */
  start_time?: string;
  /** YYYY-MM-DDTHH:mm:ssZ. The latest UTC timestamp to which the Posts will be provided. */
  end_time?: string;
}
export const StreamPostsFirehosePtRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    backfill_minutes: S.optional(S.Number.pipe(T.Query())),
    tweet_fields: S.optional(
      StreamPostsFirehosePtRequestTweetFieldsList.pipe(T.Query("tweet.fields")),
    ),
    expansions: S.optional(
      StreamPostsFirehosePtRequestExpansionsList.pipe(T.Query()),
    ),
    media_fields: S.optional(
      StreamPostsFirehosePtRequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
    poll_fields: S.optional(
      StreamPostsFirehosePtRequestPollFieldsList.pipe(T.Query("poll.fields")),
    ),
    user_fields: S.optional(
      StreamPostsFirehosePtRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    place_fields: S.optional(
      StreamPostsFirehosePtRequestPlaceFieldsList.pipe(T.Query("place.fields")),
    ),
    partition: S.Number.pipe(T.Query()),
    start_time: S.optional(S.String.pipe(T.Query())),
    end_time: S.optional(S.String.pipe(T.Query())),
  }).pipe(
    T.Http({
      method: "GET",
      uri: "/2/tweets/firehose/stream/lang/pt",
      code: 200,
    }),
  ),
).annotate({
  identifier: "StreamPostsFirehosePtRequest",
}) as any as S.Schema<StreamPostsFirehosePtRequest>;

export type StreamPostsFirehosePtResponseErrorsList = Array<Problem>;
export const StreamPostsFirehosePtResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<StreamPostsFirehosePtResponseErrorsList>;

export interface StreamPostsFirehosePtResponse {
  data?: Post;
  errors?: StreamPostsFirehosePtResponseErrorsList;
  includes?: Expansions;
}
export const StreamPostsFirehosePtResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(Post),
    errors: S.optional(StreamPostsFirehosePtResponseErrorsList),
    includes: S.optional(Expansions),
  }),
).annotate({
  identifier: "StreamPostsFirehosePtResponse",
}) as any as S.Schema<StreamPostsFirehosePtResponse>;

export type StreamPostsSampleRequestTweetFieldsItem =
  | "article"
  | "attachments"
  | "author_id"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "edit_history_tweet_ids"
  | "entities"
  | "geo"
  | "id"
  | "in_reply_to_user_id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_request_suggestions"
  | "note_tweet"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "referenced_tweets"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const StreamPostsSampleRequestTweetFieldsItem = /*@__PURE__*/ S.String;

export type StreamPostsSampleRequestTweetFieldsList = Array<
  StreamPostsSampleRequestTweetFieldsItem | (string & {})
>;
export const StreamPostsSampleRequestTweetFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsSampleRequestTweetFieldsItem,
) as any as S.Schema<StreamPostsSampleRequestTweetFieldsList>;

export type StreamPostsSampleRequestExpansionsItem =
  | "article.cover_media"
  | "article.media_entities"
  | "attachments.media_keys"
  | "attachments.media_source_tweet"
  | "attachments.poll_ids"
  | "author_id"
  | "edit_history_tweet_ids"
  | "entities.mentions.username"
  | "geo.place_id"
  | "in_reply_to_user_id"
  | "entities.note.mentions.username"
  | "referenced_tweets.id"
  | "referenced_tweets.id.attachments.media_keys"
  | "referenced_tweets.id.author_id";
export const StreamPostsSampleRequestExpansionsItem = /*@__PURE__*/ S.String;

export type StreamPostsSampleRequestExpansionsList = Array<
  StreamPostsSampleRequestExpansionsItem | (string & {})
>;
export const StreamPostsSampleRequestExpansionsList = /*@__PURE__*/ S.Array(
  StreamPostsSampleRequestExpansionsItem,
) as any as S.Schema<StreamPostsSampleRequestExpansionsList>;

export type StreamPostsSampleRequestMediaFieldsItem =
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
export const StreamPostsSampleRequestMediaFieldsItem = /*@__PURE__*/ S.String;

export type StreamPostsSampleRequestMediaFieldsList = Array<
  StreamPostsSampleRequestMediaFieldsItem | (string & {})
>;
export const StreamPostsSampleRequestMediaFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsSampleRequestMediaFieldsItem,
) as any as S.Schema<StreamPostsSampleRequestMediaFieldsList>;

export type StreamPostsSampleRequestPollFieldsItem =
  | "duration_minutes"
  | "end_datetime"
  | "id"
  | "options"
  | "voting_status";
export const StreamPostsSampleRequestPollFieldsItem = /*@__PURE__*/ S.String;

export type StreamPostsSampleRequestPollFieldsList = Array<
  StreamPostsSampleRequestPollFieldsItem | (string & {})
>;
export const StreamPostsSampleRequestPollFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsSampleRequestPollFieldsItem,
) as any as S.Schema<StreamPostsSampleRequestPollFieldsList>;

export type StreamPostsSampleRequestUserFieldsItem =
  | "affiliation"
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "most_recent_tweet_id"
  | "name"
  | "parody"
  | "pinned_tweet_id"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const StreamPostsSampleRequestUserFieldsItem = /*@__PURE__*/ S.String;

export type StreamPostsSampleRequestUserFieldsList = Array<
  StreamPostsSampleRequestUserFieldsItem | (string & {})
>;
export const StreamPostsSampleRequestUserFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsSampleRequestUserFieldsItem,
) as any as S.Schema<StreamPostsSampleRequestUserFieldsList>;

export type StreamPostsSampleRequestPlaceFieldsItem =
  | "contained_within"
  | "country"
  | "country_code"
  | "full_name"
  | "geo"
  | "id"
  | "name"
  | "place_type";
export const StreamPostsSampleRequestPlaceFieldsItem = /*@__PURE__*/ S.String;

export type StreamPostsSampleRequestPlaceFieldsList = Array<
  StreamPostsSampleRequestPlaceFieldsItem | (string & {})
>;
export const StreamPostsSampleRequestPlaceFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsSampleRequestPlaceFieldsItem,
) as any as S.Schema<StreamPostsSampleRequestPlaceFieldsList>;

export interface StreamPostsSampleRequest {
  /** The number of minutes of backfill requested. */
  backfill_minutes?: number;
  /** A comma separated list of Tweet fields to display. */
  tweet_fields?: StreamPostsSampleRequestTweetFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: StreamPostsSampleRequestExpansionsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: StreamPostsSampleRequestMediaFieldsList;
  /** A comma separated list of Poll fields to display. */
  poll_fields?: StreamPostsSampleRequestPollFieldsList;
  /** A comma separated list of User fields to display. */
  user_fields?: StreamPostsSampleRequestUserFieldsList;
  /** A comma separated list of Place fields to display. */
  place_fields?: StreamPostsSampleRequestPlaceFieldsList;
}
export const StreamPostsSampleRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    backfill_minutes: S.optional(S.Number.pipe(T.Query())),
    tweet_fields: S.optional(
      StreamPostsSampleRequestTweetFieldsList.pipe(T.Query("tweet.fields")),
    ),
    expansions: S.optional(
      StreamPostsSampleRequestExpansionsList.pipe(T.Query()),
    ),
    media_fields: S.optional(
      StreamPostsSampleRequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
    poll_fields: S.optional(
      StreamPostsSampleRequestPollFieldsList.pipe(T.Query("poll.fields")),
    ),
    user_fields: S.optional(
      StreamPostsSampleRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    place_fields: S.optional(
      StreamPostsSampleRequestPlaceFieldsList.pipe(T.Query("place.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/tweets/sample/stream", code: 200 })),
).annotate({
  identifier: "StreamPostsSampleRequest",
}) as any as S.Schema<StreamPostsSampleRequest>;

export type StreamPostsSampleResponseErrorsList = Array<Problem>;
export const StreamPostsSampleResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<StreamPostsSampleResponseErrorsList>;

export interface StreamPostsSampleResponse {
  data?: Post;
  errors?: StreamPostsSampleResponseErrorsList;
  includes?: Expansions;
}
export const StreamPostsSampleResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(Post),
    errors: S.optional(StreamPostsSampleResponseErrorsList),
    includes: S.optional(Expansions),
  }),
).annotate({
  identifier: "StreamPostsSampleResponse",
}) as any as S.Schema<StreamPostsSampleResponse>;

export type StreamPostsSample10RequestTweetFieldsItem =
  | "article"
  | "attachments"
  | "author_id"
  | "card_uri"
  | "community_id"
  | "context_annotations"
  | "conversation_id"
  | "created_at"
  | "display_text_range"
  | "edit_controls"
  | "edit_history_tweet_ids"
  | "entities"
  | "geo"
  | "id"
  | "in_reply_to_user_id"
  | "lang"
  | "matched_media_notes"
  | "media_metadata"
  | "non_public_metrics"
  | "note_request_suggestions"
  | "note_tweet"
  | "organic_metrics"
  | "paid_partnership"
  | "possibly_sensitive"
  | "promoted_metrics"
  | "public_metrics"
  | "referenced_tweets"
  | "reply_settings"
  | "scopes"
  | "source"
  | "suggested_source_links"
  | "suggested_source_links_with_counts"
  | "text"
  | "withheld";
export const StreamPostsSample10RequestTweetFieldsItem = /*@__PURE__*/ S.String;

export type StreamPostsSample10RequestTweetFieldsList = Array<
  StreamPostsSample10RequestTweetFieldsItem | (string & {})
>;
export const StreamPostsSample10RequestTweetFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsSample10RequestTweetFieldsItem,
) as any as S.Schema<StreamPostsSample10RequestTweetFieldsList>;

export type StreamPostsSample10RequestExpansionsItem =
  | "article.cover_media"
  | "article.media_entities"
  | "attachments.media_keys"
  | "attachments.media_source_tweet"
  | "attachments.poll_ids"
  | "author_id"
  | "edit_history_tweet_ids"
  | "entities.mentions.username"
  | "geo.place_id"
  | "in_reply_to_user_id"
  | "entities.note.mentions.username"
  | "referenced_tweets.id"
  | "referenced_tweets.id.attachments.media_keys"
  | "referenced_tweets.id.author_id";
export const StreamPostsSample10RequestExpansionsItem = /*@__PURE__*/ S.String;

export type StreamPostsSample10RequestExpansionsList = Array<
  StreamPostsSample10RequestExpansionsItem | (string & {})
>;
export const StreamPostsSample10RequestExpansionsList = /*@__PURE__*/ S.Array(
  StreamPostsSample10RequestExpansionsItem,
) as any as S.Schema<StreamPostsSample10RequestExpansionsList>;

export type StreamPostsSample10RequestMediaFieldsItem =
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
export const StreamPostsSample10RequestMediaFieldsItem = /*@__PURE__*/ S.String;

export type StreamPostsSample10RequestMediaFieldsList = Array<
  StreamPostsSample10RequestMediaFieldsItem | (string & {})
>;
export const StreamPostsSample10RequestMediaFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsSample10RequestMediaFieldsItem,
) as any as S.Schema<StreamPostsSample10RequestMediaFieldsList>;

export type StreamPostsSample10RequestPollFieldsItem =
  | "duration_minutes"
  | "end_datetime"
  | "id"
  | "options"
  | "voting_status";
export const StreamPostsSample10RequestPollFieldsItem = /*@__PURE__*/ S.String;

export type StreamPostsSample10RequestPollFieldsList = Array<
  StreamPostsSample10RequestPollFieldsItem | (string & {})
>;
export const StreamPostsSample10RequestPollFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsSample10RequestPollFieldsItem,
) as any as S.Schema<StreamPostsSample10RequestPollFieldsList>;

export type StreamPostsSample10RequestUserFieldsItem =
  | "affiliation"
  | "confirmed_email"
  | "connection_status"
  | "created_at"
  | "description"
  | "entities"
  | "id"
  | "is_identity_verified"
  | "location"
  | "most_recent_tweet_id"
  | "name"
  | "parody"
  | "pinned_tweet_id"
  | "profile_banner_url"
  | "profile_image_url"
  | "protected"
  | "public_metrics"
  | "receives_your_dm"
  | "subscription"
  | "subscription_type"
  | "url"
  | "username"
  | "verified"
  | "verified_followers_count"
  | "verified_type"
  | "withheld";
export const StreamPostsSample10RequestUserFieldsItem = /*@__PURE__*/ S.String;

export type StreamPostsSample10RequestUserFieldsList = Array<
  StreamPostsSample10RequestUserFieldsItem | (string & {})
>;
export const StreamPostsSample10RequestUserFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsSample10RequestUserFieldsItem,
) as any as S.Schema<StreamPostsSample10RequestUserFieldsList>;

export type StreamPostsSample10RequestPlaceFieldsItem =
  | "contained_within"
  | "country"
  | "country_code"
  | "full_name"
  | "geo"
  | "id"
  | "name"
  | "place_type";
export const StreamPostsSample10RequestPlaceFieldsItem = /*@__PURE__*/ S.String;

export type StreamPostsSample10RequestPlaceFieldsList = Array<
  StreamPostsSample10RequestPlaceFieldsItem | (string & {})
>;
export const StreamPostsSample10RequestPlaceFieldsList = /*@__PURE__*/ S.Array(
  StreamPostsSample10RequestPlaceFieldsItem,
) as any as S.Schema<StreamPostsSample10RequestPlaceFieldsList>;

export interface StreamPostsSample10Request {
  /** The number of minutes of backfill requested. */
  backfill_minutes?: number;
  /** A comma separated list of Tweet fields to display. */
  tweet_fields?: StreamPostsSample10RequestTweetFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: StreamPostsSample10RequestExpansionsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: StreamPostsSample10RequestMediaFieldsList;
  /** A comma separated list of Poll fields to display. */
  poll_fields?: StreamPostsSample10RequestPollFieldsList;
  /** A comma separated list of User fields to display. */
  user_fields?: StreamPostsSample10RequestUserFieldsList;
  /** A comma separated list of Place fields to display. */
  place_fields?: StreamPostsSample10RequestPlaceFieldsList;
  /** The partition number. */
  partition: number;
  /** YYYY-MM-DDTHH:mm:ssZ. The earliest UTC timestamp to which the Posts will be provided. */
  start_time?: string;
  /** YYYY-MM-DDTHH:mm:ssZ. The latest UTC timestamp to which the Posts will be provided. */
  end_time?: string;
}
export const StreamPostsSample10Request = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    backfill_minutes: S.optional(S.Number.pipe(T.Query())),
    tweet_fields: S.optional(
      StreamPostsSample10RequestTweetFieldsList.pipe(T.Query("tweet.fields")),
    ),
    expansions: S.optional(
      StreamPostsSample10RequestExpansionsList.pipe(T.Query()),
    ),
    media_fields: S.optional(
      StreamPostsSample10RequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
    poll_fields: S.optional(
      StreamPostsSample10RequestPollFieldsList.pipe(T.Query("poll.fields")),
    ),
    user_fields: S.optional(
      StreamPostsSample10RequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    place_fields: S.optional(
      StreamPostsSample10RequestPlaceFieldsList.pipe(T.Query("place.fields")),
    ),
    partition: S.Number.pipe(T.Query()),
    start_time: S.optional(S.String.pipe(T.Query())),
    end_time: S.optional(S.String.pipe(T.Query())),
  }).pipe(
    T.Http({ method: "GET", uri: "/2/tweets/sample10/stream", code: 200 }),
  ),
).annotate({
  identifier: "StreamPostsSample10Request",
}) as any as S.Schema<StreamPostsSample10Request>;

export type StreamPostsSample10ResponseErrorsList = Array<Problem>;
export const StreamPostsSample10ResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<StreamPostsSample10ResponseErrorsList>;

export interface StreamPostsSample10Response {
  data?: Post;
  errors?: StreamPostsSample10ResponseErrorsList;
  includes?: Expansions;
}
export const StreamPostsSample10Response = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(Post),
    errors: S.optional(StreamPostsSample10ResponseErrorsList),
    includes: S.optional(Expansions),
  }),
).annotate({
  identifier: "StreamPostsSample10Response",
}) as any as S.Schema<StreamPostsSample10Response>;

export interface StreamUsersComplianceRequest {
  /** The number of minutes of backfill requested. */
  backfill_minutes?: number;
  /** The partition number. */
  partition: number;
  /** YYYY-MM-DDTHH:mm:ssZ. The earliest UTC timestamp from which the User Compliance events will be provided. */
  start_time?: string;
  /** YYYY-MM-DDTHH:mm:ssZ. The latest UTC timestamp from which the User Compliance events will be provided. */
  end_time?: string;
}
export const StreamUsersComplianceRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    backfill_minutes: S.optional(S.Number.pipe(T.Query())),
    partition: S.Number.pipe(T.Query()),
    start_time: S.optional(S.String.pipe(T.Query())),
    end_time: S.optional(S.String.pipe(T.Query())),
  }).pipe(
    T.Http({ method: "GET", uri: "/2/users/compliance/stream", code: 200 }),
  ),
).annotate({
  identifier: "StreamUsersComplianceRequest",
}) as any as S.Schema<StreamUsersComplianceRequest>;

export type UserComplianceSchemaUser = PostEditComplianceObjectSchemaTweet;
export const UserComplianceSchemaUser = PostEditComplianceObjectSchemaTweet;

export interface UserComplianceSchema {
  /** Event time. */
  event_at: string;
  user: PostEditComplianceObjectSchemaTweet;
}
export const UserComplianceSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    event_at: S.String,
    user: PostEditComplianceObjectSchemaTweet,
  }),
).annotate({
  identifier: "UserComplianceSchema",
}) as any as S.Schema<UserComplianceSchema>;

export interface UserProtectComplianceSchema {
  user_protect: UserComplianceSchema;
}
export const UserProtectComplianceSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    user_protect: UserComplianceSchema,
  }),
).annotate({
  identifier: "UserProtectComplianceSchema",
}) as any as S.Schema<UserProtectComplianceSchema>;

export interface UserUnprotectComplianceSchema {
  user_unprotect: UserComplianceSchema;
}
export const UserUnprotectComplianceSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    user_unprotect: UserComplianceSchema,
  }),
).annotate({
  identifier: "UserUnprotectComplianceSchema",
}) as any as S.Schema<UserUnprotectComplianceSchema>;

export interface UserDeleteComplianceSchema {
  user_delete: UserComplianceSchema;
}
export const UserDeleteComplianceSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    user_delete: UserComplianceSchema,
  }),
).annotate({
  identifier: "UserDeleteComplianceSchema",
}) as any as S.Schema<UserDeleteComplianceSchema>;

export interface UserUndeleteComplianceSchema {
  user_undelete: UserComplianceSchema;
}
export const UserUndeleteComplianceSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    user_undelete: UserComplianceSchema,
  }),
).annotate({
  identifier: "UserUndeleteComplianceSchema",
}) as any as S.Schema<UserUndeleteComplianceSchema>;

export interface UserSuspendComplianceSchema {
  user_suspend: UserComplianceSchema;
}
export const UserSuspendComplianceSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    user_suspend: UserComplianceSchema,
  }),
).annotate({
  identifier: "UserSuspendComplianceSchema",
}) as any as S.Schema<UserSuspendComplianceSchema>;

export interface UserUnsuspendComplianceSchema {
  user_unsuspend: UserComplianceSchema;
}
export const UserUnsuspendComplianceSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    user_unsuspend: UserComplianceSchema,
  }),
).annotate({
  identifier: "UserUnsuspendComplianceSchema",
}) as any as S.Schema<UserUnsuspendComplianceSchema>;

export type UserTakedownComplianceSchemaUser =
  PostEditComplianceObjectSchemaTweet;
export const UserTakedownComplianceSchemaUser =
  PostEditComplianceObjectSchemaTweet;

export type UserTakedownComplianceSchemaWithheldInCountriesList = Array<string>;
export const UserTakedownComplianceSchemaWithheldInCountriesList =
  /*@__PURE__*/ S.Array(
    S.String,
  ) as any as S.Schema<UserTakedownComplianceSchemaWithheldInCountriesList>;

export interface UserTakedownComplianceSchema {
  /** Event time. */
  event_at: string;
  user: PostEditComplianceObjectSchemaTweet;
  withheld_in_countries: UserTakedownComplianceSchemaWithheldInCountriesList;
}
export const UserTakedownComplianceSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    event_at: S.String,
    user: PostEditComplianceObjectSchemaTweet,
    withheld_in_countries: UserTakedownComplianceSchemaWithheldInCountriesList,
  }),
).annotate({
  identifier: "UserTakedownComplianceSchema",
}) as any as S.Schema<UserTakedownComplianceSchema>;

export interface UserWithheldComplianceSchema {
  user_withheld: UserTakedownComplianceSchema;
}
export const UserWithheldComplianceSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    user_withheld: UserTakedownComplianceSchema,
  }),
).annotate({
  identifier: "UserWithheldComplianceSchema",
}) as any as S.Schema<UserWithheldComplianceSchema>;

export type UserScrubGeoObjectSchemaUser = PostEditComplianceObjectSchemaTweet;
export const UserScrubGeoObjectSchemaUser = PostEditComplianceObjectSchemaTweet;

export interface UserScrubGeoObjectSchema {
  /** Event time. */
  event_at: string;
  up_to_tweet_id: string;
  user: PostEditComplianceObjectSchemaTweet;
}
export const UserScrubGeoObjectSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    event_at: S.String,
    up_to_tweet_id: S.String,
    user: PostEditComplianceObjectSchemaTweet,
  }),
).annotate({
  identifier: "UserScrubGeoObjectSchema",
}) as any as S.Schema<UserScrubGeoObjectSchema>;

export interface UserScrubGeoSchema {
  scrub_geo: UserScrubGeoObjectSchema;
}
export const UserScrubGeoSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    scrub_geo: UserScrubGeoObjectSchema,
  }),
).annotate({
  identifier: "UserScrubGeoSchema",
}) as any as S.Schema<UserScrubGeoSchema>;

export type UserProfileModificationObjectSchemaUser =
  PostEditComplianceObjectSchemaTweet;
export const UserProfileModificationObjectSchemaUser =
  PostEditComplianceObjectSchemaTweet;

export interface UserProfileModificationObjectSchema {
  /** Event time. */
  event_at: string;
  new_value: string;
  profile_field: string;
  user: PostEditComplianceObjectSchemaTweet;
}
export const UserProfileModificationObjectSchema = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    event_at: S.String,
    new_value: S.String,
    profile_field: S.String,
    user: PostEditComplianceObjectSchemaTweet,
  }),
).annotate({
  identifier: "UserProfileModificationObjectSchema",
}) as any as S.Schema<UserProfileModificationObjectSchema>;

export interface UserProfileModificationComplianceSchema {
  user_profile_modification: UserProfileModificationObjectSchema;
}
export const UserProfileModificationComplianceSchema = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      user_profile_modification: UserProfileModificationObjectSchema,
    }),
).annotate({
  identifier: "UserProfileModificationComplianceSchema",
}) as any as S.Schema<UserProfileModificationComplianceSchema>;

/** User compliance data. */
export type UserComplianceData =
  | UserProtectComplianceSchema
  | UserUnprotectComplianceSchema
  | UserDeleteComplianceSchema
  | UserUndeleteComplianceSchema
  | UserSuspendComplianceSchema
  | UserUnsuspendComplianceSchema
  | UserWithheldComplianceSchema
  | UserScrubGeoSchema
  | UserProfileModificationComplianceSchema;
export const UserComplianceData =
  /*@__PURE__*/ S.Unknown as any as S.Schema<UserComplianceData>;
/** User compliance event. */
export interface StreamUsersComplianceResponseCase0 {
  data: UserComplianceData;
}
export const StreamUsersComplianceResponseCase0 = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: UserComplianceData,
  }),
).annotate({
  identifier: "StreamUsersComplianceResponseCase0",
}) as any as S.Schema<StreamUsersComplianceResponseCase0>;

export type StreamUsersComplianceResponseCase1ErrorsList = Array<Problem>;
export const StreamUsersComplianceResponseCase1ErrorsList =
  /*@__PURE__*/ S.Array(
    Problem,
  ) as any as S.Schema<StreamUsersComplianceResponseCase1ErrorsList>;

export interface StreamUsersComplianceResponseCase1 {
  errors: StreamUsersComplianceResponseCase1ErrorsList;
}
export const StreamUsersComplianceResponseCase1 = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    errors: StreamUsersComplianceResponseCase1ErrorsList,
  }),
).annotate({
  identifier: "StreamUsersComplianceResponseCase1",
}) as any as S.Schema<StreamUsersComplianceResponseCase1>;

/** User compliance stream events. */
export type StreamUsersComplianceResponse =
  | StreamUsersComplianceResponseCase0
  | StreamUsersComplianceResponseCase1;
export const StreamUsersComplianceResponse =
  /*@__PURE__*/ S.Unknown as any as S.Schema<StreamUsersComplianceResponse>;
export type StreamUsersComplianceResponse2 = StreamUsersComplianceResponse;
export const StreamUsersComplianceResponse2 = /*@__PURE__*/ S.suspend(() =>
  StreamUsersComplianceResponse.pipe(T.RawResponseRoot()),
).annotate({
  identifier: "StreamUsersComplianceResponse2",
}) as any as S.Schema<StreamUsersComplianceResponse2>;

export const activityStream = /*@__PURE__*/ makeStreamOperation<
  ActivityStreamRequest,
  ActivityStreamResponse
>(
  operations.activityStream,
  () => ActivityStreamRequest,
  () => ActivityStreamResponse,
);

export const getRuleCounts = /*@__PURE__*/ makeOperation<
  GetRuleCountsRequest,
  GetRuleCountsResponse
>(
  operations.getRuleCounts,
  () => GetRuleCountsRequest,
  () => GetRuleCountsResponse,
);

export const streamLabelsCompliance = /*@__PURE__*/ makeStreamOperation<
  StreamLabelsComplianceRequest,
  StreamLabelsComplianceResponse2
>(
  operations.streamLabelsCompliance,
  () => StreamLabelsComplianceRequest,
  () => StreamLabelsComplianceResponse2,
);

export const streamLikesCompliance = /*@__PURE__*/ makeStreamOperation<
  StreamLikesComplianceRequest,
  StreamLikesComplianceResponse2
>(
  operations.streamLikesCompliance,
  () => StreamLikesComplianceRequest,
  () => StreamLikesComplianceResponse2,
);

export const streamLikesFirehose = /*@__PURE__*/ makeStreamOperation<
  StreamLikesFirehoseRequest,
  StreamLikesFirehoseResponse
>(
  operations.streamLikesFirehose,
  () => StreamLikesFirehoseRequest,
  () => StreamLikesFirehoseResponse,
);

export const streamLikesSample10 = /*@__PURE__*/ makeStreamOperation<
  StreamLikesSample10Request,
  StreamLikesSample10Response
>(
  operations.streamLikesSample10,
  () => StreamLikesSample10Request,
  () => StreamLikesSample10Response,
);

export const streamPosts = /*@__PURE__*/ makeStreamOperation<
  StreamPostsRequest,
  StreamPostsResponse
>(
  operations.streamPosts,
  () => StreamPostsRequest,
  () => StreamPostsResponse,
);

export const streamPostsCompliance = /*@__PURE__*/ makeStreamOperation<
  StreamPostsComplianceRequest,
  StreamPostsComplianceResponse2
>(
  operations.streamPostsCompliance,
  () => StreamPostsComplianceRequest,
  () => StreamPostsComplianceResponse2,
);

export const streamPostsFirehose = /*@__PURE__*/ makeStreamOperation<
  StreamPostsFirehoseRequest,
  StreamPostsFirehoseResponse
>(
  operations.streamPostsFirehose,
  () => StreamPostsFirehoseRequest,
  () => StreamPostsFirehoseResponse,
);

export const streamPostsFirehoseEn = /*@__PURE__*/ makeStreamOperation<
  StreamPostsFirehoseEnRequest,
  StreamPostsFirehoseEnResponse
>(
  operations.streamPostsFirehoseEn,
  () => StreamPostsFirehoseEnRequest,
  () => StreamPostsFirehoseEnResponse,
);

export const streamPostsFirehoseJa = /*@__PURE__*/ makeStreamOperation<
  StreamPostsFirehoseJaRequest,
  StreamPostsFirehoseJaResponse
>(
  operations.streamPostsFirehoseJa,
  () => StreamPostsFirehoseJaRequest,
  () => StreamPostsFirehoseJaResponse,
);

export const streamPostsFirehoseKo = /*@__PURE__*/ makeStreamOperation<
  StreamPostsFirehoseKoRequest,
  StreamPostsFirehoseKoResponse
>(
  operations.streamPostsFirehoseKo,
  () => StreamPostsFirehoseKoRequest,
  () => StreamPostsFirehoseKoResponse,
);

export const streamPostsFirehosePt = /*@__PURE__*/ makeStreamOperation<
  StreamPostsFirehosePtRequest,
  StreamPostsFirehosePtResponse
>(
  operations.streamPostsFirehosePt,
  () => StreamPostsFirehosePtRequest,
  () => StreamPostsFirehosePtResponse,
);

export const streamPostsSample = /*@__PURE__*/ makeStreamOperation<
  StreamPostsSampleRequest,
  StreamPostsSampleResponse
>(
  operations.streamPostsSample,
  () => StreamPostsSampleRequest,
  () => StreamPostsSampleResponse,
);

export const streamPostsSample10 = /*@__PURE__*/ makeStreamOperation<
  StreamPostsSample10Request,
  StreamPostsSample10Response
>(
  operations.streamPostsSample10,
  () => StreamPostsSample10Request,
  () => StreamPostsSample10Response,
);

export const streamUsersCompliance = /*@__PURE__*/ makeStreamOperation<
  StreamUsersComplianceRequest,
  StreamUsersComplianceResponse2
>(
  operations.streamUsersCompliance,
  () => StreamUsersComplianceRequest,
  () => StreamUsersComplianceResponse2,
);
