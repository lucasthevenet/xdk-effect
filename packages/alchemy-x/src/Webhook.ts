import * as Effect from "effect/Effect";
import { isResolved, type Input, Resource } from "alchemy";
import { Unowned } from "alchemy/AdoptPolicy";
import * as Provider from "alchemy/Provider";
import { XDecodeError, type XWebhook } from "distilled-x";
import { XCredentials } from "./Credentials.ts";
import {
  callX,
  ignoreXNotFound,
  isXStatus,
  normalizeWebhookUrl,
  requireXData,
  XAdoptionRequired,
} from "./internal.ts";
import type * as X from "./Providers.ts";

export interface WebhookProps {
  /** Public HTTPS endpoint that receives CRC checks and signed deliveries. */
  readonly url: Input<string>;
  /** Re-run X's CRC validation when the existing registration is invalid. */
  readonly revalidateInvalid?: boolean;
  /**
   * Permit reconcile-time takeover of an exact, unowned URL match.
   *
   * Cold matches are still surfaced through Alchemy's normal adoption flow.
   * This flag is only needed for a registration that appears between read and
   * apply, or while replacing an already-owned webhook.
   */
  readonly adoptExisting?: boolean;
}

export interface WebhookAttributes {
  readonly webhookId: string;
  readonly url: string;
  readonly valid: boolean;
  readonly createdAt: string;
}

export interface Webhook extends Resource<
  "X.Webhook",
  WebhookProps,
  WebhookAttributes,
  never,
  X.Providers
> {}

/**
 * A project-wide X webhook registration.
 *
 * X immediately performs a CRC request when this resource is created, so the
 * receiver must already be publicly reachable. Most applications use
 * {@link import("./EventSource.ts").consumeEvents}, whose host adapter mounts
 * the receiver and registers this resource.
 *
 * @resource
 */
export const Webhook = Resource<Webhook>("X.Webhook");

const toAttributes = (webhook: XWebhook): WebhookAttributes => ({
  webhookId: webhook.id,
  url: webhook.url,
  valid: webhook.valid,
  createdAt: webhook.created_at,
});

const isResolvedStringInput = (
  value: Input<string> | undefined,
): value is string => typeof value === "string";

const refuseAdoption = (webhook: XWebhook, message: string) =>
  new XAdoptionRequired({
    resourceType: "X.Webhook",
    remoteId: webhook.id,
    message,
  });

const deleteWebhookRegistration = Effect.fn(function* (webhookId: string) {
  const { client } = yield* XCredentials;
  const deleted = yield* ignoreXNotFound(
    callX(() => client.webhooks.delete(webhookId)),
  );
  if (
    deleted &&
    (yield* requireXData(deleted, "confirming X webhook deletion")).deleted !==
      true
  ) {
    return yield* Effect.fail(
      new XDecodeError(
        "X did not confirm webhook deletion",
        deleted.status,
        JSON.stringify(deleted.value),
      ),
    );
  }
});

