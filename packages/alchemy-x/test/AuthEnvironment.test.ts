import { describe, expect, test } from "bun:test";
import * as ConfigProvider from "effect/ConfigProvider";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import { readEnvCredentials } from "../src/AuthEnvironment.ts";

const requiredEnvironment = {
  X_API_KEY: "api-key",
  X_API_SECRET: "api-secret",
  X_ACCESS_TOKEN: "user-access-token",
  X_ACCESS_TOKEN_SECRET: "user-token-secret",
};

const readWithEnvironment = (environment: Record<string, string>) =>
  Effect.runPromise(
    readEnvCredentials().pipe(
      Effect.provideService(
        ConfigProvider.ConfigProvider,
        ConfigProvider.fromEnvRecord(environment),
      ),
    ),
  );

describe("X authentication environment", () => {
  test("resolves just the four OAuth1 credentials, redacted", async () => {
    const credentials = await readWithEnvironment(requiredEnvironment);
    expect(credentials.type).toBe("oauth1");
    expect(Redacted.value(credentials.apiKey)).toBe(
      requiredEnvironment.X_API_KEY,
    );
    expect(Redacted.value(credentials.apiSecret)).toBe(
      requiredEnvironment.X_API_SECRET,
    );
    expect(Redacted.value(credentials.accessToken)).toBe(
      requiredEnvironment.X_ACCESS_TOKEN,
    );
    expect(Redacted.value(credentials.accessTokenSecret)).toBe(
      requiredEnvironment.X_ACCESS_TOKEN_SECRET,
    );
    expect(credentials.source.type).toBe("env");
    const serialized = JSON.stringify(credentials);
    for (const value of Object.values(requiredEnvironment))
      expect(serialized).not.toContain(value);
  });

  for (const name of Object.keys(requiredEnvironment)) {
    test(`rejects a missing or empty ${name}`, async () => {
      const environment = Object.fromEntries(
        Object.entries(requiredEnvironment).filter(([key]) => key !== name),
      );
      await expect(readWithEnvironment(environment)).rejects.toThrow(
        `Missing required env: ${name}`,
      );
      environment[name] = "";
      await expect(readWithEnvironment(environment)).rejects.toThrow(
        `Missing required env: ${name}`,
      );
    });
  }

  test("legacy OAuth2 settings do not change OAuth1 resolution", async () => {
    expect(
      await readWithEnvironment({
        ...requiredEnvironment,
        X_BEARER_TOKEN: "unused",
        X_CLIENT_ID: "unused",
        X_OAUTH_SCOPES: "unused",
        X_ACCESS_TOKEN_EXPIRES_AT: "expired",
      }),
    ).toEqual(await readWithEnvironment(requiredEnvironment));
  });
});
