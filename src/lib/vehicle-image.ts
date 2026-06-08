export type VehicleImage = {
  url: string;
  alt: string;
  credit: string;
  sourceUrl: string;
};

export type CommonsImagePage = {
  title?: string;
  index?: number;
  imageinfo?: Array<{
    thumburl?: string;
    url?: string;
    descriptionurl?: string;
    extmetadata?: {
      Artist?: { value?: string };
      LicenseShortName?: { value?: string };
      ObjectName?: { value?: string };
    };
  }>;
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
  const tokens = meaningfulTokens(query);
  const normalized = tokens.join(" ") || normalizeVehicleName(query);
  if (!normalized) return "";
  return `${normalized} car`;
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function meaningfulTokens(query: string) {
  return normalizeVehicleName(query)
    .split(" ")
    .filter((token) => token.length > 2 && !/^(19|20)\d{2}$/.test(token))
    .slice(0, 4);
}

export function buildCommonsImageSearchUrl(query: string): string {
  const searchTerms = vehicleImageSearchTerms(query);
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrnamespace", "6");
  url.searchParams.set("gsrlimit", "6");
  url.searchParams.set("gsrsearch", searchTerms);
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url|extmetadata");
  url.searchParams.set("iiurlwidth", "800");
  return url.toString();
}

export function imageFromCommonsPage(page: CommonsImagePage, query: string): VehicleImage | null {
  const info = page.imageinfo?.[0];
  const url = info?.thumburl || info?.url;
  if (!url) return null;

  const title = stripHtml(info?.extmetadata?.ObjectName?.value || page.title || query);
  const searchableTitle = normalizeVehicleName(`${title} ${page.title ?? ""}`);
  const tokens = meaningfulTokens(query);
  if (tokens.length > 0 && !tokens.some((token) => searchableTitle.includes(token))) {
    return null;
  }

  const artist = stripHtml(info?.extmetadata?.Artist?.value || "Wikimedia Commons contributor");
  const license = stripHtml(info?.extmetadata?.LicenseShortName?.value || "Wikimedia Commons");

  return {
    url,
    alt: `${title} vehicle photo`,
    credit: `Photo: ${artist}, ${license}`,
    sourceUrl: info?.descriptionurl || "https://commons.wikimedia.org/",
  };
}
