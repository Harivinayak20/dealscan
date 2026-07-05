import { decodeVin, type VinDecodeResult } from "@/lib/vin-decoder";

// Free-VIN-report data layer. Everything comes from public, keyless US
// government APIs (NHTSA vPIC, NHTSA recalls/safety, fueleconomy.gov), so the
// page can stay free forever. Every section degrades to null independently —
// a slow upstream must never take down the whole report.

export type VinSpec = { label: string; value: string };

export type RecallItem = {
  campaignNumber: string;
  component: string;
  summary: string;
  remedy: string;
  reportedDate: string;
};

export type SafetyRating = {
  overall: string | null;
  frontalCrash: string | null;
  sideCrash: string | null;
  rollover: string | null;
  variantDescription: string | null;
};

export type FuelEconomy = {
  city: number | null;
  highway: number | null;
  combined: number | null;
  matchedTrim: string | null;
};

export type VinReport = {
  decode: VinDecodeResult;
  specs: VinSpec[];
  recalls: RecallItem[] | null; // null = lookup unavailable (vs. [] = zero recalls)
  safety: SafetyRating | null;
  fuelEconomy: FuelEconomy | null;
};

const TIMEOUT_MS = 6000;

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { accept: "application/json" },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

type VpicFlatResponse = { Results?: Array<Record<string, string | null>> };

/** Extra window-sticker-style specs from the flat vPIC endpoint. */
async function fetchSpecs(vin: string): Promise<VinSpec[]> {
  const data = await fetchJson<VpicFlatResponse>(
    `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`,
  );
  const row = data?.Results?.[0];
  if (!row) return [];

  const fields: Array<[string, string]> = [
    ["Series", "Series"],
    ["Trim", "Trim"],
    ["Body Style", "BodyClass"],
    ["Doors", "Doors"],
    ["Drive Type", "DriveType"],
    ["Engine", "EngineModel"],
    ["Cylinders", "EngineCylinders"],
    ["Displacement (L)", "DisplacementL"],
    ["Horsepower", "EngineHP"],
    ["Fuel Type", "FuelTypePrimary"],
    ["Transmission", "TransmissionStyle"],
    ["Transmission Speeds", "TransmissionSpeeds"],
    ["GVWR Class", "GVWR"],
    ["Plant", "PlantCity"],
    ["Plant Country", "PlantCountry"],
    ["ABS", "ABS"],
    ["Electronic Stability Control", "ESC"],
    ["Airbag Locations (Front)", "AirBagLocFront"],
    ["Airbag Locations (Side)", "AirBagLocSide"],
  ];

  return fields
    .map(([label, key]) => ({ label, value: (row[key] ?? "").toString().trim() }))
    .filter((s) => s.value && s.value.toLowerCase() !== "not applicable");
}

type RecallResponse = {
  results?: Array<{
    NHTSACampaignNumber?: string;
    Component?: string;
    Summary?: string;
    Remedy?: string;
    ReportReceivedDate?: string;
  }>;
};

async function fetchRecalls(make: string, model: string, year: string): Promise<RecallItem[] | null> {
  const url = `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;
  const data = await fetchJson<RecallResponse>(url);
  if (!data?.results) return null;
  return data.results.slice(0, 15).map((r) => ({
    campaignNumber: r.NHTSACampaignNumber ?? "",
    component: r.Component ?? "",
    summary: r.Summary ?? "",
    remedy: r.Remedy ?? "",
    reportedDate: r.ReportReceivedDate ?? "",
  }));
}

type SafetyListResponse = { Results?: Array<{ VehicleId?: number; VehicleDescription?: string }> };
type SafetyDetailResponse = {
  Results?: Array<{
    OverallRating?: string;
    OverallFrontCrashRating?: string;
    SideCrashRating?: string;
    RolloverRating?: string;
    VehicleDescription?: string;
  }>;
};

async function fetchSafety(make: string, model: string, year: string): Promise<SafetyRating | null> {
  const list = await fetchJson<SafetyListResponse>(
    `https://api.nhtsa.gov/SafetyRatings/modelyear/${encodeURIComponent(year)}/make/${encodeURIComponent(make)}/model/${encodeURIComponent(model)}`,
  );
  const vehicleId = list?.Results?.[0]?.VehicleId;
  if (!vehicleId) return null;

  const detail = await fetchJson<SafetyDetailResponse>(`https://api.nhtsa.gov/SafetyRatings/VehicleId/${vehicleId}`);
  const row = detail?.Results?.[0];
  if (!row) return null;

  const rating = (v?: string) => (v && v !== "Not Rated" ? v : null);
  return {
    overall: rating(row.OverallRating),
    frontalCrash: rating(row.OverallFrontCrashRating),
    sideCrash: rating(row.SideCrashRating),
    rollover: rating(row.RolloverRating),
    variantDescription: row.VehicleDescription ?? null,
  };
}

type EpaMenuResponse = { menuItem?: Array<{ text?: string; value?: string }> | { text?: string; value?: string } };
type EpaVehicleResponse = { city08?: number | string; highway08?: number | string; comb08?: number | string };

function asArray<T>(v: T[] | T | undefined): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

async function fetchFuelEconomy(make: string, model: string, year: string): Promise<FuelEconomy | null> {
  const menu = await fetchJson<EpaMenuResponse>(
    `https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${encodeURIComponent(year)}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`,
  );
  const options = asArray(menu?.menuItem);
  const first = options[0];
  if (!first?.value) return null;

  const vehicle = await fetchJson<EpaVehicleResponse>(`https://www.fueleconomy.gov/ws/rest/vehicle/${first.value}`);
  if (!vehicle) return null;

  const num = (v?: number | string) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
  };
  return {
    city: num(vehicle.city08),
    highway: num(vehicle.highway08),
    combined: num(vehicle.comb08),
    matchedTrim: first.text ?? null,
  };
}

export async function buildVinReport(vin: string): Promise<VinReport> {
  const decode = await decodeVin(vin);
  const { make, model, year } = decode;

  const [specs, recalls, safety, fuelEconomy] = await Promise.all([
    fetchSpecs(decode.vin),
    make && model && year ? fetchRecalls(make, model, year) : Promise.resolve(null),
    make && model && year ? fetchSafety(make, model, year) : Promise.resolve(null),
    make && model && year ? fetchFuelEconomy(make, model, year) : Promise.resolve(null),
  ]);

  return { decode, specs, recalls, safety, fuelEconomy };
}

export function isValidVin(vin: string): boolean {
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin.trim().toUpperCase());
}
