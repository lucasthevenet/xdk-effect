// AUTO-GENERATED from xdevplatform/xdk@84c26540df30c0b798e50e34151c56d5d262ba1c; do not edit.
import * as S from "@distilled.cloud/core/schema";
import * as T from "../traits.ts";
import {
  makeOperation,
  makeBinaryOperation,
  makeStreamOperation,
} from "../operation.ts";
import { operations } from "../operations.ts";
export interface AddChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoList {
  /** The member ID associated with this signing key. */
  member_id?: string;
  /** The version of the public key. */
  public_key_version?: string;
  /** The signing public key. */
  signing_public_key?: string;
}
export const AddChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoList =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      member_id: S.optional(S.String),
      public_key_version: S.optional(S.String),
      signing_public_key: S.optional(S.String),
    }),
  ).annotate({
    identifier:
      "AddChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoList",
  }) as any as S.Schema<AddChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoList>;

/** List of signing key information for message verification. */
export type AddChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoListList =
  Array<AddChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoList>;
export const AddChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoListList =
  /*@__PURE__*/ S.Array(
    AddChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoList,
  ) as any as S.Schema<AddChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoListList>;

export interface AddChatGroupMembersActionSignaturesMessageEventSignature {
  /** List of signing key information for message verification. */
  message_signing_key_info_list?: AddChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoListList;
  /** The version of the public key used for signing. */
  public_key_version: string;
  /** The signature of the message event. */
  signature: string;
  /** The version of the signature algorithm. */
  signature_version: string;
  /** The public key used for signing. */
  signing_public_key?: string;
}
export const AddChatGroupMembersActionSignaturesMessageEventSignature =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      message_signing_key_info_list: S.optional(
        AddChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoListList,
      ),
      public_key_version: S.String,
      signature: S.String,
      signature_version: S.String,
      signing_public_key: S.optional(S.String),
    }),
  ).annotate({
    identifier: "AddChatGroupMembersActionSignaturesMessageEventSignature",
  }) as any as S.Schema<AddChatGroupMembersActionSignaturesMessageEventSignature>;

export interface AddChatGroupMembersActionSignatures {
  /** Base64-encoded message event detail. */
  encoded_message_event_detail: string;
  /** Message event signature supplied with an action signature. */
  message_event_signature: AddChatGroupMembersActionSignaturesMessageEventSignature;
  /** Client-generated ID of the message being signed. */
  message_id: string;
  /** Payload string the client signed; used only in server-side failure logs. */
  signature_payload?: string;
}
export const AddChatGroupMembersActionSignatures = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    encoded_message_event_detail: S.String,
    message_event_signature:
      AddChatGroupMembersActionSignaturesMessageEventSignature,
    message_id: S.String,
    signature_payload: S.optional(S.String),
  }),
).annotate({
  identifier: "AddChatGroupMembersActionSignatures",
}) as any as S.Schema<AddChatGroupMembersActionSignatures>;

/** Cryptographic signatures for the action. */
export type AddChatGroupMembersRequestActionSignaturesList =
  Array<AddChatGroupMembersActionSignatures>;
export const AddChatGroupMembersRequestActionSignaturesList =
  /*@__PURE__*/ S.Array(
    AddChatGroupMembersActionSignatures,
  ) as any as S.Schema<AddChatGroupMembersRequestActionSignaturesList>;

export interface AddChatGroupMembersConversationParticipantKeys {
  /** Conversation key encrypted with this participant's public key. */
  encrypted_conversation_key?: string;
  /** Version of the participant's public key used for encryption. */
  public_key_version?: string;
  /** Participant user ID. */
  user_id?: string;
}
export const AddChatGroupMembersConversationParticipantKeys =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      encrypted_conversation_key: S.optional(S.String),
      public_key_version: S.optional(S.String),
      user_id: S.optional(S.String),
    }),
  ).annotate({
    identifier: "AddChatGroupMembersConversationParticipantKeys",
  }) as any as S.Schema<AddChatGroupMembersConversationParticipantKeys>;

/** Encrypted conversation keys for each participant. */
export type AddChatGroupMembersRequestConversationParticipantKeysList =
  Array<AddChatGroupMembersConversationParticipantKeys>;
export const AddChatGroupMembersRequestConversationParticipantKeysList =
  /*@__PURE__*/ S.Array(
    AddChatGroupMembersConversationParticipantKeys,
  ) as any as S.Schema<AddChatGroupMembersRequestConversationParticipantKeysList>;

/** List of user IDs to add to the group conversation. */
export type AddChatGroupMembersRequestUserIdsList = Array<string>;
export const AddChatGroupMembersRequestUserIdsList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<AddChatGroupMembersRequestUserIdsList>;

export interface AddChatGroupMembersRequest {
  id: string;
  /** Cryptographic signatures for the action. */
  action_signatures?: AddChatGroupMembersRequestActionSignaturesList;
  /** Version of the new rotated conversation key. */
  conversation_key_version?: string;
  /** Encrypted conversation keys for each participant. */
  conversation_participant_keys?: AddChatGroupMembersRequestConversationParticipantKeysList;
  /** Re-encrypted group avatar URL with new conversation key. */
  encrypted_avatar_url?: string;
  /** Re-encrypted group title with new conversation key. */
  encrypted_title?: string;
  /** List of user IDs to add to the group conversation. */
  user_ids: AddChatGroupMembersRequestUserIdsList;
}
export const AddChatGroupMembersRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    action_signatures: S.optional(
      AddChatGroupMembersRequestActionSignaturesList,
    ),
    conversation_key_version: S.optional(S.String),
    conversation_participant_keys: S.optional(
      AddChatGroupMembersRequestConversationParticipantKeysList,
    ),
    encrypted_avatar_url: S.optional(S.String),
    encrypted_title: S.optional(S.String),
    user_ids: AddChatGroupMembersRequestUserIdsList,
  }).pipe(
    T.Http({
      method: "POST",
      uri: "/2/chat/conversations/{id}/members",
      code: 200,
    }),
  ),
).annotate({
  identifier: "AddChatGroupMembersRequest",
}) as any as S.Schema<AddChatGroupMembersRequest>;

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
export type AddChatGroupMembersResponseErrorsList = Array<Problem>;
export const AddChatGroupMembersResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<AddChatGroupMembersResponseErrorsList>;

export interface AddChatGroupMembersResponse {
  data?: Post;
  errors?: AddChatGroupMembersResponseErrorsList;
}
export const AddChatGroupMembersResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(Post),
    errors: S.optional(AddChatGroupMembersResponseErrorsList),
  }),
).annotate({
  identifier: "AddChatGroupMembersResponse",
}) as any as S.Schema<AddChatGroupMembersResponse>;

export type AddConversationKeysActionSignaturesMessageEventSignatureMessageSigningKeyInfoList =
  AddChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoList;
export const AddConversationKeysActionSignaturesMessageEventSignatureMessageSigningKeyInfoList =
  AddChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoList;

/** List of signing key information for message verification. */
export type AddConversationKeysActionSignaturesMessageEventSignatureMessageSigningKeyInfoListList =
  Array<AddChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoList>;
export const AddConversationKeysActionSignaturesMessageEventSignatureMessageSigningKeyInfoListList =
  /*@__PURE__*/ S.Array(
    AddChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoList,
  ) as any as S.Schema<AddConversationKeysActionSignaturesMessageEventSignatureMessageSigningKeyInfoListList>;

