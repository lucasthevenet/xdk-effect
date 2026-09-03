// AUTO-GENERATED from xdevplatform/xdk@84c26540df30c0b798e50e34151c56d5d262ba1c; do not edit.
import * as S from "@distilled.cloud/core/schema";
import * as T from "../traits.ts";
import {
  makeOperation,
  makeBinaryOperation,
  makeStreamOperation,
} from "../operation.ts";
import { operations } from "../operations.ts";
/** Recurrence frequency. */
export type CreateScheduledBroadcastRecurrenceFrequency = "Daily" | "Weekly";
export const CreateScheduledBroadcastRecurrenceFrequency =
  /*@__PURE__*/ S.String;

export interface CreateScheduledBroadcastRecurrence {
  /** Recurrence frequency. */
  frequency: CreateScheduledBroadcastRecurrenceFrequency | (string & {});
  /** Number of repeats (numeric string). */
  repeats: string;
}
export const CreateScheduledBroadcastRecurrence = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    frequency: CreateScheduledBroadcastRecurrenceFrequency,
    repeats: S.String,
  }),
).annotate({
  identifier: "CreateScheduledBroadcastRecurrence",
}) as any as S.Schema<CreateScheduledBroadcastRecurrence>;

export interface CreateScheduledBroadcastRequest {
  /** Enable replay. */
  available_for_replay?: boolean;
  /** Chat permission option (numeric string). */
  chat_option?: string;
  /** Description. */
  description?: string;
  /** Lock the broadcast. */
  is_locked?: boolean;
  /** Locale. */
  locale?: string;
  /** If true, do not auto-publish at start; call POST .../live when ready. */
  manual_publish?: boolean;
  /** If set, creates a recurring series. */
  recurrence?: CreateScheduledBroadcastRecurrence;
  /** End time, ms since Unix epoch (decimal string). */
  scheduled_end_ms: string;
  /** Start time, ms since Unix epoch (decimal string). */
  scheduled_start_ms: string;
  /** Ingest / source id to bind (same as sources `rtmp_stream_key`). */
  source_id: string;
  /** Optional telecast id (numeric string). */
  telecast_id?: string;
  /** Pre-live slate media id (numeric string). */
  thumbnail_media_id?: string;
  /** Title / status text. */
  title?: string;
}
export const CreateScheduledBroadcastRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    available_for_replay: S.optional(S.Boolean),
    chat_option: S.optional(S.String),
    description: S.optional(S.String),
    is_locked: S.optional(S.Boolean),
    locale: S.optional(S.String),
    manual_publish: S.optional(S.Boolean),
    recurrence: S.optional(CreateScheduledBroadcastRecurrence),
    scheduled_end_ms: S.String,
    scheduled_start_ms: S.String,
    source_id: S.String,
    telecast_id: S.optional(S.String),
    thumbnail_media_id: S.optional(S.String),
    title: S.optional(S.String),
  }).pipe(
    T.Http({ method: "POST", uri: "/2/broadcasts/scheduled", code: 200 }),
  ),
).annotate({
  identifier: "CreateScheduledBroadcastRequest",
}) as any as S.Schema<CreateScheduledBroadcastRequest>;

export interface CreateScheduledBroadcastResponseData {
  /** Whether replay is enabled. */
  available_for_replay?: boolean;
  /** Alphanumeric UBS broadcast id (path `:id` for get/update/delete/live). */
  broadcast_id?: string;
  /** Optional chat permission option. */
  chat_option?: string;
  /** Optional description. */
  description?: string;
  /** Optional locale. */
  locale?: string;
  /** When true, coordinator will not auto-publish; call POST .../live when ready. */
  manual_publish?: boolean;
  /** Set when this occurrence belongs to a recurrence. */
  recurring_schedule_id?: string;
  /** Numeric scheduler id. Required in the update request body. */
  scheduled_broadcast_id?: string;
  /** Scheduled end, milliseconds since Unix epoch (decimal string). */
  scheduled_end_ms?: string;
  /** Scheduled start, milliseconds since Unix epoch (decimal string). */
  scheduled_start_ms?: string;
  /** Bound ingest / source id (`rtmp_stream_key`). */
  source_id?: string;
  /** Scheduler state (Created, Scheduled, Running, …). */
  state?: string;
  /** Optional telecast association. */
  telecast_id?: string;
  /** Optional pre-live slate media id. */
  thumbnail_media_id?: string;
  /** Broadcast title / status text. */
  title?: string;
}
export const CreateScheduledBroadcastResponseData = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      available_for_replay: S.optional(S.Boolean),
      broadcast_id: S.optional(S.String),
      chat_option: S.optional(S.String),
      description: S.optional(S.String),
      locale: S.optional(S.String),
      manual_publish: S.optional(S.Boolean),
      recurring_schedule_id: S.optional(S.String),
      scheduled_broadcast_id: S.optional(S.String),
      scheduled_end_ms: S.optional(S.String),
      scheduled_start_ms: S.optional(S.String),
      source_id: S.optional(S.String),
      state: S.optional(S.String),
      telecast_id: S.optional(S.String),
      thumbnail_media_id: S.optional(S.String),
      title: S.optional(S.String),
    }),
).annotate({
  identifier: "CreateScheduledBroadcastResponseData",
}) as any as S.Schema<CreateScheduledBroadcastResponseData>;

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
export type CreateScheduledBroadcastResponseErrorsList = Array<Problem>;
export const CreateScheduledBroadcastResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<CreateScheduledBroadcastResponseErrorsList>;

