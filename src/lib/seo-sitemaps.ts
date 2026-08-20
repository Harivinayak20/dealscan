import type { MetadataRoute } from "next";
import { bestLists } from "./best-lists.ts";
import { carModels } from "./car-models.ts";
import { comparisons } from "./comparisons.ts";
import { dealerFees } from "./dealer-fees.ts";
import { guides } from "./guides.ts";
import { otdStatePages } from "./otd-states.ts";
import { stateFees } from "./state-fees.ts";
import { yearsToAvoid } from "./years-to-avoid.ts";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

// lastmod has to track real content changes. A request-time timestamp tells
// Google every page changed on every crawl, which trains it to ignore the
// field and wastes crawl budget re-fetching pages that did not change.
const CONTENT_UPDATED = new Date("2026-07-25");
const SEO_PHASE_TWO_UPDATED = new Date("2026-08-14");

const phaseTwoCoreRoutes = new Set([
  "/price-checker",
  "/vin",
  "/research",
  "/about",
  "/terms",
]);

const latestDate = (contentDate: string | Date, templateDate: Date) => {
  const content = new Date(contentDate);
  return content > templateDate ? content : templateDate;
};

export const sitemapPageSetNames = [
  "core",
  "cars",
  "guides",
  "local",
  "comparisons",
] as const;

export type SitemapPageSetName = (typeof sitemapPageSetNames)[number];
export type SitemapEntry = MetadataRoute.Sitemap[number];
export type SitemapPageSets = Record<SitemapPageSetName, MetadataRoute.Sitemap>;

const entry = (
  path: string,
  lastModified: Date,
  priority: number,
  changeFrequency: SitemapEntry["changeFrequency"] = "monthly",
): SitemapEntry => ({
  url: `${appUrl}${path}`,
  lastModified,
  changeFrequency,
  priority,
});

export function buildSitemapPageSets(): SitemapPageSets {
  const coreRoutes = [
    "",
    "/price-checker",
    "/depreciation",
    "/vin",
    "/changelog",
    "/research",
    "/widget",
    "/affiliate-links",
    "/how-scoring-works",
    "/privacy",
    "/about",
    "/contact",
    "/terms",
    "/cookies",
    "/disclaimer",
    "/deal-checker",
    "/good-deal",
    "/scam-checker",
    "/inspection-checklist",
  ] as const;

  return {
    core: coreRoutes.map((route) =>
      entry(
        route,
        phaseTwoCoreRoutes.has(route) ? SEO_PHASE_TWO_UPDATED : CONTENT_UPDATED,
        route === "" ? 1 : 0.7,
        route === "" ? "weekly" : "monthly",
      ),
    ),
    cars: [
      entry("/cars", CONTENT_UPDATED, 0.8),
      ...carModels.map((car) =>
        entry(`/cars/${car.slug}`, latestDate(car.updatedAt, SEO_PHASE_TWO_UPDATED), 0.8),
      ),
      ...yearsToAvoid.map((car) =>
        entry(
          `/cars/${car.slug}/years-to-avoid`,
          latestDate(car.updatedAt, SEO_PHASE_TWO_UPDATED),
          0.8,
        ),
      ),
      // One value page per model replaces hundreds of near-duplicate year URLs.
      ...carModels.map((car) => entry(`/cars/${car.slug}/value`, new Date(car.updatedAt), 0.9)),
      ...carModels.map((car) =>
        entry(`/cars/${car.slug}/mileage`, latestDate(car.updatedAt, SEO_PHASE_TWO_UPDATED), 0.7),
      ),
    ],
    guides: [
      entry("/guides", SEO_PHASE_TWO_UPDATED, 0.8),
      entry("/best", SEO_PHASE_TWO_UPDATED, 0.8),
      ...guides.map((guide) =>
        entry(`/guides/${guide.slug}`, latestDate(guide.updatedAt, SEO_PHASE_TWO_UPDATED), 0.8),
      ),
      ...bestLists.map((list) =>
        entry(`/best/${list.slug}`, latestDate(list.updatedAt, SEO_PHASE_TWO_UPDATED), 0.8),
      ),
    ],
    local: [
      entry("/fees", SEO_PHASE_TWO_UPDATED, 0.8),
      entry("/fees/states", SEO_PHASE_TWO_UPDATED, 0.8),
      entry("/otd-calculator", SEO_PHASE_TWO_UPDATED, 0.8),
      entry("/research/dealer-fees-by-state", SEO_PHASE_TWO_UPDATED, 0.8),
      ...dealerFees.map((fee) =>
        entry(`/fees/${fee.slug}`, latestDate(fee.updatedAt, SEO_PHASE_TWO_UPDATED), 0.8),
      ),
      ...stateFees.map((state) =>
        entry(`/fees/states/${state.slug}`, latestDate(state.updatedAt, SEO_PHASE_TWO_UPDATED), 0.8),
      ),
      ...otdStatePages.map((state) => entry(`/otd-calculator/${state.slug}`, CONTENT_UPDATED, 0.7)),
    ],
    comparisons: [
      entry("/compare", CONTENT_UPDATED, 0.7),
      // This page set currently has visibility but almost no clicks, so it stays
      // isolated for Search Console measurement and carries the lowest priority.
      ...comparisons.map((comparison) =>
        entry(
          `/compare/${comparison.slug}`,
          latestDate(comparison.updatedAt, SEO_PHASE_TWO_UPDATED),
          0.5,
        ),
      ),
    ],
  };
}

export function buildSitemap(): MetadataRoute.Sitemap {
  const pageSets = buildSitemapPageSets();
  return sitemapPageSetNames.flatMap((name) => pageSets[name]);
}

const escapeXml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export function renderSitemapXml(entries: MetadataRoute.Sitemap): string {
  const urls = entries
    .map((item) => {
      const lastModified =
        item.lastModified instanceof Date ? item.lastModified.toISOString() : item.lastModified;
      return [
        "  <url>",
        `    <loc>${escapeXml(item.url)}</loc>`,
        lastModified ? `    <lastmod>${escapeXml(lastModified)}</lastmod>` : "",
        item.changeFrequency ? `    <changefreq>${item.changeFrequency}</changefreq>` : "",
        item.priority !== undefined ? `    <priority>${item.priority}</priority>` : "",
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function sitemapResponse(pageSet: SitemapPageSetName): Response {
  const entries = buildSitemapPageSets()[pageSet];
  return new Response(renderSitemapXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
