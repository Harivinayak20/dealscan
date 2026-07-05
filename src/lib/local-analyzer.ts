import type { AnalyzeListingRequest, AnalyzeListingResult, ManualDetails } from "@/lib/analyzer-types";
import { estimateRoughPricing } from "@/lib/rough-pricing";

export type DetectedVehicle = {
  year: number | null;
  make: string | null;
  model: string | null;
  trim: string | null;
  mileage: number | null;
  price: number | null;
  titleStatus: string | null;
  location: string | null;
  conditionPresent: boolean;
  vehicleAge: number | null;
  mileagePerYear: number | null;
};

const redFlagTerms = [
  { label: "No title", pattern: /\bno title\b/i, penalty: 35 },
  { label: "Salvage title", pattern: /\bsalvage\b/i, penalty: 25 },
  { label: "Rebuilt title", pattern: /\brebuilt\b/i, penalty: 25 },
  { label: "Flood history", pattern: /\bflood\b/i, penalty: 25 },
  { label: "Lien mentioned", pattern: /\blien\b/i, penalty: 12 },
  { label: "As-is sale", pattern: /\bas[-\s]?is\b/i, penalty: 10 },
  { label: "Mechanic special", pattern: /\bmechanic special\b/i, penalty: 20 },
  { label: "Needs work", pattern: /\bneeds work\b/i, penalty: 20 },
  { label: "Runs rough", pattern: /\bruns rough\b/i, penalty: 18 },
  { label: "Transmission issue", pattern: /\btransmission (issue|issues|problem|problems|work|slips?)\b/i, penalty: 25 },
  { label: "Engine issue", pattern: /\bengine (issue|issues|problem|problems|knock|work)\b/i, penalty: 25 },
  { label: "Check engine light", pattern: /\bcheck engine\b/i, penalty: 18 },
  { label: "Cash only", pattern: /\bcash only\b/i, penalty: 10 },
  { label: "No inspection", pattern: /\bno inspection\b/i, penalty: 12 },
  { label: "Parts only", pattern: /\bparts only\b/i, penalty: 22 },
  { label: "Project car", pattern: /\bproject car\b/i, penalty: 18 },
  { label: "Must tow", pattern: /\bmust tow\b|\btow away\b/i, penalty: 22 },
];

const greenFlagTerms = [
  { label: "Clean title", pattern: /\bclean title\b/i, bonus: 8 },
  { label: "One owner", pattern: /\bone owner\b|\b1 owner\b/i, bonus: 5 },
  { label: "No accidents", pattern: /\bno accidents?\b/i, bonus: 5 },
  { label: "Service records", pattern: /\bservice records?\b/i, bonus: 7 },
  { label: "Maintenance records", pattern: /\bmaintenance records?\b/i, bonus: 7 },
  { label: "New tires", pattern: /\bnew tires?\b/i, bonus: 3 },
  { label: "New brakes", pattern: /\bnew brakes?\b/i, bonus: 3 },
  { label: "Dealer serviced", pattern: /\bdealer serviced\b/i, bonus: 4 },
  { label: "Garage kept", pattern: /\bgarage kept\b/i, bonus: 3 },
  { label: "Low mileage", pattern: /\blow mileage\b/i, bonus: 5 },
  { label: "Recently serviced", pattern: /\brecently serviced\b|\brecent service\b/i, bonus: 4 },
  { label: "Clean Carfax", pattern: /\bclean carfax\b/i, bonus: 5 },
];

const commonMakes = [
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

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => (/^(BMW|GMC|VW)$/i.test(part) ? part.toUpperCase() : `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`))
    .join(" ");
}

function requestToText(request: AnalyzeListingRequest) {
  return `${request.listingText} ${Object.values(request.manualDetails ?? {}).join(" ")}`.replace(/\s+/g, " ").trim();
}

function parsePrice(text: string) {
  const dollarMatch = text.match(/\$\s?([\d,]+)/);

  if (dollarMatch) {
    return Number(dollarMatch[1].replaceAll(",", ""));
  }

  const askingMatch = text.match(/\b(?:asking|price|seller price)\D{0,12}(\d{1,3}(?:,\d{3})+|\d{4,6})\b/i);

  return askingMatch ? Number(askingMatch[1].replaceAll(",", "")) : null;
}

function parseMileage(text: string) {
  const match = text.match(/\b(\d{1,3}(?:,\d{3})+|\d{4,6}|\d{2,3}k)\s?(?:miles|mi)\b/i);

  if (!match) {
    return null;
  }

  const value = match[1].toLowerCase();

  return value.endsWith("k") ? Number(value.replace("k", "")) * 1000 : Number(value.replaceAll(",", ""));
}

