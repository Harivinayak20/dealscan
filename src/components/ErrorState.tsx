import { CircleAlert } from "lucide-react";

type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-[rgba(196,90,74,0.28)] bg-[rgba(196,90,74,0.10)] p-4 text-[var(--danger)]" role="alert">
      <div className="flex items-start gap-3">
        <CircleAlert className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
        <p className="text-base font-bold leading-7">{message}</p>
      </div>
    </div>
  );
}
