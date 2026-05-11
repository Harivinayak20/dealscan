import { Gauge } from "lucide-react";
import type { ScoreCategory } from "@/lib/analyzer-types";
import { scoreTone } from "@/components/ScoreRing";

type CategoryCardProps = {
  category: ScoreCategory;
};

export function CategoryCard({ category }: CategoryCardProps) {
  const tone = scoreTone(category.score);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Gauge className="mt-1 h-5 w-5 text-emerald-700" aria-hidden="true" />
          <div>
            <h3 className="text-base font-extrabold text-slate-950">{category.label}</h3>
            <p className="mt-1 text-base leading-7 text-slate-600">{category.note}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full border px-3 py-1 text-sm font-extrabold ${tone.soft}`}>
          {Math.round(category.score)}
        </span>
      </div>
    </article>
  );
}
