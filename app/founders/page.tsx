import type { Metadata } from "next";
import { Section, Eyebrow, Heading, Lead, HexDot } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import HexPortrait from "@/components/HexPortrait";
import EmailLink from "@/components/EmailLink";
import { activeFounders } from "@/data/content";
import CTABand from "@/components/CTABand";
import { founderPhoto as photoFor } from "@/lib/founderPhoto";

export const metadata: Metadata = {
  title: "Founders — Josh Ogle",
  description:
    "Josh Ogle brings ~10 years of U.S. Army service plus IT systems, cybersecurity, and product-development expertise.",
};

const personSchema = activeFounders.map((f) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: f.name,
  jobTitle: "Co-Founder",
  worksFor: { "@type": "Organization", name: "Catalyst Innovations" },
}));

export default function FoundersPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <section className="relative overflow-hidden bg-navy-900 pb-20 pt-36 text-white">
        <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <Eyebrow dark>Meet the team</Eyebrow>
            <Heading dark as="h1">
              Built by people who understand both the problem and the technology.
            </Heading>
            <Lead dark>
              Josh brings U.S. Army leadership, IT systems, and product-development
              expertise to every engagement — connecting the technical solution to the
              real operational problem it&apos;s solving.
            </Lead>
          </Reveal>
        </div>
      </section>

      <Section className="bg-ice-50">
        <div className="space-y-16">
          {activeFounders.map((f) => (
            <Reveal key={f.slug}>
              <article id={f.slug} className="grid gap-10 rounded-card border border-ice-200 bg-white p-8 shadow-card sm:p-10 lg:grid-cols-[320px_1fr]">
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <HexPortrait
                    src={photoFor(f.slug)}
                    initials={f.name.split(" ").map((n) => n[0]).join("")}
                    alt={`Portrait of ${f.name}`}
                    size={260}
                  />
                  <h2 className="mt-5 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">{f.name}</h2>
                  <p className="mt-1 font-medium text-steel-600">{f.role}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {f.years.map((y) => (
                      <span
                        key={y}
                        className="inline-flex items-center rounded-full bg-ice-100 px-2.5 py-1 text-xs font-medium text-navy-700"
                      >
                        {y}
                      </span>
                    ))}
                  </div>
                  <EmailLink email={f.email} context={f.slug} className="mt-3" />
                  {f.personalNote && (
                    <div className="mt-6 rounded-card border border-ice-200 bg-ice-50 p-4">
                      <p className="text-xs font-semibold tracking-wide text-steel-600 uppercase">Off the clock</p>
                      <p className="mt-1.5 text-sm italic leading-relaxed text-navy-700">{f.personalNote}</p>
                    </div>
                  )}
                </div>
                <div>
                  <div className="lg:columns-2 lg:gap-10">
                    {f.bio.map((p) => (
                      <p key={p} className="mb-4 break-inside-avoid leading-relaxed text-navy-800">{p}</p>
                    ))}
                  </div>
                  <p className="mt-2 border-l-2 border-steel-400 pl-4 text-sm italic leading-relaxed text-navy-700">
                    {f.summary}
                  </p>
                  <h3 className="mt-7 font-display text-sm font-semibold tracking-wide text-navy-900 uppercase">
                    Areas of expertise
                  </h3>
                  <RevealGroup className="mt-4 grid gap-2 sm:grid-cols-2" stagger={0.03}>
                    {f.expertise.map((e) => (
                      <RevealItem key={e}>
                        <div className="flex items-start gap-2.5 text-sm text-navy-700">
                          <HexDot />
                          {e}
                        </div>
                      </RevealItem>
                    ))}
                  </RevealGroup>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
      <CTABand />
    </>
  );
}
