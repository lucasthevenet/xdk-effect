// AUTO-GENERATED from xdevplatform/xdk@84c26540df30c0b798e50e34151c56d5d262ba1c; do not edit.
import * as S from "@distilled.cloud/core/schema";
import * as T from "../traits.ts";
import {
  makeOperation,
  makeBinaryOperation,
  makeStreamOperation,
} from "../operation.ts";
import { operations } from "../operations.ts";
export type MediaData = string | Blob;
export const MediaData = S.Union([S.String, S.instanceOf(Blob)]);
export interface AppendMediaUploadRequest {
  id: string;
  /** The media chunk to upload. */
  media: MediaData;
  /** The index of this segment in the upload sequence. */
  segment_index: number;
}
export const AppendMediaUploadRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    media: MediaData,
    segment_index: S.Number,
  }).pipe(
    T.Http({ method: "POST", uri: "/2/media/upload/{id}/append", code: 200 }),
  ),
).annotate({
  identifier: "AppendMediaUploadRequest",
}) as any as S.Schema<AppendMediaUploadRequest>;

export interface AppendMediaUploadResponseData {
  /** Epoch seconds when the upload session expires. */
  expires_at?: number;
}
export const AppendMediaUploadResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    expires_at: S.optional(S.Number),
  }),
).annotate({
  identifier: "AppendMediaUploadResponseData",
}) as any as S.Schema<AppendMediaUploadResponseData>;

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
export type AppendMediaUploadResponseErrorsList = Array<Problem>;
export const AppendMediaUploadResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<AppendMediaUploadResponseErrorsList>;

export interface AppendMediaUploadResponse {
  data?: AppendMediaUploadResponseData;
  errors?: AppendMediaUploadResponseErrorsList;
}
export const AppendMediaUploadResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(AppendMediaUploadResponseData),
    errors: S.optional(AppendMediaUploadResponseErrorsList),
  }),
).annotate({
  identifier: "AppendMediaUploadResponse",
}) as any as S.Schema<AppendMediaUploadResponse>;

export interface CreateMediaMetadataMetadataAllowDownloadStatus {
  allow_download?: boolean;
}
export const CreateMediaMetadataMetadataAllowDownloadStatus =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      allow_download: S.optional(S.Boolean),
    }),
  ).annotate({
    identifier: "CreateMediaMetadataMetadataAllowDownloadStatus",
  }) as any as S.Schema<CreateMediaMetadataMetadataAllowDownloadStatus>;

export interface CreateMediaMetadataMetadataAltText {
  text: string;
}
export const CreateMediaMetadataMetadataAltText = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    text: S.String,
  }),
).annotate({
  identifier: "CreateMediaMetadataMetadataAltText",
}) as any as S.Schema<CreateMediaMetadataMetadataAltText>;

export interface CreateMediaMetadataMetadataContentExpiration {
  timestamp_sec: number;
}
export const CreateMediaMetadataMetadataContentExpiration =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      timestamp_sec: S.Number,
    }),
  ).annotate({
    identifier: "CreateMediaMetadataMetadataContentExpiration",
  }) as any as S.Schema<CreateMediaMetadataMetadataContentExpiration>;

export type CreateMediaMetadataMetadataDomainRestrictionsWhitelistList =
  Array<string>;
export const CreateMediaMetadataMetadataDomainRestrictionsWhitelistList =
  /*@__PURE__*/ S.Array(
    S.String,
  ) as any as S.Schema<CreateMediaMetadataMetadataDomainRestrictionsWhitelistList>;

export interface CreateMediaMetadataMetadataDomainRestrictions {
  whitelist: CreateMediaMetadataMetadataDomainRestrictionsWhitelistList;
}
export const CreateMediaMetadataMetadataDomainRestrictions =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      whitelist: CreateMediaMetadataMetadataDomainRestrictionsWhitelistList,
    }),
  ).annotate({
    identifier: "CreateMediaMetadataMetadataDomainRestrictions",
  }) as any as S.Schema<CreateMediaMetadataMetadataDomainRestrictions>;

export interface CreateMediaMetadataMetadataFoundMediaOrigin {
  id: string;
  provider: string;
}
export const CreateMediaMetadataMetadataFoundMediaOrigin =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      id: S.String,
      provider: S.String,
    }),
  ).annotate({
    identifier: "CreateMediaMetadataMetadataFoundMediaOrigin",
  }) as any as S.Schema<CreateMediaMetadataMetadataFoundMediaOrigin>;

export interface CreateMediaMetadataMetadataManagementInfo {
  managed: boolean;
}
export const CreateMediaMetadataMetadataManagementInfo =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      managed: S.Boolean,
    }),
  ).annotate({
    identifier: "CreateMediaMetadataMetadataManagementInfo",
  }) as any as S.Schema<CreateMediaMetadataMetadataManagementInfo>;

export interface CreateMediaMetadataMetadataPreviewImage {
  media_key: unknown;
}
export const CreateMediaMetadataMetadataPreviewImage = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      media_key: S.Unknown,
    }),
).annotate({
  identifier: "CreateMediaMetadataMetadataPreviewImage",
}) as any as S.Schema<CreateMediaMetadataMetadataPreviewImage>;

export interface CreateMediaMetadataMetadataSharedInfo {
  shared: boolean;
}
export const CreateMediaMetadataMetadataSharedInfo = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      shared: S.Boolean,
    }),
).annotate({
  identifier: "CreateMediaMetadataMetadataSharedInfo",
}) as any as S.Schema<CreateMediaMetadataMetadataSharedInfo>;

export type CreateMediaMetadataMetadataStickerInfoStickersList = Array<unknown>;
export const CreateMediaMetadataMetadataStickerInfoStickersList =
  /*@__PURE__*/ S.Array(
    S.Unknown,
  ) as any as S.Schema<CreateMediaMetadataMetadataStickerInfoStickersList>;

