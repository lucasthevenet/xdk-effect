# xdk-effect

An Effect-native TypeScript SDK for X, generated from the official OpenAPI specification.

```sh
bun add xdk-effect effect
```

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

const me = await Effect.runPromise(client.users.getUsersMe({}));
console.log(me.data);
```

See the [SDK guide](./packages/xdk-effect/README.md) for authentication, streaming, and webhook handlers, or the [Cloudflare Worker example](./examples/cloudflare-worker).
