"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/** Thin brand-gradient reading-progress bar under the navbar. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-[72px] z-40 h-[3px] origin-left bg-gradient-to-r from-steel-600 via-steel-400 to-steel-300"
    />
  );
}
