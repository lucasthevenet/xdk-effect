// AUTO-GENERATED from xdevplatform/xdk@84c26540df30c0b798e50e34151c56d5d262ba1c; do not edit.
import * as S from "@distilled.cloud/core/schema";
import * as T from "../traits.ts";
import {
  makeOperation,
  makeBinaryOperation,
  makeStreamOperation,
} from "../operation.ts";
import { operations } from "../operations.ts";
export interface BlockUsersDmsRequest {
  id: string;
}
export const BlockUsersDmsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
  }).pipe(T.Http({ method: "POST", uri: "/2/users/{id}/dm/block", code: 200 })),
).annotate({
  identifier: "BlockUsersDmsRequest",
}) as any as S.Schema<BlockUsersDmsRequest>;

export interface BlockUsersDmsResponseData {
  /** Indicates whether the target user is DM-blocked. */
  blocked: boolean;
}
export const BlockUsersDmsResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    blocked: S.Boolean,
  }),
).annotate({
  identifier: "BlockUsersDmsResponseData",
}) as any as S.Schema<BlockUsersDmsResponseData>;

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
export type BlockUsersDmsResponseErrorsList = Array<Problem>;
export const BlockUsersDmsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<BlockUsersDmsResponseErrorsList>;

export interface BlockUsersDmsResponse {
  data?: BlockUsersDmsResponseData;
  errors?: BlockUsersDmsResponseErrorsList;
}
export const BlockUsersDmsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(BlockUsersDmsResponseData),
    errors: S.optional(BlockUsersDmsResponseErrorsList),
  }),
).annotate({
  identifier: "BlockUsersDmsResponse",
}) as any as S.Schema<BlockUsersDmsResponse>;

export interface CreateDirectMessagesByConversationIdAttachments {
  /** A media id to attach to the message. */
  media_id: string;
}
export const CreateDirectMessagesByConversationIdAttachments =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      media_id: S.String,
    }),
  ).annotate({
    identifier: "CreateDirectMessagesByConversationIdAttachments",
  }) as any as S.Schema<CreateDirectMessagesByConversationIdAttachments>;

/** Attachments to include with the message. */
export type CreateDirectMessagesByConversationIdRequestAttachmentsList =
  Array<CreateDirectMessagesByConversationIdAttachments>;
export const CreateDirectMessagesByConversationIdRequestAttachmentsList =
  /*@__PURE__*/ S.Array(
    CreateDirectMessagesByConversationIdAttachments,
  ) as any as S.Schema<CreateDirectMessagesByConversationIdRequestAttachmentsList>;

export interface CreateDirectMessagesByConversationIdRequest {
  dm_conversation_id: string;
  /** Attachments to include with the message. */
  attachments?: CreateDirectMessagesByConversationIdRequestAttachmentsList;
  /** Text of the Direct Message. */
  text?: string;
}
export const CreateDirectMessagesByConversationIdRequest =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      dm_conversation_id: S.String.pipe(T.Label()),
      attachments: S.optional(
        CreateDirectMessagesByConversationIdRequestAttachmentsList,
      ),
      text: S.optional(S.String),
    }).pipe(
      T.Http({
        method: "POST",
        uri: "/2/dm_conversations/{dm_conversation_id}/messages",
        code: 200,
      }),
    ),
  ).annotate({
    identifier: "CreateDirectMessagesByConversationIdRequest",
  }) as any as S.Schema<CreateDirectMessagesByConversationIdRequest>;

export interface CreateDirectMessagesByConversationIdResponseData {
  /** The conversation the message was sent to. */
  dm_conversation_id: string;
  /** The id of the created DM event. */
  dm_event_id: string;
}
export const CreateDirectMessagesByConversationIdResponseData =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      dm_conversation_id: S.String,
      dm_event_id: S.String,
    }),
  ).annotate({
    identifier: "CreateDirectMessagesByConversationIdResponseData",
  }) as any as S.Schema<CreateDirectMessagesByConversationIdResponseData>;

export type CreateDirectMessagesByConversationIdResponseErrorsList =
  Array<Problem>;
export const CreateDirectMessagesByConversationIdResponseErrorsList =
  /*@__PURE__*/ S.Array(
    Problem,
  ) as any as S.Schema<CreateDirectMessagesByConversationIdResponseErrorsList>;

export interface CreateDirectMessagesByConversationIdResponse {
  data?: CreateDirectMessagesByConversationIdResponseData;
  errors?: CreateDirectMessagesByConversationIdResponseErrorsList;
}
export const CreateDirectMessagesByConversationIdResponse =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      data: S.optional(CreateDirectMessagesByConversationIdResponseData),
      errors: S.optional(
        CreateDirectMessagesByConversationIdResponseErrorsList,
      ),
    }),
  ).annotate({
    identifier: "CreateDirectMessagesByConversationIdResponse",
  }) as any as S.Schema<CreateDirectMessagesByConversationIdResponse>;

export type CreateDirectMessagesByParticipantIdAttachments =
  CreateDirectMessagesByConversationIdAttachments;
export const CreateDirectMessagesByParticipantIdAttachments =
  CreateDirectMessagesByConversationIdAttachments;

/** Attachments to include with the message. */
export type CreateDirectMessagesByParticipantIdRequestAttachmentsList =
  Array<CreateDirectMessagesByConversationIdAttachments>;
export const CreateDirectMessagesByParticipantIdRequestAttachmentsList =
  /*@__PURE__*/ S.Array(
    CreateDirectMessagesByConversationIdAttachments,
  ) as any as S.Schema<CreateDirectMessagesByParticipantIdRequestAttachmentsList>;

export interface CreateDirectMessagesByParticipantIdRequest {
  participant_id: string;
  /** Attachments to include with the message. */
  attachments?: CreateDirectMessagesByParticipantIdRequestAttachmentsList;
  /** Text of the Direct Message. */
  text?: string;
}
export const CreateDirectMessagesByParticipantIdRequest =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      participant_id: S.String.pipe(T.Label()),
      attachments: S.optional(
        CreateDirectMessagesByParticipantIdRequestAttachmentsList,
      ),
      text: S.optional(S.String),
    }).pipe(
      T.Http({
        method: "POST",
        uri: "/2/dm_conversations/with/{participant_id}/messages",
        code: 200,
      }),
    ),
  ).annotate({
    identifier: "CreateDirectMessagesByParticipantIdRequest",
  }) as any as S.Schema<CreateDirectMessagesByParticipantIdRequest>;

export type CreateDirectMessagesByParticipantIdResponseData =
  CreateDirectMessagesByConversationIdResponseData;
export const CreateDirectMessagesByParticipantIdResponseData =
  CreateDirectMessagesByConversationIdResponseData;

export type CreateDirectMessagesByParticipantIdResponseErrorsList =
  Array<Problem>;
export const CreateDirectMessagesByParticipantIdResponseErrorsList =
  /*@__PURE__*/ S.Array(
    Problem,
  ) as any as S.Schema<CreateDirectMessagesByParticipantIdResponseErrorsList>;

export interface CreateDirectMessagesByParticipantIdResponse {
  data?: CreateDirectMessagesByConversationIdResponseData;
  errors?: CreateDirectMessagesByParticipantIdResponseErrorsList;
}
export const CreateDirectMessagesByParticipantIdResponse =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      data: S.optional(CreateDirectMessagesByConversationIdResponseData),
      errors: S.optional(CreateDirectMessagesByParticipantIdResponseErrorsList),
    }),
  ).annotate({
    identifier: "CreateDirectMessagesByParticipantIdResponse",
  }) as any as S.Schema<CreateDirectMessagesByParticipantIdResponse>;

