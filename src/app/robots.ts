import type { MetadataRoute } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // Public, documented API surfaces are open to agents and crawlers; the
      // admin console and internal endpoints stay blocked.
      allow: ["/", "/api/v1/", "/api/openapi.json", "/api/mcp"],
      disallow: [
        "/admin",
        "/api/admin",
        "/api/analyze-listing",
        "/api/extract-listing-url",
        "/api/extract-screenshot-text",
        "/api/decode-vin",
        "/api/share-report",
        "/api/track",
        "/api/og",
      ],
    },
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
