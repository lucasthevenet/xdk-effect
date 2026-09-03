import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dir, "..");
const packages = ["packages/effect-xdk"];

for (const packageDirectory of packages) {
  const manifestPath = path.join(root, packageDirectory, "package.json");
  // SAFETY: Each path is a workspace-owned package manifest whose name and
  // scripts fields are the only values consumed by this release assertion.
  const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as {
    readonly name: string;
    readonly scripts?: Record<string, string>;
  };
  if (!manifest.scripts?.prepack) {
    throw new Error(`${manifest.name} must build from its prepack script`);
  }

  const npmCache = await mkdtemp(path.join(os.tmpdir(), "effect-xdk-pack-"));
  try {
    const process = Bun.spawn(
      ["npm", "pack", "--dry-run", "--json", `./${packageDirectory}`],
      {
        cwd: root,
        env: { ...Bun.env, NPM_CONFIG_CACHE: npmCache },
        stdout: "pipe",
        stderr: "pipe",
      },
    );
    const [stdout, stderr, exitCode] = await Promise.all([
      new Response(process.stdout).text(),
      new Response(process.stderr).text(),
      process.exited,
    ]);
    if (exitCode !== 0) {
      throw new Error(`${manifest.name} pack failed:\n${stderr || stdout}`);
    }
    // SAFETY: `npm pack --dry-run --json` guarantees an array of pack results;
    // this script only reads the documented file path entries from that output.
    const result = JSON.parse(stdout) as readonly {
      readonly files: readonly { readonly path: string }[];
    }[];
    const files = new Set(result[0]?.files.map((file) => file.path) ?? []);
    const requiredFiles = [
      "package.json",
      "README.md",
      "lib/index.js",
      "lib/index.d.ts",
      "lib/client.js",
      "lib/client.d.ts",
      "src/client.ts",
      "lib/api.js",
      "lib/api.d.ts",
      "lib/webhook-handler.js",
      "lib/webhook-handler.d.ts",
      "lib/auth.js",
      "lib/auth.d.ts",
      "lib/oauth.js",
      "lib/oauth.d.ts",
      "src/auth.ts",
      "src/oauth.ts",
      "lib/credentials.js",
      "lib/credentials.d.ts",
      "lib/protocol.js",
      "lib/protocol.d.ts",
      "lib/retry.js",
      "lib/retry.d.ts",
      "lib/webhooks.js",
      "lib/webhooks.d.ts",
      "lib/services/index.js",
      "lib/services/posts.js",
      "lib/services/posts.d.ts",
      "src/services/posts.ts",
    ];
    for (const required of requiredFiles) {
      if (!files.has(required)) {
        throw new Error(`${manifest.name} tarball is missing ${required}`);
      }
    }
    for (const removed of [
      "lib/CredentialFiles.d.ts",
      "lib/CredentialFiles.js",
      "lib/OAuthLoopback.d.ts",
      "lib/OAuthLoopback.js",
      "lib/WebhookRoute.d.ts",
      "lib/WebhookRoute.js",
      "src/CredentialFiles.ts",
      "src/OAuthLoopback.ts",
      "src/WebhookRoute.ts",
      "src/operations.ts",
      "lib/operations.js",
      "lib/operations.d.ts",
      "src/operation-types.ts",
      "lib/operation-types.js",
      "lib/operation-types.d.ts",
      "src/operation-wire.ts",
      "lib/operation-wire.js",
      "lib/operation-wire.d.ts",
      "src/types.ts",
      "lib/types.js",
      "lib/types.d.ts",
    ]) {
      if (files.has(removed)) {
        throw new Error(`${manifest.name} tarball still contains ${removed}`);
      }
    }
    const buildState = [...files].find((file) => file.endsWith(".tsbuildinfo"));
    if (buildState !== undefined) {
      throw new Error(`${manifest.name} tarball contains ${buildState}`);
    }
    console.log(`${manifest.name}: ${files.size} files verified`);
  } finally {
    await rm(npmCache, { recursive: true, force: true });
  }
}