/** The conversation type to create. Supports `Group` only. */
export type CreateDirectMessagesConversationRequestConversationType = "Group";
export const CreateDirectMessagesConversationRequestConversationType =
  /*@__PURE__*/ S.String;

export type CreateDirectMessagesConversationMessageAttachments =
  CreateDirectMessagesByConversationIdAttachments;
export const CreateDirectMessagesConversationMessageAttachments =
  CreateDirectMessagesByConversationIdAttachments;

/** Attachments to include with the message. */
export type CreateDirectMessagesConversationMessageAttachmentsList =
  Array<CreateDirectMessagesByConversationIdAttachments>;
export const CreateDirectMessagesConversationMessageAttachmentsList =
  /*@__PURE__*/ S.Array(
    CreateDirectMessagesByConversationIdAttachments,
  ) as any as S.Schema<CreateDirectMessagesConversationMessageAttachmentsList>;

export interface CreateDirectMessagesConversationMessage {
  /** Attachments to include with the message. */
  attachments?: CreateDirectMessagesConversationMessageAttachmentsList;
  /** Text of the Direct Message. */
  text?: string;
}
export const CreateDirectMessagesConversationMessage = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      attachments: S.optional(
        CreateDirectMessagesConversationMessageAttachmentsList,
      ),
      text: S.optional(S.String),
    }),
).annotate({
  identifier: "CreateDirectMessagesConversationMessage",
}) as any as S.Schema<CreateDirectMessagesConversationMessage>;

/** Participants for the conversation. */
export type CreateDirectMessagesConversationRequestParticipantIdsList =
  Array<string>;
export const CreateDirectMessagesConversationRequestParticipantIdsList =
  /*@__PURE__*/ S.Array(
    S.String,
  ) as any as S.Schema<CreateDirectMessagesConversationRequestParticipantIdsList>;

export interface CreateDirectMessagesConversationRequest {
  /** The conversation type to create. Supports `Group` only. */
  conversation_type:
    | CreateDirectMessagesConversationRequestConversationType
    | (string & {});
  /** The initial Direct Message to send to the conversation. */
  message: CreateDirectMessagesConversationMessage;
  /** Participants for the conversation. */
  participant_ids: CreateDirectMessagesConversationRequestParticipantIdsList;
}
export const CreateDirectMessagesConversationRequest = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      conversation_type:
        CreateDirectMessagesConversationRequestConversationType,
      message: CreateDirectMessagesConversationMessage,
      participant_ids:
        CreateDirectMessagesConversationRequestParticipantIdsList,
    }).pipe(T.Http({ method: "POST", uri: "/2/dm_conversations", code: 200 })),
).annotate({
  identifier: "CreateDirectMessagesConversationRequest",
}) as any as S.Schema<CreateDirectMessagesConversationRequest>;

export interface CreateDirectMessagesConversationResponseData {
  /** The id of the created conversation. */
  dm_conversation_id: string;
  /** The id of the created DM event. */
  dm_event_id: string;
}
export const CreateDirectMessagesConversationResponseData =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      dm_conversation_id: S.String,
      dm_event_id: S.String,
    }),
  ).annotate({
    identifier: "CreateDirectMessagesConversationResponseData",
  }) as any as S.Schema<CreateDirectMessagesConversationResponseData>;

export type CreateDirectMessagesConversationResponseErrorsList = Array<Problem>;
export const CreateDirectMessagesConversationResponseErrorsList =
  /*@__PURE__*/ S.Array(
    Problem,
  ) as any as S.Schema<CreateDirectMessagesConversationResponseErrorsList>;

export interface CreateDirectMessagesConversationResponse {
  data?: CreateDirectMessagesConversationResponseData;
  errors?: CreateDirectMessagesConversationResponseErrorsList;
}
export const CreateDirectMessagesConversationResponse = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      data: S.optional(CreateDirectMessagesConversationResponseData),
      errors: S.optional(CreateDirectMessagesConversationResponseErrorsList),
    }),
).annotate({
  identifier: "CreateDirectMessagesConversationResponse",
}) as any as S.Schema<CreateDirectMessagesConversationResponse>;

export interface DeleteDirectMessagesEventsRequest {
  event_id: string;
}
export const DeleteDirectMessagesEventsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    event_id: S.String.pipe(T.Label()),
  }).pipe(
    T.Http({ method: "DELETE", uri: "/2/dm_events/{event_id}", code: 200 }),
  ),
).annotate({
  identifier: "DeleteDirectMessagesEventsRequest",
}) as any as S.Schema<DeleteDirectMessagesEventsRequest>;

export interface DeleteDirectMessagesEventsResponseData {
  /** Whether the event was deleted. */
  deleted: boolean;
}
export const DeleteDirectMessagesEventsResponseData = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      deleted: S.Boolean,
    }),
).annotate({
  identifier: "DeleteDirectMessagesEventsResponseData",
}) as any as S.Schema<DeleteDirectMessagesEventsResponseData>;

export type DeleteDirectMessagesEventsResponseErrorsList = Array<Problem>;
export const DeleteDirectMessagesEventsResponseErrorsList =
  /*@__PURE__*/ S.Array(
    Problem,
  ) as any as S.Schema<DeleteDirectMessagesEventsResponseErrorsList>;

export interface DeleteDirectMessagesEventsResponse {
  data?: DeleteDirectMessagesEventsResponseData;
  errors?: DeleteDirectMessagesEventsResponseErrorsList;
}
export const DeleteDirectMessagesEventsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(DeleteDirectMessagesEventsResponseData),
    errors: S.optional(DeleteDirectMessagesEventsResponseErrorsList),
  }),
).annotate({
  identifier: "DeleteDirectMessagesEventsResponse",
}) as any as S.Schema<DeleteDirectMessagesEventsResponse>;

export interface DmConversationsMediaDownloadRequest {
  dm_id: string;
  media_id: string;
  resource_id: string;
}
export const DmConversationsMediaDownloadRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    dm_id: S.String.pipe(T.Label()),
    media_id: S.String.pipe(T.Label()),
    resource_id: S.String.pipe(T.Label()),
  }).pipe(
    T.Http({
      method: "GET",
      uri: "/2/dm_conversations/media/{dm_id}/{media_id}/{resource_id}",
      code: 200,
    }),
  ),
).annotate({
  identifier: "DmConversationsMediaDownloadRequest",
}) as any as S.Schema<DmConversationsMediaDownloadRequest>;

export type DmConversationsMediaDownloadResponse = Uint8Array;
export const DmConversationsMediaDownloadResponse = S.instanceOf(Uint8Array);
export type GetDirectMessagesEventsRequestEventTypesItem =
  | "MessageCreate"
  | "ParticipantsJoin"
  | "ParticipantsLeave";
export const GetDirectMessagesEventsRequestEventTypesItem =
  /*@__PURE__*/ S.String;

export type GetDirectMessagesEventsRequestEventTypesList = Array<
  GetDirectMessagesEventsRequestEventTypesItem | (string & {})
