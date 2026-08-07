import { site } from "@/lib/site";

/**
 * Embeds the scheduling page set via NEXT_PUBLIC_SCHEDULING_URL — a Google
 * Calendar Appointment Schedule or Microsoft Bookings public page both
 * work. Meetings booked here land directly on the connected calendar; no
 * custom calendar-API integration needed, the scheduling tool handles it.
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