function parseVehicle(text: string, manualDetails?: ManualDetails) {
  const manualYear = manualDetails?.year?.match(/\b(19|20)\d{2}\b/)?.[0];
  const manualMake = manualDetails?.make?.trim() || null;
  const manualModel = manualDetails?.model?.trim() || null;
  const yearMatch = manualYear ?? text.match(/\b(19|20)\d{2}\b/)?.[0] ?? null;
  const year = yearMatch ? Number(yearMatch) : null;
  const detected = text.match(/\b(?:19|20)\d{2}\s+([A-Za-z][A-Za-z-]+)\s+([A-Za-z0-9-]+)(?:\s+([A-Za-z0-9-]+(?:\s+[A-Za-z0-9-]+){0,2}))?/);
  const makeModelFallback = commonMakes
    .map((makeName) => text.match(new RegExp(`\\b(${makeName})\\s+([A-Za-z0-9-]+)(?:\\s+([A-Za-z0-9-]+))?`, "i")))
    .find(Boolean);
  const make = manualMake ? titleCase(manualMake) : detected?.[1] ? titleCase(detected[1]) : makeModelFallback?.[1] ? titleCase(makeModelFallback[1]) : null;
  const model = manualModel ? titleCase(manualModel) : detected?.[2] ? titleCase(detected[2]) : makeModelFallback?.[2] ? titleCase(makeModelFallback[2]) : null;
  const trim = detected?.[3]?.replace(/[,.;].*$/, "").trim() || null;

  return { year, make, model, trim };
}

function parseTitleStatus(text: string, manualDetails?: ManualDetails) {
  const combined = `${manualDetails?.titleStatus ?? ""} ${text}`;

  if (/\bno title\b/i.test(combined)) return "No title";
  if (/\bsalvage\b/i.test(combined)) return "Salvage";
  if (/\brebuilt\b/i.test(combined)) return "Rebuilt";
  if (/\bflood\b/i.test(combined)) return "Flood risk";
  if (/\bclean title\b/i.test(combined)) return "Clean title";
  if (/\btitle\b/i.test(combined)) return "Mentioned, not verified";

  return null;
}

function parseLocation(text: string) {
  return text.match(/\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)?),\s?([A-Z]{2})\b/)?.[0] ?? null;
}

function hasCondition(text: string) {
  return /runs|condition|good|excellent|rough|needs|maintenance|records|accident|new tires|new brakes|engine|transmission|leak|warning|check engine|cold ac|recent/i.test(text);
}

export function detectVehicle(request: AnalyzeListingRequest): DetectedVehicle {
  const text = requestToText(request);
  const vehicle = parseVehicle(text, request.manualDetails);
  const mileage = parseMileage(text);
  const price = parsePrice(text);
  const vehicleAge = vehicle.year ? Math.max(1, new Date().getFullYear() - vehicle.year + 1) : null;
  const mileagePerYear = mileage !== null && vehicleAge !== null ? mileage / vehicleAge : null;

  return {
    ...vehicle,
    mileage,
    price,
    titleStatus: parseTitleStatus(text, request.manualDetails),
    location: parseLocation(text),
    conditionPresent: hasCondition(text),
    vehicleAge,
    mileagePerYear,
  };
}

function verdictForScore(score: number) {
  if (score >= 85) return "Great Deal";
  if (score >= 70) return "Decent Deal";
  if (score >= 55) return "Proceed with Caution";
  if (score >= 40) return "Red Flags Present";

  return "Avoid";
}

function confidenceForDetection(detected: DetectedVehicle): "Low" | "Medium" | "High" {
  const presentCount = [
    detected.year,
    detected.make,
    detected.model,
    detected.price,
    detected.mileage,
    detected.titleStatus,
    detected.conditionPresent,
  ].filter(Boolean).length;

  if (presentCount === 7) return "High";
  if (presentCount >= 5) return "Medium";

  return "Low";
}

function scoreMileage(mileagePerYear: number | null) {
  if (mileagePerYear === null) return { score: 42, adjustment: 0, note: "Mileage or year is missing." };
  if (mileagePerYear > 24000) return { score: 35, adjustment: -20, note: "Mileage is very high for the vehicle age." };
  if (mileagePerYear > 18000) return { score: 55, adjustment: -10, note: "Mileage is high for the vehicle age." };
  if (mileagePerYear < 8000) return { score: 86, adjustment: 5, note: "Mileage is low for the vehicle age." };

  return { score: 74, adjustment: 0, note: "Mileage looks plausible for the vehicle age." };
}

function formatMissing(label: string, present: boolean) {
  return present ? null : label;
}