export interface AddConversationKeysActionSignaturesMessageEventSignature {
  /** List of signing key information for message verification. */
  message_signing_key_info_list?: AddConversationKeysActionSignaturesMessageEventSignatureMessageSigningKeyInfoListList;
  /** The version of the public key used for signing. */
  public_key_version: string;
  /** The signature of the message event. */
  signature: string;
  /** The version of the signature algorithm. */
  signature_version: string;
  /** The public key used for signing. */
  signing_public_key?: string;
}
export const AddConversationKeysActionSignaturesMessageEventSignature =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      message_signing_key_info_list: S.optional(
        AddConversationKeysActionSignaturesMessageEventSignatureMessageSigningKeyInfoListList,
      ),
      public_key_version: S.String,
      signature: S.String,
      signature_version: S.String,
      signing_public_key: S.optional(S.String),
    }),
  ).annotate({
    identifier: "AddConversationKeysActionSignaturesMessageEventSignature",
  }) as any as S.Schema<AddConversationKeysActionSignaturesMessageEventSignature>;

export interface AddConversationKeysActionSignatures {
  /** Base64-encoded message event detail. */
  encoded_message_event_detail: string;
  /** Message event signature supplied with an action signature. */
  message_event_signature: AddConversationKeysActionSignaturesMessageEventSignature;
  /** Client-generated ID of the message being signed. */
  message_id: string;
  /** Payload string the client signed; used only in server-side failure logs. */
  signature_payload?: string;
}
export const AddConversationKeysActionSignatures = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    encoded_message_event_detail: S.String,
    message_event_signature:
      AddConversationKeysActionSignaturesMessageEventSignature,
    message_id: S.String,
    signature_payload: S.optional(S.String),
  }),
).annotate({
  identifier: "AddConversationKeysActionSignatures",
}) as any as S.Schema<AddConversationKeysActionSignatures>;

/** Cryptographic signatures for the action. */
export type AddConversationKeysRequestActionSignaturesList =
  Array<AddConversationKeysActionSignatures>;
export const AddConversationKeysRequestActionSignaturesList =
  /*@__PURE__*/ S.Array(
    AddConversationKeysActionSignatures,
  ) as any as S.Schema<AddConversationKeysRequestActionSignaturesList>;

export type AddConversationKeysConversationParticipantKeys =
  AddChatGroupMembersConversationParticipantKeys;
export const AddConversationKeysConversationParticipantKeys =
  AddChatGroupMembersConversationParticipantKeys;

/** Encrypted conversation keys for each participant. */
export type AddConversationKeysRequestConversationParticipantKeysList =
  Array<AddChatGroupMembersConversationParticipantKeys>;
export const AddConversationKeysRequestConversationParticipantKeysList =
  /*@__PURE__*/ S.Array(
    AddChatGroupMembersConversationParticipantKeys,
  ) as any as S.Schema<AddConversationKeysRequestConversationParticipantKeysList>;

export interface AddConversationKeysRequest {
  id: string;
  /** Cryptographic signatures for the action. */
  action_signatures?: AddConversationKeysRequestActionSignaturesList;
  /** Base64-encoded key rotation payload for ratchet tree key management. */
  base64_encoded_key_rotation?: string;
  /** Version of the conversation encryption key (typically a timestamp in milliseconds). */
  conversation_key_version: string;
  /** Encrypted conversation keys for each participant. */
  conversation_participant_keys: AddConversationKeysRequestConversationParticipantKeysList;
}
export const AddConversationKeysRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    action_signatures: S.optional(
      AddConversationKeysRequestActionSignaturesList,
    ),
    base64_encoded_key_rotation: S.optional(S.String),
    conversation_key_version: S.String,
    conversation_participant_keys:
      AddConversationKeysRequestConversationParticipantKeysList,
  }).pipe(
    T.Http({
      method: "POST",
      uri: "/2/chat/conversations/{id}/keys",
      code: 200,
    }),
  ),
).annotate({
  identifier: "AddConversationKeysRequest",
}) as any as S.Schema<AddConversationKeysRequest>;

export interface AddConversationKeysResponseData {
  /** Canonical ID of the conversation. */
  conversation_id?: string;
  /** Sequence ID of the key change. */
  sequence_id?: string;
}
export const AddConversationKeysResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    conversation_id: S.optional(S.String),
    sequence_id: S.optional(S.String),
  }),
).annotate({
  identifier: "AddConversationKeysResponseData",
}) as any as S.Schema<AddConversationKeysResponseData>;

export type AddConversationKeysResponseErrorsList = Array<Problem>;
export const AddConversationKeysResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<AddConversationKeysResponseErrorsList>;

export interface AddConversationKeysResponse {
  data?: AddConversationKeysResponseData;
  errors?: AddConversationKeysResponseErrorsList;
}
export const AddConversationKeysResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(AddConversationKeysResponseData),
    errors: S.optional(AddConversationKeysResponseErrorsList),
  }),
).annotate({
  identifier: "AddConversationKeysResponse",
}) as any as S.Schema<AddConversationKeysResponse>;

export interface AddUserPublicKeyPublicKey {
  /** Signature over the identity public key. */
  identity_public_key_signature?: string;
  /** Identity public key (base64 encoded). */
  public_key?: string;
  /** Fingerprint of the identity public key. */
  public_key_fingerprint?: string;
  /** Registration method for the public key. */
  registration_method?: string;
  /** Signing public key (base64 encoded). */
  signing_public_key?: string;
  /** Signature over the signing public key. */
  signing_public_key_signature?: string;
}
export const AddUserPublicKeyPublicKey = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    identity_public_key_signature: S.optional(S.String),
    public_key: S.optional(S.String),
    public_key_fingerprint: S.optional(S.String),
    registration_method: S.optional(S.String),
    signing_public_key: S.optional(S.String),
    signing_public_key_signature: S.optional(S.String),
  }),
).annotate({
  identifier: "AddUserPublicKeyPublicKey",
}) as any as S.Schema<AddUserPublicKeyPublicKey>;

export interface AddUserPublicKeyRequest {
  id: string;
  /** When true, the server generates a new version. */
  generate_version?: boolean;
  /** Public key registration payload. */
  public_key: AddUserPublicKeyPublicKey;
  /** Public key version. */
  version: string;
}
export const AddUserPublicKeyRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    generate_version: S.optional(S.Boolean),
    public_key: AddUserPublicKeyPublicKey,
    version: S.String,
  }).pipe(
    T.Http({ method: "POST", uri: "/2/users/{id}/public_keys", code: 200 }),
  ),
).annotate({
  identifier: "AddUserPublicKeyRequest",
}) as any as S.Schema<AddUserPublicKeyRequest>;

export interface AddUserPublicKeyResponseData {
  /** Juicebox recovery-service configuration for this key. */
  juicebox_config?: unknown;
  /** Version assigned to the registered public key. */
  public_key_version?: string;
}
export const AddUserPublicKeyResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    juicebox_config: S.optional(S.Unknown),
    public_key_version: S.optional(S.String),
  }),
).annotate({
  identifier: "AddUserPublicKeyResponseData",
}) as any as S.Schema<AddUserPublicKeyResponseData>;

export type AddUserPublicKeyResponseErrorsList = Array<Problem>;
export const AddUserPublicKeyResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<AddUserPublicKeyResponseErrorsList>;

