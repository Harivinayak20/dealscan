type ListingTextAreaProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ListingTextArea({ value, onChange }: ListingTextAreaProps) {
  return (
    <label className="grid gap-2 text-base font-bold text-[var(--graphite)]">
      Listing text
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={8}
        placeholder="Paste the seller's description, price, mileage, title info, and any notes here."
        className="min-h-52 resize-y rounded-2xl border border-[rgba(11,13,16,0.12)] bg-white/90 p-4 text-base leading-7 text-[var(--graphite)] shadow-sm placeholder:text-neutral-500 focus:border-[var(--champagne)] focus:outline-none focus:ring-2 focus:ring-[rgba(201,168,106,0.35)]"
      />
    </label>
  );
}
