import { Circle } from "lucide-react";

type MissingInfoChecklistProps = {
  items: string[];
};

export function MissingInfoChecklist({ items }: MissingInfoChecklistProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">Missing info to verify</h2>
      <ul className="mt-3 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-base leading-7 text-slate-800">
            <Circle className="mt-1 h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
