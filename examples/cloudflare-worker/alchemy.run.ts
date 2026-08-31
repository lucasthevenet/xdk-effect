import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as X from "alchemy-x";
import * as Config from "effect/Config";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";
import * as HttpRouter from "effect/unstable/http/HttpRouter";
import * as HttpServerError from "effect/unstable/http/HttpServerError";
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse";

const PublicHost = Config.string("X_WEBHOOK_PUBLIC_HOST");

export default Alchemy.Stack(
  "XExample",
  {
    providers: Layer.mergeAll(Cloudflare.providers(), X.providers()),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const worker = yield* Cloudflare.Worker(
      "XWebhookWorker",
      { main: import.meta.url, domain: PublicHost },
      Effect.gen(function* () {
        // Referencing the host resource's URL creates the dependency edge that
        // deploys the CRC receiver before X attempts webhook registration.
        const self = yield* Cloudflare.Worker;
        const routes = Layer.mergeAll(
          X.WebhookRoute(
            "AccountEvents",
            {
              origin: self.url.as<string>(),
              path: "/api/x/webhook",
              accountActivity: true,
            },
            (delivery) => Effect.logInfo("Received an X event", delivery),
          ),
          HttpRouter.add(
            "GET",
            "/health",
            HttpServerResponse.jsonUnsafe({ ok: true }),
          ),
        );
        const runtimeScope = yield* Scope.make("sequential");
        const context = yield* Layer.buildWithScope(
          Layer.provideMerge(routes, HttpRouter.layer),
          runtimeScope,
        );
        const router = Context.get(context, HttpRouter.HttpRouter);
        const fetch = router
          .asHttpEffect()
          .pipe(
            Effect.catchCause((cause) =>
              HttpServerError.causeResponse(cause).pipe(
                Effect.map(([response]) => response),
              ),
            ),
          );
        return { fetch };
      }),
    );

    return { url: worker.url };
  }),
);
