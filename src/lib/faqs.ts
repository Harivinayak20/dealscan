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
    a: "Yes, the listing analyzer is completely free. We may introduce premium features later (market data integrations, saved listings, alerts), but the core analysis will remain free.",
  },
  {
    q: "What marketplaces does it work with?",
    a: "It works with public listings from Craigslist, Facebook Marketplace, Cars.com, Autotrader, CarGurus, and dealer inventory pages. Paste the link, seller notes, or a listing photo.",
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