export interface AddUserPublicKeyResponse {
  data?: AddUserPublicKeyResponseData;
  errors?: AddUserPublicKeyResponseErrorsList;
}
export const AddUserPublicKeyResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(AddUserPublicKeyResponseData),
    errors: S.optional(AddUserPublicKeyResponseErrorsList),
  }),
).annotate({
  identifier: "AddUserPublicKeyResponse",
}) as any as S.Schema<AddUserPublicKeyResponse>;

export interface ChatMediaDownloadRequest {
  id: string;
  media_hash_key: string;
}
export const ChatMediaDownloadRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    media_hash_key: S.String.pipe(T.Label()),
  }).pipe(
    T.Http({
      method: "GET",
      uri: "/2/chat/media/{id}/{media_hash_key}",
      code: 200,
    }),
  ),
).annotate({
  identifier: "ChatMediaDownloadRequest",
}) as any as S.Schema<ChatMediaDownloadRequest>;

export type ChatMediaDownloadResponse = Uint8Array;
export const ChatMediaDownloadResponse = S.instanceOf(Uint8Array);
export type MediaData = string | Blob;
export const MediaData = S.Union([S.String, S.instanceOf(Blob)]);
export interface ChatMediaUploadAppendRequest {
  id: string;
  /** The XChat conversation the upload belongs to. */
  conversation_id: string;
  /** The media segment bytes: base64-encoded in JSON bodies, raw bytes in multipart bodies. */
  media: MediaData;
  /** The media hash key returned by the initialize step. */
  media_hash_key: string;
  /** The index of this segment in the upload sequence. */
  segment_index: number;
}
export const ChatMediaUploadAppendRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    conversation_id: S.String,
    media: MediaData,
    media_hash_key: S.String,
    segment_index: S.Number,
  }).pipe(
    T.Http({
      method: "POST",
      uri: "/2/chat/media/upload/{id}/append",
      code: 200,
    }),
  ),
).annotate({
  identifier: "ChatMediaUploadAppendRequest",
}) as any as S.Schema<ChatMediaUploadAppendRequest>;

export interface ChatMediaUploadAppendResponseData {
  /** Epoch seconds when the upload session expires. */
  expires_at?: number;
}
export const ChatMediaUploadAppendResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    expires_at: S.optional(S.Number),
  }),
).annotate({
  identifier: "ChatMediaUploadAppendResponseData",
}) as any as S.Schema<ChatMediaUploadAppendResponseData>;

export type ChatMediaUploadAppendResponseErrorsList = Array<Problem>;
export const ChatMediaUploadAppendResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<ChatMediaUploadAppendResponseErrorsList>;

export interface ChatMediaUploadAppendResponse {
  data?: ChatMediaUploadAppendResponseData;
  errors?: ChatMediaUploadAppendResponseErrorsList;
}
export const ChatMediaUploadAppendResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(ChatMediaUploadAppendResponseData),
    errors: S.optional(ChatMediaUploadAppendResponseErrorsList),
  }),
).annotate({
  identifier: "ChatMediaUploadAppendResponse",
}) as any as S.Schema<ChatMediaUploadAppendResponse>;

export interface ChatMediaUploadFinalizeRequest {
  id: string;
  /** The XChat conversation the upload belongs to. */
  conversation_id: string;
  /** The media hash key returned by the initialize step. */
  media_hash_key: string;
  /** Optional message identifier associated with the upload. */
  message_id?: string;
  /** Total number of uploaded parts, as a numeric string. */
  num_parts: string;
  /** Optional TTL for the media in milliseconds, as a numeric string. */
  ttl_msec?: string;
}
export const ChatMediaUploadFinalizeRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    conversation_id: S.String,
    media_hash_key: S.String,
    message_id: S.optional(S.String),
    num_parts: S.String,
    ttl_msec: S.optional(S.String),
  }).pipe(
    T.Http({
      method: "POST",
      uri: "/2/chat/media/upload/{id}/finalize",
      code: 200,
    }),
  ),
).annotate({
  identifier: "ChatMediaUploadFinalizeRequest",
}) as any as S.Schema<ChatMediaUploadFinalizeRequest>;

export interface ChatMediaUploadFinalizeResponseData {
  /** Whether the upload was finalized. */
  success: boolean;
}
export const ChatMediaUploadFinalizeResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    success: S.Boolean,
  }),
).annotate({
  identifier: "ChatMediaUploadFinalizeResponseData",
}) as any as S.Schema<ChatMediaUploadFinalizeResponseData>;

export type ChatMediaUploadFinalizeResponseErrorsList = Array<Problem>;
export const ChatMediaUploadFinalizeResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<ChatMediaUploadFinalizeResponseErrorsList>;

export interface ChatMediaUploadFinalizeResponse {
  data?: ChatMediaUploadFinalizeResponseData;
  errors?: ChatMediaUploadFinalizeResponseErrorsList;
}
export const ChatMediaUploadFinalizeResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(ChatMediaUploadFinalizeResponseData),
    errors: S.optional(ChatMediaUploadFinalizeResponseErrorsList),
  }),
).annotate({
  identifier: "ChatMediaUploadFinalizeResponse",
}) as any as S.Schema<ChatMediaUploadFinalizeResponse>;

export interface ChatMediaUploadInitializeRequest {
  /** The XChat conversation the upload belongs to. */
  conversation_id: string;
  /** Total size of the media upload in bytes. */
  total_bytes: number;
}
export const ChatMediaUploadInitializeRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    conversation_id: S.String,
    total_bytes: S.Number,
  }).pipe(
    T.Http({
      method: "POST",
      uri: "/2/chat/media/upload/initialize",
      code: 200,
    }),
  ),
).annotate({
  identifier: "ChatMediaUploadInitializeRequest",
}) as any as S.Schema<ChatMediaUploadInitializeRequest>;

export interface ChatMediaUploadInitializeResponseData {
  /** Canonical ID of the conversation. */
  conversation_id: string;
  /** Hash key addressing the uploaded media. */
  media_hash_key: string;
  /** Upload session ID. */
  session_id: string;
}
export const ChatMediaUploadInitializeResponseData = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      conversation_id: S.String,
      media_hash_key: S.String,
      session_id: S.String,
    }),
).annotate({
  identifier: "ChatMediaUploadInitializeResponseData",
}) as any as S.Schema<ChatMediaUploadInitializeResponseData>;

export type ChatMediaUploadInitializeResponseErrorsList = Array<Problem>;
export const ChatMediaUploadInitializeResponseErrorsList =
  /*@__PURE__*/ S.Array(
    Problem,
  ) as any as S.Schema<ChatMediaUploadInitializeResponseErrorsList>;

export interface ChatMediaUploadInitializeResponse {
  data?: ChatMediaUploadInitializeResponseData;
  errors?: ChatMediaUploadInitializeResponseErrorsList;
}
export const ChatMediaUploadInitializeResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(ChatMediaUploadInitializeResponseData),
    errors: S.optional(ChatMediaUploadInitializeResponseErrorsList),
  }),
).annotate({
  identifier: "ChatMediaUploadInitializeResponse",
}) as any as S.Schema<ChatMediaUploadInitializeResponse>;

export type CreateChatConversationActionSignaturesMessageEventSignatureMessageSigningKeyInfoList =
  AddChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoList;
export const CreateChatConversationActionSignaturesMessageEventSignatureMessageSigningKeyInfoList =
  AddChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoList;

