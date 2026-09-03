import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import source from "../specs/source.json";

const directory = fileURLToPath(new URL("../specs/", import.meta.url));
const updating = process.argv.includes("--update");
let revision = source.revision;
if (updating) {
  const response = await fetch(
    `https://api.github.com/repos/${source.repository}/commits/main`,
  );
  if (!response.ok)
    throw new Error(`X spec revision lookup failed: ${response.status}`);
  const commit: { sha: string } = await response.json();
  if (!/^[a-f0-9]{40}$/u.test(commit.sha))
    throw new Error("Invalid X spec revision");
  revision = commit.sha;
}
const url = `https://raw.githubusercontent.com/${source.repository}/${revision}/${source.path}`;
const response = await fetch(url);
if (!response.ok) throw new Error(`X spec download failed: ${response.status}`);
const contents = await response.text();
const sha256 = createHash("sha256").update(contents).digest("hex");
if (!updating && sha256 !== source.sha256)
  throw new Error("X spec checksum mismatch");
const document: { openapi: string; paths: object } = JSON.parse(contents);
if (document.openapi !== "3.0.0" || !document.paths)
  throw new Error("Unexpected X OpenAPI document");
await Bun.write(`${directory}openapi.json`, contents);
if (updating) {
  await Bun.write(
    `${directory}source.json`,
    JSON.stringify({ ...source, revision, sha256 }, null, 2) + "\n",
  );
}
console.log(`X OpenAPI pinned at ${revision} (${sha256})`);
