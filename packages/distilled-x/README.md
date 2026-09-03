# `distilled-x`

An Effect-native TypeScript SDK generated from the official [X OpenAPI spec](https://github.com/xdevplatform/xdk/blob/main/specs/openapi.json). The pinned spec currently generates **171 operations across 27 services**, including posts, users, media, streams, webhooks, and activity subscriptions.

Generation uses [Distilled's](https://github.com/alchemy-run/distilled) shared OpenAPI-to-Smithy converter and SDK compiler. Runtime schemas use Effect and `@distilled.cloud/core`; HTTP and cryptography use standard Fetch and Web Crypto APIs, including in Workers. All authentication implementations stay in this package: OAuth1 signing, automatic app-token exchange, explicit app/user Bearer tokens, and OAuth2/PKCE helpers.

## Install

```sh
bun add distilled-x effect
```

## Effect client

```ts
import { Client } from "distilled-x";
import { getUsersMe } from "distilled-x/services/users";
import { createPosts } from "distilled-x/services/posts";
import * as Effect from "effect/Effect";

const program = Effect.gen(function* () {
  const me = yield* getUsersMe({ user_fields: ["id", "username"] });
  const post = yield* createPosts({ text: "Hello from Alchemy" });
  return { me, post };
});

await Effect.runPromise(program.pipe(Effect.provide(Client.layer({
  apiKey: () => process.env.X_API_KEY!,
  apiSecret: () => process.env.X_API_SECRET!,
  accessToken: () => process.env.X_ACCESS_TOKEN!,
  accessTokenSecret: () => process.env.X_ACCESS_TOKEN_SECRET!,
}))));
```

Operations are lazy Effects with typed `XError` failures, schema-decoded outputs, and request cancellation on interruption. `Client.layer` scopes the transport and app-token cache to the provided program; it accepts the same credentials and runtime/retry options as `createXClient`. It does not perform network I/O during construction. For dependency injection with an existing client, use `Effect.provideService(Client, client)`.

Import individual services using `distilled-x/services/<tag>` or use the root `Services` namespace (`Services.posts.createPosts`). Names come from OpenAPI `operationId`; services follow the first OpenAPI tag. Request bodies are flattened into the input alongside path/query fields. Dotted parameter names become underscores (`user_fields` encodes as `user.fields`), and array encoding follows the spec. Types and schemas are exported alongside each operation.

JSON operations return the response envelope directly. Use `getUsersMe.withResponse({})` to also obtain HTTP status, headers, and parsed rate-limit metadata. Errors have `_tag` discriminants for `Effect.catchTag`, including `XApiError`, `XAuthenticationError`, `XInputError`, `XDecodeError`, and `XTransportError`. Partial-success envelopes retain X's `errors` field; callers must inspect it.

Authentication is chosen from each operation's declared security alternatives. App context is preferred when supported and available; pass `{ auth: "user" }` as the second argument to request user context. OAuth2-only operations fail locally with OAuth1 credentials—an automatically obtained app token cannot substitute for OAuth2 user authorization. Standalone SDK users can provide `userAccessToken`/`appBearerToken` to `Client.layer`; Alchemy still accepts only the four OAuth1 credentials.

### Streaming and media

```ts
import { streamPostsSample } from "distilled-x/services/stream";
import * as Stream from "effect/Stream";

// Provide Client to the resulting Effect, just as above.
const firstTen = streamPostsSample({}).pipe(Stream.take(10), Stream.runCollect);
```

Streaming endpoints return `Stream`, decode newline-delimited JSON incrementally, ignore blank keepalives, and cancel the response reader when consumption ends. They do not automatically reconnect or resume. Binary downloads return `Effect<Uint8Array, ...>`. Media upload operations accept `Blob` for multipart bytes or a base64 string for JSON uploads.

### Generate or update the SDK

From the repository root:

```sh
bun run generate        # offline: regenerate from the checked-in spec
bun run generate:check  # offline: fail if generated files differ (also runs in CI)

# Restore the exact pinned upstream file and verify its SHA-256:
bun run --cwd packages/distilled-x specs:fetch

# Deliberately advance to upstream main, then review the generated diff:
bun run --cwd packages/distilled-x specs:update
bun run generate
bun run check
```

`specs/source.json` records the upstream commit and checksum. `specs/openapi.json` is the unmodified source; `.generated-specs/` contains Distilled's intermediate Smithy models; `src/services/` and `src/operations.ts` are generated. Never edit generated files manually. Auth, transport, lifecycle helpers, and webhook cryptography remain hand-maintained. Generated source is excluded from custom lint rules but is formatted, typechecked, and checked for reproducibility.

The generator explicitly adapts the spec's JSON-labelled streaming endpoints and binary/multipart media operations. As in Distilled's shared compiler, schemas are forward-compatible: enums are open strings and opaque unions preserve their values; not every OpenAPI constraint is enforced locally. X remains authoritative for permissions and request semantics. The source spec identifies the [X Developer Agreement and Policy](https://developer.x.com/en/developer-terms/agreement-and-policy.html) as its license.

## Compatibility client and authentication helpers

The existing Promise-based `createXClient` lifecycle helpers remain available for Alchemy and existing callers. Their endpoint paths, bindings, and supported auth schemes now come from the generated operation metadata. New API integrations should use the generated Effect operations above.

### OAuth1 credentials with automatic app authentication

```ts
import { createXClient } from "distilled-x";

const x = createXClient({
  apiKey: () => process.env.X_API_KEY!,
  apiSecret: () => process.env.X_API_SECRET!,
  accessToken: () => process.env.X_ACCESS_TOKEN!,
  accessTokenSecret: () => process.env.X_ACCESS_TOKEN_SECRET!,
});

const me = await x.users.getMe(); // OAuth 1.0a HMAC-SHA1
const webhooks = await x.webhooks.list(); // internally obtained app Bearer
```

Each credential accepts a string or a lazy sync/async function. User requests
are signed with a fresh cryptographic nonce and timestamp on every attempt.
Query parameters enter the OAuth1 signature; JSON bodies do not.

For app operations, the client exchanges the API key and secret at
`POST /oauth2/token` (not `/2/oauth2/token`) using client credentials. The
resulting app-only token is cached per client; concurrent requests share an
exchange. A changed API key/secret starts a new exchange, failures are not
cached, and a 401 invalidates the matching derived token. Idempotent requests
can retry within their attempt budget; POSTs are not automatically replayed.
Cancellation stops the caller's wait without cancelling an exchange shared by
another caller. [X app-only authentication](https://docs.x.com/fundamentals/authentication/oauth-2-0/application-only)

This is the credential mode used by `alchemy-x`. It does not enable OAuth2 user
authorization or bypass endpoint permissions/product access. Keep the API
secret and access token secret on a trusted server, never in public browser
code.

### Explicit Bearer tokens

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

In explicit Bearer mode, app-only operations use `appBearerToken`; user-context operations use `userAccessToken`. Supply either or both, depending on the operations you need. No app-token exchange is performed in this mode. OAuth2 helpers below remain available independently. X documents these as separate authentication modes in its [webhook](https://docs.x.com/x-api/webhooks/introduction) and [Account Activity](https://docs.x.com/x-api/account-activity/introduction) references.

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

The package exposes structured `XApiError`, `XAuthenticationError`, `XInputError`, `XTransportError`, `XDecodeError`, `XOAuthError`, and `XOAuthStateError` classes. `XApiError` preserves X problem details, the response body, status, method, URL, and rate-limit information. OAuth2/PKCE and cryptographic helpers retain their existing Promise interfaces independently of the generated Effect operations.

## Tests

From the repository root:

```sh
bun test ./packages/distilled-x/test
```

The suite uses injected Fetch, clock, randomness, and Web Crypto implementations; it does not require live X credentials.
