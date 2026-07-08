export type GuideSection = {
  heading: string;
  body: string[];
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  quickAnswer: string;
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
    quickAnswer:
      "The biggest used-car red flags are title problems (salvage, rebuilt, missing, or \"title in mail\"), a price far below comparable cars, a seller who avoids sharing the VIN or allowing inspection, and mileage that does not match the car's wear. One of these means verify before you visit; two or more usually means walk away.",
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
          "Look for gaps: a seller claims one owner but has no records, says highway miles but the seat and steering wheel look heavily worn, or says clean title while refusing to share the VIN. DealScan flags these patterns because they change what you should ask before you spend time driving to see the car.",
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
    quickAnswer:
      "To price a used car, build a comp set of the same year, trim, mileage band, and title status, then adjust down for missing records, unclear history, or maintenance that is due. Decide your fair range, first offer, and walk-away number before you message the seller.",
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
    quickAnswer:
      "A pre-purchase inspection at an independent mechanic costs roughly $100 to $250 and checks the frame, fluids, brakes, suspension, and computer codes before you commit. If a seller refuses an inspection, treat it as a serious red flag and lower your offer or walk away.",
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
    quickAnswer:
      "Before a test drive, ask the seller why they are selling, how long they have owned the car, whether the title is clean and in their name, what has been repaired or replaced, and whether a pre-purchase inspection is okay. Honest sellers answer all five easily; friction on any of them is a warning sign.",
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
  {
    slug: "how-to-buy-used-car-first-time",
    title: "How to buy your first used car without getting ripped off",
    description:
      "A step-by-step guide for first-time buyers: budgeting, searching, inspecting, negotiating, and closing the deal with confidence.",
    quickAnswer:
      "First-time buyers avoid the worst outcomes with four habits: verify the title and VIN, compare the price to real comparable listings, get a pre-purchase inspection, and never pay before the paperwork is done. Most bad purchases happen because the buyer was rushed.",
    readTime: "9 min read",
    updatedAt: "2026-06-08",
    quickChecks: [
      "Set a realistic budget including insurance, taxes, and repairs",
      "Search with specific make/model criteria, not just a price cap",
      "Always get a pre-purchase inspection from an independent mechanic",
      "Have the title transferred and verified before handing over money",
    ],
    sections: [
      {
        heading: "Start with the real budget, not the car payment",
        body: [
          "Most first-time buyers focus on the monthly payment and forget insurance, registration, taxes, and the first year of maintenance. A $15,000 car costs closer to $18,500 in year one for a new driver.",
          "Get insurance quotes for the models you are considering before you shop. A Civic costs less to insure than a Mustang, and the difference can be $100 a month. Set your all-in number first, then search within it.",
        ],
      },
      {
        heading: "Search with purpose, not just price",
        body: [
          "Pick two or three models that fit your needs and research their common issues, typical price ranges, and maintenance costs. This lets you spot a bad deal fast because you already know what a good one looks like.",
          "Use DealScan to check every listing you are serious about. Paste the URL or seller notes and get a deal score, red flag check, and price estimate before you message the seller.",
        ],
      },
      {
        heading: "The test drive and inspection are not optional",
        body: [
          "A test drive is not the same as a mechanic inspection. The test drive confirms the car drives, shifts, brakes, and feels right. The inspection finds hidden issues that you cannot feel in a 10-minute drive around the block.",
          "Always pay for a pre-purchase inspection at an independent shop. It costs $100-200 and can save you thousands. If the seller refuses, walk away.",
        ],
      },
    ],
  },
  {
    slug: "used-car-negotiation-tips",
    title: "Used car negotiation tips that actually work",
    description:
      "How to negotiate with private sellers and dealers using evidence, timing, and simple scripts.",
    quickAnswer:
      "Good used-car negotiation is evidence-based: anchor your offer to comparable listings and documented needs like tires, brakes, or missing records, not to feelings. Set a walk-away number before you arrive and be genuinely willing to use it.",
    readTime: "7 min read",
    updatedAt: "2026-06-08",
    quickChecks: [
      "Know your walk-away number before you start talking",
      "Use inspection findings and missing records as leverage",
      "Let the seller name their price first",
      "Be prepared to walk away at any point",
    ],
    sections: [
      {
        heading: "Prepare three numbers before you negotiate",
        body: [
          "Your ideal price, your fair price, and your walk-away number. These should be based on comps, not emotion. If the car needs tires, brakes, or has a check engine light, subtract repair estimates from your offer.",
          "Write them down before you message the seller. Negotiation is harder when you are making up numbers in real time while looking at a car.",
        ],
      },
      {
        heading: "Let evidence lead, not feelings",
        body: [
          "When you make an offer, reference specific things: similar cars listed for less, mechanical issues found during inspection, missing service records, or tire wear. This keeps the discussion factual.",
          "Avoid saying I just love this car or this is my dream car. Enthusiasm is the enemy of a good deal. Stay calm, stay factual, and be ready to walk away to the next listing.",
        ],
      },
      {
        heading: "When to walk away for real",
        body: [
          "If the seller changes the title story, refuses inspection, or the price is firm despite clear issues, walk away. A car that is wrong today will still be wrong tomorrow.",
          "There are always more listings. Walking away from a bad deal is the most powerful negotiation move you have, and it costs nothing.",
        ],
      },
    ],
  },
  {
    slug: "craigslist-car-scams",
    title: "Common Craigslist and Facebook Marketplace car scams to avoid",
    description:
      "How to spot fake listings, title washing, odometer rollback, and seller scams before you lose money.",
    quickAnswer:
      "The most common marketplace car scams are fake escrow services, deposit-before-viewing requests, cloned listings copied from real ads, washed titles, and shipped cars that do not exist. Never send money before seeing the car, the title, and the seller's ID together.",
    readTime: "6 min read",
    updatedAt: "2026-06-08",
    quickChecks: [
      "Price that is too good to be true is usually a scam",
      "Seller who cannot meet in person or show the title is a red flag",
      "VIN that does not match the dashboard or door sticker is fraud",
      "Payment only through gift cards, wire transfer, or escrow sites is a scam",
    ],
    sections: [
      {
        heading: "The too-good-to-be-true price trap",
        body: [
          "A 2019 Toyota Camry with 40,000 miles listed for $8,000 is not a bargain. It is a bait listing. Scammers use unrealistically low prices to get you to engage before you think critically.",
          "If the price is 30% or more below market for no clear reason, run the listing through DealScan first. Check the VIN, request a photo of the title, and insist on meeting in person.",
        ],
      },
      {
        heading: "Title washing and VIN switching",
        body: [
          "Title washing is when a seller hides a salvage or flood title by registering the car in a state with looser disclosure rules. Run the VIN through a history report or Carfax to check.",
          "VIN switching is when the dashboard VIN does not match the door or frame VIN. Always check that all VIN tags match. If they do not, do not buy the car.",
        ],
      },
      {
        heading: "Payment scams to watch for",
        body: [
          "Never pay with gift cards, wire transfers, Zelle, or CashApp for a car you have not seen and titled. Scammers insist on these because they are irreversible.",
          "Cash in person after verifying the title and inspecting the car is the safest method. Bring a friend and meet in a public place during daylight.",
        ],
      },
    ],
  },
  {
    slug: "what-mileage-is-too-high",
    title: "What mileage is too high for a used car?",
    description:
      "How to evaluate mileage by make, model, maintenance history, and how it affects the deal score.",
    quickAnswer:
      "There is no single number that makes mileage too high — a 120,000-mile Toyota with records can be a better buy than a 60,000-mile car with none. Judge mileage against the model's reliability, the maintenance proof, and the price, using roughly 12,000 miles per year as the baseline.",
    readTime: "6 min read",
    updatedAt: "2026-06-08",
    quickChecks: [
      "12,000-15,000 miles per year is average — compare against that",
      "Well-maintained high-mileage cars can be better deals than neglected low-mileage cars",
      "Check timing belt, transmission service, and major maintenance intervals",
      "Diesel and some Japanese engines last longer than average",
    ],
    sections: [
      {
        heading: "Mileage is about maintenance, not just the number",
        body: [
          "A 2012 Honda Accord with 150,000 miles and full service records is often a better buy than a 2014 Accord with 60,000 miles and no records. Maintenance history tells you how the car was treated.",
          "Highway miles are easier on a car than city miles. A car with 150,000 highway miles may have less engine wear than a car with 80,000 city miles. Ask the seller what kind of driving the car was used for.",
        ],
      },
      {
        heading: "Know the weak points for each model",
        body: [
          "Some cars need timing belt replacement every 60,000-100,000 miles ($500-1,000 job). Others have timing chains that last longer. Transmission fluid should be changed every 30,000-60,000 miles for most automatics.",
          "Research the specific model you are looking at. A Subaru Outback may need head gaskets around 100,000 miles. A Toyota Corolla may run smoothly to 250,000 miles with basic maintenance.",
        ],
      },
      {
        heading: "Let the deal score guide you",
        body: [
          "DealScan factors mileage against vehicle age in the deal score. A car with 15,000 miles per year is average. Over 20,000 per year reduces the score. Under 10,000 per year improves it.",
          "But a high score on mileage alone does not mean a good deal if the car has title issues or missing maintenance. Always combine the score with a mechanic inspection.",
        ],
      },
    ],
  },
  {
    slug: "used-car-financing-guide",
    title: "Used car financing guide for private-party purchases",
    description:
      "How to get pre-approved, compare loan rates, and avoid dealer financing traps when buying a used car.",
    quickAnswer:
      "For a private-party purchase, get pre-approved with a bank or credit union before you shop; private-party auto loans exist but carry slightly higher rates than dealer financing. Never finance through the seller, and document everything with a bill of sale.",
    readTime: "7 min read",
    updatedAt: "2026-06-08",
    quickChecks: [
      "Get pre-approved by a credit union or bank before shopping",
      "Compare APR, loan term, and total interest paid, not just monthly payment",
      "Private-party loans work differently than dealer financing",
      "Shorter loan terms cost more per month but less overall",
    ],
    sections: [
      {
        heading: "Get pre-approved before you message a seller",
        body: [
          "Credit unions typically offer the best rates on used car loans. Get pre-approved for a specific amount before you start shopping. This tells you your real budget and shows sellers you are a serious buyer.",
          "Private-party purchases require different loan types than dealer purchases. Some lenders will not finance private-party sales. Check with your credit union or bank first.",
        ],
      },
      {
        heading: "Compare total cost, not just the monthly payment",
        body: [
          "A 72-month loan at 6% costs thousands more in interest than a 48-month loan at 5%, even though the monthly payment is lower. Calculate the total cost of the loan, not just the payment that fits your budget.",
          "Longer loan terms also mean you are more likely to be upside down on the loan (owing more than the car is worth) for most of the loan period.",
        ],
      },
      {
        heading: "Avoid dealer financing traps",
        body: [
          "Dealers may offer 0% or low APR financing, but these often require excellent credit and shorter terms. They may also add markups or push extended warranties that inflate the price.",
          "The safest approach is to arrive with your own financing from a credit union and only consider dealer financing if they can beat your pre-approved rate without adding fees.",
        ],
      },
    ],
  },
  {
    slug: "how-to-check-car-history",
    title: "How to check a used car history before buying",
    description:
      "What a Carfax report covers, what it misses, and how to verify title, accidents, and ownership yourself.",
    quickAnswer:
      "Run the VIN through a paid history report like Carfax or AutoCheck, the free NICB VINCheck for theft and salvage records, and NHTSA.gov for open recalls. A clean report does not guarantee a clean car — unreported accidents are common — so pair it with an inspection.",
    readTime: "5 min read",
    updatedAt: "2026-06-08",
    quickChecks: [
      "Carfax only shows reported accidents, not unreported ones",
      "Check the physical VIN against the dashboard, door, and title",
      "Look for title brands: salvage, flood, rebuilt, lemon law, theft recovery",
      "Service records matter more than accident-free claims",
    ],
    sections: [
      {
        heading: "What a history report actually covers",
        body: [
          "Carfax and AutoCheck pull from insurance claims, state DMV records, service shops, and auctions. They are useful for spotting title issues, odometer rollback, and reported accidents.",
          "But they do not cover everything. Many accidents are never reported to insurance. Small repairs, minor body work, and some flood damage may never appear on a report. A history report is one tool, not the full picture.",
        ],
      },
      {
        heading: "What to check yourself that the report misses",
        body: [
          "Physically check the VIN on the dashboard, driver door jamb, and title. All three should match. Check for rust, unusual paint, overspray, and panel gaps that suggest unreported body work.",
          "Look at the tires: if the car has mismatched tire brands or different wear levels, it may have unreported accident damage. Check the oil cap for milky residue (coolant in oil) and the exhaust for white smoke.",
        ],
      },
      {
        heading: "Use the report as a negotiation tool",
        body: [
          "If the report shows an accident or title issue, get a repair estimate and use it to negotiate. If the report is clean but the car has obvious issues, do not assume the clean report overrides what you can see.",
          "A clean report plus a pre-purchase inspection plus a DealScan analysis gives you as much information as you can reasonably get before buying. Use all three together.",
        ],
      },
    ],
  },
  {
    slug: "best-time-to-buy-used-car",
    title: "When is the best time to buy a used car?",
    description:
      "How month-end, model-year changeovers, tax season, and weather affect used car prices, and when patience pays off.",
    quickAnswer:
      "Used-car deals cluster at the end of the month and quarter, in late fall and winter, and around model-year turnover when trade-ins surge. The biggest factor is still listing age: a car that has been sitting for weeks negotiates far better than a fresh ad.",
    readTime: "6 min read",
    updatedAt: "2026-06-11",
    quickChecks: [
      "End of month, quarter, and year are best at dealerships",
      "Late fall and winter usually have softer private-party prices",
      "Tax refund season pushes prices up in spring",
      "A motivated seller beats a perfect calendar date",
    ],
    sections: [
      {
        heading: "Dealership timing follows sales quotas",
        body: [
          "Dealers chase monthly, quarterly, and annual targets. The last week of the month, and especially the last days of December, are when a salesperson is most willing to move on price to close one more unit.",
          "Model-year changeover, usually late summer to early fall, also helps. When the new year's models arrive, dealers discount the outgoing year's used inventory to clear lot space.",
        ],
      },
      {
        heading: "Private-party timing follows seasons",
        body: [
          "Private sellers do not have quotas, but they respond to demand. Spring and early summer bring tax refunds and more buyers, so prices firm up. Late fall and winter bring fewer buyers, longer listing times, and more room to negotiate.",
          "Convertibles and sports cars are cheapest in winter. Trucks, SUVs, and all-wheel-drive cars are cheapest in summer. Buying against the season is one of the simplest discounts available.",
        ],
      },
      {
        heading: "Seller motivation beats the calendar",
        body: [
          "A listing that has been up for 45 days, a seller who is moving, or someone who already bought their next car will negotiate in any month. Ask how long the car has been for sale and why they are selling.",
          "Run any listing through DealScan first. A fair price in a slow month is still better than an inflated price with a small end-of-month discount.",
        ],
      },
    ],
  },
  {
    slug: "test-drive-checklist",
    title: "Used car test drive checklist: what to look, listen, and feel for",
    description:
      "A step-by-step test drive routine covering cold start, brakes, transmission, steering, electronics, and the questions to ask after.",
    quickAnswer:
      "A complete test drive includes a cold start, highway speeds, hard braking, tight turns in both directions, and every electronic feature in the car. Listen for knocks, feel for pulls and vibrations, watch the gauges, and compare what you find to what the ad claimed.",
    readTime: "7 min read",
    updatedAt: "2026-06-11",
    quickChecks: [
      "Insist on a cold start — a pre-warmed engine can hide problems",
      "Test brakes, steering, and transmission at city and highway speeds",
      "Try every button: windows, AC, infotainment, lights, seats",
      "Drive at least 20 minutes, including a highway stretch",
    ],
    sections: [
      {
        heading: "Before you turn the key",
        body: [
          "Ask the seller not to start the car before you arrive. Touch the hood: if it is warm, the engine was run recently, which can mask rough cold starts, smoke, and lifter noise. Check under the car for fresh drips before and after the drive.",
          "Start the engine yourself with the radio off and the windows down. Listen for ticking, knocking, or belt squeal, and watch the exhaust. Blue smoke suggests oil burning, white smoke can mean coolant, and black smoke means running rich.",
        ],
      },
      {
        heading: "During the drive",
        body: [
          "Brake firmly at least once from moderate speed: the car should stop straight without pulsing or grinding. On a quiet straight road, briefly relax your grip and check whether the car pulls to one side, which can mean alignment issues or accident damage.",
          "Pay attention to shifts. An automatic should shift smoothly without flaring or clunking; a manual clutch should engage in the middle of the pedal travel, not at the very top. Include a highway stretch to check for vibration above 60 mph and confirm cruise control works.",
        ],
      },
      {
        heading: "After the drive",
        body: [
          "Let the car idle and check the dashboard for warning lights again. Pop the hood and look for new leaks, coolant smell, or smoke. Re-check the ground where the car was parked.",
          "A good test drive raises questions instead of settling everything. Write down anything you noticed and bring it to the pre-purchase inspection and the negotiation.",
        ],
      },
    ],
  },
  {
    slug: "buying-from-dealer-vs-private-seller",
    title: "Buying from a dealer vs a private seller: which is right for you?",
    description:
      "Price, paperwork, fees, warranties, and risk compared, so you know what you are trading when you pick where to buy.",
    quickAnswer:
      "Dealers offer recourse, financing, and easier paperwork but charge more; private sellers are cheaper but sell as-is, so the verification is on you. Buy from a dealer if you need financing or certainty, and buy private if you can inspect, verify, and pay carefully.",
    readTime: "7 min read",
    updatedAt: "2026-06-11",
    quickChecks: [
      "Private party is usually cheaper but offers no recourse",
      "Dealer doc fees and add-ons can erase a good sticker price",
      "As-is means as-is, at a dealer or a driveway",
      "Either way, the pre-purchase inspection is your real protection",
    ],
    sections: [
      {
        heading: "What you pay for at a dealer",
        body: [
          "Dealers handle the title transfer, registration, and financing paperwork, and many offer short warranties or certified pre-owned programs. That convenience is built into the price, often $1,500 to $3,000 over a comparable private-party car.",
          "Watch for doc fees, reconditioning fees, and pre-installed add-ons like paint protection or VIN etching. Ask for the out-the-door price in writing and compare that number, not the sticker, against private listings.",
        ],
      },
      {
        heading: "What you save and risk with a private seller",
        body: [
          "Private sellers price closer to actual market value and are often more flexible. You can also learn more: the actual owner can tell you how the car was driven and maintained, while a dealer usually cannot.",
          "The trade-off is recourse. Most private sales are final, and you handle the title transfer yourself. Verify the title is in the seller's name, check for liens, and never hand over money until the signed title is in your hand.",
        ],
      },
      {
        heading: "The decision in practice",
        body: [
          "If you need financing, want a warranty, or are short on time, a dealer makes sense — just negotiate the out-the-door price. If you want the lowest price and can do your own diligence, private party usually wins.",
          "In both cases the same rules apply: run the listing through DealScan, check the VIN, and pay for an independent inspection. Where you buy changes the paperwork, not the diligence.",
        ],
      },
    ],
  },
  {
    slug: "used-ev-buying-guide",
    title: "Buying a used electric car: battery health, range, and red flags",
    description:
      "How to evaluate battery degradation, charging history, warranty transfer, and pricing when buying a used EV.",
    quickAnswer:
      "On a used electric car, battery health decides the deal: check the state-of-health reading, real-world range against the original spec, and whether the battery warranty (typically 8 years or 100,000 miles) transfers to you. A degraded pack can cost more than the car is worth.",
    readTime: "8 min read",
    updatedAt: "2026-06-11",
    quickChecks: [
      "Check battery health and real-world range, not the original spec",
      "Confirm whether the battery warranty transfers and how long is left",
      "Frequent DC fast charging accelerates degradation",
      "Verify the included charging cable and home charging plan",
    ],
    sections: [
      {
        heading: "Battery health is the whole deal",
        body: [
          "An EV's battery is most of its value. Ask for a battery health report: many cars show state of health in a service menu, and shops or apps can pull it from the diagnostic port. A battery at 88% health is normal for a five-year-old EV; 75% deserves a much lower price.",
          "Compare the displayed full-charge range against the original EPA rating. Charge it to 100% before the test drive if possible, and ask the seller how they charged: mostly home charging to 80% is gentle, daily DC fast charging to 100% is not.",
        ],
      },
      {
        heading: "Warranties and recalls matter more on EVs",
        body: [
          "Most EV batteries carry an 8-year, 100,000-mile warranty that usually transfers to the next owner, but the terms vary. Confirm the in-service date, what counts as a failure (often below 70% capacity), and whether this specific car still qualifies.",
          "Run the VIN through the manufacturer's recall lookup. Several popular EVs have had battery recalls; a completed recall with a replaced pack can actually make a used EV a better buy than average.",
        ],
      },
      {
        heading: "Price the car like a battery with seats",
        body: [
          "Used EVs depreciate faster than gas cars, which makes them strong value buys if the battery checks out. Factor in your charging situation: home charging makes ownership cheap, while relying on public fast charging changes the math.",
          "Skip the oil change history questions and ask instead about tires (EVs wear them faster), brake condition (usually excellent thanks to regen), software updates, and whether the original mobile charging cable is included.",
        ],
      },
    ],
  },
  {
    slug: "used-car-paperwork-title-transfer",
    title: "Used car paperwork: how to handle title transfer, bill of sale, and registration",
    description:
      "The exact documents you need when buying from a private seller, how to avoid title problems, and what to do at the DMV.",
    quickAnswer:
      "To transfer a used car you need the signed title with no blank fields, a bill of sale, an odometer disclosure, and registration in your state, in that order. Never hand over the money until the signed title is in your hand.",
    readTime: "6 min read",
    updatedAt: "2026-06-11",
    quickChecks: [
      "The title must be signed by the owner named on it — no exceptions",
      "Check for lienholders before money changes hands",
      "Write a bill of sale even if your state does not require one",
      "Never agree to a jumped or open title",
    ],
    sections: [
      {
        heading: "Verify the title before you pay",
        body: [
          "The seller's ID must match the name on the title. If the title shows a lienholder, ask for a lien release letter or pay off the loan directly with the lender at closing — never trust a promise to mail it later.",
          "An open or jumped title, where the previous buyer never registered the car and is reselling it, is illegal in most states and can leave you unable to register the car. If the seller's name is not on the title, walk away.",
        ],
      },
      {
        heading: "Fill out the transfer correctly",
        body: [
          "Both parties complete the title assignment section: sale date, price, odometer reading, and signatures. Errors and cross-outs can void a title in some states, so write carefully in pen and make no corrections.",
          "Write a simple bill of sale in duplicate with the VIN, year, make, model, mileage, price, date, and both names and signatures. It protects the seller from tickets after the sale and gives you proof of purchase for the DMV.",
        ],
      },
      {
        heading: "After the handshake",
        body: [
          "Most states give you a short window, often 10 to 30 days, to transfer the title and register the car. You will typically need the signed title, bill of sale, proof of insurance, and payment for sales tax and fees.",
          "Arrange insurance before you drive the car home — most insurers can add a car by phone in minutes. Keep copies of everything until the new title arrives in your name.",
        ],
      },
    ],
  },
  {
    slug: "facebook-marketplace-car-buying-safety",
    title: "How to buy a car on Facebook Marketplace without getting scammed",
    description:
      "The scams specific to Facebook Marketplace, how to vet a seller profile, and the safe way to handle messaging, viewing, and payment.",
    quickAnswer:
      "Buy safely on Facebook Marketplace by checking the seller's profile age and activity, insisting on seeing the car, title, and ID together, meeting at a police-station exchange zone, and never paying a deposit to hold a car. Deposits, shipping offers, and off-platform payment links are the three biggest Marketplace scams.",
    readTime: "7 min read",
    updatedAt: "2026-06-12",
    quickChecks: [
      "Seller profile is older than a few months with real activity",
      "No deposit, gift card, crypto, or wire requested before viewing",
      "Car, signed title, and seller ID can be seen together in person",
      "Meet in daylight at a public exchange zone, not a random lot",
    ],
    sections: [
      {
        heading: "Vet the profile before the car",
        body: [
          "Marketplace scammers churn through fresh accounts. Before you ask about the car, open the seller's profile: account age, profile photos, mutual activity, and whether the same car appears in other listings at different prices. A days-old account selling a clean car far below market is the single most common scam setup on the platform.",
          "Reverse-search the listing photos. Cloned listings copy photos and text from a real ad in another city, then invent a reason the price is low. If the same photos show up under a different seller or city, report it and move on.",
        ],
      },
      {
        heading: "The deposit trap and other money scams",
        body: [
          "No legitimate private seller needs money to hold a car for a first viewing. Deposit-to-hold requests, shipping offers from sellers who are suddenly out of state, escrow links, and any payment in gift cards or crypto are all versions of the same scam: getting money before you can verify the car exists.",
          "Facebook's purchase protection does not cover vehicles, so treat every Marketplace transaction as cash-on-inspection. Pay only when you are holding the signed title, and use a cashier's check or bank transfer completed inside the bank for larger amounts.",
        ],
      },
      {
        heading: "Verify the listing the same way for every platform",
        body: [
          "Once the seller passes the profile check, the rest is normal used-car diligence: VIN, history report, mileage versus wear, service records, and a pre-purchase inspection. Marketplace listings cannot be opened by tools that need a login, so copy the ad text or take a screenshot and paste it into DealScan to get the same red-flag scan and deal score as any other listing.",
          "Meet in daylight at a police-station safe exchange zone for the first viewing, bring a friend, and let the seller's reaction to basic verification requests tell you the rest. Friction on the VIN, title, or inspection is your answer.",
        ],
      },
    ],
  },
  {
    slug: "offerup-car-scams",
    title: "OfferUp car scams: what to watch for before you meet a seller",
    description:
      "How OfferUp car scams work, which seller signals matter, and the verification steps that protect you on local classifieds apps.",
    quickAnswer:
      "The most common OfferUp car scams are deposit-to-hold requests, fake shipping through a phony OfferUp partner, VIN report phishing where the seller insists you buy a report from their link, and curbstoners posing as private owners. Verify the seller's name against the title, pay only in person, and run the VIN yourself through sources you chose.",
    readTime: "6 min read",
    updatedAt: "2026-06-12",
    quickChecks: [
      "Seller name matches the name on the title",
      "VIN checked through your own sources, never the seller's link",
      "No shipping, escrow, deposit, or off-app payment",
      "TruYou or verified profile, plus real listing history",
    ],
    sections: [
      {
        heading: "The scams unique to classifieds apps",
        body: [
          "OfferUp does not ship cars and has no vehicle escrow service. Any seller who offers shipping, sends an escrow link, or asks for a deposit because they are out of town is running the same scam playbook: the car either does not exist or is not theirs to sell.",
          "Watch for VIN-report phishing. A scammer insists you buy a history report from a specific site they link, the site collects your card details, and the car was never real. Always run the VIN through a report provider you found yourself.",
        ],
      },
      {
        heading: "Spotting curbstoners",
        body: [
          "Curbstoners are unlicensed flippers who pose as private owners to dump auction cars with hidden problems. The tell is ownership friction: the title is not in their name, they have several cars listed at once, they suggest meeting somewhere that is not their home, and the story about why they are selling is thin.",
          "Ask one simple question early: is the title in your name? If it is not, the discount needs to be large and the verification needs to be airtight, because title-jumping can leave you with a car you cannot register.",
        ],
      },
      {
        heading: "A verification routine that works everywhere",
        body: [
          "The protection is the same routine every time: VIN first, history report from your own source, mileage against wear, records, inspection, and payment only against a signed title. Paste the ad text into DealScan before you message the seller to see the red flags and the questions worth asking.",
          "On meeting day, choose a public exchange zone, verify ID against the title, and walk away from any change in the title story. The car you skip costs you nothing.",
        ],
      },
    ],
  },
  {
    slug: "spot-fake-car-listing",
    title: "How to spot a fake car listing in 60 seconds",
    description:
      "The fast checks that expose cloned ads, phantom cars, and bait listings before you waste time or send money.",
    quickAnswer:
      "Spot a fake car listing by checking three things: a price meaningfully below every comparable car, stock-looking photos that reverse-search to other ads or dealer sites, and a seller who cannot produce the VIN or answers with a sob story and a shipping offer. Real cars have VINs, local sellers, and prices that make sense.",
    readTime: "5 min read",
    updatedAt: "2026-06-12",
    quickChecks: [
      "Price is within range of comparable listings",
      "Photos are original, consistent, and not found elsewhere",
      "Seller produces the VIN without friction",
      "Story, location, and contact details all line up",
    ],
    sections: [
      {
        heading: "The 60-second screen",
        body: [
          "Fake listings are built to be skimmed, so slow down for one minute. Check the price against three comparable cars, reverse-search one photo, and ask for the VIN. A phantom car fails at least two of those three checks almost every time.",
          "Bait pricing has a tell: the discount has no explanation. A real cheap car has a reason in the ad — salvage title, needs work, high miles. A fake cheap car is described as perfect, because the scammer wants maximum replies.",
        ],
      },
      {
        heading: "Read the seller, not just the ad",
        body: [
          "Military deployment, divorce sale, moving overseas this week, selling for a relative: these stories appear constantly in fake ads because they explain both the low price and why you cannot meet. The story itself is not proof of a scam, but a story plus no VIN plus shipping is.",
          "Templated replies are another tell. If the answers do not engage with your specific questions, you are talking to a script. Ask something only a real owner would know, like what the last repair cost or which tire is newest.",
        ],
      },
      {
        heading: "Confirm with tools, then verify in person",
        body: [
          "Run the VIN through NICB VINCheck for theft and salvage, and look up the plate state if shown. Paste the full ad into DealScan to surface red flags, price context, and the missing details worth asking about — a listing that hides the basics usually scores poorly for a reason.",
          "Nothing replaces seeing the car, the title, and the ID together. Until that moment, treat every dollar requested as a scam test you should fail on purpose.",
        ],
      },
    ],
  },
  {
    slug: "salvage-title-cars",
    title: "Salvage title cars: what to know before you buy",
    description:
      "What a salvage title means for insurance, financing, resale value, and how to evaluate whether the discount is worth the risk.",
    quickAnswer:
      "A salvage title means an insurance company declared the car a total loss at some point. Rebuilt salvage cars can be legal and driveable, but they carry higher insurance costs, are harder to finance, lose resale value, and may hide structural damage. The discount needs to be large enough to offset all of those risks — and the car needs a clean rebuild inspection before you buy.",
    readTime: "7 min read",
    updatedAt: "2026-06-21",
    quickChecks: [
      "Get a pre-purchase inspection specifically for rebuilt salvage vehicles",
      "Confirm the rebuilt title is issued, not just a salvage title with repairs",
      "Check insurance quotes before buying — many carriers restrict or exclude coverage",
      "Price at least 20–40% below comparable clean-title cars to offset the risks",
    ],
    sections: [
      {
        heading: "What a salvage title actually means",
        body: [
          "A vehicle receives a salvage title when an insurance company declares it a total loss — meaning repair costs exceeded a set percentage of the car's value (usually 75–100% depending on the state). The car could have been in a collision, flooded, stolen and recovered, or damaged by hail or fire. After a salvage title is issued, the car legally cannot be driven on public roads until it is repaired and passes a state inspection.",
          "Once it passes inspection, the state issues a rebuilt or reconstructed title. This is the document you should see if a seller claims the car is roadworthy. A car listed with a salvage title that has not been through the rebuilt process is not legally registered for road use and should not be priced as a daily driver.",
        ],
      },
      {
        heading: "The real costs of buying a salvage or rebuilt title car",
        body: [
          "Insurance is the first hidden cost. Many major insurers will not write comprehensive or collision coverage on rebuilt salvage vehicles. Those that do charge significantly higher premiums. Before you agree on a price, get an actual insurance quote for that VIN — not a general estimate — because the number can be surprising.",
          "Financing is the second barrier. Most banks and credit unions will not finance a rebuilt title vehicle. If they do, loan terms are less favorable. Cash purchases or specialty lenders are usually the only options, which limits your buyer pool when you eventually try to resell.",
          "Resale value is the third long-term cost. Rebuilt title cars sell for 20–40% less than comparable clean-title cars because buyers and dealers know the same risks you are weighing now. That discount follows the car for its entire life. If you are buying to flip or to drive for two years and sell, the resale hit may outweigh any upfront savings.",
        ],
      },
      {
        heading: "How to evaluate a specific salvage title car",
        body: [
          "Request the full damage history: what caused the total loss, which body panels and structural components were affected, who did the repair work, and whether an independent inspection was completed post-rebuild. A well-documented rebuild with receipts from a reputable shop is a very different risk from a car with unknown repair history and a fresh coat of paint.",
          "Book a pre-purchase inspection from a mechanic who has experience with rebuilt vehicles specifically. They will check for frame damage, misaligned panels, paint overspray inside wheel wells and door jambs, and signs of flood damage like corrosion under carpet and behind dashboards. Run the VIN through a history report to see what the original claim described.",
          "If all of that checks out, price the car at least 20–30% below clean-title comparables, and make sure that discount actually compensates for the insurance premium difference over your ownership period. If the numbers still work, a well-rebuilt car can be a reasonable buy. If the seller is not willing to support a thorough inspection, that is your answer.",
        ],
      },
    ],
  },
  {
    slug: "certified-pre-owned-vs-used",
    title: "Certified pre-owned vs. used car: which is the better deal?",
    description:
      "Side-by-side comparison of CPO programs vs. private-party and independent dealer used cars — warranty coverage, inspection standards, and how to evaluate the price premium.",
    quickAnswer:
      "Certified pre-owned cars come with a manufacturer-backed warranty extension and a multi-point inspection, but they cost more than comparable non-certified used cars. CPO makes the most sense when the factory warranty has expired and the cost of the CPO premium is less than what an extended warranty or repair risk would cost you. Private-party used cars can be better deals, but they require more due diligence on your part.",
    readTime: "8 min read",
    updatedAt: "2026-06-21",
    quickChecks: [
      "Compare CPO price against non-certified private-party comps for the same car",
      "Read the exact CPO warranty terms — coverage varies significantly by brand",
      "Check whether the CPO car still has remaining factory powertrain warranty",
      "Factor in the cost of a third-party extended warranty on a non-certified car",
    ],
    sections: [
      {
        heading: "What certified pre-owned actually means",
        body: [
          "CPO programs are run by automakers, not by the dealer. When a car meets the manufacturer's age and mileage eligibility — typically under 5–6 years old and under 60,000–80,000 miles — a dealer puts it through a multi-point inspection checklist and brings it up to the manufacturer's standard. The manufacturer then backs the car with an extended warranty, often a powertrain warranty of 100,000 miles total and a shorter comprehensive warranty.",
          "The key word is manufacturer-backed. A Toyota CPO warranty is underwritten by Toyota, not the selling dealer. That means you can get warranty work done at any Toyota dealer, and the manufacturer is on the hook if the dealer closes. Dealer-issued 'certified' labels with no manufacturer backing are worth much less — read the paperwork carefully before you assume CPO means factory warranty.",
        ],
      },
      {
        heading: "The CPO price premium: is it worth it?",
        body: [
          "CPO cars typically sell for $1,000 to $3,500 more than identical non-certified used cars. Whether that premium is worth it depends on three things: how much factory warranty is already left on the car, what the CPO warranty actually covers, and how reliable the specific model is.",
          "If the car is three years old and still has two years of factory bumper-to-bumper warranty remaining, the CPO program adds relatively little value in the near term. If the car is five years old with an expired factory warranty and you are buying a model with known expensive failure points, the CPO extension can easily pay for itself on a single repair.",
          "Compare the CPO premium against the cost of a third-party extended warranty on a non-certified equivalent. A solid extended warranty from a reputable provider runs $1,200–$2,500 for similar coverage. If the CPO price premium exceeds that range, a private-party car with a third-party warranty may offer better overall value.",
        ],
      },
      {
        heading: "When private-party used cars beat CPO",
        body: [
          "The best private-party used car deals are on well-maintained, single-owner cars from reliable makes that are slightly outside CPO age or mileage eligibility. A 2017 Toyota Camry with 85,000 miles and full service records may not qualify for CPO, but it also costs thousands less than a certified 2019 model. If you put that price difference into a pre-purchase inspection and a third-party extended warranty, you often come out ahead.",
          "Private sellers also negotiate more freely than dealers. CPO prices at franchised dealerships are typically firm because the certification overhead — inspection cost, reconditioning, warranty pricing — is baked in. Private sellers are selling from personal motivation and often have more flexibility on final price.",
          "The trade-off is research and due diligence. A private-party car requires you to verify service history, order a vehicle history report, and pay for an independent inspection. A CPO car comes with those steps largely completed by the dealer. Budget $150–$300 for a pre-purchase inspection on any private-party car, treat it as required spending, and the savings over CPO pricing usually remain significant.",
        ],
      },
    ],
  },
  {
    slug: "used-car-warranty-guide",
    title: "Used car warranty guide: what coverage you actually have",
    description:
      "How to understand remaining factory warranty, powertrain warranty, extended warranties, and as-is sales before you sign anything.",
    quickAnswer:
      "Most used cars are sold with some combination of remaining factory warranty, a dealer warranty, or no warranty at all. Factory warranties transfer with the car automatically — you do not need to pay extra for them. Extended warranties from dealers are almost always overpriced and negotiable. 'As-is' means no warranty from the seller, but you may still have legal protections under state lemon law or implied warranty of merchantability.",
    readTime: "7 min read",
    updatedAt: "2026-06-21",
    quickChecks: [
      "Look up the original factory warranty terms for the year and make before buying",
      "Check how much factory warranty is left using the VIN and the manufacturer's website",
      "Negotiate the dealer extended warranty price separately and never at signing",
      "Understand your state's implied warranty rules before agreeing to an as-is sale",
    ],
    sections: [
      {
        heading: "Factory warranties: what transfers automatically",
        body: [
          "The original manufacturer's warranty travels with the car, not the owner. If a 2021 Honda Accord came with a 3-year/36,000-mile bumper-to-bumper warranty and 5-year/60,000-mile powertrain warranty, the remaining coverage transfers to you when you buy it used. You do not need to register for it or pay anything extra — present your name, the VIN, and proof of purchase at any authorized dealer and the warranty applies.",
          "Before you buy any used car, look up the specific warranty terms for that year and model on the manufacturer's website, then check how much remains. Honda, Toyota, Hyundai, Kia, and most major manufacturers let you look up warranty status by VIN online. Hyundai and Kia notably offer 10-year/100,000-mile powertrain warranties on new cars, which can translate into significant remaining coverage on a three or four-year-old used vehicle.",
        ],
      },
      {
        heading: "Dealer warranties and extended warranties",
        body: [
          "Franchised dealers often offer their own short-term used car warranties — typically 30 days or 1,000 miles on older inventory. These are dealer-funded, not manufacturer-backed, and coverage varies significantly. Read the contract to understand what is included and excluded before you assume the warranty means anything meaningful.",
          "Extended service contracts — often called extended warranties — are separate financial products sold through dealers and third-party companies. They are almost always profitable for the seller, which means they are usually overpriced at the price initially presented. If you want one, research the provider's reputation independently, compare at least two third-party providers, and negotiate the price the same way you negotiate the car price. Dealers often mark up extended warranties by 50–100% over their own cost.",
          "Good third-party extended warranty providers include Endurance, CARCHEX, and Protect My Car, but read the exclusions carefully. Exclusionary contracts (which list what is not covered) are more comprehensive than inclusionary contracts (which only cover what is listed).",
        ],
      },
      {
        heading: "As-is sales and your legal rights",
        body: [
          "An as-is disclosure means the seller is not offering any warranty on the car. What it does not mean is that you have zero legal protection. Most states impose an implied warranty of merchantability on dealer sales — which means the car must be fit for its basic intended purpose of being driven. A dealer who sells you a car that immediately fails a mechanical system they knew was broken may still be liable in some states.",
          "As-is protections are stronger in private-party sales. Private sellers are generally not held to the same standard as dealers, and buyers have less recourse after the sale. This is why a pre-purchase inspection matters most on as-is vehicles: it is your only reliable way to discover what you are buying before you own the risk.",
          "Keep all written communications with the seller if you buy an as-is vehicle that quickly develops problems. In states like California, New York, and Massachusetts, consumer protection laws sometimes provide remedies even when the contract says as-is. Consulting a consumer protection attorney is inexpensive relative to a major repair bill.",
        ],
      },
    ],
  },
  {
    slug: "dealscan-vs-visor",
    title: "DealScan vs Visor: which car-buying tool do you actually need?",
    description:
      "Visor searches the whole dealer market; DealScan judges the specific listing in front of you. How the two buyer-side tools differ and why many shoppers use both.",
    quickAnswer:
      "Visor (visor.vin) is a car search engine: it aggregates dealer inventory nationwide and adds market context like days-on-lot and price history. DealScan is a deal analyzer: paste any single listing — dealer or private party — and get a 0-100 score, red flags, missing info, and a negotiation plan. Use Visor to find candidates; use DealScan to decide whether the one you found deserves your money.",
    readTime: "6 min read",
    updatedAt: "2026-07-05",
    quickChecks: [
      "Searching the whole market? Visor's aggregation and map are built for that",
      "Judging one specific listing? DealScan scores it and arms your negotiation",
      "Private-party car (Craigslist, FB Marketplace)? Visor doesn't cover those; DealScan scans any listing",
      "Both are buyer-side: neither sells your contact info to dealers as a lead",
    ],
    sections: [
      {
        heading: "Two different jobs in the same purchase",
        body: [
          "A used-car purchase has a search phase and a judgment phase. Search tools — Visor, Autotrader, CarGurus — answer \"what's out there?\". Judgment is a different question: is THIS car, at THIS price, from THIS seller, a deal or a trap? That's the phase where most money is won or lost, and it's the phase DealScan is built for.",
          "Visor earns real credit for its buyer-side stance: listings pulled straight from dealer sites, no sponsored placement, no lead selling. DealScan shares that philosophy and applies it to analysis — nobody can pay to change a score, and you never hand over contact info to see a result.",
        ],
      },
      {
        heading: "What Visor gives you that DealScan doesn't",
        body: [
          "Nationwide dealer inventory in one search, a map view, dynamic filters down to installed factory options, saved searches, and (on the paid Visor Plus tier) sold-listing data and price-history tracking across the whole market. If you're still deciding which car to buy or scanning the country for a specific spec, it's an excellent search engine.",
          "DealScan doesn't aggregate inventory and doesn't try to — search is a solved problem with many good tools. We'd rather be the second opinion you run on whatever any of them surfaces.",
        ],
      },
      {
        heading: "What DealScan gives you that Visor doesn't",
        body: [
          "A verdict. Visor shows you data and leaves the judgment to you; DealScan reads the actual listing text and returns a 0-100 deal score, a fair-price range, red flags (title language, mileage inconsistencies, pressure tactics), what the listing conveniently leaves out, questions to ask the seller, and a suggested opening offer. It also covers the riskiest half of the used market — private-party listings — that dealer-inventory search engines don't index at all.",
          "And it's free without an account: no signup to scan, and the free VIN lookup covers specs, recalls, safety ratings, and MPG from government data.",
        ],
      },
      {
        heading: "The honest recommendation",
        body: [
          "Use both. Find candidates on Visor (or anywhere else), then paste each listing URL into DealScan before you message the seller. Two buyer-side tools, two phases of the purchase, zero lead forms between you and the answer.",
          "If you only bookmark one, let the decision be about where you shop: dealer-only shoppers get more day-to-day value from a search engine, while anyone who touches Craigslist or Facebook Marketplace — where there is no inventory feed and the risk is highest — needs the judgment layer more than the search layer.",
        ],
      },
    ],
  },
  {
    slug: "visor-alternatives",
    title: "Visor.vin alternatives: the buyer-side car tool stack for 2026",
    description:
      "Visor is great at market-wide search, but it's one tool in a bigger buyer-side toolkit. The free alternatives and complements for search, VIN checks, valuation, and deal analysis.",
    quickAnswer:
      "There's no single replacement for Visor because it does one job — market-wide dealer search — very well. The real buyer-side stack in 2026: a search engine (Visor, AutoTempest, CarGurus) to find candidates, a free VIN check (DealScan's /vin, NHTSA.gov) for recalls and specs, a valuation source for price context, and a deal analyzer (DealScan) to score the specific listing and plan the negotiation before you contact anyone.",
    readTime: "7 min read",
    updatedAt: "2026-07-05",
    quickChecks: [
      "Market-wide search: Visor, AutoTempest (aggregates aggregators), CarGurus",
      "Free VIN check: DealScan /vin (specs, recalls, safety, MPG), NHTSA.gov",
      "Price context: DealScan price checker, KBB/Edmunds ranges",
      "Deal judgment: DealScan analyzer — score, red flags, negotiation plan",
    ],
    sections: [
      {
        heading: "Why people look for alternatives at all",
        body: [
          "Visor covers dealer inventory in the US and Canada. The gaps shoppers hit: private-party listings (Craigslist, Facebook Marketplace, OfferUp) aren't there, deeper data like sold prices sits behind the paid Plus tier, and — by design — it presents data rather than judging a specific deal for you.",
          "None of those gaps mean 'switch tools'. They mean the search engine is one layer of a stack, and the layers above it are where a buyer's real questions get answered.",
        ],
      },
      {
        heading: "The four-layer buyer stack",
        body: [
          "Layer 1 — Search: Visor for clean dealer-market search; AutoTempest to sweep multiple sources including some private-party sites; CarGurus for its deal-rating labels (with the caveat that it's a dealer-funded marketplace).",
          "Layer 2 — Identity: run the VIN. DealScan's free VIN lookup pulls factory specs, open recalls, NHTSA crash-test ratings, and EPA fuel economy with no signup; NHTSA.gov is the primary source if you want it raw.",
          "Layer 3 — Price context: a fair-range estimate from DealScan's transparent price checker or the traditional KBB/Edmunds books, so an asking price has something to be measured against.",
          "Layer 4 — Judgment: paste the actual listing into the DealScan analyzer. It scores the deal 0-100, surfaces red flags and missing information, and hands you seller questions and an opening-offer range. This is the layer nothing in the search tier provides.",
        ],
      },
      {
        heading: "What to avoid",
        body: [
          "Paid 'VIN report' sites that charge for data the government publishes free, marketplaces that require your phone number before showing a price (that's a lead form, and you're the product), and any tool promising a definitive value without showing how it got there. A good buyer-side tool shows its work.",
          "The tell is always the same: if a site's business model is selling your attention or contact info to the selling side, its incentives point away from you. Check who pays before you trust the pixels — the about page and the pricing page usually answer it in under a minute.",
        ],
      },
    ],
  },
  {
    slug: "what-does-as-is-mean",
    title: "What does \"as-is\" mean on a used car listing?",
    description:
      "What as-is means for your legal rights after the sale, how it changes your risk as a buyer, and when an as-is listing is still worth considering.",
    quickAnswer:
      '"As-is" on a used car means the seller offers no warranty and will not pay for repairs after the sale. It is the default for most private-party sales and common on cheaper dealer inventory. An as-is listing is not automatically a bad deal, but you must verify the title, mechanical condition, and history before you pay, because after the handshake you own the risk. A pre-purchase inspection is the single most important step on any as-is car.',
    readTime: "5 min read",
    updatedAt: "2026-07-07",
    quickChecks: [
      "As-is means the seller has no obligation to fix anything after the sale",
      "Private-party sales are almost always as-is; that is normal, not a red flag",
      "Dealers who sell as-is may still have state-level legal obligations",
      "A pre-purchase inspection is non-negotiable on any as-is car",
      "The price of an as-is car should reflect the missing warranty",
    ],
    sections: [
      {
        heading: "What as-is means legally",
        body: [
          '"As-is" is a legal disclosure that the vehicle is sold without any warranty, express or implied. Once you pay and take the title, the seller has no obligation to cover repairs, refund your money, or even disclose problems they knew about — unless your state specifically requires disclosure of known defects.',
          "In practice this means every risk transfers to you the moment the deal closes. A transmission failure on the drive home, a check-engine light that was cleared before the test drive, rust hidden under fresh undercoating — if the sale was as-is, those costs are yours. That does not mean every as-is car is broken; it means your verification has to happen before the handshake, not after.",
        ],
      },
      {
        heading: "When as-is is normal and when it is a warning",
        body: [
          "Private-party sales are almost always as-is by default. A person selling their own car is not a dealership; they have no warranty program and no legal obligation to offer one. That is normal, and most private-party guides including DealScan assume an as-is sale. The protection is not a warranty — it is your own diligence: VIN check, history report, pre-purchase inspection, and a careful look at the title.",
          "At a dealership, as-is is more nuanced. Franchised dealers rarely sell as-is because manufacturer CPO programs and state laws push them toward limited warranties. Independent used-car lots are where as-is sales are most common. Many display a buyers guide sticker on the windshield — a window sticker that says as-is — and ask you to sign an as-is acknowledgment. That acknowledgment is real and enforceable in most states, but not all: California, New York, and a few other states impose an implied warranty of merchantability on dealer sales regardless of the as-is label.",
          "A dealer pushing an as-is sale on a car priced close to retail is a bad deal. The price should reflect the missing warranty. If a comparable car at another dealer includes a 30-day warranty for the same price, the as-is car needs to be cheaper. Run both listings through DealScan to see which one actually offers better value.",
        ],
      },
      {
        heading: "How to make an as-is car a safe buy",
        body: [
          "The same verification routine applies whether you are buying from a driveway or a dealer lot. Start with the VIN and a free history check for recalls and specs. Then paste the listing into DealScan: the analyzer flags missing information, pricing deviations, and seller-language patterns that signal risk. A listing that scores poorly because it hides the basics before you even inspect the car is not a deal worth chasing.",
          "Next, pay for a pre-purchase inspection at an independent shop. On an as-is car, the inspection is not optional. You need to know what is broken, what is about to break, and whether the seller was honest about the car's condition. A $150 inspection that finds a $3,000 repair need is the best money you will spend on a used car. If the seller refuses an inspection, that is your answer — and it had nothing to do with the as-is label.",
          "Finally, use the inspection report to negotiate. An as-is car with a clean inspection report and fair pricing is often a better deal than a warranted car with a premium baked in. If the inspection finds issues, subtract repair estimates from your offer. The seller chose as-is, which means they accept that the price reflects the car as it actually sits. Write your offer based on what you found, and be ready to walk away if the gap is too wide.",
          "Run every as-is listing you are considering through DealScan first — it takes seconds, costs nothing, and tells you what questions to ask before you ever schedule a visit.",
        ],
      },
    ],
  },
  {
    slug: "best-free-vin-check",
    title: "Best free VIN check in 2026: what's actually free vs. a paywall funnel",
    description:
      "Most 'free VIN check' sites are lead funnels for paid reports. What a VIN can genuinely tell you for free — specs, recalls, safety ratings, MPG — and where each piece comes from.",
    quickAnswer:
      "A genuinely free VIN check exists because the underlying data is public: NHTSA decodes any VIN into full factory specs, publishes every safety recall, and rates crash tests, while the EPA publishes fuel economy. DealScan's VIN lookup combines all four with no signup. What a free check can NOT give you is title and accident history — that data is privately held (NMVTIS, Carfax, AutoCheck) and always costs money from any legitimate source.",
    readTime: "6 min read",
    updatedAt: "2026-07-05",
    quickChecks: [
      "Free and legitimate: specs, open recalls, crash-test ratings, MPG (government data)",
      "Never free anywhere: title brands, accident history, odometer records (NMVTIS/Carfax)",
      "'Free VIN report' sites that end at a credit-card form are funnels, not tools",
      "Always ask the seller for the VIN before visiting — refusal is itself a red flag",
    ],
    sections: [
      {
        heading: "What the VIN actually encodes",
        body: [
          "The 17-character VIN identifies the exact vehicle as built: year, make, model, trim, engine, transmission, drivetrain, restraint systems, and the plant that assembled it. The government's vPIC database decodes all of it for free — that's the same source behind DealScan's VIN lookup, which adds NHTSA recalls, crash-test star ratings, and EPA fuel economy on one page with no account.",
          "Recalls matter most in a used purchase: recall repairs are free at franchised dealers forever, so an open recall is both a safety item and a pre-purchase to-do you can hand the seller.",
        ],
      },
      {
        heading: "What no free check can give you",
        body: [
          "Title status, accident records, salvage brands, and odometer history live in NMVTIS and in private databases like Carfax and AutoCheck. Every legitimate source of that data charges for it — so a site advertising a 'free VIN history report' either shows you the free government data and calls it history, or funnels you to a paid report at the last step.",
          "The honest workflow: run the free check first (specs, recalls, safety), and pay for ONE history report only on the car you're serious enough to inspect. That sequencing saves both money and disappointment.",
        ],
      },
      {
        heading: "From VIN check to deal check",
        body: [
          "A VIN check tells you what the car is; it can't tell you whether the listing is a good deal. That's the analyzer's job: paste the listing and DealScan scores it, flags risk language, computes a fair-price range, and suggests an opening offer. VIN first, scan second, inspection third — in that order, before any money moves.",
          "The order matters because each step is cheaper than the next: the VIN check is free and instant, the scan is free and takes thirty seconds, and the inspection costs $100-200 — so you only pay for inspections on cars that already passed the first two filters. Buyers who invert the order end up paying mechanics to reject cars a free scan would have killed at their desk.",
        ],
      },
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
