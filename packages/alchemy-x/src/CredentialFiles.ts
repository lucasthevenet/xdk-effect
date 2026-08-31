import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import {
  credentialsFilePath,
  profileCredentialsDirPath,
} from "alchemy/Auth/Credentials";
import {
  X_OAUTH_APP_STORE_KEY,
  X_OAUTH_TOKENS_STORE_KEY,
} from "./AuthEnvironment.ts";

export const X_STORED_CREDENTIAL_KEYS = [
  X_OAUTH_APP_STORE_KEY,
  X_OAUTH_TOKENS_STORE_KEY,
] as const;

/** Repair legacy permissive modes before any stored OAuth secret is read. */
export const repairStoredCredentialPermissionsWith = (
  fs: FileSystem.FileSystem,
  profileName: string,
  keys: readonly string[] = X_STORED_CREDENTIAL_KEYS,
) =>
  Effect.gen(function* () {
    const directory = profileCredentialsDirPath(profileName);
    if (yield* fs.exists(directory)) yield* fs.chmod(directory, 0o700);
    for (const key of keys) {
      const file = credentialsFilePath(profileName, key);
      if (yield* fs.exists(file)) yield* fs.chmod(file, 0o600);
    }
  });

export const repairStoredCredentialPermissions = (
  profileName: string,
  keys: readonly string[] = X_STORED_CREDENTIAL_KEYS,
) =>
  FileSystem.FileSystem.use((fs) =>
    repairStoredCredentialPermissionsWith(fs, profileName, keys),
  );
