import type { MetadataRoute } from "next";
import { guides } from "@/lib/guides";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.hari-vinayak-d.workers.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/guides", "/affiliate-links", "/pricing", "/how-scoring-works", "/privacy", "/about", "/contact", "/terms", "/cookies"] as const;

  return [
    ...staticRoutes.map((route) => ({
      url: `${appUrl}${route}`,
      lastModified: now,
      changeFrequency: route === "" ? "weekly" as const : "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...guides.map((guide) => ({
      url: `${appUrl}/guides/${guide.slug}`,
      lastModified: new Date(guide.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