>;
export const GetDirectMessagesEventsRequestEventTypesList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsRequestEventTypesItem,
  ) as any as S.Schema<GetDirectMessagesEventsRequestEventTypesList>;

export type GetDirectMessagesEventsRequestDmEventFieldsItem =
  | "attachments"
  | "created_at"
  | "dm_conversation_id"
  | "entities"
  | "event_type"
  | "id"
  | "text";
export const GetDirectMessagesEventsRequestDmEventFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a DmEvent object. */
export type GetDirectMessagesEventsRequestDmEventFieldsList = Array<
  GetDirectMessagesEventsRequestDmEventFieldsItem | (string & {})
>;
export const GetDirectMessagesEventsRequestDmEventFieldsList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsRequestDmEventFieldsItem,
  ) as any as S.Schema<GetDirectMessagesEventsRequestDmEventFieldsList>;

export type GetDirectMessagesEventsRequestExpansionsItem =
  | "attachments.media_keys"
  | "attachments.media_keys"
  | "participant_ids"
  | "referenced_posts"
  | "sender_id";
export const GetDirectMessagesEventsRequestExpansionsItem =
  /*@__PURE__*/ S.String;

export type GetDirectMessagesEventsRequestExpansionsList = Array<
  GetDirectMessagesEventsRequestExpansionsItem | (string & {})
>;
export const GetDirectMessagesEventsRequestExpansionsList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsRequestExpansionsItem,
  ) as any as S.Schema<GetDirectMessagesEventsRequestExpansionsList>;

export type GetDirectMessagesEventsRequestUserFieldsItem =
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
export const GetDirectMessagesEventsRequestUserFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetDirectMessagesEventsRequestUserFieldsList = Array<
  GetDirectMessagesEventsRequestUserFieldsItem | (string & {})
>;
export const GetDirectMessagesEventsRequestUserFieldsList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsRequestUserFieldsItem,
  ) as any as S.Schema<GetDirectMessagesEventsRequestUserFieldsList>;

export type GetDirectMessagesEventsRequestPostFieldsItem =
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
export const GetDirectMessagesEventsRequestPostFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetDirectMessagesEventsRequestPostFieldsList = Array<
  GetDirectMessagesEventsRequestPostFieldsItem | (string & {})
>;
export const GetDirectMessagesEventsRequestPostFieldsList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsRequestPostFieldsItem,
  ) as any as S.Schema<GetDirectMessagesEventsRequestPostFieldsList>;

export type GetDirectMessagesEventsRequestMediaFieldsItem =
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
export const GetDirectMessagesEventsRequestMediaFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a Media object. */
export type GetDirectMessagesEventsRequestMediaFieldsList = Array<
  GetDirectMessagesEventsRequestMediaFieldsItem | (string & {})
>;
export const GetDirectMessagesEventsRequestMediaFieldsList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsRequestMediaFieldsItem,
  ) as any as S.Schema<GetDirectMessagesEventsRequestMediaFieldsList>;

export interface GetDirectMessagesEventsRequest {
  max_results?: number;
  /** A base32hex-encoded pagination token. */
  pagination_token?: string;
  event_types?: GetDirectMessagesEventsRequestEventTypesList;
  /** A comma separated list of DmEvent fields to display. */
  dm_event_fields?: GetDirectMessagesEventsRequestDmEventFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetDirectMessagesEventsRequestExpansionsList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetDirectMessagesEventsRequestUserFieldsList;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetDirectMessagesEventsRequestPostFieldsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: GetDirectMessagesEventsRequestMediaFieldsList;
}
export const GetDirectMessagesEventsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    max_results: S.optional(S.Number.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
    event_types: S.optional(
      GetDirectMessagesEventsRequestEventTypesList.pipe(T.Query()),
    ),
    dm_event_fields: S.optional(
      GetDirectMessagesEventsRequestDmEventFieldsList.pipe(
        T.Query("dm_event.fields"),
      ),
    ),
    expansions: S.optional(
      GetDirectMessagesEventsRequestExpansionsList.pipe(T.Query()),
    ),
    user_fields: S.optional(
      GetDirectMessagesEventsRequestUserFieldsList.pipe(T.Query("user.fields")),
    ),
    post_fields: S.optional(
      GetDirectMessagesEventsRequestPostFieldsList.pipe(T.Query("post.fields")),
    ),
    media_fields: S.optional(
      GetDirectMessagesEventsRequestMediaFieldsList.pipe(
        T.Query("media.fields"),
      ),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/dm_events", code: 200 })),
).annotate({
  identifier: "GetDirectMessagesEventsRequest",
}) as any as S.Schema<GetDirectMessagesEventsRequest>;

/** IDs of cards attached to this Direct Message. */
export type DmEventAttachmentsCardIdsList = Array<string>;
export const DmEventAttachmentsCardIdsList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<DmEventAttachmentsCardIdsList>;

/** Media keys of media (including audio) attached to this Direct Message. */
export type DmEventAttachmentsMediaKeysList = Array<string>;
export const DmEventAttachmentsMediaKeysList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<DmEventAttachmentsMediaKeysList>;

/** Media and card attachments present in this Direct Message event. */
export interface DmEventAttachments {
  /** IDs of cards attached to this Direct Message. */
  card_ids?: DmEventAttachmentsCardIdsList | null;
  /** Media keys of media (including audio) attached to this Direct Message. */
  media_keys?: DmEventAttachmentsMediaKeysList | null;
}
export const DmEventAttachments = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    card_ids: S.optional(S.NullOr(DmEventAttachmentsCardIdsList)),
    media_keys: S.optional(S.NullOr(DmEventAttachmentsMediaKeysList)),
  }),
).annotate({
  identifier: "DmEventAttachments",
}) as any as S.Schema<DmEventAttachments>;

/** A hashtag or cashtag entity. */
export interface DmEventEntitiesCashtagsItem {
  /** End index in the text (exclusive). */
  end: number;
  /** Start index in the text (inclusive). */
  start: number;
  tag: string;
}
export const DmEventEntitiesCashtagsItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    end: S.Number,
    start: S.Number,
    tag: S.String,
  }),
).annotate({
  identifier: "DmEventEntitiesCashtagsItem",
}) as any as S.Schema<DmEventEntitiesCashtagsItem>;

export type DmEventEntitiesCashtagsList = Array<DmEventEntitiesCashtagsItem>;
export const DmEventEntitiesCashtagsList = /*@__PURE__*/ S.Array(
  DmEventEntitiesCashtagsItem,
) as any as S.Schema<DmEventEntitiesCashtagsList>;

/** A hashtag or cashtag entity. */
export type DmEventEntitiesHashtagsItem = DmEventEntitiesCashtagsItem;
export const DmEventEntitiesHashtagsItem = DmEventEntitiesCashtagsItem;

export type DmEventEntitiesHashtagsList = Array<DmEventEntitiesCashtagsItem>;
export const DmEventEntitiesHashtagsList = /*@__PURE__*/ S.Array(
  DmEventEntitiesCashtagsItem,
) as any as S.Schema<DmEventEntitiesHashtagsList>;

/** A user mention entity. */
export interface DmEventEntitiesMentionsItem {
  end: number;
  id?: string | null;
  start: number;
  username: string;
}
export const DmEventEntitiesMentionsItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    end: S.Number,
    id: S.optional(S.NullOr(S.String)),
    start: S.Number,
    username: S.String,
  }),
).annotate({
  identifier: "DmEventEntitiesMentionsItem",
}) as any as S.Schema<DmEventEntitiesMentionsItem>;

