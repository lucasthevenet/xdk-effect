// AUTO-GENERATED from xdevplatform/xdk@84c26540df30c0b798e50e34151c56d5d262ba1c; do not edit.
import * as S from "@distilled.cloud/core/schema";
import * as T from "../traits.ts";
import {
  makeOperation,
  makeBinaryOperation,
  makeStreamOperation,
} from "../operation.ts";
import { operations } from "../operations.ts";
export interface ArticleCreateDraftContentStateBlocksDataCashtags {
  /** Start index of the tagged span. */
  from_index: number;
  /** The tagged text. */
  text: string;
  /** End index of the tagged span. */
  to_index: number;
}
export const ArticleCreateDraftContentStateBlocksDataCashtags =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      from_index: S.Number,
      text: S.String,
      to_index: S.Number,
    }),
  ).annotate({
    identifier: "ArticleCreateDraftContentStateBlocksDataCashtags",
  }) as any as S.Schema<ArticleCreateDraftContentStateBlocksDataCashtags>;

/** Cashtag spans in this block. */
export type ArticleCreateDraftContentStateBlocksDataCashtagsList =
  Array<ArticleCreateDraftContentStateBlocksDataCashtags>;
export const ArticleCreateDraftContentStateBlocksDataCashtagsList =
  /*@__PURE__*/ S.Array(
    ArticleCreateDraftContentStateBlocksDataCashtags,
  ) as any as S.Schema<ArticleCreateDraftContentStateBlocksDataCashtagsList>;

export type ArticleCreateDraftContentStateBlocksDataHashtags =
  ArticleCreateDraftContentStateBlocksDataCashtags;
export const ArticleCreateDraftContentStateBlocksDataHashtags =
  ArticleCreateDraftContentStateBlocksDataCashtags;

/** Hashtag spans in this block. */
export type ArticleCreateDraftContentStateBlocksDataHashtagsList =
  Array<ArticleCreateDraftContentStateBlocksDataCashtags>;
export const ArticleCreateDraftContentStateBlocksDataHashtagsList =
  /*@__PURE__*/ S.Array(
    ArticleCreateDraftContentStateBlocksDataCashtags,
  ) as any as S.Schema<ArticleCreateDraftContentStateBlocksDataHashtagsList>;

export type ArticleCreateDraftContentStateBlocksDataMentions =
  ArticleCreateDraftContentStateBlocksDataCashtags;
export const ArticleCreateDraftContentStateBlocksDataMentions =
  ArticleCreateDraftContentStateBlocksDataCashtags;

/** Mention spans in this block. */
export type ArticleCreateDraftContentStateBlocksDataMentionsList =
  Array<ArticleCreateDraftContentStateBlocksDataCashtags>;
export const ArticleCreateDraftContentStateBlocksDataMentionsList =
  /*@__PURE__*/ S.Array(
    ArticleCreateDraftContentStateBlocksDataCashtags,
  ) as any as S.Schema<ArticleCreateDraftContentStateBlocksDataMentionsList>;

export type ArticleCreateDraftContentStateBlocksDataUrls =
  ArticleCreateDraftContentStateBlocksDataCashtags;
export const ArticleCreateDraftContentStateBlocksDataUrls =
  ArticleCreateDraftContentStateBlocksDataCashtags;

/** URL spans in this block. */
export type ArticleCreateDraftContentStateBlocksDataUrlsList =
  Array<ArticleCreateDraftContentStateBlocksDataCashtags>;
export const ArticleCreateDraftContentStateBlocksDataUrlsList =
  /*@__PURE__*/ S.Array(
    ArticleCreateDraftContentStateBlocksDataCashtags,
  ) as any as S.Schema<ArticleCreateDraftContentStateBlocksDataUrlsList>;

