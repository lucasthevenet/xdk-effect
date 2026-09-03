export interface OperationBinding {
  readonly name: string;
  readonly wire: string;
  readonly in: "path" | "query" | "header" | "body";
  readonly explode?: boolean;
}
export interface OperationDefinition {
  readonly id: string;
  readonly method: "GET" | "POST" | "PUT" | "DELETE";
  readonly path: string;
  readonly security: readonly ("oauth1" | "oauth2" | "app")[];
  readonly bindings: readonly OperationBinding[];
  readonly body: boolean;
  readonly response: "json" | "binary" | "stream";
  readonly multipart: boolean;
}
