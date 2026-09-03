import * as Cloudflare from "alchemy/Cloudflare";
import * as X from "alchemy-x";
import * as Effect from "effect/Effect";
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse";

export default Cloudflare.Worker(
  "XWebhookWorker",
  { main: import.meta.url },
  Effect.gen(function* () {
    yield* X.consumeEvents(
      {
        name: "AccountEvents",
        path: "/api/x/webhook",
        accountActivity: true,
      },
      (event) =>
        Effect.logInfo("Received an X event", {
          kind: event.kind,
          delivery: event.delivery,
        }),
    );

    return {
      fetch: Effect.succeed(HttpServerResponse.text("Alchemy X worker")),
    };
  }).pipe(Effect.provide(X.Cloudflare.EventSourceLive)),
);