export interface CreateMediaMetadataMetadataStickerInfo {
  stickers: CreateMediaMetadataMetadataStickerInfoStickersList;
}
export const CreateMediaMetadataMetadataStickerInfo = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      stickers: CreateMediaMetadataMetadataStickerInfoStickersList,
    }),
).annotate({
  identifier: "CreateMediaMetadataMetadataStickerInfo",
}) as any as S.Schema<CreateMediaMetadataMetadataStickerInfo>;

export interface CreateMediaMetadataMetadataUploadSource {
  upload_source: string;
}
export const CreateMediaMetadataMetadataUploadSource = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      upload_source: S.String,
    }),
).annotate({
  identifier: "CreateMediaMetadataMetadataUploadSource",
}) as any as S.Schema<CreateMediaMetadataMetadataUploadSource>;

export interface CreateMediaMetadataMetadata {
  allow_download_status?: CreateMediaMetadataMetadataAllowDownloadStatus;
  alt_text?: CreateMediaMetadataMetadataAltText;
  audience_policy?: unknown;
  content_expiration?: CreateMediaMetadataMetadataContentExpiration;
  domain_restrictions?: CreateMediaMetadataMetadataDomainRestrictions;
  found_media_origin?: CreateMediaMetadataMetadataFoundMediaOrigin;
  geo_restrictions?: unknown;
  management_info?: CreateMediaMetadataMetadataManagementInfo;
  preview_image?: CreateMediaMetadataMetadataPreviewImage;
  sensitive_media_warning?: unknown;
  shared_info?: CreateMediaMetadataMetadataSharedInfo;
  sticker_info?: CreateMediaMetadataMetadataStickerInfo;
  upload_source?: CreateMediaMetadataMetadataUploadSource;
}
export const CreateMediaMetadataMetadata = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    allow_download_status: S.optional(
      CreateMediaMetadataMetadataAllowDownloadStatus,
    ),
    alt_text: S.optional(CreateMediaMetadataMetadataAltText),
    audience_policy: S.optional(S.Unknown),
    content_expiration: S.optional(
      CreateMediaMetadataMetadataContentExpiration,
    ),
    domain_restrictions: S.optional(
      CreateMediaMetadataMetadataDomainRestrictions,
    ),
    found_media_origin: S.optional(CreateMediaMetadataMetadataFoundMediaOrigin),
    geo_restrictions: S.optional(S.Unknown),
    management_info: S.optional(CreateMediaMetadataMetadataManagementInfo),
    preview_image: S.optional(CreateMediaMetadataMetadataPreviewImage),
    sensitive_media_warning: S.optional(S.Unknown),
    shared_info: S.optional(CreateMediaMetadataMetadataSharedInfo),
    sticker_info: S.optional(CreateMediaMetadataMetadataStickerInfo),
    upload_source: S.optional(CreateMediaMetadataMetadataUploadSource),
  }),
).annotate({
  identifier: "CreateMediaMetadataMetadata",
}) as any as S.Schema<CreateMediaMetadataMetadata>;

export interface CreateMediaMetadataRequest {
  /** The media id the metadata is attached to. */
  id: string;
  /** User-defined metadata to associate with the media. */
  metadata?: CreateMediaMetadataMetadata;
}
export const CreateMediaMetadataRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String,
    metadata: S.optional(CreateMediaMetadataMetadata),
  }).pipe(T.Http({ method: "POST", uri: "/2/media/metadata", code: 200 })),
).annotate({
  identifier: "CreateMediaMetadataRequest",
}) as any as S.Schema<CreateMediaMetadataRequest>;

export interface CreateMediaMetadataResponseData {
  /** The metadata now associated with the media. */
  associated_metadata?: unknown;
  /** The media id the metadata was attached to. */
  id: string;
}
export const CreateMediaMetadataResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    associated_metadata: S.optional(S.Unknown),
    id: S.String,
  }),
).annotate({
  identifier: "CreateMediaMetadataResponseData",
}) as any as S.Schema<CreateMediaMetadataResponseData>;

export type CreateMediaMetadataResponseErrorsList = Array<Problem>;
export const CreateMediaMetadataResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<CreateMediaMetadataResponseErrorsList>;

export interface CreateMediaMetadataResponse {
  data?: CreateMediaMetadataResponseData;
  errors?: CreateMediaMetadataResponseErrorsList;
}
export const CreateMediaMetadataResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(CreateMediaMetadataResponseData),
    errors: S.optional(CreateMediaMetadataResponseErrorsList),
  }),
).annotate({
  identifier: "CreateMediaMetadataResponse",
}) as any as S.Schema<CreateMediaMetadataResponse>;

/** The media category of the target media. */
export type CreateMediaSubtitlesRequestMediaCategory =
  | "AmplifyVideo"
  | "TweetVideo";
export const CreateMediaSubtitlesRequestMediaCategory = /*@__PURE__*/ S.String;

export interface CreateMediaSubtitlesSubtitles {
  /** Language name in a human readable form. */
  display_name?: string;
  /** The media id of the subtitle track. */
  id?: string;
  /** BCP47 language code of the subtitle track. */
  language_code?: string;
}
export const CreateMediaSubtitlesSubtitles = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    display_name: S.optional(S.String),
    id: S.optional(S.String),
    language_code: S.optional(S.String),
  }),
).annotate({
  identifier: "CreateMediaSubtitlesSubtitles",
}) as any as S.Schema<CreateMediaSubtitlesSubtitles>;

export interface CreateMediaSubtitlesRequest {
  /** The media id of the video the subtitles belong to. */
  id?: string;
  /** The media category of the target media. */
  media_category?: CreateMediaSubtitlesRequestMediaCategory | (string & {});
  /** The subtitle tracks to associate with the media. */
  subtitles?: CreateMediaSubtitlesSubtitles;
}
export const CreateMediaSubtitlesRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    media_category: S.optional(CreateMediaSubtitlesRequestMediaCategory),
    subtitles: S.optional(CreateMediaSubtitlesSubtitles),
  }).pipe(T.Http({ method: "POST", uri: "/2/media/subtitles", code: 200 })),
).annotate({
  identifier: "CreateMediaSubtitlesRequest",
}) as any as S.Schema<CreateMediaSubtitlesRequest>;

