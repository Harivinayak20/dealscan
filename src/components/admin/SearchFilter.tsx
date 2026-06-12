import { Search, X } from "lucide-react";

type SearchFilterProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchFilter({ value, onChange, placeholder = "Search..." }: SearchFilterProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" aria-hidden="true" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-10 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--paper)] pl-9 pr-8 text-sm text-[var(--graphite)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--champagne)] focus:ring-2 focus:ring-[rgba(201,168,106,0.20)]"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[var(--text-muted)] hover:bg-neutral-100 hover:text-[var(--text-body)]"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
