import path from "node:path";

const root = path.resolve(import.meta.dir, "..");
for (const entry of [
  "packages/effect-xdk/src/index.ts",
  "examples/cloudflare-worker/src/worker.ts",
]) {
  const result = await Bun.build({
    entrypoints: [path.join(root, entry)],
    target: "browser",
    format: "esm",
    conditions: ["worker"],
    // Alchemy's deploy-time imports are transformed by its Worker bundler.
    // The SDK and route implementation remain fully bundled.
    external: ["alchemy", "alchemy/*"],
  });
  if (!result.success)
    throw new AggregateError(
      result.logs,
      `Could not bundle ${entry} for a Worker`,
    );
  const bundle = (
    await Promise.all(result.outputs.map((output) => output.text()))
  ).join("\n");
  for (const marker of [
    "node:http",
    "node:crypto",
    "createServer",
    "init_Workerd",
  ]) {
    if (bundle.includes(marker))
      throw new Error(`Worker bundle contains Node-only marker: ${marker}`);
  }
}
console.log("effect-xdk and Cloudflare Worker example bundles verified");