export interface CreateMediaSubtitlesResponseData {
  /** The subtitles now associated with the media. */
  associated_subtitles?: unknown;
  /** The media id. */
  id?: string;
  /** The media category. */
  media_category?: string;
}
export const CreateMediaSubtitlesResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    associated_subtitles: S.optional(S.Unknown),
    id: S.optional(S.String),
    media_category: S.optional(S.String),
  }),
).annotate({
  identifier: "CreateMediaSubtitlesResponseData",
}) as any as S.Schema<CreateMediaSubtitlesResponseData>;

export type CreateMediaSubtitlesResponseErrorsList = Array<Problem>;
export const CreateMediaSubtitlesResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<CreateMediaSubtitlesResponseErrorsList>;

export interface CreateMediaSubtitlesResponse {
  data?: CreateMediaSubtitlesResponseData;
  errors?: CreateMediaSubtitlesResponseErrorsList;
}
export const CreateMediaSubtitlesResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(CreateMediaSubtitlesResponseData),
    errors: S.optional(CreateMediaSubtitlesResponseErrorsList),
  }),
).annotate({
  identifier: "CreateMediaSubtitlesResponse",
}) as any as S.Schema<CreateMediaSubtitlesResponse>;

export interface DeleteMediaSubtitlesRequest {
  /** The media id of the video the subtitles belong to. */
  id: string;
  /** The language code of the subtitles to delete. */
  language_code: string;
  /** The media category of the target media. */
  media_category: string;
}
export const DeleteMediaSubtitlesRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String,
    language_code: S.String,
    media_category: S.String,
  }).pipe(T.Http({ method: "DELETE", uri: "/2/media/subtitles", code: 200 })),
).annotate({
  identifier: "DeleteMediaSubtitlesRequest",
}) as any as S.Schema<DeleteMediaSubtitlesRequest>;

export interface DeleteMediaSubtitlesResponseData {
  /** Indicates whether the subtitles were deleted. */
  deleted: boolean;
}
export const DeleteMediaSubtitlesResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    deleted: S.Boolean,
  }),
).annotate({
  identifier: "DeleteMediaSubtitlesResponseData",
}) as any as S.Schema<DeleteMediaSubtitlesResponseData>;

export type DeleteMediaSubtitlesResponseErrorsList = Array<Problem>;
export const DeleteMediaSubtitlesResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<DeleteMediaSubtitlesResponseErrorsList>;

export interface DeleteMediaSubtitlesResponse {
  data?: DeleteMediaSubtitlesResponseData;
  errors?: DeleteMediaSubtitlesResponseErrorsList;
}
export const DeleteMediaSubtitlesResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(DeleteMediaSubtitlesResponseData),
    errors: S.optional(DeleteMediaSubtitlesResponseErrorsList),
  }),
).annotate({
  identifier: "DeleteMediaSubtitlesResponse",
}) as any as S.Schema<DeleteMediaSubtitlesResponse>;

export interface FinalizeMediaUploadRequest {
  id: string;
}
export const FinalizeMediaUploadRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
  }).pipe(
    T.Http({ method: "POST", uri: "/2/media/upload/{id}/finalize", code: 200 }),
  ),
).annotate({
  identifier: "FinalizeMediaUploadRequest",
}) as any as S.Schema<FinalizeMediaUploadRequest>;

export interface FinalizeMediaUploadResponseDataImage {
  /** Height in pixels. */
  h?: number;
  /** MIME type of the uploaded image. */
  image_type?: string;
  /** Width in pixels. */
  w?: number;
}
export const FinalizeMediaUploadResponseDataImage = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      h: S.optional(S.Number),
      image_type: S.optional(S.String),
      w: S.optional(S.Number),
    }),
).annotate({
  identifier: "FinalizeMediaUploadResponseDataImage",
}) as any as S.Schema<FinalizeMediaUploadResponseDataImage>;

export interface FinalizeMediaUploadResponseDataProcessingInfo {
  /** Seconds to wait before polling status again. */
  check_after_secs?: number;
  /** Processing completion percentage. */
  progress_percent?: number;
  /** Processing state (pending, in_progress, failed, succeeded). */
  state?: string;
}
export const FinalizeMediaUploadResponseDataProcessingInfo =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      check_after_secs: S.optional(S.Number),
      progress_percent: S.optional(S.Number),
      state: S.optional(S.String),
    }),
  ).annotate({
    identifier: "FinalizeMediaUploadResponseDataProcessingInfo",
  }) as any as S.Schema<FinalizeMediaUploadResponseDataProcessingInfo>;

export interface FinalizeMediaUploadResponseDataVideo {
  /** MIME type of the processed video. */
  video_type?: string;
}
export const FinalizeMediaUploadResponseDataVideo = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      video_type: S.optional(S.String),
    }),
).annotate({
  identifier: "FinalizeMediaUploadResponseDataVideo",
}) as any as S.Schema<FinalizeMediaUploadResponseDataVideo>;

export interface FinalizeMediaUploadResponseData {
  /** Seconds until the upload session expires. */
  expires_after_secs?: number;
  /** Unique identifier of the media. */
  id: string;
  image?: FinalizeMediaUploadResponseDataImage;
  /** The media key for the uploaded media. */
  media_key?: string;
  processing_info?: FinalizeMediaUploadResponseDataProcessingInfo;
  /** Total size of the media in bytes. */
  size?: number;
  video?: FinalizeMediaUploadResponseDataVideo;
}
export const FinalizeMediaUploadResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    expires_after_secs: S.optional(S.Number),
    id: S.String,
    image: S.optional(FinalizeMediaUploadResponseDataImage),
    media_key: S.optional(S.String),
    processing_info: S.optional(FinalizeMediaUploadResponseDataProcessingInfo),
    size: S.optional(S.Number),
    video: S.optional(FinalizeMediaUploadResponseDataVideo),
  }),
).annotate({
  identifier: "FinalizeMediaUploadResponseData",
}) as any as S.Schema<FinalizeMediaUploadResponseData>;

