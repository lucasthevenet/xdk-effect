import http from "node:http";

export interface XOAuthLoopbackListener {
  /** Resolves only after a syntactically valid callback with matching state. */
  readonly callback: Promise<URL>;
  /** Redirect any pending browser response and close the listener. Idempotent. */
  readonly finish: (success: boolean) => Promise<void>;
}

export interface XOAuthLoopbackOptions {
  readonly redirectUri: string;
  readonly state: string;
  readonly successUrl: string;
  readonly errorUrl: string;
}

const close = (server: http.Server): Promise<void> =>
  new Promise((resolve) => {
    if (!server.listening) {
      resolve();
      return;
    }
    server.close(() => resolve());
  });

/**
 * Bind the OAuth loopback listener before opening the browser. The listener
 * only acquires a callback; the caller performs the one-time code exchange.
 */
export const startXOAuthLoopback = async (
  options: XOAuthLoopbackOptions,
): Promise<XOAuthLoopbackListener> => {
  const redirect = new URL(options.redirectUri);
  const port = Number(redirect.port);
  let callbackResolve!: (url: URL) => void;
  let callbackReject!: (cause: unknown) => void;
  let pendingResponse: http.ServerResponse | undefined;
  let finished = false;
  let callbackAccepted = false;
  const callback = new Promise<URL>((resolve, reject) => {
    callbackResolve = resolve;
    callbackReject = reject;
  });
  // A bind failure rejects both startup and this promise. Mark the callback
  // promise handled until the caller receives a successfully-started listener.
  void callback.catch(() => undefined);

  const server = http.createServer((request, response) => {
    const url = new URL(request.url ?? "/", redirect.origin);
    if (request.method !== "GET" || url.pathname !== redirect.pathname) {
      response.statusCode = 404;
      response.end("Not Found");
      return;
    }
    if (finished || callbackAccepted) {
      response.statusCode = 409;
      response.end("OAuth callback already received");
      return;
    }

    const state = url.searchParams.get("state");
    const hasResult =
      url.searchParams.has("code") || url.searchParams.has("error");
    if (state !== options.state || !hasResult) {
      response.statusCode = 400;
      response.end("Invalid OAuth callback");
      return;
    }

    callbackAccepted = true;
    pendingResponse = response;
    callbackResolve(url);
  });

  await new Promise<void>((resolve, reject) => {
    const onError = (cause: unknown) => {
      callbackReject(cause);
      reject(cause);
    };
    server.once("error", onError);
    server.listen(port, "127.0.0.1", () => {
      server.off("error", onError);
      resolve();
    });
  });

  const finish = async (success: boolean): Promise<void> => {
    if (finished) return;
    finished = true;
    if (pendingResponse !== undefined && !pendingResponse.headersSent) {
      pendingResponse.writeHead(302, {
        Location: success ? options.successUrl : options.errorUrl,
      });
      pendingResponse.end();
    }
    await close(server);
  };

  return { callback, finish };
};
