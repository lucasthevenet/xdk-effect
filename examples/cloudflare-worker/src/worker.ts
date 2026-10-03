import * as Cloudflare from "alchemy/Cloudflare";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as HttpRouter from "effect/http/HttpRouter";
import * as HttpServerResponse from "effect/http/HttpServerResponse";
import * as X from "xdk-effect";

const requestFailed = () =>
  Effect.succeed(
    HttpServerResponse.jsonUnsafe(
      { error: "X request failed" },
      { status: 502 },
    ),
  );

const GetMeRoute = HttpRouter.add(
  "GET",
  "/",
  Effect.gen(function* () {
    const client = X.Client({
      oauth1: {
        apiKey: yield* Config.Redacted("API_KEY"),
        apiSecret: yield* Config.Redacted("API_SECRET"),
        accessToken: yield* Config.Redacted("ACCESS_TOKEN"),
        accessTokenSecret: yield* Config.Redacted("ACCESS_TOKEN_SECRET"),
      },
    });
    return yield* HttpServerResponse.json(yield* client.users.getUsersMe({}));
  }).pipe(Effect.catch(requestFailed)),
);

const WebhookRoute = HttpRouter.add(
  "*",
  "/webhook",
  Effect.gen(function* () {
    return yield* X.createWebhookHandler({
      consumerSecret: yield* Config.Redacted("API_SECRET"),
      onEvent: (event) => Effect.log("X event", event),
    });
  }).pipe(Effect.catch(requestFailed)),
);

export default Cloudflare.Worker(
  "XWebhookWorker",
  {
    main: import.meta.url,
    env: {
      API_KEY: Config.Redacted("API_KEY"),
      API_SECRET: Config.Redacted("API_SECRET"),
      ACCESS_TOKEN: Config.Redacted("ACCESS_TOKEN"),
      ACCESS_TOKEN_SECRET: Config.Redacted("ACCESS_TOKEN_SECRET"),
    },
  },
  Effect.gen(function* () {
    return {
      fetch: yield* HttpRouter.toHttpEffect(
        Layer.mergeAll(GetMeRoute, WebhookRoute),
      ),
    };
  }),
);
