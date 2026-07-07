import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
};

/**
 * DealScan wordmark: heavy extruded type floating over a soft underglow.
 * Always links home.
 */
export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="DealScan home"
      className={`logo-3d relative inline-flex items-center gap-2 py-[0.2em] text-[1.5em] font-black leading-none tracking-tight ${className ?? ""}`}
    >
      <Image
        src="/dealscan-icon.svg"
        alt=""
        aria-hidden="true"
        width={22}
        height={22}
        className="h-[0.85em] w-[0.85em] shrink-0 rounded-[0.2em]"
      />
      <span className="font-display">DealScan</span>
    </Link>
  );
}
