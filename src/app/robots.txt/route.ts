/**
 * robots.txt
 *
 * Hand-rolled instead of Next's MetadataRoute.Robots because that helper has no
 * way to emit `Content-Signal` directives (https://contentsignals.org/), which
 * declare how AI systems may use this content.
 *
 * Kept as a single `User-agent: *` group on purpose: an explicit group for a
 * named crawler replaces the wildcard group entirely for that crawler, which
 * would silently drop every Disallow below.
 */
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";
const sitemapPaths = [
  "/sitemap.xml",
  "/sitemaps/core.xml",
  "/sitemaps/cars.xml",
  "/sitemaps/guides.xml",
  "/sitemaps/local.xml",
  "/sitemaps/comparisons.xml",
] as const;

export function GET() {
  const body = `User-Agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /
Allow: /api/v1/
Allow: /api/openapi.json
Allow: /api/mcp
Disallow: /admin
Disallow: /api/admin
Disallow: /api/analyze-listing
Disallow: /api/extract-listing-url
Disallow: /api/extract-screenshot-text
Disallow: /api/decode-vin
Disallow: /api/share-report
Disallow: /api/track
Disallow: /api/og

${sitemapPaths.map((path) => `Sitemap: ${appUrl}${path}`).join("\n")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
