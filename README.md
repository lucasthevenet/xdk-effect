# X for Alchemy and Effect

Two TypeScript packages for working with X:

| Package | Purpose |
| --- | --- |
| [`alchemy-x`](./packages/alchemy-x/README.md) | Manage X webhooks and activity subscriptions with Alchemy, and consume verified events in Cloudflare Workers. |
| [`effect-xdk`](./packages/effect-xdk/README.md) | Call the X API with Effect, including authentication, streaming, and webhook verification. |

## Alchemy

```sh
bun add alchemy-x alchemy effect
```

For the Cloudflare Worker adapter, also install:

```sh
bun add @effect/platform-node
```

Create an X developer app and obtain its API key, API secret, OAuth1 access token, and access-token secret. Run `bunx alchemy login` and choose stored credentials or environment variables for X.

Follow the [Alchemy usage guide](./packages/alchemy-x/README.md) or deploy the [Cloudflare Worker example](./examples/cloudflare-worker).

## Effect SDK

```sh
bun add effect-xdk effect
```

```ts
import * as Effect from "effect/Effect";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import { CredentialsFromEnv } from "effect-xdk/Credentials";
import { getUsersMe } from "effect-xdk/users";

const me = await Effect.runPromise(
  getUsersMe({}).pipe(
    Effect.provide(CredentialsFromEnv),
    Effect.provide(FetchHttpClient.layer),
  ),
);

console.log(me.data);
```

Set `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, and `X_ACCESS_TOKEN_SECRET`. See the [SDK usage guide](./packages/effect-xdk/README.md) for authentication options, streaming, OAuth, and webhook helpers.

Your X app needs the permissions and product access required by each operation. Check [X's API documentation](https://docs.x.com/x-api/overview) for access requirements and billing.