export type DmEventEntitiesMentionsList = Array<DmEventEntitiesMentionsItem>;
export const DmEventEntitiesMentionsList = /*@__PURE__*/ S.Array(
  DmEventEntitiesMentionsItem,
) as any as S.Schema<DmEventEntitiesMentionsList>;

/** A URL entity. */
export interface DmEventEntitiesUrlsItem {
  /** The URL as displayed in the Direct Message text. */
  display_url?: string | null;
  end: number;
  /** The fully resolved URL. */
  expanded_url?: string | null;
  start: number;
  /** The t.co shortened URL. */
  url: string;
}
export const DmEventEntitiesUrlsItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    display_url: S.optional(S.NullOr(S.String)),
    end: S.Number,
    expanded_url: S.optional(S.NullOr(S.String)),
    start: S.Number,
    url: S.String,
  }),
).annotate({
  identifier: "DmEventEntitiesUrlsItem",
}) as any as S.Schema<DmEventEntitiesUrlsItem>;

export type DmEventEntitiesUrlsList = Array<DmEventEntitiesUrlsItem>;
export const DmEventEntitiesUrlsList = /*@__PURE__*/ S.Array(
  DmEventEntitiesUrlsItem,
) as any as S.Schema<DmEventEntitiesUrlsList>;

/** A list of metadata entities (hashtags, cashtags, mentions, URLs) found in the Direct Message text. */
export interface DmEventEntities {
  cashtags?: DmEventEntitiesCashtagsList | null;
  hashtags?: DmEventEntitiesHashtagsList | null;
  mentions?: DmEventEntitiesMentionsList | null;
  urls?: DmEventEntitiesUrlsList | null;
}
export const DmEventEntities = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    cashtags: S.optional(S.NullOr(DmEventEntitiesCashtagsList)),
    hashtags: S.optional(S.NullOr(DmEventEntitiesHashtagsList)),
    mentions: S.optional(S.NullOr(DmEventEntitiesMentionsList)),
    urls: S.optional(S.NullOr(DmEventEntitiesUrlsList)),
  }),
).annotate({
  identifier: "DmEventEntities",
}) as any as S.Schema<DmEventEntities>;

export type DmEventParticipantIdsList = Array<string>;
export const DmEventParticipantIdsList = /*@__PURE__*/ S.Array(
  S.String,
) as any as S.Schema<DmEventParticipantIdsList>;

/** A reference from this event to a Post. */
export interface DmEventReferencedPostsItem {
  /** Unique identifier of the referenced Post. */
  id: string;
}
export const DmEventReferencedPostsItem = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String,
  }),
).annotate({
  identifier: "DmEventReferencedPostsItem",
}) as any as S.Schema<DmEventReferencedPostsItem>;

export type DmEventReferencedPosts = Array<DmEventReferencedPostsItem>;
export const DmEventReferencedPosts = /*@__PURE__*/ S.Array(
  DmEventReferencedPostsItem,
) as any as S.Schema<DmEventReferencedPosts>;

export interface DmEvent {
  attachments?: DmEventAttachments;
  created_at?: string;
  dm_conversation_id?: string;
  entities?: DmEventEntities;
  event_type?: string;
  id?: string;
  participant_ids?: DmEventParticipantIdsList;
  referenced_posts?: DmEventReferencedPosts;
  sender_id?: string;
  text?: string;
}
export const DmEvent = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    attachments: S.optional(DmEventAttachments),
    created_at: S.optional(S.String),
    dm_conversation_id: S.optional(S.String),
    entities: S.optional(DmEventEntities),
    event_type: S.optional(S.String),
    id: S.optional(S.String),
    participant_ids: S.optional(DmEventParticipantIdsList),
    referenced_posts: S.optional(DmEventReferencedPosts),
    sender_id: S.optional(S.String),
    text: S.optional(S.String),
  }),
).annotate({ identifier: "DmEvent" }) as any as S.Schema<DmEvent>;

export type GetDirectMessagesEventsResponseDataList = Array<DmEvent>;
export const GetDirectMessagesEventsResponseDataList = /*@__PURE__*/ S.Array(
  DmEvent,
) as any as S.Schema<GetDirectMessagesEventsResponseDataList>;

export type GetDirectMessagesEventsResponseErrorsList = Array<Problem>;
export const GetDirectMessagesEventsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetDirectMessagesEventsResponseErrorsList>;

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
export type PostEntitiesCashtagsItem = DmEventEntitiesCashtagsItem;
export const PostEntitiesCashtagsItem = DmEventEntitiesCashtagsItem;

export type PostEntitiesCashtagsList = Array<DmEventEntitiesCashtagsItem>;
export const PostEntitiesCashtagsList = /*@__PURE__*/ S.Array(
  DmEventEntitiesCashtagsItem,
) as any as S.Schema<PostEntitiesCashtagsList>;

/** A hashtag or cashtag entity. */
export type PostEntitiesHashtagsItem = DmEventEntitiesCashtagsItem;
export const PostEntitiesHashtagsItem = DmEventEntitiesCashtagsItem;

export type PostEntitiesHashtagsList = Array<DmEventEntitiesCashtagsItem>;
export const PostEntitiesHashtagsList = /*@__PURE__*/ S.Array(
  DmEventEntitiesCashtagsItem,
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
export type PostNotePostEntitiesCashtagsItem = DmEventEntitiesCashtagsItem;
export const PostNotePostEntitiesCashtagsItem = DmEventEntitiesCashtagsItem;

export type PostNotePostEntitiesCashtagsList =
  Array<DmEventEntitiesCashtagsItem>;
export const PostNotePostEntitiesCashtagsList = /*@__PURE__*/ S.Array(
  DmEventEntitiesCashtagsItem,
) as any as S.Schema<PostNotePostEntitiesCashtagsList>;

/** A hashtag or cashtag entity. */
export type PostNotePostEntitiesHashtagsItem = DmEventEntitiesCashtagsItem;
export const PostNotePostEntitiesHashtagsItem = DmEventEntitiesCashtagsItem;

export type PostNotePostEntitiesHashtagsList =
  Array<DmEventEntitiesCashtagsItem>;
export const PostNotePostEntitiesHashtagsList = /*@__PURE__*/ S.Array(
  DmEventEntitiesCashtagsItem,
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
export type UserEntitiesDescriptionCashtagsItem = DmEventEntitiesCashtagsItem;
export const UserEntitiesDescriptionCashtagsItem = DmEventEntitiesCashtagsItem;

export type UserEntitiesDescriptionCashtagsList =
  Array<DmEventEntitiesCashtagsItem>;
export const UserEntitiesDescriptionCashtagsList = /*@__PURE__*/ S.Array(
  DmEventEntitiesCashtagsItem,
) as any as S.Schema<UserEntitiesDescriptionCashtagsList>;

/** A hashtag or cashtag entity. */
export type UserEntitiesDescriptionHashtagsItem = DmEventEntitiesCashtagsItem;
export const UserEntitiesDescriptionHashtagsItem = DmEventEntitiesCashtagsItem;

export type UserEntitiesDescriptionHashtagsList =
  Array<DmEventEntitiesCashtagsItem>;
export const UserEntitiesDescriptionHashtagsList = /*@__PURE__*/ S.Array(
  DmEventEntitiesCashtagsItem,
) as any as S.Schema<UserEntitiesDescriptionHashtagsList>;

/** A user mention entity. */
export type UserEntitiesDescriptionMentionsItem = DmEventEntitiesMentionsItem;
export const UserEntitiesDescriptionMentionsItem = DmEventEntitiesMentionsItem;

export type UserEntitiesDescriptionMentionsList =
  Array<DmEventEntitiesMentionsItem>;
export const UserEntitiesDescriptionMentionsList = /*@__PURE__*/ S.Array(
  DmEventEntitiesMentionsItem,
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

export interface GetDirectMessagesEventsResponseMeta {
  /** Pagination token for the next page of results. */
  next_token?: string;
  /** Pagination token for the previous page of results. */
  previous_token?: string;
  /** Number of items in the data array. */
  result_count?: number;
}
export const GetDirectMessagesEventsResponseMeta = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    next_token: S.optional(S.String),
    previous_token: S.optional(S.String),
    result_count: S.optional(S.Number),
  }),
).annotate({
  identifier: "GetDirectMessagesEventsResponseMeta",
}) as any as S.Schema<GetDirectMessagesEventsResponseMeta>;

