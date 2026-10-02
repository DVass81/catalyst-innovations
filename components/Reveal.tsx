"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Enhance visible server-rendered content; scripts never determine readability. */
function useReveal({ y, delay, once, stagger }: { y: number; delay: number; once: boolean; stagger?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined" || !element.animate) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const animations: Animation[] = [];
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (once) observer.unobserve(entry.target);
        if (preference.matches) continue;
        const targets = stagger === undefined
          ? [element]
          : Array.from(element.querySelectorAll<HTMLElement>("[data-reveal-item]"));
        targets.forEach((target, index) => {
          animations.push(target.animate(
            [{ opacity: 0.75, transform: `translateY(${y}px)` }, { opacity: 1, transform: "none" }],
            { duration: 550, delay: (delay + index * (stagger ?? 0)) * 1000, easing: "cubic-bezier(.21,.6,.35,1)" },
          ));
        });
      }
    }, { threshold: 0.1 });
    const stop = () => {
      if (preference.matches) animations.forEach((animation) => animation.cancel());
    };
    observer.observe(element);
    preference.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", stop);
      animations.forEach((animation) => animation.cancel());
    };
  }, [y, delay, once, stagger]);
  return ref;
}

/** Scroll-triggered reveal with reduced-motion fallback. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useReveal({ y, delay, once });
  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
}

/** Staggered children reveal. */
export function RevealGroup({
  children,
  className = "",
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useReveal({ y: 24, delay: 0, once: true, stagger });
  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
}

export function RevealItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={className} data-reveal-item>
      {children}
    </div>
  );
}
