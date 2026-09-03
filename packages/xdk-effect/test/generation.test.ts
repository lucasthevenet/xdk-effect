import { expect, test } from "bun:test";
import { createHash } from "node:crypto";
import * as Predicate from "effect/Predicate";
import * as Schema from "effect/Schema";
import {
  getAnn,
  getProps,
  getPropAnn,
  nameOf,
} from "@distilled.cloud/core/protocol-http";
import { httpSymbol, querySymbol } from "@distilled.cloud/core/trait";
import * as T from "../src/traits.ts";
import * as services from "../src/services/index.ts";
import source from "../specs/source.json";

interface SpecOperation {
  readonly operationId: string;
  readonly parameters?: readonly {
    readonly name?: string;
    readonly in?: string;
    readonly explode?: boolean;
    readonly $ref?: string;
  }[];
  readonly requestBody?: {
    readonly content: Readonly<Record<string, Schema.JsonObject>>;
  };
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
  const exported = new Map(
    Object.values(services).flatMap((service) => Object.entries(service)),
  );
  const requests = [...exported.values()].filter(Schema.isSchema);
  const schemes = new Map([
    ["BearerToken", "app"],
    ["UserToken", "oauth1"],
    ["OAuth2UserToken", "oauth2"],
  ]);
  let count = 0;
  let multipart = 0;
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
      const name = operation.operationId;
      expect(Predicate.isFunction(exported.get(name))).toBeTrue();
      const request = requests.find((schema) => {
        const http = getAnn(schema.ast, httpSymbol);
        return (
          Predicate.hasProperty(http, "uri") &&
          Predicate.hasProperty(http, "method") &&
          http.uri === path &&
          http.method === method.toUpperCase()
        );
      });
      if (!request) throw new Error(`Missing request schema: ${name}`);
      expect(getAnn(request.ast, httpSymbol)).toMatchObject({
        uri: path,
        method: method.toUpperCase(),
      });
      expect(getAnn(request.ast, T.securitySymbol)).toEqual(
        (operation.security ?? []).flatMap((alternative) =>
          Object.keys(alternative).map((scheme) => schemes.get(scheme)),
        ),
      );
      const isMultipart = Boolean(
        operation.requestBody?.content["multipart/form-data"],
      );
      expect(getAnn(request.ast, T.multipartSymbol) === true).toBe(isMultipart);
      expect(getAnn(request.ast, T.requestBodySymbol) === true).toBe(
        Boolean(operation.requestBody),
      );
      if (isMultipart) multipart++;
      for (const parameter of operation.parameters ?? []) {
        if (parameter.in !== "query" || !parameter.name) continue;
        const property = getProps(request.ast).find(
          (prop) => nameOf(prop, querySymbol) === parameter.name,
        );
        expect(property).toBeDefined();
        if (property)
          expect(getPropAnn(property, T.csvQuerySymbol) === true).toBe(
            parameter.explode === false,
          );
      }
    }
  }
  expect(
    [...exported.values()].filter(
      (value) => Predicate.isFunction(value) && !Schema.isSchema(value),
    ),
  ).toHaveLength(count);
  expect(count).toBeGreaterThan(150);
  expect(multipart).toBe(3);
});
