import { describe, expect, test } from "bun:test";
import net from "node:net";
import { startXOAuthLoopback } from "../src/OAuthLoopback.ts";

const isTcpAddress = (
  address: ReturnType<net.Server["address"]>,
): address is Exclude<ReturnType<net.Server["address"]>, string | null> =>
  address !== null && Object(address) === address;

const availablePort = (): Promise<number> =>
  new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!isTcpAddress(address)) {
        server.close();
        reject(new Error("Could not reserve an ephemeral TCP port"));
        return;
      }
      server.close((error) => {
        if (error !== undefined) {
          reject(error);
          return;
        }
        resolve(address.port);
      });
    });
  });

const callbackSettled = async (callback: Promise<URL>): Promise<boolean> =>
  Promise.race([callback.then(() => true), Bun.sleep(20).then(() => false)]);

describe("X OAuth loopback listener", () => {
  test("ignores invalid callbacks, accepts the matching callback, and redirects before closing", async () => {
    const port = await availablePort();
    const origin = `http://127.0.0.1:${port}`;
    const redirectUri = `${origin}/auth/callback`;
    const successUrl = "https://alchemy.run/auth/success";
    const listener = await startXOAuthLoopback({
      redirectUri,
      state: "expected-state",
      successUrl,
      errorUrl: "https://alchemy.run/auth/error",
    });

    try {
      expect((await fetch(`${origin}/wrong-path`)).status).toBe(404);
      expect(
        (
          await fetch(
            `${redirectUri}?state=wrong-state&code=authorization-code`,
          )
        ).status,
      ).toBe(400);
      expect((await fetch(`${redirectUri}?state=expected-state`)).status).toBe(
        400,
      );
      expect(await callbackSettled(listener.callback)).toBe(false);

      const browserResponse = fetch(
        `${redirectUri}?state=expected-state&code=authorization-code`,
        { redirect: "manual" },
      );
      const callback = await listener.callback;
      expect(callback.searchParams.get("state")).toBe("expected-state");
      expect(callback.searchParams.get("code")).toBe("authorization-code");

      await listener.finish(true);
      const response = await browserResponse;
      expect(response.status).toBe(302);
      expect(response.headers.get("location")).toBe(successUrl);

      await expect(fetch(`${origin}/wrong-path`)).rejects.toThrow();
    } finally {
      await listener.finish(false);
    }
  });
});
