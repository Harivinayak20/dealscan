import { Search, X } from "lucide-react";

type SearchFilterProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchFilter({ value, onChange, placeholder = "Search..." }: SearchFilterProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" aria-hidden="true" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-10 w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-8 text-sm text-[var(--graphite)] outline-none placeholder:text-neutral-500 focus:border-[var(--champagne)] focus:ring-2 focus:ring-[rgba(201,168,106,0.20)]"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
