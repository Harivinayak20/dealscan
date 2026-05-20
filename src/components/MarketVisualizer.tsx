"use client";

import { useState } from "react";
import { LineChart, ChevronRight } from "lucide-react";
import { calculateMarketPosition } from "@/lib/market-visualizer";
import { formatCurrency } from "@/lib/financing-calculator";

export function MarketVisualizer({
  price,
  score,
  make,
  model,
  year,
}: {
  price: number | null;
  score: number;
  make: string | null;
  model: string | null;
  year: string | null;
}) {
  const [open, setOpen] = useState(true);
  if (!price) return null;

  const BASE_MAKE_INDEX: Record<string, number> = {
    Toyota: 28000, Honda: 26000, Mazda: 25000, Subaru: 29000,
    BMW: 45000, Mercedes: 48000, Audi: 42000, Lexus: 40000,
    Ford: 32000, Chevrolet: 31000, Dodge: 33000, Jeep: 30000,
    Nissan: 27000, Hyundai: 25000, Kia: 25000, Volkswagen: 28000,
    Tesla: 50000, Porsche: 70000,
  };
  const baseGuess = make ? BASE_MAKE_INDEX[make] ?? 30000 : 30000;
  const yearOffset = year ? (new Date().getFullYear() - Number(year)) * 1500 : 7500;
  const basePrice = Math.max(5000, baseGuess - yearOffset);

  const market = calculateMarketPosition(price, score, basePrice);

  const chartWidth = 600;
  const chartHeight = 200;
  const padding = { left: 70, right: 70, top: 30, bottom: 40 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  const dataRange = market.marketHigh - market.marketLow;
  const toX = (v: number) => padding.left + ((v - market.marketLow) / dataRange) * plotWidth;
  const listingX = toX(market.listingPrice);
  const avgX = toX(market.marketAvg);

  const bars = [
    { label: "Low", value: market.marketLow, x: toX(market.marketLow), color: "#7ca982" },
    { label: "Market Avg", value: market.marketAvg, x: avgX, color: "#c9a86a" },
    { label: "High", value: market.marketHigh, x: toX(market.marketHigh), color: "#c45a4a" },
  ];

  return (
    <details open={open} className="card-elevated group">
      <summary
        onClick={(e) => { e.preventDefault(); setOpen(!open); }}
        className="flex cursor-pointer items-center gap-3 px-5 py-4 text-lg font-black text-[var(--graphite)] transition hover:text-[var(--racing-green)]"
      >
        <LineChart className="h-5 w-5 text-[var(--champagne)]" aria-hidden="true" />
        Market Position
        <ChevronRight className={`ml-auto h-5 w-5 transition ${open ? "rotate-90" : ""}`} aria-hidden="true" />
      </summary>
      <div className="border-t border-[rgba(11,13,16,0.10)] px-5 py-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2 rounded-xl bg-[rgba(201,168,106,0.10)] px-4 py-2">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-neutral-500">Listing</span>
            <span className="text-lg font-black text-[var(--graphite)]">{formatCurrency(market.listingPrice)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-neutral-500">Position</span>
            <span className="rounded-full px-3 py-1 text-sm font-black" style={{ backgroundColor: `${market.color}20`, color: market.color }}>
              {market.label}
            </span>
          </div>
          <div className="text-xs text-neutral-500">
            {market.percentDiff > 0 ? "+" : ""}{market.percentDiff}% vs market average
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full max-w-[600px]" aria-label="Market price position chart">
            <defs>
              <linearGradient id="marketGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7ca982" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#c9a86a" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#c45a4a" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            <rect
              x={padding.left}
              y={padding.top + 10}
              width={plotWidth}
              height={plotHeight - 20}
              fill="url(#marketGradient)"
              rx={8}
            />

            {bars.map((b) => (
              <g key={b.label}>
                <line
                  x1={b.x} y1={padding.top + 10}
                  x2={b.x} y2={padding.top + plotHeight - 20}
                  stroke={b.color}
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  opacity={0.6}
                />
                <text
                  x={b.x} y={chartHeight - 8}
                  textAnchor="middle"
                  fill={b.color}
                  fontSize={11}
                  fontWeight={800}
                >
                  {b.label}
                </text>
              </g>
            ))}

            <circle cx={listingX} cy={padding.top + plotHeight / 2} r={10} fill="white" stroke={market.color} strokeWidth={3} />
            <circle cx={listingX} cy={padding.top + plotHeight / 2} r={4} fill={market.color} />

            <rect
              x={Math.min(listingX, listingX - 40)}
              y={padding.top - 5}
              width={80}
              height={22}
              rx={6}
              fill={market.color}
            />
            <text
              x={listingX}
              y={padding.top + 9}
              textAnchor="middle"
              fill="white"
              fontSize={11}
              fontWeight={900}
            >
              Your Deal
            </text>
          </svg>
        </div>

        <p className="mt-3 text-xs leading-5 text-neutral-500">
          Position based on {make || "similar"} {model || "vehicles"} ({year || "recent"} model year) in the current market.
        </p>
      </div>
    </details>
  );
}
