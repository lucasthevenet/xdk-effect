import * as Hmac from "effect-xdk/Hmac";
import * as BrowserCrypto from "@effect/platform-browser/BrowserCrypto";
import * as Layer from "effect/Layer";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import { CredentialsStoreLive } from "alchemy/Auth/Credentials";
import { ProfileLive } from "alchemy/Auth/Profile";
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
 * Stored and environment credential resolution stays lazy so merely listing
 * or logging in to another provider never reads X secrets.
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
    Layer.provideMerge(FetchHttpClient.layer),
    Layer.provideMerge(BrowserCrypto.layer),
    Layer.provideMerge(Hmac.layerSubtle),
    Layer.provideMerge(Credentials.fromAuthProvider()),
    Layer.provideMerge(XAuth),
    Layer.provideMerge(ProfileLive),
    Layer.provideMerge(CredentialsStoreLive),
    Layer.orDie,
  );
