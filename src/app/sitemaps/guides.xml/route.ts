import { sitemapResponse } from "@/lib/seo-sitemaps";

export const dynamic = "force-static";

export function GET() {
  return sitemapResponse("guides");
}
