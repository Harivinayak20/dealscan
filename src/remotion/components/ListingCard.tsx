import type { PromoListing } from "../data/listings";
import { colors, fontStack } from "./theme";

type ListingCardProps = {
  listing: PromoListing;
  compact?: boolean;
};

const riskColor = {
  good: colors.green,
  warn: colors.yellow,
  bad: colors.red,
};

export function ListingCard({ listing, compact = false }: ListingCardProps) {
  return (
    <div
      style={{
        border: `2px solid ${colors.line}`,
        borderRadius: 36,
        background: "linear-gradient(145deg, rgba(15,20,31,0.9), rgba(8,12,19,0.78))",
        boxShadow: "0 40px 120px rgba(0,0,0,0.34)",
        padding: compact ? 42 : 58,
        color: colors.text,
        fontFamily: fontStack,
        backdropFilter: "blur(28px)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 40, alignItems: "start" }}>
        <div>
          <div style={{ fontSize: compact ? 52 : 72, fontWeight: 900, letterSpacing: 0 }}>{listing.title}</div>
          <div style={{ color: colors.muted, fontSize: compact ? 30 : 36, marginTop: 12, fontWeight: 650 }}>{listing.trim}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: colors.text, fontSize: compact ? 58 : 82, fontWeight: 900 }}>{listing.price}</div>
          <div style={{ color: riskColor[listing.risk], fontSize: compact ? 28 : 34, marginTop: 10, fontWeight: 800 }}>{listing.verdict}</div>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 18,
          marginTop: compact ? 38 : 56,
        }}
      >
        {[
          ["Mileage", listing.mileage],
          ["Title", listing.titleStatus],
          ["Seller", listing.seller],
          ["Fees", listing.fees],
        ].map(([label, value]) => (
          <div key={label} style={{ border: `1px solid ${colors.line}`, borderRadius: 20, padding: compact ? 22 : 28, background: "rgba(255,255,255,0.045)" }}>
            <div style={{ color: colors.muted, fontSize: compact ? 20 : 24, fontWeight: 750, textTransform: "uppercase" }}>{label}</div>
            <div style={{ color: colors.text, fontSize: compact ? 28 : 34, fontWeight: 850, marginTop: 10 }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
