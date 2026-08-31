# `distilled-x`

Portable TypeScript primitives for the X API: app- and user-context requests, OAuth 2.0 Authorization Code + PKCE, webhook lifecycle calls, X Activity subscriptions, Account Activity subscriptions, CRC responses, and delivery-signature verification.

The package has no runtime dependencies. It uses the standard Fetch and Web Crypto APIs, so it works in Bun, modern Node.js, browsers, and worker runtimes that provide both APIs.

## Install

```sh
bun add distilled-x
```

## Client

```ts
import { createXClient } from "distilled-x";

const x = createXClient({
  // A string or a lazy sync/async function. Lazy providers make token rotation
  // visible to the next request without rebuilding the client.
  appBearerToken: () => process.env.X_BEARER_TOKEN!,
  userAccessToken: () => currentSession.accessToken,
});

const me = await x.users.getMe();
const ensured = await x.webhooks.ensure({
  url: "https://api.example.com/api/x/webhook",
});

console.log(me.value.data, ensured.webhook);
```

Each API response is an `XResult<T>` containing the decoded `value`, HTTP `status`, response `headers`, and parsed rate-limit metadata when X supplies it.

| API | Operations |
| --- | --- |
| `users` | `getMe()` |
| `webhooks` | `list()`, `create()`, `validate()`, `delete()`, `ensure()` |
| `activity` | list/iterate, create, update, delete, and normalize granular subscriptions |
| `accountActivity` | check, create, list, and delete full-account subscriptions |
| `request()` | Typed escape hatch for another `/2/...` endpoint |

App-only operations use `appBearerToken`; user-context operations use `userAccessToken`. X documents these as separate authentication modes in its [webhook](https://docs.x.com/x-api/webhooks/introduction) and [Account Activity](https://docs.x.com/x-api/account-activity/introduction) references.

The client retries idempotent `GET`, `PUT`, and `DELETE` requests on transient transport errors, `408`, `429`, and `5xx` responses. A `POST` is retried only when the caller explicitly passes `retryNonIdempotent: true`.

## OAuth 2.0 + PKCE

```ts
import { createOAuth2Client } from "distilled-x";

const clientSecret = process.env.X_CLIENT_SECRET;
const oauth = createOAuth2Client({
  clientId: process.env.X_CLIENT_ID!,
  // Omit the Client Secret for a public client.
  ...(clientSecret ? { clientSecret } : {}),
});

const authorization = await oauth.createAuthorizationRequest({
  redirectUri: "http://127.0.0.1:9976/auth/callback",
  scopes: [
    "tweet.read",
    "users.read",
    "dm.read",
    "dm.write",
    "offline.access",
  ],
});

// Persist authorization.state and authorization.codeVerifier until callback.
console.log(authorization.url);

const { code } = oauth.parseAuthorizationCallback(
  callbackUrl,
  authorization.state,
);
const tokens = await oauth.exchangeCode({
  code,
  codeVerifier: authorization.codeVerifier,
  redirectUri: "http://127.0.0.1:9976/auth/callback",
});
```

`createOAuth2Client` uses X's standard authorization, token, refresh, and revoke endpoints. The redirect URI must exactly match an allow-listed X app callback. X permits `http://127.0.0.1` for local development, but not `localhost`; production callbacks use HTTPS. See [X app callback rules](https://docs.x.com/fundamentals/developer-apps) and the [Authorization Code + PKCE reference](https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code).

Request `offline.access` when the application needs unattended refresh. Persist the entire successful refresh result—including a replacement `refresh_token` when X returns one—before making further requests:

```ts
const refreshed = await oauth.refreshToken({
  refreshToken: stored.refreshToken,
});

await saveSession({
  accessToken: refreshed.access_token,
  refreshToken: refreshed.refresh_token ?? stored.refreshToken,
  expiresAt: Date.now() + refreshed.expires_in * 1_000,
});
```

## Webhook verification

CRC uses the X app's API secret (also called the consumer secret), not either Bearer token:

```ts
import {
  createCrcResponse,
  verifyWebhookRequest,
} from "distilled-x";

const crc = await createCrcResponse(crcToken, consumerSecret);
const authentic = await verifyWebhookRequest(request, consumerSecret);
```

`verifyWebhookRequest` verifies `x-twitter-webhooks-signature` over the exact raw request bytes. Verify before parsing JSON. X's [webhook quickstart](https://docs.x.com/x-api/webhooks/quickstart) specifies the CRC and HMAC-SHA256 algorithms.

## Errors

The package exposes structured `XApiError`, `XAuthenticationError`, `XTransportError`, `XDecodeError`, `XOAuthError`, and `XOAuthStateError` classes. `XApiError` preserves X problem details, the response body, status, method, URL, and rate-limit information.

## Tests

From the repository root:

```sh
bun test ./packages/distilled-x/test
```

The suite uses injected Fetch, clock, randomness, and Web Crypto implementations; it does not require live X credentials.
