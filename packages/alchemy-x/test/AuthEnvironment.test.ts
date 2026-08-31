import { describe, expect, test } from "bun:test";
import * as ConfigProvider from "effect/ConfigProvider";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import {
  parseXOAuthScopes,
  readEnvCredentials,
  X_TOKEN_REFRESH_WINDOW_MS,
} from "../src/AuthEnvironment.ts";

const requiredEnvironment = {
  X_BEARER_TOKEN: "app-bearer-token",
  X_API_SECRET: "consumer-secret",
  X_ACCESS_TOKEN: "user-access-token",
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
  test("normalizes and deduplicates OAuth scopes", () => {
    expect(
      parseXOAuthScopes("tweet.read, users.read  tweet.read\n offline.access"),
    ).toEqual(["tweet.read", "users.read", "offline.access"]);
    expect(parseXOAuthScopes(" , \n ")).toEqual([]);
  });

  test("resolves required secrets and normalized optional settings", async () => {
    const credentials = await readWithEnvironment({
      ...requiredEnvironment,
      X_CLIENT_ID: "  client-id  ",
      X_OAUTH_SCOPES: "tweet.read, users.read tweet.read",
      X_ACCESS_TOKEN_EXPIRES_AT: "2000000000",
    });

    expect(Redacted.value(credentials.appBearerToken)).toBe(
      requiredEnvironment.X_BEARER_TOKEN,
    );
    expect(Redacted.value(credentials.consumerSecret)).toBe(
      requiredEnvironment.X_API_SECRET,
    );
    expect(Redacted.value(credentials.userAccessToken)).toBe(
      requiredEnvironment.X_ACCESS_TOKEN,
    );
    expect(credentials.clientId).toBe("client-id");
    expect(credentials.oauthScopes).toEqual(["tweet.read", "users.read"]);
    expect(credentials.accessTokenExpiresAt).toBe(2_000_000_000_000);
    expect(credentials.source).toEqual({
      type: "env",
      details: "X_BEARER_TOKEN/X_API_SECRET/X_ACCESS_TOKEN",
    });
  });

  test("accepts Unix milliseconds and ISO expiration dates", async () => {
    const milliseconds = Date.now() + 10 * X_TOKEN_REFRESH_WINDOW_MS;
    expect(
      (
        await readWithEnvironment({
          ...requiredEnvironment,
          X_ACCESS_TOKEN_EXPIRES_AT: String(milliseconds),
        })
      ).accessTokenExpiresAt,
    ).toBe(milliseconds);

    const iso = new Date(
      Date.now() + 20 * X_TOKEN_REFRESH_WINDOW_MS,
    ).toISOString();
    expect(
      (
        await readWithEnvironment({
          ...requiredEnvironment,
          X_ACCESS_TOKEN_EXPIRES_AT: iso,
        })
      ).accessTokenExpiresAt,
    ).toBe(Date.parse(iso));
  });

  test("rejects missing required credentials", async () => {
    await expect(
      readWithEnvironment({
        X_BEARER_TOKEN: requiredEnvironment.X_BEARER_TOKEN,
        X_API_SECRET: requiredEnvironment.X_API_SECRET,
      }),
    ).rejects.toThrow("Missing required env: X_ACCESS_TOKEN");
  });

  test("rejects malformed expiration values", async () => {
    await expect(
      readWithEnvironment({
        ...requiredEnvironment,
        X_ACCESS_TOKEN_EXPIRES_AT: "not-an-expiration",
      }),
    ).rejects.toThrow(
      "X_ACCESS_TOKEN_EXPIRES_AT must be an ISO date, Unix seconds, or Unix milliseconds",
    );
  });

  test("rejects expired and near-expiry environment tokens", async () => {
    await expect(
      readWithEnvironment({
        ...requiredEnvironment,
        X_ACCESS_TOKEN_EXPIRES_AT: String(
          Date.now() + X_TOKEN_REFRESH_WINDOW_MS / 2,
        ),
      }),
    ).rejects.toThrow("expired or expires within 60 seconds");
  });
});
