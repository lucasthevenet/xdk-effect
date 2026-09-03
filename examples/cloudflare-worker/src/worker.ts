import * as Cloudflare from "alchemy/Cloudflare";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as HttpRouter from "effect/unstable/http/HttpRouter";
import { Routes } from "./routes.ts";

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
