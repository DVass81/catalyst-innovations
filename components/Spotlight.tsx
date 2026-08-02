"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

/**
 * Cursor-reactive light wrapper — ties card hovers site-wide to the same
 * "light follows you" language established in the portal hero's parallax
 * panels. Pure CSS custom properties, no per-frame React state.
 */
export function Spotlight({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--sy", `${((e.clientY - r.top) / r.height) * 100}%`);
  }

  return (
    <div ref={ref} onMouseMove={onMouseMove} className={`group/spot relative ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--sx,50%) var(--sy,50%), rgba(74,143,212,0.14), transparent 70%)",
        }}
      />
      <div className="relative z-[1] flex h-full flex-col">{children}</div>
    </div>
  );
}
