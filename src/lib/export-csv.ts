export function exportToCsv(filename: string, headers: string[], rows: string[][]): void {
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => {
        const escaped = String(cell).replace(/"/g, '""');
        return /[,"\n]/.test(escaped) ? `"${escaped}"` : escaped;
      }).join(","),
    ),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function scansToCsvRows(
  scans: Array<{
    vehicleTitle: string;
    score: number;
    verdict: string;
    status: string;
    confidence: string;
    createdAt: string;
    listingTextSnippet?: string;
  }>,
): string[][] {
  return scans.map((s) => [
    s.vehicleTitle,
    String(s.score),
    s.verdict,
    s.status,
    s.confidence,
    new Date(s.createdAt).toLocaleDateString(),
    (s.listingTextSnippet ?? "").slice(0, 200),
  ]);
}