export type FinalizeMediaUploadResponseErrorsList = Array<Problem>;
export const FinalizeMediaUploadResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<FinalizeMediaUploadResponseErrorsList>;

export interface FinalizeMediaUploadResponse {
  data?: FinalizeMediaUploadResponseData;
  errors?: FinalizeMediaUploadResponseErrorsList;
}
export const FinalizeMediaUploadResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(FinalizeMediaUploadResponseData),
    errors: S.optional(FinalizeMediaUploadResponseErrorsList),
  }),
).annotate({
  identifier: "FinalizeMediaUploadResponse",
}) as any as S.Schema<FinalizeMediaUploadResponse>;

export type GetMediaAnalyticsRequestMediaKeysList = Array<string>;
export const GetMediaAnalyticsRequestMediaKeysList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<GetMediaAnalyticsRequestMediaKeysList>;

export type GetMediaAnalyticsRequestGranularity = "hourly" | "daily" | "total";
export const GetMediaAnalyticsRequestGranularity = /*@__PURE__*/ S.String;

export type GetMediaAnalyticsRequestMediaAnalyticsFieldsItem =
  | "cta_url_clicks"
  | "cta_watch_clicks"
  | "media_key"
  | "play_from_tap"
  | "playback25"
  | "playback50"
  | "playback75"
  | "playback_complete"
  | "playback_start"
  | "timestamp"
  | "timestamped_metrics"
  | "video_views"
  | "watch_time_ms";
export const GetMediaAnalyticsRequestMediaAnalyticsFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a MediaAnalytics object. */
export type GetMediaAnalyticsRequestMediaAnalyticsFieldsList = Array<
  GetMediaAnalyticsRequestMediaAnalyticsFieldsItem | (string & {})
>;
export const GetMediaAnalyticsRequestMediaAnalyticsFieldsList =
  /*@__PURE__*/ S.Array(
    GetMediaAnalyticsRequestMediaAnalyticsFieldsItem,
  ) as any as S.Schema<GetMediaAnalyticsRequestMediaAnalyticsFieldsList>;

export interface GetMediaAnalyticsRequest {
  media_keys: GetMediaAnalyticsRequestMediaKeysList;
  start_time: string;
  end_time: string;
  granularity?: GetMediaAnalyticsRequestGranularity | (string & {});
  /** A comma separated list of MediaAnalytics fields to display. */
  media_analytics_fields?: GetMediaAnalyticsRequestMediaAnalyticsFieldsList;
}
export const GetMediaAnalyticsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    media_keys: GetMediaAnalyticsRequestMediaKeysList.pipe(T.Query()),
    start_time: S.String.pipe(T.Query()),
    end_time: S.String.pipe(T.Query()),
    granularity: S.optional(
      GetMediaAnalyticsRequestGranularity.pipe(T.Query()),
    ),
    media_analytics_fields: S.optional(
      GetMediaAnalyticsRequestMediaAnalyticsFieldsList.pipe(
        T.Query("media_analytics.fields"),
      ),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/media/analytics", code: 200 })),
).annotate({
  identifier: "GetMediaAnalyticsRequest",
}) as any as S.Schema<GetMediaAnalyticsRequest>;

/** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
export type MediaAnalyticsTimestampedMetricsItemMetricsCtaUrlClicks =
  | number
  | string;
export const MediaAnalyticsTimestampedMetricsItemMetricsCtaUrlClicks =
  /*@__PURE__*/ S.Unknown as any as S.Schema<MediaAnalyticsTimestampedMetricsItemMetricsCtaUrlClicks>;
/** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
export type MediaAnalyticsTimestampedMetricsItemMetricsCtaWatchClicks =
  | number
  | string;
export const MediaAnalyticsTimestampedMetricsItemMetricsCtaWatchClicks =
  /*@__PURE__*/ S.Unknown as any as S.Schema<MediaAnalyticsTimestampedMetricsItemMetricsCtaWatchClicks>;
/** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
export type MediaAnalyticsTimestampedMetricsItemMetricsPlayFromTap =
  | number
  | string;
export const MediaAnalyticsTimestampedMetricsItemMetricsPlayFromTap =
  /*@__PURE__*/ S.Unknown as any as S.Schema<MediaAnalyticsTimestampedMetricsItemMetricsPlayFromTap>;
/** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
export type MediaAnalyticsTimestampedMetricsItemMetricsPlayback25 =
  | number
  | string;
export const MediaAnalyticsTimestampedMetricsItemMetricsPlayback25 =
  /*@__PURE__*/ S.Unknown as any as S.Schema<MediaAnalyticsTimestampedMetricsItemMetricsPlayback25>;
/** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
export type MediaAnalyticsTimestampedMetricsItemMetricsPlayback50 =
  | number
  | string;
export const MediaAnalyticsTimestampedMetricsItemMetricsPlayback50 =
  /*@__PURE__*/ S.Unknown as any as S.Schema<MediaAnalyticsTimestampedMetricsItemMetricsPlayback50>;
/** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
export type MediaAnalyticsTimestampedMetricsItemMetricsPlayback75 =
  | number
  | string;
export const MediaAnalyticsTimestampedMetricsItemMetricsPlayback75 =
  /*@__PURE__*/ S.Unknown as any as S.Schema<MediaAnalyticsTimestampedMetricsItemMetricsPlayback75>;
/** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
export type MediaAnalyticsTimestampedMetricsItemMetricsPlaybackComplete =
  | number
  | string;
export const MediaAnalyticsTimestampedMetricsItemMetricsPlaybackComplete =
  /*@__PURE__*/ S.Unknown as any as S.Schema<MediaAnalyticsTimestampedMetricsItemMetricsPlaybackComplete>;
/** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
export type MediaAnalyticsTimestampedMetricsItemMetricsPlaybackStart =
  | number
  | string;
export const MediaAnalyticsTimestampedMetricsItemMetricsPlaybackStart =
  /*@__PURE__*/ S.Unknown as any as S.Schema<MediaAnalyticsTimestampedMetricsItemMetricsPlaybackStart>;
/** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
export type MediaAnalyticsTimestampedMetricsItemMetricsVideoViews =
  | number
  | string;
export const MediaAnalyticsTimestampedMetricsItemMetricsVideoViews =
  /*@__PURE__*/ S.Unknown as any as S.Schema<MediaAnalyticsTimestampedMetricsItemMetricsVideoViews>;
/** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
export type MediaAnalyticsTimestampedMetricsItemMetricsWatchTimeMs =
  | number
  | string;
export const MediaAnalyticsTimestampedMetricsItemMetricsWatchTimeMs =
  /*@__PURE__*/ S.Unknown as any as S.Schema<MediaAnalyticsTimestampedMetricsItemMetricsWatchTimeMs>;
/** Video metric counts for this bucket. Counters are integers when the backend value parses as a number, otherwise the original string is preserved. */
export interface MediaAnalyticsTimestampedMetricsItemMetrics {
  /** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
  cta_url_clicks?: MediaAnalyticsTimestampedMetricsItemMetricsCtaUrlClicks | null;
  /** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
  cta_watch_clicks?: MediaAnalyticsTimestampedMetricsItemMetricsCtaWatchClicks | null;
  /** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
  play_from_tap?: MediaAnalyticsTimestampedMetricsItemMetricsPlayFromTap | null;
  /** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
  playback25?: MediaAnalyticsTimestampedMetricsItemMetricsPlayback25 | null;
  /** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
  playback50?: MediaAnalyticsTimestampedMetricsItemMetricsPlayback50 | null;
  /** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
  playback75?: MediaAnalyticsTimestampedMetricsItemMetricsPlayback75 | null;
  /** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
  playback_complete?: MediaAnalyticsTimestampedMetricsItemMetricsPlaybackComplete | null;
  /** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
  playback_start?: MediaAnalyticsTimestampedMetricsItemMetricsPlaybackStart | null;
  /** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
  video_views?: MediaAnalyticsTimestampedMetricsItemMetricsVideoViews | null;
  /** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
  watch_time_ms?: MediaAnalyticsTimestampedMetricsItemMetricsWatchTimeMs | null;
}
export const MediaAnalyticsTimestampedMetricsItemMetrics =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      cta_url_clicks: S.optional(
        S.NullOr(MediaAnalyticsTimestampedMetricsItemMetricsCtaUrlClicks),
      ),
      cta_watch_clicks: S.optional(
        S.NullOr(MediaAnalyticsTimestampedMetricsItemMetricsCtaWatchClicks),
      ),
      play_from_tap: S.optional(
        S.NullOr(MediaAnalyticsTimestampedMetricsItemMetricsPlayFromTap),
      ),
      playback25: S.optional(
        S.NullOr(MediaAnalyticsTimestampedMetricsItemMetricsPlayback25),
      ),
      playback50: S.optional(
        S.NullOr(MediaAnalyticsTimestampedMetricsItemMetricsPlayback50),
      ),
      playback75: S.optional(
        S.NullOr(MediaAnalyticsTimestampedMetricsItemMetricsPlayback75),
      ),
      playback_complete: S.optional(
        S.NullOr(MediaAnalyticsTimestampedMetricsItemMetricsPlaybackComplete),
      ),
      playback_start: S.optional(
        S.NullOr(MediaAnalyticsTimestampedMetricsItemMetricsPlaybackStart),
      ),
      video_views: S.optional(
        S.NullOr(MediaAnalyticsTimestampedMetricsItemMetricsVideoViews),
      ),
      watch_time_ms: S.optional(
        S.NullOr(MediaAnalyticsTimestampedMetricsItemMetricsWatchTimeMs),
      ),
    }),
  ).annotate({
    identifier: "MediaAnalyticsTimestampedMetricsItemMetrics",
  }) as any as S.Schema<MediaAnalyticsTimestampedMetricsItemMetrics>;

export interface MediaAnalyticsTimestampedMetricsItem {
  /** Video metric counts for this bucket. Counters are integers when the backend value parses as a number, otherwise the original string is preserved. */
  metrics?: MediaAnalyticsTimestampedMetricsItemMetrics | null;
  /** Start of the metrics bucket, as an ISO 8601 date-time. */
  timestamp?: string | null;
}
export const MediaAnalyticsTimestampedMetricsItem = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      metrics: S.optional(
        S.NullOr(MediaAnalyticsTimestampedMetricsItemMetrics),
      ),
      timestamp: S.optional(S.NullOr(S.String)),
    }),
).annotate({
  identifier: "MediaAnalyticsTimestampedMetricsItem",
}) as any as S.Schema<MediaAnalyticsTimestampedMetricsItem>;

/** Time-bucketed video metrics for the media, one entry per granularity bucket. */
export type MediaAnalyticsTimestampedMetrics =
  Array<MediaAnalyticsTimestampedMetricsItem>;
export const MediaAnalyticsTimestampedMetrics = /*@__PURE__*/ S.Array(
  MediaAnalyticsTimestampedMetricsItem,
) as any as S.Schema<MediaAnalyticsTimestampedMetrics>;

