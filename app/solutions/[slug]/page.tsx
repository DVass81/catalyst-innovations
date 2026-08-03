import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Section, Heading, Lead, HexFrame, ButtonLink } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import { services as localServices } from "@/data/services";
import { getServiceBySlug, getIndustries } from "@/lib/cms";
import { viewTransitionStyle } from "@/lib/viewTransitionStyle";
import CTABand from "@/components/CTABand";

export function generateStaticParams() {
  // Static params must be known at build time — local slugs cover every
  // CMS-managed service too, since slugs are expected to stay stable.
  return localServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = await getServiceBySlug(slug);
  if (!s) return {};
  return { title: s.title, description: s.tagline + " " + s.keyMessage };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getServiceBySlug(slug);
  if (!s) notFound();

  const industries = await getIndustries();
  const relatedIndustries = industries.filter((i) => i.related.includes(s.slug)).slice(0, 6);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.description,
    provider: { "@type": "Organization", name: "Catalyst Innovations" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <section className="relative overflow-hidden bg-navy-900 pb-20 pt-36 text-white">
        <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
        <div aria-hidden="true" className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-steel-400/20 blur-[100px]" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-silver-400">
              <Link href="/solutions" className="hover:text-white">Solutions</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <span className="text-ice-300">{s.navLabel}</span>
            </nav>
            <div className="flex items-start gap-5">
              <div style={viewTransitionStyle(`solution-icon-${s.slug}`)}>
                <HexFrame dark><Icon name={s.icon} size={24} /></HexFrame>
              </div>
              <div>
                <Heading dark as="h1">{s.title}</Heading>
                <Lead dark>{s.tagline}</Lead>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Section className="bg-ice-50">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Reveal>
              <p className="text-lg leading-relaxed text-navy-800">{s.description}</p>
              <blockquote className="mt-8 border-l-4 border-steel-400 bg-white p-6 font-display text-lg font-medium text-navy-900 shadow-card rounded-r-card">
                {s.keyMessage}
              </blockquote>
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="font-display text-xl font-semibold text-navy-900">Capabilities</h2>
            </Reveal>
            <RevealGroup className="mt-6 grid gap-2.5 sm:grid-cols-2" stagger={0.03}>
              {s.capabilities.map((c) => (
                <RevealItem key={c}>
                  <div className="flex items-start gap-2.5 rounded-lg bg-white px-4 py-3 text-sm text-navy-800 shadow-[0_1px_3px_rgb(5_11_22/0.06)]">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-steel-500" />
                    {c}
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <aside>
            <Reveal delay={0.1}>
              <div className="rounded-card border border-ice-200 bg-white p-7 shadow-card lg:sticky lg:top-24">
                <h2 className="font-display text-base font-semibold text-navy-900">What this produces</h2>
                <ul className="mt-4 space-y-3">
                  {s.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2.5 text-sm text-navy-700">
                      <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-steel-400" />
                      {o}
                    </li>
                  ))}
                </ul>

                {relatedIndustries.length > 0 && (
                  <>
                    <h2 className="mt-8 font-display text-base font-semibold text-navy-900">Common fits</h2>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {relatedIndustries.map((i) => (
                        <li key={i.slug}>
                          <Link
                            href={`/industries#${i.slug}`}
                            className="inline-block rounded-full border border-ice-200 bg-ice-50 px-3 py-1.5 text-xs font-medium text-navy-800 hover:border-steel-400/50"
                          >
                            {i.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <ButtonLink href="/consultation" className="mt-8 w-full">
                  Discuss this with us
                </ButtonLink>
                <Link
                  href="/start"
                  className="mt-3 inline-flex w-full items-center justify-center gap-1 text-sm font-medium text-steel-600 hover:underline"
                >
                  Not sure where to start? <ArrowRight size={14} />
                </Link>
              </div>
            </Reveal>
          </aside>
        </div>
      </Section>
      <CTABand />
    </>
  );
}