export interface GetDirectMessagesEventsResponse {
  data?: GetDirectMessagesEventsResponseDataList;
  errors?: GetDirectMessagesEventsResponseErrorsList;
  includes?: Expansions;
  meta?: GetDirectMessagesEventsResponseMeta;
}
export const GetDirectMessagesEventsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(GetDirectMessagesEventsResponseDataList),
    errors: S.optional(GetDirectMessagesEventsResponseErrorsList),
    includes: S.optional(Expansions),
    meta: S.optional(GetDirectMessagesEventsResponseMeta),
  }),
).annotate({
  identifier: "GetDirectMessagesEventsResponse",
}) as any as S.Schema<GetDirectMessagesEventsResponse>;

export type GetDirectMessagesEventsByConversationIdRequestEventTypesItem =
  | "MessageCreate"
  | "ParticipantsJoin"
  | "ParticipantsLeave";
export const GetDirectMessagesEventsByConversationIdRequestEventTypesItem =
  /*@__PURE__*/ S.String;

export type GetDirectMessagesEventsByConversationIdRequestEventTypesList =
  Array<
    GetDirectMessagesEventsByConversationIdRequestEventTypesItem | (string & {})
  >;
export const GetDirectMessagesEventsByConversationIdRequestEventTypesList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsByConversationIdRequestEventTypesItem,
  ) as any as S.Schema<GetDirectMessagesEventsByConversationIdRequestEventTypesList>;

export type GetDirectMessagesEventsByConversationIdRequestDmEventFieldsItem =
  | "attachments"
  | "created_at"
  | "dm_conversation_id"
  | "entities"
  | "event_type"
  | "id"
  | "text";
export const GetDirectMessagesEventsByConversationIdRequestDmEventFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a DmEvent object. */
export type GetDirectMessagesEventsByConversationIdRequestDmEventFieldsList =
  Array<
    | GetDirectMessagesEventsByConversationIdRequestDmEventFieldsItem
    | (string & {})
  >;
export const GetDirectMessagesEventsByConversationIdRequestDmEventFieldsList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsByConversationIdRequestDmEventFieldsItem,
  ) as any as S.Schema<GetDirectMessagesEventsByConversationIdRequestDmEventFieldsList>;

export type GetDirectMessagesEventsByConversationIdRequestExpansionsItem =
  | "attachments.media_keys"
  | "attachments.media_keys"
  | "participant_ids"
  | "referenced_posts"
  | "sender_id";
export const GetDirectMessagesEventsByConversationIdRequestExpansionsItem =
  /*@__PURE__*/ S.String;

export type GetDirectMessagesEventsByConversationIdRequestExpansionsList =
  Array<
    GetDirectMessagesEventsByConversationIdRequestExpansionsItem | (string & {})
  >;
export const GetDirectMessagesEventsByConversationIdRequestExpansionsList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsByConversationIdRequestExpansionsItem,
  ) as any as S.Schema<GetDirectMessagesEventsByConversationIdRequestExpansionsList>;

export type GetDirectMessagesEventsByConversationIdRequestUserFieldsItem =
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
export const GetDirectMessagesEventsByConversationIdRequestUserFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetDirectMessagesEventsByConversationIdRequestUserFieldsList =
  Array<
    GetDirectMessagesEventsByConversationIdRequestUserFieldsItem | (string & {})
  >;
export const GetDirectMessagesEventsByConversationIdRequestUserFieldsList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsByConversationIdRequestUserFieldsItem,
  ) as any as S.Schema<GetDirectMessagesEventsByConversationIdRequestUserFieldsList>;

export type GetDirectMessagesEventsByConversationIdRequestPostFieldsItem =
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
export const GetDirectMessagesEventsByConversationIdRequestPostFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetDirectMessagesEventsByConversationIdRequestPostFieldsList =
  Array<
    GetDirectMessagesEventsByConversationIdRequestPostFieldsItem | (string & {})
  >;
export const GetDirectMessagesEventsByConversationIdRequestPostFieldsList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsByConversationIdRequestPostFieldsItem,
  ) as any as S.Schema<GetDirectMessagesEventsByConversationIdRequestPostFieldsList>;

export type GetDirectMessagesEventsByConversationIdRequestMediaFieldsItem =
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
export const GetDirectMessagesEventsByConversationIdRequestMediaFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a Media object. */
export type GetDirectMessagesEventsByConversationIdRequestMediaFieldsList =
  Array<
    | GetDirectMessagesEventsByConversationIdRequestMediaFieldsItem
    | (string & {})
  >;
export const GetDirectMessagesEventsByConversationIdRequestMediaFieldsList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsByConversationIdRequestMediaFieldsItem,
  ) as any as S.Schema<GetDirectMessagesEventsByConversationIdRequestMediaFieldsList>;

export interface GetDirectMessagesEventsByConversationIdRequest {
  id: string;
  max_results?: number;
  /** A base32hex-encoded pagination token. */
  pagination_token?: string;
  event_types?: GetDirectMessagesEventsByConversationIdRequestEventTypesList;
  /** A comma separated list of DmEvent fields to display. */
  dm_event_fields?: GetDirectMessagesEventsByConversationIdRequestDmEventFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetDirectMessagesEventsByConversationIdRequestExpansionsList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetDirectMessagesEventsByConversationIdRequestUserFieldsList;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetDirectMessagesEventsByConversationIdRequestPostFieldsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: GetDirectMessagesEventsByConversationIdRequestMediaFieldsList;
}
export const GetDirectMessagesEventsByConversationIdRequest =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      id: S.String.pipe(T.Label()),
      max_results: S.optional(S.Number.pipe(T.Query())),
      pagination_token: S.optional(S.String.pipe(T.Query())),
      event_types: S.optional(
        GetDirectMessagesEventsByConversationIdRequestEventTypesList.pipe(
          T.Query(),
        ),
      ),
      dm_event_fields: S.optional(
        GetDirectMessagesEventsByConversationIdRequestDmEventFieldsList.pipe(
          T.Query("dm_event.fields"),
        ),
      ),
      expansions: S.optional(
        GetDirectMessagesEventsByConversationIdRequestExpansionsList.pipe(
          T.Query(),
        ),
      ),
      user_fields: S.optional(
        GetDirectMessagesEventsByConversationIdRequestUserFieldsList.pipe(
          T.Query("user.fields"),
        ),
      ),
      post_fields: S.optional(
        GetDirectMessagesEventsByConversationIdRequestPostFieldsList.pipe(
          T.Query("post.fields"),
        ),
      ),
      media_fields: S.optional(
        GetDirectMessagesEventsByConversationIdRequestMediaFieldsList.pipe(
          T.Query("media.fields"),
        ),
      ),
    }).pipe(
      T.Http({
        method: "GET",
        uri: "/2/dm_conversations/{id}/dm_events",
        code: 200,
      }),
    ),
  ).annotate({
    identifier: "GetDirectMessagesEventsByConversationIdRequest",
  }) as any as S.Schema<GetDirectMessagesEventsByConversationIdRequest>;

