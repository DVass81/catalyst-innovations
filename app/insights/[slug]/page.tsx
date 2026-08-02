import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { insights } from "@/data/content";
import { Section } from "@/components/ui";
import CTABand from "@/components/CTABand";

/**
 * One complete sample article. Additional articles remain drafts (listed but
 * not routable) until approved. This page only builds published articles.
 */

const published = ["why-business-software-fails"];

export function generateStaticParams() {
  return published.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = insights.find((x) => x.slug === slug && !x.draft);
  if (!a) return {};
  return { title: a.title, description: a.excerpt };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = insights.find((x) => x.slug === slug && !x.draft);
  if (!a || !published.includes(slug)) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    author: { "@type": "Organization", name: "Catalyst Innovations" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <section className="bg-navy-900 pb-14 pt-36 text-white">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-silver-400">
            <Link href="/insights" className="hover:text-white">Insights</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-ice-300">{a.category}</span>
          </nav>
          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">{a.title}</h1>
          <p className="mt-4 text-sm text-silver-400">{a.readMinutes} min read · Catalyst Innovations</p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="prose-ci mx-auto">
          <p>
            Walk any shop floor, purchasing department, or back office and ask people what
            they think of the software they use every day. The answers are remarkably
            consistent: it&apos;s slow, it doesn&apos;t match how the work actually happens, and
            everyone maintains a private spreadsheet to route around it.
          </p>
          <p>
            That spreadsheet is the most honest piece of software documentation in the
            building. It marks exactly where the official system failed.
          </p>

          <h2>Software is bought by people who won&apos;t use it</h2>
          <p>
            Most business software is selected in a conference room, by people whose daily
            work looks nothing like the daily work the software is supposed to support. The
            demo is optimized for the buyer: dashboards, reports, executive views. The daily
            grind — the eleven clicks to log a routine transaction, the required fields
            nobody has data for, the approval that dead-ends when someone is on vacation —
            never appears in the demo.
          </p>
          <p>
            So the software wins the sale and loses the floor. Adoption becomes a compliance
            exercise. And within a year, the real process lives in workarounds.
          </p>

          <h2>The workflow mismatch compounds daily</h2>
          <p>
            When software doesn&apos;t match the workflow, every transaction pays a small tax:
            re-typing data that exists somewhere else, translating between what the screen
            asks and what the job requires, chasing information the system should have
            surfaced. Individually the taxes are seconds and minutes. Multiplied across
            every employee, every transaction, every day, they become one of the largest
            unmeasured costs in the business.
          </p>
          <p>Worse than the cost is what it does to the data:</p>
          <ul>
            <li>People enter the minimum required to make the screen go away.</li>
            <li>Fields get repurposed for whatever the system lacked.</li>
            <li>Timing gets faked — entries batched at day&apos;s end, backdated, approximated.</li>
            <li>Leadership then makes decisions on that data as if it were true.</li>
          </ul>

          <h2>What to demand instead</h2>
          <p>
            The fix is not better training or stricter mandates. It is software designed
            around how the work actually happens. In practice that means:
          </p>
          <ul>
            <li>
              <strong>Design begins with observation.</strong> Whoever builds or configures
            your system should sit with the people doing the work — not just interview the
            managers who supervise it.
            </li>
            <li>
              <strong>The frequent path is the fast path.</strong> The transaction someone
              performs fifty times a day deserves more design attention than the report an
              executive runs monthly.
            </li>
            <li>
              <strong>Exceptions are part of the process.</strong> Real workflows have
              rush orders, substitutions, partial receipts, and vacations. Systems that only
              model the happy path push everything else into email.
            </li>
            <li>
              <strong>A prototype before a commitment.</strong> If stakeholders can&apos;t click
              through a working demonstration before full implementation, the risk is
              yours, not the vendor&apos;s.
            </li>
            <li>
              <strong>Adoption is measured, not assumed.</strong> If usage drops after
              go-live, that&apos;s design feedback — and someone should be contractually
              interested in acting on it.
            </li>
          </ul>

          <h2>The test that never fails</h2>
          <p>
            Six months after go-live, look for the spreadsheet. If a new one has appeared
            beside the system, the software failed the people who use it — no matter what
            the executive dashboard says. If the old ones are gone because nobody needs
            them, you built the right thing.
          </p>
          <p>
            That&apos;s the standard we hold our own work to at Catalyst Innovations: software
            people reach for because it&apos;s genuinely the easiest way to do the job.
          </p>
        </div>
      </Section>
      <CTABand
        title="Living with software your team routes around?"
        body="Tell us about the spreadsheet that runs your company. We've replaced a few."
      />
    </>
  );
}