export interface CreateScheduledBroadcastResponse {
  data?: CreateScheduledBroadcastResponseData;
  errors?: CreateScheduledBroadcastResponseErrorsList;
}
export const CreateScheduledBroadcastResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(CreateScheduledBroadcastResponseData),
    errors: S.optional(CreateScheduledBroadcastResponseErrorsList),
  }),
).annotate({
  identifier: "CreateScheduledBroadcastResponse",
}) as any as S.Schema<CreateScheduledBroadcastResponse>;

export interface DeleteScheduledBroadcastRequest {
  id: string;
  roll_forward?: boolean;
}
export const DeleteScheduledBroadcastRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    roll_forward: S.optional(S.Boolean.pipe(T.Query())),
  }).pipe(
    T.Http({
      method: "DELETE",
      uri: "/2/broadcasts/scheduled/{id}",
      code: 200,
    }),
  ),
).annotate({
  identifier: "DeleteScheduledBroadcastRequest",
}) as any as S.Schema<DeleteScheduledBroadcastRequest>;

export interface DeleteScheduledBroadcastResponseData {
  /** Whether the scheduled broadcast was deleted. */
  deleted: boolean;
}
export const DeleteScheduledBroadcastResponseData = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      deleted: S.Boolean,
    }),
).annotate({
  identifier: "DeleteScheduledBroadcastResponseData",
}) as any as S.Schema<DeleteScheduledBroadcastResponseData>;

export type DeleteScheduledBroadcastResponseErrorsList = Array<Problem>;
export const DeleteScheduledBroadcastResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<DeleteScheduledBroadcastResponseErrorsList>;

export interface DeleteScheduledBroadcastResponse {
  data?: DeleteScheduledBroadcastResponseData;
  errors?: DeleteScheduledBroadcastResponseErrorsList;
}
export const DeleteScheduledBroadcastResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(DeleteScheduledBroadcastResponseData),
    errors: S.optional(DeleteScheduledBroadcastResponseErrorsList),
  }),
).annotate({
  identifier: "DeleteScheduledBroadcastResponse",
}) as any as S.Schema<DeleteScheduledBroadcastResponse>;

export interface GetScheduledBroadcastRequest {
  id: string;
}
export const GetScheduledBroadcastRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
  }).pipe(
    T.Http({ method: "GET", uri: "/2/broadcasts/scheduled/{id}", code: 200 }),
  ),
).annotate({
  identifier: "GetScheduledBroadcastRequest",
}) as any as S.Schema<GetScheduledBroadcastRequest>;

export type GetScheduledBroadcastResponseData =
  CreateScheduledBroadcastResponseData;
export const GetScheduledBroadcastResponseData =
  CreateScheduledBroadcastResponseData;

export type GetScheduledBroadcastResponseErrorsList = Array<Problem>;
export const GetScheduledBroadcastResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GetScheduledBroadcastResponseErrorsList>;

export interface GetScheduledBroadcastResponse {
  data?: CreateScheduledBroadcastResponseData;
  errors?: GetScheduledBroadcastResponseErrorsList;
}
export const GetScheduledBroadcastResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(CreateScheduledBroadcastResponseData),
    errors: S.optional(GetScheduledBroadcastResponseErrorsList),
  }),
).annotate({
  identifier: "GetScheduledBroadcastResponse",
}) as any as S.Schema<GetScheduledBroadcastResponse>;

export interface GoLiveScheduledBroadcastRequest {
  id: string;
}
export const GoLiveScheduledBroadcastRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
  }).pipe(
    T.Http({
      method: "POST",
      uri: "/2/broadcasts/scheduled/{id}/live",
      code: 200,
    }),
  ),
).annotate({
  identifier: "GoLiveScheduledBroadcastRequest",
}) as any as S.Schema<GoLiveScheduledBroadcastRequest>;

