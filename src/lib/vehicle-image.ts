export type VehicleImage = {
  url: string;
  alt: string;
  credit: string;
  sourceUrl: string;
};

type VehicleImageInput = {
  year?: string | null;
  make?: string | null;
  model?: string | null;
  vehicleTitle?: string | null;
};

const curatedImages: Array<{
  aliases: string[];
  image: VehicleImage;
}> = [
  {
    aliases: [
      "chevrolet cruze",
      "chevy cruze",
      "chevrolet cruise",
      "chevy cruise",
      "chevlet cruze",
      "chevlet cruise",
    ],
    image: {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/11-14%20Chevrolet%20Cruze.jpg?width=800",
      alt: "2011 to 2014 Chevrolet Cruze sedan",
      credit: "Photo: MercurySable99, CC BY-SA 4.0, via Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:11-14_Chevrolet_Cruze.jpg",
    },
  },
];

function cleanToken(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/[^a-z0-9\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeVehicleName(value: string): string {
  return cleanToken(value)
    .toLowerCase()
    .replace(/\bchevy\b/g, "chevrolet")
    .replace(/\bchevlet\b/g, "chevrolet")
    .replace(/\bcruise\b/g, "cruze")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildVehicleImageQuery(input: VehicleImageInput): string {
  const parts = [
    cleanToken(input.year),
    cleanToken(input.make),
    cleanToken(input.model),
  ].filter(Boolean);

  const explicit = parts.join(" ");
  if (explicit) return explicit;

  return cleanToken(input.vehicleTitle);
}

export function getCuratedVehicleImage(query: string): VehicleImage | null {
  const normalized = normalizeVehicleName(query);
  if (!normalized) return null;

  const match = curatedImages.find((item) =>
    item.aliases.some((alias) => normalized.includes(normalizeVehicleName(alias))),
  );

  return match?.image ?? null;
}

export function vehicleImageSearchTerms(query: string): string {
  const normalized = normalizeVehicleName(query);
  if (!normalized) return "";
  return `${normalized} car exterior`;
}
