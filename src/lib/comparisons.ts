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
const UPDATED_2 = "2026-07-03";

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
  {
    slug: "toyota-corolla-vs-mazda-3",
    aSlug: "used-toyota-corolla",
    bSlug: "used-mazda-3",
    segment: "Compact sedans",
    editorsTake:
      "The Corolla is the appliance that never breaks; the Mazda 3 is the compact that feels a class more expensive inside and drives like it costs more. Reliability is close enough that it rarely decides this one — buy the Mazda if you care how a car feels, the Corolla if you never want to think about it.",
    updatedAt: UPDATED_2,
  },
  {
    slug: "toyota-corolla-vs-hyundai-elantra",
    aSlug: "used-toyota-corolla",
    bSlug: "used-hyundai-elantra",
    segment: "Compact sedans",
    editorsTake:
      "The Elantra typically sells for less than an equivalent Corolla and comes better equipped, which makes it the value play. The Corolla answers with the stronger long-term track record and better resale. On engines from Hyundai's recall-affected years, records decide everything — a documented Elantra can be the smarter buy.",
    updatedAt: UPDATED_2,
  },
  {
    slug: "nissan-altima-vs-honda-accord",
    aSlug: "used-nissan-altima",
    bSlug: "used-honda-accord",
    segment: "Midsize sedans",
    editorsTake:
      "The Altima is almost always the cheaper car on the used lot, and that discount exists for a reason: its CVT history demands fluid-change proof. The Accord costs more up front but tends to earn it back in durability and resale. An Altima with full CVT service records is a legitimate value; one without records is a gamble.",
    updatedAt: UPDATED_2,
  },
  {
    slug: "ford-escape-vs-honda-cr-v",
    aSlug: "used-ford-escape",
    bSlug: "used-honda-cr-v",
    segment: "Compact SUVs",
    editorsTake:
      "The Escape is livelier to drive and cheaper to buy; the CR-V is roomier, holds value better, and has the stronger reliability reputation outside its early 1.5T years. If the budget is tight, a documented Escape is a fine buy — but the CR-V is the one you keep for a decade.",
    updatedAt: UPDATED_2,
  },
  {
    slug: "ford-escape-vs-toyota-rav4",
    aSlug: "used-ford-escape",
    bSlug: "used-toyota-rav4",
    segment: "Compact SUVs",
    editorsTake:
      "The RAV4 wins the long game: better resale, a stronger reliability record, and an excellent hybrid. The Escape's case is price — the same year and miles typically costs meaningfully less. If you plan to keep the car past 100k miles, the RAV4's premium usually pays for itself.",
    updatedAt: UPDATED_2,
  },
  {
    slug: "nissan-rogue-vs-honda-cr-v",
    aSlug: "used-nissan-rogue",
    bSlug: "used-honda-cr-v",
    segment: "Compact SUVs",
    editorsTake:
      "The Rogue undercuts the CR-V on price and offers a comfortable, quiet cabin. The catch is the CVT: earlier Rogues need documented fluid service to be a safe buy. The CR-V costs more and is worth more — but a well-documented Rogue at a real discount is not the mistake the internet says it is.",
    updatedAt: UPDATED_2,
  },
  {
    slug: "mazda-cx-5-vs-subaru-forester",
    aSlug: "used-mazda-cx-5",
    bSlug: "used-subaru-forester",
    segment: "Compact SUVs",
    editorsTake:
      "The CX-5 has the nicer interior and drives with more polish; the Forester counters with standard all-wheel drive, better visibility, and more cargo room. Watch oil consumption on certain older Subaru engines and head gasket history on the oldest ones. Snow-state buyers lean Forester; everyone else usually prefers the CX-5.",
    updatedAt: UPDATED_2,
  },
  {
    slug: "hyundai-tucson-vs-subaru-forester",
    aSlug: "used-hyundai-tucson",
    bSlug: "used-subaru-forester",
    segment: "Compact SUVs",
    editorsTake:
      "The Tucson is usually cheaper with a longer original warranty tail; the Forester brings standard AWD and a loyal-owner reliability record. Both have engine eras that demand records — Hyundai's recall years and Subaru's oil-consumption years — so on either one, service history matters more than the badge.",
    updatedAt: UPDATED_2,
  },
  {
    slug: "hyundai-tucson-vs-mazda-cx-5",
    aSlug: "used-hyundai-tucson",
    bSlug: "used-mazda-cx-5",
    segment: "Compact SUVs",
    editorsTake:
      "The CX-5 is the driver's pick with the more premium cabin; the Tucson typically costs less for the same year and comes loaded. Mazda's naturally-aspirated engines have an excellent record, which gives the CX-5 the reliability edge unless the Tucson's engine recalls are documented as addressed.",
    updatedAt: UPDATED_2,
  },
  {
    slug: "subaru-outback-vs-toyota-rav4",
    aSlug: "used-subaru-outback",
    bSlug: "used-toyota-rav4",
    segment: "Crossovers",
    editorsTake:
      "Different shapes for the same buyer: the Outback is the wagon with a lower load floor, better road manners, and standard AWD; the RAV4 is the upright SUV with stronger resale and a better hybrid. Check Subaru oil-consumption years and CVT service; check RAV4 2019–2020 transmission behavior. Both reward records.",
    updatedAt: UPDATED_2,
  },
  {
    slug: "kia-sorento-vs-honda-pilot",
    aSlug: "used-kia-sorento",
    bSlug: "used-honda-pilot",
    segment: "Three-row SUVs",
    editorsTake:
      "The Sorento is the value three-row — smaller, cheaper, often better equipped. The Pilot is the roomier family hauler with the stronger long-haul record, minus some 9-speed transmission grumbles in mid-2010s cars. Need real third-row space, buy the Pilot; occasional third row, the Sorento saves real money.",
    updatedAt: UPDATED_2,
  },
  {
    slug: "ford-explorer-vs-toyota-highlander",
    aSlug: "used-ford-explorer",
    bSlug: "used-toyota-highlander",
    segment: "Three-row SUVs",
    editorsTake:
      "The Highlander is the default recommendation: boring, durable, expensive used because everyone knows it. The Explorer is quicker, tows more, and costs less — with a spottier record (water pump on older V6s, early 2020 launch issues). The Highlander premium is real but so is what it buys.",
    updatedAt: UPDATED_2,
  },
  {
    slug: "lexus-rx-350-vs-toyota-highlander",
    aSlug: "used-lexus-rx-350",
    bSlug: "used-toyota-highlander",
    segment: "Midsize SUVs",
    editorsTake:
      "Mechanically cousins, which is the point: the RX 350 gives you the plusher cabin and quieter ride on the same famously durable bones, while the Highlander adds a usable third row for less money. A used RX is one of the safest luxury buys there is — pick by whether you need seven seats.",
    updatedAt: UPDATED_2,
  },
  {
    slug: "jeep-grand-cherokee-vs-toyota-4runner",
    aSlug: "used-jeep-grand-cherokee",
    bSlug: "used-toyota-4runner",
    segment: "Off-road SUVs",
    editorsTake:
      "The Grand Cherokee is more refined on pavement and cheaper for the year; the 4Runner is cruder, older-feeling, and nearly indestructible — which is why it holds value like nothing else. Buy the Jeep with a thorough records check and a budget for repairs; buy the 4Runner if you want to sell it in five years for most of what you paid.",
    updatedAt: UPDATED_2,
  },
  {
    slug: "toyota-tacoma-vs-ford-f-150",
    aSlug: "used-toyota-tacoma",
    bSlug: "used-ford-f-150",
    segment: "Trucks",
    editorsTake:
      "A midsize versus a full-size, but buyers cross-shop them constantly. The Tacoma holds value absurdly well and is the reliability benchmark; the F-150 gives you far more truck — towing, bed, cab space — for the same money used. Commuting and occasional hauling favors the Tacoma; real truck work favors the F-150, engine chosen carefully.",
    updatedAt: UPDATED_2,
  },
  {
    slug: "tesla-model-3-vs-toyota-prius",
    aSlug: "used-tesla-model-3",
    bSlug: "used-toyota-prius",
    segment: "Efficiency picks",
    editorsTake:
      "Both minimize fuel costs by opposite philosophies. The used Model 3 is quick and cheap to run but carries battery-health uncertainty and steeper depreciation — get a battery report before buying. The Prius is the proven play: modest, hybrid batteries with a 200k-mile track record, and no home charger required. Renters and road-trippers often find the Prius the easier car to own.",
    updatedAt: UPDATED_2,
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
