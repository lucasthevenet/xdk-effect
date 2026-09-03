# `alchemy-x`

Alchemy v2 providers for stored or environment-backed X credentials, project webhooks, granular X Activity subscriptions, full Account Activity subscriptions, and verified host-adapted event consumption.

## Install

```sh
bun add alchemy-x alchemy effect
```

`alchemy` and `effect` are peer dependencies. `distilled-x`, the portable API and cryptography layer, is installed by `alchemy-x`.

When using `alchemy-x/Cloudflare` with the current Alchemy beta, also install
the deployment runtime with `bun add @effect/platform-node`.

## Primary API

| Export | Purpose |
| --- | --- |
| `providers()`, `Providers` | Register the X resource collection, credentials bridge, and stored/environment Auth Provider |
| `Webhook` | Manage an app-scoped X webhook registration |
| `ActivitySubscription` | Manage a granular X Activity event/filter subscription |
| `AccountActivitySubscription` | Manage the authenticated user's full Account Activity subscription |
| `consumeEvents`, `EventSource` | Consume verified X events and automatically declare the selected remote resources |
| `XAuth`, `makeXAuth` | Default or custom stored/environment X Auth Provider registration Layer |
| `XCredentials`, `XCredentialsContext` | Flattened credential Effect accessor and its provided Context tag |
| `SdkCredentials` | Lazily bridge Alchemy credentials into the native Distilled-style SDK |
| `fromCredentials`, `fromEnv`, `fromAuthProvider` | Programmatic credential Layers; the Auth Provider path uses the selected profile method |
| `createXClient` | Create a client from literal or `Redacted` OAuth1 credentials |
| `Api` | The complete portable `distilled-x` API namespace |

The `alchemy-x/Cloudflare` entrypoint exports `EventSourceLive`, the production
Cloudflare Worker adapter for `consumeEvents`. The root package also exports
`X_AUTH_PROVIDER_NAME` and the related auth and credential types.

## Register the providers

Add `X.providers()` to the Alchemy stack. When the stack also deploys the webhook host, merge both provider Layers:

```ts
import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as X from "alchemy-x";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

export default Alchemy.Stack(
  "XApp",
  {
    providers: Layer.mergeAll(Cloudflare.providers(), X.providers()),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    // X resources and the webhook host go here.
  }),
);
```

