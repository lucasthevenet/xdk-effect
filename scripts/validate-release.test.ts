import { expect, test } from "bun:test";
import { validatePackedFiles, validateVersion } from "./validate-release";

const files = () =>
  new Set([
    "package.json",
    "README.md",
    "LICENSE",
    "src/index.ts",
    "lib/index.js",
    "lib/index.d.ts",
    "src/services/users.ts",
    "lib/services/users.js",
    "lib/services/users.d.ts",
  ]);
const exports = {
  ".": {
    types: "./lib/index.d.ts",
    bun: "./src/index.ts",
    default: "./lib/index.js",
  },
  "./services/*": {
    types: "./lib/services/*.d.ts",
    default: "./lib/services/*.js",
  },
  "./internal": null,
};

test("release versions accept matching tags and reject mismatches", () => {
  validateVersion("0.1.0");
  validateVersion("0.1.0", "v0.1.0");
  validateVersion("0.2.0-beta.1", "v0.2.0-beta.1");
  expect(() => validateVersion("0.1.0", "v0.2.0")).toThrow("does not match");
  expect(() => validateVersion("0.1.0", "")).toThrow("does not match");
  for (const invalid of ["latest", "01.0.0", "0.1", "0.1.0-01"]) {
    expect(() => validateVersion(invalid)).toThrow(
      "Invalid npm release version",
    );
  }
});

test("package validation accepts conditional and wildcard exports", () => {
  validatePackedFiles(files(), exports);
});

test("package validation requires the license and every compiled source", () => {
  for (const missing of [
    "LICENSE",
    "lib/index.js",
    "lib/services/users.d.ts",
  ]) {
    const packed = files();
    packed.delete(missing);
    expect(() => validatePackedFiles(packed, exports)).toThrow();
  }
});

test("package validation rejects empty wildcard exports and private inputs", () => {
  expect(() => validatePackedFiles(files(), "./lib/missing/*.js")).toThrow(
    "no files matching",
  );
  for (const forbidden of [
    ".env",
    "src/.env.local",
    "lib/.tsbuildinfo",
    "specs/openapi.json",
    "scripts/generate.ts",
    "test/client.test.ts",
  ]) {
    const packed = files();
    packed.add(forbidden);
    expect(() => validatePackedFiles(packed, exports)).toThrow(
      "private build input",
    );
  }
});
