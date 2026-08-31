# `alchemy-x`

Alchemy v2 providers for X OAuth 2.0, project webhooks, granular X Activity subscriptions, full Account Activity subscriptions, and verified Effect HTTP webhook routes.

## Install

```sh
bun add alchemy-x alchemy effect
```

`alchemy` and `effect` are peer dependencies. `distilled-x`, the portable API and cryptography layer, is installed by `alchemy-x`.

## Primary API

| Export | Purpose |
| --- | --- |
| `providers()`, `Providers` | Register the X resource collection, credentials bridge, and Auth Provider |
| `Webhook` | Manage an app-scoped X webhook registration |
| `ActivitySubscription` | Manage a granular X Activity event/filter subscription |
| `AccountActivitySubscription` | Manage the authenticated user's full Account Activity subscription |
| `WebhookRoute`, `events` | Mount a verified Effect HTTP receiver and automatically declare its remote X resources |
| `XAuth`, `makeXAuth` | Default or custom X Auth Provider registration Layer |
| `XCredentials`, `XCredentialsContext` | Flattened credential Effect accessor and its provided Context tag |
| `fromCredentials`, `fromEnv`, `fromAuthProvider` | Programmatic credential Layers |
| `createXClient` | Create a client from literal or `Redacted` app/user tokens |
| `Api` | The complete portable `distilled-x` API namespace |

The package also exports `X_OAUTH_DEFAULT_REDIRECT_URI`, `X_OAUTH_DEFAULT_SCOPES`, `X_AUTH_PROVIDER_NAME`, and the related auth and credential types.

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

