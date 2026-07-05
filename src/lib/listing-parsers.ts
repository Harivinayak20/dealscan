// Text parsers shared by the local analyzer, listing memory, and tests.
// Relative-import only (no "@/" alias) so node --test can load it directly.

export const commonMakes = [
  "Acura",
  "Audi",
  "BMW",
  "Buick",
  "Cadillac",
  "Chevrolet",
  "Chevy",
  "Chrysler",
  "Dodge",
  "Ford",
  "Genesis",
  "GMC",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Jeep",
  "Kia",
  "Lexus",
  "Lincoln",
  "Mazda",
  "Mercedes-Benz",
  "Mercedes",
  "Mini",
  "Nissan",
  "Porsche",
  "Ram",
  "Subaru",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "VW",
  "Volvo",
];

export function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => (/^(BMW|GMC|VW)$/i.test(part) ? part.toUpperCase() : `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`))
    .join(" ");
}

export function parsePrice(text: string) {
  const dollarMatch = text.match(/\$\s?([\d,]+)/);

  if (dollarMatch) {
    return Number(dollarMatch[1].replaceAll(",", ""));
  }

  const askingMatch = text.match(/\b(?:asking|price|seller price)\D{0,12}(\d{1,3}(?:,\d{3})+|\d{4,6})\b/i);

  return askingMatch ? Number(askingMatch[1].replaceAll(",", "")) : null;
}

export function parseMileage(text: string) {
  const match = text.match(/\b(\d{1,3}(?:,\d{3})+|\d{4,6}|\d{2,3}k)\s?(?:miles|mi)\b/i);

  if (!match) {
    return null;
  }

  const value = match[1].toLowerCase();

  return value.endsWith("k") ? Number(value.replace("k", "")) * 1000 : Number(value.replaceAll(",", ""));
}

export type ParsedVehicleText = {
  year: number | null;
  make: string | null;
  model: string | null;
  trim: string | null;
};

export function parseVehicleFromText(text: string): ParsedVehicleText {
  const yearMatch = text.match(/\b(19|20)\d{2}\b/)?.[0] ?? null;
  const year = yearMatch ? Number(yearMatch) : null;
  const detected = text.match(/\b(?:19|20)\d{2}\s+([A-Za-z][A-Za-z-]+)\s+([A-Za-z0-9-]+)(?:\s+([A-Za-z0-9-]+(?:\s+[A-Za-z0-9-]+){0,2}))?/);
  const makeModelFallback = commonMakes
    .map((makeName) => text.match(new RegExp(`\\b(${makeName})\\s+([A-Za-z0-9-]+)(?:\\s+([A-Za-z0-9-]+))?`, "i")))
    .find(Boolean);
  const make = detected?.[1] ? titleCase(detected[1]) : makeModelFallback?.[1] ? titleCase(makeModelFallback[1]) : null;
  const model = detected?.[2] ? titleCase(detected[2]) : makeModelFallback?.[2] ? titleCase(makeModelFallback[2]) : null;
  const trim = detected?.[3]?.replace(/[,.;].*$/, "").trim() || null;

  return { year, make, model, trim };
}
