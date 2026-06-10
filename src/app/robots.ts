import type { MetadataRoute } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.hari-vinayak-d.workers.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/deployment-dashboard"],
    },
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
