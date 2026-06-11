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
  {
    slug: "how-to-buy-used-car-first-time",
    title: "How to buy your first used car without getting ripped off",
    description:
      "A step-by-step guide for first-time buyers: budgeting, searching, inspecting, negotiating, and closing the deal with confidence.",
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
          "Use Dealscan to check every listing you are serious about. Paste the URL or seller notes and get a deal score, red flag check, and price estimate before you message the seller.",
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
          "If the price is 30% or more below market for no clear reason, run the listing through Dealscan first. Check the VIN, request a photo of the title, and insist on meeting in person.",
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
          "Dealscan factors mileage against vehicle age in the deal score. A car with 15,000 miles per year is average. Over 20,000 per year reduces the score. Under 10,000 per year improves it.",
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
          "A clean report plus a pre-purchase inspection plus a Dealscan analysis gives you as much information as you can reasonably get before buying. Use all three together.",
        ],
      },
    ],
  },
  {
    slug: "best-time-to-buy-used-car",
    title: "When is the best time to buy a used car?",
    description:
      "How month-end, model-year changeovers, tax season, and weather affect used car prices, and when patience pays off.",
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
          "Run any listing through Dealscan first. A fair price in a slow month is still better than an inflated price with a small end-of-month discount.",
        ],
      },
    ],
  },
  {
    slug: "test-drive-checklist",
    title: "Used car test drive checklist: what to look, listen, and feel for",
    description:
      "A step-by-step test drive routine covering cold start, brakes, transmission, steering, electronics, and the questions to ask after.",
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
          "In both cases the same rules apply: run the listing through Dealscan, check the VIN, and pay for an independent inspection. Where you buy changes the paperwork, not the diligence.",
        ],
      },
    ],
  },
  {
    slug: "used-ev-buying-guide",
    title: "Buying a used electric car: battery health, range, and red flags",
    description:
      "How to evaluate battery degradation, charging history, warranty transfer, and pricing when buying a used EV.",
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
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
