# Cloudflare Worker example

This stack mounts one verified X webhook route, lets X perform CRC checks, and
automatically manages the remote webhook plus an Account Activity subscription.

Set the public host, authenticate both providers, then deploy:

```sh
export X_WEBHOOK_PUBLIC_HOST=x-events.example.com
bunx alchemy login
bunx alchemy deploy
```

The stack derives `origin` from the Worker's `url` Output. That dependency
deploys the Worker before `POST /2/webhooks` triggers its immediate
`GET /api/x/webhook?crc_token=...` check. X does not accept a localhost callback
or an explicit port for production webhooks.
