import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, ArrowRight } from "lucide-react";
import PricingGrid from "@/components/PricingGrid";
import { pricingTiers, pricingFaqs, supportPlans } from "@/data/pricing";
export const metadata: Metadata = {
  title: "Pricing — Clear scope, clear investment",
  description:
    "Free initial conversation. $1,500 Solution Blueprint. Custom projects from $5,000 and optional support from $350 per month.",
  alternates: { canonical: "/pricing" },
};
export default function PricingPage() {
  return (
    <>
      <section className="ci-page-hero">
        <div className="ci-container">
          <p className="ci-eyebrow">PRICING, PLAINLY EXPLAINED</p>
          <h1>
            A clear scope.
            <br />
            <span>A clear investment.</span>
          </h1>
          <p>
            Start with a conversation. Understand the work.
            <br />
            Get a fixed proposal before we build.
          </p>
          <Link href="/consultation" className="ci-btn">
            Book a free conversation <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="ci-section ci-paper" id="blueprint">
        <div className="ci-container">
          <div className="ci-blueprint ci-blueprint-full">
            <div>
              <p className="ci-eyebrow">START WITH CLARITY</p>
              <h2>Solution Blueprint</h2>
              <p>
                A practical plan for one priority workflow. You keep it whether
                or not you continue with Catalyst.
              </p>
              <ul>
                {[
                  "Stakeholder interviews and workflow review",
                  "A process map and recommendations",
                  "A clearly scoped implementation proposal",
                ].map((t) => (
                  <li key={t}>
                    <Check size={16} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <strong>$1,500</strong>
              <span>Paid upfront · USD</span>
              <p>
                Fully credited against your kickoff payment when implementation
                is booked within 60 days.
              </p>
              <Link
                href="/consultation?scope=blueprint"
                className="ci-btn ci-btn-outline"
              >
                Discuss a Blueprint <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
          <p className="ci-small-note">
            The Blueprint covers one priority workflow. Multi-department
            discovery is quoted separately.
          </p>
        </div>
      </section>
      <section className="ci-section ci-paper ci-section-compact">
        <div className="ci-container">
          <p className="ci-eyebrow">BUILD WHAT YOUR BUSINESS NEEDS</p>
          <h2 className="ci-heading">Three ways a project can take shape.</h2>
          <PricingGrid tiers={pricingTiers} />
          <div className="ci-included">
            <Check size={20} />
            <p>
              Every project includes design, implementation, testing,
              documentation, training, and{" "}
              <strong>30 days of fixes for defects in the agreed scope.</strong>{" "}
              New features are scoped separately.
            </p>
          </div>
          <div className="ci-payment-milestones">
            {[
              ["50%", "At kickoff"],
              ["30%", "At the agreed demo milestone"],
              ["20%", "At acceptance"],
            ].map(([n, t]) => (
              <div key={n}>
                <strong>{n}</strong>
                <span>{t}</span>
              </div>
            ))}
          </div>
          <p className="ci-small-note">
            An eligible Blueprint credit reduces the kickoff payment. Your
            proposal confirms the scope, milestones, and acceptance criteria.
          </p>
        </div>
      </section>
      <section className="ci-section ci-dark" id="support">
        <div className="ci-container">
          <div className="ci-section-intro">
            <div>
              <p className="ci-eyebrow">OPTIONAL ONGOING SUPPORT</p>
              <h2 className="ci-heading">
                Keep your system
                <br />
                working for you.
              </h2>
            </div>
            <p>
              Choose the level of maintenance, support, and improvement time
              that fits your team.
            </p>
          </div>
          <div className="ci-support-grid">
            {supportPlans.map((p) => (
              <article key={p.name}>
                <h3>{p.name}</h3>
                <p className="ci-support-price">
                  ${p.price.toLocaleString("en-US")}
                  <span>/month</span>
                </p>
                <p>Up to {p.hours} hours per month</p>
                <p>{p.description}</p>
                <Link
                  href={`/consultation?scope=support-${p.name.toLowerCase()}`}
                  className="ci-text-link"
                >
                  Discuss {p.name} <ArrowUpRight size={17} />
                </Link>
              </article>
            ))}
          </div>
          <div className="ci-support-terms">
            <p>
              Month to month, with 30 days’ cancellation notice. All labor,
              including meetings, counts toward your allowance. Unused hours
              expire monthly.
            </p>
            <p>
              Additional work requires approval at $175/hour or a fixed quote.
              Standard support is during business hours; emergency coverage
              requires a separate arrangement.
            </p>
          </div>
        </div>
      </section>
      <section className="ci-section ci-paper">
        <div className="ci-container ci-faq-layout">
          <div>
            <p className="ci-eyebrow">THE DETAILS MATTER</p>
            <h2 className="ci-heading">
              Know what
              <br />
              you’re agreeing to.
            </h2>
            <p className="ci-body-copy">
              Hosting, AI usage, software subscriptions, travel, and specialist
              third-party services are disclosed separately.
            </p>
            <Link href="/roi-estimator" className="ci-text-link">
              Estimate the opportunity <ArrowRight size={16} />
            </Link>
          </div>
          <div className="ci-faqs">
            {pricingFaqs.map((f) => (
              <details key={f.q}>
                <summary>
                  {f.q}
                  <span>+</span>
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="ci-closing">
        <div className="ci-container">
          <h2>
            Start with a conversation.
            <br />
            <span>Leave with a next step.</span>
          </h2>
          <div>
            <p>A free 30-minute conversation about what you want to improve.</p>
            <Link href="/consultation" className="ci-btn">
              Let’s talk <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
