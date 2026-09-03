import * as Cloudflare from "alchemy/Cloudflare";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as HttpRouter from "effect/unstable/http/HttpRouter";
import * as HttpServerRequest from "effect/unstable/http/HttpServerRequest";
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse";
import * as X from "effect-xdk";

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
        apiKey: yield* Config.redacted("API_KEY"),
        apiSecret: yield* Config.redacted("API_SECRET"),
        accessToken: yield* Config.redacted("ACCESS_TOKEN"),
        accessTokenSecret: yield* Config.redacted("ACCESS_TOKEN_SECRET"),
      },
    });
    return yield* HttpServerResponse.json(yield* client.users.getUsersMe({}));
  }).pipe(Effect.catch(requestFailed)),
);

const WebhookRoute = HttpRouter.add(
  "*",
  "/webhook",
  Effect.gen(function* () {
    const request = yield* HttpServerRequest.HttpServerRequest;
    const webhook = X.createWebhookHandler({
      consumerSecret: yield* Config.redacted("API_SECRET"),
      onEvent: (event) => Effect.log("X event", event),
    });
    const response = yield* webhook(yield* HttpServerRequest.toWeb(request));
    return HttpServerResponse.fromWeb(response);
  }).pipe(Effect.catch(requestFailed)),
);

export const Routes = Layer.mergeAll(
  GetMeRoute,
  WebhookRoute,
);

export default Cloudflare.Worker(
  "XWebhookWorker",
  {
    main: import.meta.url,
    env: {
      API_KEY: Config.redacted("API_KEY"),
      API_SECRET: Config.redacted("API_SECRET"),
      ACCESS_TOKEN: Config.redacted("ACCESS_TOKEN"),
      ACCESS_TOKEN_SECRET: Config.redacted("ACCESS_TOKEN_SECRET"),
    },
  },
  Effect.gen(function* () {
    return { fetch: yield* HttpRouter.toHttpEffect(Routes) };
  }),
);