export type GoLiveScheduledBroadcastResponseData =
  CreateScheduledBroadcastResponseData;
export const GoLiveScheduledBroadcastResponseData =
  CreateScheduledBroadcastResponseData;

export type GoLiveScheduledBroadcastResponseErrorsList = Array<Problem>;
export const GoLiveScheduledBroadcastResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<GoLiveScheduledBroadcastResponseErrorsList>;

export interface GoLiveScheduledBroadcastResponse {
  data?: CreateScheduledBroadcastResponseData;
  errors?: GoLiveScheduledBroadcastResponseErrorsList;
}
export const GoLiveScheduledBroadcastResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(CreateScheduledBroadcastResponseData),
    errors: S.optional(GoLiveScheduledBroadcastResponseErrorsList),
  }),
).annotate({
  identifier: "GoLiveScheduledBroadcastResponse",
}) as any as S.Schema<GoLiveScheduledBroadcastResponse>;

export interface ListScheduledBroadcastsRequest {
  max_results?: number;
  oldest_start_time?: string;
  newest_start_time?: string;
  pagination_token?: string;
}
export const ListScheduledBroadcastsRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    max_results: S.optional(S.Number.pipe(T.Query())),
    oldest_start_time: S.optional(S.String.pipe(T.Query())),
    newest_start_time: S.optional(S.String.pipe(T.Query())),
    pagination_token: S.optional(S.String.pipe(T.Query())),
  }).pipe(T.Http({ method: "GET", uri: "/2/broadcasts/scheduled", code: 200 })),
).annotate({
  identifier: "ListScheduledBroadcastsRequest",
}) as any as S.Schema<ListScheduledBroadcastsRequest>;

export type ListScheduledBroadcastsResponseData =
  CreateScheduledBroadcastResponseData;
export const ListScheduledBroadcastsResponseData =
  CreateScheduledBroadcastResponseData;

export type ListScheduledBroadcastsResponseDataList =
  Array<CreateScheduledBroadcastResponseData>;
export const ListScheduledBroadcastsResponseDataList = /*@__PURE__*/ S.Array(
  CreateScheduledBroadcastResponseData,
) as any as S.Schema<ListScheduledBroadcastsResponseDataList>;

export type ListScheduledBroadcastsResponseErrorsList = Array<Problem>;
export const ListScheduledBroadcastsResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<ListScheduledBroadcastsResponseErrorsList>;

export interface ListScheduledBroadcastsResponse {
  data?: ListScheduledBroadcastsResponseDataList;
  errors?: ListScheduledBroadcastsResponseErrorsList;
}
export const ListScheduledBroadcastsResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(ListScheduledBroadcastsResponseDataList),
    errors: S.optional(ListScheduledBroadcastsResponseErrorsList),
  }),
).annotate({
  identifier: "ListScheduledBroadcastsResponse",
}) as any as S.Schema<ListScheduledBroadcastsResponse>;

export interface SendBroadcastChatRequest {
  id: string;
  /** The chat message text. */
  text: string;
}
export const SendBroadcastChatRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    text: S.String,
  }).pipe(
    T.Http({ method: "POST", uri: "/2/broadcasts/{id}/chat", code: 200 }),
  ),
).annotate({
  identifier: "SendBroadcastChatRequest",
}) as any as S.Schema<SendBroadcastChatRequest>;

export interface SendBroadcastChatResponseData {
  /** Whether the chat message was sent. */
  success: boolean;
  /** Server timestamp of the message, in nanoseconds. */
  timestamp: string;
}
export const SendBroadcastChatResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    success: S.Boolean,
    timestamp: S.String,
  }),
).annotate({
  identifier: "SendBroadcastChatResponseData",
}) as any as S.Schema<SendBroadcastChatResponseData>;

export type SendBroadcastChatResponseErrorsList = Array<Problem>;
export const SendBroadcastChatResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<SendBroadcastChatResponseErrorsList>;

export interface SendBroadcastChatResponse {
  data?: SendBroadcastChatResponseData;
  errors?: SendBroadcastChatResponseErrorsList;
}
export const SendBroadcastChatResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(SendBroadcastChatResponseData),
    errors: S.optional(SendBroadcastChatResponseErrorsList),
  }),
).annotate({
  identifier: "SendBroadcastChatResponse",
}) as any as S.Schema<SendBroadcastChatResponse>;

