import { Download } from "lucide-react";
import { exportToCsv } from "@/lib/export-csv";

type CsvExportButtonProps = {
  data: Array<Record<string, string | number | undefined>>;
  filename?: string;
  headers: string[];
  mapper: (row: Record<string, string | number | undefined>) => string[];
};

export function CsvExportButton({ data, filename = "export", headers, mapper }: CsvExportButtonProps) {
  if (data.length === 0) return null;

  return (
    <button
      onClick={() => exportToCsv(filename, headers, data.map(mapper))}
      className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-bold text-[var(--graphite)] transition hover:-translate-y-0.5 hover:border-[var(--champagne)] hover:shadow-sm"
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      Export CSV
    </button>
  );
}
