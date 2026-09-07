"use client";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { site, track } from "@/lib/site";
export default function BookingEmbed() {
  const [show, setShow] = useState(false);
  if (!site.schedulingUrl) return null;
  return (
    <div>
      <a
        className="ci-text-link"
        href={site.schedulingUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("scheduling_click", { location: "direct" })}
      >
        Open the booking calendar <ArrowUpRight size={17} />
      </a>
      <button
        type="button"
        className="ci-calendar-toggle"
        aria-expanded={show}
        onClick={() => {
          setShow(!show);
          if (!show) track("scheduling_click", { location: "embed" });
        }}
      >
        {show ? "Hide calendar" : "Show calendar on this page"}
      </button>
      {show && (
        <iframe
          src={site.schedulingUrl}
          title={
            site.schedulingHost
              ? `Book a meeting with ${site.schedulingHost}`
              : "Book a meeting — host shown in calendar"
          }
          className="ci-booking-frame"
          loading="lazy"
        />
      )}
    </div>
  );
}
