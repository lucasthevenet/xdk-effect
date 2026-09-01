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

// Exercise the same resolver and conditions that Alchemy uses for a
// Cloudflare Worker. This deliberately retains the internal Node-only import:
// package resolution must reject it instead of falling through to a Node
// implementation that a simple source-entry bundle would never traverse.
const alchemyPackage = Bun.resolveSync(
  "alchemy/package.json",
  path.join(root, "packages/alchemy-x"),
);
const fromAlchemy = path.dirname(alchemyPackage);
const [{ rolldown }, { default: cloudflareRolldown }] = await Promise.all([
  import(Bun.resolveSync("rolldown", fromAlchemy)),
  import(
    Bun.resolveSync("@alchemy.run/cloudflare-runtime/rolldown", fromAlchemy)
  ),
]);
const virtualModule = (id: string, source: string) => ({
  name: `${id}-entry`,
  resolveId(candidate: string) {
    return candidate === id ? `\0${id}` : undefined;
  },
  load(candidate: string) {
    return candidate === `\0${id}` ? source : undefined;
  },
});

const blockedEntry = "virtual:alchemy-x-worker-export-check";

let resolverFailure: unknown;
let workerBuild:
  | Awaited<ReturnType<(typeof import("rolldown"))["rolldown"]>>
  | undefined;
try {
  workerBuild = await rolldown({
    input: blockedEntry,
    cwd: workerCwd,
    plugins: [
      cloudflareRolldown({
        compatibilityDate: "2026-08-31",
        compatibilityFlags: [],
      }),
      virtualModule(
        blockedEntry,
        [
          'import { startXOAuthLoopback } from "alchemy-x/internal/oauth-loopback";',
          "console.log(startXOAuthLoopback);",
          "export default {};",
        ].join("\n"),
      ),
    ],
  });

  const generated = await workerBuild.generate({ format: "esm" });
  const workerCode = generated.output
    .filter((output: { type: string }) => output.type === "chunk")
    .map((output: { type: string; code?: string }) => output.code ?? "")
    .join("\n");
  const leakedMarker = nodeOnlyMarkers.find((marker) =>
    workerCode.includes(marker),
  );
  throw new Error(
    leakedMarker === undefined
      ? "Worker resolver unexpectedly accepted the Node-only OAuth loopback export"
      : `Worker resolver bundled Node-only marker: ${leakedMarker}`,
  );
} catch (error) {
  resolverFailure = error;
} finally {
  await workerBuild?.close();
}

if (
  !(resolverFailure instanceof Error) ||
  !/resolve_error/i.test(resolverFailure.message) ||
  !/oauth-loopback/i.test(resolverFailure.message) ||
  !/not defined by exports/i.test(resolverFailure.message)
) {
  throw resolverFailure;
}

console.log(
  `alchemy-x Worker bundle and package exports verified (${result.outputs.length} output)`,
);
