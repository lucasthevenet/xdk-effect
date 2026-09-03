import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Predicate from "effect/Predicate";
import type {
  XAccountActivityDelivery,
  XActivityDelivery,
  XActivityEventType,
  XActivityFilter,
  XAuthKind,
  XFilteredStreamDelivery,
  XReplayJobDelivery,
} from "effect-xdk";

export interface EventSourceActivity {
  /** Stable logical key. Required only when two entries share event/filter. */
  readonly name?: string;
  readonly eventType: XActivityEventType;
  readonly filter: XActivityFilter;
  readonly tag?: string;
  readonly auth?: XAuthKind;
}

export interface EventSourceOptions {
  /**
   * Stable logical name for the managed webhook resources.
   * Preserve the first `WebhookRoute` argument here when migrating.
   * Recommended for persistent deployments and immutable once deployed.
   */
  readonly name?: string;
  /** Granular X Activity subscriptions attached to the managed webhook. */
  readonly activity?: readonly EventSourceActivity[];
  /** Attach the authenticated OAuth user to full Account Activity. */
  readonly accountActivity?: boolean;
  /** Exact path claimed on the host. @default /__alchemy/x/events */
  readonly path?: string;
  /** Maximum signed delivery size. @default 5 MiB */
  readonly maxBodyBytes?: number;
}

export type XEvent =
  | {
      readonly kind: "activity";
      readonly delivery: XActivityDelivery;
    }
  | {
      readonly kind: "account_activity";
      readonly delivery: XAccountActivityDelivery;
    }
  | {
      readonly kind: "filtered_stream";
      readonly delivery: XFilteredStreamDelivery;
    }
  | {
      readonly kind: "replay_job";
      readonly delivery: XReplayJobDelivery;
    };

export type EventHandler<E = never, R = never> = (
  event: XEvent,
) => Effect.Effect<void, E, R>;

export type EventSourceService = <E = never, R = never>(
  options: EventSourceOptions,
  handler: EventHandler<E, R>,
) => Effect.Effect<void, never, R>;

export class EventSource extends Context.Service<
  EventSource,
  EventSourceService
>()("X.EventSource") {}

export function consumeEvents<E = never, R = never>(
  handler: EventHandler<E, R>,
): Effect.Effect<void, never, EventSource | R>;
export function consumeEvents<E = never, R = never>(
  options: EventSourceOptions,
  handler: EventHandler<E, R>,
): Effect.Effect<void, never, EventSource | R>;
export function consumeEvents<E = never, R = never>(
  optionsOrHandler: EventSourceOptions | EventHandler<E, R>,
  maybeHandler?: EventHandler<E, R>,
): Effect.Effect<void, never, EventSource | R> {
  if (Predicate.isFunction(optionsOrHandler)) {
    return EventSource.use((source) => source({}, optionsOrHandler));
  }
  if (maybeHandler === undefined) {
    return Effect.die(
      new TypeError("X.consumeEvents requires an event handler"),
    );
  }
  return EventSource.use((source) => source(optionsOrHandler, maybeHandler));
}

/** Concise alias for {@link consumeEvents}. */
export { consumeEvents as events };
