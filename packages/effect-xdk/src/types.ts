export type XJsonPrimitive = boolean | number | string | null;

export interface XJsonObject {
  readonly [key: string]: XJsonValue;
}

export interface XJsonArray extends ReadonlyArray<XJsonValue> {}

export type XJsonValue = XJsonArray | XJsonObject | XJsonPrimitive;

export interface XProblem extends XJsonObject {
  readonly type?: string;
  readonly title?: string;
  readonly detail?: string;
  readonly status?: number;
  readonly code?: number;
  readonly message?: string;
  readonly parameter?: string;
  readonly value?: string;
  readonly resource_id?: string;
  readonly resource_type?: string;
}

export type KnownXActivityEventType =
  | "profile.update.bio"
  | "profile.update.profile_picture"
  | "profile.update.banner_picture"
  | "profile.update.screenname"
  | "profile.update.geo"
  | "profile.update.url"
  | "profile.update.verified_badge"
  | "profile.update.affiliate_badge"
  | "profile.update.handle"
  | "news.new"
  | "follow.follow"
  | "follow.unfollow"
  | "spaces.start"
  | "spaces.end"
  | "broadcast.start"
  | "broadcast.end"
  | "broadcast.chat"
  | "chat.received"
  | "chat.sent"
  | "chat.conversation.join"
  | "chat.conversation_join"
  | "chat.conversation.member_added"
  | "chat.conversation.member_removed"
  | "chat.conversation.admin_added"
  | "chat.conversation.admin_removed"
  | "chat.update.group_name"
  | "chat.update.restrictions"
  | "dm.sent"
  | "dm.received"
  | "dm.indicate_typing"
  | "dm.read"
  | "post.create"
  | "post.delete"
  | "post.mention.create"
  | "post.reply.create"
  | "post.quote.create"
  | "post.repost.create"
  | "like.create"
  | "mute.mute"
  | "mute.unmute"
  | "block.block"
  | "block.unblock";

export type XActivityEventType =
  | KnownXActivityEventType
  | (string & Record<never, never>);

export interface XActivityFilter extends XJsonObject {
  readonly user_id?: string;
  readonly keyword?: string;
  readonly direction?: "inbound" | "outbound";
  readonly qualifiers?: Readonly<Record<string, string>>;
}

export interface XAccountActivityDelivery extends XJsonObject {
  /** Most deliveries include this; OAuth revoke user_event payloads may not. */
  readonly for_user_id?: string;
  readonly tweet_create_events?: XJsonArray;
  readonly tweet_delete_events?: XJsonArray;
  readonly favorite_events?: XJsonArray;
  readonly follow_events?: XJsonArray;
  readonly block_events?: XJsonArray;
  readonly mute_events?: XJsonArray;
  readonly user_event?: XJsonValue;
  readonly direct_message_events?: XJsonArray;
  readonly direct_message_indicate_typing_events?: XJsonArray;
  readonly direct_message_mark_read_events?: XJsonArray;
}

export interface XActivityDeliveryData extends XJsonObject {
  readonly event_type: XActivityEventType;
  readonly event_uuid?: string;
  readonly filter?: XActivityFilter;
  readonly includes?: XJsonValue;
  readonly payload?: XJsonValue;
  readonly tag?: string;
}

export interface XActivityDelivery extends XJsonObject {
  readonly data: XActivityDeliveryData;
  readonly errors?: readonly XProblem[];
}

export interface XReplayJobStatus extends XJsonObject {
  readonly webhook_id: string;
  readonly job_state: string;
  readonly job_state_description?: string;
  readonly job_id: string;
}

export interface XReplayJobDelivery extends XJsonObject {
  readonly replay_job_status: XReplayJobStatus;
}

export interface XFilteredStreamData extends XJsonObject {
  readonly id: string;
  readonly text?: string;
}

export interface XFilteredStreamMatchingRule extends XJsonObject {
  readonly id: string;
  readonly tag?: string;
}

export interface XFilteredStreamDelivery extends XJsonObject {
  readonly data: XFilteredStreamData;
  readonly matching_rules: readonly XFilteredStreamMatchingRule[];
  readonly includes?: XJsonValue;
}

export type XWebhookDelivery =
  | XAccountActivityDelivery
  | XActivityDelivery
  | XFilteredStreamDelivery
  | XReplayJobDelivery;
