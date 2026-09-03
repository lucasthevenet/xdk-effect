# Cloudflare Worker example

Deploy a Worker that receives verified X events and automatically registers a webhook and an Account Activity subscription.

## Deploy

Install workspace dependencies from the repository root:

```sh
bun install
cd examples/cloudflare-worker
bunx alchemy login
bunx alchemy deploy
```

Authenticate Cloudflare and X. For X, choose **Stored Credentials** and enter your app's API key, API secret, OAuth1 access token, and access-token secret. Use an X app with Account Activity access.

For environment authentication, choose **Environment Variables** for X and set:

```sh
export X_API_KEY=...
export X_API_SECRET=...
export X_ACCESS_TOKEN=...
export X_ACCESS_TOKEN_SECRET=...
bunx alchemy deploy
```

Set `CI=1` for a new CI profile to select environment authentication without prompting. Configure Cloudflare authentication for that environment as well.

## Handle events

Edit the `X.consumeEvents` handler in [alchemy.run.ts](./alchemy.run.ts). Each event contains `kind` and `delivery`; the kinds are `activity`, `account_activity`, `filtered_stream`, and `replay_job`.

The webhook listens at `/api/x/webhook`. The adapter answers CRC challenges and verifies delivery signatures before invoking the handler. The Worker's returned `fetch` handler serves other paths.

Keep the `AccountEvents` resource name and webhook URL stable between deployments. X requires a public HTTPS receiver; localhost callbacks are not supported.

See the [alchemy-x guide](../../packages/alchemy-x/README.md) for granular event subscriptions and other options. X API operations and delivered events may incur charges.
