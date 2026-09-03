# `distilled-x`

An Effect-native TypeScript SDK generated from the official [X OpenAPI spec](https://github.com/xdevplatform/xdk/blob/main/specs/openapi.json). The pinned spec currently generates **171 operations across 27 services**, including posts, users, media, streams, webhooks, and activity subscriptions.

Generation uses [Distilled's](https://github.com/alchemy-run/distilled) shared OpenAPI-to-Smithy converter, SDK compiler, and generator CLI. Operations use its `API.make` implementation with Effect `HttpClient`; Web Crypto keeps signing portable to Workers. All authentication implementations stay in this package: OAuth1 signing, automatic app-token exchange, explicit app/user Bearer tokens, and OAuth2/PKCE helpers.

## Install

```sh
bun add distilled-x effect
```

## Effect client

```ts
import { CredentialsFromEnv } from "distilled-x/Credentials";
import { getUsersMe } from "distilled-x/users";
import { createPosts } from "distilled-x/posts";
import * as Effect from "effect/Effect";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";

const program = Effect.gen(function* () {
  const me = yield* getUsersMe({ user_fields: ["id", "username"] });
  const post = yield* createPosts({ text: "Hello from Alchemy" });
  return { me, post };
});

await Effect.runPromise(program.pipe(
  Effect.provide(CredentialsFromEnv),
  Effect.provide(FetchHttpClient.layer),
));
```

`CredentialsFromEnv` lazily reads `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, and `X_ACCESS_TOKEN_SECRET` through Effect Config. `X_API_BASE_URL` optionally overrides the API origin. For explicit credentials, provide `fromOAuth1({ apiKey, apiSecret, accessToken, accessTokenSecret })` or `fromBearer({ appBearerToken, userAccessToken })` from `distilled-x/Credentials`. Secret fields accept strings or `Redacted<string>` and are stored redacted.

Operations are lazy `API.OperationMethod` values with typed `XOpError` failures, schema-decoded outputs, and cancellation. They require `Credentials | HttpClient`. The `Credentials` service holds an Effect resolved on every request, so custom resolvers can rotate credentials. The protocol is process-memoized but never captures credentials or a transport. App tokens are cached separately for each credentials resolver and HttpClient, invalidated on key/secret changes, failure, or a matching 401. An individual caller can cancel without aborting another caller's shared token exchange; exchanges have a 30-second timeout.

As in Distilled, you can also capture an operation's context:

```ts
const program = Effect.gen(function* () {
  const getMe = yield* getUsersMe;
  return yield* getMe({}); // Credentials and HttpClient captured above
});
```

Overrides provided around a later invocation take precedence over captured credentials. Import services using `distilled-x/<tag>` (or the retained `distilled-x/services/<tag>` aliases), or use the root `Services` namespace (`Services.posts.createPosts`). Utility modules use `Credentials`, `Errors`, `Traits`, `Protocol`, and `Retry` subpaths. Each operation exports its request/response types, schemas, and `<OperationName>Error` alias.

Names come from OpenAPI `operationId`; services follow the first tag. Bodies are flattened alongside path/query fields. Dotted parameters become underscores (`user_fields` encodes as `user.fields`), and array encoding follows the spec. JSON operations return the envelope directly; partial-success envelopes retain X's `errors` field, which callers must inspect.

HTTP failures use Distilled's shared errors such as `Forbidden`, `NotFound`, and `TooManyRequests`; `XParseError`, `UnknownXError`, `XAuthenticationError`, `XInputError`, and `XTokenExpired` cover X-specific failures. Use `Effect.catchTag` or Distilled's error categories. Inspect HTTP metadata through your injected `HttpClient`, or use the compatibility client's `XResult`.

Authentication follows each operation's security alternatives. App context is preferred when supported and available; use `.pipe(withAuth("user"))` from `distilled-x/Protocol` to override it. OAuth2-only operations reject OAuth1 credentials locally. Alchemy still accepts only the four OAuth1 credentials.

`distilled-x/Retry` exposes the standard `Retry`, `policy`, `none`, `transient`, and `throttling` interfaces. Safe methods use Distilled's default capped retry policy and honor rate-limit hints. POSTs deliberately have no automatic retry tag: opt in with `Effect.retry` when replaying a particular write is safe.

### Streaming and media

```ts
import { streamPostsSample } from "distilled-x/stream";
import * as Stream from "effect/Stream";

// Provide Credentials and HttpClient to this Effect, just as above.
const firstTen = streamPostsSample({}).pipe(
  Stream.unwrap,
  Stream.take(10),
  Stream.runCollect,
);
```

Opening a streaming endpoint returns an `Effect<Stream<...>>`, keeping the operation callable/yieldable like the rest of Distilled. Use `Stream.unwrap` to consume it. Records decode incrementally, blank keepalives are ignored, and ending consumption cancels the reader. Streams do not automatically reconnect or resume. Binary downloads return `Effect<Uint8Array, ...>`. Media upload operations accept `Blob` for multipart bytes or a base64 string for JSON uploads.

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

`specs/source.json` records the upstream commit and checksum. `scripts/convert.ts` converts the unmodified `specs/openapi.json` into `.generated-specs/` Smithy models and wire metadata. `scripts/generate.ts` supplies an `SdkSpec` to Distilled's `runGeneratorCli`, producing `src/services/` and `src/operations.ts`. Never edit generated files manually. Credentials, protocol, retry configuration, lifecycle helpers, and webhook cryptography remain hand-maintained. Generated source is excluded from custom lint rules but is formatted, typechecked, and checked for reproducibility.

The generator explicitly adapts the spec's JSON-labelled streaming endpoints and binary/multipart media operations. As in Distilled's shared compiler, schemas are forward-compatible: enums are open strings and opaque unions preserve their values; not every OpenAPI constraint is enforced locally. X remains authoritative for permissions and request semantics. The source spec identifies the [X Developer Agreement and Policy](https://developer.x.com/en/developer-terms/agreement-and-policy.html) as its license.

### Distilled conventions and deliberate differences

The primary reference is [Coinbase](https://github.com/alchemy-run/distilled/tree/cc93bf364f93840f008e0a50e8edbaab63348a9d/packages/coinbase): credential effects, per-request signing, a hand-written protocol, shared HTTP errors/retries, `API.make`, and package exports. [MongoDB Atlas](https://github.com/alchemy-run/distilled/blob/cc93bf364f93840f008e0a50e8edbaab63348a9d/packages/mongodb-atlas/src/credentials.ts) informs app-token exchange; [Cloudflare](https://github.com/alchemy-run/distilled/blob/cc93bf364f93840f008e0a50e8edbaab63348a9d/packages/cloudflare/src/credentials.ts) informs redacted multi-mode credentials. The per-tag conversion layout follows GitHub.

X-specific differences are intentional: Web Crypto instead of Node-only signing; spec-driven OAuth1/OAuth2/app auth selection; CSV and multipart serialization; streamed response decoding; and conservative POST replay behavior. The spec remains an immutable checksum-pinned snapshot instead of an organization-owned spec-mirror submodule. Bun workspace tooling and reproducibility CI are retained.

The earlier custom `Client.layer`, `.withResponse`, and second-argument operation options are replaced by `Credentials`/`HttpClient`, transport instrumentation, and Effect context such as `withAuth`. The Promise `createXClient` interface below is unchanged.

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
