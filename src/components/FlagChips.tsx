import { CheckCircle2, OctagonAlert } from "lucide-react";

type FlagChipsProps = {
  title: string;
  flags: string[];
  tone: "red" | "green";
};

export function FlagChips({ title, flags, tone }: FlagChipsProps) {
  const Icon = tone === "green" ? CheckCircle2 : OctagonAlert;
  const classes =
    tone === "green"
      ? "border-[rgba(124,169,130,0.35)] bg-[rgba(124,169,130,0.16)] text-[#123D33]"
      : "border-[rgba(196,90,74,0.35)] bg-[rgba(196,90,74,0.14)] text-[#61261f]";

  return (
    <section className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-[var(--ivory)] p-4 shadow-[0_18px_46px_-36px_rgba(11,13,16,0.55)]">
      <h2 className="flex items-center gap-2 text-lg font-black text-[var(--graphite)]">
        <Icon className="h-5 w-5" aria-hidden="true" />
        {title}
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {flags.length ? (
          flags.map((flag) => (
            <span key={flag} className={`rounded-full border px-3 py-2 text-sm font-bold ${classes}`}>
              {flag}
            </span>
          ))
        ) : (
          <p className="text-base text-neutral-600">None found in the provided details.</p>
        )}
      </div>
    </section>
  );
}
