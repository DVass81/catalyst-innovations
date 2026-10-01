/**
 * Central site configuration.
 * TODO(founders): replace placeholder values before launch — see README
 * "Content-replacement checklist".
 */
export const site = {
  name: "Catalyst Innovations",
  motto: "Less busywork. A better-running business.",
  positioning:
    "We build custom software that connects your customers, jobs, inventory, purchasing, and accounting so your team can spend more time doing the work.",
  // Set NEXT_PUBLIC_SITE_URL in production (e.g. https://catalystinnovations.com)
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  // Contact placeholders — configure via env, never hardcoded personal info.
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",
  /** Daniel's public Microsoft Bookings URL; shown only after explicit review configuration. */
  schedulingUrl: process.env.NEXT_PUBLIC_SCHEDULING_URL ?? "",
  location: "Knoxville, Tennessee",
};

export type NavLink =
  | { href: string; label: string }
  | { label: string; children: { href: string; label: string }[] };

export const navLinks: NavLink[] = [
  { href: "/solutions", label: "Solutions" },
  { href: "/industries", label: "Industries" },
  { href: "/method", label: "The Catalyst Method" },
  {
    label: "Pricing",
    children: [
      { href: "/pricing", label: "Pricing" },
      { href: "/tools", label: "Savings Tools" },
    ],
  },
  { href: "/about", label: "About" },
];

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
  | "booking_click"
  | "demo_interaction"
  | "industry_select"
  | "form_error"
  | "section_view"
  | "founder_profile_view"
  | "roi_pdf_download"
  | "phone_click"
  | "email_click";

export function track(
  event: AnalyticsEvent,
  props?: Record<string, string | number>,
) {
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
