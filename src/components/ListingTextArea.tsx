type ListingTextAreaProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ListingTextArea({ value, onChange }: ListingTextAreaProps) {
  return (
    <label className="grid gap-2 text-base font-bold text-slate-900">
      Listing text
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={8}
        placeholder="Paste the seller's description, price, mileage, title info, and any notes here."
        className="min-h-52 resize-y rounded-lg border border-slate-300 bg-white p-4 text-base leading-7 text-slate-900 shadow-sm placeholder:text-slate-500"
      />
    </label>
  );
}
