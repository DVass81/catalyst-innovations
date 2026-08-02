import Link from "next/link";
import type { ReactNode } from "react";

/* ---------- Buttons ---------- */

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 focus-visible:outline-3 min-h-[44px] px-6 py-2.5 text-[0.95rem]";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  onClick,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost-dark" | "ghost-light";
  className?: string;
  onClick?: () => void;
}) {
  const styles = {
    primary:
      "relative overflow-hidden bg-steel-400 text-white hover:bg-steel-500 active:bg-steel-600 shadow-[0_4px_14px_rgb(74_143_212_/_0.35)] after:absolute after:inset-0 after:-translate-x-[110%] after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent after:transition-transform after:duration-700 hover:after:translate-x-[110%] after:content-['']",
    secondary:
      "bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-700",
    "ghost-dark":
      "border border-white/25 text-white hover:bg-white/10 active:bg-white/15",
    "ghost-light":
      "border border-navy-900/20 text-navy-900 hover:bg-navy-900/5 active:bg-navy-900/10",
  }[variant];
  return (
    <Link href={href} onClick={onClick} className={`${btnBase} ${styles} ${className}`}>
      {children}
    </Link>
  );
}

/* ---------- Section shell ---------- */

export function Section({
  children,
  className = "",
  id,
  dark = false,
  seamTo,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
  /** Hex color of the section that follows — draws a soft wave overlap into
   *  it instead of a hard rectangular break. Rendered inside this section's
   *  own background, so it never needs to guess what's behind it. */
  seamTo?: string;
}) {
  return (
    <section
      id={id}
      className={`relative ${dark ? "bg-navy-900 text-white" : ""} py-16 sm:py-24 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">{children}</div>
      {seamTo && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-10 translate-y-1/2 overflow-hidden sm:h-16">
          <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="h-full w-full">
            <path d="M0 40 C 200 80, 400 0, 600 32 C 800 64, 1000 8, 1200 40 L1200 80 L0 80 Z" fill={seamTo} />
          </svg>
        </div>
      )}
    </section>
  );
}

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p
      className={`font-display text-[0.72rem] font-semibold tracking-[0.28em] uppercase mb-4 ${
        dark ? "text-steel-300" : "text-steel-600"
      }`}
    >
      {children}
    </p>
  );
}

export function Heading({
  children,
  dark = false,
  as: Tag = "h2",
  className = "",
}: {
  children: ReactNode;
  dark?: boolean;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const size =
    Tag === "h1"
      ? "text-4xl sm:text-5xl lg:text-[3.4rem]"
      : Tag === "h2"
        ? "text-3xl sm:text-4xl"
        : "text-xl sm:text-2xl";
  return (
    <Tag
      className={`font-grotesk font-semibold leading-[1.12] tracking-tight ${size} ${
        dark ? "text-white" : "text-navy-900"
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

/** Brand hexagon bullet — replaces generic round dots in lists. */
export function HexDot({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-[7px] inline-block h-2 w-2 shrink-0 bg-steel-400 [clip-path:polygon(25%_5%,75%_5%,98%_50%,75%_95%,25%_95%,2%_50%)] ${className}`}
    />
  );
}

/** Faint hexagon watermark for section corners. */
export function HexWatermark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      fill="none"
    >
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d="M100 10 L178 55 V145 L100 190 L22 145 V55 Z"
          stroke="currentColor"
          strokeWidth="1"
          transform={`scale(${1 - i * 0.28}) translate(${i * 28} ${i * 28})`}
          opacity={0.5 - i * 0.13}
        />
      ))}
    </svg>
  );
}

export function Lead({
  children,
  dark = false,
  className = "",
}: {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`mt-5 text-lg leading-relaxed max-w-2xl ${
        dark ? "text-ice-300" : "text-navy-700"
      } ${className}`}
    >
      {children}
    </p>
  );
}

/* ---------- Status badge (non-color-only: text carries meaning) ---------- */

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "In Development"
      ? "bg-steel-400/15 text-steel-600 border-steel-400/40"
      : status === "Demonstration Platform"
        ? "bg-success/10 text-success border-success/40"
        : status === "Client-Specific"
          ? "bg-navy-900/8 text-navy-700 border-navy-900/25"
          : "bg-warning/10 text-warning border-warning/40";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${tone}`}
    >
      {status}
    </span>
  );
}

/* ---------- Hexagon icon frame (brand geometric motif) ---------- */

export function HexFrame({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`relative inline-flex h-12 w-12 shrink-0 items-center justify-center ${
        dark ? "text-steel-300" : "text-steel-600"
      }`}
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path
          d="M24 2 L43 13 V35 L24 46 L5 35 V13 Z"
          fill={dark ? "rgba(74,143,212,0.12)" : "rgba(74,143,212,0.10)"}
          stroke={dark ? "rgba(111,171,227,0.45)" : "rgba(47,93,143,0.35)"}
          strokeWidth="1.5"
        />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}
