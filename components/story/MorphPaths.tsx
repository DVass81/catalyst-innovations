"use client";
import { motion, useTransform, type MotionValue } from "framer-motion";
import type { ComponentProps } from "react";
// Matching cubic segments preserve each outline's identity throughout a true morph.
export function panel(x: number, y: number, w: number, h: number, r = 12) {
  return `M ${x + r} ${y} C ${x + r} ${y} ${x + w - r} ${y} ${x + w - r} ${y} C ${x + w} ${y} ${x + w} ${y} ${x + w} ${y + r} C ${x + w} ${y + r} ${x + w} ${y + h - r} ${x + w} ${y + h - r} C ${x + w} ${y + h} ${x + w} ${y + h} ${x + w - r} ${y + h} C ${x + w - r} ${y + h} ${x + r} ${y + h} ${x + r} ${y + h} C ${x} ${y + h} ${x} ${y + h} ${x} ${y + h - r} C ${x} ${y + h - r} ${x} ${y + r} ${x} ${y + r} C ${x} ${y} ${x} ${y} ${x + r} ${y} Z`;
}
export function contour(points: number[][], tension = 0.12) {
  const n = points.length;
  return (
    `M ${points[0].join(" ")} ` +
    points
      .map((p, i) => {
        const prev = points[(i + n - 1) % n],
          next = points[(i + 1) % n],
          after = points[(i + 2) % n];
        return `C ${p[0] + (next[0] - prev[0]) * tension} ${p[1] + (next[1] - prev[1]) * tension} ${next[0] - (after[0] - p[0]) * tension} ${next[1] - (after[1] - p[1]) * tension} ${next.join(" ")}`;
      })
      .join(" ") +
    " Z"
  );
}
type Props = Omit<ComponentProps<typeof motion.path>, "d"> & {
  progress: MotionValue<number>;
  shapes: string[];
  stops?: number[];
};
export function MorphPath({ progress, shapes, stops, ...props }: Props) {
  const d = useTransform(
    progress,
    stops || shapes.map((_, i) => i / (shapes.length - 1)),
    shapes,
  );
  return <motion.path {...props} d={d} />;
}
