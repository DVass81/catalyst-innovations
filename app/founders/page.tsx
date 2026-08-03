import type { Metadata } from "next";
import Image from "next/image";
import { Section, Eyebrow, Heading, Lead, ButtonLink, HexDot } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import HexPortrait from "@/components/HexPortrait";
import EmailLink from "@/components/EmailLink";
import { founders, partnershipStatement } from "@/data/content";
import CTABand from "@/components/CTABand";
import { founderPhoto as photoFor } from "@/lib/founderPhoto";

export const metadata: Metadata = {
  title: "Founders — Daniel Vass & Josh Ogle",
  description:
    "Daniel Vass brings ~20 years of manufacturing, procurement, and operations leadership. Josh Ogle brings ~10 years of U.S. Army service plus technology and product development expertise.",
};

const personSchema = founders.map((f) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: f.name,
  jobTitle: "Co-Founder",
  worksFor: { "@type": "Organization", name: "Catalyst Innovations" },
}));

export default function FoundersPage() {
  const togetherPhoto = photoFor("together");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <section className="relative overflow-hidden bg-navy-900 pb-20 pt-36 text-white">
        <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <Eyebrow dark>Meet the founders</Eyebrow>
            <Heading dark as="h1">
              One understands the operational problem.
              <br className="hidden sm:block" /> The other engineers the solution.
            </Heading>
            <Lead dark>
              Daniel and Josh connect the boardroom, office, shop floor, purchasing
              department, warehouse, field team, and software environment — because between
              them, they&apos;ve worked in all of them.
            </Lead>
          </Reveal>
        </div>
      </section>

      <Section className="bg-ice-50">
        <div className="space-y-16">
          {founders.map((f, idx) => (
            <Reveal key={f.slug}>
              <article
                id={f.slug}
                className={`grid gap-10 rounded-card border border-ice-200 bg-white p-8 shadow-card sm:p-10 lg:grid-cols-[320px_1fr] ${
                  idx % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <HexPortrait
                    src={photoFor(f.slug)}
                    initials={f.name.split(" ").map((n) => n[0]).join("")}
                    alt={`Portrait of ${f.name}`}
                    size={260}
                  />
                  {!photoFor(f.slug) && (
                    <p className="mt-3 text-xs italic text-silver-500">
                      Headshot placeholder — add /public/founders/{f.slug}.jpg to replace.
                    </p>
                  )}
                </div>
                <div>
                  <h2 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">{f.name}</h2>
                  <p className="mt-1 font-medium text-steel-600">{f.role}</p>
                  <p className="mt-1 text-sm text-silver-500">{f.years} of experience</p>
                  <EmailLink email={f.email} context={f.slug} className="mt-3" />
                  <p className="mt-5 leading-relaxed text-navy-800">{f.bio}</p>
                  <p className="mt-4 border-l-2 border-steel-400 pl-4 text-sm italic leading-relaxed text-navy-700">
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

        <Reveal className="mt-16 overflow-hidden rounded-card bg-navy-900 text-center text-white">
          {togetherPhoto && (
            <div className="relative aspect-[1284/407] w-full">
              <Image
                src={togetherPhoto}
                alt="Daniel Vass and Josh Ogle, co-founders of Catalyst Innovations"
                fill
                sizes="(min-width: 1024px) 900px, 100vw"
                className="object-cover"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/10 to-transparent" />
            </div>
          )}
          <div className="p-10">
            <p className="font-display text-xl font-medium italic sm:text-2xl">
              &ldquo;{partnershipStatement}&rdquo;
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-ice-300">
              Complementary capabilities: Daniel understands operational pain, purchasing,
              manufacturing, process improvement, business value, and customer needs. Josh
              understands technology, development, systems, security, implementation, and
              technical execution.
            </p>
            <div className="mt-8">
              <ButtonLink href="/consultation">Start a conversation with us</ButtonLink>
            </div>
          </div>
        </Reveal>
      </Section>
      <CTABand />
    </>
  );
}