export type GetDirectMessagesEventsByConversationIdResponseDataList =
  Array<DmEvent>;
export const GetDirectMessagesEventsByConversationIdResponseDataList =
  /*@__PURE__*/ S.Array(
    DmEvent,
  ) as any as S.Schema<GetDirectMessagesEventsByConversationIdResponseDataList>;

export type GetDirectMessagesEventsByConversationIdResponseErrorsList =
  Array<Problem>;
export const GetDirectMessagesEventsByConversationIdResponseErrorsList =
  /*@__PURE__*/ S.Array(
    Problem,
  ) as any as S.Schema<GetDirectMessagesEventsByConversationIdResponseErrorsList>;

export type GetDirectMessagesEventsByConversationIdResponseMeta =
  GetDirectMessagesEventsResponseMeta;
export const GetDirectMessagesEventsByConversationIdResponseMeta =
  GetDirectMessagesEventsResponseMeta;

export interface GetDirectMessagesEventsByConversationIdResponse {
  data?: GetDirectMessagesEventsByConversationIdResponseDataList;
  errors?: GetDirectMessagesEventsByConversationIdResponseErrorsList;
  includes?: Expansions;
  meta?: GetDirectMessagesEventsResponseMeta;
}
export const GetDirectMessagesEventsByConversationIdResponse =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      data: S.optional(GetDirectMessagesEventsByConversationIdResponseDataList),
      errors: S.optional(
        GetDirectMessagesEventsByConversationIdResponseErrorsList,
      ),
      includes: S.optional(Expansions),
      meta: S.optional(GetDirectMessagesEventsResponseMeta),
    }),
  ).annotate({
    identifier: "GetDirectMessagesEventsByConversationIdResponse",
  }) as any as S.Schema<GetDirectMessagesEventsByConversationIdResponse>;

export type GetDirectMessagesEventsByIdRequestDmEventFieldsItem =
  | "attachments"
  | "created_at"
  | "dm_conversation_id"
  | "entities"
  | "event_type"
  | "id"
  | "text";
export const GetDirectMessagesEventsByIdRequestDmEventFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a DmEvent object. */
export type GetDirectMessagesEventsByIdRequestDmEventFieldsList = Array<
  GetDirectMessagesEventsByIdRequestDmEventFieldsItem | (string & {})
>;
export const GetDirectMessagesEventsByIdRequestDmEventFieldsList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsByIdRequestDmEventFieldsItem,
  ) as any as S.Schema<GetDirectMessagesEventsByIdRequestDmEventFieldsList>;

export type GetDirectMessagesEventsByIdRequestExpansionsItem =
  | "attachments.media_keys"
  | "attachments.media_keys"
  | "participant_ids"
  | "referenced_posts"
  | "sender_id";
export const GetDirectMessagesEventsByIdRequestExpansionsItem =
  /*@__PURE__*/ S.String;

export type GetDirectMessagesEventsByIdRequestExpansionsList = Array<
  GetDirectMessagesEventsByIdRequestExpansionsItem | (string & {})
>;
export const GetDirectMessagesEventsByIdRequestExpansionsList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsByIdRequestExpansionsItem,
  ) as any as S.Schema<GetDirectMessagesEventsByIdRequestExpansionsList>;

export type GetDirectMessagesEventsByIdRequestUserFieldsItem =
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
export const GetDirectMessagesEventsByIdRequestUserFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetDirectMessagesEventsByIdRequestUserFieldsList = Array<
  GetDirectMessagesEventsByIdRequestUserFieldsItem | (string & {})
>;
export const GetDirectMessagesEventsByIdRequestUserFieldsList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsByIdRequestUserFieldsItem,
  ) as any as S.Schema<GetDirectMessagesEventsByIdRequestUserFieldsList>;

export type GetDirectMessagesEventsByIdRequestPostFieldsItem =
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
export const GetDirectMessagesEventsByIdRequestPostFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetDirectMessagesEventsByIdRequestPostFieldsList = Array<
  GetDirectMessagesEventsByIdRequestPostFieldsItem | (string & {})
>;
export const GetDirectMessagesEventsByIdRequestPostFieldsList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsByIdRequestPostFieldsItem,
  ) as any as S.Schema<GetDirectMessagesEventsByIdRequestPostFieldsList>;

export type GetDirectMessagesEventsByIdRequestMediaFieldsItem =
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
export const GetDirectMessagesEventsByIdRequestMediaFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a Media object. */
export type GetDirectMessagesEventsByIdRequestMediaFieldsList = Array<
  GetDirectMessagesEventsByIdRequestMediaFieldsItem | (string & {})
>;
export const GetDirectMessagesEventsByIdRequestMediaFieldsList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsByIdRequestMediaFieldsItem,
  ) as any as S.Schema<GetDirectMessagesEventsByIdRequestMediaFieldsList>;

export interface GetDirectMessagesEventsByIdRequest {
  event_id: string;
  /** A comma separated list of DmEvent fields to display. */
  dm_event_fields?: GetDirectMessagesEventsByIdRequestDmEventFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetDirectMessagesEventsByIdRequestExpansionsList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetDirectMessagesEventsByIdRequestUserFieldsList;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetDirectMessagesEventsByIdRequestPostFieldsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: GetDirectMessagesEventsByIdRequestMediaFieldsList;
}
export const GetDirectMessagesEventsByIdRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    event_id: S.String.pipe(T.Label()),
    dm_event_fields: S.optional(
      GetDirectMessagesEventsByIdRequestDmEventFieldsList.pipe(
        T.Query("dm_event.fields"),
      ),
    ),
    expansions: S.optional(
      GetDirectMessagesEventsByIdRequestExpansionsList.pipe(T.Query()),
    ),
    user_fields: S.optional(
      GetDirectMessagesEventsByIdRequestUserFieldsList.pipe(
        T.Query("user.fields"),
      ),
    ),
    post_fields: S.optional(
      GetDirectMessagesEventsByIdRequestPostFieldsList.pipe(
        T.Query("post.fields"),
      ),
    ),
    media_fields: S.optional(
      GetDirectMessagesEventsByIdRequestMediaFieldsList.pipe(
        T.Query("media.fields"),
      ),
    ),
  }).pipe(T.Http({ method: "GET", uri: "/2/dm_events/{event_id}", code: 200 })),
).annotate({
  identifier: "GetDirectMessagesEventsByIdRequest",
}) as any as S.Schema<GetDirectMessagesEventsByIdRequest>;

