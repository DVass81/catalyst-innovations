import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, MessageSquare } from "lucide-react";
import { Section, Eyebrow, Heading, Lead, ButtonLink } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import EmailLink from "@/components/EmailLink";
import { site } from "@/lib/site";
import { inquiryTypes } from "@/lib/consultation";
import { founders } from "@/data/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Catalyst Innovations — consultations, software ideas, assessments, partnerships, and general inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-navy-900 pb-14 pt-36 text-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <Eyebrow dark>Contact</Eyebrow>
            <Heading dark as="h1">Start the conversation.</Heading>
            <Lead dark>
              Every engagement starts the same way: we listen. Choose the path that fits,
              or just reach out.
            </Lead>
          </Reveal>
        </div>
      </section>

      <Section className="bg-ice-50">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Reveal>
              <h2 className="font-display text-lg font-semibold text-navy-900">What can we help with?</h2>
            </Reveal>
            <RevealGroup className="mt-6 grid gap-3 sm:grid-cols-2">
              {inquiryTypes.map((t) => (
                <RevealItem key={t}>
                  <Link
                    href="/consultation"
                    className="group flex min-h-[64px] items-center justify-between gap-3 rounded-xl border border-ice-200 bg-white px-5 py-4 text-sm font-medium text-navy-800 shadow-[0_1px_3px_rgb(5_11_22/0.05)] transition-colors hover:border-steel-400/50"
                  >
                    <span className="flex items-center gap-3">
                      <MessageSquare size={17} className="shrink-0 text-steel-600" />
                      {t}
                    </span>
                    <ArrowRight size={16} className="shrink-0 text-silver-400 transition-transform group-hover:translate-x-1" />
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <Reveal delay={0.1}>
            <div className="rounded-card border border-ice-200 bg-white p-8 shadow-card">
              <h2 className="font-display text-lg font-semibold text-navy-900">Direct contact</h2>
              <ul className="mt-5 space-y-4 text-sm text-navy-800">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-steel-600" />
                  <span>{site.location}</span>
                </li>
                {founders.map((f) => (
                  <li key={f.slug} className="flex items-start gap-3">
                    <Mail size={18} className="mt-0.5 shrink-0 text-steel-600" />
                    <span>
                      <span className="block text-navy-900">{f.name}</span>
                      <EmailLink email={f.email} context={`contact_page_${f.slug}`} />
                    </span>
                  </li>
                ))}
              </ul>
              <ButtonLink href="/consultation" className="mt-8 w-full">
                Request a Consultation
              </ButtonLink>
              <p className="mt-4 text-xs text-silver-500">
                Prefer a structured start? Try the{" "}
                <Link href="/roi-estimator" className="underline">starting-point assessment</Link>.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
