import { XInputError } from "./errors.ts";
import type { OperationDefinition } from "./operation-types.ts";

interface WireOptions {
  readonly headers: Headers;
  readonly rawBody?: FormData;
  readonly json?: object;
}

interface PreparedOperation {
  readonly path: `/${string}`;
  readonly options: WireOptions;
}

/** Serialize generated bindings; authentication sees the final encoded URL. */
export const prepareOperation = <I extends object>(
  definition: OperationDefinition,
  input: I,
): PreparedOperation => {
  // SAFETY: Entries are own enumerable values of the schema-validated input.
  const values = new Map(Object.entries(input) as [string, I[keyof I]][]);
  let path = definition.path;
  const query = new URLSearchParams();
  const headers = new Headers();
  if (definition.response === "binary")
    headers.set("Accept", "application/octet-stream");
  const body = new Map<string, I[keyof I]>();
  for (const binding of definition.bindings) {
    const value = values.get(binding.name);
    if (value === undefined) continue;
    switch (binding.in) {
      case "path":
        path = path.replace(
          `{${binding.wire}}`,
          encodeURIComponent(String(value)),
        );
        break;
      case "query":
        if (Array.isArray(value)) {
          if (binding.explode)
            for (const item of value) query.append(binding.wire, String(item));
          else query.set(binding.wire, value.join(","));
        } else query.set(binding.wire, String(value));
        break;
      case "header":
        headers.set(binding.wire, String(value));
        break;
      case "body":
        body.set(binding.wire, value);
        break;
    }
  }
  if (path.includes("{"))
    throw new XInputError(`Missing path parameter for ${definition.id}`);
  if (query.size) path += `?${query}`;
  const options: WireOptions = { headers };
  let content: WireOptions = options;
  if (
    definition.multipart &&
    [...body.values()].some((value) => value instanceof Blob)
  ) {
    const form = new FormData();
    for (const [name, value] of body) {
      if (value instanceof Blob) form.append(name, value);
      else form.append(name, String(value));
    }
    content = { ...options, rawBody: form };
  } else if (definition.body)
    content = { ...options, json: Object.fromEntries(body) };
  // SAFETY: Generated paths are absolute API paths; substitution cannot change the leading slash.
  return { path: path as `/${string}`, options: content };
};
