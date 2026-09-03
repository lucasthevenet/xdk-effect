# `effect-xdk`

An Effect-native TypeScript SDK for the X API: posts, users, media, streams, webhooks, and activity subscriptions.

## Install

```sh
bun add effect-xdk effect
```

## Quick start

Set your X app's credentials:

```sh
export X_API_KEY=...
export X_API_SECRET=...
export X_ACCESS_TOKEN=...
export X_ACCESS_TOKEN_SECRET=...
```

Provide credentials and an Effect `HttpClient` to your program:

```ts
import * as Effect from "effect/Effect";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import { CredentialsFromEnv } from "effect-xdk/Credentials";
import { getUsersMe } from "effect-xdk/users";
import { createPosts } from "effect-xdk/posts";

const program = Effect.gen(function* () {
  const me = yield* getUsersMe({ user_fields: ["id", "username"] });
  const post = yield* createPosts({ text: "Hello from Effect" });
  return { me, post };
});

const result = await Effect.runPromise(
  program.pipe(
    Effect.provide(CredentialsFromEnv),
    Effect.provide(FetchHttpClient.layer),
  ),
);
```

Import operations from `effect-xdk/<service>`, such as `users`, `posts`, or `webhooks`. Request fields include path, query, and body parameters in one object. Dotted query names use underscores: `user_fields` sends `user.fields`.

JSON operations return X's response envelope directly. Read `data` for results and inspect `errors` for partial failures. Operations also export their request/response types and schemas.

## Authentication

`CredentialsFromEnv` reads the four variables above. Set `X_API_BASE_URL` to use a custom API origin.

For explicit OAuth1 credentials:

```ts
import { fromOAuth1 } from "effect-xdk/Credentials";

const credentials = fromOAuth1({
  apiKey: "...",
  apiSecret: "...",
  accessToken: "...",
  accessTokenSecret: "...",
});
```

Pass this layer to `Effect.provide(credentials)`. Secret fields accept strings or Effect `Redacted` values. App-only tokens are obtained automatically from the API key and secret when needed.

For pre-issued Bearer tokens:

```ts
import { fromBearer } from "effect-xdk/Credentials";

const credentials = fromBearer({
  appBearerToken: "...",
  userAccessToken: "...",
});
```

Supply either or both tokens according to the operations you need. App authentication is preferred when the endpoint supports it. Use `withAuth("user")` from `effect-xdk/Protocol` to select user context:

```ts
import { withAuth } from "effect-xdk/Protocol";

const post = createPosts({ text: "Hello" }).pipe(withAuth("user"));
```

For rotating credentials, provide the `Credentials` service with an Effect that resolves the latest values on each request. Your X app must have the permissions and product access required by the endpoint.

## Errors and retries

Use `Effect.catchTag` to handle errors such as `Forbidden`, `NotFound`, `TooManyRequests`, `XAuthenticationError`, `XInputError`, and `XParseError`.

Safe HTTP methods retry transient failures with a capped policy and honor rate-limit hints. POSTs are not automatically retried. Configure retries with `effect-xdk/Retry`; use `Retry.none` to disable them. Only retry writes when replaying the operation is safe.

## Streaming and media

```ts
import * as Stream from "effect/Stream";
import { streamPostsSample } from "effect-xdk/stream";

const firstTen = streamPostsSample({}).pipe(
  Stream.unwrap,
  Stream.take(10),
  Stream.runCollect,
);
```

Provide credentials and an `HttpClient` as in the quick start. Ending consumption cancels the stream; reconnection is the caller's responsibility.

Binary downloads return `Uint8Array`. Media upload operations accept a `Blob` for multipart uploads or a base64 string for JSON uploads.

## OAuth 2.0 + PKCE

```ts
import * as Effect from "effect/Effect";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import * as OAuth from "effect-xdk/OAuth";

const config = { clientId: process.env.X_CLIENT_ID! };
const redirectUri = "https://example.com/callback";

const authorization = await Effect.runPromise(
  OAuth.createAuthorizationRequest(config, {
    redirectUri,
    scopes: ["tweet.read", "users.read", "offline.access"],
  }),
);

// Persist state and codeVerifier securely, then redirect to authorization.url.
const handleCallback = (callbackUrl: string) =>
  Effect.runPromise(
    Effect.gen(function* () {
      const { code } = yield* OAuth.parseAuthorizationCallback(
        callbackUrl,
        authorization.state,
      );
      return yield* OAuth.exchangeCode(config, {
        code,
        codeVerifier: authorization.codeVerifier,
        redirectUri,
      });
    }).pipe(Effect.provide(FetchHttpClient.layer)),
  );
```

For confidential clients, add `clientSecret` to the config. Use `refreshToken(config, { refreshToken })` to refresh a token and `revokeToken(config, { token })` to revoke it. Both require an Effect `HttpClient`.

## Webhook verification

Use `createCrcResponse` to answer X's CRC challenge and `verifyWebhookRequest` before processing a delivery:

```ts
import * as Effect from "effect/Effect";
import { createCrcResponse, verifyWebhookRequest } from "effect-xdk/Webhooks";

const answerChallenge = (crcToken: string, apiSecret: string) =>
  Effect.runPromise(createCrcResponse(crcToken, apiSecret));

const verifyDelivery = (request: Request, apiSecret: string) =>
  Effect.runPromise(verifyWebhookRequest(request, apiSecret));
```

`verifyWebhookRequest` returns a boolean and leaves the original request body readable. To verify bytes directly, use `verifyWebhookSignature({ rawBody, signature, consumerSecret })`. Cryptographic failures use the `XWebhookError` channel.
