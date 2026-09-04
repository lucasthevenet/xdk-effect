#!/usr/bin/env bun
/** Validate release metadata and the files npm will publish. */
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import * as Predicate from "effect/Predicate";
import * as Schema from "effect/Schema";

const PackageJson = Schema.Struct({
  name: Schema.Literal("xdk-effect"),
  version: Schema.String,
  license: Schema.Literal("Apache-2.0"),
  repository: Schema.Struct({
    type: Schema.Literal("git"),
    url: Schema.Literal("git+https://github.com/lucasthevenet/xdk-effect.git"),
    directory: Schema.Literal("packages/xdk-effect"),
  }),
  publishConfig: Schema.Struct({
    access: Schema.Literal("public"),
    provenance: Schema.Literal(true),
  }),
  scripts: Schema.Struct({ prepack: Schema.String }),
  dependencies: Schema.Record(Schema.String, Schema.String),
  peerDependencies: Schema.Record(Schema.String, Schema.String),
  exports: Schema.Record(Schema.String, Schema.Json),
});

const PackResults = Schema.Array(
  Schema.Struct({
    name: Schema.String,
    version: Schema.String,
    files: Schema.Array(Schema.Struct({ path: Schema.String })),
  }),
);

export function validateVersion(version: string, releaseTag?: string): void {
  if (
    !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?$/.test(
      version,
    )
  ) {
    throw new Error(`Invalid npm release version: ${version}`);
  }
  if (releaseTag !== undefined && releaseTag.replace(/^v/, "") !== version) {
    throw new Error(
      `Release ${releaseTag} does not match package version ${version}`,
    );
  }
}

function exportTargets(value: Schema.Json): string[] {
  if (Predicate.isString(value)) return [value];
  if (
    value === null ||
    Predicate.isNumber(value) ||
    Predicate.isBoolean(value)
  ) {
    return [];
  }
  return Object.values(value).flatMap(exportTargets);
}

export function validatePackedFiles(
  files: ReadonlySet<string>,
  exports: Schema.Json,
): void {
  const required = ["package.json", "README.md", "LICENSE", "src/index.ts"];
  for (const target of exportTargets(exports)) {
    if (!target.startsWith("./") || target.includes("..")) {
      throw new Error(`Invalid export target: ${target}`);
    }
    const pattern = target.slice(2);
    if (pattern.includes("*")) {
      const glob = new Bun.Glob(pattern);
      if (![...files].some((file) => glob.match(file))) {
        throw new Error(`Tarball has no files matching export ${target}`);
      }
    } else {
      required.push(pattern);
    }
  }
  for (const file of files) {
    if (file.startsWith("src/") && file.endsWith(".ts")) {
      const stem = file.replace(/^src\//, "lib/").replace(/\.ts$/, "");
      required.push(`${stem}.js`, `${stem}.d.ts`);
    }
    if (
      /^(?:test|scripts|specs|\.generated-specs|node_modules)\//.test(file) ||
      /(?:^|\/)\.env(?:\.|$)/.test(file) ||
      file.endsWith(".tsbuildinfo") ||
      file.startsWith("tsconfig")
    ) {
      throw new Error(`Tarball contains private build input ${file}`);
    }
  }
  for (const file of required) {
    if (!files.has(file)) throw new Error(`Tarball is missing ${file}`);
  }
}

async function main(): Promise<void> {
  const root = resolve(import.meta.dir, "..");
  const directory = resolve(root, "packages/xdk-effect");
  const manifest = Schema.decodeUnknownSync(Schema.fromJsonString(PackageJson))(
    await readFile(resolve(directory, "package.json"), "utf8"),
  );
  validateVersion(manifest.version, process.env.RELEASE_VERSION);
  for (const version of Object.values({
    ...manifest.dependencies,
    ...manifest.peerDependencies,
  })) {
    if (/^(?:workspace|catalog|file|link):/.test(version)) {
      throw new Error(`Unpublishable dependency version: ${version}`);
    }
  }

  const cache = await mkdtemp(resolve(tmpdir(), "xdk-effect-release-"));
  try {
    const child = Bun.spawn(["npm", "pack", "--dry-run", "--json", directory], {
      cwd: root,
      env: { ...process.env, npm_config_cache: cache },
      stdout: "pipe",
      stderr: "inherit",
    });
    const stdout = await new Response(child.stdout).text();
    if ((await child.exited) !== 0) throw new Error("npm pack failed");
    const results = Schema.decodeUnknownSync(
      Schema.fromJsonString(PackResults),
    )(stdout);
    const pack = results[0];
    if (
      results.length !== 1 ||
      !pack ||
      pack.name !== manifest.name ||
      pack.version !== manifest.version
    ) {
      throw new Error("npm pack returned unexpected package metadata");
    }
    const files = new Set(pack.files.map((file) => file.path));
    validatePackedFiles(files, manifest.exports);
    console.log(
      `${manifest.name}@${manifest.version}: ${files.size} package files validated`,
    );
  } finally {
    await rm(cache, { recursive: true, force: true });
  }
}

if (import.meta.main) await main();