export const WebhookProvider = () =>
  Provider.succeed(Webhook, {
    diff: Effect.fn(({ olds, news, output }) =>
      Effect.sync(() => {
        if (!isResolved(news)) return;
        if (!isResolvedStringInput(news.url)) return;
        // A failed first create can persist unresolved upstream props as
        // `undefined`. Let Alchemy resume creation instead of trying to compare
        // an URL that never reached the provider.
        const currentUrl = output?.url ?? olds.url;
        if (!isResolvedStringInput(currentUrl)) return;
        if (normalizeWebhookUrl(news.url) !== normalizeWebhookUrl(currentUrl)) {
          // Reconcile performs the target collision check and then the
          // one-webhook tier's delete/create sequence as one provider action.
          // Letting the engine delete first would leave a TOCTOU gap between
          // this plan and apply where a foreign target could appear.
          return { action: "update" } as const;
        }
        return undefined;
      }),
    ),

    read: Effect.fn(function* ({ olds, output }) {
      if (!output) {
        if (!isResolvedStringInput(olds.url)) return undefined;
        const { client } = yield* XCredentials;
        const listed = yield* callX(() => client.webhooks.list());
        const webhooks = yield* requireXData(listed, "reading X webhooks");
        const url = normalizeWebhookUrl(olds.url);
        const existing = webhooks.find(
          (candidate) => normalizeWebhookUrl(candidate.url) === url,
        );
        return existing ? Unowned(toAttributes(existing)) : undefined;
      }
      const { client } = yield* XCredentials;
      const listed = yield* callX(() => client.webhooks.list());
      const webhooks = yield* requireXData(listed, "reading X webhooks");
      const webhook = webhooks.find(
        (candidate) => candidate.id === output.webhookId,
      );
      return webhook ? toAttributes(webhook) : undefined;
    }),

    reconcile: Effect.fn(function* ({ news, output }) {
      const { client } = yield* XCredentials;
      // SAFETY: Alchemy invokes reconcile only after resolving every Input.
      const url = normalizeWebhookUrl(news.url as string);
      const listed = yield* callX(() => client.webhooks.list());
      const webhooks = yield* requireXData(listed, "reconciling X webhooks");
      const mayAdopt = news.adoptExisting === true;
      const exact = webhooks.find(
        (candidate) => normalizeWebhookUrl(candidate.url) === url,
      );
      const owned = output
        ? webhooks.find((candidate) => candidate.id === output.webhookId)
        : undefined;

      const requireValid = Effect.fn(function* (webhook: XWebhook) {
        if (webhook.valid || news.revalidateInvalid === false) return webhook;
        yield* callX(() => client.webhooks.validate(webhook.id));
        const refreshed = yield* callX(() => client.webhooks.list());
        const validated = (yield* requireXData(
          refreshed,
          "confirming X webhook revalidation",
        )).find((candidate) => candidate.id === webhook.id);
        if (!validated?.valid) {
          return yield* Effect.fail(
            new XDecodeError(
              validated
                ? "X webhook remained invalid after creation and revalidation"
                : "X did not expose the created webhook after revalidation",
              refreshed.status,
              JSON.stringify(refreshed.value),
            ),
          );
        }
        return validated;
      });

      const createOwned = Effect.gen(function* () {
        const created = yield* callX(() =>
          client.webhooks.create({ url }),
        ).pipe(Effect.result);
        if (created._tag === "Success") {
          let webhook = yield* requireXData(
            created.success,
            "creating an X webhook",
          );
          if (normalizeWebhookUrl(webhook.url) !== url) {
            const refreshed = yield* callX(() => client.webhooks.list());
            const observed = (yield* requireXData(
              refreshed,
              "confirming the created X webhook URL",
            )).find((candidate) => candidate.id === webhook.id);
            if (!observed || normalizeWebhookUrl(observed.url) !== url) {
              return yield* Effect.fail(
                new XDecodeError(
                  "X did not expose the created webhook at the declared URL",
                  refreshed.status,
                  JSON.stringify(refreshed.value),
                ),
              );
            }
            webhook = observed;
          }
          return yield* requireValid(webhook);
        }

        const raced = yield* callX(() => client.webhooks.list());
        const replacement = (yield* requireXData(
          raced,
          "checking an X webhook creation race",
        )).find((candidate) => normalizeWebhookUrl(candidate.url) === url);
        if (replacement) {
          if (mayAdopt) return yield* requireValid(replacement);
          return yield* refuseAdoption(
            replacement,
            `X webhook ${replacement.id} appeared while this stack was creating ${url}. Refusing to infer ownership after the race. Re-run with Alchemy's normal adoption flow, or declare adoptExisting: true before a future race.`,
          );
        }
        return yield* Effect.fail(created.failure);
      });

      const reconcileOwned = Effect.fn(function* (ownedWebhook: XWebhook) {
        if (normalizeWebhookUrl(ownedWebhook.url) !== url) {
          if (exact && exact.id !== ownedWebhook.id) {
            if (!mayAdopt) {
              return yield* refuseAdoption(
                exact,
                `X webhook ${exact.id} already owns the replacement URL. The current webhook ${ownedWebhook.id} was left intact; set adoptExisting: true to take over the target.`,
              );
            }
            yield* deleteWebhookRegistration(ownedWebhook.id);
            return toAttributes(yield* requireValid(exact));
          }
          // Output-valued URLs can resolve only during apply, after planning
          // chose an update. Perform the same deliberate delete-first
          // replacement here after the target-collision preflight.
          yield* deleteWebhookRegistration(ownedWebhook.id);
          return toAttributes(yield* createOwned);
        }
        if (ownedWebhook.valid || news.revalidateInvalid === false) {
          return toAttributes(ownedWebhook);
        }

        const validated = yield* callX(() =>
          client.webhooks.validate(ownedWebhook.id),
        ).pipe(Effect.result);
        if (validated._tag === "Failure") {
          if (!isXStatus(validated.failure, 404)) {
            return yield* Effect.fail(validated.failure);
          }
          const afterDelete = yield* callX(() => client.webhooks.list());
          const replacement = (yield* requireXData(
            afterDelete,
            "checking an X webhook revalidation race",
          )).find((candidate) => normalizeWebhookUrl(candidate.url) === url);
          if (replacement) {
            if (mayAdopt) return toAttributes(yield* requireValid(replacement));
            return yield* refuseAdoption(
              replacement,
              `X webhook ${ownedWebhook.id} disappeared during revalidation and ${replacement.id} replaced it. Refusing to mutate or adopt the replacement.`,
            );
          }
          return toAttributes(yield* createOwned);
        }

        const refreshed = yield* callX(() => client.webhooks.list());
        const webhook = (yield* requireXData(
          refreshed,
          "confirming the reconciled X webhook",
        )).find((candidate) => candidate.id === ownedWebhook.id);
        if (!webhook?.valid) {
          return yield* Effect.fail(
            new XDecodeError(
              webhook
                ? "X webhook remained invalid after revalidation"
                : "X did not expose the revalidated webhook",
              refreshed.status,
              JSON.stringify(refreshed.value),
            ),
          );
        }
        return toAttributes(webhook);
      });

      if (!output && exact) {
        if (mayAdopt) return toAttributes(yield* requireValid(exact));
        return yield* new XAdoptionRequired({
          resourceType: "X.Webhook",
          remoteId: exact.id,
          message:
            `X webhook ${exact.id} appeared after the ownership check. ` +
            "Re-run with Alchemy's normal adoption flow if this stack should manage it; adoptExisting: true can pre-authorize future reconcile-time races.",
        });
      }
      if (output && !owned && exact) {
        if (mayAdopt) return toAttributes(yield* requireValid(exact));
        return yield* refuseAdoption(
          exact,
          `Owned X webhook ${output.webhookId} is missing, but webhook ${exact.id} now uses the desired URL. Refusing to take over the replacement without explicit adoption.`,
        );
      }
      if (!owned) return toAttributes(yield* createOwned);
      return yield* reconcileOwned(owned);
    }),

    list: Effect.fn(function* () {
      const { client } = yield* XCredentials;
      const listed = yield* callX(() => client.webhooks.list());
      return (yield* requireXData(listed, "listing X webhooks")).map(
        toAttributes,
      );
    }),

    delete: Effect.fn(function* ({ output }) {
      yield* deleteWebhookRegistration(output.webhookId);
    }),
  });
