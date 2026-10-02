"use client";
import { site, track } from "@/lib/site";
import booking from "@/data/booking.json";
export default function BookingLink({ className = "button" }: { className?: string }) {
  if (
    !site.schedulingUrl ||
    process.env.NEXT_PUBLIC_BOOKING_VERIFIED === "false" ||
    (site.schedulingUrl !== booking.publicUrl && process.env.NEXT_PUBLIC_BOOKING_VERIFIED !== "true")
  )
    return null;
  return (
    <a
      className={className}
      href={site.schedulingUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("booking_click")}
    >
      Book a conversation ↗
    </a>
  );
}
