// Curated head-to-head comparison pages between two used models. Curated (not
// every NxN combo) so each page is a sensible same-class matchup that clears the
// thin-content bar with a real editor's take plus side-by-side data pulled from
// car-models.ts. Targets the high-intent "[car A] vs [car B] used" query.
import { getCarModel, type CarModel } from "@/lib/car-models";

export type Comparison = {
  slug: string;
  aSlug: string;
  bSlug: string;
  segment: string;
  editorsTake: string;
  updatedAt: string;
};

const UPDATED = "2026-06-22";

export const comparisons: Comparison[] = [
  {
    slug: "honda-civic-vs-toyota-corolla",
    aSlug: "used-honda-civic",
    bSlug: "used-toyota-corolla",
    segment: "Compact sedans",
    editorsTake:
      "Both are the reliability benchmarks of the compact class, so this rarely comes down to whether they last. The Civic is the more engaging car to drive and has a roomier interior, while the Corolla prioritizes simplicity and the lowest running costs. On the used market the deciding factor is usually the specific car's records, not the badge.",
    updatedAt: UPDATED,
  },
  {
    slug: "toyota-camry-vs-honda-accord",
    aSlug: "used-toyota-camry",
    bSlug: "used-honda-accord",
    segment: "Midsize sedans",
    editorsTake:
      "The two default picks for a dependable used midsize sedan. The Accord drives more like a sport sedan and has a larger, more refined cabin; the Camry leans toward comfort and has the longer track record of trouble-free high-mileage examples. Either is a safe buy with records.",
    updatedAt: UPDATED,
  },
  {
    slug: "honda-cr-v-vs-toyota-rav4",
    aSlug: "used-honda-cr-v",
    bSlug: "used-toyota-rav4",
    segment: "Compact SUVs",
    editorsTake:
      "The two best-selling compact SUVs for a reason. The CR-V is the more comfortable, better-packaged daily driver; the RAV4 holds value slightly better and offers stronger hybrid and light-off-road options. Both are reliability leaders, so match the year to its known issues and buy on records.",
    updatedAt: UPDATED,
  },
  {
    slug: "ford-f-150-vs-chevrolet-silverado-1500",
    aSlug: "used-ford-f-150",
    bSlug: "used-chevrolet-silverado-1500",
    segment: "Full-size trucks",
    editorsTake:
      "America's two best-selling trucks. The F-150 offers more engine choices and an aluminum body that resists rust; the Silverado 1500 is mechanically straightforward with a strong V8 reputation. Both live or die on how hard they were worked, so towing history and maintenance proof matter more than the brand.",
    updatedAt: UPDATED,
  },
  {
    slug: "ford-f-150-vs-ram-1500",
    aSlug: "used-ford-f-150",
    bSlug: "used-ram-1500",
    segment: "Full-size trucks",
    editorsTake:
      "The F-150 wins on engine variety and resale; the Ram 1500 wins on ride comfort and interior quality thanks to its coil/air suspension. The trade-off is that the Ram's air suspension and electronics are more expensive when they fail, so a used Ram needs those systems checked closely.",
    updatedAt: UPDATED,
  },
  {
    slug: "toyota-rav4-vs-mazda-cx-5",
    aSlug: "used-toyota-rav4",
    bSlug: "used-mazda-cx-5",
    segment: "Compact SUVs",
    editorsTake:
      "The RAV4 is the practical, high-resale, hybrid-available choice; the CX-5 is the nicer car to drive and sit in, with a more premium interior for the money. Both are reliable, so it comes down to whether you value resale and efficiency or driving feel and cabin quality.",
    updatedAt: UPDATED,
  },
  {
    slug: "honda-cr-v-vs-mazda-cx-5",
    aSlug: "used-honda-cr-v",
    bSlug: "used-mazda-cx-5",
    segment: "Compact SUVs",
    editorsTake:
      "The CR-V offers more rear-seat and cargo space and excellent all-round reliability; the CX-5 counters with a more upscale interior and sharper handling. If you haul people and gear, lean CR-V; if you want the SUV that feels most like a premium car, lean CX-5.",
    updatedAt: UPDATED,
  },
  {
    slug: "toyota-camry-vs-nissan-altima",
    aSlug: "used-toyota-camry",
    bSlug: "used-nissan-altima",
    segment: "Midsize sedans",
    editorsTake:
      "The Camry is the stronger long-term bet — better resale and a cleaner reliability record. The Altima is usually cheaper to buy used, but its CVT history means transmission service records and a careful test drive are non-negotiable before you commit.",
    updatedAt: UPDATED,
  },
  {
    slug: "subaru-forester-vs-subaru-outback",
    aSlug: "used-subaru-forester",
    bSlug: "used-subaru-outback",
    segment: "AWD wagons & SUVs",
    editorsTake:
      "Same Subaru AWD DNA, different shape. The Forester is taller with better visibility and easier entry; the Outback is longer, rides better on the highway, and offers more cargo room. Check the same Subaru watch-items on both and pick by body style, not by reliability.",
    updatedAt: UPDATED,
  },
  {
    slug: "toyota-highlander-vs-honda-pilot",
    aSlug: "used-toyota-highlander",
    bSlug: "used-honda-pilot",
    segment: "3-row SUVs",
    editorsTake:
      "Two of the most dependable three-row family SUVs. The Highlander has the edge on resale and hybrid availability; the Pilot offers more usable third-row and cargo space. Both reward buying a well-maintained example over a cheap high-mileage one.",
    updatedAt: UPDATED,
  },
  {
    slug: "honda-civic-vs-mazda-3",
    aSlug: "used-honda-civic",
    bSlug: "used-mazda-3",
    segment: "Compact sedans",
    editorsTake:
      "The Civic offers more space, better resale, and a huge parts/service network; the Mazda3 is the more premium-feeling and fun-to-drive compact. Both are reliable — choose space and resale (Civic) or interior quality and driving feel (Mazda3).",
    updatedAt: UPDATED,
  },
  {
    slug: "hyundai-elantra-vs-honda-civic",
    aSlug: "used-hyundai-elantra",
    bSlug: "used-honda-civic",
    segment: "Compact sedans",
    editorsTake:
      "The Elantra is usually the better value used and may still carry remaining powertrain warranty; the Civic has stronger resale and the longer proven-reliability record. Check the Elantra's engine history on affected years and the Civic's known issues by generation.",
    updatedAt: UPDATED,
  },
  {
    slug: "hyundai-sonata-vs-toyota-camry",
    aSlug: "used-hyundai-sonata",
    bSlug: "used-toyota-camry",
    segment: "Midsize sedans",
    editorsTake:
      "The Sonata gives you more car for the money and often remaining warranty; the Camry gives you class-leading resale and the safest long-term reliability bet. Verify the Sonata's engine on affected model years before letting price decide.",
    updatedAt: UPDATED,
  },
  {
    slug: "ford-explorer-vs-jeep-grand-cherokee",
    aSlug: "used-ford-explorer",
    bSlug: "used-jeep-grand-cherokee",
    segment: "Midsize SUVs",
    editorsTake:
      "The Explorer offers three rows and more passenger space; the Grand Cherokee is a two-row with stronger off-road capability and a more premium feel. Both have model years with known issues, so this one especially rewards a pre-purchase inspection and a clean history report.",
    updatedAt: UPDATED,
  },
  {
    slug: "nissan-rogue-vs-toyota-rav4",
    aSlug: "used-nissan-rogue",
    bSlug: "used-toyota-rav4",
    segment: "Compact SUVs",
    editorsTake:
      "The RAV4 is the stronger pick on resale and long-term reliability; the Rogue is typically cheaper used and comfortable, but its CVT history means service records and a test drive for hesitation are essential. Let condition and records, not just price, decide.",
    updatedAt: UPDATED,
  },
  {
    slug: "chevrolet-equinox-vs-ford-escape",
    aSlug: "used-chevrolet-equinox",
    bSlug: "used-ford-escape",
    segment: "Compact SUVs",
    editorsTake:
      "Two affordable, widely available compact SUVs. Both have specific engine concerns on certain years, so this comparison is less about brand and more about buying the right year with proof of maintenance. Run a history report and inspect before either.",
    updatedAt: UPDATED,
  },
  {
    slug: "subaru-crosstrek-vs-subaru-forester",
    aSlug: "used-subaru-crosstrek",
    bSlug: "used-subaru-forester",
    segment: "AWD SUVs",
    editorsTake:
      "The Crosstrek is smaller, more efficient, and easier to park; the Forester is roomier inside with more cargo space and better visibility. Same Subaru AWD reliability story — pick by size and fuel economy needs.",
    updatedAt: UPDATED,
  },
  {
    slug: "ram-1500-vs-chevrolet-silverado-1500",
    aSlug: "used-ram-1500",
    bSlug: "used-chevrolet-silverado-1500",
    segment: "Full-size trucks",
    editorsTake:
      "The Ram 1500 wins on ride quality and interior; the Silverado is the more straightforward, easier-to-service truck. The Ram's air suspension and electronics are the items to check used, while the Silverado is about confirming the V8 was maintained and not abused.",
    updatedAt: UPDATED,
  },
  {
    slug: "gmc-sierra-1500-vs-chevrolet-silverado-1500",
    aSlug: "used-gmc-sierra-1500",
    bSlug: "used-chevrolet-silverado-1500",
    segment: "Full-size trucks",
    editorsTake:
      "Mechanically these are twins — the Sierra is the more upscale-trimmed version of the Silverado. Buy on price, trim, and condition, because the drivetrain and reliability story is essentially identical. Whichever specific truck has the better history wins.",
    updatedAt: UPDATED,
  },
  {
    slug: "toyota-4runner-vs-jeep-wrangler",
    aSlug: "used-toyota-4runner",
    bSlug: "used-jeep-wrangler",
    segment: "Off-road SUVs",
    editorsTake:
      "The 4Runner is the more comfortable daily driver with legendary resale and reliability; the Wrangler is the more capable and customizable off-roader. Both hold value unusually well, so cheap examples deserve scrutiny. Pick by whether it's a daily that can go off-road (4Runner) or an off-roader you also daily (Wrangler).",
    updatedAt: UPDATED,
  },
  {
    slug: "toyota-highlander-vs-toyota-4runner",
    aSlug: "used-toyota-highlander",
    bSlug: "used-toyota-4runner",
    segment: "Toyota SUVs",
    editorsTake:
      "The Highlander is a car-based three-row built for on-road comfort and efficiency; the 4Runner is a truck-based two/three-row built for durability and off-road use. Both are reliability icons — choose the Highlander for family commuting, the 4Runner for ruggedness and resale.",
    updatedAt: UPDATED,
  },
  {
    slug: "honda-accord-vs-hyundai-sonata",
    aSlug: "used-honda-accord",
    bSlug: "used-hyundai-sonata",
    segment: "Midsize sedans",
    editorsTake:
      "The Accord is the driver's choice with strong resale and a deep reliability record; the Sonata undercuts it on price and may still have warranty left. Confirm the Sonata's engine history on affected years, then let your budget make the call.",
    updatedAt: UPDATED,
  },
  {
    slug: "volkswagen-jetta-vs-honda-civic",
    aSlug: "used-volkswagen-jetta",
    bSlug: "used-honda-civic",
    segment: "Compact sedans",
    editorsTake:
      "The Jetta offers a more European driving feel and a roomy trunk; the Civic counters with stronger resale, a denser service network, and a longer worry-free track record. German-car maintenance costs make records especially important on a used Jetta.",
    updatedAt: UPDATED,
  },
  {
    slug: "toyota-sienna-vs-honda-odyssey",
    aSlug: "used-toyota-sienna",
    bSlug: "used-honda-odyssey",
    segment: "Minivans",
    editorsTake:
      "The two best minivans on the used market. The Sienna offers AWD and standard hybrid power on recent generations with excellent resale; the Odyssey drives a touch better and has clever interior flexibility. Both are family workhorses — buy the one with the cleanest maintenance history.",
    updatedAt: UPDATED,
  },
  {
    slug: "kia-sorento-vs-toyota-highlander",
    aSlug: "used-kia-sorento",
    bSlug: "used-toyota-highlander",
    segment: "3-row SUVs",
    editorsTake:
      "The Sorento is a smaller, more affordable three-row that may carry remaining warranty; the Highlander is larger, holds value better, and has the longer reliability pedigree. If budget leads, the Sorento makes sense; if long-term resale leads, the Highlander does.",
    updatedAt: UPDATED,
  },
  {
    slug: "hyundai-tucson-vs-toyota-rav4",
    aSlug: "used-hyundai-tucson",
    bSlug: "used-toyota-rav4",
    segment: "Compact SUVs",
    editorsTake:
      "The Tucson is usually the better-equipped value used and may still have warranty; the RAV4 wins on resale and proven reliability. Verify the Tucson's engine on affected years, then weigh value against long-term resale.",
    updatedAt: UPDATED,
  },
  {
    slug: "chevrolet-malibu-vs-toyota-camry",
    aSlug: "used-chevrolet-malibu",
    bSlug: "used-toyota-camry",
    segment: "Midsize sedans",
    editorsTake:
      "The Malibu is often the cheaper used buy with comfortable highway manners; the Camry costs more but returns it in resale and reliability. The Malibu's specific transmission and engine concerns on certain years make a pre-purchase inspection the deciding safeguard.",
    updatedAt: UPDATED,
  },
  {
    slug: "ford-fusion-vs-honda-accord",
    aSlug: "used-ford-fusion",
    bSlug: "used-honda-accord",
    segment: "Midsize sedans",
    editorsTake:
      "The Fusion is a strong-value used sedan with sharp styling and a comfortable ride; the Accord holds value better and has the deeper reliability record. Since the Fusion is discontinued, buy on condition and records — the savings can be real if the specific car checks out.",
    updatedAt: UPDATED,
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}

export type ResolvedComparison = {
  comparison: Comparison;
  a: CarModel;
  b: CarModel;
};

export function resolveComparison(slug: string): ResolvedComparison | undefined {
  const comparison = getComparison(slug);
  if (!comparison) return undefined;
  const a = getCarModel(comparison.aSlug);
  const b = getCarModel(comparison.bSlug);
  if (!a || !b) return undefined;
  return { comparison, a, b };
}

// Comparisons that involve a given model slug (for internal linking from the
// model page). Returns the comparison plus the *other* model in the pair.
export function comparisonsForModel(modelSlug: string) {
  return comparisons
    .filter((c) => c.aSlug === modelSlug || c.bSlug === modelSlug)
    .map((c) => ({
      comparison: c,
      otherSlug: c.aSlug === modelSlug ? c.bSlug : c.aSlug,
    }));
}