/** List of signing key information for message verification. */
export type CreateChatConversationActionSignaturesMessageEventSignatureMessageSigningKeyInfoListList =
  Array<AddChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoList>;
export const CreateChatConversationActionSignaturesMessageEventSignatureMessageSigningKeyInfoListList =
  /*@__PURE__*/ S.Array(
    AddChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoList,
  ) as any as S.Schema<CreateChatConversationActionSignaturesMessageEventSignatureMessageSigningKeyInfoListList>;

export interface CreateChatConversationActionSignaturesMessageEventSignature {
  /** List of signing key information for message verification. */
  message_signing_key_info_list?: CreateChatConversationActionSignaturesMessageEventSignatureMessageSigningKeyInfoListList;
  /** The version of the public key used for signing. */
  public_key_version: string;
  /** The signature of the message event. */
  signature: string;
  /** The version of the signature algorithm. */
  signature_version: string;
  /** The public key used for signing. */
  signing_public_key?: string;
}
export const CreateChatConversationActionSignaturesMessageEventSignature =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      message_signing_key_info_list: S.optional(
        CreateChatConversationActionSignaturesMessageEventSignatureMessageSigningKeyInfoListList,
      ),
      public_key_version: S.String,
      signature: S.String,
      signature_version: S.String,
      signing_public_key: S.optional(S.String),
    }),
  ).annotate({
    identifier: "CreateChatConversationActionSignaturesMessageEventSignature",
  }) as any as S.Schema<CreateChatConversationActionSignaturesMessageEventSignature>;

export interface CreateChatConversationActionSignatures {
  /** Base64-encoded message event detail. */
  encoded_message_event_detail: string;
  /** Message event signature supplied with an action signature. */
  message_event_signature: CreateChatConversationActionSignaturesMessageEventSignature;
  /** Client-generated ID of the message being signed. */
  message_id: string;
  /** Payload string the client signed; used only in server-side failure logs. */
  signature_payload?: string;
}
export const CreateChatConversationActionSignatures = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      encoded_message_event_detail: S.String,
      message_event_signature:
        CreateChatConversationActionSignaturesMessageEventSignature,
      message_id: S.String,
      signature_payload: S.optional(S.String),
    }),
).annotate({
  identifier: "CreateChatConversationActionSignatures",
}) as any as S.Schema<CreateChatConversationActionSignatures>;

/** Cryptographic signatures for the action. */
export type CreateChatConversationRequestActionSignaturesList =
  Array<CreateChatConversationActionSignatures>;
export const CreateChatConversationRequestActionSignaturesList =
  /*@__PURE__*/ S.Array(
    CreateChatConversationActionSignatures,
  ) as any as S.Schema<CreateChatConversationRequestActionSignaturesList>;

export type CreateChatConversationConversationParticipantKeys =
  AddChatGroupMembersConversationParticipantKeys;
export const CreateChatConversationConversationParticipantKeys =
  AddChatGroupMembersConversationParticipantKeys;

/** Encrypted conversation keys for each participant. */
export type CreateChatConversationRequestConversationParticipantKeysList =
  Array<AddChatGroupMembersConversationParticipantKeys>;
export const CreateChatConversationRequestConversationParticipantKeysList =
  /*@__PURE__*/ S.Array(
    AddChatGroupMembersConversationParticipantKeys,
  ) as any as S.Schema<CreateChatConversationRequestConversationParticipantKeysList>;

/** User IDs of group admins. Defaults to the creator if omitted. */
export type CreateChatConversationRequestGroupAdminsList = Array<string>;
export const CreateChatConversationRequestGroupAdminsList =
  /*@__PURE__*/ S.Array(
    S.String,
  ) as any as S.Schema<CreateChatConversationRequestGroupAdminsList>;

/** User IDs of group members to include in the conversation. */
export type CreateChatConversationRequestGroupMembersList = Array<string>;
export const CreateChatConversationRequestGroupMembersList =
  /*@__PURE__*/ S.Array(
    S.String,
  ) as any as S.Schema<CreateChatConversationRequestGroupMembersList>;

export interface CreateChatConversationRequest {
  /** Cryptographic signatures for the action. */
  action_signatures?: CreateChatConversationRequestActionSignaturesList;
  /** Base64-encoded key rotation payload. */
  base64_encoded_key_rotation?: string;
  /** Client-generated conversation ID. */
  conversation_id: string;
  /** Version of the conversation encryption key. */
  conversation_key_version: string;
  /** Encrypted conversation keys for each participant. */
  conversation_participant_keys: CreateChatConversationRequestConversationParticipantKeysList;
  /** User IDs of group admins. Defaults to the creator if omitted. */
  group_admins?: CreateChatConversationRequestGroupAdminsList;
  /** URL of the avatar image for the group conversation. */
  group_avatar_url?: string;
  /** Description for the group conversation. */
  group_description?: string;
  /** User IDs of group members to include in the conversation. */
  group_members: CreateChatConversationRequestGroupMembersList;
  /** Display name for the group conversation. */
  group_name?: string;
  /** Message time-to-live in milliseconds. Messages expire after this duration. */
  ttl_msec?: string;
}
export const CreateChatConversationRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    action_signatures: S.optional(
      CreateChatConversationRequestActionSignaturesList,
    ),
    base64_encoded_key_rotation: S.optional(S.String),
    conversation_id: S.String,
    conversation_key_version: S.String,
    conversation_participant_keys:
      CreateChatConversationRequestConversationParticipantKeysList,
    group_admins: S.optional(CreateChatConversationRequestGroupAdminsList),
    group_avatar_url: S.optional(S.String),
    group_description: S.optional(S.String),
    group_members: CreateChatConversationRequestGroupMembersList,
    group_name: S.optional(S.String),
    ttl_msec: S.optional(S.String),
  }).pipe(
    T.Http({ method: "POST", uri: "/2/chat/conversations/group", code: 200 }),
  ),
).annotate({
  identifier: "CreateChatConversationRequest",
}) as any as S.Schema<CreateChatConversationRequest>;

export interface CreateChatConversationResponseData {
  /** Canonical ID of the created conversation. */
  conversation_id: string;
  /** Sequence ID of the conversation key change. */
  conversation_key_change_sequence_id?: string;
}
export const CreateChatConversationResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    conversation_id: S.String,
    conversation_key_change_sequence_id: S.optional(S.String),
  }),
).annotate({
  identifier: "CreateChatConversationResponseData",
}) as any as S.Schema<CreateChatConversationResponseData>;

export type CreateChatConversationResponseErrorsList = Array<Problem>;
export const CreateChatConversationResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<CreateChatConversationResponseErrorsList>;

export interface CreateChatConversationResponse {
  data?: CreateChatConversationResponseData;
  errors?: CreateChatConversationResponseErrorsList;
}
export const CreateChatConversationResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(CreateChatConversationResponseData),
    errors: S.optional(CreateChatConversationResponseErrorsList),
  }),
).annotate({
  identifier: "CreateChatConversationResponse",
}) as any as S.Schema<CreateChatConversationResponse>;

export type GetChatConversationRequestChatConversationFieldsItem =
  | "created_at"
  | "group_avatar_url"
  | "group_name"
  | "id"
  | "is_muted"
  | "message_ttl_ms"
  | "screen_capture_blocking_enabled"
  | "screen_capture_detection_enabled"
  | "type"
  | "updated_at";
export const GetChatConversationRequestChatConversationFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a ChatConversation object. */
export type GetChatConversationRequestChatConversationFieldsList = Array<
  GetChatConversationRequestChatConversationFieldsItem | (string & {})
>;
export const GetChatConversationRequestChatConversationFieldsList =
  /*@__PURE__*/ S.Array(
    GetChatConversationRequestChatConversationFieldsItem,
  ) as any as S.Schema<GetChatConversationRequestChatConversationFieldsList>;

export type GetChatConversationRequestExpansionsItem =
  | "admin_ids"
  | "member_ids"
  | "participant_ids";
export const GetChatConversationRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetChatConversationRequestExpansionsList = Array<
  GetChatConversationRequestExpansionsItem | (string & {})
>;
export const GetChatConversationRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetChatConversationRequestExpansionsItem,
) as any as S.Schema<GetChatConversationRequestExpansionsList>;

export type GetChatConversationRequestUserFieldsItem =
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
export const GetChatConversationRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetChatConversationRequestUserFieldsList = Array<
  GetChatConversationRequestUserFieldsItem | (string & {})
>;
export const GetChatConversationRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetChatConversationRequestUserFieldsItem,
) as any as S.Schema<GetChatConversationRequestUserFieldsList>;

export interface GetChatConversationRequest {
  id: string;
  /** A comma separated list of ChatConversation fields to display. */
  chat_conversation_fields?: GetChatConversationRequestChatConversationFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetChatConversationRequestExpansionsList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetChatConversationRequestUserFieldsList;
}
export const GetChatConversationRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    chat_conversation_fields: S.optional(
      GetChatConversationRequestChatConversationFieldsList.pipe(
        T.Query("chat_conversation.fields"),
      ),
    ),
    expansions: S.optional(
      GetChatConversationRequestExpansionsList.pipe(T.Query()),
    ),
    user_fields: S.optional(
      GetChatConversationRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
  }).pipe(
    T.Http({ method: "GET", uri: "/2/chat/conversations/{id}", code: 200 }),
  ),
).annotate({
  identifier: "GetChatConversationRequest",
}) as any as S.Schema<GetChatConversationRequest>;

export type ChatConversationAdminIdsList = Array<string>;
export const ChatConversationAdminIdsList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<ChatConversationAdminIdsList>;

export type ChatConversationMemberIdsList = Array<string>;
export const ChatConversationMemberIdsList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<ChatConversationMemberIdsList>;

export type ChatConversationParticipantIdsList = Array<string>;
export const ChatConversationParticipantIdsList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<ChatConversationParticipantIdsList>;

export interface ChatConversation {
  admin_ids?: ChatConversationAdminIdsList;
  created_at?: string;
  group_avatar_url?: string;
  group_name?: string;
  id?: string;
  is_muted?: boolean;
  member_ids?: ChatConversationMemberIdsList;
  message_ttl_ms?: number;
  participant_ids?: ChatConversationParticipantIdsList;
  screen_capture_blocking_enabled?: boolean;
  screen_capture_detection_enabled?: boolean;
  type?: string;
  updated_at?: string;
}
export const ChatConversation = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    admin_ids: S.optional(ChatConversationAdminIdsList),
    created_at: S.optional(S.String),
    group_avatar_url: S.optional(S.String),
    group_name: S.optional(S.String),
    id: S.optional(S.String),
    is_muted: S.optional(S.Boolean),
    member_ids: S.optional(ChatConversationMemberIdsList),
    message_ttl_ms: S.optional(S.Number),
    participant_ids: S.optional(ChatConversationParticipantIdsList),
    screen_capture_blocking_enabled: S.optional(S.Boolean),
    screen_capture_detection_enabled: S.optional(S.Boolean),
    type: S.optional(S.String),
    updated_at: S.optional(S.String),
  }),
).annotate({
  identifier: "ChatConversation",
}) as any as S.Schema<ChatConversation>;

export type GetChatConversationResponseErrorsList = Array<Problem>;
export const GetChatConversationResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetChatConversationResponseErrorsList>;

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

export interface GetChatConversationResponse {
  data?: ChatConversation;
  errors?: GetChatConversationResponseErrorsList;
  includes?: Expansions;
}
export const GetChatConversationResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(ChatConversation),
    errors: S.optional(GetChatConversationResponseErrorsList),
    includes: S.optional(Expansions),
  }),
).annotate({
  identifier: "GetChatConversationResponse",
}) as any as S.Schema<GetChatConversationResponse>;

export type GetChatConversationEventsRequestChatMessageEventFieldsItem =
  | "conversation_id"
  | "conversation_token"
  | "created_at"
  | "encoded_event"
  | "id"
  | "is_trusted"
  | "message_event_signature"
  | "previous_id"
  | "sender_id";
export const GetChatConversationEventsRequestChatMessageEventFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a ChatMessageEvent object. */
export type GetChatConversationEventsRequestChatMessageEventFieldsList = Array<
  GetChatConversationEventsRequestChatMessageEventFieldsItem | (string & {})
>;
export const GetChatConversationEventsRequestChatMessageEventFieldsList =
  /*@__PURE__*/ S.Array(
    GetChatConversationEventsRequestChatMessageEventFieldsItem,
  ) as any as S.Schema<GetChatConversationEventsRequestChatMessageEventFieldsList>;

export interface GetChatConversationEventsRequest {
  id: string;
  max_results?: number;
  pagination_token?: string;
  /** A comma separated list of ChatMessageEvent fields to display. */
  chat_message_event_fields?: GetChatConversationEventsRequestChatMessageEventFieldsList;
}
export const GetChatConversationEventsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
    chat_message_event_fields: S.optional(
      GetChatConversationEventsRequestChatMessageEventFieldsList.pipe(
        T.Query("chat_message_event.fields"),
      ),
    ),
  }).pipe(
    T.Http({
      method: "GET",
      uri: "/2/chat/conversations/{id}/events",
      code: 200,
    }),
  ),
).annotate({
  identifier: "GetChatConversationEventsRequest",
}) as any as S.Schema<GetChatConversationEventsRequest>;

export interface ChatMessageEvent {
  conversation_id?: string;
  conversation_token?: string;
  created_at?: string;
  encoded_event?: string;
  id?: string;
  is_trusted?: boolean;
  message_event_signature?: unknown;
  previous_id?: string;
  sender_id?: string;
}
export const ChatMessageEvent = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    conversation_id: S.optional(S.String),
    conversation_token: S.optional(S.String),
    created_at: S.optional(S.String),
    encoded_event: S.optional(S.String),
    id: S.optional(S.String),
    is_trusted: S.optional(S.Boolean),
    message_event_signature: S.optional(S.Unknown),
    previous_id: S.optional(S.String),
    sender_id: S.optional(S.String),
  }),
).annotate({
  identifier: "ChatMessageEvent",
}) as any as S.Schema<ChatMessageEvent>;

export type GetChatConversationEventsResponseDataList = Array<ChatMessageEvent>;
export const GetChatConversationEventsResponseDataList = /*@__PURE__*/ S.Array(
  ChatMessageEvent,
) as any as S.Schema<GetChatConversationEventsResponseDataList>;

export type GetChatConversationEventsResponseErrorsList = Array<Problem>;
export const GetChatConversationEventsResponseErrorsList =
  /*@__PURE__*/ S.Array(
    Problem,
  ) as any as S.Schema<GetChatConversationEventsResponseErrorsList>;

