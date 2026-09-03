import { describe, expect, test } from "bun:test";
import * as Effect from "effect/Effect";
import * as Fiber from "effect/Fiber";
import * as Layer from "effect/Layer";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import { XOAuthError, XOAuthStateError } from "../src/errors.ts";
import {
  createAuthorizationRequest,
  parseAuthorizationCallback,
  exchangeCode,
  refreshToken,
  revokeToken,
} from "../src/oauth.ts";

const transport = (
  fetcher: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
) =>
  Layer.mergeAll(
    FetchHttpClient.layer,
    Layer.succeed(
      FetchHttpClient.Fetch,
      Object.assign(fetcher, { preconnect: fetch.preconnect }),
    ),
  );
const input = {
  code: "authorization-code",
  codeVerifier: "verifier",
  redirectUri: "https://example.com/callback",
};

describe("Effect-native OAuth 2.0 PKCE", () => {
  test("creates an S256 authorization request lazily with fresh secrets per run", async () => {
    const effect = createAuthorizationRequest(
      { clientId: "client id/+" },
      {
        redirectUri: "https://example.com/oauth/callback?tenant=a+b",
        scopes: ["tweet.read", "users.read", "offline.access"],
      },
    );
    expect(Effect.isEffect(effect)).toBe(true);
    const first = await Effect.runPromise(effect);
    const second = await Effect.runPromise(effect);
    expect(first.state).not.toBe(second.state);
    expect(first.codeVerifier).not.toBe(second.codeVerifier);
    expect(first.state).toHaveLength(43);
    expect(first.codeVerifier).toHaveLength(86);
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(first.codeVerifier),
    );
    const challenge = Buffer.from(digest).toString("base64url");
    expect(first.codeChallenge).toBe(challenge);
    const url = new URL(first.url);
    expect(url.origin + url.pathname).toBe("https://x.com/i/oauth2/authorize");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      response_type: "code",
      client_id: "client id/+",
      redirect_uri: "https://example.com/oauth/callback?tenant=a+b",
      scope: "tweet.read users.read offline.access",
      state: first.state,
      code_challenge: challenge,
      code_challenge_method: "S256",
    });
  });

  for (const confidential of [false, true]) {
    test(`uses correct ${confidential ? "confidential" : "public"} token and revoke forms`, async () => {
      const requests: Request[] = [];
      const config = confidential
        ? { clientId: "client", clientSecret: "secret" }
        : { clientId: "client" };
      const token = {
        access_token: "access",
        token_type: "bearer",
        expires_in: 7200,
        refresh_token: "refresh",
      };
      const layer = transport(async (url, init) => {
        requests.push(new Request(url, init));
        return new URL(url.toString()).pathname.endsWith("/revoke")
          ? new Response(null, { status: 200 })
          : Response.json(token);
      });
      await Effect.runPromise(
        Effect.gen(function* () {
          const pending = exchangeCode(config, input);
          expect(requests).toHaveLength(0);
          expect(yield* pending).toEqual(token);
          expect(
            yield* refreshToken(config, { refreshToken: "refresh" }),
          ).toEqual(token);
          yield* revokeToken(config, { token: "access" });
        }).pipe(Effect.provide(layer)),
      );
      expect(requests.map((r) => r.headers.get("authorization"))).toEqual(
        Array(3).fill(confidential ? "Basic Y2xpZW50OnNlY3JldA==" : null),
      );
      const forms = await Promise.all(
        requests.map(async (r) =>
          Object.fromEntries(new URLSearchParams(await r.text())),
        ),
      );
      const identity = confidential ? {} : { client_id: "client" };
      expect(forms).toEqual([
        {
          grant_type: "authorization_code",
          code: input.code,
          code_verifier: input.codeVerifier,
          redirect_uri: input.redirectUri,
          ...identity,
        },
        { grant_type: "refresh_token", refresh_token: "refresh", ...identity },
        { token: "access", ...identity },
      ]);
      expect(requests.map((r) => new URL(r.url).pathname)).toEqual([
        "/2/oauth2/token",
        "/2/oauth2/token",
        "/2/oauth2/revoke",
      ]);
    });
  }

  test("validates callback state before success or denial through the typed channel", async () => {
    for (const query of ["code=code", "error=access_denied"]) {
      const error = await Effect.runPromise(
        parseAuthorizationCallback(
          `https://example.com/callback?${query}&state=wrong`,
          "expected",
        ).pipe(Effect.flip),
      );
      expect(error).toBeInstanceOf(XOAuthStateError);
    }
    expect(
      await Effect.runPromise(
        parseAuthorizationCallback(
          "https://example.com/callback?code=code&state=expected",
          "expected",
        ),
      ),
    ).toEqual({ code: "code" });
    const denied = await Effect.runPromise(
      parseAuthorizationCallback(
        "https://example.com/callback?error=access_denied&state=expected",
        "expected",
      ).pipe(Effect.flip),
    );
    expect(denied).toBeInstanceOf(XOAuthError);
  });

  test("redacts tokens from malformed and failed OAuth responses", async () => {
    for (const response of [
      () =>
        Response.json({
          access_token: "must-not-leak",
          refresh_token: "also-secret",
          token_type: "bearer",
          error: "invalid_response",
        }),
      () => new Response("access_token=must-not-leak"),
      () =>
        Response.json(
          { access_token: "must-not-leak", error: "invalid_client" },
          { status: 401 },
        ),
    ]) {
      const error = await Effect.runPromise(
        exchangeCode({ clientId: "client" }, input).pipe(
          Effect.flip,
          Effect.provide(transport(async () => response())),
        ),
      );
      expect(error).toBeInstanceOf(XOAuthError);
      expect(JSON.stringify(error)).not.toContain("must-not-leak");
      expect(JSON.stringify(error)).not.toContain("also-secret");
    }
  });

  test("interrupts an in-flight token request", async () => {
    const started = Promise.withResolvers<void>();
    let aborted = false;
    const fiber = Effect.runFork(
      exchangeCode({ clientId: "client" }, input).pipe(
        Effect.provide(
          transport(
            (_url, init) =>
              new Promise((_resolve, reject) => {
                init?.signal?.addEventListener("abort", () => {
                  aborted = true;
                  reject(init.signal?.reason);
                });
                started.resolve();
              }),
          ),
        ),
      ),
    );
    await started.promise;
    await Effect.runPromise(Fiber.interrupt(fiber));
    expect(aborted).toBe(true);
  });
});
