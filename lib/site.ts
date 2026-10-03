/**
 * Central site configuration.
 * Public business contact details confirmed by Daniel on October 3, 2026.
 */
import booking from "@/data/booking.json";
export const site = {
  name: "Catalyst Innovations",
  motto: "Less busywork. A better-running business.",
  positioning:
    "We build custom software that connects your customers, jobs, inventory, purchasing, and accounting so your team can spend more time doing the work.",
  // Set NEXT_PUBLIC_SITE_URL in production (e.g. https://catalystinnovations.com)
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mycatalystinnovations.com",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "daniel@mycatalystinnovations.com",
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+18653483137",
  contactPhoneLabel: process.env.NEXT_PUBLIC_CONTACT_PHONE || "(865) 348-3137",
  businessHours: "Every day, 6 a.m.–8 p.m. Eastern",
  supportHours: "24/7 support",
  serviceArea: "Serving East Tennessee and businesses worldwide",
  /** Reviewed public appointment link (Calendly); never a private calendar URL. */
  schedulingUrl: process.env.NEXT_PUBLIC_SCHEDULING_URL || booking.publicUrl,
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
 * Consent-controlled hook. The analytics boundary allowlists event names and
 * reviewed context identifiers; arbitrary properties never reach providers.
 */
import type { AnalyticsEvent } from "./analytics";
export type { AnalyticsEvent } from "./analytics";

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
