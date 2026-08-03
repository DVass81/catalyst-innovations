import type { CSSProperties } from "react";

/**
 * `view-transition-name` isn't in the stable CSSProperties type yet.
 * Tag two elements on two different pages with the same name (via this
 * helper) and the browser morphs one into the other during navigation —
 * see components/ViewTransitionNav.tsx.
 */
export function viewTransitionStyle(name: string): CSSProperties {
  return { viewTransitionName: name } as CSSProperties;
}
