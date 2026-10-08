export interface PublicConfig {
  readonly apiBaseUrl: string;
  readonly webSocketUrl: string;
}

function safeUrl(value: unknown, protocols: readonly string[], field: string): URL {
  if (typeof value !== "string" || value.length > 2_048) {
    throw new Error(`${field} must be a public URL.`);
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${field} must be a public URL.`);
  }
  if (!protocols.includes(url.protocol) || url.username || url.password || url.hash || url.search) {
    throw new Error(
      `${field} must use an approved protocol without credentials, query, or fragment.`,
    );
  }
  return url;
}

export function parsePublicConfig(environment: Readonly<Record<string, unknown>>): PublicConfig {
  const api = safeUrl(environment.VITE_API_BASE_URL, ["http:", "https:"], "API base URL");
  const socket = safeUrl(environment.VITE_WS_URL, ["ws:", "wss:"], "WebSocket URL");
  if (environment.PROD === true && (api.protocol !== "https:" || socket.protocol !== "wss:")) {
    throw new Error("Production connections require HTTPS and WSS.");
  }
  return Object.freeze({ apiBaseUrl: api.href.replace(/\/$/u, ""), webSocketUrl: socket.href });
}
