export type BestListEntry = {
  slug: string; // matches CarModel slug
  reason: string; // 1-2 sentence, grounded in car-models.ts / years-to-avoid.ts
};

export type BestList = {
  slug: string;
  title: string; // H1 / primary keyword phrase
  metaTitle: string; // <=60 chars before " | Dealscan"
  metaDescription: string;
  intro: string;
  entries: BestListEntry[];
  updatedAt: string;
};

const UPDATED = "2026-06-12";

export const bestLists: BestList[] = [
  {
    slug: "best-used-cars-under-10k",
    title: "Best used cars under $10,000",
    metaTitle: "Best Used Cars Under $10,000",
    metaDescription:
      "The most dependable used cars you can still find under $10k, with the exact year-and-engine checks that separate a bargain from a money pit.",
    intro:
      "Under $10,000 you are usually buying older, higher-mileage cars, so the model's worst-case failures matter more than its best years. These picks all have proven drivetrains and well-documented, checkable weak points — buy the one with the thickest service folder, not the shiniest paint.",
    entries: [
      { slug: "used-toyota-corolla", reason: "About as low-risk as used cars get, and this budget buys a well-kept 2009–2013. Check the dipstick on 2009–2010 for oil consumption and confirm any CVT service." },
      { slug: "used-honda-civic", reason: "At this price you skip the 1.5T entirely and buy a simple 2012–2015 — the sweet spot with no turbo and no block issue." },
      { slug: "used-mazda-3", reason: "A Skyactiv 2012+ Mazda3 gives you a conventional 6-speed automatic and no CVT drama; just check the rear arches for rust on salt-state cars." },
      { slug: "used-ford-fusion", reason: "The 2.5L or hybrid Fusion is a genuinely undervalued sedan that shrugs off 200,000 miles. Avoid the 1.5T/1.6T EcoBoost and its coolant-intrusion risk." },
      { slug: "used-toyota-camry", reason: "Older Camrys land in budget easily; a documented 2012–2015 is about as safe as high-mileage sedans get. Watch for ex-rideshare wear." },
      { slug: "used-hyundai-elantra", reason: "The cheapest way into a reliable commuter if you verify the anti-theft software update and cold-start engine health on 2011–2016 cars." },
      { slug: "used-chevrolet-malibu", reason: "Depreciation puts a lot of car in this budget; stick to the 2.5L and confirm maintenance on former fleet examples." },
    ],
    updatedAt: UPDATED,
  },
  {
    slug: "best-used-cars-under-15k",
    title: "Best used cars under $15,000",
    metaTitle: "Best Used Cars Under $15,000",
    metaDescription:
      "The best used cars under $15k for reliability and resale — the models worth paying a small premium for and the exact checks to run first.",
    intro:
      "Fifteen thousand dollars opens up newer, lower-mileage examples of the most dependable nameplates on the road. At this level you can be picky: prioritize documented maintenance and the safer year ranges below over squeezing into the fanciest trim.",
    entries: [
      { slug: "used-toyota-corolla", reason: "This budget buys a 2017–2019 with Toyota Safety Sense standard and the CVT proven — a near-flawless commuter." },
      { slug: "used-honda-civic", reason: "A 2019–2021 Civic with factory oil-dilution updates fits here; the 10th gen's kinks were worked out by then." },
      { slug: "used-honda-accord", reason: "The 2016–2017 four-cylinder hits the reliability sweet spot with refined, proven drivetrains at strong value." },
      { slug: "used-mazda-3", reason: "A 2019+ Mazda3 delivers an upscale cabin on dependable Skyactiv mechanicals — the bargain entry-luxury compact." },
      { slug: "used-toyota-camry", reason: "A 2019+ Camry with the Dynamic Force 2.5 has a strong record and first-year issues sorted." },
      { slug: "used-lexus-rx-350", reason: "Older RX 350s dip into this range; the 3.5 V6 runs past 250,000 miles. Buy the thickest service folder and check for water pump seepage on 2010–2015 cars." },
      { slug: "used-mazda-cx-5", reason: "A 2017+ CX-5 is the sleeper compact SUV pick — no CVT, no major recall — just verify the LED headlights work." },
    ],
    updatedAt: UPDATED,
  },
  {
    slug: "best-used-cars-under-20k",
    title: "Best used cars under $20,000",
    metaTitle: "Best Used Cars Under $20,000",
    metaDescription:
      "Best used cars under $20k: reliable sedans, SUVs and a used EV that hold value, plus the year-specific buyer checks that protect your money.",
    intro:
      "Twenty thousand dollars is enough for late-model versions of the most trusted cars, or a used EV. These are the picks that combine strong reliability records with resale that holds — spend the headroom on a cleaner history, not a bigger badge.",
    entries: [
      { slug: "used-toyota-rav4", reason: "A 2021+ RAV4 fits at the top of this budget; the hybrid is one of the best used SUV buys outright once the 2019–2020 transition years are behind you." },
      { slug: "used-honda-cr-v", reason: "A 2020+ CR-V tamed the earlier 1.5T oil-dilution issue with updates; the hybrid is excellent." },
      { slug: "used-toyota-camry", reason: "A low-mileage 2019+ Camry is a stress-free choice with a proven engine and full safety tech." },
      { slug: "used-tesla-model-3", reason: "Used prices fell hard after the 2023 price wars, so a 2021–2022 Model 3 lands here. Verify battery health with a 100% charge reading and confirm remaining warranty." },
      { slug: "used-mazda-cx-5", reason: "A 2019+ CX-5, including the strong-record 2.5T turbo, offers upscale feel for less than a RAV4." },
      { slug: "used-toyota-highlander", reason: "An older three-row Highlander fits here; the 3.5 V6 clears 250,000 miles. Check oil cooler lines on 2008–2013 cars." },
      { slug: "used-subaru-outback", reason: "A 2017–2019 Outback has the mature CVT and resolved oil issues — a superb all-weather wagon at this price." },
    ],
    updatedAt: UPDATED,
  },
  {
    slug: "best-used-cars-under-25k",
    title: "Best used cars under $25,000",
    metaTitle: "Best Used Cars Under $25,000",
    metaDescription:
      "Best used cars under $25k for families and commuters — near-new reliability picks across SUVs, sedans and trucks, with the checks that matter.",
    intro:
      "At $25,000 you are shopping near-new examples of cars that already have long-term reputations. The buying job shifts from avoiding bad years to confirming the specific car was maintained and not an ex-rental or accident repair.",
    entries: [
      { slug: "used-toyota-rav4", reason: "A recent RAV4 or RAV4 Hybrid with low miles is the default smart-money family SUV; the current generation resolved earlier transmission complaints." },
      { slug: "used-honda-cr-v", reason: "A newer CR-V, especially the hybrid, gives you space and a de-risked drivetrain within this budget." },
      { slug: "used-toyota-highlander", reason: "A 2020+ Highlander has been quiet and dependable — one of the safest three-row buys, hybrids included." },
      { slug: "used-lexus-rx-350", reason: "A 2016–2019 RX 350 puts proven Toyota V6 durability under a luxury badge, with modern safety tech, at a reasonable price." },
      { slug: "used-toyota-4runner", reason: "The nearly indestructible 4Runner holds value so well that $25k buys a clean 2014–2019. Inspect the frame and any lift work." },
      { slug: "used-honda-pilot", reason: "A 2019+ Pilot got the transmission updates and drops the earlier 9-speed complaints; budget the ~$1,000 timing belt service." },
      { slug: "used-subaru-outback", reason: "A 2020+ Outback is the newest platform with only minor quirks (windshields, electronics) to watch." },
    ],
    updatedAt: UPDATED,
  },
  {
    slug: "best-used-cars-under-30k",
    title: "Best used cars under $30,000",
    metaTitle: "Best Used Cars Under $30,000",
    metaDescription:
      "Best used cars under $30k: near-new SUVs, trucks and a used EV with the strongest reliability records, plus what to verify before you buy.",
    intro:
      "Thirty thousand dollars buys the newest, lowest-mileage versions of the most dependable vehicles — often with warranty remaining. Focus on documentation and history reports; at this price the risk is a hidden accident or ex-fleet car, not a bad model year.",
    entries: [
      { slug: "used-toyota-4runner", reason: "A clean, low-mileage 5th-gen 4Runner is the safest body-on-frame SUV bet; year barely matters because the truck hardly changed." },
      { slug: "used-toyota-highlander", reason: "A near-new 2020+ Highlander Hybrid combines three rows, strong resale, and a proven hybrid system." },
      { slug: "used-lexus-rx-350", reason: "A recent RX 350 is arguably the most reliable luxury SUV you can buy used; the checklist is short and the badge premium is earned." },
      { slug: "used-toyota-rav4", reason: "A late-model RAV4 Hybrid with low miles is the smart-money compact SUV, often with factory warranty still active." },
      { slug: "used-ford-f-150", reason: "This budget buys a 2018–2020 F-150 with the reliability-star 2.7 EcoBoost or the simple 5.0 V8; verify oil cadence and no cam phaser rattle." },
      { slug: "used-tesla-model-3", reason: "A newer, higher-trim Model 3 with strong battery health fits here. Confirm degradation under ~10% and remaining battery/drive-unit warranty." },
      { slug: "used-honda-pilot", reason: "A recent Pilot is a roomy, dependable family hauler with the 9-speed issues behind it — check oil level and the timing belt record." },
    ],
    updatedAt: UPDATED,
  },
  {
    slug: "best-used-suvs-under-20k",
    title: "Best used SUVs under $20,000",
    metaTitle: "Best Used SUVs Under $20,000",
    metaDescription:
      "The best used SUVs under $20k for reliability, space and resale — compact and three-row picks with the exact year-specific checks to run.",
    intro:
      "Under $20,000 the used SUV market rewards patience: the same money buys a neglected turbo crossover or a documented, proven one. These picks have the best long-term records in their classes, with clear checkable weak points.",
    entries: [
      { slug: "used-toyota-rav4", reason: "The benchmark compact SUV for reliability and resale; a 2016–2018 or updated 2021+ fits here. The hybrid is the standout." },
      { slug: "used-honda-cr-v", reason: "Roomy and dependable; buy a simple 2012–2014 2.4L or an updated 2020+ and check the oil for a fuel smell on 1.5T years." },
      { slug: "used-mazda-cx-5", reason: "The value pick — a conventional automatic, no CVT, and a better reliability record than most rivals. Verify the pricey LED headlights." },
      { slug: "used-subaru-forester", reason: "A 2017+ Forester has the matured CVT and resolved oil issues; confirm four matched tires for the AWD system." },
      { slug: "used-toyota-highlander", reason: "For three rows, an older Highlander here clears 250,000 miles on the 3.5 V6. Check oil cooler lines on 2008–2013 cars." },
      { slug: "used-subaru-outback", reason: "A 2017–2019 Outback (technically a wagon-SUV) is a superb all-weather hauler with the CVT proven." },
      { slug: "used-ford-explorer", reason: "A documented 2018–2019 Explorer is a value play if the internal water pump was addressed — ask directly and check for milky oil." },
    ],
    updatedAt: UPDATED,
  },
  {
    slug: "best-used-suvs-under-30k",
    title: "Best used SUVs under $30,000",
    metaTitle: "Best Used SUVs Under $30,000",
    metaDescription:
      "Best used SUVs under $30k: near-new family SUVs and a rugged off-roader with top reliability records, plus what to verify before buying.",
    intro:
      "Thirty thousand dollars buys near-new versions of the most trusted SUVs, frequently with warranty left. The job is confirming history and maintenance rather than dodging bad years — spend the headroom on a cleaner car, not a bigger trim.",
    entries: [
      { slug: "used-toyota-4runner", reason: "A low-mileage 5th-gen 4Runner is the go-anywhere reliability king; inspect the frame and any lift work over the odometer." },
      { slug: "used-toyota-highlander", reason: "A near-new 2020+ Highlander or Highlander Hybrid is one of the safest three-row buys with strong resale." },
      { slug: "used-lexus-rx-350", reason: "A recent RX 350 delivers proven Toyota durability under a luxury badge; the service folder is the product — buy the thickest one." },
      { slug: "used-toyota-rav4", reason: "A late-model RAV4 Hybrid with low miles is the smart-money compact SUV, often with factory warranty still in play." },
      { slug: "used-honda-pilot", reason: "A 2019+ Pilot dropped the earlier 9-speed complaints; a roomy, dependable hauler — just budget the timing belt service." },
      { slug: "used-mazda-cx-5", reason: "A near-new CX-5, including the 2.5T turbo, offers upscale feel and a clean reliability record for less than a RAV4." },
      { slug: "used-jeep-grand-cherokee", reason: "A documented 2017–2021 Grand Cherokee on steel springs is a capable, dependable family truck — verify recalls and skip vague-history air-suspension cars." },
    ],
    updatedAt: UPDATED,
  },
  {
    slug: "best-used-trucks-under-30k",
    title: "Best used trucks under $30,000",
    metaTitle: "Best Used Trucks Under $30,000",
    metaDescription:
      "Best used pickup trucks under $30k — the most dependable half-tons and mid-size trucks, with the engine and cold-start checks that matter most.",
    intro:
      "With trucks, the engine and how it was used decide everything. Under $30,000 you can buy a well-documented half-ton or a value-holding mid-size; a cold-start listen and towing history matter far more than the odometer reading.",
    entries: [
      { slug: "used-ford-f-150", reason: "The best all-round pick: a 2018–2020 with the reliability-star 2.7 EcoBoost or the simple 5.0 V8. Listen cold for cam phaser rattle on 3.5 EcoBoosts." },
      { slug: "used-toyota-tacoma", reason: "The mid-size value-holder; $30k buys a clean 2018–2023. Inspect the frame and negotiate hard because asking prices run high." },
      { slug: "used-chevrolet-silverado-1500", reason: "Bought right, a strong half-ton — but AFM/DFM lifter risk dominates. Buy one with the lifter job documented or a perfect cold start." },
      { slug: "used-gmc-sierra-1500", reason: "Mechanically a Silverado twin; a 2020+ with the 10-speed pairing lowered complaint rates. Test at 65–75 mph for the 'Chevy shake'." },
      { slug: "used-ram-1500", reason: "Rides and tows well; a 2017–2018 or 2020+ on steel springs avoids air-suspension bills. Listen cold for the Hemi tick." },
      { slug: "used-chevrolet-tahoe", reason: "For a truck-based SUV, a Tahoe fits here, but the 5.3 lifter risk is real — a cold-start listen and misfire-history check come first." },
    ],
    updatedAt: UPDATED,
  },
  {
    slug: "most-reliable-used-cars",
    title: "Most reliable used cars to buy",
    metaTitle: "Most Reliable Used Cars to Buy",
    metaDescription:
      "The most reliable used cars across sedans, SUVs and trucks — the models that routinely pass 200,000 miles, and the one check each still needs.",
    intro:
      "Reliability is not just the badge — it is matching the right year and engine to a documented maintenance history. These are the models with the strongest long-term records on the market, each paired with the single check that most often separates a great buy from a neglected one.",
    entries: [
      { slug: "used-toyota-corolla", reason: "The reliability benchmark; there is no year that should scare you off. Just avoid overpaying for the badge or a neglected rideshare car." },
      { slug: "used-toyota-camry", reason: "The default safe midsize sedan. Avoid undocumented 2007–2009 oil-burners and buy almost any Camry with confidence." },
      { slug: "used-honda-accord", reason: "Routinely outlasts its loan by a decade; skip undocumented VCM V6s and demand CVT or oil-change records." },
      { slug: "used-toyota-rav4", reason: "Reliable across the board; the hybrid is the smart-money pick. The 2019–2020 years just need a more careful test drive." },
      { slug: "used-lexus-rx-350", reason: "Arguably the most reliable luxury SUV made — the same proven Toyota V6 that runs forever. The RX has no bad years, only neglected owners." },
      { slug: "used-toyota-4runner", reason: "The 5th gen barely changed and the drivetrain is nearly indestructible; frame rust is its only common killer. Buy the cleanest frame you can find." },
      { slug: "used-toyota-highlander", reason: "There is no bad Highlander, only deferred maintenance — check oil lines and the water pump on older V6s and buy on records." },
      { slug: "used-mazda-cx-5", reason: "The sleeper reliable SUV: no CVT, no major recall, better records than most rivals. Headlights and wheel bearings are the only recurring costs." },
    ],
    updatedAt: UPDATED,
  },
];

export function getBestList(slug: string) {
  return bestLists.find((l) => l.slug === slug);
}

// Lists that include a given car model slug — used for internal linking on model pages.
export function listsForModel(modelSlug: string) {
  return bestLists.filter((l) => l.entries.some((e) => e.slug === modelSlug));
}
