export type PlatformLink = {
  label: string;
  url: string;
  type: "marketplace" | "reference";
};

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
  links.push({
    label: "Insurance Quote",
    url: "https://www.thezebra.com/auto-insurance/",
    type: "reference",
  });

  return links;
}
