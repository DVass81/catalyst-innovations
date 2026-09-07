"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useStoryMotion } from "./StoryMotion";
const chapters = [
  ["possibility", "The possibility"],
  ["demos", "Your world"],
  ["how-we-build", "The process"],
  ["your-team", "Your team"],
  ["investment", "Your investment"],
];
export default function StoryJourney({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const draw = useMotionValue(0);
  const { paused, reduced, hidden } = useStoryMotion();
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!paused && !reduced && !hidden) draw.set(v);
  });
  useEffect(() => {
    if (reduced) draw.set(1);
    else if (!paused && !hidden) draw.set(scrollYProgress.get());
  }, [draw, hidden, paused, reduced, scrollYProgress]);
  return (
    <div ref={ref} className="story-site">
      <svg
        viewBox="0 0 44 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="story-thread"
      >
        <path
          d="M22 0C22 60 22 70 22 110S40 150 22 180S6 210 22 245S22 360 22 410S40 450 22 480S6 520 22 555S22 720 22 780S40 840 22 870S22 950 22 1000"
          stroke="#6392bd28"
          fill="none"
          strokeWidth="1.5"
        />
        <motion.path
          data-morph="story-thread"
          d="M22 0C22 60 22 70 22 110S40 150 22 180S6 210 22 245S22 360 22 410S40 450 22 480S6 520 22 555S22 720 22 780S40 840 22 870S22 950 22 1000"
          stroke="#599cef"
          fill="none"
          strokeWidth="1.5"
          style={{ pathLength: draw }}
        />
      </svg>
      {children}
    </div>
  );
}
export function StoryNavigation() {
  const [current, setCurrent] = useState("possibility");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setCurrent(entry.target.id);
      },
      { rootMargin: "-18% 0px -65% 0px", threshold: 0 },
    );
    chapters.forEach(([id]) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <nav aria-label="The Catalyst story" className="story-chapters">
      <div className="ci-container">
        {chapters.map(([id, label], i) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={current === id ? "step" : undefined}
          >
            <span>0{i + 1}</span>
            <span>{label}</span>
          </a>
        ))}
        <a className="story-next-chapter" href="#next-chapter">
          Your next chapter ↗
        </a>
      </div>
    </nav>
  );
}
