"use client";

import { ButtonLink, Heading } from "./ui";
import { Reveal } from "./Reveal";
import { track } from "@/lib/site";

export default function CTABand({
  title = "Let's talk about the process that frustrates you most.",
  body = "A consultation costs nothing and starts with listening — to leadership and to the people doing the work.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-20">
      <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-steel-400/20 blur-[110px]"
      />
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <Heading dark>{title}</Heading>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ice-300">{body}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink
              href="/consultation"
              onClick={() => track("cta_consultation_click", { location: "cta_band" })}
            >
              Request a Consultation
            </ButtonLink>
            <ButtonLink href="/start" variant="ghost-dark">
              Find Your Best Starting Point
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
