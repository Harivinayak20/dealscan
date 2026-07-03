import type { MetadataRoute } from "next";
import { carModels } from "@/lib/car-models";
import { guides } from "@/lib/guides";
import { dealerFees } from "@/lib/dealer-fees";
import { yearsToAvoid } from "@/lib/years-to-avoid";
import { allValueYears } from "@/lib/pricing";
import { comparisons } from "@/lib/comparisons";
import { stateFees } from "@/lib/state-fees";
import { bestLists } from "@/lib/best-lists";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/guides", "/cars", "/compare", "/best", "/fees", "/fees/states", "/price-checker", "/widget", "/affiliate-links", "/how-scoring-works", "/privacy", "/about", "/contact", "/terms", "/cookies", "/disclaimer"] as const;

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
    ...dealerFees.map((fee) => ({
      url: `${appUrl}/fees/${fee.slug}`,
      lastModified: new Date(fee.updatedAt),
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
    ...allValueYears().map(({ slug, year }) => ({
      url: `${appUrl}/cars/${slug}/${year}-value`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...stateFees.map((entry) => ({
      url: `${appUrl}/fees/states/${entry.slug}`,
      lastModified: new Date(entry.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...bestLists.map((list) => ({
      url: `${appUrl}/best/${list.slug}`,
      lastModified: new Date(list.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...comparisons.map((c) => ({
      url: `${appUrl}/compare/${c.slug}`,
      lastModified: new Date(c.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
