import { interpolate, useCurrentFrame } from "remotion";
import { comparisonListings } from "../data/listings";
import { clamp, enter } from "./animation";
import { ListingCard } from "./ListingCard";
import { colors, fontStack } from "./theme";

type ComparisonGridProps = {
  start?: number;
};

export function ComparisonGrid({ start = 0 }: ComparisonGridProps) {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr 1fr", gap: 34, alignItems: "stretch" }}>
      {comparisonListings.map((listing, index) => {
        const progress = enter(frame, start + index * 10, 28);
        const lift = listing.id === "winner" ? interpolate(enter(frame, start + 54, 34), [0, 1], [0, -80], clamp) : 0;
        return (
          <div
            key={listing.id}
            style={{
              position: "relative",
              opacity: progress,
              transform: `translateY(${(1 - progress) * 110 + lift}px) scale(${listing.id === "winner" ? 1.04 : 0.94})`,
            }}
          >
            {listing.id === "winner" ? (
              <div
                style={{
                  position: "absolute",
                  zIndex: 2,
                  right: 42,
                  top: -42,
                  borderRadius: 999,
                  background: colors.green,
                  color: "#06100c",
                  padding: "18px 30px",
                  fontFamily: fontStack,
                  fontSize: 28,
                  fontWeight: 950,
                  boxShadow: "0 0 44px rgba(54,227,154,0.45)",
                }}
              >
                WINNER
              </div>
            ) : null}
            <ListingCard listing={listing} compact />
          </div>
        );
      })}
    </div>
  );
}
