import { describe, expect, test } from "bun:test";
import * as ConfigProvider from "effect/ConfigProvider";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Layer from "effect/Layer";
import * as Path from "effect/Path";
import * as Redacted from "effect/Redacted";
import { AuthProviders, type AuthProvider } from "alchemy/Auth/AuthProvider";
import {
  X_AUTH_PROVIDER_NAME,
  type XAuthConfig,
  type XResolvedCredentials,
} from "../src/AuthEnvironment.ts";
import { makeXAuth } from "../src/AuthProvider.ts";

// @ts-expect-error The interactive OAuth authentication method is removed.
const removedOAuthConfig: XAuthConfig = { method: "oauth" };
void removedOAuthConfig;

const environment = {
  X_BEARER_TOKEN: "app-bearer-token",
  X_API_SECRET: "consumer-secret",
  X_ACCESS_TOKEN: "user-access-token",
};

const lockFileSystem = () => {
  const files = new Map<string, string>();
  return FileSystem.makeNoop({
    makeDirectory: () => Effect.void,
    writeFileString: (path, data) =>
      Effect.sync(() => {
        files.set(path, data);
      }),
    readFileString: (path) => Effect.succeed(files.get(path) ?? ""),
    remove: (path) =>
      Effect.sync(() => {
        files.delete(path);
      }),
    utimes: () => Effect.void,
  });
};

describe("X AuthProvider environment authentication", () => {
  test("registers only the environment method and resolves its credentials", async () => {
    const registry: AuthProviders["Service"] = {};
    const dependencies = Layer.mergeAll(
      Layer.succeed(AuthProviders, registry),
      Layer.succeed(FileSystem.FileSystem, lockFileSystem()),
      Path.layer,
    );

    const result = await Effect.runPromise(
      Effect.scoped(
        Effect.gen(function* () {
          yield* Layer.build(makeXAuth());
          // SAFETY: makeXAuth registers this exact config / credential pair.
          const provider = registry[X_AUTH_PROVIDER_NAME] as AuthProvider<
            XAuthConfig,
            XResolvedCredentials
          >;
          const config = yield* provider.configure("test-profile", {
            ci: true,
          });
          const credentials = yield* provider.read("test-profile", config);
          yield* provider.login("test-profile", config);
          yield* provider.logout("test-profile", config);
          return { config, credentials };
        }),
      ).pipe(
        Effect.provide(dependencies),
        Effect.provideService(
          ConfigProvider.ConfigProvider,
          ConfigProvider.fromEnvRecord(environment),
        ),
      ),
    );

    expect(result.config).toEqual({ method: "env" });
    expect(Redacted.value(result.credentials.appBearerToken)).toBe(
      environment.X_BEARER_TOKEN,
    );
    expect(Redacted.value(result.credentials.consumerSecret)).toBe(
      environment.X_API_SECRET,
    );
    expect(Redacted.value(result.credentials.userAccessToken)).toBe(
      environment.X_ACCESS_TOKEN,
    );
    expect(result.credentials.source.type).toBe("env");
  });
});