export type GetDirectMessagesEventsByIdResponseErrorsList = Array<Problem>;
export const GetDirectMessagesEventsByIdResponseErrorsList =
  /*@__PURE__*/ S.Array(
    Problem,
  ) as any as S.Schema<GetDirectMessagesEventsByIdResponseErrorsList>;

export interface GetDirectMessagesEventsByIdResponse {
  data?: DmEvent;
  errors?: GetDirectMessagesEventsByIdResponseErrorsList;
  includes?: Expansions;
}
export const GetDirectMessagesEventsByIdResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(DmEvent),
    errors: S.optional(GetDirectMessagesEventsByIdResponseErrorsList),
    includes: S.optional(Expansions),
  }),
).annotate({
  identifier: "GetDirectMessagesEventsByIdResponse",
}) as any as S.Schema<GetDirectMessagesEventsByIdResponse>;

export type GetDirectMessagesEventsByParticipantIdRequestEventTypesItem =
  | "MessageCreate"
  | "ParticipantsJoin"
  | "ParticipantsLeave";
export const GetDirectMessagesEventsByParticipantIdRequestEventTypesItem =
  /*@__PURE__*/ S.String;

export type GetDirectMessagesEventsByParticipantIdRequestEventTypesList = Array<
  GetDirectMessagesEventsByParticipantIdRequestEventTypesItem | (string & {})
>;
export const GetDirectMessagesEventsByParticipantIdRequestEventTypesList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsByParticipantIdRequestEventTypesItem,
  ) as any as S.Schema<GetDirectMessagesEventsByParticipantIdRequestEventTypesList>;

export type GetDirectMessagesEventsByParticipantIdRequestDmEventFieldsItem =
  | "attachments"
  | "created_at"
  | "dm_conversation_id"
  | "entities"
  | "event_type"
  | "id"
  | "text";
export const GetDirectMessagesEventsByParticipantIdRequestDmEventFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a DmEvent object. */
export type GetDirectMessagesEventsByParticipantIdRequestDmEventFieldsList =
  Array<
    | GetDirectMessagesEventsByParticipantIdRequestDmEventFieldsItem
    | (string & {})
  >;
export const GetDirectMessagesEventsByParticipantIdRequestDmEventFieldsList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsByParticipantIdRequestDmEventFieldsItem,
  ) as any as S.Schema<GetDirectMessagesEventsByParticipantIdRequestDmEventFieldsList>;

export type GetDirectMessagesEventsByParticipantIdRequestExpansionsItem =
  | "attachments.media_keys"
  | "attachments.media_keys"
  | "participant_ids"
  | "referenced_posts"
  | "sender_id";
export const GetDirectMessagesEventsByParticipantIdRequestExpansionsItem =
  /*@__PURE__*/ S.String;

export type GetDirectMessagesEventsByParticipantIdRequestExpansionsList = Array<
  GetDirectMessagesEventsByParticipantIdRequestExpansionsItem | (string & {})
>;
export const GetDirectMessagesEventsByParticipantIdRequestExpansionsList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsByParticipantIdRequestExpansionsItem,
  ) as any as S.Schema<GetDirectMessagesEventsByParticipantIdRequestExpansionsList>;

export type GetDirectMessagesEventsByParticipantIdRequestUserFieldsItem =
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
export const GetDirectMessagesEventsByParticipantIdRequestUserFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a User object. */
export type GetDirectMessagesEventsByParticipantIdRequestUserFieldsList = Array<
  GetDirectMessagesEventsByParticipantIdRequestUserFieldsItem | (string & {})
>;
export const GetDirectMessagesEventsByParticipantIdRequestUserFieldsList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsByParticipantIdRequestUserFieldsItem,
  ) as any as S.Schema<GetDirectMessagesEventsByParticipantIdRequestUserFieldsList>;

export type GetDirectMessagesEventsByParticipantIdRequestPostFieldsItem =
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
export const GetDirectMessagesEventsByParticipantIdRequestPostFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a Post object. */
export type GetDirectMessagesEventsByParticipantIdRequestPostFieldsList = Array<
  GetDirectMessagesEventsByParticipantIdRequestPostFieldsItem | (string & {})
>;
export const GetDirectMessagesEventsByParticipantIdRequestPostFieldsList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsByParticipantIdRequestPostFieldsItem,
  ) as any as S.Schema<GetDirectMessagesEventsByParticipantIdRequestPostFieldsList>;

export type GetDirectMessagesEventsByParticipantIdRequestMediaFieldsItem =
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
export const GetDirectMessagesEventsByParticipantIdRequestMediaFieldsItem =
  /*@__PURE__*/ S.String;

/** The fields available for a Media object. */
export type GetDirectMessagesEventsByParticipantIdRequestMediaFieldsList =
  Array<
    GetDirectMessagesEventsByParticipantIdRequestMediaFieldsItem | (string & {})
  >;
export const GetDirectMessagesEventsByParticipantIdRequestMediaFieldsList =
  /*@__PURE__*/ S.Array(
    GetDirectMessagesEventsByParticipantIdRequestMediaFieldsItem,
  ) as any as S.Schema<GetDirectMessagesEventsByParticipantIdRequestMediaFieldsList>;

export interface GetDirectMessagesEventsByParticipantIdRequest {
  participant_id: string;
  max_results?: number;
  /** A base32hex-encoded pagination token. */
  pagination_token?: string;
  event_types?: GetDirectMessagesEventsByParticipantIdRequestEventTypesList;
  /** A comma separated list of DmEvent fields to display. */
  dm_event_fields?: GetDirectMessagesEventsByParticipantIdRequestDmEventFieldsList;
  /** A comma separated list of fields to expand. */
  expansions?: GetDirectMessagesEventsByParticipantIdRequestExpansionsList;
  /** A comma separated list of User fields to display. */
  user_fields?: GetDirectMessagesEventsByParticipantIdRequestUserFieldsList;
  /** A comma separated list of Post fields to display. */
  post_fields?: GetDirectMessagesEventsByParticipantIdRequestPostFieldsList;
  /** A comma separated list of Media fields to display. */
  media_fields?: GetDirectMessagesEventsByParticipantIdRequestMediaFieldsList;
}
export const GetDirectMessagesEventsByParticipantIdRequest =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      participant_id: S.String.pipe(T.Label()),
      max_results: S.optional(S.Number.pipe(T.Query())),
      pagination_token: S.optional(S.String.pipe(T.Query())),
      event_types: S.optional(
        GetDirectMessagesEventsByParticipantIdRequestEventTypesList.pipe(
          T.Query(),
        ),
      ),
      dm_event_fields: S.optional(
        GetDirectMessagesEventsByParticipantIdRequestDmEventFieldsList.pipe(
          T.Query("dm_event.fields"),
        ),
      ),
      expansions: S.optional(
        GetDirectMessagesEventsByParticipantIdRequestExpansionsList.pipe(
          T.Query(),
        ),
      ),
      user_fields: S.optional(
        GetDirectMessagesEventsByParticipantIdRequestUserFieldsList.pipe(
          T.Query("user.fields"),
        ),
      ),
      post_fields: S.optional(
        GetDirectMessagesEventsByParticipantIdRequestPostFieldsList.pipe(
          T.Query("post.fields"),
        ),
      ),
      media_fields: S.optional(
        GetDirectMessagesEventsByParticipantIdRequestMediaFieldsList.pipe(
          T.Query("media.fields"),
        ),
      ),
    }).pipe(
      T.Http({
        method: "GET",
        uri: "/2/dm_conversations/with/{participant_id}/dm_events",
        code: 200,
      }),
    ),
  ).annotate({
    identifier: "GetDirectMessagesEventsByParticipantIdRequest",
  }) as any as S.Schema<GetDirectMessagesEventsByParticipantIdRequest>;

