# xdk-effect

An Effect-native TypeScript SDK for X, generated from the official OpenAPI specification. Works in Node.js, Bun, browsers, and Cloudflare Workers with Fetch and Web Crypto available.

## Install

```sh
bun add xdk-effect effect
```

## Create a client

```ts
import * as Effect from "effect/Effect";
import * as X from "xdk-effect";

const client = X.Client({
  oauth1: {
    apiKey: process.env.X_API_KEY!,
    apiSecret: process.env.X_API_SECRET!,
    accessToken: process.env.X_ACCESS_TOKEN!,
    accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET!,
  },
});

const program = Effect.gen(function* () {
  const me = yield* client.users.getUsersMe({
    user_fields: ["id", "username"],
  });
  return me.data;
});

console.log(await Effect.runPromise(program));
```

The constructor configures credentials, HTTP transport, and crypto. It performs no network requests, requires no disposal, and returns methods that produce lazy Effects. Reuse a client across operations.

Groups and method names follow the OpenAPI specification: `client.posts.createPosts({ text: "Hello" })`, `client.webhooks.getWebhooks({})`, and so on. Request fields combine path, query, and body parameters in one object. Dotted query names use underscores: `user_fields` sends `user.fields`.

Responses retain X's envelope: read `data` for results and inspect `errors` for partial failures. Types and schemas are available from service modules such as `xdk-effect/users`.

## Authentication

OAuth1 config accepts strings or Effect `Redacted` values. App-only bearer tokens are obtained and cached automatically using the API key and secret when an operation needs app authentication.

For pre-issued tokens:

```ts
const appClient = X.Client({ bearerToken: "app-only-token" });
const userClient = X.Client({ accessToken: "oauth2-user-token" });
const both = X.Client({
  bearerToken: "app-only-token",
  accessToken: "oauth2-user-token",
});
```

Supply OAuth1 credentials or bearer credentials. When both app and user authentication are available, app authentication is preferred where supported. Use `X.withAuth("user")` on an operation to select user context.

Pass `baseUrl` for a custom API origin or `httpClient` to inject an Effect HTTP transport. Keep credentials server-side; use only appropriately scoped public-client tokens in browsers. Your X app needs the permissions and product access required by each operation.

OAuth authorization helpers are exported from `xdk-effect/OAuth`, including `createAuthorizationRequest`, `parseAuthorizationCallback`, `exchangeCode`, `refreshToken`, and `revokeToken`. These standalone Effects require an Effect Crypto or HttpClient layer as indicated by their types. Pass the resulting user access token to `X.Client({ accessToken })`; token persistence and refresh scheduling belong to your application.

## Errors and retries

Methods preserve typed errors and Effect cancellation. Handle failures with `Effect.catchTag`, and set time limits with `Effect.timeout`.

```ts
const me = client.users.getUsersMe({}).pipe(
  Effect.timeout("10 seconds"),
  X.Retry.none,
);
```

Non-POST operations retry transient failures with a capped policy and rate-limit hints. POSTs are not automatically retried. Use `X.Retry.policy(...)` to customize retries; only retry writes when replaying them is safe.

## Streaming and media

```ts
import * as Stream from "effect/Stream";

const firstTen = client.stream.streamPostsSample({}).pipe(
  Stream.unwrap,
  Stream.take(10),
  Stream.runCollect,
);

const events = await Effect.runPromise(firstTen);
```

Stopping consumption cancels the stream. Reconnection is the caller's responsibility. Binary downloads return `Uint8Array`; media uploads accept `Blob` for multipart uploads or base64 strings for JSON uploads.

## Webhook handler

```ts
import * as Config from "effect/Config";
import * as Layer from "effect/Layer";
import * as HttpRouter from "effect/unstable/http/HttpRouter";

const Routes = Layer.unwrap(
  Effect.gen(function* () {
    const WebhookRoute = HttpRouter.add(
      "*",
      "/webhook",
      X.createWebhookHandler({
        consumerSecret: yield* Config.redacted("API_SECRET"),
        onEvent: (event) => Effect.log("X delivery", event),
      }),
    );
    return WebhookRoute;
  }),
);
```

`createWebhookHandler` returns an Effect that reads `HttpServerRequest` from context and produces `HttpServerResponse`. Pass it directly to `HttpRouter.add`; no Web `Request` or `Response` conversion is needed. In an Alchemy Worker, return `{ fetch: yield* HttpRouter.toHttpEffect(Routes) }` from initialization.

The helper uses the app's API secret, not its access-token secret. It answers GET CRC challenges and verifies POST signatures over the original bytes before decoding JSON or calling `onEvent`, following [X's webhook protocol](https://docs.x.com/x-api/webhooks/quickstart).

It consumes the request body and passes a JSON object to `onEvent`. Use an Effect Schema inside the callback when you need a narrower event type. Unknown event fields are preserved.

The handler acknowledges with 200 only after your callback succeeds. Callback requirements and errors remain in the Effect channel. CRC/signing failures use `XWebhookError`; use `Effect.catch` or router middleware to map failures to non-2xx `HttpServerResponse` values. Do not include secrets or raw error details in HTTP responses.

Invalid signatures receive 401, malformed JSON/CRC requests 400, unsupported methods 405, and oversized bodies 413. The default body limit is 5 MiB; configure `maxBodyBytes` to change it.

The helper does not start a server or register a webhook. After mounting a publicly reachable endpoint, register it with:

```ts
const registered = yield* client.webhooks.createWebhooks({
  url: "https://example.com/webhook",
});
```

Create the desired activity subscriptions separately. For manual verification, `createCrcResponse`, `verifyWebhookSignature`, and `verifyWebhookRequest` are available from `xdk-effect/Webhooks`; these low-level Effects require `Hmac.layerSubtle`. Unlike the handler, `verifyWebhookRequest` leaves the original body readable.
