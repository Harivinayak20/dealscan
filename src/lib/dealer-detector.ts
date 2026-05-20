export type SourceInfo = {
  name: string;
  domain: string;
  type: "marketplace" | "dealer" | "classified" | "unknown";
  badge: string;
  icon: string;
};

const SOURCES: SourceInfo[] = [
  { name: "CarGurus", domain: "cargurus.com", type: "marketplace", badge: "CG", icon: "🏪" },
  { name: "Cars.com", domain: "cars.com", type: "marketplace", badge: "CARS", icon: "🏪" },
  { name: "AutoTrader", domain: "autotrader.com", type: "marketplace", badge: "AT", icon: "🏪" },
  { name: "Facebook Marketplace", domain: "facebook.com/marketplace", type: "classified", badge: "FB", icon: "👤" },
  { name: "Facebook Marketplace", domain: "fb.com/marketplace", type: "classified", badge: "FB", icon: "👤" },
  { name: "Craigslist", domain: "craigslist.org", type: "classified", badge: "CL", icon: "👤" },
  { name: "OfferUp", domain: "offerup.com", type: "classified", badge: "OU", icon: "👤" },
  { name: "eBay Motors", domain: "ebay.com", type: "marketplace", badge: "eBay", icon: "🏪" },
  { name: "CarMax", domain: "carmax.com", type: "dealer", badge: "CM", icon: "🏢" },
  { name: "Carvana", domain: "carvana.com", type: "dealer", badge: "CV", icon: "🏢" },
  { name: "Vroom", domain: "vroom.com", type: "dealer", badge: "VR", icon: "🏢" },
  { name: "Shift", domain: "shift.com", type: "dealer", badge: "SH", icon: "🏢" },
  { name: "TrueCar", domain: "truecar.com", type: "marketplace", badge: "TC", icon: "🏪" },
];

export function detectSource(url: string | undefined | null): SourceInfo {
  if (!url) return { name: "Unknown", domain: "", type: "unknown", badge: "?", icon: "📄" };
  const lower = url.toLowerCase();
  for (const source of SOURCES) {
    if (lower.includes(source.domain)) return source;
  }
  for (const source of SOURCES) {
    if (lower.includes(source.domain.split("/")[0])) return source;
  }
  const match = url.match(/https?:\/\/(?:www\.)?([^\/]+)/);
  const domain = match?.[1] ?? "";
  return { name: domain || "Direct Link", domain, type: "unknown", badge: "WEB", icon: "🔗" };
}

export function isDealerListing(url: string | undefined | null): boolean {
  const source = detectSource(url);
  return source.type === "dealer" || source.type === "marketplace";
}
