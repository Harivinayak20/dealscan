export type PlatformLink = {
  label: string;
  url: string;
  type: "marketplace" | "reference";
};

export type LinkCategory = "marketplace" | "reference";

function extractVehicleInfo(sourceText: string): { make?: string; model?: string; year?: string; vin?: string } {
  const vinMatch = sourceText.match(/\b([A-HJ-NPR-Z0-9]{17})\b/);
  const vin = vinMatch?.[1];

  const yearMatch = sourceText.match(/\b((19|20)\d{2})\s+([A-Za-z][A-Za-z-]+)\s+([A-Za-z0-9-]+)/);
  if (yearMatch) {
    return {
      year: yearMatch[1],
      make: yearMatch[3],
      model: yearMatch[4],
      vin,
    };
  }

  const makeModelMatch = sourceText.match(/\b([A-Za-z][A-Za-z-]+)\s+([A-Za-z0-9-]+)/);
  if (makeModelMatch) {
    return {
      make: makeModelMatch[1],
      model: makeModelMatch[2],
      vin,
    };
  }

  return { vin };
}

function encode(s: string): string {
  return encodeURIComponent(s.trim());
}

export function generateMarketplaceLinks(sourceText: string): PlatformLink[] {
  const info = extractVehicleInfo(sourceText);
  const { make, model, year, vin } = info;
  const links: PlatformLink[] = [];

  const searchQuery = [year, make, model].filter(Boolean).join(" ");
  const searchEncoded = encode(searchQuery);

  if (make && model) {
    links.push({
      label: "Cars.com",
      url: searchQuery
        ? `https://www.cars.com/shopping/results/?stock_type=all&makes[]=${encode(make.toLowerCase())}&models[]=${encode(make.toLowerCase())}-${encode(model.toLowerCase())}&list_price_max=&year_min=&year_max=`
        : "https://www.cars.com/",
      type: "marketplace",
    });

    links.push({
      label: "Autotrader",
      url: searchQuery
        ? `https://www.autotrader.com/cars-for-sale/${searchEncoded}?searchRadius=100`
        : "https://www.autotrader.com/",
      type: "marketplace",
    });

    links.push({
      label: "CarGurus",
      url: searchQuery
        ? `https://www.cargurus.com/Cars/l-Used-${encode(make.toLowerCase())}-${encode(model.toLowerCase())}-${year ? `d${year}` : "c"}`
        : "https://www.cargurus.com/",
      type: "marketplace",
    });

    links.push({
      label: "Craigslist",
      url: searchQuery
        ? `https://craigslist.org/search/cta?query=${searchEncoded}`
        : "https://craigslist.org/",
      type: "marketplace",
    });

    links.push({
      label: "Facebook Marketplace",
      url: searchQuery
        ? `https://www.facebook.com/marketplace/search/?query=${searchEncoded}`
        : "https://www.facebook.com/marketplace/",
      type: "marketplace",
    });
  }

  if (make && model) {
    links.push({
      label: "KBB Value",
      url: year
        ? `https://www.kbb.com/${encode(make.toLowerCase())}/${encode(model.toLowerCase())}/${year}/`
        : `https://www.kbb.com/${encode(make.toLowerCase())}/${encode(model.toLowerCase())}/`,
      type: "reference",
    });
  }

  if (vin) {
    links.push({
      label: "Carfax VIN Report",
      url: `https://www.carfax.com/vehicle-history-reports/?vin=${encode(vin)}`,
      type: "reference",
    });
    links.push({
      label: "NHTSA Recalls",
      url: `https://www.nhtsa.gov/recalls?vin=${encode(vin)}`,
      type: "reference",
    });
  } else {
    links.push({
      label: "Carfax",
      url: "https://www.carfax.com/vehicle-history-reports/",
      type: "reference",
    });
    links.push({
      label: "NHTSA Recalls",
      url: "https://www.nhtsa.gov/recalls",
      type: "reference",
    });
  }

  links.push({
    label: "NICB VINCheck",
    url: "https://www.nicb.org/vincheck",
    type: "reference",
  });

  return links;
}

export function categorizeLinks(links: PlatformLink[]): { marketplace: PlatformLink[]; reference: PlatformLink[] } {
  return {
    marketplace: links.filter((l) => l.type === "marketplace"),
    reference: links.filter((l) => l.type === "reference"),
  };
}

export function generateCompareMarketplaceLinks(make: string, model: string, year?: string): PlatformLink[] {
  const searchQuery = [year, make, model].filter(Boolean).join(" ");
  const encoded = encode(searchQuery);

  return [
    { label: "Cars.com", url: `https://www.cars.com/shopping/results/?stock_type=all&makes[]=${encode(make.toLowerCase())}&models[]=${encode(make.toLowerCase())}-${encode(model.toLowerCase())}`, type: "marketplace" as const },
    { label: "Autotrader", url: `https://www.autotrader.com/cars-for-sale/${encoded}?searchRadius=100`, type: "marketplace" as const },
    { label: "CarGurus", url: `https://www.cargurus.com/Cars/l-Used-${encode(make.toLowerCase())}-${encode(model.toLowerCase())}-${year ? `d${year}` : "c"}`, type: "marketplace" as const },
    { label: "Craigslist", url: `https://craigslist.org/search/cta?query=${encoded}`, type: "marketplace" as const },
    { label: "Facebook Marketplace", url: `https://www.facebook.com/marketplace/search/?query=${encoded}`, type: "marketplace" as const },
  ];
}
