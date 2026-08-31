import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dir, "..");
const packages = ["packages/distilled-x", "packages/alchemy-x"];

for (const packageDirectory of packages) {
  const manifestPath = path.join(root, packageDirectory, "package.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as {
    readonly name: string;
    readonly scripts?: Record<string, string>;
  };
  if (!manifest.scripts?.prepack) {
    throw new Error(`${manifest.name} must build from its prepack script`);
  }

  const npmCache = await mkdtemp(path.join(os.tmpdir(), "alchemy-x-pack-"));
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
    const result = JSON.parse(stdout) as readonly {
      readonly files: readonly { readonly path: string }[];
    }[];
    const files = new Set(result[0]?.files.map((file) => file.path) ?? []);
    for (const required of [
      "package.json",
      "README.md",
      "lib/index.js",
      "lib/index.d.ts",
    ]) {
      if (!files.has(required)) {
        throw new Error(`${manifest.name} tarball is missing ${required}`);
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
