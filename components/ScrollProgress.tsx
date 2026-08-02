"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { History, Sparkles } from "lucide-react";

/**
 * Site-wide reading-progress bar, carrying the hero's past-to-future story
 * across the entire page: a marker slides along the bar and crossfades from
 * a "history" glyph to a "spark" glyph as you scroll from top to bottom.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const markerProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 20, mass: 0.5 });
  const markerX = useTransform(markerProgress, (v) => `${v * 100}%`);
  const pastOpacity = useTransform(markerProgress, [0, 0.5], [1, 0]);
  const futureOpacity = useTransform(markerProgress, [0.5, 1], [0, 1]);
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div className="fixed inset-x-0 top-[72px] z-40 h-[3px]">
      <motion.div
        aria-hidden="true"
        style={{ scaleX }}
        className="absolute inset-0 origin-left bg-gradient-to-r from-steel-600 via-steel-400 to-[#7dd3fc]"
      />
      <motion.div
        aria-hidden="true"
        style={{ left: markerX }}
        className="absolute top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-steel-400/60 bg-navy-900 shadow-[0_0_10px_rgba(74,143,212,0.6)]"
      >
        <motion.span style={{ opacity: pastOpacity }} className="absolute">
          <History size={11} className="text-silver-400" />
        </motion.span>
        <motion.span style={{ opacity: futureOpacity }} className="absolute">
          <Sparkles size={11} className="text-[#7dd3fc]" />
        </motion.span>
      </motion.div>
    </div>
  );
}
