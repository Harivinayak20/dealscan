import { Inbox } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-neutral-300 bg-white/60 px-6 py-16 text-center">
      <Inbox className="h-12 w-12 text-neutral-400" aria-hidden="true" />
      <div>
        <h3 className="text-lg font-black text-[var(--graphite)]">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-neutral-600">{description}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="rounded-full bg-[var(--graphite)] px-5 py-2.5 text-sm font-black text-white transition hover:bg-[var(--charcoal)]"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
