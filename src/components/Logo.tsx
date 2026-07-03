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
      <span
        aria-hidden="true"
        className="inline-block h-[0.55em] w-[0.55em] rotate-45 rounded-[2px] bg-[var(--racing-green)]"
      />
      <span className="font-display">DealScan</span>
    </Link>
  );
}
