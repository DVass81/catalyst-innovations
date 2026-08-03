"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Hand-rolled nprogress-style bar for the App Router (which has no built-in
 * navigation-start/end events). Starts on internal link clicks, completes
 * when the pathname actually changes, styled with the same steel gradient
 * as the reading-progress bar.
 */
export default function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevKey = useRef(`${pathname}?${searchParams.toString()}`);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || target === "_blank") return;

      setVisible(true);
      setProgress(15);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setProgress((p) => (p < 82 ? p + (82 - p) * 0.12 : p));
      }, 120);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const key = `${pathname}?${searchParams.toString()}`;
    if (key === prevKey.current) return;
    prevKey.current = key;
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(100);
    const hide = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 260);
    return () => clearTimeout(hide);
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[200] h-[3px] bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-steel-600 via-steel-400 to-[#7dd3fc] shadow-[0_0_8px_rgba(74,143,212,0.6)] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
