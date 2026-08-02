/**
 * Catalyst Innovations logo treatments.
 *
 * NOTE(founders): This SVG mark is a faithful placeholder recreated from the
 * booth photography (hexagonal "C" in silver + steel blue). Replace the
 * <CatalystMark> paths with the official vector logo when SVG/PNG files are
 * supplied — component APIs will not need to change.
 */

export function CatalystMark({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Outer hexagonal C — silver */}
      <path
        d="M50 4 L88 26 V44 L72 35 V35 L50 22 L28 35 V65 L50 78 L72 65 V65 L88 56 V74 L50 96 L12 74 V26 Z"
        fill="url(#ciSilver)"
      />
      {/* Inner C — steel blue */}
      <path
        d="M50 32 L70 43 L62 48 L50 41 L40 47 V53 L50 59 L62 52 L70 57 L50 68 L32 58 V42 Z"
        fill="url(#ciBlue)"
      />
      <defs>
        <linearGradient id="ciSilver" x1="12" y1="4" x2="88" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E8EEF5" />
          <stop offset="0.5" stopColor="#B9C8DA" />
          <stop offset="1" stopColor="#93A3B8" />
        </linearGradient>
        <linearGradient id="ciBlue" x1="32" y1="32" x2="70" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4A8FD4" />
          <stop offset="1" stopColor="#2F5D8F" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LogoLockup({
  variant = "dark-bg",
  markSize = 34,
}: {
  /** "dark-bg" = light text for dark backgrounds; "light-bg" = navy text */
  variant?: "dark-bg" | "light-bg";
  markSize?: number;
}) {
  const primary = variant === "dark-bg" ? "text-white" : "text-navy-900";
  const secondary = variant === "dark-bg" ? "text-ice-300" : "text-silver-500";
  return (
    <span className="inline-flex items-center gap-2.5">
      <CatalystMark size={markSize} />
      <span className="flex flex-col leading-none">
        <span className={`font-display font-semibold tracking-[0.18em] text-[0.95rem] ${primary}`}>
          CATALYST
        </span>
        <span className={`font-display tracking-[0.42em] text-[0.55rem] mt-1 ${secondary}`}>
          INNOVATIONS
        </span>
      </span>
    </span>
  );
}
