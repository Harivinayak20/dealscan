import { CheckCircle2, CircleAlert, OctagonAlert } from "lucide-react";

type ScoreRingProps = {
  score: number;
};

export function scoreTone(score: number) {
  if (score >= 80) {
    return {
      label: "Good",
      ring: "#1f8f4d",
      soft: "bg-green-50 text-green-900 border-green-200",
      icon: CheckCircle2,
    };
  }

  if (score >= 60) {
    return {
      label: "Caution",
      ring: "#d68b00",
      soft: "bg-yellow-50 text-yellow-950 border-yellow-200",
      icon: CircleAlert,
    };
  }

  return {
    label: "High Risk",
    ring: "#c43d32",
    soft: "bg-red-50 text-red-950 border-red-200",
    icon: OctagonAlert,
  };
}

export function ScoreRing({ score }: ScoreRingProps) {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const tone = scoreTone(clampedScore);

  return (
    <div
      className="relative grid h-48 w-48 place-items-center rounded-full"
      role="img"
      aria-label={`Deal score ${clampedScore} out of 100. Risk label: ${tone.label}.`}
      style={{
        background: `conic-gradient(${tone.ring} ${clampedScore * 3.6}deg, #e5e9e2 0deg)`,
      }}
    >
      <div className="grid h-36 w-36 place-items-center rounded-full bg-white text-center shadow-sm">
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