export interface ArticleCreateDraftContentStateBlocksData {
  /** Cashtag spans in this block. */
  cashtags?: ArticleCreateDraftContentStateBlocksDataCashtagsList;
  /** Hashtag spans in this block. */
  hashtags?: ArticleCreateDraftContentStateBlocksDataHashtagsList;
  /** Mention spans in this block. */
  mentions?: ArticleCreateDraftContentStateBlocksDataMentionsList;
  /** URL spans in this block. */
  urls?: ArticleCreateDraftContentStateBlocksDataUrlsList;
}
export const ArticleCreateDraftContentStateBlocksData = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      cashtags: S.optional(
        ArticleCreateDraftContentStateBlocksDataCashtagsList,
      ),
      hashtags: S.optional(
        ArticleCreateDraftContentStateBlocksDataHashtagsList,
      ),
      mentions: S.optional(
        ArticleCreateDraftContentStateBlocksDataMentionsList,
      ),
      urls: S.optional(ArticleCreateDraftContentStateBlocksDataUrlsList),
    }),
).annotate({
  identifier: "ArticleCreateDraftContentStateBlocksData",
}) as any as S.Schema<ArticleCreateDraftContentStateBlocksData>;

export interface ArticleCreateDraftContentStateBlocksEntityRanges {
  /** Index into the entities array. */
  key: number;
  /** Length of the entity range. */
  length: number;
  /** Start offset in the text. */
  offset: number;
}
export const ArticleCreateDraftContentStateBlocksEntityRanges =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      key: S.Number,
      length: S.Number,
      offset: S.Number,
    }),
  ).annotate({
    identifier: "ArticleCreateDraftContentStateBlocksEntityRanges",
  }) as any as S.Schema<ArticleCreateDraftContentStateBlocksEntityRanges>;

/** References to entries in entities. */
export type ArticleCreateDraftContentStateBlocksEntityRangesList =
  Array<ArticleCreateDraftContentStateBlocksEntityRanges>;
export const ArticleCreateDraftContentStateBlocksEntityRangesList =
  /*@__PURE__*/ S.Array(
    ArticleCreateDraftContentStateBlocksEntityRanges,
  ) as any as S.Schema<ArticleCreateDraftContentStateBlocksEntityRangesList>;

/** The inline style. */
export type ArticleCreateDraftContentStateBlocksInlineStyleRangesStyle =
  | "bold"
  | "italic"
  | "strikethrough";
export const ArticleCreateDraftContentStateBlocksInlineStyleRangesStyle =
  /*@__PURE__*/ S.String;

export interface ArticleCreateDraftContentStateBlocksInlineStyleRanges {
  /** Length of the styled range. */
  length: number;
  /** Start offset in the text. */
  offset: number;
  /** The inline style. */
  style:
    | ArticleCreateDraftContentStateBlocksInlineStyleRangesStyle
    | (string & {});
}
export const ArticleCreateDraftContentStateBlocksInlineStyleRanges =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      length: S.Number,
      offset: S.Number,
      style: ArticleCreateDraftContentStateBlocksInlineStyleRangesStyle,
    }),
  ).annotate({
    identifier: "ArticleCreateDraftContentStateBlocksInlineStyleRanges",
  }) as any as S.Schema<ArticleCreateDraftContentStateBlocksInlineStyleRanges>;

/** Inline formatting ranges. */
export type ArticleCreateDraftContentStateBlocksInlineStyleRangesList =
  Array<ArticleCreateDraftContentStateBlocksInlineStyleRanges>;
export const ArticleCreateDraftContentStateBlocksInlineStyleRangesList =
  /*@__PURE__*/ S.Array(
    ArticleCreateDraftContentStateBlocksInlineStyleRanges,
  ) as any as S.Schema<ArticleCreateDraftContentStateBlocksInlineStyleRangesList>;

/** The block type. Use atomic for non-text embeds (image, post, markdown, divider, latex). */
export type ArticleCreateDraftContentStateBlocksType =
  | "unstyled"
  | "header-one"
  | "header-two"
  | "header-three"
  | "unordered-list-item"
  | "ordered-list-item"
  | "blockquote"
  | "atomic";
export const ArticleCreateDraftContentStateBlocksType = /*@__PURE__*/ S.String;

