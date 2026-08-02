import type { Metadata } from "next";
import { Section, Eyebrow, Heading, Lead } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import Assessment from "@/components/Assessment";

export const metadata: Metadata = {
  title: "Find Your Best Starting Point",
  description:
    "A two-minute assessment that points you to the most valuable place to begin: custom software, procurement transformation, AI and automation, dashboards, integration, or a roadmap.",
};

export default function StartPage() {
  return (
    <>
      <section className="bg-navy-900 pb-14 pt-36 text-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <Eyebrow dark>Starting-point assessment</Eyebrow>
            <Heading dark as="h1">Find your best starting point.</Heading>
            <Lead dark>
              Seven quick questions. At the end you&apos;ll get a tailored recommendation for
              where technology can create the most value fastest. It&apos;s a conversation
              starter — not a binding professional diagnosis.
            </Lead>
          </Reveal>
        </div>
      </section>
      <Section className="bg-ice-50">
        <div className="mx-auto max-w-3xl">
          <Assessment />
        </div>
      </Section>
    </>
  );
}