export interface UpdateScheduledBroadcastRequest {
  id: string;
  /** Enable replay. */
  available_for_replay?: boolean;
  /** Chat permission option (numeric string). */
  chat_option?: string;
  /** Description. */
  description?: string;
  /** Lock the broadcast. */
  is_locked?: boolean;
  /** Locale. */
  locale?: string;
  /** If true, do not auto-publish at start; call POST .../live when ready. */
  manual_publish?: boolean;
  /** When true, shift the head of a recurring series. */
  roll_forward?: boolean;
  /** Numeric scheduler id from create/list/get. */
  scheduled_broadcast_id: string;
  /** End time, ms since Unix epoch (decimal string). */
  scheduled_end_ms: string;
  /** Start time, ms since Unix epoch (decimal string). */
  scheduled_start_ms: string;
  /** Ingest / source id. */
  source_id?: string;
  /** Pre-live slate media id (numeric string). */
  thumbnail_media_id?: string;
  /** Title / status text. */
  title?: string;
}
export const UpdateScheduledBroadcastRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.Label()),
    available_for_replay: S.optional(S.Boolean),
    chat_option: S.optional(S.String),
    description: S.optional(S.String),
    is_locked: S.optional(S.Boolean),
    locale: S.optional(S.String),
    manual_publish: S.optional(S.Boolean),
    roll_forward: S.optional(S.Boolean),
    scheduled_broadcast_id: S.String,
    scheduled_end_ms: S.String,
    scheduled_start_ms: S.String,
    source_id: S.optional(S.String),
    thumbnail_media_id: S.optional(S.String),
    title: S.optional(S.String),
  }).pipe(
    T.Http({ method: "PUT", uri: "/2/broadcasts/scheduled/{id}", code: 200 }),
  ),
).annotate({
  identifier: "UpdateScheduledBroadcastRequest",
}) as any as S.Schema<UpdateScheduledBroadcastRequest>;

export type UpdateScheduledBroadcastResponseData =
  CreateScheduledBroadcastResponseData;
export const UpdateScheduledBroadcastResponseData =
  CreateScheduledBroadcastResponseData;

export type UpdateScheduledBroadcastResponseErrorsList = Array<Problem>;
export const UpdateScheduledBroadcastResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<UpdateScheduledBroadcastResponseErrorsList>;

export interface UpdateScheduledBroadcastResponse {
  data?: CreateScheduledBroadcastResponseData;
  errors?: UpdateScheduledBroadcastResponseErrorsList;
}
export const UpdateScheduledBroadcastResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(CreateScheduledBroadcastResponseData),
    errors: S.optional(UpdateScheduledBroadcastResponseErrorsList),
  }),
).annotate({
  identifier: "UpdateScheduledBroadcastResponse",
}) as any as S.Schema<UpdateScheduledBroadcastResponse>;

export const createScheduledBroadcast = /*@__PURE__*/ makeOperation<
  CreateScheduledBroadcastRequest,
  CreateScheduledBroadcastResponse
>(
  operations.createScheduledBroadcast,
  () => CreateScheduledBroadcastRequest,
  () => CreateScheduledBroadcastResponse,
);

export const deleteScheduledBroadcast = /*@__PURE__*/ makeOperation<
  DeleteScheduledBroadcastRequest,
  DeleteScheduledBroadcastResponse
>(
  operations.deleteScheduledBroadcast,
  () => DeleteScheduledBroadcastRequest,
  () => DeleteScheduledBroadcastResponse,
);

export const getScheduledBroadcast = /*@__PURE__*/ makeOperation<
  GetScheduledBroadcastRequest,
  GetScheduledBroadcastResponse
>(
  operations.getScheduledBroadcast,
  () => GetScheduledBroadcastRequest,
  () => GetScheduledBroadcastResponse,
);

export const goLiveScheduledBroadcast = /*@__PURE__*/ makeOperation<
  GoLiveScheduledBroadcastRequest,
  GoLiveScheduledBroadcastResponse
>(
  operations.goLiveScheduledBroadcast,
  () => GoLiveScheduledBroadcastRequest,
  () => GoLiveScheduledBroadcastResponse,
);

export const listScheduledBroadcasts = /*@__PURE__*/ makeOperation<
  ListScheduledBroadcastsRequest,
  ListScheduledBroadcastsResponse
>(
  operations.listScheduledBroadcasts,
  () => ListScheduledBroadcastsRequest,
  () => ListScheduledBroadcastsResponse,
);

export const sendBroadcastChat = /*@__PURE__*/ makeOperation<
  SendBroadcastChatRequest,
  SendBroadcastChatResponse
>(
  operations.sendBroadcastChat,
  () => SendBroadcastChatRequest,
  () => SendBroadcastChatResponse,
);

export const updateScheduledBroadcast = /*@__PURE__*/ makeOperation<
  UpdateScheduledBroadcastRequest,
  UpdateScheduledBroadcastResponse
>(
  operations.updateScheduledBroadcast,
  () => UpdateScheduledBroadcastRequest,
  () => UpdateScheduledBroadcastResponse,
);