export interface ArticleCreateDraftContentStateBlocks {
  /** Block-level metadata for mentions, hashtags, cashtags, and URLs. */
  data?: ArticleCreateDraftContentStateBlocksData;
  /** References to entries in entities. */
  entity_ranges?: ArticleCreateDraftContentStateBlocksEntityRangesList;
  /** Inline formatting ranges. */
  inline_style_ranges?: ArticleCreateDraftContentStateBlocksInlineStyleRangesList;
  /** Optional block key. */
  key?: string;
  /** The text content of this block. For latex entities, this holds the LaTeX source; for divider/markdown/image/post atomic placeholders, typically a single space. */
  text: string;
  /** The block type. Use atomic for non-text embeds (image, post, markdown, divider, latex). */
  type: ArticleCreateDraftContentStateBlocksType | (string & {});
}
export const ArticleCreateDraftContentStateBlocks = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      data: S.optional(ArticleCreateDraftContentStateBlocksData),
      entity_ranges: S.optional(
        ArticleCreateDraftContentStateBlocksEntityRangesList,
      ),
      inline_style_ranges: S.optional(
        ArticleCreateDraftContentStateBlocksInlineStyleRangesList,
      ),
      key: S.optional(S.String),
      text: S.String,
      type: ArticleCreateDraftContentStateBlocksType,
    }),
).annotate({
  identifier: "ArticleCreateDraftContentStateBlocks",
}) as any as S.Schema<ArticleCreateDraftContentStateBlocks>;

/** The text blocks that make up the article body. */
export type ArticleCreateDraftContentStateBlocksList =
  Array<ArticleCreateDraftContentStateBlocks>;
export const ArticleCreateDraftContentStateBlocksList = /*@__PURE__*/ S.Array(
  ArticleCreateDraftContentStateBlocks,
) as any as S.Schema<ArticleCreateDraftContentStateBlocksList>;

export interface ArticleCreateDraftContentStateEntitiesValueDataMediaItems {
  media_category: string;
  media_id: string;
}
export const ArticleCreateDraftContentStateEntitiesValueDataMediaItems =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      media_category: S.String,
      media_id: S.String,
    }),
  ).annotate({
    identifier: "ArticleCreateDraftContentStateEntitiesValueDataMediaItems",
  }) as any as S.Schema<ArticleCreateDraftContentStateEntitiesValueDataMediaItems>;

/** Media keys. Used with type image. */
export type ArticleCreateDraftContentStateEntitiesValueDataMediaItemsList =
  Array<ArticleCreateDraftContentStateEntitiesValueDataMediaItems>;
export const ArticleCreateDraftContentStateEntitiesValueDataMediaItemsList =
  /*@__PURE__*/ S.Array(
    ArticleCreateDraftContentStateEntitiesValueDataMediaItems,
  ) as any as S.Schema<ArticleCreateDraftContentStateEntitiesValueDataMediaItemsList>;

export interface ArticleCreateDraftContentStateEntitiesValueData {
  /** Caption text. */
  caption?: string;
  /** Opaque entity key. Used with type emoji (and reserved for other keyed embeds) to match in-app Articles composer payloads. */
  entity_key?: string;
  /** Markdown body for type markdown. Use fenced code blocks (```lang ... ```) for code. Max weighted length is enforced by the Articles backend (10,000 per article). */
  markdown?: string;
  /** Media keys. Used with type image. */
  media_items?: ArticleCreateDraftContentStateEntitiesValueDataMediaItemsList;
  /** The ID of the post to embed. Used with type post. */
  post_id?: string;
  /** The URL. Used with type link. */
  url?: string;
}
export const ArticleCreateDraftContentStateEntitiesValueData =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      caption: S.optional(S.String),
      entity_key: S.optional(S.String),
      markdown: S.optional(S.String),
      media_items: S.optional(
        ArticleCreateDraftContentStateEntitiesValueDataMediaItemsList,
      ),
      post_id: S.optional(S.String),
      url: S.optional(S.String),
    }),
  ).annotate({
    identifier: "ArticleCreateDraftContentStateEntitiesValueData",
  }) as any as S.Schema<ArticleCreateDraftContentStateEntitiesValueData>;

/** Whether the entity can be edited. Recommended: immutable for post, image, divider, latex; mutable for link and markdown (matches the in-app Articles composer). */
export type ArticleCreateDraftContentStateEntitiesValueMutability =
  | "immutable"
  | "mutable"
  | "segmented";
export const ArticleCreateDraftContentStateEntitiesValueMutability =
  /*@__PURE__*/ S.String;

