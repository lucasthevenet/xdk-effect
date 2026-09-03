# Cloudflare Worker

A plain Worker using `effect-xdk`. `GET /` returns the authenticated X user. `/webhook` handles CRC checks and verified event deliveries.

Configure these Worker secrets:

- `X_API_KEY`
- `X_API_SECRET`
- `X_ACCESS_TOKEN`
- `X_ACCESS_TOKEN_SECRET`

Use `src/worker.ts` as the entrypoint in your Cloudflare deployment tooling. No Node.js compatibility flag is required.

After deployment, register `https://<your-worker>/webhook` using `client.Api.webhooks.createWebhooks({ url: "https://<your-worker>/webhook" })`, then create the desired subscriptions. The handler does not register webhooks automatically.

Open the Worker root URL to test an authenticated API read. Upstream or processing failures return a generic 502 without exposing credentials.