export type GetDirectMessagesEventsByParticipantIdResponseDataList =
  Array<DmEvent>;
export const GetDirectMessagesEventsByParticipantIdResponseDataList =
  /*@__PURE__*/ S.Array(
    DmEvent,
  ) as any as S.Schema<GetDirectMessagesEventsByParticipantIdResponseDataList>;

export type GetDirectMessagesEventsByParticipantIdResponseErrorsList =
  Array<Problem>;
export const GetDirectMessagesEventsByParticipantIdResponseErrorsList =
  /*@__PURE__*/ S.Array(
    Problem,
  ) as any as S.Schema<GetDirectMessagesEventsByParticipantIdResponseErrorsList>;

export type GetDirectMessagesEventsByParticipantIdResponseMeta =
  GetDirectMessagesEventsResponseMeta;
export const GetDirectMessagesEventsByParticipantIdResponseMeta =
  GetDirectMessagesEventsResponseMeta;

export interface GetDirectMessagesEventsByParticipantIdResponse {
  data?: GetDirectMessagesEventsByParticipantIdResponseDataList;
  errors?: GetDirectMessagesEventsByParticipantIdResponseErrorsList;
  includes?: Expansions;
  meta?: GetDirectMessagesEventsResponseMeta;
}
export const GetDirectMessagesEventsByParticipantIdResponse =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      data: S.optional(GetDirectMessagesEventsByParticipantIdResponseDataList),
      errors: S.optional(
        GetDirectMessagesEventsByParticipantIdResponseErrorsList,
      ),
      includes: S.optional(Expansions),
      meta: S.optional(GetDirectMessagesEventsResponseMeta),
    }),
  ).annotate({
    identifier: "GetDirectMessagesEventsByParticipantIdResponse",
  }) as any as S.Schema<GetDirectMessagesEventsByParticipantIdResponse>;

export interface UnblockUsersDmsRequest {
  id: string;
}
export const UnblockUsersDmsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
  }).pipe(
    T.Http({ method: "POST", uri: "/2/users/{id}/dm/unblock", code: 200 }),
  ),
).annotate({
  identifier: "UnblockUsersDmsRequest",
}) as any as S.Schema<UnblockUsersDmsRequest>;

export type UnblockUsersDmsResponseData = BlockUsersDmsResponseData;
export const UnblockUsersDmsResponseData = BlockUsersDmsResponseData;

export type UnblockUsersDmsResponseErrorsList = Array<Problem>;
export const UnblockUsersDmsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<UnblockUsersDmsResponseErrorsList>;

export interface UnblockUsersDmsResponse {
  data?: BlockUsersDmsResponseData;
  errors?: UnblockUsersDmsResponseErrorsList;
}
export const UnblockUsersDmsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(BlockUsersDmsResponseData),
    errors: S.optional(UnblockUsersDmsResponseErrorsList),
  }),
).annotate({
  identifier: "UnblockUsersDmsResponse",
}) as any as S.Schema<UnblockUsersDmsResponse>;

export const blockUsersDms = /*@__PURE__*/ makeOperation<
  BlockUsersDmsRequest,
  BlockUsersDmsResponse
>(
  operations.blockUsersDms,
  () => BlockUsersDmsRequest,
  () => BlockUsersDmsResponse,
);

export const createDirectMessagesByConversationId = /*@__PURE__*/ makeOperation<
  CreateDirectMessagesByConversationIdRequest,
  CreateDirectMessagesByConversationIdResponse
>(
  operations.createDirectMessagesByConversationId,
  () => CreateDirectMessagesByConversationIdRequest,
  () => CreateDirectMessagesByConversationIdResponse,
);

export const createDirectMessagesByParticipantId = /*@__PURE__*/ makeOperation<
  CreateDirectMessagesByParticipantIdRequest,
  CreateDirectMessagesByParticipantIdResponse
>(
  operations.createDirectMessagesByParticipantId,
  () => CreateDirectMessagesByParticipantIdRequest,
  () => CreateDirectMessagesByParticipantIdResponse,
);

export const createDirectMessagesConversation = /*@__PURE__*/ makeOperation<
  CreateDirectMessagesConversationRequest,
  CreateDirectMessagesConversationResponse
>(
  operations.createDirectMessagesConversation,
  () => CreateDirectMessagesConversationRequest,
  () => CreateDirectMessagesConversationResponse,
);

export const deleteDirectMessagesEvents = /*@__PURE__*/ makeOperation<
  DeleteDirectMessagesEventsRequest,
  DeleteDirectMessagesEventsResponse
>(
  operations.deleteDirectMessagesEvents,
  () => DeleteDirectMessagesEventsRequest,
  () => DeleteDirectMessagesEventsResponse,
);

export const dmConversationsMediaDownload = /*@__PURE__*/ makeBinaryOperation<
  DmConversationsMediaDownloadRequest,
  DmConversationsMediaDownloadResponse
>(
  operations.dmConversationsMediaDownload,
  () => DmConversationsMediaDownloadRequest,
  () => DmConversationsMediaDownloadResponse,
);

export const getDirectMessagesEvents = /*@__PURE__*/ makeOperation<
  GetDirectMessagesEventsRequest,
  GetDirectMessagesEventsResponse
>(
  operations.getDirectMessagesEvents,
  () => GetDirectMessagesEventsRequest,
  () => GetDirectMessagesEventsResponse,
);

export const getDirectMessagesEventsByConversationId =
  /*@__PURE__*/ makeOperation<
    GetDirectMessagesEventsByConversationIdRequest,
    GetDirectMessagesEventsByConversationIdResponse
  >(
    operations.getDirectMessagesEventsByConversationId,
    () => GetDirectMessagesEventsByConversationIdRequest,
    () => GetDirectMessagesEventsByConversationIdResponse,
  );

export const getDirectMessagesEventsById = /*@__PURE__*/ makeOperation<
  GetDirectMessagesEventsByIdRequest,
  GetDirectMessagesEventsByIdResponse
>(
  operations.getDirectMessagesEventsById,
  () => GetDirectMessagesEventsByIdRequest,
  () => GetDirectMessagesEventsByIdResponse,
);

export const getDirectMessagesEventsByParticipantId =
  /*@__PURE__*/ makeOperation<
    GetDirectMessagesEventsByParticipantIdRequest,
    GetDirectMessagesEventsByParticipantIdResponse
  >(
    operations.getDirectMessagesEventsByParticipantId,
    () => GetDirectMessagesEventsByParticipantIdRequest,
    () => GetDirectMessagesEventsByParticipantIdResponse,
  );

export const unblockUsersDms = /*@__PURE__*/ makeOperation<
  UnblockUsersDmsRequest,
  UnblockUsersDmsResponse
>(
  operations.unblockUsersDms,
  () => UnblockUsersDmsRequest,
  () => UnblockUsersDmsResponse,
);
