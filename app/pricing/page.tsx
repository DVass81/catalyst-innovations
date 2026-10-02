import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowUpRight } from "lucide-react";
import { PageIntro, DiscussCTA } from "@/components/SiteSections";
import PricingGrid from "@/components/PricingGrid";
import EngagementDetails from "@/components/EngagementDetails";
import BookingLink from "@/components/BookingLink";
import { pricingTiers, pricingFaqs, formatPriceRange } from "@/data/pricing";

export const metadata: Metadata = {
  alternates: { canonical: "/pricing" },
  title: "Custom Software Pricing — Setup, Support & What’s Included",
  description: "Compare Catalyst’s Founding Partner, Essentials, Professional and Executive software packages. Clear implementation costs, monthly support and first-year totals.",
};
const founding = pricingTiers.find(t => t.id === "founding-partner")!;
const standard = pricingTiers.filter(t => t.id !== "founding-partner");
export default function PricingPage() {
  return <>
    <PageIntro eyebrow="Pricing / Built around your business" title="Know the investment. Understand the work."
      text="One implementation cost to build your system. One monthly investment to keep it hosted, supported and maintained. Start with your process; we’ll agree on the scope and exact price before you commit." />
    <section className="wrap pricing-overview" aria-label="How pricing works">
      <article><span className="overline">01 / Build it</span><h2>Implementation</h2><p>Discovery, agreed development and integrations, applicable data migration, and team training.</p></article>
      <article><span className="overline">02 / Keep it running</span><h2>Monthly support</h2><p>Hosting, security updates, software updates and the support included in your selected package.</p></article>
      <article><span className="overline">03 / Agree the details</span><h2>A defined scope</h2><p>Confirm included features, third-party charges, future changes and responsibilities in your proposal.</p></article>
    </section>
    <section className="wrap section" aria-labelledby="founding-price-heading">
      <div className="founding-price-panel">
        <div>
          <p className="overline">An invitation to our first 10 strategic partners</p>
          <h2 id="founding-price-heading">Build with the founders.</h2>
          <p>Our Founding Partner program offers a lower entry price with direct access to Josh and Daniel. Discuss your workflow with us to find out whether the program fits.</p>
          <div className="founding-costs"><div><strong>{formatPriceRange(founding.oneTimeLow, founding.oneTimeHigh)}</strong><span>one-time implementation</span></div><span aria-hidden="true">+</span><div><strong>{formatPriceRange(founding.monthlyLow, founding.monthlyHigh)}<small>/mo</small></strong><span>ongoing support</span></div></div>
          <p className="founding-year">First-year base total: <strong>{formatPriceRange(founding.oneTimeLow + founding.monthlyLow * 12, founding.oneTimeHigh + founding.monthlyHigh * 12)}</strong> · implementation + 12 monthly payments.</p>
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
        <p className="pricing-note">Standard packages are month-to-month after implementation. Annual billing saves 10% on the recurring price and is paid upfront. Implementation is unchanged. Totals shown cover base package pricing; your proposal identifies any taxes, third-party services and additional scope.</p>
      </div>
    </section>
    <section className="wrap section pricing-help"><div><p className="overline">Start with a conversation</p><h2>You don’t need to choose<br /><em>a package first.</em></h2><p>Bring one task that takes too long or one process that loses information. We’ll discuss a useful first version and what it would involve.</p></div><div className="pricing-help-actions"><BookingLink /><Link className="text-link" href="/consultation">Tell us about your business ↗</Link><Link className="text-link" href="/tools/project-roi">Explore costs and potential benefits ↗</Link></div></section>
    <EngagementDetails />
    <section className="wrap section faq-section"><div><p className="overline">Pricing questions</p><h2>The details,<br /><em>plainly explained.</em></h2></div><div>{pricingFaqs.map(f => <details key={f.q}><summary>{f.q}<span aria-hidden="true">+</span></summary><p>{f.a}</p></details>)}</div></section>
    <DiscussCTA />
  </>;
}
