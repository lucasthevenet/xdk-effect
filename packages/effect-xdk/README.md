# `effect-xdk`

An Effect-native TypeScript SDK generated from the official [X OpenAPI spec](https://github.com/xdevplatform/xdk/blob/main/specs/openapi.json). The pinned spec currently generates **171 operations across 27 services**, including posts, users, media, streams, webhooks, and activity subscriptions.

Generation uses [Distilled's](https://github.com/alchemy-run/distilled) shared OpenAPI-to-Smithy converter, SDK compiler, and generator CLI. Operations use its `API.make` implementation with Effect `HttpClient`; Web Crypto keeps signing portable to Workers. All authentication implementations stay in this package: OAuth1 signing, automatic app-token exchange, explicit app/user Bearer tokens, and OAuth2/PKCE helpers.

## Install

```sh
bun add effect-xdk effect
```

## Effect SDK

```ts
import { CredentialsFromEnv } from "effect-xdk/Credentials";
import { getUsersMe } from "effect-xdk/users";
import { createPosts } from "effect-xdk/posts";
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

`CredentialsFromEnv` lazily reads `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, and `X_ACCESS_TOKEN_SECRET` through Effect Config. `X_API_BASE_URL` optionally overrides the API origin. For explicit credentials, provide `fromOAuth1({ apiKey, apiSecret, accessToken, accessTokenSecret })` or `fromBearer({ appBearerToken, userAccessToken })` from `effect-xdk/Credentials`. Secret fields accept strings or `Redacted<string>` and are stored redacted.

Operations are lazy `API.OperationMethod` values with typed `XOpError` failures, schema-decoded outputs, and cancellation. They require `Credentials | HttpClient`. The `Credentials` service holds an Effect resolved on every request, so custom resolvers can rotate credentials. The protocol is process-memoized but never captures credentials or a transport. App tokens are cached separately for each credentials resolver and HttpClient, invalidated on key/secret changes, failure, or a matching 401. An individual caller can cancel without aborting another caller's shared token exchange; exchanges have a 30-second timeout.

As in Distilled, you can also capture an operation's context:

```ts
const program = Effect.gen(function* () {
  const getMe = yield* getUsersMe;
  return yield* getMe({}); // Credentials and HttpClient captured above
});
```

Overrides provided around a later invocation take precedence over captured credentials. Import services using `effect-xdk/<tag>` (or the retained `effect-xdk/services/<tag>` aliases), or use the root `Services` namespace (`Services.posts.createPosts`). Utility modules use `Credentials`, `Errors`, `Traits`, `Protocol`, and `Retry` subpaths. Each operation exports its request/response types, schemas, and `<OperationName>Error` alias.

Names come from OpenAPI `operationId`; services follow the first tag. Bodies are flattened alongside path/query fields. Dotted parameters become underscores (`user_fields` encodes as `user.fields`), and array encoding follows the spec. JSON operations return the envelope directly; partial-success envelopes retain X's `errors` field, which callers must inspect.

HTTP failures use Distilled's shared errors such as `Forbidden`, `NotFound`, and `TooManyRequests`; `XParseError`, `UnknownXError`, `XAuthenticationError`, `XInputError`, and `XTokenExpired` cover X-specific failures. Use `Effect.catchTag` or Distilled's error categories. Inspect HTTP metadata through your injected `HttpClient`.

Authentication follows each operation's security alternatives. App context is preferred when supported and available; use `.pipe(withAuth("user"))` from `effect-xdk/Protocol` to override it. OAuth2-only operations reject OAuth1 credentials locally. Alchemy still accepts only the four OAuth1 credentials.

`effect-xdk/Retry` exposes the standard `Retry`, `policy`, `none`, `transient`, and `throttling` interfaces. Safe methods use Distilled's default capped retry policy and honor rate-limit hints. POSTs deliberately have no automatic retry tag: opt in with `Effect.retry` when replaying a particular write is safe.

### Streaming and media

```ts
import { streamPostsSample } from "effect-xdk/stream";
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
bun run --cwd packages/effect-xdk specs:fetch

# Deliberately advance to upstream main, then review the generated diff:
bun run --cwd packages/effect-xdk specs:update
bun run generate
bun run check
```

`specs/source.json` records the upstream commit and checksum. `scripts/convert.ts` converts the unmodified `specs/openapi.json` into `.generated-specs/` Smithy models and wire metadata. `scripts/generate.ts` supplies an `SdkSpec` to Distilled's `runGeneratorCli`, producing `src/services/` and `src/operations.ts`. Never edit generated files manually. Credentials, protocol, retry configuration, lifecycle helpers, and webhook cryptography remain hand-maintained. Generated source is excluded from custom lint rules but is formatted, typechecked, and checked for reproducibility.

The generator explicitly adapts the spec's JSON-labelled streaming endpoints and binary/multipart media operations. As in Distilled's shared compiler, schemas are forward-compatible: enums are open strings and opaque unions preserve their values; not every OpenAPI constraint is enforced locally. X remains authoritative for permissions and request semantics. The source spec identifies the [X Developer Agreement and Policy](https://developer.x.com/en/developer-terms/agreement-and-policy.html) as its license.

### Distilled conventions and deliberate differences

The primary reference is [Coinbase](https://github.com/alchemy-run/distilled/tree/cc93bf364f93840f008e0a50e8edbaab63348a9d/packages/coinbase): credential effects, per-request signing, a hand-written protocol, shared HTTP errors/retries, `API.make`, and package exports. [MongoDB Atlas](https://github.com/alchemy-run/distilled/blob/cc93bf364f93840f008e0a50e8edbaab63348a9d/packages/mongodb-atlas/src/credentials.ts) informs app-token exchange; [Cloudflare](https://github.com/alchemy-run/distilled/blob/cc93bf364f93840f008e0a50e8edbaab63348a9d/packages/cloudflare/src/credentials.ts) informs redacted multi-mode credentials. The per-tag conversion layout follows GitHub.

X-specific differences are intentional: Web Crypto instead of Node-only signing; spec-driven OAuth1/OAuth2/app auth selection; CSV and multipart serialization; streamed response decoding; and conservative POST replay behavior. The spec remains an immutable checksum-pinned snapshot instead of an organization-owned spec-mirror submodule. Bun workspace tooling and reproducibility CI are retained.

There is one SDK interface: generated Effect operations with `Credentials` and `HttpClient`. The Promise client, `XResult`, and client-specific runtime/retry options have been removed. Async helper functions return Effects too. Call `Effect.runPromise` only at your application's outer boundary.

## Authentication

`fromOAuth1` accepts the API key, API secret, access token, and access-token secret as strings or `Redacted` values. Each user request gets a fresh OAuth1 signature. App-context operations exchange the API key/secret automatically; concurrent calls using the same credential resolver and HTTP client share the token cache. Rotation and failed exchanges invalidate the appropriate cache entry. Cancelling one waiter does not cancel a shared exchange; writes are not replayed automatically.

`fromBearer({ appBearerToken, userAccessToken })` supports explicit app and OAuth2 user tokens independently, without an exchange. For rotating credentials, provide the `Credentials` service with an Effect that resolves the latest redacted values on each request.

## OAuth 2.0 + PKCE

The OAuth helpers are standalone Effect operations. Token exchange, refresh, and revocation require an injected `HttpClient`; interruption cancels the network request. Keep the PKCE verifier and expected state in trusted storage between redirects.

```ts
import * as Effect from "effect/Effect";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import * as OAuth from "effect-xdk/OAuth";

const config = { clientId: process.env.X_CLIENT_ID! };
const authorization = await Effect.runPromise(
  OAuth.createAuthorizationRequest(config, {
    redirectUri: "https://example.com/callback",
    scopes: ["tweet.read", "users.read", "offline.access"],
  }),
);
// Redirect to authorization.url; persist authorization.state and codeVerifier.

const handleCallback = (callbackUrl: string) => Effect.runPromise(
  Effect.gen(function* () {
    const { code } = yield* OAuth.parseAuthorizationCallback(
      callbackUrl,
      authorization.state,
    );
    return yield* OAuth.exchangeCode(config, {
      code,
      codeVerifier: authorization.codeVerifier,
      redirectUri: "https://example.com/callback",
    });
  }).pipe(Effect.provide(FetchHttpClient.layer)),
);
```

For confidential clients, add `clientSecret` (string or `Redacted`) to the config. `refreshToken(config, { refreshToken })` and `revokeToken(config, { token })` use the same transport layer. OAuth tokens and malformed token-response bodies are not included in errors.

## Webhook cryptography

```ts
import * as Effect from "effect/Effect";
import { createCrcResponse, verifyWebhookRequest } from "effect-xdk/Webhooks";

const program = Effect.gen(function* () {
  const crc = yield* createCrcResponse(crcToken, apiSecret);
  const verified = yield* verifyWebhookRequest(request, apiSecret);
  return { crc, verified };
});
```

Use these calls inside an `Effect.gen` program. `verifyWebhookSignature` accepts raw bytes, a signature header, and the consumer secret. `verifyWebhookRequest` clones the request so verification does not consume its body. Cryptographic failures use the `XWebhookError` channel.

## Tests

```sh
bun run check
bun test ./packages/effect-xdk/test
```
