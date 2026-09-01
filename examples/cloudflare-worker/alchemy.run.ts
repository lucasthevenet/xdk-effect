import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as X from "alchemy-x";
import * as XCloudflare from "alchemy-x/Cloudflare";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse";

export default Alchemy.Stack(
  "XExample",
  {
    providers: Layer.mergeAll(Cloudflare.providers(), X.providers()),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const worker = yield* Cloudflare.Worker(
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
      }).pipe(Effect.provide(XCloudflare.EventSourceLive)),
    );

    return { url: worker.url };
  }),
);
