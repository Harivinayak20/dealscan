import type { PromoListing } from "./listings";

/** Sketchy listing for "Is This a Scam?" UGC videos */
export const scamListing: PromoListing = {
  id: "scam",
  title: "2018 Mercedes C300",
  trim: "Low miles • priced to sell fast",
  price: "$14,500",
  market: "$22,400 market",
  mileage: "38,000 mi",
  titleStatus: "Title in hand soon",
  seller: "Private",
  fees: "Cash only",
  score: 22,
  verdict: "Avoid",
  offer: "Walk away",
  risk: "bad",
};

export const scamFlags = [
  "Price 35% below market",
  '"Title in hand soon" — likely not in seller\'s name',
  "Cash only — no paper trail",
  '"Priced to sell fast" — urgency pressure',
  "No VIN provided",
  "No service history mentioned",
];

/** Good deal for "Deal Score Reveal" UGC */
export const goodDealListing: PromoListing = {
  id: "good-deal",
  title: "2020 Honda Civic EX",
  trim: "1 owner • dealer maintained",
  price: "$18,200",
  market: "$19,100 market",
  mileage: "44,300 mi",
  titleStatus: "Clean title",
  seller: "Private",
  fees: "None",
  score: 88,
  verdict: "Great Deal",
  offer: "$17,400 - $17,900",
  risk: "good",
};

export const goodDealFlags = [
  "Price below market estimate",
  "Clean title confirmed",
  "Single owner vehicle",
  "Dealer service records available",
  "Reasonable mileage for year",
];

/** Overpriced listing for "Red Flag Check" UGC */
export const overpricedListing: PromoListing = {
  id: "overpriced",
  title: "2017 Nissan Altima SV",
  trim: "Runs great • new tires",
  price: "$16,800",
  market: "$11,200 market",
  mileage: "112,000 mi",
  titleStatus: "Rebuilt title",
  seller: "Dealer",
  fees: "$1,895 reconditioning",
  score: 29,
  verdict: "Avoid",
  offer: "$8,500 - $9,200",
  risk: "bad",
};

export const overpricedFlags = [
  "Rebuilt title — was totaled",
  "Price 50% above market",
  "$1,895 hidden dealer fees",
  "112K miles on a 2017",
  '"Runs great" with no proof',
];
