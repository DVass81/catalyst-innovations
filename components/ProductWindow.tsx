import type { ReactNode } from "react";

/**
 * Reusable browser/app-chrome frame — traffic-light dots, title bar, body.
 * Originally built for the Demo Lab; use anywhere a dashboard, screenshot,
 * or mockup needs the same premium "product window" treatment (Insights
 * articles, future case studies, etc.).
 */
export default function ProductWindow({
  title,
  badge,
  children,
}: {
  title: string;
  /** Optional corner label, e.g. "FICTIONAL DEMO DATA" — omit for real content. */
  badge?: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-card border border-white/12 bg-navy-850 shadow-card-dark">
      <div className="flex items-center gap-2 border-b border-white/10 bg-navy-900 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </span>
        <span className="ml-2 text-xs font-medium text-ice-300">{title}</span>
        {badge && (
          <span className="ml-auto rounded bg-warning/20 px-2 py-0.5 text-[0.6rem] font-bold text-warning">
            {badge}
          </span>
        )}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}
