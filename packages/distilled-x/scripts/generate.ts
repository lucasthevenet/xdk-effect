/* oxlint-disable anti-slop/no-shape-in-symbol-names -- "shape" is the Smithy compiler's domain vocabulary/API. */
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { convertOpenApiToSmithy } from "@distilled.cloud/core/codegen/openapi";
import {
  generateService,
  type SdkSpec,
} from "@distilled.cloud/core/codegen/generator";
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
interface Binding {
  readonly name: string;
  readonly wire: string;
  readonly in: "path" | "query" | "header" | "body";
  readonly explode?: boolean;
}
interface Definition {
  readonly id: string;
  readonly method: string;
  readonly path: string;
  readonly security: readonly string[];
  readonly bindings: readonly Binding[];
  readonly body: boolean;
  readonly response: "json" | "binary" | "stream";
  readonly multipart: boolean;
}

const root = path.resolve(import.meta.dir, "..");
const check = process.argv.includes("--check");
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
const definitions = new Map<string, Definition>();
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
  const binaryNames = new Set<string>();
  for (const [uri, item] of Object.entries(paths)) {
    for (const method of methods) {
      const operation = item[method];
      if (!operation) continue;
      const name = upperFirst(operation.operationId);
      const prefix = `com.x.${namespace(group)}#`;
      const shape = model.shapes[prefix + name];
      if (!shape) throw new Error(`Converter omitted ${operation.operationId}`);
      const input = model.shapes[shape.input?.target];
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
      const bindings: Binding[] = Object.entries(input?.members ?? {}).map(
        ([key, value]) => {
          // SAFETY: Distilled's converter emits Smithy member records at this seam.
          const member = value as {
            traits?: Record<string, string>;
            target: string;
          };
          const traits = member.traits ?? {};
          const query = traits["smithy.api#httpQuery"];
          const header = traits["smithy.api#httpHeader"];
          const label = "smithy.api#httpLabel" in traits;
          const wire = query ?? header ?? traits["smithy.api#jsonName"] ?? key;
          const location = label
            ? "path"
            : query
              ? "query"
              : header
                ? "header"
                : "body";
          const parameter = parameters.find(
            (entry) => entry.name === wire && entry.in === location,
          );
          if (parameter?.style && !["simple", "form"].includes(parameter.style))
            throw new Error(`Unsupported parameter style in ${name}`);
          return {
            name: key,
            wire,
            in: location,
            explode: parameter?.explode ?? true,
          };
        },
      );
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
        model.shapes[shape.output.target] = { type: "structure", members: {} };
        binaryNames.add(name + "Response");
      }
      if (multipart && input?.members?.media) {
        input.members.media.target = prefix + "MediaData";
        model.shapes[prefix + "MediaData"] = { type: "document" };
      }
      definitions.set(operation.operationId, {
        id: operation.operationId,
        method: method.toUpperCase(),
        path: uri,
        security,
        bindings,
        body: operation.requestBody !== undefined,
        response: binary ? "binary" : stream ? "stream" : "json",
        multipart,
      });
    }
  }
  outputs.set(
    `.generated-specs/${group}.json`,
    JSON.stringify(model, null, 2) + "\n",
  );
  const spec: SdkSpec = {
    nullableTrait: "com.distilled.openapi#nullable",
    shapeDocs: true,
    header: () =>
      `// AUTO-GENERATED from xdevplatform/xdk@${source.revision}; do not edit.\nimport * as S from "@distilled.cloud/core/schema";\nimport * as T from "../traits.ts";\nimport { makeOperation, makeBinaryOperation, makeStreamOperation } from "../operation.ts";\nimport { operations } from "../operations.ts";\n`,
    extraBindings: [
      {
        trait: "com.distilled.openapi#rawResponse",
        binding: "rawResponse",
        pipe: "T.RawResponse()",
        rootPipe: "T.RawResponseRoot()",
      },
    ],
    union: ({ name, caseTargets, tsRef }) => [
      `export type ${name} = ${caseTargets.map(tsRef).join(" | ") || "unknown"};`,
      `export const ${name} = /*@__PURE__*/ S.Unknown as any as S.Schema<${name}>;`,
    ],
    shapeOverride: ({ name }) => {
      if (name === "MediaData")
        return [
          "export type MediaData = string | Blob;",
          "export const MediaData = S.Union([S.String, S.instanceOf(Blob)]);",
        ];
      if (binaryNames.has(name))
        return [
          `export type ${name} = Uint8Array;`,
          `export const ${name} = S.instanceOf(Uint8Array);`,
        ];
      return undefined;
    },
    operation: ({ exportName, inputName, outputTsType, outputSchema }) => {
      const definition = definitions.get(exportName);
      if (!definition) throw new Error(`No wire metadata for ${exportName}`);
      const factory =
        definition.response === "stream"
          ? "makeStreamOperation"
          : definition.response === "binary"
            ? "makeBinaryOperation"
            : "makeOperation";
      return `export const ${exportName} = /*@__PURE__*/ ${factory}<${inputName}, ${outputTsType}>(operations.${exportName}, () => ${inputName}, () => ${outputSchema});\n`;
    },
  };
  const generated = generateService(model, spec);
  outputs.set(`src/services/${group}.ts`, generated.code);
}
if (definitions.size !== operations.size)
  throw new Error("Generation lost operations");
outputs.set(
  "src/operations.ts",
  `// AUTO-GENERATED from specs/openapi.json; do not edit.\nimport type { OperationDefinition } from "./operation-types.ts";\nexport const operations = ${JSON.stringify(Object.fromEntries([...definitions].toSorted(([a], [b]) => a.localeCompare(b))), null, 2)} as const satisfies Readonly<Record<string, OperationDefinition>>;\n`,
);
outputs.set(
  "src/services/index.ts",
  "// AUTO-GENERATED; do not edit.\n" +
    [...groups.keys()]
      .toSorted()
      .map((group) => `export * as ${namespace(group)} from "./${group}.ts";`)
      .join("\n") +
    "\n",
);

const target = check
  ? await mkdtemp(path.join(tmpdir(), "distilled-x-generation-"))
  : root;
try {
  for (const [file, code] of outputs) {
    await mkdir(path.dirname(path.join(target, file)), { recursive: true });
    await Bun.write(path.join(target, file), code);
  }
  const formatter = Bun.spawn(
    [
      "bun",
      "x",
      "--no-install",
      "oxfmt",
      path.join(target, "src/services"),
      path.join(target, "src/operations.ts"),
    ],
    { cwd: root, stdout: "inherit", stderr: "inherit" },
  );
  if ((await formatter.exited) !== 0)
    throw new Error("Generated-source formatting failed");
  if (check) {
    for (const file of outputs.keys()) {
      if (
        (await readFile(path.join(root, file), "utf8").catch(() => "")) !==
        (await readFile(path.join(target, file), "utf8"))
      ) {
        throw new Error(
          `Generated file is stale: ${file}. Run bun run generate.`,
        );
      }
    }
  }
  // Reject stale files instead of silently deleting files a user may have added.
  for (const folder of ["src/services", ".generated-specs"]) {
    for (const file of await readdir(path.join(root, folder)).catch(() => [])) {
      if (!outputs.has(`${folder}/${file}`))
        throw new Error(
          `Unexpected generated file: ${folder}/${file}; review its removal.`,
        );
    }
  }
  console.log(
    `${check ? "Verified" : "Generated"} ${definitions.size} X operations in ${groups.size} services (spec ${document.info.version})`,
  );
} finally {
  if (check) await rm(target, { recursive: true, force: true });
}
