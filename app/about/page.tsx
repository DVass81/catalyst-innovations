import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, Eyebrow, Heading, Lead, ButtonLink } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { differentiators } from "@/data/content";
import CTABand from "@/components/CTABand";

export const metadata: Metadata = {
  title: "About — Operational Experience Meets Modern Technology",
  description:
    "Catalyst Innovations was founded to solve the problems traditional software fails to solve — combining manufacturing, procurement, military leadership, and modern AI development.",
};

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-900 pb-20 pt-36 text-white">
        <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <Eyebrow dark>About Catalyst Innovations</Eyebrow>
            <Heading dark as="h1">
              Turn operational friction into competitive advantage.
            </Heading>
            <Lead dark>
              We were created to help organizations overcome the problems traditional
              software often fails to solve — disconnected systems, manual paperwork, slow
              approvals, weak controls, and software that doesn&apos;t match the actual workflow.
            </Lead>
          </Reveal>
        </div>
      </section>

      <Section className="bg-ice-50">
        <div className="grid gap-12 lg:grid-cols-3">
          <Reveal>
            <div className="h-full rounded-card border border-ice-200 bg-white p-8 shadow-card">
              <Eyebrow>Mission</Eyebrow>
              <p className="text-lg font-medium leading-relaxed text-navy-900">
                Help businesses make more money, save time, and become more efficient
                through intelligent technology, automation, operational expertise, and
                trusted partnership.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-card border border-ice-200 bg-white p-8 shadow-card">
              <Eyebrow>Vision</Eyebrow>
              <p className="text-lg font-medium leading-relaxed text-navy-900">
                Become a trusted, nationally recognized business technology company known
                for building practical systems that transform operations and generate
                measurable financial value.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="h-full rounded-card border border-ice-200 bg-white p-8 shadow-card">
              <Eyebrow>Direction</Eyebrow>
              <p className="text-base leading-relaxed text-navy-800">
                A growing portfolio of specialized SaaS products, long-term client
                partnerships, custom enterprise solutions, and a workplace where talented
                people want to build their careers — with Catalyst Innovations as the
                parent company and innovation platform.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-16 max-w-3xl">
          <Heading as="h3">We don&apos;t force customers into a rigid product.</Heading>
          <Lead>
            We study how the business operates, identify opportunities, and build practical
            solutions around the client&apos;s needs. Both founders are family men building
            Catalyst Innovations around trust, integrity, accountability, long-term
            relationships, and meaningful work.
          </Lead>
          <Link
            href="/founders"
            className="mt-6 inline-flex items-center gap-2 font-medium text-steel-600 hover:underline"
          >
            Meet Daniel and Josh <ArrowRight size={16} />
          </Link>
        </Reveal>
      </Section>

      <Section dark>
        <Reveal>
          <Eyebrow dark>What makes us different</Eyebrow>
          <Heading dark>Built by people who understand both the work and the technology.</Heading>
        </Reveal>
        <RevealGroup className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2" stagger={0.06}>
          {differentiators.map((d) => (
            <RevealItem key={d.title}>
              <div className="border-l-2 border-steel-400 pl-5">
                <h3 className="font-display text-base font-semibold text-white">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ice-300">{d.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal className="mt-12">
          <ButtonLink href="/method" variant="ghost-dark">
            See how we work <ArrowRight size={16} />
          </ButtonLink>
        </Reveal>
      </Section>
      <CTABand />
    </>
  );
}