export interface MediaAnalytics {
  cta_url_clicks?: number;
  cta_watch_clicks?: number;
  media_key?: string;
  play_from_tap?: number;
  playback25?: number;
  playback50?: number;
  playback75?: number;
  playback_complete?: number;
  playback_start?: number;
  timestamp?: string;
  timestamped_metrics?: MediaAnalyticsTimestampedMetrics;
  video_views?: number;
  watch_time_ms?: number;
}
export const MediaAnalytics = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    cta_url_clicks: S.optional(S.Number),
    cta_watch_clicks: S.optional(S.Number),
    media_key: S.optional(S.String),
    play_from_tap: S.optional(S.Number),
    playback25: S.optional(S.Number),
    playback50: S.optional(S.Number),
    playback75: S.optional(S.Number),
    playback_complete: S.optional(S.Number),
    playback_start: S.optional(S.Number),
    timestamp: S.optional(S.String),
    timestamped_metrics: S.optional(MediaAnalyticsTimestampedMetrics),
    video_views: S.optional(S.Number),
    watch_time_ms: S.optional(S.Number),
  }),
).annotate({ identifier: "MediaAnalytics" }) as any as S.Schema<MediaAnalytics>;

export type GetMediaAnalyticsResponseDataList = Array<MediaAnalytics>;
export const GetMediaAnalyticsResponseDataList = /*@__PURE__*/ S.Array(
  MediaAnalytics,
) as any as S.Schema<GetMediaAnalyticsResponseDataList>;

export type GetMediaAnalyticsResponseErrorsList = Array<Problem>;
export const GetMediaAnalyticsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetMediaAnalyticsResponseErrorsList>;

export interface GetMediaAnalyticsResponse {
  data?: GetMediaAnalyticsResponseDataList;
  errors?: GetMediaAnalyticsResponseErrorsList;
}
export const GetMediaAnalyticsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetMediaAnalyticsResponseDataList),
    errors: S.optional(GetMediaAnalyticsResponseErrorsList),
  }),
).annotate({
  identifier: "GetMediaAnalyticsResponse",
}) as any as S.Schema<GetMediaAnalyticsResponse>;

export type GetMediaByMediaKeyRequestMediaFieldsItem =
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
export const GetMediaByMediaKeyRequestMediaFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Media object. */
export type GetMediaByMediaKeyRequestMediaFieldsList = Array<
  GetMediaByMediaKeyRequestMediaFieldsItem | (string & {})
>;
export const GetMediaByMediaKeyRequestMediaFieldsList = /*@__PURE__*/ S.Array(
  GetMediaByMediaKeyRequestMediaFieldsItem,
) as any as S.Schema<GetMediaByMediaKeyRequestMediaFieldsList>;

export interface GetMediaByMediaKeyRequest {
  media_key: string;
  /** A comma separated list of Media fields to display. */
  media_fields?: GetMediaByMediaKeyRequestMediaFieldsList;
}
export const GetMediaByMediaKeyRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    media_key: S.String.pipe(T.Label()),
    media_fields: S.optional(
      GetMediaByMediaKeyRequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/media/{media_key}", code: 200 })),
).annotate({
  identifier: "GetMediaByMediaKeyRequest",
}) as any as S.Schema<GetMediaByMediaKeyRequest>;

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

export interface Media2 {
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
export const Media2 = /*@__PURE__*/ S.suspend(() =>
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
).annotate({ identifier: "Media2" }) as any as S.Schema<Media2>;

export type GetMediaByMediaKeyResponseErrorsList = Array<Problem>;
export const GetMediaByMediaKeyResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetMediaByMediaKeyResponseErrorsList>;

export interface GetMediaByMediaKeyResponse {
  data?: Media2;
  errors?: GetMediaByMediaKeyResponseErrorsList;
}
export const GetMediaByMediaKeyResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(Media2),
    errors: S.optional(GetMediaByMediaKeyResponseErrorsList),
  }),
).annotate({
  identifier: "GetMediaByMediaKeyResponse",
}) as any as S.Schema<GetMediaByMediaKeyResponse>;

export type GetMediaByMediaKeysRequestMediaKeysList = Array<string>;
export const GetMediaByMediaKeysRequestMediaKeysList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<GetMediaByMediaKeysRequestMediaKeysList>;

export type GetMediaByMediaKeysRequestMediaFieldsItem =
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
export const GetMediaByMediaKeysRequestMediaFieldsItem = /*@__PURE__*/ S.String;

/** The fields available for a Media object. */
export type GetMediaByMediaKeysRequestMediaFieldsList = Array<
  GetMediaByMediaKeysRequestMediaFieldsItem | (string & {})
>;
export const GetMediaByMediaKeysRequestMediaFieldsList = /*@__PURE__*/ S.Array(
  GetMediaByMediaKeysRequestMediaFieldsItem,
) as any as S.Schema<GetMediaByMediaKeysRequestMediaFieldsList>;

export interface GetMediaByMediaKeysRequest {
  media_keys: GetMediaByMediaKeysRequestMediaKeysList;
  /** A comma separated list of Media fields to display. */
  media_fields?: GetMediaByMediaKeysRequestMediaFieldsList;
}
export const GetMediaByMediaKeysRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    media_keys: GetMediaByMediaKeysRequestMediaKeysList.pipe(T.Query()),
    media_fields: S.optional(
      GetMediaByMediaKeysRequestMediaFieldsList.pipe(T.Query("media.fields")),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/media", code: 200 })),
).annotate({
  identifier: "GetMediaByMediaKeysRequest",
}) as any as S.Schema<GetMediaByMediaKeysRequest>;

export type GetMediaByMediaKeysResponseDataList = Array<Media2>;
export const GetMediaByMediaKeysResponseDataList = /*@__PURE__*/ S.Array(
  Media2,
) as any as S.Schema<GetMediaByMediaKeysResponseDataList>;

export type GetMediaByMediaKeysResponseErrorsList = Array<Problem>;
export const GetMediaByMediaKeysResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetMediaByMediaKeysResponseErrorsList>;

