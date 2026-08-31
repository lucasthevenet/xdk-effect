import { describe, expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Layer from "effect/Layer";
import * as Path from "effect/Path";
import * as Redacted from "effect/Redacted";
import { AuthProviders, type AuthProvider } from "alchemy/Auth/AuthProvider";
import {
  credentialsFilePath,
  CredentialsStore,
  profileCredentialsDirPath,
  type CredentialsStoreService,
} from "alchemy/Auth/Credentials";
import {
  X_AUTH_PROVIDER_NAME,
  X_OAUTH_APP_STORE_KEY,
  X_OAUTH_TOKENS_STORE_KEY,
  type XAuthConfig,
  type XResolvedCredentials,
  type XStoredOAuthApp,
  type XStoredOAuthTokens,
} from "../src/AuthEnvironment.ts";
import { makeXAuth } from "../src/AuthProvider.ts";

const deferred = <A>() => {
  let resolve!: (value: A | PromiseLike<A>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<A>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
};

type FileOperation =
  | {
      readonly type: "makeDirectory";
      readonly path: string;
      readonly options:
        | { readonly recursive?: boolean; readonly mode?: number }
        | undefined;
    }
  | { readonly type: "exists"; readonly path: string }
  | { readonly type: "chmod"; readonly path: string; readonly mode: number }
  | {
      readonly type: "writeFileString";
      readonly path: string;
      readonly data: string;
      readonly options:
        | { readonly flag?: FileSystem.OpenFlag; readonly mode?: number }
        | undefined;
    };

describe("X AuthProvider stored OAuth", () => {
  test("persists a rotated refresh token with restrictive modes before read returns", async () => {
    const profileName = "test-profile";
    const app = {
      type: "x-oauth-app",
      clientId: "oauth-client-id",
      clientSecret: "oauth-client-secret",
      appBearerToken: "app-bearer-token",
      consumerSecret: "consumer-secret",
      redirectUri: "http://127.0.0.1:9976/auth/callback",
      scopes: ["tweet.read", "users.read", "offline.access"],
    } satisfies XStoredOAuthApp;
    const tokens = {
      type: "x-oauth-tokens",
      accessToken: "expired-access-token",
      refreshToken: "old-refresh-token",
      expiresAt: 0,
      scopes: app.scopes,
      userId: "42",
    } satisfies XStoredOAuthTokens;
    const stored = new Map<string, unknown>([
      [X_OAUTH_APP_STORE_KEY, app],
      [X_OAUTH_TOKENS_STORE_KEY, tokens],
    ]);
    const store = {
      read: <T>(_profile: string, key: string) =>
        Effect.succeed(stored.get(key) as T | undefined),
      write: <T>(_profile: string, key: string, value: T) =>
        Effect.sync(() => {
          stored.set(key, value);
        }),
      delete: (_profile: string, key: string) =>
        Effect.sync(() => {
          stored.delete(key);
        }),
      deleteProfile: () => Effect.void,
    } satisfies CredentialsStoreService;

    const tokenFile = credentialsFilePath(
      profileName,
      X_OAUTH_TOKENS_STORE_KEY,
    );
    const appFile = credentialsFilePath(profileName, X_OAUTH_APP_STORE_KEY);
    const credentialDirectory = profileCredentialsDirPath(profileName);
    const operations: FileOperation[] = [];
    const lockFiles = new Map<string, string>();
    const writeEntered = deferred<XStoredOAuthTokens>();
    const releaseWrite = deferred<void>();
    const fs = FileSystem.makeNoop({
      makeDirectory: (path, options) =>
        Effect.sync(() => {
          operations.push({ type: "makeDirectory", path, options });
        }),
      exists: (path) =>
        Effect.sync(() => {
          operations.push({ type: "exists", path });
          return (
            path === credentialDirectory ||
            path === appFile ||
            path === tokenFile
          );
        }),
      chmod: (path, mode) =>
        Effect.sync(() => {
          operations.push({ type: "chmod", path, mode });
        }),
      writeFileString: (path, data, options) => {
        operations.push({ type: "writeFileString", path, data, options });
        if (path === tokenFile) {
          writeEntered.resolve(JSON.parse(data) as XStoredOAuthTokens);
          return Effect.promise(() => releaseWrite.promise);
        }
        return Effect.sync(() => {
          lockFiles.set(path, data);
        });
      },
      readFileString: (path) =>
        Effect.succeed(lockFiles.get(path) ?? "missing-lock-owner"),
      remove: (path) =>
        Effect.sync(() => {
          lockFiles.delete(path);
        }),
      utimes: () => Effect.void,
    });
    const registry: AuthProviders["Service"] = {};
    const dependencies = Layer.mergeAll(
      Layer.succeed(AuthProviders, registry),
      Layer.succeed(CredentialsStore, store),
      Layer.succeed(FileSystem.FileSystem, fs),
      Path.layer,
    );

    const originalFetch = globalThis.fetch;
    let refreshBody: URLSearchParams | undefined;
    globalThis.fetch = async (_input, init) => {
      refreshBody = new URLSearchParams(String(init?.body));
      return Response.json({
        access_token: "fresh-access-token",
        refresh_token: "rotated-refresh-token",
        token_type: "bearer",
        expires_in: 7_200,
        scope: "tweet.read users.read offline.access",
      });
    };

    let readSettled = false;
    try {
      const readPromise = Effect.runPromise(
        Effect.scoped(
          Effect.gen(function* () {
            yield* Layer.build(makeXAuth());
            const provider = registry[X_AUTH_PROVIDER_NAME] as AuthProvider<
              XAuthConfig,
              XResolvedCredentials
            >;
            return yield* provider.read(profileName, { method: "oauth" });
          }),
        ).pipe(Effect.provide(dependencies)),
      ).finally(() => {
        readSettled = true;
      });

      const writtenTokens = await writeEntered.promise;
      await Bun.sleep(0);

      expect(readSettled).toBe(false);
      expect(writtenTokens.accessToken).toBe("fresh-access-token");
      expect(writtenTokens.refreshToken).toBe("rotated-refresh-token");
      expect(refreshBody?.get("grant_type")).toBe("refresh_token");
      expect(refreshBody?.get("refresh_token")).toBe("old-refresh-token");

      const credentialOperations = operations.filter(
        (operation) =>
          operation.path === credentialDirectory ||
          operation.path === appFile ||
          operation.path === tokenFile,
      );
      expect(credentialOperations).toEqual([
        { type: "exists", path: credentialDirectory },
        { type: "chmod", path: credentialDirectory, mode: 0o700 },
        { type: "exists", path: appFile },
        { type: "chmod", path: appFile, mode: 0o600 },
        { type: "exists", path: credentialDirectory },
        { type: "chmod", path: credentialDirectory, mode: 0o700 },
        { type: "exists", path: tokenFile },
        { type: "chmod", path: tokenFile, mode: 0o600 },
        {
          type: "makeDirectory",
          path: credentialDirectory,
          options: { recursive: true, mode: 0o700 },
        },
        { type: "chmod", path: credentialDirectory, mode: 0o700 },
        { type: "exists", path: tokenFile },
        { type: "chmod", path: tokenFile, mode: 0o600 },
        {
          type: "writeFileString",
          path: tokenFile,
          data: JSON.stringify(writtenTokens, null, 2),
          options: { mode: 0o600 },
        },
      ]);

      releaseWrite.resolve();
      const credentials = await readPromise;

      expect(readSettled).toBe(true);
      expect(Redacted.value(credentials.userAccessToken)).toBe(
        "fresh-access-token",
      );
      expect(credentials.userId).toBe("42");
      expect(credentials.oauthScopes).toEqual([
        "tweet.read",
        "users.read",
        "offline.access",
      ]);
      expect(credentialOperations).toHaveLength(13);
      expect(
        operations.filter(
          (operation) =>
            operation.type === "chmod" && operation.path === tokenFile,
        ),
      ).toEqual([
        { type: "chmod", path: tokenFile, mode: 0o600 },
        { type: "chmod", path: tokenFile, mode: 0o600 },
        { type: "chmod", path: tokenFile, mode: 0o600 },
      ]);
    } finally {
      releaseWrite.resolve();
      globalThis.fetch = originalFetch;
    }
  });

  test("best-effort revokes both access and refresh tokens before logout", async () => {
    const profileName = "logout-profile";
    const stored = new Map<string, unknown>([
      [
        X_OAUTH_APP_STORE_KEY,
        {
          type: "x-oauth-app",
          clientId: "oauth-client-id",
          clientSecret: "oauth-client-secret",
          appBearerToken: "app-bearer-token",
          consumerSecret: "consumer-secret",
          redirectUri: "http://127.0.0.1:9976/auth/callback",
          scopes: ["tweet.read", "offline.access"],
        } satisfies XStoredOAuthApp,
      ],
      [
        X_OAUTH_TOKENS_STORE_KEY,
        {
          type: "x-oauth-tokens",
          accessToken: "access-token",
          refreshToken: "refresh-token",
          expiresAt: Date.now() + 60_000,
          scopes: ["tweet.read", "offline.access"],
        } satisfies XStoredOAuthTokens,
      ],
    ]);
    const store = {
      read: <T>(_profile: string, key: string) =>
        Effect.succeed(stored.get(key) as T | undefined),
      write: () => Effect.void,
      delete: (_profile: string, key: string) =>
        Effect.sync(() => {
          stored.delete(key);
        }),
      deleteProfile: () => Effect.void,
    } satisfies CredentialsStoreService;
    const registry: AuthProviders["Service"] = {};
    const lockFiles = new Map<string, string>();
    const dependencies = Layer.mergeAll(
      Layer.succeed(AuthProviders, registry),
      Layer.succeed(CredentialsStore, store),
      Layer.succeed(
        FileSystem.FileSystem,
        FileSystem.makeNoop({
          exists: () => Effect.succeed(false),
          makeDirectory: () => Effect.void,
          chmod: () => Effect.void,
          writeFileString: (path, data) =>
            Effect.sync(() => {
              lockFiles.set(path, data);
            }),
          readFileString: (path) =>
            Effect.succeed(lockFiles.get(path) ?? "missing-lock-owner"),
          remove: (path) =>
            Effect.sync(() => {
              lockFiles.delete(path);
            }),
          utimes: () => Effect.void,
        }),
      ),
      Path.layer,
    );
    const originalFetch = globalThis.fetch;
    const revoked: string[] = [];
    globalThis.fetch = async (_input, init) => {
      const body = new URLSearchParams(String(init?.body));
      revoked.push(body.get("token") ?? "");
      return Response.json({});
    };

    try {
      await Effect.runPromise(
        Effect.scoped(
          Effect.gen(function* () {
            yield* Layer.build(makeXAuth());
            const provider = registry[X_AUTH_PROVIDER_NAME] as AuthProvider<
              XAuthConfig,
              XResolvedCredentials
            >;
            yield* provider.logout(profileName, { method: "oauth" });
          }),
        ).pipe(Effect.provide(dependencies)),
      );

      expect(revoked).toEqual(["access-token", "refresh-token"]);
      expect(stored.has(X_OAUTH_APP_STORE_KEY)).toBe(false);
      expect(stored.has(X_OAUTH_TOKENS_STORE_KEY)).toBe(false);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
