# `alchemy-x`

Manage X webhooks and activity subscriptions with Alchemy, and consume verified X events in Cloudflare Workers.

## Install

```sh
bun add alchemy-x alchemy effect
```

For Cloudflare Workers, also install the deployment runtime:

```sh
bun add @effect/platform-node
```

## Authentication

Create an X developer app with the permissions you need, then obtain its API key, API secret, OAuth1 access token, and access-token secret.

For stored credentials:

```sh
bunx alchemy login
```

Choose **Stored Credentials** for X and enter the four values. Alchemy saves them under `~/.alchemy/credentials/<profile>/`. Use `bunx alchemy login --configure` to update them.

For environment authentication, choose **Environment Variables** and set:

```sh
export X_API_KEY=...
export X_API_SECRET=...
export X_ACCESS_TOKEN=...
export X_ACCESS_TOKEN_SECRET=...
```

For a new CI profile, `CI=1` selects environment authentication without prompting. Existing profiles keep their selected method.

These four OAuth1 credentials support both user-context requests and automatic app-token exchange. Your app also needs the appropriate [X product access](https://docs.x.com/x-api/overview).

## Consume events in a Cloudflare Worker

Add `X.providers()` to the stack and provide `XCloudflare.EventSourceLive` to the Worker's initialization Effect:

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
            name: "AccountEvents",
            path: "/api/x/webhook",
            accountActivity: true,
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

    return { url: worker.url };
  }),
);
```

The adapter registers the webhook using the Worker URL, answers CRC challenges, and verifies delivery signatures before calling your handler. Requests on other paths go to the Worker's returned `fetch` handler.

Events have a `kind` and a `delivery` payload. The kinds are `activity`, `account_activity`, `filtered_stream`, and `replay_job`.

### Event options

| Option | Description |
| --- | --- |
| `name` | Stable name for the managed resources. Set it before deployment and keep it unchanged. |
| `path` | Webhook path; defaults to `/__alchemy/x/events`. Use an absolute path without queries or fragments. |
| `accountActivity` | Subscribe the account identified by `X_ACCESS_TOKEN` to its full Account Activity feed. |
| `activity` | Granular subscriptions with `name?`, `eventType`, `filter`, `tag?`, and `auth?`. |
| `maxBodyBytes` | Maximum delivery size; defaults to 5 MiB. |

For granular events, add an `activity` entry:

```ts
yield* X.consumeEvents(
  {
    name: "Mentions",
    activity: [
      {
        name: "mentions",
        eventType: "post.mention.create",
        filter: { user_id: "123456789" },
        auth: "user",
      },
    ],
  },
  (event) => Effect.logInfo("Received an X event", event),
);
```

Use one `consumeEvents` declaration per Worker. The handler-only form registers a webhook without creating subscriptions. Set `accountActivity` or `activity` to subscribe to events.

Keep the resource name and webhook URL stable. Without an explicit `name`, resource identity depends on the Worker name. Additional `Worker.listen` fetch listeners must exclude the webhook path themselves.

See the complete [Cloudflare Worker example](../../examples/cloudflare-worker).

## Direct resources

Use resources directly when your HTTPS receiver is already deployed and handles X's CRC challenges and delivery signatures. Declare them inside your stack's `Effect.gen`:

```ts
const webhook = yield* X.Webhook("Webhook", {
  url: "https://x-events.example.com/api/x/webhook",
});

yield* X.ActivitySubscription("Mentions", {
  eventType: "post.mention.create",
  filter: { user_id: "123456789" },
  webhookId: webhook.webhookId,
  auth: "user",
});

yield* X.AccountActivitySubscription("Account", {
  webhookId: webhook.webhookId,
  userId: yield* X.currentUserId,
});
```

`ActivitySubscription` selects an event/filter pair; `AccountActivitySubscription` subscribes the authenticated user to the full supported account feed. Check X's [Activity](https://docs.x.com/x-api/activity/introduction) and [Account Activity](https://docs.x.com/x-api/account-activity/introduction) documentation for permissions, limits, and billing.

X checks the receiver when registering a webhook. Use a public HTTPS URL without an explicit port and acknowledge deliveries within ten seconds.

Changing `Webhook.url` deletes the old registration before creating the new one, causing a delivery gap. Existing unmanaged resources require Alchemy's explicit adoption flow. `Webhook` and `AccountActivitySubscription` also accept `adoptExisting: true` to authorize exact matches that appear during reconciliation; it does not replace the initial adoption check.

## Call the X API

`X.providers()` supplies credentials, Effect `Crypto` and `HttpClient` layers, and `Hmac.layerSubtle` for direct SDK calls within your stack. Outside a stack, provide them explicitly (install `@effect/platform-browser` for this example):

```ts
import * as X from "alchemy-x";
import * as Effect from "effect/Effect";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import * as BrowserCrypto from "@effect/platform-browser/BrowserCrypto";
import * as Hmac from "effect-xdk/Hmac";

const identity = await Effect.runPromise(
  X.Api.Services.users.getUsersMe({}).pipe(
    Effect.provide(X.fromEnv()),
    Effect.provide(FetchHttpClient.layer),
    Effect.provide(BrowserCrypto.layer),
    Effect.provide(Hmac.layerSubtle),
  ),
);

console.log(identity.data);
```

Use `X.fromCredentials({ apiKey, apiSecret, accessToken, accessTokenSecret })` for explicit credentials, `X.fromEnv()` for environment variables, or `X.fromAuthProvider()` with Alchemy's profile/auth layers. Each accepts an optional `{ apiBaseUrl }` second argument for `fromCredentials`, or first argument for the other two.

See the [Effect SDK guide](../effect-xdk/README.md) for available authentication helpers, streaming, and error handling.
