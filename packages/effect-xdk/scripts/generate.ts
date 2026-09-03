#!/usr/bin/env bun
/* oxlint-disable anti-slop/no-shape-in-symbol-names -- SdkSpec's shape overrides are part of the shared compiler API. */
/**
 * generate — Smithy models → Effect SDK through Distilled's shared CLI.
 * Input: .generated-specs/*.json (scripts/convert.ts).
 * Output: src/services/*.ts, src/services/index.ts, src/operations.ts.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import * as Effect from "effect/Effect";
import { runGeneratorCli } from "@distilled.cloud/core/codegen/cli";
import { runTool } from "@distilled.cloud/core/codegen/format";
import {
  operationConst,
  errorUnionAlias,
  type SdkSpec,
} from "@distilled.cloud/core/codegen/generator";
import type { OperationDefinition } from "../src/operation-types.ts";
import source from "../specs/source.json";

const root =
  process.env.EFFECT_XDK_GENERATION_ROOT ?? path.resolve(import.meta.dir, "..");
const manifest: Readonly<Record<string, OperationDefinition>> = JSON.parse(
  await readFile(path.join(root, ".generated-specs/operations.json"), "utf8"),
);
const definitions = new Map(Object.entries(manifest));
const upperFirst = (value: string) => value[0]!.toUpperCase() + value.slice(1);
const namespace = (value: string) =>
  value.replace(/-([a-z])/gu, (_, letter: string) => letter.toUpperCase());
const binaryNames = new Set(
  [...definitions.values()]
    .filter((operation) => operation.response === "binary")
    .map((operation) => upperFirst(operation.id) + "Response"),
);

const spec: SdkSpec = {
  nullableTrait: "com.distilled.openapi#nullable",
  shapeDocs: true,
  sourceNote: `xdevplatform/xdk@${source.revision} (specs/openapi.json)`,
  operationDecl: {
    contextType: "XOpContext",
    commonErrorType: "XOpError",
    commonErrorClasses: ["XParseError"],
    protocol: "XProtocol",
    retry: "Retry.Retry",
  },
  postProcess: (code) =>
    code.includes("Stream.Stream<")
      ? code.replace(
          'import * as API from "@distilled.cloud/core/api";',
          'import * as API from "@distilled.cloud/core/api";\nimport type * as Stream from "effect/Stream";',
        )
      : code,
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
  operation: ({
    opName,
    exportName,
    inputName,
    outputTsType,
    outputSchema,
    doc,
  }) => {
    const definition = definitions.get(exportName);
    if (!definition) throw new Error(`No wire metadata for ${exportName}`);
    const streaming = definition.response === "stream";
    const output = streaming
      ? `Stream.Stream<${outputTsType}, XOpError>`
      : outputTsType;
    // Core's protocol contract owns decoding. A streamed HTTP body uses the
    // payload AST to decode each record while the operation returns a Stream.
    const schema = streaming
      ? `${outputSchema} as any as S.Schema<${output}>`
      : outputSchema;
    return [
      errorUnionAlias(opName, [], "XOpError"),
      ...(doc ? [`/** ${doc} */`] : []),
      operationConst({
        exportName,
        factory: "API.make",
        pure: "/*@__PURE__*/ ",
        typeAnnotation: `API.OperationMethod<${inputName}, ${output}, ${opName}Error, XOpContext>`,
        config: `{\ninput: ${inputName},\noutput: ${schema},\nerrors: [XParseError],\nprotocol: XProtocol,\n${definition.method === "POST" ? "" : "retry: Retry.Retry,\n"}operationName: ${JSON.stringify(exportName)},\n}`,
      }),
    ].join("\n");
  },
};

runGeneratorCli({
  description: "Generate the X Effect SDK from its Smithy models",
  root,
  patchesDir: false,
  excludeModel: (file) => file === "operations.json",
  barrelExportName: namespace,
  spec: () => spec,
  prepare: () =>
    Effect.promise(async () => {
      await Bun.write(
        path.join(root, "src/operations.ts"),
        "// AUTO-GENERATED from specs/openapi.json; do not edit.\n" +
          'import type { OperationDefinition } from "./operation-types.ts";\n' +
          `export const operations = ${JSON.stringify(manifest, null, 2)} as const satisfies Readonly<Record<string, OperationDefinition>>;\n`,
      );
    }),
  finalize: (directory) =>
    runTool([
      "bun",
      "x",
      "--no-install",
      "oxfmt",
      directory,
      path.join(root, "src/operations.ts"),
    ]),
});
