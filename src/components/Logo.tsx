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
      className={`logo-3d relative inline-block py-[0.2em] text-[1.5em] font-black leading-none tracking-tight ${className ?? ""}`}
    >
      DealScan
    </Link>
  );
}
