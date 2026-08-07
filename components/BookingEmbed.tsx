import { site } from "@/lib/site";

/**
 * Embeds the Microsoft Bookings page set via NEXT_PUBLIC_SCHEDULING_URL.
 * Meetings booked here land directly on the connected Outlook calendar —
 * no custom Graph API integration needed, Bookings handles that natively.
 */
export default function BookingEmbed() {
  if (!site.schedulingUrl) return null;
  return (
    <div className="overflow-hidden rounded-card border border-white/12 bg-white">
      <iframe
        src={site.schedulingUrl}
        title="Schedule a meeting"
        className="h-[850px] w-full border-0"
        loading="lazy"
      />
    </div>
  );
}
