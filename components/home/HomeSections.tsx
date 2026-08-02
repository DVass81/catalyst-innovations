"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, Eyebrow, Heading, Lead, ButtonLink, HexDot, StatusBadge } from "../ui";
import { Reveal, RevealGroup, RevealItem } from "../Reveal";
import { Icon } from "../Icon";
import { DuotoneIcon } from "../DuotoneIcon";
import { Spotlight } from "../Spotlight";
import { services } from "@/data/services";
import { products } from "@/data/products";
import { industries } from "@/data/industries";
import { methodStages, outcomes, founders, partnershipStatement, insights, differentiators } from "@/data/content";
import { track } from "@/lib/site";

/* ---------- Credibility ---------- */
export function Credibility() {
  return (
    <Section className="bg-ice-50">
      <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <Eyebrow>Who we are</Eyebrow>
          <Heading>
            We don&apos;t just build software.
            <br />
            We solve business problems.
          </Heading>
          <Lead>
            Catalyst Innovations was founded by two people who spent decades inside the
            problems most software companies only read about — one running manufacturing,
            purchasing, and operations; the other building and securing systems through
            fifteen years of U.S. Army service and technology work.
          </Lead>
          <Lead className="mt-3">
            We identify operational problems, redesign inefficient processes, and build
            intelligent technology that helps businesses make more money, save time, and
            operate more efficiently.
          </Lead>
        </Reveal>
        <RevealGroup className="grid grid-cols-2 gap-4">
          {[
            ["20+", "years of manufacturing, procurement & operations experience"],
            ["15", "years of U.S. Army leadership & technology discipline"],
            ["6", "stage method from discovery to continuous improvement"],
            ["1", "goal: measurable business results"],
          ].map(([n, t]) => (
            <RevealItem key={t}>
              <div className="rounded-card border border-ice-200 bg-white p-6 shadow-card">
                <p className="font-display text-4xl font-semibold text-steel-600">{n}</p>
                <p className="mt-2 text-sm leading-snug text-navy-700">{t}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

/* ---------- Problems we solve ---------- */
const problems = [
  "Disconnected systems", "Manual paperwork", "Repetitive administrative work",
  "Poor visibility into operations", "Slow approvals", "Weak purchasing controls",
  "Inventory problems", "Inconsistent processes", "Data trapped in spreadsheets",
  "Departments operating in silos", "Software that doesn't match the workflow",
  "Leaders lacking timely information",
];

export function Problems() {
  return (
    <Section dark className="relative overflow-hidden">
      <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
      <div className="relative">
        <Reveal>
          <Eyebrow dark>The problems we solve</Eyebrow>
          <Heading dark>Your business has bottlenecks. We build the breakthroughs.</Heading>
          <Lead dark>
            Traditional software often fails at exactly these points. This is where we start.
          </Lead>
        </Reveal>
        <RevealGroup className="mt-10 flex flex-wrap gap-3">
          {problems.map((x) => (
            <RevealItem key={x}>
              <span className="inline-block rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-ice-100">
                {x}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

/* ---------- Solutions overview ---------- */
export function SolutionsOverview() {
  return (
    <Section className="bg-white" seamTo="#0a1628">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>Solutions</Eyebrow>
          <Heading>Technology built around the way your business actually works.</Heading>
        </div>
        <ButtonLink href="/solutions" variant="ghost-light">
          All solutions <ArrowRight size={16} />
        </ButtonLink>
      </Reveal>
      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s) => (
          <RevealItem key={s.slug}>
            <Spotlight className="h-full rounded-card">
              <Link
                href={`/solutions/${s.slug}`}
                className="group flex h-full flex-col rounded-card border border-ice-200 bg-ice-50 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-steel-400/50 hover:shadow-card"
              >
                <DuotoneIcon name={s.icon} size={30} />
                <h3 className="mt-4 font-display text-[1.02rem] font-semibold leading-snug text-navy-900">
                  {s.navLabel}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-700">{s.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-steel-600 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight size={15} />
                </span>
              </Link>
            </Spotlight>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/* ---------- Featured portfolio ---------- */
export function PortfolioPreview() {
  const featured = products.slice(0, 3);
  return (
    <Section className="bg-ice-100">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>Innovation portfolio</Eyebrow>
          <Heading>What we&apos;re building</Heading>
          <Lead>
            A growing portfolio of products and platform concepts — labeled honestly by
            development status.
          </Lead>
        </div>
        <ButtonLink href="/portfolio" variant="ghost-light">
          Full portfolio <ArrowRight size={16} />
        </ButtonLink>
      </Reveal>
      <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-3">
        {featured.map((p) => (
          <RevealItem key={p.slug} className="h-full">
            <Spotlight className="h-full rounded-card">
              <div className="flex h-full flex-col rounded-card border border-ice-200 bg-white p-7 shadow-card">
                <div className="flex items-center justify-between gap-3">
                  <DuotoneIcon name={p.icon} size={30} />
                  <StatusBadge status={p.status} />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-navy-900">{p.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-700">{p.summary}</p>
                <Link
                  href="/portfolio"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-steel-600 hover:gap-2 transition-all"
                >
                  Explore <ArrowRight size={15} />
                </Link>
              </div>
            </Spotlight>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/* ---------- Method preview ---------- */
export function MethodPreview() {
  return (
    <Section dark className="relative overflow-hidden">
      <div aria-hidden="true" className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-steel-600/20 blur-[100px]" />
      <div className="relative">
        <Reveal>
          <Eyebrow dark>How we work</Eyebrow>
          <Heading dark>The Catalyst Method</Heading>
          <Lead dark>Six stages from first conversation to continuous improvement.</Lead>
        </Reveal>
        <div className="relative mt-14">
          {/* Connector line */}
          <div aria-hidden="true" className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-steel-400/60 via-steel-400/25 to-transparent lg:left-0 lg:top-6 lg:h-px lg:w-full lg:bg-gradient-to-r" />
          <RevealGroup className="grid gap-8 lg:grid-cols-6" stagger={0.1}>
            {methodStages.map((m) => (
              <RevealItem key={m.n}>
                <div className="relative pl-16 lg:pl-0 lg:pt-14">
                  <span className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border border-steel-400/50 bg-navy-800 font-display text-sm font-semibold text-steel-300 lg:-top-0">
                    {m.n}
                  </span>
                  <h3 className="font-display text-base font-semibold text-white">{m.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ice-300">{m.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
        <Reveal className="mt-12">
          <ButtonLink href="/method" variant="ghost-dark">
            Explore the method <ArrowRight size={16} />
          </ButtonLink>
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------- Industries preview ---------- */
export function IndustriesPreview() {
  return (
    <Section className="bg-white" seamTo="#050b16">
      <Reveal>
        <Eyebrow>Industries</Eyebrow>
        <Heading>Designed to support the organizations that keep the economy moving.</Heading>
      </Reveal>
      <RevealGroup className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" stagger={0.04}>
        {industries.map((i) => (
          <RevealItem key={i.slug}>
            <Link
              href={`/industries#${i.slug}`}
              className="flex items-center gap-3 rounded-xl border border-ice-200 bg-ice-50 px-4 py-3.5 text-sm font-medium text-navy-800 transition-colors hover:border-steel-400/50 hover:bg-white"
            >
              <Icon name={i.icon} size={18} className="shrink-0 text-steel-600" />
              {i.name}
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/* ---------- Outcomes ---------- */
export function Outcomes() {
  return (
    <Section className="bg-ice-100">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <Eyebrow>Business outcomes</Eyebrow>
          <Heading>Measured in dollars and hours, not features shipped.</Heading>
          <Lead>
            Every engagement is designed around outcomes the CFO can see. These are the
            results our solutions are built to produce.
          </Lead>
        </Reveal>
        <RevealGroup className="grid grid-cols-1 gap-2.5 sm:grid-cols-2" stagger={0.03}>
          {outcomes.map((o) => (
            <RevealItem key={o}>
              <div className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 text-sm text-navy-800 shadow-[0_1px_3px_rgb(5_11_22/0.06)]">
                <HexDot className="mt-0" />
                {o}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

/* ---------- Founders preview ---------- */
export function FoundersPreview() {
  return (
    <Section dark seamTo="#ffffff">
      <Reveal className="text-center">
        <Eyebrow dark>Meet the founders</Eyebrow>
        <Heading dark>Built by people who understand both the work and the technology.</Heading>
        <p className="mx-auto mt-5 max-w-xl text-lg italic text-steel-300">
          &ldquo;{partnershipStatement}&rdquo;
        </p>
      </Reveal>
      <RevealGroup className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        {founders.map((f) => (
          <RevealItem key={f.slug} className="h-full">
            <Link
              href={`/founders#${f.slug}`}
              onClick={() => track("founder_profile_view", { founder: f.slug })}
              className="group flex h-full flex-col rounded-card border border-white/12 bg-navy-800/70 p-7 transition-colors hover:border-steel-400/50"
            >
              {/* Photo placeholder — TODO(founders): replace with professional headshots */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-steel-400/40 bg-navy-700 font-display text-xl font-semibold text-steel-300">
                {f.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-white">{f.name}</h3>
              <p className="mt-1 text-sm text-steel-300">{f.role}</p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ice-300">{f.summary}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-steel-300 group-hover:gap-2 transition-all">
                Full profile <ArrowRight size={15} />
              </span>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/* ---------- Why Catalyst ---------- */
export function WhyCatalyst() {
  return (
    <Section className="bg-white">
      <Reveal>
        <Eyebrow>Why Catalyst Innovations</Eyebrow>
        <Heading>Custom technology without enterprise-level complexity.</Heading>
      </Reveal>
      <RevealGroup className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2" stagger={0.06}>
        {differentiators.map((d) => (
          <RevealItem key={d.title}>
            <div className="border-l-2 border-steel-400 pl-5">
              <h3 className="font-display text-base font-semibold text-navy-900">{d.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-700">{d.text}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/* ---------- Insights preview ---------- */
export function InsightsPreview() {
  const featured = insights.slice(0, 3);
  return (
    <Section className="bg-ice-50">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>Insights</Eyebrow>
          <Heading>Thinking from the shop floor up.</Heading>
        </div>
        <ButtonLink href="/insights" variant="ghost-light">
          All insights <ArrowRight size={16} />
        </ButtonLink>
      </Reveal>
      <RevealGroup className="mt-10 grid gap-6 md:grid-cols-3">
        {featured.map((a) => (
          <RevealItem key={a.slug} className="h-full">
            <Link
              href={a.draft ? "/insights" : `/insights/${a.slug}`}
              className="group flex h-full flex-col rounded-card border border-ice-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-card"
            >
              <p className="text-xs font-semibold tracking-wide text-steel-600 uppercase">
                {a.category}
                {a.draft && <span className="ml-2 rounded bg-ice-200 px-1.5 py-0.5 text-[0.6rem] text-navy-700">Draft preview</span>}
              </p>
              <h3 className="mt-3 flex-1 font-display text-base font-semibold leading-snug text-navy-900 group-hover:text-steel-600 transition-colors">
                {a.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-navy-700">{a.excerpt}</p>
              <p className="mt-4 text-xs text-silver-500">{a.readMinutes} min read</p>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
