#!/usr/bin/env bun
/* oxlint-disable anti-slop/no-shape-in-symbol-names -- SdkSpec's shape overrides are part of the shared compiler API. */
/**
 * generate — Smithy models → Effect SDK through Distilled's shared CLI.
 * Input: .generated-specs/*.json (scripts/convert.ts).
 * Output: src/services/*.ts, src/services/index.ts.
 */
import path from "node:path";
import { readdir, readFile, writeFile } from "node:fs/promises";
import * as Effect from "effect/Effect";
import { runGeneratorCli } from "@distilled.cloud/core/codegen/cli";
import { runTool } from "@distilled.cloud/core/codegen/format";
import {
  operationConst,
  errorUnionAlias,
  type SdkSpec,
} from "@distilled.cloud/core/codegen/generator";
import type { ShapeMap } from "@distilled.cloud/core/codegen/graph";
import source from "../specs/source.json";

const root =
  process.env.EFFECT_XDK_GENERATION_ROOT ?? path.resolve(import.meta.dir, "..");
const namespace = (value: string) =>
  value.replace(/-([a-z])/gu, (_, letter: string) => letter.toUpperCase());
const spec = (shapes: ShapeMap): SdkSpec => ({
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
  memberTraitPipes: { "com.x#csvQuery": "T.CsvQuery" },
  structPipes: ({ id, httpTrait }) => [
    ...(httpTrait ? [`T.Http(${JSON.stringify(httpTrait)})`] : []),
    ...Object.entries({
      "com.x#security": "T.Security",
      "com.x#multipart": "T.Multipart",
      "com.x#requestBody": "T.RequestBody",
    }).flatMap(([trait, pipe]) =>
      shapes[id]?.traits?.[trait] === undefined
        ? []
        : [`${pipe}(${JSON.stringify(shapes[id].traits[trait])})`],
    ),
  ],
  union: ({ name, caseTargets, tsRef }) => [
    `export type ${name} = ${caseTargets.map(tsRef).join(" | ") || "unknown"};`,
    `export const ${name} = /*@__PURE__*/ S.Unknown as any as S.Schema<${name}>;`,
  ],
  shapeOverride: ({ name, def }) => {
    if (name === "MediaData")
      return [
        "export type MediaData = string | Blob;",
        "export const MediaData = S.Union([S.String, S.instanceOf(Blob)]);",
      ];
    if (def.traits?.["com.x#binary"])
      return [
        `export type ${name} = Uint8Array;`,
        `export const ${name} = S.instanceOf(Uint8Array);`,
      ];
    return undefined;
  },
  operation: ({
    op,
    opName,
    exportName,
    inputName,
    outputTsType,
    outputSchema,
    doc,
  }) => {
    const response = op.def.traits["com.x#response"];
    const streaming = response === "stream";
    const output = streaming
      ? `Stream.Stream<${outputTsType}, XOpError>`
      : outputTsType;
    // Core's protocol contract owns decoding. A streamed HTTP body uses the
    // payload AST to decode each record while the operation returns a Stream.
    const schema = streaming
      ? `${outputSchema}.pipe(T.Response("stream")) as any as S.Schema<${output}>`
      : response === "binary"
        ? `${outputSchema}.pipe(T.Response("binary"))`
        : outputSchema;
    return [
      errorUnionAlias(opName, [], "XOpError"),
      ...(doc ? [`/** ${doc} */`] : []),
      operationConst({
        exportName,
        factory: "API.make",
        pure: "/*@__PURE__*/ ",
        typeAnnotation: `API.OperationMethod<${inputName}, ${output}, ${opName}Error, XOpContext>`,
        config: `{\ninput: ${inputName},\noutput: ${schema},\nerrors: [XParseError],\nprotocol: XProtocol,\n${op.def.traits["smithy.api#http"].method === "POST" ? "" : "retry: Retry.Retry,\n"}operationName: ${JSON.stringify(exportName)},\n}`,
      }),
    ].join("\n");
  },
});

runGeneratorCli({
  description: "Generate the X Effect SDK from its Smithy models",
  root,
  patchesDir: false,
  barrelExportName: namespace,
  spec: (model) => spec(model.shapes),
  finalize: (directory) =>
    Effect.gen(function* () {
      // Bind only generated operations, not the schemas exported beside them.
      yield* Effect.promise(async () => {
        const files = (await readdir(directory))
          .filter((file) => file !== "index.ts" && file.endsWith(".ts"))
          .toSorted();
        const imports: string[] = [];
        const groups: string[] = [];
        for (const file of files) {
          const group = namespace(file.slice(0, -3));
          imports.push(`import * as ${group} from "./services/${file}";`);
          const code = await readFile(path.join(directory, file), "utf8");
          const operations = [
            ...code.matchAll(/export const (\w+): API\.OperationMethod</gu),
          ].map((match) => match[1]);
          groups.push(
            `${group}: {${operations.map((name) => `${name}: bind(${group}.${name})`).join(",\n")}}`,
          );
        }
        await writeFile(
          path.join(directory, "../api.ts"),
          [
            "// AUTO-GENERATED by scripts/generate.ts. Do not edit.",
            'import type { BindOperation } from "./client.ts";',
            ...imports,
            `export const makeApi = (bind: BindOperation) => ({${groups.join(",\n")}});`,
            "export type Api = ReturnType<typeof makeApi>;",
          ].join("\n"),
        );
      });
      yield* runTool([
        "bun",
        "x",
        "--no-install",
        "oxfmt",
        directory,
        path.join(directory, "../api.ts"),
      ]);
    }),
});
