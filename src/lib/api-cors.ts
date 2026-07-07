/**
 * CORS + JSON helpers for the public API surfaces (`/api/v1/*`, `/api/mcp`,
 * `/api/openapi.json`). These endpoints are meant to be called cross-origin by
 * AI agents, browser widgets, and third-party tools, so they allow any origin.
 */

export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version",
  "Access-Control-Expose-Headers": "Retry-After, X-RateLimit-Limit, Mcp-Session-Id",
  "Access-Control-Max-Age": "86400",
};

export function corsPreflight(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function jsonResponse(body: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  });
}

export function jsonError(status: number, message: string, extraHeaders: Record<string, string> = {}): Response {
  return jsonResponse({ error: { status, message } }, status, extraHeaders);
}
