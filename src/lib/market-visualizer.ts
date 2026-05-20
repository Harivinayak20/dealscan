export type MarketPosition = {
  listingPrice: number;
  marketLow: number;
  marketAvg: number;
  marketHigh: number;
  percentDiff: number;
  label: string;
  color: string;
};

export function calculateMarketPosition(
  listingPrice: number,
  score: number,
  basePrice: number,
): MarketPosition {
  const spread = basePrice * 0.25;
  const marketAvg = basePrice;
  const marketLow = roundToNearest(marketAvg - spread, 50);
  const marketHigh = roundToNearest(marketAvg + spread, 50);

  const scoreOffset = (score - 50) / 50;
  const noise = scoreOffset * spread * 0.3;
  const adjustedAvg = marketAvg - noise;

  const percentDiff = ((listingPrice - adjustedAvg) / adjustedAvg) * 100;

  let color: string;
  let label: string;
  if (percentDiff <= -10) {
    color = "#7ca982";
    label = "Great Price";
  } else if (percentDiff <= -3) {
    color = "#c9a86a";
    label = "Good Price";
  } else if (percentDiff <= 3) {
    color = "#d6a84f";
    label = "Market Price";
  } else if (percentDiff <= 10) {
    color = "#e8914a";
    label = "Above Market";
  } else {
    color = "#c45a4a";
    label = "Overpriced";
  }

  return {
    listingPrice,
    marketLow: Math.min(marketLow, listingPrice - 1000),
    marketAvg: adjustedAvg,
    marketHigh: Math.max(marketHigh, listingPrice + 1000),
    percentDiff: Math.round(percentDiff * 10) / 10,
    label,
    color,
  };
}

function roundToNearest(n: number, nearest: number): number {
  return Math.round(n / nearest) * nearest;
}
