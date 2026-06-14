import type { ScanStatus } from "@/lib/admin-types";
import { statusLabel } from "@/lib/admin-types";

type StatusBadgeProps = {
  status: ScanStatus;
};

const styles: Record<ScanStatus, string> = {
  good_deal: "bg-[rgba(124,169,130,0.16)] text-[#3f4d36] border-[rgba(124,169,130,0.35)]",
  fair_deal: "bg-[rgba(52,119,186,0.16)] text-[#1a3d5c] border-[rgba(52,119,186,0.35)]",
  risky_deal: "bg-[rgba(214,168,79,0.16)] text-[#5d4212] border-[rgba(214,168,79,0.35)]",
  needs_review: "bg-[rgba(196,90,74,0.16)] text-[#61261f] border-[rgba(196,90,74,0.35)]",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-black ${styles[status]}`}>
      {statusLabel(status)}
    </span>
  );
}
