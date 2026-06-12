import { Circle } from "lucide-react";

type MissingInfoChecklistProps = {
  items: string[];
};

export function MissingInfoChecklist({ items }: MissingInfoChecklistProps) {
  return (
    <section className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-[var(--ivory)] p-4 shadow-[0_18px_46px_-36px_rgba(11,13,16,0.55)]">
      <h2 className="text-lg font-black text-[var(--graphite)]">Missing info to verify</h2>
      <ul className="mt-3 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-base leading-7 text-[var(--text-body)]">
            <Circle className="mt-1 h-5 w-5 shrink-0 text-[var(--champagne)]" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