export interface GetMediaByMediaKeysResponse {
  data?: GetMediaByMediaKeysResponseDataList;
  errors?: GetMediaByMediaKeysResponseErrorsList;
}
export const GetMediaByMediaKeysResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetMediaByMediaKeysResponseDataList),
    errors: S.optional(GetMediaByMediaKeysResponseErrorsList),
  }),
).annotate({
  identifier: "GetMediaByMediaKeysResponse",
}) as any as S.Schema<GetMediaByMediaKeysResponse>;

export type GetMediaUploadStatusRequestCommand = "STATUS";
export const GetMediaUploadStatusRequestCommand = /*@__PURE__*/ S.String;

export interface GetMediaUploadStatusRequest {
  media_id: string;
  command?: GetMediaUploadStatusRequestCommand | (string & {});
}
export const GetMediaUploadStatusRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    media_id: S.String.pipe(T.Query()),
    command: S.optional(GetMediaUploadStatusRequestCommand.pipe(T.Query())),
  }).pipe(T.Http({ method: "GET", uri: "/2/media/upload", code: 200 })),
).annotate({
  identifier: "GetMediaUploadStatusRequest",
}) as any as S.Schema<GetMediaUploadStatusRequest>;

export type GetMediaUploadStatusResponseDataImage =
  FinalizeMediaUploadResponseDataImage;
export const GetMediaUploadStatusResponseDataImage =
  FinalizeMediaUploadResponseDataImage;

export type GetMediaUploadStatusResponseDataProcessingInfo =
  FinalizeMediaUploadResponseDataProcessingInfo;
export const GetMediaUploadStatusResponseDataProcessingInfo =
  FinalizeMediaUploadResponseDataProcessingInfo;

export type GetMediaUploadStatusResponseDataVideo =
  FinalizeMediaUploadResponseDataVideo;
export const GetMediaUploadStatusResponseDataVideo =
  FinalizeMediaUploadResponseDataVideo;

export type GetMediaUploadStatusResponseData = FinalizeMediaUploadResponseData;
export const GetMediaUploadStatusResponseData = FinalizeMediaUploadResponseData;

export type GetMediaUploadStatusResponseErrorsList = Array<Problem>;
export const GetMediaUploadStatusResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetMediaUploadStatusResponseErrorsList>;

export interface GetMediaUploadStatusResponse {
  data?: FinalizeMediaUploadResponseData;
  errors?: GetMediaUploadStatusResponseErrorsList;
}
export const GetMediaUploadStatusResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(FinalizeMediaUploadResponseData),
    errors: S.optional(GetMediaUploadStatusResponseErrorsList),
  }),
).annotate({
  identifier: "GetMediaUploadStatusResponse",
}) as any as S.Schema<GetMediaUploadStatusResponse>;

/** User ids granted access to the uploaded media. */
export type InitializeMediaUploadRequestAdditionalOwnersList = Array<string>;
export const InitializeMediaUploadRequestAdditionalOwnersList =
  /*@__PURE__*/ S.Array(
    S.String,
  ) as any as S.Schema<InitializeMediaUploadRequestAdditionalOwnersList>;

/** The media category of the upload. */
export type InitializeMediaUploadRequestMediaCategory =
  | "amplify_video"
  | "tweet_gif"
  | "tweet_image"
  | "tweet_video"
  | "dm_gif"
  | "dm_image"
  | "dm_video"
  | "subtitles";
export const InitializeMediaUploadRequestMediaCategory = /*@__PURE__*/ S.String;

/** The type of media. */
export type InitializeMediaUploadRequestMediaType =
  | "video/mp4"
  | "video/webm"
  | "video/mp2t"
  | "video/quicktime"
  | "text/srt"
  | "text/vtt"
  | "image/jpeg"
  | "image/gif"
  | "image/bmp"
  | "image/png"
  | "image/webp"
  | "image/pjpeg"
  | "image/tiff"
  | "model/gltf-binary"
  | "model/vnd.usdz+zip";
export const InitializeMediaUploadRequestMediaType = /*@__PURE__*/ S.String;

export interface InitializeMediaUploadRequest {
  /** User ids granted access to the uploaded media. */
  additional_owners?: InitializeMediaUploadRequestAdditionalOwnersList;
  /** The media category of the upload. */
  media_category?: InitializeMediaUploadRequestMediaCategory | (string & {});
  /** The type of media. */
  media_type?: InitializeMediaUploadRequestMediaType | (string & {});
  /** Whether this media is shared or not. */
  shared?: boolean;
  /** The total size of the media upload in bytes. */
  total_bytes?: number;
}
export const InitializeMediaUploadRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    additional_owners: S.optional(
      InitializeMediaUploadRequestAdditionalOwnersList,
    ),
    media_category: S.optional(InitializeMediaUploadRequestMediaCategory),
    media_type: S.optional(InitializeMediaUploadRequestMediaType),
    shared: S.optional(S.Boolean),
    total_bytes: S.optional(S.Number),
  }).pipe(
    T.Http({ method: "POST", uri: "/2/media/upload/initialize", code: 200 }),
  ),
).annotate({
  identifier: "InitializeMediaUploadRequest",
}) as any as S.Schema<InitializeMediaUploadRequest>;

export interface InitializeMediaUploadResponseData {
  /** Seconds until the upload session expires. */
  expires_after_secs?: number;
  /** Unique identifier of the upload session. */
  id: string;
  /** The media key for the uploaded media. */
  media_key?: string;
}
export const InitializeMediaUploadResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    expires_after_secs: S.optional(S.Number),
    id: S.String,
    media_key: S.optional(S.String),
  }),
).annotate({
  identifier: "InitializeMediaUploadResponseData",
}) as any as S.Schema<InitializeMediaUploadResponseData>;

export type InitializeMediaUploadResponseErrorsList = Array<Problem>;
export const InitializeMediaUploadResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<InitializeMediaUploadResponseErrorsList>;

