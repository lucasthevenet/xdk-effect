import * as Layer from "effect/Layer";
import { CredentialsStoreLive, ProfileLive } from "alchemy/Auth";
import * as Provider from "alchemy/Provider";
import {
  AccountActivitySubscription,
  AccountActivitySubscriptionProvider,
} from "./AccountActivitySubscription.ts";
import {
  ActivitySubscription,
  ActivitySubscriptionProvider,
} from "./ActivitySubscription.ts";
import { XAuth } from "./AuthProvider.ts";
import * as Credentials from "./Credentials.ts";
import { Webhook, WebhookProvider } from "./Webhook.ts";

export { XCredentials, XCredentialsContext } from "./Credentials.ts";

export class Providers extends Provider.ProviderCollection<Providers>()("X") {}

export type ProviderRequirements = Layer.Services<ReturnType<typeof providers>>;

/**
 * X lifecycle providers plus the AuthProvider discovered by `alchemy login`.
 * Credential resolution stays lazy so merely listing or logging in to another
 * provider never starts X OAuth.
 */
export const providers = () =>
  Layer.effect(
    Providers,
    Provider.collection([
      Webhook,
      ActivitySubscription,
      AccountActivitySubscription,
    ]),
  ).pipe(
    Layer.provide(
      Layer.mergeAll(
        WebhookProvider(),
        ActivitySubscriptionProvider(),
        AccountActivitySubscriptionProvider(),
      ),
    ),
    Layer.provideMerge(Credentials.fromAuthProvider()),
    Layer.provideMerge(XAuth),
    Layer.provideMerge(ProfileLive),
    Layer.provideMerge(CredentialsStoreLive),
    Layer.orDie,
  );
