import type { MetadataRoute } from "next";
import { carModels } from "@/lib/car-models";
import { guides } from "@/lib/guides";
import { dealerFees } from "@/lib/dealer-fees";
import { yearsToAvoid } from "@/lib/years-to-avoid";
import { allValueYears } from "@/lib/pricing";
import { comparisons } from "@/lib/comparisons";
import { stateFees } from "@/lib/state-fees";
import { bestLists } from "@/lib/best-lists";
import { otdStatePages } from "@/lib/otd-states";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

// lastmod has to track real content changes. A request-time timestamp tells
// Google every page changed on every crawl, which trains it to ignore the
// field and wastes crawl budget re-fetching pages that did not change.
// Bump this when the hand-written pages below actually change.
const CONTENT_UPDATED = new Date("2026-07-25");

export default function sitemap(): MetadataRoute.Sitemap {
  const carUpdatedAt = new Map(carModels.map((car) => [car.slug, car.updatedAt]));
  const staticRoutes = ["", "/guides", "/cars", "/compare", "/best", "/fees", "/fees/states", "/price-checker", "/otd-calculator", "/depreciation", "/vin", "/changelog", "/research", "/research/dealer-fees-by-state", "/widget", "/affiliate-links", "/how-scoring-works", "/privacy", "/about", "/contact", "/terms", "/cookies", "/disclaimer", "/deal-checker", "/good-deal", "/scam-checker", "/inspection-checklist"] as const;

  return [
    ...staticRoutes.map((route) => ({
      url: `${appUrl}${route}`,
      lastModified: CONTENT_UPDATED,
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
    // Value pages are the strongest performers in Search Console, so they carry
    // the highest priority of the generated sets.
    ...allValueYears().map(({ slug, year }) => ({
      url: `${appUrl}/cars/${slug}/${year}-value`,
      lastModified: new Date(carUpdatedAt.get(slug) ?? CONTENT_UPDATED),
      changeFrequency: "monthly" as const,
      priority: 0.9,
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
    // Compare pages rank around position 70 and have never earned a click, so they
    // sit below everything else until that changes.
    ...comparisons.map((c) => ({
      url: `${appUrl}/compare/${c.slug}`,
      lastModified: new Date(c.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...otdStatePages.map((s) => ({
      url: `${appUrl}/otd-calculator/${s.slug}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...carModels.map((car) => ({
      url: `${appUrl}/cars/${car.slug}/mileage`,
      lastModified: new Date(car.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