Providers are Effect Layers in Alchemy; see [Alchemy's provider guide](https://alchemy.run/infrastructure-as-code/provider/). `X.providers()` supplies all X resource implementations, the credentials service, and an X Auth Provider with stored and environment-variable methods.

It also provides the native `distilled-x/Credentials` service from the same redacted OAuth1 credentials. Generated operations (for example, `getUsersMe` from `distilled-x/users`) additionally require an Effect `HttpClient`. Outside `providers()`, use `SdkCredentials.pipe(Layer.provide(fromCredentials(...)))` or provide `fromEnv()`/`fromAuthProvider()` instead. The bridge stays lazy and does not introduce another authentication method.

## Authentication

Alchemy accepts only **Access Token & Secret (OAuth 1.0a)** credentials, from
either stored values or environment variables:

| Credential | Purpose |
| --- | --- |
| API key | Identifies the developer app |
| API secret / consumer secret | Signs OAuth1 requests, obtains app-only tokens, and verifies webhook CRC/deliveries |
| Access token | Identifies the X account acting through the app |
| Access token secret | Signs OAuth1 requests together with the API secret |

### Configure the X app

Create an X developer app, configure its permissions for the intended operations,
and generate an access token and secret for the account that owns the app.
You do not need an OAuth2 Client ID, Client Secret, or browser callback for this
workflow. See [X's own-account OAuth1 setup](https://docs.x.com/fundamentals/authentication/oauth-1-0a/overview).
Product access and app permissions still apply; authentication alone does not
enable every event type.

### Stored authentication

Run `bunx alchemy login`, choose **Stored Credentials** for X, and paste the four
values. Alchemy records the method in `~/.alchemy/profiles.json` and stores the
credentials under `~/.alchemy/credentials/<profile>/`.

Run `bunx alchemy login --configure` to replace credentials. Old stored OAuth2
records are rejected with a reconfiguration hint; they are not silently
interpreted as OAuth1 credentials. Logout removes the local stored values,
without revoking X credentials or the app-wide token.

### Environment authentication

Choose **Environment Variables** and provide:

| Variable | Required | Meaning |
| --- | --- | --- |
| `X_API_KEY` | Yes | API/consumer key |
| `X_API_SECRET` | Yes | API/consumer secret |
| `X_ACCESS_TOKEN` | Yes | OAuth 1.0a user access token |
| `X_ACCESS_TOKEN_SECRET` | Yes | OAuth 1.0a user access token secret |

For a new CI profile, `CI=1` selects environment authentication without prompting.
Existing profiles retain their method. The environment method does not persist
secrets. OAuth2 settings such as `X_BEARER_TOKEN`, `X_CLIENT_ID`,
`X_ACCESS_TOKEN_EXPIRES_AT`, and `X_OAUTH_SCOPES` are not used by Alchemy.

### Internal authentication

The shared client signs user requests with OAuth1. For app requests, it exchanges
the API key and secret at `POST https://api.x.com/oauth2/token` using
`grant_type=client_credentials`. This is not the OAuth2 user-token endpoint
(`/2/oauth2/token`). No browser, consent callback, or separately supplied Bearer
token is involved. [X app-only authentication](https://docs.x.com/fundamentals/authentication/oauth-2-0/application-only)

App tokens are cached in memory per client and shared by concurrent requests.
A rejected derived token is discarded; safe requests may retry within the
configured attempt limit, but POSTs are not replayed unless explicitly enabled.
Failed exchanges are not cached. Credential resolution and login do not make
X API calls. Only the API secret is bound into the webhook receiver Worker.

`distilled-x` retains all authentication methods, including explicit app/user
Bearer tokens and OAuth2/PKCE helpers. The Alchemy credential methods do not
expose those additional choices.

## Automatic event consumption

`consumeEvents` is the high-level interface for a Worker that receives X
events. Its host adapter owns both halves of the integration:

- At deploy time, it derives the callback from the Worker URL and reconciles the
  X webhook plus any requested X Activity or Account Activity subscriptions.
- At runtime, it binds the API/consumer secret, handles CRC, enforces the body
  limit, and verifies `x-twitter-webhooks-signature` over the untouched raw body
  before decoding or invoking application code.

Provide the Cloudflare adapter once on the Worker's initialization Effect. No
`HttpRouter`, public origin, or secret plumbing is required.

```ts
import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as X from "alchemy-x";
import * as XCloudflare from "alchemy-x/Cloudflare";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse";

export default Alchemy.Stack(
  "XApp",
  {
    providers: Layer.mergeAll(Cloudflare.providers(), X.providers()),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const worker = yield* Cloudflare.Worker(
      "XEvents",
      { main: import.meta.url },
      Effect.gen(function* () {
        yield* X.consumeEvents(
          {
            name: "XEvents",
            path: "/api/x/webhook",
            accountActivity: true,
            activity: [
              {
                name: "mentions",
                eventType: "post.mention.create",
                filter: { user_id: "123456789" },
                auth: "user",
              },
              {
                name: "profile-bio",
                eventType: "profile.update.bio",
                filter: { user_id: "123456789" },
                auth: "app",
              },
            ],
          },
          (event) =>
            Effect.logInfo("Verified X event", {
              kind: event.kind,
              delivery: event.delivery,
            }),
        );

        return {
          fetch: Effect.succeed(HttpServerResponse.text("Alchemy X worker")),
        };
      }).pipe(Effect.provide(XCloudflare.EventSourceLive)),
    );

    return { url: worker.url };
  }),
);
```

The handler receives a discriminated `{ kind, delivery }` event. The current
kinds are `activity`, `account_activity`, `filtered_stream`, and `replay_job`.
Account Activity is deliberately opt-in: `X.consumeEvents(handler)` mounts the
verified receiver and manages its webhook, but does not subscribe the user
associated with `X_ACCESS_TOKEN`. Set `accountActivity: true` explicitly when
the full account feed is required.

### `consumeEvents` options

| Option | Description |
| --- | --- |
| `name` | Stable logical name for the managed webhook and subscriptions. Recommended for persistent deployments; keep it immutable. Set it to the prior `WebhookRoute`/`events` name when migrating. |
| `path` | Canonical path claimed by the host adapter; defaults to `/__alchemy/x/events`. Dot segments, duplicate slashes, queries, and fragments are rejected. |
| `activity` | One or more granular `{ name?, eventType, filter, tag?, auth? }` subscriptions. `name` stabilizes identity and is required for duplicate event/filter entries. |
| `accountActivity` | Add full Account Activity for the user associated with `X_ACCESS_TOKEN`. It is not enabled by the handler-only overload. |
| `maxBodyBytes` | Maximum signed delivery size; defaults to 5 MiB. Oversized bodies receive `413`. |

Without `name`, the Cloudflare adapter namespaces remote resource state under
the Worker. Renaming that Worker then changes the resource FQNs. Because X
exposes an app-wide webhook singleton, do not adopt the replacement while the
old FQN is pending deletion; choose a stable name up front. Changing an existing
identity requires an adapter-level Alchemy rename alias; without one, remove
and deploy the old source before recreating it in a second deploy.

`EventSourceLive` can coexist with the Worker's returned `fetch` handler. It
claims the configured X event path and excludes that path from Alchemy's default
`Worker.serve` listener. Requests on other paths, including requests whose path
cannot be parsed by the event source, continue to the returned handler. This
exclusion does not apply to additional fetch listeners registered directly with
`Worker.listen`; those listeners must guard the X event path themselves. The
adapter binds the consumer secret without exposing it to application code,
answers CRC, and checks the raw-body signature before parsing. The Worker URL
`Output` also makes host deployment a prerequisite of X registration, which
matters because X performs CRC immediately. X requires a public HTTPS webhook
URL without an explicit port, limits it to 200 characters, and expects a
successful response within ten seconds. See X's
[webhook introduction](https://docs.x.com/x-api/webhooks/introduction) and
[webhook quickstart](https://docs.x.com/x-api/webhooks/quickstart).

To migrate an existing `WebhookRoute` declaration (including the old `events`
alias), pass its first argument as `name` and retain its effective canonical
path:

```ts
yield* X.consumeEvents(
  {
    name: "AccountEvents",
    path: "/api/x/webhook",
    accountActivity: true,
  },
  handler,
);
```

If the old declaration omitted `path`, `/api/x/webhook` was its default; the
new default is `/__alchemy/x/events`. If the old declaration used a relative
path such as `api/x/webhook`, add its normalized leading slash. Preserving both
`name` and the canonical `path` keeps the existing Alchemy resource identities
instead of planning replacement resources. Keep the Worker on the same public
host to preserve the webhook URL.

A complete integration is in
[`examples/cloudflare-worker`](../../examples/cloudflare-worker).

## Direct resources

Use resources directly when the HTTP receiver is already deployed and implements X's CRC/signature protocol:

```ts
const webhook = yield* X.Webhook("Webhook", {
  url: "https://x-events.example.com/api/x/webhook",
  revalidateInvalid: true,
});

const mentions = yield* X.ActivitySubscription("Mentions", {
  eventType: "post.mention.create",
  filter: { user_id: "123456789" },
  webhookId: webhook.webhookId,
  auth: "user",
});

const account = yield* X.AccountActivitySubscription("Account", {
  webhookId: webhook.webhookId,
  userId: yield* X.currentUserId,
});
```

| Resource | Managed state |
| --- | --- |
| `Webhook` | Reports a cold exact URL match as unowned, creates a missing registration, revalidates an owned invalid registration unless disabled, and deletes by stable X ID. |
| `ActivitySubscription` | Creates and converges a granular X Activity `eventType` + `filter`, always reserving an instance/FQN ownership marker in the remote tag. |
| `AccountActivitySubscription` | Enrolls the authenticated X user in the full `/all` feed and remembers the user ID to prevent accidental credential-identity changes. |

Changing a `Webhook.url` is a replacement because X has no URL-update operation. Pay Per Use permits only one webhook, so `alchemy-x` uses delete-first replacement: the old registration is deleted before the new one is created. This avoids a quota failure but creates a delivery gap if a URL changes. Plan that migration explicitly. Cold matching resources without a provable Alchemy ownership marker are returned through Alchemy's `Unowned` adoption guard; take them over only with an explicit adoption deploy.

`Webhook` and `AccountActivitySubscription` also accept `adoptExisting: true`. This is a persistent resource declaration that authorizes only exact, unowned matches first observed during reconcile—for example, a registration that races creation or already occupies a replacement URL. It does not authorize a cold match returned by `read`; that still requires Alchemy's resource-scoped `adopt(true)` or CLI `--adopt` flow. Leave the flag unset unless that narrower takeover policy is intentional.

## X Activity versus Account Activity

Use `ActivitySubscription` when you want one granular event/filter pair. X Activity supports both public app-context events and private user-context events, with tier-based subscription limits; webhook deliveries are billed by event type. See the [X Activity overview](https://docs.x.com/x-api/activity/introduction) and current [X API pricing](https://docs.x.com/x-api/getting-started/pricing).

Use `AccountActivitySubscription` when you need the authenticated account's complete supported activity feed. X documents Account Activity as available only on Pay Per Use and Enterprise. Pay Per Use currently permits three unique user subscriptions and one webhook; the `/all` product cannot be narrowed to selected event types. See the [Account Activity overview](https://docs.x.com/x-api/account-activity/introduction).

This provider enrolls accounts using OAuth 1.0a and uses an internally obtained app-only token for subscription listing and deletion. Verify the required app permissions and product entitlement before deploying full Account Activity in production.

## Direct API access

The `Api` namespace re-exports `distilled-x` for imperative calls. Its client accepts raw `distilled-x` configuration:

```ts
const client = X.Api.createXClient({
  apiKey: process.env.X_API_KEY!,
  apiSecret: process.env.X_API_SECRET!,
  accessToken: process.env.X_ACCESS_TOKEN!,
  accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET!,
});

const identity = await client.users.getMe();
```

The separate root-level `X.createXClient(credentials, options?)` accepts the four OAuth1 values as literal strings or `Redacted` values. For custom Alchemy integration and tests, `X.XCredentialsContext` is the provided tag, `X.XCredentials` is its flattened Effect accessor, and `X.fromCredentials`, `X.fromEnv`, and `X.fromAuthProvider` build credential Layers.

## Tests

From the repository root:

```sh
bun run check
```

This runs formatting, linting, TypeScript, and mock-backed unit/provider tests. A live X test is separately gated because it can create remote state and consume paid X API credits:

```sh
bun run test:live
```

Supply the environment credentials above and use an app with the relevant [X product access](https://docs.x.com/x-api/account-activity/quickstart). Never run the live test against a production webhook without reviewing the delete-first replacement caveat.

The default live command performs read-only identity/webhook checks. To use the configured OAuth 1.0a credentials for the paid Account Activity create/check/delete proof, also set `X_LIVE_MUTATE=1` and `X_LIVE_WEBHOOK_ID` to a non-production webhook with no existing subscription for the test user.
