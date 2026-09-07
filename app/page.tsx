import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import ValueHero from "@/components/home/ValueHero";
import PortalHero from "@/components/home/PortalHero";
import ProofSection from "@/components/home/ProofSection";
import { Section, Eyebrow, Heading, Lead } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { differentiators } from "@/data/content";
import CTABand from "@/components/CTABand";
import { founderPhoto } from "@/lib/founderPhoto";

export const metadata: Metadata = {
  title: "Catalyst Innovations — Turn Operational Problems Into Intelligent Systems",
  description:
    "Catalyst Innovations combines real-world operational experience, modern software, automation, and practical AI to help organizations make more money, save time, and work smarter.",
};

// The one line that's the whole pitch, plus two that support it. The other
// five differentiators live on /about — here they'd just dilute this one.
const topDifferentiatorTitles = [
  "Operational experience before software recommendations",
  "Business outcomes before feature lists",
  "Direct founder involvement",
];
const topDifferentiators = topDifferentiatorTitles
  .map((title) => differentiators.find((d) => d.title === title))
  .filter((d): d is (typeof differentiators)[number] => Boolean(d));

export default function HomePage() {
  const togetherPhoto = founderPhoto("together");
  return (
    <>
      <ValueHero />
      <PortalHero />
      <ProofSection />

      <Section dark>
        <Reveal>
          <Eyebrow dark>Why Catalyst Innovations</Eyebrow>
          <Heading dark>We ran production floors and purchasing departments before we wrote software for them.</Heading>
          <Lead dark>The diagnosis comes from experience, not a discovery questionnaire.</Lead>
        </Reveal>
        <RevealGroup className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-3" stagger={0.06}>
          {topDifferentiators.map((d) => (
            <RevealItem key={d.title}>
              <div className="border-l-2 border-steel-400 pl-5">
                <h3 className="font-display text-base font-semibold text-white">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ice-300">{d.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal className="mt-12">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-steel-300 underline-offset-4 hover:text-white hover:underline"
          >
            More about how we work <ArrowRight size={15} />
          </Link>
        </Reveal>
      </Section>

      <Section className="bg-ice-50">
        <div className={togetherPhoto ? "grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]" : "mx-auto max-w-2xl text-center"}>
          {togetherPhoto && (
            <Reveal>
              <div className="relative aspect-[1284/407] overflow-hidden rounded-card shadow-card lg:aspect-[4/3]">
                <Image
                  src={togetherPhoto}
                  alt="The Catalyst Innovations team"
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          )}
          <Reveal delay={0.1}>
            <Eyebrow>Meet the team</Eyebrow>
            <Heading as="h2">You work directly with the people who built this.</Heading>
            <Lead className={togetherPhoto ? undefined : "mx-auto"}>
              No account managers, no handoffs to an offshore team. Josh is on every
              engagement, from the first conversation through continuous improvement —
              direct founder involvement is a real differentiator for a company our size.
            </Lead>
            <Link
              href="/founders"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-steel-600 underline-offset-4 hover:underline"
            >
              Meet the team <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </Section>

      <CTABand />
    </>
  );
}