export type GetChatConversationEventsResponseMetaConversationKeyEventsList =
  Array<string>;
export const GetChatConversationEventsResponseMetaConversationKeyEventsList =
  /*@__PURE__*/ S.Array(
    S.String,
  ) as any as S.Schema<GetChatConversationEventsResponseMetaConversationKeyEventsList>;

export interface GetChatConversationEventsResponseMeta {
  conversation_key_events?: GetChatConversationEventsResponseMetaConversationKeyEventsList;
  has_more?: boolean;
  /** Pagination token for the next page of results. */
  next_token?: string;
  /** Number of items in the data array. */
  result_count?: number;
}
export const GetChatConversationEventsResponseMeta = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      conversation_key_events: S.optional(
        GetChatConversationEventsResponseMetaConversationKeyEventsList,
      ),
      has_more: S.optional(S.Boolean),
      next_token: S.optional(S.String),
      result_count: S.optional(S.Number),
    }),
).annotate({
  identifier: "GetChatConversationEventsResponseMeta",
}) as any as S.Schema<GetChatConversationEventsResponseMeta>;

export interface GetChatConversationEventsResponse {
  data?: GetChatConversationEventsResponseDataList;
  errors?: GetChatConversationEventsResponseErrorsList;
  meta?: GetChatConversationEventsResponseMeta;
}
export const GetChatConversationEventsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetChatConversationEventsResponseDataList),
    errors: S.optional(GetChatConversationEventsResponseErrorsList),
    meta: S.optional(GetChatConversationEventsResponseMeta),
  }),
).annotate({
  identifier: "GetChatConversationEventsResponse",
}) as any as S.Schema<GetChatConversationEventsResponse>;

export type GetChatConversationsRequestChatConversationFieldsItem =
  | "created_at"
  | "group_avatar_url"
  | "group_name"
  | "id"
  | "is_muted"
  | "message_ttl_ms"
  | "screen_capture_blocking_enabled"
  | "screen_capture_detection_enabled"
  | "type"
  | "updated_at";
export const GetChatConversationsRequestChatConversationFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a ChatConversation object. */
export type GetChatConversationsRequestChatConversationFieldsList = Array<
  GetChatConversationsRequestChatConversationFieldsItem | (string & {})
>;
export const GetChatConversationsRequestChatConversationFieldsList =
  /*@__PURE__*/ S.Array(
    GetChatConversationsRequestChatConversationFieldsItem,
  ) as any as S.Schema<GetChatConversationsRequestChatConversationFieldsList>;

export type GetChatConversationsRequestExpansionsItem =
  | "admin_ids"
  | "member_ids"
  | "participant_ids";
export const GetChatConversationsRequestExpansionsItem = /*@__PURE__*/ S.String;

export type GetChatConversationsRequestExpansionsList = Array<
  GetChatConversationsRequestExpansionsItem | (string & {})
>;
export const GetChatConversationsRequestExpansionsList = /*@__PURE__*/ S.Array(
  GetChatConversationsRequestExpansionsItem,
) as any as S.Schema<GetChatConversationsRequestExpansionsList>;

export type GetChatConversationsRequestUserFieldsItem =
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
export const GetChatConversationsRequestUserFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetChatConversationsRequestUserFieldsList = Array<
  GetChatConversationsRequestUserFieldsItem | (string & {})
>;
export const GetChatConversationsRequestUserFieldsList = /*@__PURE__*/ S.Array(
  GetChatConversationsRequestUserFieldsItem,
) as any as S.Schema<GetChatConversationsRequestUserFieldsList>;

export interface GetChatConversationsRequest {
  max_results?: number;
  pagination_token?: string;
  /** A comma separated list of ChatConversation fields to display. */
  chat_conversation_fields?: GetChatConversationsRequestChatConversationFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetChatConversationsRequestExpansionsList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetChatConversationsRequestUserFieldsList;
}
export const GetChatConversationsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
    chat_conversation_fields: S.optional(
      GetChatConversationsRequestChatConversationFieldsList.pipe(
        T.Query("chat_conversation.fields"),
      ),
    ),
    expansions: S.optional(
      GetChatConversationsRequestExpansionsList.pipe(T.Query()),
    ),
    user_fields: S.optional(
      GetChatConversationsRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/chat/conversations", code: 200 })),
).annotate({
  identifier: "GetChatConversationsRequest",
}) as any as S.Schema<GetChatConversationsRequest>;

export type GetChatConversationsResponseDataList = Array<ChatConversation>;
export const GetChatConversationsResponseDataList = /*@__PURE__*/ S.Array(
  ChatConversation,
) as any as S.Schema<GetChatConversationsResponseDataList>;

export type GetChatConversationsResponseErrorsList = Array<Problem>;
export const GetChatConversationsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetChatConversationsResponseErrorsList>;

export interface GetChatConversationsResponseMeta {
  has_message_requests?: boolean;
  has_more?: boolean;
  /** Pagination token for the next page of results. */
  next_token?: string;
  /** Number of items in the data array. */
  result_count?: number;
}
export const GetChatConversationsResponseMeta = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    has_message_requests: S.optional(S.Boolean),
    has_more: S.optional(S.Boolean),
    next_token: S.optional(S.String),
    result_count: S.optional(S.Number),
  }),
).annotate({
  identifier: "GetChatConversationsResponseMeta",
}) as any as S.Schema<GetChatConversationsResponseMeta>;

export interface GetChatConversationsResponse {
  data?: GetChatConversationsResponseDataList;
  errors?: GetChatConversationsResponseErrorsList;
  includes?: Expansions;
  meta?: GetChatConversationsResponseMeta;
}
export const GetChatConversationsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetChatConversationsResponseDataList),
    errors: S.optional(GetChatConversationsResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(GetChatConversationsResponseMeta),
  }),
).annotate({
  identifier: "GetChatConversationsResponse",
}) as any as S.Schema<GetChatConversationsResponse>;

export type GetUsersPublicKeyRequestPublicKeyFieldsItem =
  | "identity_public_key_signature"
  | "juicebox_config"
  | "public_key"
  | "public_key_version"
  | "signing_public_key";
export const GetUsersPublicKeyRequestPublicKeyFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a PublicKey object. */
export type GetUsersPublicKeyRequestPublicKeyFieldsList = Array<
  GetUsersPublicKeyRequestPublicKeyFieldsItem | (string & {})
>;
export const GetUsersPublicKeyRequestPublicKeyFieldsList =
  /*@__PURE__*/ S.Array(
    GetUsersPublicKeyRequestPublicKeyFieldsItem,
  ) as any as S.Schema<GetUsersPublicKeyRequestPublicKeyFieldsList>;

export interface GetUsersPublicKeyRequest {
  id: string;
  /** A comma separated list of PublicKey fields to display. */
  public_key_fields?: GetUsersPublicKeyRequestPublicKeyFieldsList;
}
export const GetUsersPublicKeyRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    public_key_fields: S.optional(
      GetUsersPublicKeyRequestPublicKeyFieldsList.pipe(
        T.Query("public_key.fields"),
      ),
    ),
  }).pipe(
    T.Http({ method: "GET", uri: "/2/users/{id}/public_keys", code: 200 }),
  ),
).annotate({
  identifier: "GetUsersPublicKeyRequest",
}) as any as S.Schema<GetUsersPublicKeyRequest>;

