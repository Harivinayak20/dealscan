import { CheckCircle2, CircleAlert, OctagonAlert } from "lucide-react";

type ScoreRingProps = {
  score: number;
};

export function scoreTone(score: number) {
  if (score >= 80) {
    return {
      label: "Good",
      ring: "#7CA982",
      soft: "bg-[rgba(124,169,130,0.16)] text-[#123D33] border-[rgba(124,169,130,0.35)]",
      icon: CheckCircle2,
    };
  }

  if (score >= 60) {
    return {
      label: "Caution",
      ring: "#D6A84F",
      soft: "bg-[rgba(214,168,79,0.16)] text-[#5d4212] border-[rgba(214,168,79,0.35)]",
      icon: CircleAlert,
    };
  }

  return {
    label: "High Risk",
    ring: "#C45A4A",
    soft: "bg-[rgba(196,90,74,0.16)] text-[#61261f] border-[rgba(196,90,74,0.35)]",
    icon: OctagonAlert,
  };
}

export function ScoreRing({ score }: ScoreRingProps) {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const tone = scoreTone(clampedScore);

  return (
    <div
      className="relative grid h-48 w-48 place-items-center rounded-full shadow-[0_26px_70px_-42px_rgba(11,13,16,0.9)]"
      role="img"
      aria-label={`Deal score ${clampedScore} out of 100. Risk label: ${tone.label}.`}
      style={{
        background: `conic-gradient(${tone.ring} ${clampedScore * 3.6}deg, rgba(11,13,16,0.10) 0deg)`,
      }}
    >
      <div className="grid h-36 w-36 place-items-center rounded-full bg-[var(--ivory)] text-center shadow-sm">
        <div>
          <div className="text-5xl font-black tracking-normal">{clampedScore}</div>
          <div className="mt-1 text-base font-bold text-slate-600">out of 100</div>
          <div className="mt-2 text-sm font-extrabold uppercase tracking-normal" style={{ color: tone.ring }}>
            {tone.label}
          </div>
        </div>
      </div>
    </div>
  );
}
