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
    q: "Is Dealscan free to use?",
    a: "Yes. Everything on Dealscan is completely free — the analyzer, comparisons, guides, and scan history. There are no paid tiers and we do not ask for any payment.",
  },
  {
    q: "What marketplaces does it work with?",
    a: "Link extraction works with public listings from Craigslist, Cars.com, Autotrader, CarGurus, and dealer inventory pages. Facebook Marketplace requires a login, so for those paste the ad text or upload a screenshot — the analysis works the same.",
  },
  {
    q: "Do you store my listings or personal data?",
    a: "Scan history is saved only in your own browser (local storage), never on our servers. Listing text is sent to the analysis engine to be scored and is not used to build a profile of you.",
  },
  {
    q: "Can I use it on mobile?",
    a: "Yes. Dealscan works on any modern phone browser. You can paste a link, paste seller notes, or upload a listing photo.",
  },
  {
    q: "How accurate is the pricing estimate?",
    a: "Pricing estimates are rough calculations based on the listing details and basic market heuristics. They are labeled as estimates and should not replace licensed market data or professional appraisals.",
  },
];
