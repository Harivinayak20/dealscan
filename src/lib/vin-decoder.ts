const NHTSA_URL = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin";

export type VinDecodeResult = {
  vin: string;
  make: string | null;
  model: string | null;
  year: string | null;
  trim: string | null;
  engine: string | null;
  driveType: string | null;
  fuelType: string | null;
  bodyClass: string | null;
  plantCity: string | null;
  plantState: string | null;
  error?: string;
};

export function extractVin(text: string): string | null {
  const match = text.match(/\b[A-HJ-NPR-Z0-9]{17}\b/i);
  return match?.[0].toUpperCase() ?? null;
}

export async function decodeVin(vin: string): Promise<VinDecodeResult> {
  const cleanVin = vin.trim().toUpperCase();

  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(cleanVin)) {
    return { vin: cleanVin, make: null, model: null, year: null, trim: null, engine: null, driveType: null, fuelType: null, bodyClass: null, plantCity: null, plantState: null, error: "Invalid VIN length or characters." };
  }

  const url = `${NHTSA_URL}/${cleanVin}?format=json`;

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (!response.ok) {
      return { vin: cleanVin, make: null, model: null, year: null, trim: null, engine: null, driveType: null, fuelType: null, bodyClass: null, plantCity: null, plantState: null, error: `NHTSA returned HTTP ${response.status}.` };
    }

    const data = (await response.json()) as {
      Results?: Array<{
        Variable?: string;
        Value?: string | null;
      }>;
    };

    const results = data.Results ?? [];
    const find = (variable: string) => results.find((r) => r.Variable === variable)?.Value ?? null;

    return {
      vin: cleanVin,
      make: find("Make"),
      model: find("Model"),
      year: find("Model Year"),
      trim: find("Trim"),
      engine: find("Engine Model") || find("Engine Number of Cylinders"),
      driveType: find("Drive Type"),
      fuelType: find("Fuel Type - Primary"),
      bodyClass: find("Body Class"),
      plantCity: find("Plant City"),
      plantState: find("Plant State"),
    };
  } catch (error) {
    return {
      vin: cleanVin,
      make: null, model: null, year: null, trim: null, engine: null,
      driveType: null, fuelType: null, bodyClass: null, plantCity: null, plantState: null,
      error: error instanceof Error ? error.message : "VIN decode failed.",
    };
  }
}
