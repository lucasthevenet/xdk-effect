# Cloudflare Worker example

This stack lets one Cloudflare Worker consume verified X events and automatically
manages the remote webhook plus an Account Activity subscription.

Authenticate both providers, then deploy:

```sh
bunx alchemy login
bunx alchemy deploy
```

`XCloudflare.EventSourceLive` owns the host integration: it derives the public
callback from the Worker's URL, binds the API/consumer secret without exposing
it to application code, handles CRC, verifies each raw request body before JSON
decoding, and provisions the requested subscription. The handler receives a
discriminated `{ kind, delivery }` event (`activity`, `account_activity`,
`filtered_stream`, or `replay_job`). `EventSourceLive` claims
`/api/x/webhook` while the Worker's returned `fetch` Effect handles all other
requests, including paths the event source cannot parse. The exclusion applies
to Alchemy's default `Worker.serve` listener; additional fetch listeners
registered directly with `Worker.listen` must guard the X event path
themselves.
The example retains its former `AccountEvents` logical name and explicit
`/api/x/webhook` path so upgrading from `WebhookRoute` preserves its managed
resource identities and callback URL.

The Worker URL creates the deployment dependency needed before `POST /2/webhooks`
triggers its immediate `GET /api/x/webhook?crc_token=...` check. X does not
accept a localhost callback or an explicit port for production webhooks.
