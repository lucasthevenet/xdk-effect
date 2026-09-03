#!/usr/bin/env bun
/** Re-run conversion and Distilled's generator in isolation, then compare artifacts. */
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dir, "..");
const target = await mkdtemp(path.join(tmpdir(), "effect-xdk-generation-"));
try {
  for (const script of ["convert.ts", "generate.ts"]) {
    const child = Bun.spawn(["bun", `scripts/${script}`], {
      cwd: root,
      env: { ...process.env, EFFECT_XDK_GENERATION_ROOT: target },
      stdout: "pipe",
      stderr: "pipe",
    });
    const [out, err, status] = await Promise.all([
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
      child.exited,
    ]);
    if (status !== 0) throw new Error(`${script} failed:\n${err}\n${out}`);
  }
  for (const folder of [".generated-specs", "src/services"]) {
    const expected = (await readdir(path.join(target, folder))).toSorted();
    const actual = (await readdir(path.join(root, folder))).toSorted();
    if (expected.join("\n") !== actual.join("\n"))
      throw new Error(
        `Stale generated file list in ${folder}; regenerate and review removed files`,
      );
    for (const file of expected) {
      if (
        (await readFile(path.join(root, folder, file), "utf8")) !==
        (await readFile(path.join(target, folder, file), "utf8"))
      ) {
        throw new Error(
          `Stale generated file: ${folder}/${file}. Run bun run generate.`,
        );
      }
    }
  }
  if (
    (await readFile(path.join(root, "src/api.ts"), "utf8")) !==
    (await readFile(path.join(target, "src/api.ts"), "utf8"))
  ) {
    throw new Error("Stale generated client API. Run bun run generate.");
  }
  console.log(
    "Verified X Smithy models, generated services, and schema traits",
  );
} finally {
  await rm(target, { recursive: true, force: true });
}