export interface PublicKey {
  identity_public_key_signature?: string;
  juicebox_config?: unknown;
  public_key?: string;
  public_key_version?: string;
  signing_public_key?: string;
}
export const PublicKey = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    identity_public_key_signature: S.optional(S.String),
    juicebox_config: S.optional(S.Unknown),
    public_key: S.optional(S.String),
    public_key_version: S.optional(S.String),
    signing_public_key: S.optional(S.String),
  }),
).annotate({ identifier: "PublicKey" }) as any as S.Schema<PublicKey>;

export type GetUsersPublicKeyResponseDataList = Array<PublicKey>;
export const GetUsersPublicKeyResponseDataList = /*@__PURE__*/ S.Array(
  PublicKey,
) as any as S.Schema<GetUsersPublicKeyResponseDataList>;

export type GetUsersPublicKeyResponseErrorsList = Array<Problem>;
export const GetUsersPublicKeyResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersPublicKeyResponseErrorsList>;

export interface GetUsersPublicKeyResponse {
  data?: GetUsersPublicKeyResponseDataList;
  errors?: GetUsersPublicKeyResponseErrorsList;
}
export const GetUsersPublicKeyResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetUsersPublicKeyResponseDataList),
    errors: S.optional(GetUsersPublicKeyResponseErrorsList),
  }),
).annotate({
  identifier: "GetUsersPublicKeyResponse",
}) as any as S.Schema<GetUsersPublicKeyResponse>;

export type GetUsersPublicKeysRequestIdsList = Array<string>;
export const GetUsersPublicKeysRequestIdsList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<GetUsersPublicKeysRequestIdsList>;

export type GetUsersPublicKeysRequestPublicKeyFieldsItem =
  | "identity_public_key_signature"
  | "juicebox_config"
  | "public_key"
  | "public_key_version"
  | "signing_public_key";
export const GetUsersPublicKeysRequestPublicKeyFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a PublicKey object. */
export type GetUsersPublicKeysRequestPublicKeyFieldsList = Array<
  GetUsersPublicKeysRequestPublicKeyFieldsItem | (string & {})
>;
export const GetUsersPublicKeysRequestPublicKeyFieldsList =
  /*@__PURE__*/ S.Array(
    GetUsersPublicKeysRequestPublicKeyFieldsItem,
  ) as any as S.Schema<GetUsersPublicKeysRequestPublicKeyFieldsList>;

export interface GetUsersPublicKeysRequest {
  ids: GetUsersPublicKeysRequestIdsList;
  /** A comma separated list of PublicKey fields to display. */
  public_key_fields?: GetUsersPublicKeysRequestPublicKeyFieldsList;
}
export const GetUsersPublicKeysRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    ids: GetUsersPublicKeysRequestIdsList.pipe(T.Query()),
    public_key_fields: S.optional(
      GetUsersPublicKeysRequestPublicKeyFieldsList.pipe(
        T.Query("public_key.fields"),
      ),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/users/public_keys", code: 200 })),
).annotate({
  identifier: "GetUsersPublicKeysRequest",
}) as any as S.Schema<GetUsersPublicKeysRequest>;

export type GetUsersPublicKeysResponseDataList = Array<PublicKey>;
export const GetUsersPublicKeysResponseDataList = /*@__PURE__*/ S.Array(
  PublicKey,
) as any as S.Schema<GetUsersPublicKeysResponseDataList>;

export type GetUsersPublicKeysResponseErrorsList = Array<Problem>;
export const GetUsersPublicKeysResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetUsersPublicKeysResponseErrorsList>;

export interface GetUsersPublicKeysResponse {
  data?: GetUsersPublicKeysResponseDataList;
  errors?: GetUsersPublicKeysResponseErrorsList;
}
export const GetUsersPublicKeysResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetUsersPublicKeysResponseDataList),
    errors: S.optional(GetUsersPublicKeysResponseErrorsList),
  }),
).annotate({
  identifier: "GetUsersPublicKeysResponse",
}) as any as S.Schema<GetUsersPublicKeysResponse>;

export interface InitializeChatGroupRequest {}
export const InitializeChatGroupRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({}).pipe(
    T.Http({
      method: "POST",
      uri: "/2/chat/conversations/group/initialize",
      code: 200,
    }),
  ),
).annotate({
  identifier: "InitializeChatGroupRequest",
}) as any as S.Schema<InitializeChatGroupRequest>;

export interface InitializeChatGroupResponseData {
  /** Unique ID for the new group conversation. */
  conversation_id: string;
}
export const InitializeChatGroupResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    conversation_id: S.String,
  }),
).annotate({
  identifier: "InitializeChatGroupResponseData",
}) as any as S.Schema<InitializeChatGroupResponseData>;

export type InitializeChatGroupResponseErrorsList = Array<Problem>;
export const InitializeChatGroupResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<InitializeChatGroupResponseErrorsList>;

export interface InitializeChatGroupResponse {
  data?: InitializeChatGroupResponseData;
  errors?: InitializeChatGroupResponseErrorsList;
}
export const InitializeChatGroupResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(InitializeChatGroupResponseData),
    errors: S.optional(InitializeChatGroupResponseErrorsList),
  }),
).annotate({
  identifier: "InitializeChatGroupResponse",
}) as any as S.Schema<InitializeChatGroupResponse>;

export interface MarkChatConversationReadRequest {
  id: string;
  /** The sequence ID of the last message to mark as read up to. */
  seen_until_sequence_id: string;
}
export const MarkChatConversationReadRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    seen_until_sequence_id: S.String,
  }).pipe(
    T.Http({
      method: "POST",
      uri: "/2/chat/conversations/{id}/read",
      code: 200,
    }),
  ),
).annotate({
  identifier: "MarkChatConversationReadRequest",
}) as any as S.Schema<MarkChatConversationReadRequest>;

export interface MarkChatConversationReadResponseData {
  /** Whether the conversation was marked read. */
  success: boolean;
}
export const MarkChatConversationReadResponseData = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      success: S.Boolean,
    }),
).annotate({
  identifier: "MarkChatConversationReadResponseData",
}) as any as S.Schema<MarkChatConversationReadResponseData>;

export type MarkChatConversationReadResponseErrorsList = Array<Problem>;
export const MarkChatConversationReadResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<MarkChatConversationReadResponseErrorsList>;

export interface MarkChatConversationReadResponse {
  data?: MarkChatConversationReadResponseData;
  errors?: MarkChatConversationReadResponseErrorsList;
}
export const MarkChatConversationReadResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(MarkChatConversationReadResponseData),
    errors: S.optional(MarkChatConversationReadResponseErrorsList),
  }),
).annotate({
  identifier: "MarkChatConversationReadResponse",
}) as any as S.Schema<MarkChatConversationReadResponse>;

export interface SendChatMessageRequest {
  id: string;
  /** Optional conversation token. */
  conversation_token?: string;
  /** Base64-encoded Thrift MessageCreateEvent containing encrypted message contents. */
  encoded_message_create_event: string;
  /** Base64-encoded Thrift MessageEventSignature for message verification. */
  encoded_message_event_signature?: string;
  /** Unique identifier for this message. */
  message_id: string;
}
export const SendChatMessageRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    conversation_token: S.optional(S.String),
    encoded_message_create_event: S.String,
    encoded_message_event_signature: S.optional(S.String),
    message_id: S.String,
  }).pipe(
    T.Http({
      method: "POST",
      uri: "/2/chat/conversations/{id}/messages",
      code: 200,
    }),
  ),
).annotate({
  identifier: "SendChatMessageRequest",
}) as any as S.Schema<SendChatMessageRequest>;

