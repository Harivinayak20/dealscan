import type { MetadataRoute } from "next";
import { buildSitemap } from "@/lib/seo-sitemaps";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap();
}
