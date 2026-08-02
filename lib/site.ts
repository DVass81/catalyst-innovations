/**
 * Central site configuration.
 * TODO(founders): replace placeholder values before launch — see README
 * "Content-replacement checklist".
 */
export const site = {
  name: "Catalyst Innovations",
  motto: "Make more. Save time. Work smarter.",
  positioning:
    "Catalyst Innovations builds intelligent systems that help businesses increase profitability, eliminate inefficient work, and operate with greater clarity and control.",
  // Set NEXT_PUBLIC_SITE_URL in production (e.g. https://catalystinnovations.com)
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  // Contact placeholders — configure via env, never hardcoded personal info.
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",
  /** Calendly/SavvyCal/etc. — shown on the form confirmation screen when set. */
  schedulingUrl: process.env.NEXT_PUBLIC_SCHEDULING_URL ?? "",
  location: "Knoxville, Tennessee",
};

export const navLinks = [
  { href: "/solutions", label: "Solutions" },
  { href: "/industries", label: "Industries" },
  { href: "/portfolio", label: "Innovation Portfolio" },
  { href: "/method", label: "The Catalyst Method" },
  { href: "/demo-lab", label: "Demo Lab" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
] as const;

/**
 * Analytics event hook. Wire to your provider (GA4, Plausible, PostHog…)
 * by defining window.ciTrack, or replace the body of this function.
 * Events are intentionally free of personal data.
 */
export type AnalyticsEvent =
  | "cta_consultation_click"
  | "form_start"
  | "form_step"
  | "form_complete"
  | "roi_calculator_used"
  | "assessment_start"
  | "assessment_complete"
  | "demo_interaction"
  | "founder_profile_view"
  | "roi_pdf_download"
  | "phone_click"
  | "email_click";

export function track(event: AnalyticsEvent, props?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  const w = window as typeof window & {
    ciTrack?: (e: string, p?: Record<string, string | number>) => void;
  };
  try {
    w.ciTrack?.(event, props);
  } catch {
    /* analytics must never break the UI */
  }
}
