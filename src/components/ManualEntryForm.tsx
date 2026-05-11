import type { ManualDetails } from "@/lib/analyzer-types";

type ManualEntryFormProps = {
  value: ManualDetails;
  onChange: (value: ManualDetails) => void;
};

const fields = [
  { key: "year", label: "Year", placeholder: "2012" },
  { key: "make", label: "Make", placeholder: "Honda" },
  { key: "model", label: "Model", placeholder: "Accord EX-L" },
  { key: "mileage", label: "Mileage", placeholder: "142,000 miles" },
  { key: "price", label: "Asking price", placeholder: "$7,200" },
  { key: "titleStatus", label: "Title status", placeholder: "Clean title" },
] satisfies Array<{ key: keyof ManualDetails; label: string; placeholder: string }>;

export function ManualEntryForm({ value, onChange }: ManualEntryFormProps) {
  function setField(key: keyof ManualDetails, fieldValue: string) {
    onChange({ ...value, [key]: fieldValue });
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.key} className="grid gap-2 text-base font-bold text-slate-900">
            {field.label}
            <input
              value={value[field.key] ?? ""}
              onChange={(event) => setField(field.key, event.target.value)}
              placeholder={field.placeholder}
              className="min-h-12 rounded-lg border border-slate-300 bg-white px-4 text-base text-slate-900 shadow-sm placeholder:text-slate-500"
            />
          </label>
        ))}
      </div>

      <label className="grid gap-2 text-base font-bold text-slate-900">
        Seller notes
        <textarea
          value={value.sellerNotes ?? ""}
          onChange={(event) => setField("sellerNotes", event.target.value)}
          rows={5}
          placeholder="Add condition, maintenance, accident history, seller claims, or anything unclear."
          className="min-h-36 resize-y rounded-lg border border-slate-300 bg-white p-4 text-base leading-7 text-slate-900 shadow-sm placeholder:text-slate-500"
        />
      </label>
    </div>
  );
}
