import Image from "next/image";

const officialLogo = "/brand/catalyst-official.png";

/** A viewport onto the supplied artwork, never a redrawn mark. */
export function CatalystMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 790 986" aria-hidden="true" className={className}>
    <image href={officialLogo} width="3067" height="986" />
  </svg>;
}

export function LogoLockup({ variant = "dark-bg", markSize = 34, hero = false }: {
  variant?: "dark-bg" | "light-bg";
  markSize?: number;
  hero?: boolean;
}) {
  return <span className={`official-logo${variant === "dark-bg" ? " official-logo-panel" : ""}`}>
    <Image src={officialLogo} alt="Catalyst Innovations" width={3067} height={986}
      sizes={hero ? "(max-width: 700px) 86vw, 440px" : "220px"}
      loading={hero ? "eager" : undefined}
      style={{ width: hero ? "100%" : Math.max(190, markSize * 6), height: "auto" }} />
  </span>;
}
