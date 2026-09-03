import { expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { operations } from "../src/operations.ts";
import * as services from "../src/services/index.ts";
import source from "../specs/source.json";

interface SpecOperation {
  readonly operationId: string;
  readonly security?: readonly Readonly<Record<string, readonly string[]>>[];
}
interface Spec {
  readonly paths: Readonly<
    Record<string, Readonly<Record<string, SpecOperation>>>
  >;
}

test("the checked-in SDK covers every pinned OpenAPI operation and security alternative", async () => {
  const bytes = await Bun.file(
    new URL("../specs/openapi.json", import.meta.url),
  ).text();
  expect(createHash("sha256").update(bytes).digest("hex")).toBe(source.sha256);
  const spec: Spec = JSON.parse(bytes);
  const generated = new Map(Object.entries(operations));
  const exported = new Set(
    Object.values(services).flatMap((service) => Object.keys(service)),
  );
  const schemes = new Map([
    ["BearerToken", "app"],
    ["UserToken", "oauth1"],
    ["OAuth2UserToken", "oauth2"],
  ]);
  let count = 0;
  for (const [path, methods] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      if (
        ![
          "get",
          "post",
          "put",
          "delete",
          "patch",
          "head",
          "options",
          "trace",
        ].includes(method)
      )
        continue;
      count++;
      const definition = generated.get(operation.operationId);
      if (!definition)
        throw new Error(
          `Missing generated operation: ${operation.operationId}`,
        );
      expect(definition).toMatchObject({
        id: operation.operationId,
        path,
        method: method.toUpperCase(),
      });
      expect(
        (operation.security ?? []).flatMap((alternative) =>
          Object.keys(alternative).map((scheme) => schemes.get(scheme)),
        ),
      ).toEqual([...definition.security]);
      expect(exported.has(operation.operationId)).toBe(true);
    }
  }
  expect(generated.size).toBe(count);
  expect(count).toBeGreaterThan(150);
  expect(
    Object.values(operations).filter(
      (operation) => operation.response === "binary",
    ),
  ).toHaveLength(2);
  expect(
    Object.values(operations).filter((operation) => operation.multipart),
  ).toHaveLength(3);
});