export interface InitializeMediaUploadResponse {
  data?: InitializeMediaUploadResponseData;
  errors?: InitializeMediaUploadResponseErrorsList;
}
export const InitializeMediaUploadResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(InitializeMediaUploadResponseData),
    errors: S.optional(InitializeMediaUploadResponseErrorsList),
  }),
).annotate({
  identifier: "InitializeMediaUploadResponse",
}) as any as S.Schema<InitializeMediaUploadResponse>;

/** The category of the media being uploaded. */
export type MediaUploadRequestMediaCategory =
  | "tweet_image"
  | "tweet_video"
  | "tweet_gif"
  | "dm_image"
  | "dm_video"
  | "dm_gif"
  | "subtitles";
export const MediaUploadRequestMediaCategory = /*@__PURE__*/ S.String;

export interface MediaUploadRequest {
  /** Comma-separated list of user IDs who can use this media. */
  additional_owners?: string;
  /** The media file to upload: base64-encoded in JSON bodies, raw bytes in multipart bodies. */
  media: MediaData;
  /** The category of the media being uploaded. */
  media_category: MediaUploadRequestMediaCategory | (string & {});
}
export const MediaUploadRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    additional_owners: S.optional(S.String),
    media: MediaData,
    media_category: MediaUploadRequestMediaCategory,
  }).pipe(T.Http({ method: "POST", uri: "/2/media/upload", code: 200 })),
).annotate({
  identifier: "MediaUploadRequest",
}) as any as S.Schema<MediaUploadRequest>;

export type MediaUploadResponseDataImage = FinalizeMediaUploadResponseDataImage;
export const MediaUploadResponseDataImage =
  FinalizeMediaUploadResponseDataImage;

export type MediaUploadResponseDataProcessingInfo =
  FinalizeMediaUploadResponseDataProcessingInfo;
export const MediaUploadResponseDataProcessingInfo =
  FinalizeMediaUploadResponseDataProcessingInfo;

export type MediaUploadResponseDataVideo = FinalizeMediaUploadResponseDataVideo;
export const MediaUploadResponseDataVideo =
  FinalizeMediaUploadResponseDataVideo;

export type MediaUploadResponseData = FinalizeMediaUploadResponseData;
export const MediaUploadResponseData = FinalizeMediaUploadResponseData;

export type MediaUploadResponseErrorsList = Array<Problem>;
export const MediaUploadResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<MediaUploadResponseErrorsList>;

export interface MediaUploadResponse {
  data?: FinalizeMediaUploadResponseData;
  errors?: MediaUploadResponseErrorsList;
}
export const MediaUploadResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(FinalizeMediaUploadResponseData),
    errors: S.optional(MediaUploadResponseErrorsList),
  }),
).annotate({
  identifier: "MediaUploadResponse",
}) as any as S.Schema<MediaUploadResponse>;

export const appendMediaUpload = /*@__PURE__*/ makeOperation<
  AppendMediaUploadRequest,
  AppendMediaUploadResponse
>(
  operations.appendMediaUpload,
  () => AppendMediaUploadRequest,
  () => AppendMediaUploadResponse,
);

export const createMediaMetadata = /*@__PURE__*/ makeOperation<
  CreateMediaMetadataRequest,
  CreateMediaMetadataResponse
>(
  operations.createMediaMetadata,
  () => CreateMediaMetadataRequest,
  () => CreateMediaMetadataResponse,
);

export const createMediaSubtitles = /*@__PURE__*/ makeOperation<
  CreateMediaSubtitlesRequest,
  CreateMediaSubtitlesResponse
>(
  operations.createMediaSubtitles,
  () => CreateMediaSubtitlesRequest,
  () => CreateMediaSubtitlesResponse,
);

export const deleteMediaSubtitles = /*@__PURE__*/ makeOperation<
  DeleteMediaSubtitlesRequest,
  DeleteMediaSubtitlesResponse
>(
  operations.deleteMediaSubtitles,
  () => DeleteMediaSubtitlesRequest,
  () => DeleteMediaSubtitlesResponse,
);

export const finalizeMediaUpload = /*@__PURE__*/ makeOperation<
  FinalizeMediaUploadRequest,
  FinalizeMediaUploadResponse
>(
  operations.finalizeMediaUpload,
  () => FinalizeMediaUploadRequest,
  () => FinalizeMediaUploadResponse,
);

export const getMediaAnalytics = /*@__PURE__*/ makeOperation<
  GetMediaAnalyticsRequest,
  GetMediaAnalyticsResponse
>(
  operations.getMediaAnalytics,
  () => GetMediaAnalyticsRequest,
  () => GetMediaAnalyticsResponse,
);

export const getMediaByMediaKey = /*@__PURE__*/ makeOperation<
  GetMediaByMediaKeyRequest,
  GetMediaByMediaKeyResponse
>(
  operations.getMediaByMediaKey,
  () => GetMediaByMediaKeyRequest,
  () => GetMediaByMediaKeyResponse,
);

export const getMediaByMediaKeys = /*@__PURE__*/ makeOperation<
  GetMediaByMediaKeysRequest,
  GetMediaByMediaKeysResponse
>(
  operations.getMediaByMediaKeys,
  () => GetMediaByMediaKeysRequest,
  () => GetMediaByMediaKeysResponse,
);

export const getMediaUploadStatus = /*@__PURE__*/ makeOperation<
  GetMediaUploadStatusRequest,
  GetMediaUploadStatusResponse
>(
  operations.getMediaUploadStatus,
  () => GetMediaUploadStatusRequest,
  () => GetMediaUploadStatusResponse,
);

export const initializeMediaUpload = /*@__PURE__*/ makeOperation<
  InitializeMediaUploadRequest,
  InitializeMediaUploadResponse
>(
  operations.initializeMediaUpload,
  () => InitializeMediaUploadRequest,
  () => InitializeMediaUploadResponse,
);

export const mediaUpload = /*@__PURE__*/ makeOperation<
  MediaUploadRequest,
  MediaUploadResponse
>(
  operations.mediaUpload,
  () => MediaUploadRequest,
  () => MediaUploadResponse,
);
