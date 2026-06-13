import type { MetadataRoute } from "next";
import { carModels } from "@/lib/car-models";
import { guides } from "@/lib/guides";
import { yearsToAvoid } from "@/lib/years-to-avoid";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/guides", "/cars", "/affiliate-links", "/how-scoring-works", "/privacy", "/about", "/contact", "/terms", "/cookies", "/disclaimer"] as const;

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
    ...carModels.map((car) => ({
      url: `${appUrl}/cars/${car.slug}`,
      lastModified: new Date(car.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...yearsToAvoid.map((entry) => ({
      url: `${appUrl}/cars/${entry.slug}/years-to-avoid`,
      lastModified: new Date(entry.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
