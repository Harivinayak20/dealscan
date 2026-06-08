export type GuideSection = {
  heading: string;
  body: string[];
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  updatedAt: string;
  quickChecks: string[];
  sections: GuideSection[];
};

export const guides: Guide[] = [
  {
    slug: "used-car-red-flags",
    title: "Used car red flags that should slow you down",
    description:
      "A practical checklist for title issues, mileage gaps, seller behavior, price traps, and missing proof before you visit a car.",
    readTime: "7 min read",
    updatedAt: "2026-06-08",
    quickChecks: [
      "No title, salvage title, rebuilt title, flood history, or lien confusion",
      "Price far below similar cars without a clear reason",
      "Seller avoids VIN, history report, service records, or inspection",
      "Mileage does not match wear, photos, or maintenance claims",
    ],
    sections: [
      {
        heading: "Start with ownership and title proof",
        body: [
          "A clean listing should make the basics easy to verify: VIN, title status, mileage, location, seller identity, and whether the name on the title matches the person selling the car. If the seller cannot explain the title clearly, slow down before you schedule a visit.",
          "The highest-risk phrases are no title, bill of sale only, title in mail, bonded title, lien sale, salvage, rebuilt, flood, total loss, odometer exempt, and parts only. Some rebuilt cars can be fine, but the discount needs to be large enough to cover resale risk, insurance friction, and hidden repair quality problems.",
        ],
      },
      {
        heading: "Compare the story to the numbers",
        body: [
          "Price, mileage, model year, ownership history, and condition should tell one coherent story. A very cheap car with perfect photos and no detail is not a bargain yet. It is an unanswered question.",
          "Look for gaps: a seller claims one owner but has no records, says highway miles but the seat and steering wheel look heavily worn, or says clean title while refusing to share the VIN. Dealscan flags these patterns because they change what you should ask before you spend time driving to see the car.",
        ],
      },
      {
        heading: "Treat pressure as a cost",
        body: [
          "Cash only, today only, many buyers waiting, no test drive, no mechanic, and price firm before inspection are all forms of pressure. None of them prove a scam, but they reduce your time to verify the car.",
          "A good seller should be comfortable with basic verification. Ask for the VIN, title status, cold-start video, dashboard photo with mileage, service records, and permission for a pre-purchase inspection. If those requests create friction, price the risk into your offer or move on.",
        ],
      },
    ],
  },
  {
    slug: "price-used-car",
    title: "How to price a used car before messaging the seller",
    description:
      "A simple pricing workflow using mileage, title status, condition, options, market comps, and seller proof.",
    readTime: "8 min read",
    updatedAt: "2026-06-08",
    quickChecks: [
      "Compare the same year, trim, mileage band, and title status",
      "Discount for unclear history, missing records, or expensive maintenance",
      "Separate asking price from a reasonable first offer",
      "Use defects as evidence, not as insults",
    ],
    sections: [
      {
        heading: "Build a narrow comp set",
        body: [
          "A fair price is not the average of every similar make and model. Match the year, trim, mileage band, title status, drivetrain, region, and major options first. A clean-title Camry with 72,000 miles should not be priced from rebuilt-title cars or cars with 160,000 miles.",
          "When the market is thin, widen one variable at a time. Compare nearby model years, then nearby regions, then trim differences. Keep notes on why each comp is better or worse than the target car.",
        ],
      },
      {
        heading: "Adjust for proof and uncertainty",
        body: [
          "Records have value. A car with recent tires, documented oil changes, brake work, clean title, and a seller willing to allow inspection deserves a stronger price than a similar car with no proof.",
          "Uncertainty should reduce your offer. Missing VIN, vague title status, no service records, warning lights, accident ambiguity, or mismatched photos all create verification work. You are not just buying the car; you are accepting the unknowns around it.",
        ],
      },
      {
        heading: "Set three numbers before the visit",
        body: [
          "Write down your fair range, your first offer, and your walk-away number before you meet the seller. The first offer should be tied to evidence: tires, title status, repairs due, missing records, or comparable listings.",
          "The walk-away number matters most. If the seller will not allow inspection or the title story changes in person, your walk-away number should drop immediately. A cheap car can become expensive fast when the first repair exposes a bigger issue.",
        ],
      },
    ],
  },
  {
    slug: "pre-purchase-inspection-checklist",
    title: "Pre-purchase inspection checklist for used cars",
    description:
      "What to check yourself, what to ask the mechanic, and when an inspection should change the offer.",
    readTime: "6 min read",
    updatedAt: "2026-06-08",
    quickChecks: [
      "Cold start, dashboard lights, tire age, fluid leaks, rust, and uneven paint",
      "VIN and title match before money changes hands",
      "Independent mechanic, not only the seller's preferred shop",
      "Written repair estimate before renegotiating",
    ],
    sections: [
      {
        heading: "Check the easy things before paying a shop",
        body: [
          "Before booking an inspection, ask for a cold-start video, dashboard photo with mileage, VIN photo, tire tread photos, and a title-status answer in writing. These checks can save you the cost of inspecting a car that already has obvious problems.",
          "During the visit, look for uneven panel gaps, overspray, mismatched paint, wet carpets, oil leaks, coolant smell, tire date codes, warning lights, and whether the seller lets the engine warm up before you arrive. A warm engine can hide cold-start issues.",
        ],
      },
      {
        heading: "Ask the mechanic for decision-grade findings",
        body: [
          "A useful inspection should separate safety issues, urgent repairs, maintenance due soon, cosmetic issues, and normal wear. Ask for photos and rough repair ranges. A list that only says needs work is hard to use in negotiation.",
          "For higher-risk cars, ask specifically about frame damage, flood evidence, oil leaks, transmission behavior, hybrid battery health, rust, scan-tool codes, and whether emissions readiness monitors are complete.",
        ],
      },
      {
        heading: "Use the report to update the deal, not to win an argument",
        body: [
          "Bring the inspection back to price. If a car needs $1,100 in tires and brakes, a lower offer should reference that estimate. If the seller refuses to adjust on a real repair, decide whether the car is still worth your walk-away number.",
          "Do not ignore a bad inspection because you already spent time on the car. The inspection fee is small compared with a bad title, overheating engine, transmission failure, or hidden flood damage.",
        ],
      },
    ],
  },
  {
    slug: "private-seller-questions",
    title: "Questions to ask a private seller before a test drive",
    description:
      "A message script for checking title, VIN, records, condition, payment, inspection, and meeting safety before you go.",
    readTime: "5 min read",
    updatedAt: "2026-06-08",
    quickChecks: [
      "Ask title status, VIN, mileage, and ownership before negotiating",
      "Confirm inspection and test-drive terms before meeting",
      "Keep payment, title transfer, and meeting location boring",
      "Walk away if answers change in person",
    ],
    sections: [
      {
        heading: "Ask the verification questions first",
        body: [
          "Start with the basics: Is the title clean and in your name? Do you have the VIN? What is the exact mileage? Any accidents, warning lights, leaks, or major repairs? Are service records available?",
          "These questions are not aggressive. They are normal buyer diligence. A seller who answers clearly saves both sides time. A seller who dodges basic proof is giving you useful information too.",
        ],
      },
      {
        heading: "Confirm the visit rules before you drive",
        body: [
          "Ask whether you can test drive the car, bring a mechanic or take it to a nearby shop, and inspect the title before paying. Also confirm where the meeting will happen and who will be present.",
          "For safety, meet in daylight in a public place or police-station exchange zone when possible. Do not bring large cash to a first meeting unless the title and car have already been verified.",
        ],
      },
      {
        heading: "Use a short script",
        body: [
          "A simple message works: I am interested in the car. Before I come see it, can you confirm clean title in your name, VIN, exact mileage, any warning lights or leaks, accident history, and whether a pre-purchase inspection is okay?",
          "If the answer is complete, run the VIN, compare pricing, and schedule the visit. If the answer is vague, ask one follow-up. If it stays vague, move on to another listing.",
        ],
      },
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
