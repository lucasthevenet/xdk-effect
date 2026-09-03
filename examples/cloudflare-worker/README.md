# Alchemy Cloudflare Worker

An Alchemy-managed Worker using `xdk-effect` and Effect's `HttpRouter`. `GET /` returns the authenticated X user. `GET /webhook` handles CRC checks, and `POST /webhook` handles verified event deliveries.

Set these environment variables for deployment:

- `API_KEY`
- `API_SECRET`
- `ACCESS_TOKEN`
- `ACCESS_TOKEN_SECRET`

Secrets are declared with `Config.redacted` in the Worker's `env` bindings. Alchemy resolves them at deployment and provides them to runtime `Config` reads; redacted values are passed directly to the SDK.

`src/worker.ts` defines the routes, creates `Cloudflare.Worker("XWebhookWorker", ...)`, and uses `HttpRouter.toHttpEffect` for its fetch handler. `alchemy.run.ts` defines the `XExample` stack with Cloudflare providers and state.

From the workspace root, install dependencies with `bun install`, then deploy:

```sh
cd examples/cloudflare-worker
bun alchemy deploy
```

The webhook helper is passed directly to `HttpRouter.add` and reads the incoming request from Effect context. Unmatched paths and methods return 404; unsupported webhook methods return 405. `HEAD /` uses the GET route with an empty response body.

After deployment, register `https://<your-worker>/webhook` using `client.webhooks.createWebhooks({ url: "https://<your-worker>/webhook" })`, then create the desired subscriptions. The handler does not register webhooks automatically.

Open the Worker root URL to test an authenticated API read. Upstream or processing failures return a generic 502 without exposing credentials.