/** The entity type. markdown carries code blocks, GFM tables, and other Markdown; emoji maps to backend TWEMOJI (Twemoji is internal); divider is a horizontal rule; latex renders TeX from the block text. Tables are not a separate enum value — use type markdown with a pipe table in data.markdown. */
export type ArticleCreateDraftContentStateEntitiesValueType =
  | "post"
  | "link"
  | "image"
  | "emoji"
  | "markdown"
  | "divider"
  | "latex";
export const ArticleCreateDraftContentStateEntitiesValueType =
  /*@__PURE__*/ S.String;

export interface ArticleCreateDraftContentStateEntitiesValue {
  /** Entity payload. Fields depend on the entity type: post_id (post), url (link), media_items (image), entity_key (emoji and other opaque keys), markdown (markdown / code blocks / GFM tables). divider and latex use an empty data object; latex source is the block text; emoji uses block text for the character(s). There is no separate table entity type in article storage; tables are markdown. */
  data: ArticleCreateDraftContentStateEntitiesValueData;
  /** Whether the entity can be edited. Recommended: immutable for post, image, divider, latex; mutable for link and markdown (matches the in-app Articles composer). */
  mutability:
    | ArticleCreateDraftContentStateEntitiesValueMutability
    | (string & {});
  /** The entity type. markdown carries code blocks, GFM tables, and other Markdown; emoji maps to backend TWEMOJI (Twemoji is internal); divider is a horizontal rule; latex renders TeX from the block text. Tables are not a separate enum value — use type markdown with a pipe table in data.markdown. */
  type: ArticleCreateDraftContentStateEntitiesValueType | (string & {});
}
export const ArticleCreateDraftContentStateEntitiesValue =
  /*@__PURE__*/ S.suspend(() =>
    S.Struct({
      data: ArticleCreateDraftContentStateEntitiesValueData,
      mutability: ArticleCreateDraftContentStateEntitiesValueMutability,
      type: ArticleCreateDraftContentStateEntitiesValueType,
    }),
  ).annotate({
    identifier: "ArticleCreateDraftContentStateEntitiesValue",
  }) as any as S.Schema<ArticleCreateDraftContentStateEntitiesValue>;

export interface ArticleCreateDraftContentStateEntities {
  /** The entity key referenced by entity_ranges. */
  key: string;
  value: ArticleCreateDraftContentStateEntitiesValue;
}
export const ArticleCreateDraftContentStateEntities = /*@__PURE__*/ S.suspend(
  () =>
    S.Struct({
      key: S.String,
      value: ArticleCreateDraftContentStateEntitiesValue,
    }),
).annotate({
  identifier: "ArticleCreateDraftContentStateEntities",
}) as any as S.Schema<ArticleCreateDraftContentStateEntities>;

/** Non-text entities referenced by blocks (links, embedded posts, images, emoji, markdown/code/tables, dividers, LaTeX). Full set matches article storage. */
export type ArticleCreateDraftContentStateEntitiesList =
  Array<ArticleCreateDraftContentStateEntities>;
export const ArticleCreateDraftContentStateEntitiesList = /*@__PURE__*/ S.Array(
  ArticleCreateDraftContentStateEntities,
) as any as S.Schema<ArticleCreateDraftContentStateEntitiesList>;

export interface ArticleCreateDraftContentState {
  /** The text blocks that make up the article body. */
  blocks: ArticleCreateDraftContentStateBlocksList;
  /** Non-text entities referenced by blocks (links, embedded posts, images, emoji, markdown/code/tables, dividers, LaTeX). Full set matches article storage. */
  entities: ArticleCreateDraftContentStateEntitiesList;
}
export const ArticleCreateDraftContentState = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    blocks: ArticleCreateDraftContentStateBlocksList,
    entities: ArticleCreateDraftContentStateEntitiesList,
  }),
).annotate({
  identifier: "ArticleCreateDraftContentState",
}) as any as S.Schema<ArticleCreateDraftContentState>;

