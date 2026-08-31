export interface XRateLimit {
  readonly limit?: number;
  readonly remaining?: number;
  readonly resetAt?: Date;
}

export interface XProblem {
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
  readonly [key: string]: unknown;
}

export interface XEnvelope<T> {
  readonly data?: T;
  readonly errors?: readonly XProblem[];
  readonly meta?: {
    readonly result_count?: number;
    readonly next_token?: string;
    readonly previous_token?: string;
    readonly total_subscriptions?: number;
    readonly [key: string]: unknown;
  };
  readonly includes?: unknown;
  readonly [key: string]: unknown;
}

export interface XResult<T> {
  readonly value: T;
  readonly status: number;
  readonly headers: Headers;
  readonly rateLimit?: XRateLimit;
}

export interface XWebhook {
  readonly id: string;
  readonly url: string;
  readonly valid: boolean;
  readonly created_at: string;
  readonly [key: string]: unknown;
}

export type XWebhookValidation =
  | {
      readonly valid: boolean;
      readonly attempted?: boolean;
      readonly [key: string]: unknown;
    }
  | {
      readonly attempted: boolean;
      readonly valid?: boolean;
      readonly [key: string]: unknown;
    };

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

export interface XActivityFilter {
  readonly user_id?: string;
  readonly keyword?: string;
  readonly direction?: "inbound" | "outbound";
  readonly qualifiers?: Readonly<Record<string, string>>;
}

export interface XActivitySubscriptionInput {
  readonly event_type: XActivityEventType;
  readonly filter: XActivityFilter;
  readonly tag?: string;
  readonly webhook_id?: string;
}

export interface XActivitySubscription {
  readonly subscription_id: string;
  readonly event_type: XActivityEventType;
  readonly filter: XActivityFilter;
  readonly tag?: string;
  readonly webhook_id?: string;
  readonly created_at?: string;
  readonly updated_at?: string;
  readonly [key: string]: unknown;
}

export interface XUser {
  readonly id: string;
  readonly name?: string;
  readonly username?: string;
  readonly [key: string]: unknown;
}

export interface XAccountActivityDelivery {
  /** Most deliveries include this; OAuth revoke user_event payloads may not. */
  readonly for_user_id?: string;
  readonly tweet_create_events?: readonly unknown[];
  readonly tweet_delete_events?: readonly unknown[];
  readonly favorite_events?: readonly unknown[];
  readonly follow_events?: readonly unknown[];
  readonly block_events?: readonly unknown[];
  readonly mute_events?: readonly unknown[];
  readonly user_event?: unknown;
  readonly direct_message_events?: readonly unknown[];
  readonly direct_message_indicate_typing_events?: readonly unknown[];
  readonly direct_message_mark_read_events?: readonly unknown[];
  readonly [key: string]: unknown;
}

export interface XAccountActivitySubscriptions {
  readonly application_id?: string;
  readonly webhook_id?: string;
  readonly webhook_url?: string;
  readonly subscriptions?: readonly {
    readonly user_id: string;
  }[];
  readonly [key: string]: unknown;
}

export interface XAccountActivitySubscriptionStatus {
  readonly subscribed: boolean;
  readonly [key: string]: unknown;
}

export interface XActivityDelivery {
  readonly data: {
    readonly event_type: XActivityEventType;
    readonly event_uuid?: string;
    readonly filter?: XActivityFilter;
    readonly includes?: unknown;
    readonly payload?: unknown;
    readonly tag?: string;
    readonly [key: string]: unknown;
  };
  readonly errors?: readonly XProblem[];
  readonly [key: string]: unknown;
}

export interface XReplayJobDelivery {
  readonly replay_job_status: {
    readonly webhook_id: string;
    readonly job_state: string;
    readonly job_state_description?: string;
    readonly job_id: string;
    readonly [key: string]: unknown;
  };
  readonly [key: string]: unknown;
}

export interface XFilteredStreamDelivery {
  readonly data: {
    readonly id: string;
    readonly text?: string;
    readonly [key: string]: unknown;
  };
  readonly matching_rules: readonly {
    readonly id: string;
    readonly tag?: string;
    readonly [key: string]: unknown;
  }[];
  readonly includes?: unknown;
  readonly [key: string]: unknown;
}

export type XWebhookDelivery =
  | XAccountActivityDelivery
  | XActivityDelivery
  | XFilteredStreamDelivery
  | XReplayJobDelivery;
