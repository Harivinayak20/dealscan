/**
 * API Catalog (RFC 9727), served as a linkset (RFC 9264).
 *
 * Points agents at the machine-readable description of the public API so they
 * can discover it without reading /llms.txt first.
 */
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export function GET() {
  const catalog = {
    linkset: [
      {
        anchor: `${appUrl}/api/v1/`,
        "service-desc": [
          {
            href: `${appUrl}/api/openapi.json`,
            type: "application/json",
            title: "DealScan API (OpenAPI 3.1)",
          },
        ],
        "service-doc": [
          {
            href: `${appUrl}/llms.txt`,
            type: "text/plain",
            title: "DealScan API documentation for agents",
          },
        ],
      },
    ],
  };

  return new Response(JSON.stringify(catalog, null, 2), {
    headers: {
      "Content-Type": "application/linkset+json",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