export interface ArticleCreateDraftCoverMedia {
  /** The media category (e.g. tweet_image). */
  media_category: string;
  /** The media ID from the media upload endpoint. */
  media_id: string;
}
export const ArticleCreateDraftCoverMedia = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    media_category: S.String,
    media_id: S.String,
  }),
).annotate({
  identifier: "ArticleCreateDraftCoverMedia",
}) as any as S.Schema<ArticleCreateDraftCoverMedia>;

export interface ArticleCreateDraftRequest {
  /** DraftJS content state representing the article body. Special formatting (markdown/code/tables, dividers, LaTeX, emoji, images, embedded posts) uses atomic blocks with entity_ranges pointing into entities. */
  content_state: ArticleCreateDraftContentState;
  /** Optional cover media for the Article. */
  cover_media?: ArticleCreateDraftCoverMedia;
  /** The title of the Article. */
  title: string;
}
export const ArticleCreateDraftRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    content_state: ArticleCreateDraftContentState,
    cover_media: S.optional(ArticleCreateDraftCoverMedia),
    title: S.String,
  }).pipe(T.Http({ method: "POST", uri: "/2/articles/draft", code: 200 })),
).annotate({
  identifier: "ArticleCreateDraftRequest",
}) as any as S.Schema<ArticleCreateDraftRequest>;

export interface ArticleCreateDraftResponseData {
  /** Unique identifier of the created draft Article. */
  id: string;
  /** The title of the draft Article. */
  title: string;
}
export const ArticleCreateDraftResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    id: S.String,
    title: S.String,
  }),
).annotate({
  identifier: "ArticleCreateDraftResponseData",
}) as any as S.Schema<ArticleCreateDraftResponseData>;

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
export type ArticleCreateDraftResponseErrorsList = Array<Problem>;
export const ArticleCreateDraftResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<ArticleCreateDraftResponseErrorsList>;

export interface ArticleCreateDraftResponse {
  data?: ArticleCreateDraftResponseData;
  errors?: ArticleCreateDraftResponseErrorsList;
}
export const ArticleCreateDraftResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(ArticleCreateDraftResponseData),
    errors: S.optional(ArticleCreateDraftResponseErrorsList),
  }),
).annotate({
  identifier: "ArticleCreateDraftResponse",
}) as any as S.Schema<ArticleCreateDraftResponse>;

export interface ArticlePublishRequest {
  article_id: string;
}
export const ArticlePublishRequest = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    article_id: S.String.pipe(T.Label()),
  }).pipe(
    T.Http({
      method: "POST",
      uri: "/2/articles/{article_id}/publish",
      code: 200,
    }),
  ),
).annotate({
  identifier: "ArticlePublishRequest",
}) as any as S.Schema<ArticlePublishRequest>;

export interface ArticlePublishResponseData {
  /** The ID of the post created for the published Article. */
  post_id: string;
}
export const ArticlePublishResponseData = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    post_id: S.String,
  }),
).annotate({
  identifier: "ArticlePublishResponseData",
}) as any as S.Schema<ArticlePublishResponseData>;

export type ArticlePublishResponseErrorsList = Array<Problem>;
export const ArticlePublishResponseErrorsList = /*@__PURE__*/ S.Array(
  Problem,
) as any as S.Schema<ArticlePublishResponseErrorsList>;

export interface ArticlePublishResponse {
  data?: ArticlePublishResponseData;
  errors?: ArticlePublishResponseErrorsList;
}
export const ArticlePublishResponse = /*@__PURE__*/ S.suspend(() =>
  S.Struct({
    data: S.optional(ArticlePublishResponseData),
    errors: S.optional(ArticlePublishResponseErrorsList),
  }),
).annotate({
  identifier: "ArticlePublishResponse",
}) as any as S.Schema<ArticlePublishResponse>;

export const articleCreateDraft = /*@__PURE__*/ makeOperation<
  ArticleCreateDraftRequest,
  ArticleCreateDraftResponse
>(
  operations.articleCreateDraft,
  () => ArticleCreateDraftRequest,
  () => ArticleCreateDraftResponse,
);

export const articlePublish = /*@__PURE__*/ makeOperation<
  ArticlePublishRequest,
  ArticlePublishResponse
>(
  operations.articlePublish,
  () => ArticlePublishRequest,
  () => ArticlePublishResponse,
);
