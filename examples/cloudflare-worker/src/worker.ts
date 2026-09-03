import * as Effect from "effect/Effect";
import * as X from "effect-xdk";

export interface Env {
  readonly X_API_KEY: string;
  readonly X_API_SECRET: string;
  readonly X_ACCESS_TOKEN: string;
  readonly X_ACCESS_TOKEN_SECRET: string;
}

export const handleRequest = (request: Request, env: Env) => {
  const path = new URL(request.url).pathname;
  const client = X.Client({
    oauth1: {
      apiKey: env.X_API_KEY,
      apiSecret: env.X_API_SECRET,
      accessToken: env.X_ACCESS_TOKEN,
      accessTokenSecret: env.X_ACCESS_TOKEN_SECRET,
    },
  });
  const webhook = X.createWebhookHandler({
    consumerSecret: env.X_API_SECRET,
    onEvent: (event) => Effect.log("X event", event),
  });
  const handle = Effect.gen(function* () {
    if (path === "/webhook") return yield* webhook(request);
    if (path !== "/") return new Response(null, { status: 404 });
    if (request.method !== "GET")
      return new Response(null, { status: 405, headers: { allow: "GET" } });
    return Response.json(yield* client.Api.users.getUsersMe({}));
  }).pipe(
    Effect.catch(() =>
      Effect.succeed(
        Response.json({ error: "X request failed" }, { status: 502 }),
      ),
    ),
  );
  return handle;
};

export default {
  fetch: (request: Request, env: Env): Promise<Response> =>
    Effect.runPromise(handleRequest(request, env)),
};
