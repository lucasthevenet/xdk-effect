import path from "node:path";

const root = path.resolve(import.meta.dir, "..");

const nodeOnlyMarkers = [
  "node:http",
  "http_default.createServer",
  "createServer",
];
const workerExternals = [
  "alchemy",
  "alchemy/*",
  "effect",
  "effect/*",
  "distilled-x",
];
const workerCwd = path.join(root, "examples/cloudflare-worker");

const result = await Bun.build({
  entrypoints: [
    path.join(root, "packages/alchemy-x/src/index.ts"),
    path.join(root, "packages/alchemy-x/src/Cloudflare.ts"),
  ],
  target: "browser",
  format: "esm",
  external: workerExternals,
});

if (!result.success) {
  throw new AggregateError(result.logs, "Could not build the Worker entry");
}

const bundle = (
  await Promise.all(result.outputs.map((output) => output.text()))
).join("\n");
for (const nodeOnlyMarker of nodeOnlyMarkers) {
  if (bundle.includes(nodeOnlyMarker)) {
    throw new Error(
      `Worker bundle contains Node-only marker: ${nodeOnlyMarker}`,
    );
  }
}

const eventSourceResult = await Bun.build({
  entrypoints: [path.join(workerCwd, "alchemy.run.ts")],
  target: "browser",
  format: "esm",
  conditions: ["worker"],
  external: workerExternals,
});
if (!eventSourceResult.success) {
  throw new AggregateError(
    eventSourceResult.logs,
    "Could not resolve the Cloudflare event-source export for a Worker",
  );
}
const eventSourceBundle = (
  await Promise.all(eventSourceResult.outputs.map((output) => output.text()))
).join("\n");
if (!eventSourceBundle.includes("X.EventSource")) {
  throw new Error(
    "Cloudflare event-source export was not retained in the Worker bundle",
  );
}

console.log(
  `alchemy-x Worker bundle and package exports verified (${result.outputs.length} output)`,
);
