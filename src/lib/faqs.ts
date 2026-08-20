export type Faq = {
  q: string;
  a: string;
};

export const faqs: Faq[] = [
  {
    q: "How does the deal score work?",
    a: "The score checks the price, mileage, title status, condition, seller claims, red flags, good signs, and missing details. It is meant to help you decide what to ask next, not replace a mechanic or vehicle history report.",
  },
  {
    q: "Is DealScan free to use?",
    a: "Yes. The analyzer, comparisons, guides, and scan history are free with no account required. An optional Pro plan adds higher limits and expanded watch alerts, while the core car-buying tools remain free.",
  },
  {
    q: "What marketplaces does it work with?",
    a: "Link extraction works with public listings from Craigslist, Cars.com, Autotrader, CarGurus, and dealer inventory pages. Facebook Marketplace requires a login, so for those paste the ad text or upload a screenshot — the analysis works the same.",
  },
  {
    q: "Do you store my listings or personal data?",
    a: "Your personal scan history is saved in your browser. DealScan also stores limited scan metadata and vehicle details, such as score, verdict, year, make, model, mileage, price, and VIN or a one-way hash of the listing URL, to provide listing memory and aggregate research. We do not store the listing text or raw listing URL, and we do not use scan data to build a profile of you.",
  },
  {
    q: "Can I use it on mobile?",
    a: "Yes. DealScan works on any modern phone browser. You can paste a link, paste seller notes, or upload a listing photo.",
  },
  {
    q: "How accurate is the pricing estimate?",
    a: "Pricing estimates are rough calculations based on the listing details and basic market heuristics. They are labeled as estimates and should not replace licensed market data or professional appraisals.",
  },
  {
    q: "How is DealScan different from Carfax?",
    a: "Carfax provides official vehicle history — accidents, title transfers, and odometer records — using the VIN. DealScan analyzes the listing itself: price fairness, red flag language, missing information, and seller transparency. They are complementary. Use DealScan first to decide if a listing is worth your time, then run a Carfax or AutoCheck report on the VIN before you commit.",
  },
  {
    q: "Can I use DealScan on dealer listings?",
    a: "Yes. Paste the dealer page URL or the listing details and the analyzer works the same way. Dealer listings get scored on price, condition claims, and any red flag language. The score does not change based on whether the seller is a dealer or a private party.",
  },
  {
    q: "What does the deal score actually mean?",
    a: "The score runs from 0 to 100 and maps to four verdicts: 80 and above is Great Deal, 60–79 is Decent Deal, 40–59 is Proceed with Caution, and below 40 is Avoid. A high score means the listing checks out on price, title, mileage, and seller transparency. A low score means one or more of those factors is off and deserves a straight answer before you visit.",
  },
  {
    q: "How do I know if a used car price is fair?",
    a: "A fair price matches comparable cars of the same year, trim, mileage band, and title status in the same region. DealScan estimates a market range from the listing details and flags prices that are significantly high or low. A price far below market usually signals a title problem, a known mechanical issue, or a listing that will not survive verification.",
  },
  {
    q: "What should I check before buying a used car from a private seller?",
    a: "The five things to verify before a private-party purchase: title status and that the name on the title matches the seller's ID, a vehicle history report on the VIN, a cold-start and test drive, a pre-purchase inspection from an independent mechanic, and insurance quotes before you agree on a price. DealScan surfaces which of these the listing has already addressed and which are missing.",
  },
  {
    q: "Does DealScan work with VIN numbers?",
    a: "Yes. If you enter a VIN in the listing details or include it in the pasted text, DealScan uses it to extract the year, make, model, and trim automatically. For a full vehicle history — accidents, title events, odometer records — you will need a dedicated VIN report from Carfax or AutoCheck, which DealScan links to after each scan.",
  },
];