Providers are Effect Layers in Alchemy; see [Alchemy's provider guide](https://alchemy.run/infrastructure-as-code/provider/). `X.providers()` supplies all X resource implementations, the credentials service, and the Auth Provider that `alchemy login` discovers.

## Authentication

The adapter deliberately keeps these credentials separate:

| Credential | Purpose |
| --- | --- |
| App-only Bearer token | List, create, validate, and delete X webhooks; app-context subscription operations |
| API secret / consumer secret | Answer webhook CRC requests and verify delivery signatures |
| OAuth 2.0 user access token | `GET /2/users/me`, full Account Activity enrollment, and private X Activity events |
| OAuth 2.0 client and refresh token | Interactive PKCE login and unattended user-token renewal |

### Configure the X app

1. Create an X developer app and enable OAuth 2.0 in its authentication settings.
2. Generate an app-only Bearer token and record the API key's secret. The API secret is the webhook HMAC key; it is distinct from an OAuth 2.0 Client Secret.
3. For interactive local login, add this exact callback URL to the app:

   ```text
   http://127.0.0.1:9976/auth/callback
   ```

4. Record the OAuth 2.0 Client ID. A confidential Web App or Automated App/Bot also has a Client Secret; a public Native App does not.

X callback URLs must match exactly, including any trailing slash. X permits `http://127.0.0.1` for local development and explicitly rejects `localhost`; X generally requires HTTPS for production OAuth callbacks. This adapter's interactive provider is deliberately loopback-only and accepts an `http://127.0.0.1` URI with an explicit port and no query or fragment. See [X app configuration](https://docs.x.com/fundamentals/developer-apps).

### Interactive login

Once the stack includes `X.providers()`, run:

```sh
bunx alchemy login --configure
```

Select OAuth and follow the prompts for the app credentials and registered callback. The provider opens X's Authorization Code + PKCE flow, validates callback state, exchanges the short-lived code, and stores secrets in Alchemy's per-profile credential store. The profile itself stores only `{ method: "oauth" }`; app settings use the `x-oauth-app` credential entry, while access/refresh tokens, expiry, granted scopes, and the discovered user ID use `x-oauth-tokens`. Credential resolution refreshes a stored token within 60 seconds of expiry. Use `bunx alchemy login --configure` again to force a new browser authorization; plain `bunx alchemy login` discovers and displays the configured provider. Alchemy profiles and storage behavior are described in the [Auth Provider guide](https://alchemy.run/environments/auth-providers/).

The adapter creates/chmods the per-profile credential directory to `0700` and both X credential files to `0600`, including when repairing files written by an earlier version. These files are permission-protected JSON and are not encrypted at rest.

The default Account Activity scope set is:

```text
tweet.read users.read dm.read dm.write offline.access
```

`offline.access` is important for an unattended deploy: X access tokens otherwise expire after two hours and X does not issue a refresh token without that scope. Private X Activity event types may require additional scopes such as `mute.read` or `block.read`; request the minimum scopes for the configured events. See [X OAuth 2.0 scopes and refresh](https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code) and [X Activity event authentication](https://docs.x.com/x-api/activity/introduction).

For the stored OAuth method, when X returns a replacement refresh token, the provider persists the replacement together with the new access token before returning credentials. Alchemy serializes Auth Provider reads under a cross-process lock, preventing concurrent deploys from racing a rotating refresh session. The environment method cannot persist a replacement refresh token into process environment variables, so it deliberately never attempts refresh. Prefer stored OAuth when automatic rotation is required.

### Environment authentication and CI

Choose the environment method when credentials are supplied by the process. `CI=true` selects this method non-interactively.

| Variable | Required | Meaning |
| --- | --- | --- |
| `X_BEARER_TOKEN` | Yes | App-only Bearer token |
| `X_API_SECRET` | Yes | API/consumer secret used for CRC and HMAC verification |
| `X_ACCESS_TOKEN` | Yes | OAuth 2.0 user access token |
| `X_CLIENT_ID` | Optional | OAuth 2.0 Client ID metadata |
| `X_ACCESS_TOKEN_EXPIRES_AT` | Optional | ISO date, Unix seconds, or Unix milliseconds; resolution fails within 60 seconds of expiry |
| `X_OAUTH_SCOPES` | Optional | Space- or comma-separated scopes associated with the user token |

The three required values support already-issued credentials. Rotate them in the external secret manager before expiry, or use the stored OAuth method for safely persisted refresh-token rotation. The callback URI is prompted and stored by interactive OAuth—there is intentionally no redirect-URI environment variable for the environment method.

## Automatic webhook route

`WebhookRoute` (alias: `events`) is an Effect `Layer`. When built inside an Effect HTTP application it does both halves of webhook integration:

- At deploy time, it declares and reconciles the X webhook plus any requested X Activity or Account Activity subscriptions.
- At runtime, it mounts a CRC `GET` route and a delivery `POST` route. The POST handler verifies `x-twitter-webhooks-signature` over the untouched raw body before decoding JSON or invoking application code.

The verified receiver accepts X Activity, Account Activity (including OAuth revoke and replay-status control events), and Filtered Stream webhook envelopes. This package does not yet provision Filtered Stream rules or linkages; those can use the same registered webhook independently.

```ts
import * as X from "alchemy-x";
import * as Effect from "effect/Effect";

const XRoutes = X.WebhookRoute(
  "XEvents",
  {
    origin: "https://x-events.example.com",
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
  (delivery, request) =>
    Effect.logInfo("Verified X delivery", { delivery, url: request.url }),
);

// `X.events(...)` is the same function.
```

Provide `XRoutes` to the Effect HTTP program that supplies `HttpRouter`. A complete Cloudflare Worker integration—including construction of the router Layer and `fetch` handler—is in [`examples/cloudflare-worker`](../../examples/cloudflare-worker).

### `WebhookRoute` options

| Option | Description |
| --- | --- |
| `origin` | Public HTTPS deployment origin. Accepts an Alchemy `Input`, `Config`, or Effect-valued input; use the host's URL `Output` for same-stack deployments. |
| `path` | Canonical receiver path; defaults to `/api/x/webhook`. Dot segments, duplicate slashes, queries, and fragments are rejected. |
| `consumerSecret` | Optional literal, `Redacted`, or `Config<Redacted>` API secret. Defaults to the secret resolved by `X.providers()`. |
| `revalidateInvalid` | Existing invalid registrations are revalidated by default; set `false` to keep one without re-running CRC. |
| `adoptExisting` | Persistent opt-in for an exact unowned webhook or Account Activity slot discovered during reconcile; it does not replace Alchemy's normal cold-resource adoption gate. |
| `activity` | Granular `{ name?, eventType, filter, tag?, auth? }` subscriptions. `name` stabilizes identity and is required for duplicate event/filter entries. |
| `accountActivity` | Add full Account Activity for the authenticated OAuth user. |
| `maxBodyBytes` | Maximum signed delivery size; defaults to 5 MiB. Oversized bodies receive `413`. |

X performs a CRC request immediately when a webhook is registered. The receiver must therefore be publicly reachable before reconciliation. If the same Alchemy stack deploys the receiver, pass its URL `Output` as `origin`; that dependency makes the remote X registration wait for the host deployment. A literal or `Config` origin is appropriate only when that endpoint is already live. X requires a public HTTPS webhook URL without an explicit port, limits the URL to 200 characters, and expects a successful response within ten seconds. The CRC and signature rules are defined in X's [webhook introduction](https://docs.x.com/x-api/webhooks/introduction) and [webhook quickstart](https://docs.x.com/x-api/webhooks/quickstart).

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

Use `ActivitySubscription` when you want one granular event/filter pair. X Activity supports both public app-context events and private OAuth 2.0 user-context events, with tier-based subscription limits; webhook deliveries are billed by event type. See the [X Activity overview](https://docs.x.com/x-api/activity/introduction) and current [X API pricing](https://docs.x.com/x-api/getting-started/pricing).

Use `AccountActivitySubscription` when you need the authenticated account's complete supported activity feed. X documents Account Activity as available only on Pay Per Use and Enterprise. Pay Per Use currently permits three unique user subscriptions and one webhook; the `/all` product cannot be narrowed to selected event types. See the [Account Activity overview](https://docs.x.com/x-api/account-activity/introduction).

There is a first-party contract mismatch to be aware of: the current Account Activity quickstart says user enrollment uses OAuth 1.0a, while the current X [OpenAPI document](https://api.x.com/2/openapi.json) also lists OAuth 2.0 user authentication for the operation. This package implements OAuth 2.0 PKCE. Run the gated live test against the actual X account and entitlement before depending on full Account Activity in production.

## Direct API access

The `Api` namespace re-exports `distilled-x` for imperative calls. Its client accepts raw `distilled-x` configuration:

```ts
const client = X.Api.createXClient({
  appBearerToken: process.env.X_BEARER_TOKEN!,
  userAccessToken: process.env.X_ACCESS_TOKEN!,
});

const identity = await client.users.getMe();
```

The separate root-level `X.createXClient(credentials, options?)` accepts literal strings or `Redacted` app/user tokens. For custom Alchemy integration and tests, `X.XCredentialsContext` is the provided tag, `X.XCredentials` is its flattened Effect accessor, and `X.fromCredentials`, `X.fromEnv`, and `X.fromAuthProvider` build credential Layers.

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

The default live command performs read-only identity/webhook checks. To run the paid OAuth 2.0 Account Activity create/check/delete proof, also set `X_LIVE_MUTATE=1` and `X_LIVE_WEBHOOK_ID` to a non-production webhook with no existing subscription for the test user.