export function analyzeListingLocally(request: AnalyzeListingRequest): AnalyzeListingResult {
  const text = requestToText(request);
  const detected = detectVehicle(request);
  const redFlags = redFlagTerms.filter((term) => term.pattern.test(text));
  const greenFlags = greenFlagTerms.filter((term) => term.pattern.test(text));
  const mileageScore = scoreMileage(detected.mileagePerYear);
  let score = 70;

  if (detected.price === null) score -= 15;
  if (detected.mileage === null) score -= 15;
  if (detected.year === null) score -= 10;
  if (!detected.make) score -= 10;
  if (!detected.model) score -= 10;

  for (const flag of greenFlags) {
    score += flag.bonus;
  }

  for (const flag of redFlags) {
    score -= flag.penalty;
  }

  score += mileageScore.adjustment;
  score = clampScore(score);

  const missingInfo = [
    formatMissing("Missing year", detected.year !== null),
    formatMissing("Missing make", Boolean(detected.make)),
    formatMissing("Missing model", Boolean(detected.model)),
    formatMissing("Missing price", detected.price !== null),
    formatMissing("Missing mileage", detected.mileage !== null),
    formatMissing("Missing title status", Boolean(detected.titleStatus)),
    formatMissing("Missing location", Boolean(detected.location)),
    formatMissing("Missing condition", detected.conditionPresent),
    "VIN",
    "Title photo",
    "Maintenance receipts",
    "Recent inspection",
  ].filter((item): item is string => Boolean(item));
  const redFlagLabels = redFlags.map((flag) => flag.label);
  const greenFlagLabels = greenFlags.map((flag) => flag.label);
  const pricing = estimateRoughPricing({
    price: detected.price,
    score,
    redFlags: redFlagLabels,
    greenFlags: greenFlagLabels,
  });
  const confidence = confidenceForDetection(detected);
  const vehicleName = [detected.year, detected.make, detected.model, detected.trim].filter(Boolean).join(" ");
  const titleRiskScore = detected.titleStatus === "Clean title" ? 88 : detected.titleStatus ? 50 : 35;
  const mechanicalRiskScore = redFlags.some((flag) => /engine|transmission|mechanic|needs|rough|tow|parts/i.test(flag.label))
    ? 35
    : detected.conditionPresent
      ? 70
      : 45;
  const sellerTransparencyScore = confidence === "High" ? 82 : confidence === "Medium" ? 64 : 38;
  const missingInfoScore = Math.max(25, 100 - missingInfo.length * 8);
  const priceNote =
    detected.price === null
      ? "No seller price was provided."
      : detected.price < 1500
        ? "Price is unusually low, so title and mechanical condition need extra scrutiny."
        : "Price is present. Compare with local licensed comps before relying on it.";

  return {
    score,
    verdict: verdictForScore(score),
    summary:
      score >= 85
        ? `${vehicleName || "This listing"} has strong buyer-friendly signals. Still verify title, VIN, records, and condition before making an offer.`
        : score >= 70
          ? `${vehicleName || "This listing"} looks workable, but the score depends on seller proof and an inspection.`
          : score >= 55
            ? "Proceed carefully. The listing is missing proof or has enough uncertainty to justify a lower offer."
            : score >= 40
              ? "Red flags are present. Do not move forward without title proof, VIN history, and a mechanic inspection."
              : "Avoid this listing unless a trusted inspection and title check resolve the major risks.",
    ...pricing,
    categories: [
      { label: "Price vs estimated market value", score: detected.price ? 68 : 30, note: priceNote },
      { label: "Mileage for age", score: mileageScore.score, note: mileageScore.note },
      { label: "Title and ownership risk", score: titleRiskScore, note: detected.titleStatus ? `Title status detected: ${detected.titleStatus}.` : "Title status is missing." },
      { label: "Mechanical risk", score: mechanicalRiskScore, note: redFlags.length ? "Risk terms in the listing need verification." : "No major mechanical risk terms were detected." },
      { label: "Seller transparency", score: sellerTransparencyScore, note: confidence === "High" ? "The core listing details are present." : "Important seller proof is missing." },
      { label: "Missing information", score: missingInfoScore, note: "Missing proof lowers confidence and negotiation leverage." },
      { label: "Positive signals", score: greenFlagLabels.length ? Math.min(95, 55 + greenFlagLabels.length * 8) : 45, note: greenFlagLabels.length ? "Positive terms were found in the listing." : "Few positive proof points were provided." },
      { label: "Negotiation opportunity", score: detected.price ? (redFlags.length ? 82 : 64) : 45, note: redFlags.length ? "Use unresolved risks as negotiation points." : "Use inspection findings and missing proof to negotiate." },
    ],
    redFlags: redFlagLabels,
    greenFlags: greenFlagLabels.length ? greenFlagLabels : ["Some basic vehicle details provided"],
    missingInfo,
    negotiationTip:
      score < 55
        ? "Do not negotiate seriously until title, VIN, and inspection risks are resolved."
        : "Ask for proof first, then anchor your offer below asking if records, VIN history, or inspection results are incomplete.",
    sellerQuestions: [
      "Can you send the VIN and a photo of the title?",
      "Do you have maintenance records or recent repair receipts?",
      "Are there any warning lights, leaks, engine issues, or transmission issues?",
      "Can I have it inspected by a mechanic before buying?",
    ],
    confidence,
  };
}
