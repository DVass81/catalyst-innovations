"use client";
import { site, track } from "@/lib/site";
export default function BookingLink() {
  if (
    !site.schedulingUrl ||
    process.env.NEXT_PUBLIC_BOOKING_VERIFIED !== "true"
  )
    return null;
  return (
    <a
      className="button"
      href={site.schedulingUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("booking_click")}
    >
      Book a conversation ↗
    </a>
  );
}
