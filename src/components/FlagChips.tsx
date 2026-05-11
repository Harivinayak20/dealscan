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
      ? "border-green-200 bg-green-50 text-green-950"
      : "border-red-200 bg-red-50 text-red-950";

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-black text-slate-950">
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
          <p className="text-base text-slate-600">None found in the provided details.</p>
        )}
      </div>
    </section>
  );
}
