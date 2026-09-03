#!/usr/bin/env bun
/* oxlint-disable anti-slop/no-shape-in-symbol-names -- Smithy shapes are the converter's domain vocabulary. */
/**
 * convert — pinned X OpenAPI → one Smithy model per primary tag.
 * Follows Distilled's GitHub conversion pipeline; X's binary/multipart and
 * security metadata are normalized here, never in generated service files.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { convertOpenApiToSmithy } from "@distilled.cloud/core/codegen/openapi";
import source from "../specs/source.json";

interface Parameter {
  readonly $ref?: string;
  readonly name?: string;
  readonly in?: string;
  readonly explode?: boolean;
  readonly style?: string;
  readonly schema?: { readonly type?: string; readonly $ref?: string };
}
interface MediaType {
  readonly schema?: { readonly $ref?: string; readonly type?: string };
}
interface Operation {
  readonly operationId: string;
  readonly tags: readonly string[];
  readonly parameters?: readonly Parameter[];
  readonly security?: readonly Readonly<Record<string, readonly string[]>>[];
  readonly requestBody?: {
    readonly content: Readonly<Record<string, MediaType>>;
  };
  readonly responses: Readonly<
    Record<string, { readonly content?: Readonly<Record<string, MediaType>> }>
  >;
}
interface PathItem {
  readonly parameters?: readonly Parameter[];
  readonly get?: Operation;
  readonly post?: Operation;
  readonly put?: Operation;
  readonly delete?: Operation;
}
interface Document {
  readonly openapi: string;
  readonly info: { readonly version: string };
  readonly paths: Readonly<Record<string, PathItem>>;
  readonly components: {
    readonly parameters: Readonly<Record<string, Parameter>>;
  };
}
const root = path.resolve(import.meta.dir, "..");
const text = await readFile(path.join(root, "specs/openapi.json"), "utf8");
if (createHash("sha256").update(text).digest("hex") !== source.sha256) {
  throw new Error(
    "Spec differs from source.json; run specs:fetch or specs:update",
  );
}
const document: Document = JSON.parse(text);
if (document.openapi !== "3.0.0")
  throw new Error("Only OpenAPI 3.0.0 is supported");
const methods = ["get", "post", "put", "delete"] as const;
const upperFirst = (value: string) => value[0]!.toUpperCase() + value.slice(1);
const slug = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/gu, "-");
const namespace = (value: string) =>
  value.replace(/-([a-z])/gu, (_, letter: string) => letter.toUpperCase());
const resolveParameter = (parameter: Parameter): Parameter => {
  if (!parameter.$ref) return parameter;
  const prefix = "#/components/parameters/";
  if (!parameter.$ref.startsWith(prefix))
    throw new Error(`Unsupported parameter reference: ${parameter.$ref}`);
  const value =
    document.components.parameters[parameter.$ref.slice(prefix.length)];
  if (!value) throw new Error(`Unresolved parameter: ${parameter.$ref}`);
  return value;
};
const schemeNames = new Map([
  ["UserToken", "oauth1"],
  ["OAuth2UserToken", "oauth2"],
  ["BearerToken", "app"],
]);
const groups = new Map<string, Record<string, PathItem>>();
let converted = 0;
const operations = new Map<string, Operation>();
for (const [uri, item] of Object.entries(document.paths)) {
  for (const key of Object.keys(item)) {
    if (
      ![
        ...methods,
        "parameters",
        "summary",
        "description",
        "$ref",
        "servers",
      ].includes(key) &&
      !key.startsWith("x-")
    ) {
      throw new Error(`Unsupported path item ${key} at ${uri}`);
    }
  }
  for (const method of methods) {
    const operation = item[method];
    if (!operation) continue;
    if (!operation.operationId || operations.has(operation.operationId))
      throw new Error("Missing/duplicate operationId");
    operations.set(operation.operationId, operation);
    const group = slug(operation.tags[0] ?? "general");
    let paths = groups.get(group);
    if (!paths) {
      paths = {};
      groups.set(group, paths);
    }
    paths[uri] = {
      ...paths[uri],
      [method]: operation,
      parameters: item.parameters ?? [],
    };
  }
}

const outputs = new Map<string, string>();
for (const [group, paths] of [...groups].toSorted(([a], [b]) =>
  a.localeCompare(b),
)) {
  const model = convertOpenApiToSmithy(
    { ...document, paths },
    {
      namespace: `com.x.${namespace(group)}`,
      serviceName: upperFirst(namespace(group)),
      skipDeprecated: false,
      headerParams: true,
      sensitivePatterns: [],
    },
  );
  for (const [uri, item] of Object.entries(paths)) {
    for (const method of methods) {
      const operation = item[method];
      if (!operation) continue;
      const name = upperFirst(operation.operationId);
      const prefix = `com.x.${namespace(group)}#`;
      const shape = model.shapes[prefix + name];
      if (!shape) throw new Error(`Converter omitted ${operation.operationId}`);
      if (!shape.input || shape.input.target === "smithy.api#Unit") {
        shape.input = { target: prefix + name + "Request" };
        model.shapes[shape.input.target] = { type: "structure", members: {} };
      }
      const input = model.shapes[shape.input.target];
      const parameters = [
        ...(item.parameters ?? []),
        ...(operation.parameters ?? []),
      ].map(resolveParameter);
      const security = (operation.security ?? []).map((alternative) => {
        const names = Object.keys(alternative);
        if (names.length !== 1 || !schemeNames.has(names[0]!))
          throw new Error(`Unsupported security in ${name}`);
        return schemeNames.get(names[0]!)!;
      });
      for (const parameter of parameters) {
        if (parameter.style && !["simple", "form"].includes(parameter.style))
          throw new Error(`Unsupported parameter style in ${name}`);
      }
      for (const value of Object.values(input.members ?? {})) {
        // SAFETY: Distilled's converter emits Smithy member records at this seam.
        const member = value as {
          traits?: Record<string, string | boolean>;
          target: string;
        };
        const query = member.traits?.["smithy.api#httpQuery"];
        if (query === undefined) continue;
        const parameter = parameters.find(
          (entry) => entry.name === query && entry.in === "query",
        );
        if (parameter?.explode === false) {
          member.traits!["com.x#csvQuery"] = true;
        }
      }
      const success = Object.entries(operation.responses).find(([status]) =>
        status.startsWith("2"),
      )?.[1];
      const binary =
        success?.content?.["application/octet-stream"] !== undefined;
      const stream =
        method === "get" &&
        /\/stream(?:\/|$)/u.test(uri) &&
        !uri.endsWith("/rules") &&
        !uri.endsWith("/counts");
      const multipart =
        operation.requestBody?.content["multipart/form-data"] !== undefined;
      if (binary) {
        shape.output = { target: prefix + name + "Response" };
        model.shapes[shape.output.target] = {
          type: "structure",
          members: {},
          traits: { "com.x#binary": true },
        };
      }
      if (multipart && input?.members?.media) {
        input.members.media.target = prefix + "MediaData";
        model.shapes[prefix + "MediaData"] = { type: "document" };
      }
      input.traits = {
        ...input.traits,
        "com.x#security": security,
      };
      if (multipart) input.traits["com.x#multipart"] = true;
      if (operation.requestBody) input.traits["com.x#requestBody"] = true;
      shape.traits["com.x#response"] = binary
        ? "binary"
        : stream
          ? "stream"
          : "json";
      converted++;
    }
  }
  outputs.set(
    `.generated-specs/${group}.json`,
    JSON.stringify(model, null, 2) + "\n",
  );
}
if (converted !== operations.size)
  throw new Error("Conversion lost operations");
const target = process.env.EFFECT_XDK_GENERATION_ROOT ?? root;
for (const [file, code] of outputs) {
  await mkdir(path.dirname(path.join(target, file)), { recursive: true });
  await Bun.write(path.join(target, file), code);
}
console.log(
  `Converted ${converted} X operations into ${groups.size} Smithy models (spec ${document.info.version})`,
);
