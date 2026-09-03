# `alchemy-x`

An X adapter for [Alchemy](https://alchemy.run/): stored or environment-backed X credentials, declarative webhook and activity-subscription resources, automatic X webhook registration, and a portable lower-level X client.

## Packages

| Package | Use it for |
| --- | --- |
| [`alchemy-x`](./packages/alchemy-x/README.md) | Alchemy providers, stored/environment authentication, resources, and host-adapted X event consumption |
| [`distilled-x`](./packages/distilled-x/README.md) | Spec-generated Effect-native X SDK, OAuth1 signing, app-token exchange, OAuth2/PKCE, and webhook cryptography |

## Install

For an Alchemy stack:

```sh
bun add alchemy-x alchemy effect
```

The Cloudflare event adapter also needs Alchemy's current Node-side deployment
runtime:

```sh
bun add @effect/platform-node
```

For the portable client only:

```sh
bun add distilled-x effect
```

## Alchemy setup

Register the adapter's provider Layer on the stack. Merge it with the deployment host's providers when the stack uses more than one provider:

```ts
import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as X from "alchemy-x";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

export default Alchemy.Stack(
  "Social",
  {
    providers: Layer.mergeAll(Cloudflare.providers(), X.providers()),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    // Declare X resources or a host-adapted X event consumer here.
  }),
);
```

`X.providers()` includes the `Webhook`, `ActivitySubscription`, and
`AccountActivitySubscription` lifecycle providers, the X credential bridge,
and an X Auth Provider with stored and environment-variable methods. This
follows Alchemy's [provider Layer](https://alchemy.run/infrastructure-as-code/provider/)
and [Auth Provider](https://alchemy.run/environments/auth-providers/)
conventions.

## Authenticate

Create an app in the X Developer Console and generate the OAuth 1.0a access
token and secret for the account that owns it. Alchemy accepts one credential
set: API key, API secret, access token, and access token secret.

For local use, run:

```sh
bunx alchemy login
```

Choose **Stored Credentials** for X and paste the four values. Alchemy stores
them under `~/.alchemy/credentials/<profile>/`. To replace existing or legacy
OAuth2 credentials, run `bunx alchemy login --configure`.

Alternatively, choose **Environment Variables** and supply:

```sh
X_API_KEY=...
X_API_SECRET=...
X_ACCESS_TOKEN=...
X_ACCESS_TOKEN_SECRET=...
```

For a new CI profile, set `CI=1` and these four variables; Alchemy selects the
environment method without prompting. Existing profiles keep their selected
method.

User-context requests are signed with OAuth1. When an app-context operation
needs a Bearer token, `distilled-x` obtains it from X using the API key and
secret and caches it internally. No separate `X_BEARER_TOKEN`, OAuth2 client
settings, browser authorization, or refresh-token setup is needed.
The API secret also signs webhook CRC responses and verifies deliveries.
See [X's own-account credentials](https://docs.x.com/fundamentals/authentication/oauth-1-0a/overview)
and [app-token exchange](https://docs.x.com/fundamentals/authentication/oauth-2-0/application-only).

This restriction applies only to Alchemy authentication. `distilled-x` keeps
explicit app/user Bearer authentication and all OAuth2/PKCE helpers.
See the [authentication reference](./packages/alchemy-x/README.md#authentication).

## Automatic webhook registration

`X.consumeEvents` declares the remote X resources and delegates hosting to an
event-source adapter. For a Cloudflare Worker, provide
`XCloudflare.EventSourceLive`; application code does not construct an HTTP
router or pass the Worker's public URL or consumer secret.

```ts
import * as Cloudflare from "alchemy/Cloudflare";
import * as X from "alchemy-x";
import * as XCloudflare from "alchemy-x/Cloudflare";
import * as Effect from "effect/Effect";
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse";

const worker = yield* Cloudflare.Worker(
  "XEvents",
  { main: import.meta.url },
  Effect.gen(function* () {
    yield* X.consumeEvents(
      {
        name: "AccountEvents",
        path: "/api/x/webhook",
        accountActivity: true,
        activity: [
          {
            name: "mentions",
            eventType: "post.mention.create",
            filter: { user_id: "123456789" },
          },
        ],
      },
      (event) =>
        Effect.logInfo("Received an X event", {
          kind: event.kind,
          delivery: event.delivery,
        }),
    );

    return {
      fetch: Effect.succeed(HttpServerResponse.text("Alchemy X worker")),
    };
  }).pipe(Effect.provide(XCloudflare.EventSourceLive)),
);
```

The Cloudflare adapter owns the Worker URL and event path, safely binds the
API/consumer secret, answers X's CRC challenge, and verifies
`x-twitter-webhooks-signature` against the untouched raw request body before
decoding. It also provisions the selected granular X Activity subscriptions
and/or the authenticated user's Account Activity subscription. The handler
receives a discriminated `{ kind, delivery }` value.
The current kinds are `activity`, `account_activity`, `filtered_stream`, and
`replay_job`.

Calling `X.consumeEvents(handler)` alone mounts and registers the verified
receiver but does **not** enroll the user associated with `X_ACCESS_TOKEN` in
Account Activity. Set `accountActivity: true` explicitly, or declare one or more
`activity` entries.
The available high-level options are `name`, `accountActivity`, `activity`,
`path`, and `maxBodyBytes`; `name` controls the stable logical identity of the
managed resources. Choose it before the first persistent deployment and keep it
unchanged. Without `name`, the Cloudflare adapter namespaces those resources
under the Worker, so renaming that Worker also changes their Alchemy identity.
Because X exposes an app-wide webhook singleton, do not adopt the replacement
while the old identity is pending deletion. Changing either identity requires
an adapter-level Alchemy rename alias; without one, remove and deploy the old
source before recreating it in a second deploy. See the complete
[`examples/cloudflare-worker`](./examples/cloudflare-worker) integration.

`EventSourceLive` can coexist with the Worker's returned `fetch` handler. It
claims the configured X event path and excludes that path from Alchemy's default
`Worker.serve` listener, while requests on other paths (and requests whose path
cannot be parsed by the event source) fall through to the returned handler.
Fetch listeners registered directly with `Worker.listen` are not filtered by
this exclusion; guard the X event path yourself if you add one.

When migrating from `X.WebhookRoute(name, options, handler)` or its old
`X.events` alias, set `name` to that same logical name and keep the previous
effective canonical path. In particular, explicitly set
`path: "/api/x/webhook"` if the old route omitted `path`; that was its default.
If it used a relative path such as `api/x/webhook`, add the normalized leading
slash. Keeping both values preserves the Alchemy resource identities; keeping
the Worker on the same public host also preserves the webhook URL.

X performs CRC immediately when the webhook is registered. The adapter uses the
Worker URL `Output` to make host deployment a prerequisite of registration. X
webhook URLs cannot use an explicit port and must acknowledge deliveries within
ten seconds. See the [X webhook introduction](https://docs.x.com/x-api/webhooks/introduction)
and [quickstart](https://docs.x.com/x-api/webhooks/quickstart).

## Direct resources

Use the resources directly when the receiving endpoint is already deployed:

```ts
const webhook = yield* X.Webhook("Events", {
  url: "https://x-events.example.com/api/x/webhook",
});

yield* X.ActivitySubscription("Mentions", {
  eventType: "post.mention.create",
  filter: { user_id: "123456789" },
  webhookId: webhook.webhookId,
});

yield* X.AccountActivitySubscription("MyAccount", {
  webhookId: webhook.webhookId,
  userId: yield* X.currentUserId,
});
```

Changing a webhook URL replaces the X registration. Pay Per Use currently permits one webhook, so the provider deliberately deletes the old webhook before creating the new one; expect a brief delivery gap if the URL changes. A cold exact match is reported as unowned and requires Alchemy's explicit adoption flow rather than being silently claimed. `adoptExisting: true` is a persistent, resource-level escape hatch only for an exact unowned match discovered during reconcile (including a replacement target); it does not bypass Alchemy's normal cold-resource `adopt(true)`/`--adopt` gate.

## Access and billing caveats

- X Activity is the granular product used by `ActivitySubscription`. It supports event/filter pairs and bills webhook events by event type; current prices and subscription limits are documented by X in the [X Activity overview](https://docs.x.com/x-api/activity/introduction) and [pricing guide](https://docs.x.com/x-api/getting-started/pricing).
- Account Activity is the all-events product used by `AccountActivitySubscription`. X documents it as available only to Pay Per Use and Enterprise accounts; Pay Per Use currently allows three unique user subscriptions and one webhook. See the [Account Activity overview](https://docs.x.com/x-api/account-activity/introduction).
- The Alchemy provider uses OAuth 1.0a for user operations and internally obtained app-only tokens for app operations. Authentication does not grant product access or app permissions; configure the X app for the operations you need.

## Development

```sh
bun install
bun run check
```

Unit tests use mock X transports. Gated live tests require a funded/entitled X app and explicit credentials:

```sh
bun run test:live
```

Review X usage before running live tests because subscription and delivered-event operations may consume paid API credits.

The command is read-only unless `X_LIVE_MUTATE=1` and `X_LIVE_WEBHOOK_ID` are also set; that opt-in uses the configured OAuth 1.0a credentials to run the Account Activity create/check/delete proof against the selected non-production webhook.
