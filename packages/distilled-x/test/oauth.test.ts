import { describe, expect, test } from "bun:test";
import {
  XOAuthError,
  XOAuthStateError,
  createOAuth2Client,
} from "../src/index.ts";

const zeroCrypto: Pick<Crypto, "getRandomValues" | "subtle"> = {
  subtle: globalThis.crypto.subtle,
  getRandomValues<T extends ArrayBufferView>(array: T): T {
    new Uint8Array(array.buffer, array.byteOffset, array.byteLength).fill(0);
    return array;
  },
};

describe("OAuth 2.0 PKCE", () => {
  test("creates an S256 authorization request with encoded X parameters", async () => {
    const oauth = createOAuth2Client({
      clientId: "client id/+",
      runtime: { crypto: zeroCrypto },
    });

    const request = await oauth.createAuthorizationRequest({
      redirectUri: "https://example.com/oauth/callback?tenant=a+b",
      scopes: ["tweet.read", "users.read", "offline.access"],
    });
    const url = new URL(request.url);

    expect(request.state).toBe("A".repeat(43));
    expect(request.codeVerifier).toBe("A".repeat(86));
    expect(request.codeChallenge).toBe(
      "4WWa1UBjo3n3f-4Qijdqan1a49DEN7-EcgOWO9AHjfw",
    );
    expect(url.origin + url.pathname).toBe("https://x.com/i/oauth2/authorize");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      response_type: "code",
      client_id: "client id/+",
      redirect_uri: "https://example.com/oauth/callback?tenant=a+b",
      scope: "tweet.read users.read offline.access",
      state: "A".repeat(43),
      code_challenge: request.codeChallenge,
      code_challenge_method: "S256",
    });
  });

  test("uses HTTP Basic for confidential code exchange and refresh", async () => {
    const requests: Request[] = [];
    const responses = [
      {
        access_token: "access-1",
        token_type: "bearer",
        expires_in: 7200,
        scope: "users.read offline.access",
        refresh_token: "refresh-1",
      },
      {
        access_token: "access-2",
        token_type: "bearer",
        expires_in: 7200,
        refresh_token: "refresh-2",
      },
    ];
    const oauth = createOAuth2Client({
      clientId: "client",
      clientSecret: "secret",
      runtime: {
        fetch: async (input, init) => {
          requests.push(new Request(input, init));
          return Response.json(responses[requests.length - 1]);
        },
      },
    });

    const exchanged = await oauth.exchangeCode({
      code: "authorization-code",
      codeVerifier: "verifier",
      redirectUri: "https://example.com/callback",
    });
    const refreshed = await oauth.refreshToken({ refreshToken: "refresh-1" });

    expect(exchanged).toEqual(responses[0]);
    expect(refreshed).toEqual(responses[1]);
    expect(requests.map((request) => request.url)).toEqual([
      "https://api.x.com/2/oauth2/token",
      "https://api.x.com/2/oauth2/token",
    ]);
    expect(
      requests.map((request) => request.headers.get("authorization")),
    ).toEqual(["Basic Y2xpZW50OnNlY3JldA==", "Basic Y2xpZW50OnNlY3JldA=="]);
    expect(await requests[0]!.text()).toBe(
      "grant_type=authorization_code&code=authorization-code&code_verifier=verifier&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback",
    );
    expect(await requests[1]!.text()).toBe(
      "grant_type=refresh_token&refresh_token=refresh-1",
    );
  });

  test("sends client_id in public-client token requests", async () => {
    const requests: Request[] = [];
    const oauth = createOAuth2Client({
      clientId: "public-client",
      runtime: {
        fetch: async (input, init) => {
          requests.push(new Request(input, init));
          return Response.json({
            access_token: `access-${requests.length}`,
            token_type: "bearer",
            expires_in: 7200,
          });
        },
      },
    });

    await oauth.exchangeCode({
      code: "code",
      codeVerifier: "verifier",
      redirectUri: "https://example.com/callback",
    });
    await oauth.refreshToken({ refreshToken: "refresh" });

    expect(requests[0]!.headers.has("authorization")).toBeFalse();
    expect(await requests[0]!.text()).toBe(
      "grant_type=authorization_code&code=code&code_verifier=verifier&client_id=public-client&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback",
    );
    expect(await requests[1]!.text()).toBe(
      "grant_type=refresh_token&refresh_token=refresh&client_id=public-client",
    );
  });

  test("validates callback state before accepting either success or denial", () => {
    const oauth = createOAuth2Client({ clientId: "client" });

    expect(() =>
      oauth.parseAuthorizationCallback(
        "https://example.com/callback?code=code&state=wrong",
        "expected",
      ),
    ).toThrow(XOAuthStateError);
    expect(() =>
      oauth.parseAuthorizationCallback(
        "https://example.com/callback?error=access_denied&state=wrong",
        "expected",
      ),
    ).toThrow(XOAuthStateError);
    expect(
      oauth.parseAuthorizationCallback(
        "https://example.com/callback?code=code&state=expected",
        "expected",
      ),
    ).toEqual({ code: "code" });
    expect(() =>
      oauth.parseAuthorizationCallback(
        "https://example.com/callback?error=access_denied&error_description=No&state=expected",
        "expected",
      ),
    ).toThrow(XOAuthError);
  });

  test("redacts token fields from malformed OAuth responses", async () => {
    const client = createOAuth2Client({
      clientId: "client-id",
      runtime: {
        fetch: async () =>
          Response.json({
            access_token: "must-not-leak",
            refresh_token: "also-secret",
            token_type: "bearer",
            error: "invalid_response",
            error_description: "Missing token lifetime",
          }),
      },
    });

    const error = await client
      .exchangeCode({
        code: "code",
        codeVerifier: "verifier",
        redirectUri: "http://127.0.0.1:9976/auth/callback",
      })
      .catch((cause) => cause);

    expect(error).toBeInstanceOf(XOAuthError);
    expect(JSON.stringify(error)).not.toContain("must-not-leak");
    expect(JSON.stringify(error)).not.toContain("also-secret");
    expect(error.body).toEqual({
      error: "invalid_response",
      error_description: "Missing token lifetime",
    });

    const malformed = createOAuth2Client({
      clientId: "client-id",
      runtime: {
        fetch: async () =>
          new Response("access_token=must-not-leak", {
            headers: { "content-type": "text/plain" },
          }),
      },
    });
    const malformedError = await malformed
      .refreshToken({ refreshToken: "refresh-token" })
      .catch((cause) => cause);
    expect(JSON.stringify(malformedError)).not.toContain("must-not-leak");
    expect(malformedError.body).toBeUndefined();
  });

  test("uses the documented public and confidential revoke forms", async () => {
    const requests: Request[] = [];
    const runtime = {
      fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
        requests.push(new Request(input, init));
        return new Response(null, { status: 200 });
      },
    };
    await createOAuth2Client({ clientId: "public-id", runtime }).revokeToken({
      token: "public-token",
    });
    await createOAuth2Client({
      clientId: "confidential-id",
      clientSecret: "client-secret",
      runtime,
    }).revokeToken({ token: "confidential-token" });

    expect(await requests[0]?.text()).toBe(
      "token=public-token&client_id=public-id",
    );
    expect(requests[0]?.headers.get("authorization")).toBeNull();
    expect(await requests[1]?.text()).toBe("token=confidential-token");
    expect(requests[1]?.headers.get("authorization")).toStartWith("Basic ");
  });
});
