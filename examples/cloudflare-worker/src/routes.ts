import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
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

const getMe = Effect.gen(function* () {
  const client = X.Client({
    oauth1: {
      apiKey: yield* Config.redacted("API_KEY"),
      apiSecret: yield* Config.redacted("API_SECRET"),
      accessToken: yield* Config.redacted("ACCESS_TOKEN"),
      accessTokenSecret: yield* Config.redacted("ACCESS_TOKEN_SECRET"),
    },
  });
  return yield* HttpServerResponse.json(yield* client.users.getUsersMe({}));
}).pipe(Effect.catch(requestFailed));

const receiveWebhook = Effect.gen(function* () {
  const request = yield* HttpServerRequest.HttpServerRequest;
  const webhook = X.createWebhookHandler({
    consumerSecret: yield* Config.redacted("API_SECRET"),
    onEvent: (event) => Effect.log("X event", event),
  });
  const response = yield* webhook(yield* HttpServerRequest.toWeb(request));
  return HttpServerResponse.fromWeb(response);
}).pipe(Effect.catch(requestFailed));

export const Routes = HttpRouter.use((router) =>
  Effect.gen(function* () {
    yield* router.add("GET", "/", getMe);
    for (const method of [
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ] as const) {
      yield* router.add(
        method,
        "/",
        HttpServerResponse.empty({
          status: 405,
          headers: { allow: "GET, HEAD" },
        }),
      );
    }
    yield* router.add("*", "/webhook", receiveWebhook);
  }),
);
