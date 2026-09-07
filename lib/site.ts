export const site = {
  name: "Catalyst Innovations",
  motto: "See your business working better.",
  positioning:
    "Custom software, automation, and connected systems built around how your business actually works. Explore industry demos and clear project pricing.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://mycatalystinnovations.com",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "daniel@mycatalystinnovations.com",
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
  schedulingUrl:
    process.env.NEXT_PUBLIC_SCHEDULING_URL ||
    "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0wneeftKVS1hd6XwO-a6o96yWgdFXNr7tBorX-PWzFhfLtP7KSTbY4WukIapu5hH6oQB7GhPRH",
  schedulingHost: process.env.NEXT_PUBLIC_SCHEDULING_HOST || "",
  location: "Knoxville, Tennessee",
};
export type NavLink =
  | { href: string; label: string }
  | { label: string; children: { href: string; label: string }[] };
export const navLinks: NavLink[] = [
  { href: "/solutions", label: "Solutions" },
  { href: "/industries", label: "Industries" },
  { href: "/demo-lab", label: "Demo Lab" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];
export type AnalyticsEvent =
  | "cta_consultation_click"
  | "form_start"
  | "form_step"
  | "form_complete"
  | "form_error"
  | "roi_calculator_used"
  | "assessment_start"
  | "assessment_complete"
  | "demo_interaction"
  | "demo_select"
  | "demo_complete"
  | "founder_profile_view"
  | "roi_pdf_download"
  | "phone_click"
  | "email_click"
  | "pricing_interest"
  | "scheduling_click";
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
  } catch {}
}
