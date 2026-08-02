import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, Eyebrow, Heading, Lead, HexFrame } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import { getServices } from "@/lib/cms";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Solutions — Custom Software, AI, Automation & Procurement Technology",
  description:
    "Custom business software, practical AI and automation, procurement technology, manufacturing systems, supply-chain intelligence, and digital transformation consulting.",
};

export default async function SolutionsPage() {
  const services = await getServices();
  return (
    <>
      <section className="bg-navy-900 pb-16 pt-36 text-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <Eyebrow dark>Solutions</Eyebrow>
            <Heading dark as="h1">
              From manual processes to intelligent operations.
            </Heading>
            <Lead dark>
              Eight capability areas, one philosophy: study how the work actually happens,
              then build technology around it.
            </Lead>
          </Reveal>
        </div>
      </section>

      <Section className="bg-ice-50">
        <RevealGroup className="grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <RevealItem key={s.slug} className="h-full">
              <Link
                href={`/solutions/${s.slug}`}
                className="group flex h-full flex-col rounded-card border border-ice-200 bg-white p-8 transition-all hover:-translate-y-1 hover:border-steel-400/50 hover:shadow-card"
              >
                <div className="flex items-start gap-4">
                  <HexFrame><Icon name={s.icon} /></HexFrame>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-navy-900">{s.title}</h2>
                    <p className="mt-1 text-sm text-steel-600">{s.tagline}</p>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-navy-700">{s.description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-steel-600 transition-all group-hover:gap-2">
                  Explore {s.navLabel} <ArrowRight size={15} />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
      <CTABand />
    </>
  );
}
