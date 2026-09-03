import { describe, expect, test } from "bun:test";
import * as ConfigProvider from "effect/ConfigProvider";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Layer from "effect/Layer";
import * as Path from "effect/Path";
import * as Redacted from "effect/Redacted";
import { AuthProviders, type AuthProvider } from "alchemy/Auth/AuthProvider";
import {
  CredentialsStore,
  type CredentialsStoreService,
} from "alchemy/Auth/Credentials";
import {
  AlchemyProfile,
  CONFIG_VERSION,
  type AlchemyProfileProviders,
  type ProfileService,
} from "alchemy/Auth/Profile";
import {
  X_AUTH_PROVIDER_NAME,
  X_STORED_CREDENTIALS_KEY,
  type XAuthConfig,
  type XResolvedCredentials,
  type XStoredCredentials,
} from "../src/AuthEnvironment.ts";
import { makeXAuth } from "../src/AuthProvider.ts";

const storedAuthConfig: XAuthConfig = { method: "stored" };
void storedAuthConfig;

// @ts-expect-error The interactive OAuth authentication method is removed.
const removedOAuthConfig: XAuthConfig = { method: "oauth" };

const environment = {
  X_API_KEY: "api-key",
  X_API_SECRET: "consumer-secret",
  X_ACCESS_TOKEN: "user-access-token",
  X_ACCESS_TOKEN_SECRET: "user-token-secret",
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

const makeProfile = (): ProfileService => {
  const profiles: Record<string, AlchemyProfileProviders> = {};
  const readConfig = Effect.sync(() => ({
    version: CONFIG_VERSION,
    profiles,
  }));
  return {
    readConfig,
    writeConfig: (config) =>
      Effect.sync(() => {
        for (const key of Object.keys(profiles)) delete profiles[key];
        Object.assign(profiles, config.profiles);
      }),
    getProfile: (name) => Effect.sync(() => profiles[name]),
    setProfile: (name, profile) =>
      Effect.sync(() => {
        profiles[name] = profile;
      }),
    deleteProfile: (name) =>
      Effect.sync(() => {
        if (!(name in profiles)) return false;
        delete profiles[name];
        return true;
      }),
    loadOrConfigure: (auth, profileName, context) =>
      auth.configure(profileName, context),
  };
};

const makeStore = (initial?: XStoredCredentials) => {
  const values = new Map<string, unknown>();
  if (initial !== undefined) {
    values.set(`test-profile:${X_STORED_CREDENTIALS_KEY}`, initial);
  }
  let writes = 0;
  const store = {
    read: <T>(profile: string, key: string) => {
      // SAFETY: The fake store returns the value written under the caller's
      // exact profile/key pair, matching CredentialsStore's generic contract.
      return Effect.succeed(values.get(`${profile}:${key}`) as T | undefined);
    },
    write: <T>(profile: string, key: string, value: T) =>
      Effect.sync(() => {
        writes++;
        values.set(`${profile}:${key}`, value);
      }),
    delete: (profile: string, key: string) =>
      Effect.sync(() => {
        values.delete(`${profile}:${key}`);
      }),
    deleteProfile: (profile: string) =>
      Effect.sync(() => {
        for (const key of values.keys()) {
          if (key.startsWith(`${profile}:`)) values.delete(key);
        }
      }),
  } satisfies CredentialsStoreService;
  return {
    store,
    has: (profile: string, key: string) => values.has(`${profile}:${key}`),
    writes: () => writes,
  };
};

const dependencies = (
  registry: AuthProviders["Service"],
  store: CredentialsStoreService,
) =>
  Layer.mergeAll(
    Layer.succeed(AuthProviders, registry),
    Layer.succeed(AlchemyProfile, makeProfile()),
    Layer.succeed(CredentialsStore, store),
    Layer.succeed(FileSystem.FileSystem, lockFileSystem()),
    Path.layer,
  );

describe("X AuthProvider authentication", () => {
  test("selects environment authentication in CI and resolves env credentials", async () => {
    const registry: AuthProviders["Service"] = {};
    const credentialsStore = makeStore();

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
        Effect.provide(dependencies(registry, credentialsStore.store)),
        Effect.provideService(
          ConfigProvider.ConfigProvider,
          ConfigProvider.fromEnvRecord(environment),
        ),
      ),
    );

    expect(result.config).toEqual({ method: "env" });
    expect(Redacted.value(result.credentials.apiKey)).toBe(
      environment.X_API_KEY,
    );
    expect(Redacted.value(result.credentials.apiSecret)).toBe(
      environment.X_API_SECRET,
    );
    expect(Redacted.value(result.credentials.accessToken)).toBe(
      environment.X_ACCESS_TOKEN,
    );
    expect(Redacted.value(result.credentials.accessTokenSecret)).toBe(
      environment.X_ACCESS_TOKEN_SECRET,
    );
    expect(result.credentials.source.type).toBe("env");
  });

  test("reads, redacts, and removes stored credentials", async () => {
    const registry: AuthProviders["Service"] = {};
    const stored = {
      type: "oauth1",
      apiKey: "stored-api-key",
      apiSecret: "stored-consumer-secret",
      accessToken: "stored-user-token",
      accessTokenSecret: "stored-token-secret",
    } as const satisfies XStoredCredentials;
    const credentialsStore = makeStore(stored);

    const credentials = await Effect.runPromise(
      Effect.scoped(
        Effect.gen(function* () {
          yield* Layer.build(makeXAuth());
          // SAFETY: makeXAuth registers this exact config / credential pair.
          const provider = registry[X_AUTH_PROVIDER_NAME] as AuthProvider<
            XAuthConfig,
            XResolvedCredentials
          >;
          const resolved = yield* provider.read("test-profile", {
            method: "stored",
          });
          yield* provider.login("test-profile", { method: "stored" });
          yield* provider.logout("test-profile", { method: "stored" });
          return resolved;
        }),
      ).pipe(Effect.provide(dependencies(registry, credentialsStore.store))),
    );

    expect(Redacted.value(credentials.apiKey)).toBe(stored.apiKey);
    expect(Redacted.value(credentials.apiSecret)).toBe(stored.apiSecret);
    expect(Redacted.value(credentials.accessToken)).toBe(stored.accessToken);
    expect(Redacted.value(credentials.accessTokenSecret)).toBe(
      stored.accessTokenSecret,
    );
    expect(credentials.source).toEqual({
      type: "stored",
      details: X_STORED_CREDENTIALS_KEY,
    });
    expect(credentialsStore.writes()).toBe(0);
    expect(credentialsStore.has("test-profile", X_STORED_CREDENTIALS_KEY)).toBe(
      false,
    );
  });

  test("reports missing stored credentials with a login hint", async () => {
    const registry: AuthProviders["Service"] = {};
    const credentialsStore = makeStore();

    const read = Effect.scoped(
      Effect.gen(function* () {
        yield* Layer.build(makeXAuth());
        // SAFETY: makeXAuth registers this exact config / credential pair.
        const provider = registry[X_AUTH_PROVIDER_NAME] as AuthProvider<
          XAuthConfig,
          XResolvedCredentials
        >;
        return yield* provider.read("test-profile", { method: "stored" });
      }),
    ).pipe(Effect.provide(dependencies(registry, credentialsStore.store)));

    await expect(Effect.runPromise(read)).rejects.toThrow(
      "X stored OAuth 1.0a credentials are missing or invalid. Run: alchemy login --configure",
    );
  });

  test("rejects legacy stored OAuth2 credentials without exposing or overwriting them", async () => {
    const registry: AuthProviders["Service"] = {};
    const credentialsStore = makeStore();
    const old = {
      type: "oauth2",
      appBearerToken: "legacy-secret-bearer",
      userAccessToken: "legacy-secret-user",
      consumerSecret: "legacy-secret-consumer",
    };
    const read = Effect.scoped(
      Effect.gen(function* () {
        yield* credentialsStore.store.write(
          "test-profile",
          X_STORED_CREDENTIALS_KEY,
          old,
        );
        yield* Layer.build(makeXAuth());
        // SAFETY: makeXAuth registers this exact config / credential pair.
        const provider = registry[X_AUTH_PROVIDER_NAME] as AuthProvider<
          XAuthConfig,
          XResolvedCredentials
        >;
        return yield* provider.read("test-profile", { method: "stored" });
      }),
    ).pipe(Effect.provide(dependencies(registry, credentialsStore.store)));
    const error = await Effect.runPromise(read).catch((cause: Error) => cause);
    expect(error).toBeInstanceOf(Error);
    expect(String(error)).toContain("alchemy login --configure");
    expect(String(error)).not.toContain("legacy-secret");
    expect(credentialsStore.writes()).toBe(1);
    expect(credentialsStore.has("test-profile", X_STORED_CREDENTIALS_KEY)).toBe(
      true,
    );
  });

  test("reports a reconfigure hint for a legacy OAuth profile", async () => {
    const registry: AuthProviders["Service"] = {};
    const credentialsStore = makeStore();

    const read = Effect.scoped(
      Effect.gen(function* () {
        yield* Layer.build(makeXAuth());
        // SAFETY: makeXAuth registers this exact config / credential pair.
        const provider = registry[X_AUTH_PROVIDER_NAME] as AuthProvider<
          XAuthConfig,
          XResolvedCredentials
        >;
        return yield* provider.read("test-profile", removedOAuthConfig);
      }),
    ).pipe(Effect.provide(dependencies(registry, credentialsStore.store)));

    await expect(Effect.runPromise(read)).rejects.toThrow(
      "X authentication profile uses an unsupported method. Run: alchemy login --configure",
    );
  });
});
