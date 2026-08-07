"use client";

import { useState, type ReactNode } from "react";

/**
 * Toggle between the consultation request form and a direct-booking embed.
 * Only rendered by the page when a scheduling URL is configured — see
 * app/consultation/page.tsx.
 */
export default function ConsultationTabs({
  form,
  booking,
}: {
  form: ReactNode;
  booking: ReactNode;
}) {
  const [tab, setTab] = useState<"form" | "booking">("form");

  return (
    <div>
      <div className="flex justify-center">
        <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => setTab("form")}
            aria-pressed={tab === "form"}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              tab === "form" ? "bg-white text-navy-900" : "text-ice-200 hover:text-white"
            }`}
          >
            Request a Consultation
          </button>
          <button
            type="button"
            onClick={() => setTab("booking")}
            aria-pressed={tab === "booking"}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              tab === "booking" ? "bg-white text-navy-900" : "text-ice-200 hover:text-white"
            }`}
          >
            Book a Time Directly
          </button>
        </div>
      </div>
      <div className="mt-8">{tab === "form" ? form : booking}</div>
    </div>
  );
}
