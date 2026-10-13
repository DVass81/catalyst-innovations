import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Check, ArrowUpRight, Compass, Users, Workflow } from "lucide-react";
import { PageIntro, DiscussCTA } from "@/components/SiteSections";
import PricingGrid from "@/components/PricingGrid";
import EngagementDetails from "@/components/EngagementDetails";
import BookingLink from "@/components/BookingLink";
import CatalystProcess from "@/components/CatalystProcess";
import { discoveryOffer } from "@/data/catalystProcess";
import { pricingTiers, pricingFaqs, formatPriceRange, discoveryFeeLabel, firstYearTotal } from "@/data/pricing";

export const metadata = pageMetadata({
  path: "/pricing",
  title: "Custom Software Pricing — Setup, Support & What’s Included",
  description: `Start with a ${discoveryFeeLabel} discovery visit, waived for our first ${discoveryOffer.foundingPartnerLimit} founding partners. Compare on-site software builds, implementation and support.`,
});
const founding = pricingTiers.find(t => t.id === "founding-partner")!;
const standard = pricingTiers.filter(t => t.id !== "founding-partner");
const foundingTotal = firstYearTotal(founding);
export default function PricingPage() {
  return <>
    <PageIntro eyebrow="Pricing / Built around your business" title="Know the investment. Understand the work."
      text={`Start with a ${discoveryOffer.durationMinutes}-minute discovery visit for ${discoveryFeeLabel}. Then agree on the system, implementation cost and monthly support before we build. The discovery fee is waived for our first ${discoveryOffer.foundingPartnerLimit} founding partners.`} />
    <section className="wrap pricing-overview" aria-label="How pricing works">
      <article><span className="overline">01 / Understand the work</span><h2>Discovery · {discoveryFeeLabel}</h2><p>A {discoveryOffer.durationMinutes}-minute visit to follow one real process and identify practical opportunities. A separate one-time fee, waived for the first {discoveryOffer.foundingPartnerLimit} founding partners.</p></article>
      <article><span className="overline">02 / Build alongside you</span><h2>Implementation</h2><p>The agreed system, development and integrations, applicable data migration, and team training. Scope, investment and on-site arrangements are confirmed in your proposal.</p></article>
      <article><span className="overline">03 / Keep it running</span><h2>Monthly support</h2><p>Hosting, security updates, software updates and the support included in your selected package.</p></article>
    </section>
    <section className="wrap section" id="founding-partners" aria-labelledby="founding-price-heading">
      <div className="founding-price-panel">
        <div>
          <p className="overline">An invitation to our first {discoveryOffer.foundingPartnerLimit} founding partners</p>
          <h2 id="founding-price-heading">Build with the founders.</h2>
          <p>Our Founding Partner program offers a lower entry price with direct access to Josh and Daniel. Discuss your workflow with us to find out whether the program fits.</p>
          <div className="founding-discovery-offer" aria-labelledby="founding-discovery-heading">
            <div className="founding-discovery-price">
              <span>Standard discovery fee</span>
              <del>{discoveryFeeLabel}</del>
              <strong>Free</strong>
            </div>
            <div>
              <p className="founding-offer-label">Your first step, on us</p>
              <h3 id="founding-discovery-heading">Free discovery for our first {discoveryOffer.foundingPartnerLimit} founding partners.</h3>
              <p>A {discoveryOffer.durationMinutes}-minute visit. A real process. A clearer starting point.</p>
            </div>
          </div>
          <div className="founding-costs"><div><strong>{formatPriceRange(founding.oneTimeLow, founding.oneTimeHigh)}</strong><span>one-time implementation</span></div><span aria-hidden="true">+</span><div><strong>{formatPriceRange(founding.monthlyLow, founding.monthlyHigh)}<small>/mo</small></strong><span>ongoing support</span></div></div>
          <p className="founding-year">First-year base total: <strong>{formatPriceRange(foundingTotal.low, foundingTotal.high)}</strong> · discovery fee waived + implementation + 12 monthly payments.</p>
          <Link className="button button-light" href="/consultation">Discuss the Founding Partner program <ArrowUpRight size={17} /></Link>
        </div>
        <div className="founding-inclusions"><h3>What’s included</h3><ul>{founding.features.map(f => <li key={f}><Check size={18} aria-hidden="true" />{f}</li>)}</ul><p>Program eligibility and lifetime-pricing terms are confirmed in your agreement. No signup or payment is taken on this page.</p></div>
      </div>
    </section>
    <section className="section section-white" id="packages">
      <div className="wrap">
        <div className="section-heading"><div><p className="overline">Standard packages</p><h2>A starting point for<br /><em>the system you need.</em></h2></div><p>Compare the scope below. These are pricing ranges; your written proposal defines the features, delivery and support for your business.</p></div>
        <PricingGrid tiers={standard} />
        <div className="pricing-guarantee"><strong>30-day satisfaction guarantee.</strong><p>If your package isn’t the right fit within the first 30 days after implementation, we’ll fix what’s wrong or refund the implementation fee—your choice.</p></div>
        <p className="pricing-note">Standard packages are month-to-month after implementation. Annual billing saves 10% on the recurring price and is paid upfront; discovery and implementation fees are unchanged. First-year base totals include the one-time {discoveryFeeLabel} discovery visit, implementation and support. Your proposal identifies any taxes, third-party services and additional scope.</p>
      </div>
    </section>
    <section className="section wrap pricing-on-site" aria-labelledby="pricing-on-site-heading">
      <div className="section-heading">
        <div><p className="overline">Why we build on site</p><h2 id="pricing-on-site-heading">Built in your business.<br /><em>Shaped by your team.</em></h2></div>
        <p>During the agreed 4–6-week build, we work alongside your team. Continued observation and feedback help us build a system around the way your business actually runs.</p>
      </div>
      <div className="pricing-on-site-benefits">
        <article><Compass size={26} aria-hidden="true" /><h3>See the real workflow.</h3><p>We observe tools, handoffs and workarounds as they happen, so design decisions reflect everyday work.</p></article>
        <article><Users size={26} aria-hidden="true" /><h3>Refine it with your team.</h3><p>The people using the system can test it, flag missing details and help shape practical improvements during the build.</p></article>
        <article><Workflow size={26} aria-hidden="true" /><h3>Practice the actual work.</h3><p>We check agreed workflows and train your team in the context of their tasks before helping put the system into everyday use.</p></article>
      </div>
    </section>
    <CatalystProcess showDiscoveryPricing />
    <section className="wrap section pricing-help"><div><p className="overline">Start with a conversation</p><h2>You don’t need to choose<br /><em>a package first.</em></h2><p>Bring one task that takes too long or one process that loses information. We’ll discuss a useful first version and what it would involve. The 30-minute introductory conversation is separate from the paid {discoveryOffer.durationMinutes}-minute discovery visit.</p></div><div className="pricing-help-actions"><BookingLink /><Link className="text-link" href="/consultation">Tell us about your business ↗</Link><Link className="text-link" href="/tools/project-roi">Explore costs and potential benefits ↗</Link></div></section>
    <EngagementDetails />
    <section className="wrap section faq-section"><div><p className="overline">Pricing questions</p><h2>The details,<br /><em>plainly explained.</em></h2></div><div>{pricingFaqs.map(f => <details key={f.q}><summary>{f.q}<span aria-hidden="true">+</span></summary><p>{f.a}</p></details>)}</div></section>
    <DiscussCTA />
  </>;
}
