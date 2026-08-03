"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Enables the browser's native View Transitions API for internal
 * navigation. Where two pages tag matching elements with the same
 * `viewTransitionName` (e.g. a solution's icon on the listing card and on
 * its detail-page hero), the browser morphs that element in place instead
 * of a hard cut; everything else gets a soft crossfade for free.
 *
 * Pure enhancement layer: feature-detected, defensively wrapped, and falls
 * straight back to a normal `router.push` (or the browser's own navigation)
 * on any unsupported browser or unexpected error — clicking a link always
 * works, animated or not.
 */
// Not yet in the stable DOM lib types across all supported TS versions —
// declared locally instead of relying on a brittle @ts-expect-error.
type DocumentWithViewTransitions = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => unknown;
};

export default function ViewTransitionNav() {
  const router = useRouter();

  useEffect(() => {
    const doc = document as DocumentWithViewTransitions;
    if (typeof doc.startViewTransition !== "function") return;

    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || target === "_blank") return;

      e.preventDefault();
      try {
        doc.startViewTransition!(() => {
          return new Promise<void>((resolve) => {
            router.push(href);
            // Give Next a couple of paint cycles to flush the new route's
            // DOM before the transition captures its "after" snapshot.
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
          });
        });
      } catch {
        router.push(href);
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  return null;
}
