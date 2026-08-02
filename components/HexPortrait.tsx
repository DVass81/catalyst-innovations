"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Hexagon-clipped portrait. Drop real headshots into /public/founders/
 * (e.g. daniel-vass.jpg, josh-ogle.jpg) and pass `src` — the component
 * renders the photo; without one it renders branded initials.
 *
 * Scrolls into view desaturated/sepia (an old photograph) and resolves to
 * full color — the founders' own decades-of-experience-to-modern-tech story
 * told the same way the homepage hero tells it.
 */
export default function HexPortrait({
  src,
  initials,
  alt,
  size = 220,
}: {
  src?: string | null;
  initials: string;
  alt: string;
  size?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { filter: "grayscale(1) sepia(0.55) contrast(0.92) brightness(0.88)" }}
      whileInView={{ filter: "grayscale(0) sepia(0) contrast(1) brightness(1)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.3, ease: [0.21, 0.6, 0.35, 1] }}
      className="relative bg-gradient-to-br from-steel-400/60 via-ice-300/40 to-navy-700/60 p-[3px] [clip-path:polygon(25%_3%,75%_3%,99%_50%,75%_97%,25%_97%,1%_50%)]"
      style={{ width: size, height: size * 1.05 }}
    >
      <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-navy-800 to-navy-600 [clip-path:polygon(25%_3%,75%_3%,99%_50%,75%_97%,25%_97%,1%_50%)]">
        {src ? (
          <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
        ) : (
          <span
            aria-label={alt}
            className="flex h-full w-full items-center justify-center font-grotesk text-5xl font-semibold text-steel-300"
          >
            {initials}
          </span>
        )}
      </div>
    </motion.div>
  );
}
