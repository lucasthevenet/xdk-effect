import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as X from "alchemy-x";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import Worker from "./src/worker.ts";

export default Alchemy.Stack(
  "XExample",
  {
    providers: Layer.mergeAll(Cloudflare.providers(), X.providers()),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const worker = yield* Worker;

    return { url: worker.url };
  }),
);