export interface SendChatMessageResponseData {
  /** Base64-encoded Thrift message event for the sent message. */
  encoded_message_event: string;
}
export const SendChatMessageResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    encoded_message_event: S.String,
  }),
).annotate({
  identifier: "SendChatMessageResponseData",
}) as any as S.Schema<SendChatMessageResponseData>;

export type SendChatMessageResponseErrorsList = Array<Problem>;
export const SendChatMessageResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<SendChatMessageResponseErrorsList>;

export interface SendChatMessageResponse {
  data?: SendChatMessageResponseData;
  errors?: SendChatMessageResponseErrorsList;
}
export const SendChatMessageResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(SendChatMessageResponseData),
    errors: S.optional(SendChatMessageResponseErrorsList),
  }),
).annotate({
  identifier: "SendChatMessageResponse",
}) as any as S.Schema<SendChatMessageResponse>;

export interface SendChatTypingIndicatorRequest {
  id: string;
}
export const SendChatTypingIndicatorRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
  }).pipe(
    T.Http({
      method: "POST",
      uri: "/2/chat/conversations/{id}/typing",
      code: 200,
    }),
  ),
).annotate({
  identifier: "SendChatTypingIndicatorRequest",
}) as any as S.Schema<SendChatTypingIndicatorRequest>;

export interface SendChatTypingIndicatorResponseData {
  /** Whether the typing indicator was sent. */
  success: boolean;
}
export const SendChatTypingIndicatorResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    success: S.Boolean,
  }),
).annotate({
  identifier: "SendChatTypingIndicatorResponseData",
}) as any as S.Schema<SendChatTypingIndicatorResponseData>;

export type SendChatTypingIndicatorResponseErrorsList = Array<Problem>;
export const SendChatTypingIndicatorResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<SendChatTypingIndicatorResponseErrorsList>;

export interface SendChatTypingIndicatorResponse {
  data?: SendChatTypingIndicatorResponseData;
  errors?: SendChatTypingIndicatorResponseErrorsList;
}
export const SendChatTypingIndicatorResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(SendChatTypingIndicatorResponseData),
    errors: S.optional(SendChatTypingIndicatorResponseErrorsList),
  }),
).annotate({
  identifier: "SendChatTypingIndicatorResponse",
}) as any as S.Schema<SendChatTypingIndicatorResponse>;

export const addChatGroupMembers = /*@__PURE__*/ makeOperation<
  AddChatGroupMembersRequest,
  AddChatGroupMembersResponse
>(
  operations.addChatGroupMembers,
  () => AddChatGroupMembersRequest,
  () => AddChatGroupMembersResponse,
);

export const addConversationKeys = /*@__PURE__*/ makeOperation<
  AddConversationKeysRequest,
  AddConversationKeysResponse
>(
  operations.addConversationKeys,
  () => AddConversationKeysRequest,
  () => AddConversationKeysResponse,
);

export const addUserPublicKey = /*@__PURE__*/ makeOperation<
  AddUserPublicKeyRequest,
  AddUserPublicKeyResponse
>(
  operations.addUserPublicKey,
  () => AddUserPublicKeyRequest,
  () => AddUserPublicKeyResponse,
);

export const chatMediaDownload = /*@__PURE__*/ makeBinaryOperation<
  ChatMediaDownloadRequest,
  ChatMediaDownloadResponse
>(
  operations.chatMediaDownload,
  () => ChatMediaDownloadRequest,
  () => ChatMediaDownloadResponse,
);

export const chatMediaUploadAppend = /*@__PURE__*/ makeOperation<
  ChatMediaUploadAppendRequest,
  ChatMediaUploadAppendResponse
>(
  operations.chatMediaUploadAppend,
  () => ChatMediaUploadAppendRequest,
  () => ChatMediaUploadAppendResponse,
);

export const chatMediaUploadFinalize = /*@__PURE__*/ makeOperation<
  ChatMediaUploadFinalizeRequest,
  ChatMediaUploadFinalizeResponse
>(
  operations.chatMediaUploadFinalize,
  () => ChatMediaUploadFinalizeRequest,
  () => ChatMediaUploadFinalizeResponse,
);

export const chatMediaUploadInitialize = /*@__PURE__*/ makeOperation<
  ChatMediaUploadInitializeRequest,
  ChatMediaUploadInitializeResponse
>(
  operations.chatMediaUploadInitialize,
  () => ChatMediaUploadInitializeRequest,
  () => ChatMediaUploadInitializeResponse,
);

export const createChatConversation = /*@__PURE__*/ makeOperation<
  CreateChatConversationRequest,
  CreateChatConversationResponse
>(
  operations.createChatConversation,
  () => CreateChatConversationRequest,
  () => CreateChatConversationResponse,
);

export const getChatConversation = /*@__PURE__*/ makeOperation<
  GetChatConversationRequest,
  GetChatConversationResponse
>(
  operations.getChatConversation,
  () => GetChatConversationRequest,
  () => GetChatConversationResponse,
);

export const getChatConversationEvents = /*@__PURE__*/ makeOperation<
  GetChatConversationEventsRequest,
  GetChatConversationEventsResponse
>(
  operations.getChatConversationEvents,
  () => GetChatConversationEventsRequest,
  () => GetChatConversationEventsResponse,
);

export const getChatConversations = /*@__PURE__*/ makeOperation<
  GetChatConversationsRequest,
  GetChatConversationsResponse
>(
  operations.getChatConversations,
  () => GetChatConversationsRequest,
  () => GetChatConversationsResponse,
);

export const getUsersPublicKey = /*@__PURE__*/ makeOperation<
  GetUsersPublicKeyRequest,
  GetUsersPublicKeyResponse
>(
  operations.getUsersPublicKey,
  () => GetUsersPublicKeyRequest,
  () => GetUsersPublicKeyResponse,
);

export const getUsersPublicKeys = /*@__PURE__*/ makeOperation<
  GetUsersPublicKeysRequest,
  GetUsersPublicKeysResponse
>(
  operations.getUsersPublicKeys,
  () => GetUsersPublicKeysRequest,
  () => GetUsersPublicKeysResponse,
);

export const initializeChatGroup = /*@__PURE__*/ makeOperation<
  InitializeChatGroupRequest,
  InitializeChatGroupResponse
>(
  operations.initializeChatGroup,
  () => InitializeChatGroupRequest,
  () => InitializeChatGroupResponse,
);

export const markChatConversationRead = /*@__PURE__*/ makeOperation<
  MarkChatConversationReadRequest,
  MarkChatConversationReadResponse
>(
  operations.markChatConversationRead,
  () => MarkChatConversationReadRequest,
  () => MarkChatConversationReadResponse,
);

export const sendChatMessage = /*@__PURE__*/ makeOperation<
  SendChatMessageRequest,
  SendChatMessageResponse
>(
  operations.sendChatMessage,
  () => SendChatMessageRequest,
  () => SendChatMessageResponse,
);

export const sendChatTypingIndicator = /*@__PURE__*/ makeOperation<
  SendChatTypingIndicatorRequest,
  SendChatTypingIndicatorResponse
>(
  operations.sendChatTypingIndicator,
  () => SendChatTypingIndicatorRequest,
  () => SendChatTypingIndicatorResponse,
);
