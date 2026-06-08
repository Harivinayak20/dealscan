export type PromoListing = {
  id: string;
  title: string;
  trim: string;
  price: string;
  market: string;
  mileage: string;
  titleStatus: string;
  seller: string;
  fees: string;
  score: number;
  verdict: string;
  offer: string;
  risk: "good" | "warn" | "bad";
};

export const heroListing: PromoListing = {
  id: "hero",
  title: "2021 Toyota RAV4 XLE",
  trim: "AWD • one owner • clean title",
  price: "$25,900",
  market: "$26,800 market estimate",
  mileage: "41,200 mi",
  titleStatus: "Clean title",
  seller: "Dealer",
  fees: "$899 doc + prep",
  score: 84,
  verdict: "Strong Deal",
  offer: "$24,700 - $25,300",
  risk: "good",
};

export const comparisonListings: PromoListing[] = [
  {
    id: "winner",
    title: "2022 Honda Accord EX",
    trim: "Certified • clean history",
    price: "$24,400",
    market: "$25,600 market",
    mileage: "29,800 mi",
    titleStatus: "Clean title",
    seller: "Dealer",
    fees: "$395 doc",
    score: 91,
    verdict: "Best Match",
    offer: "$23,900 - $24,250",
    risk: "good",
  },
  {
    id: "middle",
    title: "2020 Mazda CX-5 Touring",
    trim: "Private seller • service records",
    price: "$21,700",
    market: "$21,900 market",
    mileage: "55,100 mi",
    titleStatus: "Clean title",
    seller: "Private",
    fees: "No dealer fees",
    score: 78,
    verdict: "Fair Deal",
    offer: "$20,900 - $21,300",
    risk: "warn",
  },
  {
    id: "avoid",
    title: "2019 BMW 330i",
    trim: "Low payment ad • vague history",
    price: "$23,900",
    market: "$20,800 market",
    mileage: "88,400 mi",
    titleStatus: "Reported issue",
    seller: "Dealer",
    fees: "$1,495 fees",
    score: 38,
    verdict: "Avoid",
    offer: "Walk away",
    risk: "bad",
  },
];

export const riskFlags = [
  "High mileage risk",
  "Title issue",
  "Price above market",
  "Suspicious listing language",
  "Repair cost exposure",
  "Dealer fee warning",
];
