import Link from "next/link";
import {
  ArrowUpRight,
  Plus,
  Check,
  Layers3,
  Workflow,
  PlugZap,
} from "lucide-react";
import PricingGrid from "@/components/PricingGrid";
import { pricingTiers } from "@/data/pricing";
const methods = [
  ["Understand", "We listen to your team and follow the work."],
  ["Map", "We identify the bottlenecks and define the opportunity."],
  ["Prototype", "You see the proposed workflow before the full build."],
  ["Build", "We develop, connect, and test the agreed solution."],
  ["Launch", "We train your team and support the handover."],
  ["Improve", "We refine the system as your business changes."],
];
const faqs = [
  [
    "Can you work with the tools we already use?",
    "Yes, where the tools provide suitable integration options. We assess access, data quality, and technical limits during discovery, then agree the integration scope.",
  ],
  [
    "Do we need to know what software to ask for?",
    "No. Start with the work that is slow, repetitive, or difficult to see. We help define what should change before deciding what to build.",
  ],
  [
    "How do you use AI?",
    "Where it helps with a specific task, such as finding information or preparing a draft. Important decisions keep a human approval step, and access is designed around your requirements.",
  ],
  [
    "How does a project start?",
    "With a free 30-minute conversation. If there is a good fit, the $1,500 Solution Blueprint maps one priority workflow and provides a scoped proposal.",
  ],
  [
    "Are these demonstrations customer systems?",
    "No. The demonstrations use fictional data to show possible workflows. Customer stories will be published only with permission.",
  ],
];
export default function HomeContent() {
  return (
    <>
      <section className="ci-section ci-paper">
        <div className="ci-container">
          <div className="ci-section-intro">
            <div>
              <p className="ci-eyebrow">02 / MADE FOR YOUR BUSINESS</p>
              <h2 className="ci-heading">
                Your process is unique.
                <br />
                Your system should fit.
              </h2>
            </div>
            <p>
              Start with what needs to work better. We bring the operational
              understanding and the technical capability to build it.
            </p>
          </div>
          <div className="ci-capabilities">
            {[
              [
                Layers3,
                "Custom software",
                "A useful workspace, built around the decisions your team makes.",
                "custom-software",
              ],
              [
                Workflow,
                "Practical automation",
                "Move information and routine tasks forward with clear rules and human oversight.",
                "ai-automation",
              ],
              [
                PlugZap,
                "Connected systems",
                "Bring your existing tools together so the same information does not need to be entered twice.",
                "integrations-consulting",
              ],
            ].map(([Icon, title, body, slug]) => {
              const I = Icon as typeof Layers3;
              return (
                <Link href={`/solutions/${slug}`} key={String(slug)}>
                  <I size={29} strokeWidth={1.4} />
                  <h3>{String(title)}</h3>
                  <p>{String(body)}</p>
                  <ArrowUpRight className="ci-capability-arrow" size={21} />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <section className="ci-section ci-method-section">
        <div className="ci-container">
          <div className="ci-section-intro">
            <div>
              <p className="ci-eyebrow">03 / A CLEAR WAY FORWARD</p>
              <h2 className="ci-heading">
                From “there has to
                <br />
                be a better way”
                <br />
                <span>to working better.</span>
              </h2>
            </div>
            <div>
              <p>
                A shared plan. A working prototype. A team that understands what
                comes next.
              </p>
              <Link href="/method" className="ci-text-link">
                The Catalyst Method <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
          <ol className="ci-method-steps">
            {methods.map(([title, body], i) => (
              <li key={title}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="ci-section ci-paper" id="investment">
        <div className="ci-container">
          <div className="ci-section-intro">
            <div>
              <p className="ci-eyebrow">04 / A CLEAR INVESTMENT</p>
              <h2 className="ci-heading">
                Start with the problem.
                <br />
                Know the investment.
              </h2>
            </div>
            <p>
              Scope-based project pricing. A fixed quote before we build.
              Ongoing support when you need it.
            </p>
          </div>
          <div className="ci-blueprint">
            <div>
              <span>START WITH CLARITY</span>
              <h3>Solution Blueprint</h3>
              <p>
                One priority workflow. A process map. A practical recommendation
                and scoped proposal.
              </p>
            </div>
            <div>
              <strong>$1,500</strong>
              <span>
                Credited toward implementation
                <br />
                booked within 60 days.
              </span>
            </div>
            <Link href="/pricing#blueprint" className="ci-btn ci-btn-outline">
              See what’s included <ArrowUpRight size={17} />
            </Link>
          </div>
          <PricingGrid tiers={pricingTiers} />
          <div className="ci-pricing-foot">
            <p>
              Optional support from $350/month. Hosting, software, AI usage, and
              other third-party costs are disclosed separately.
            </p>
            <Link href="/pricing" className="ci-text-link">
              Full pricing & terms <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="ci-section ci-founder-section">
        <div className="ci-container">
          <div className="ci-section-intro">
            <div>
              <p className="ci-eyebrow">05 / THE PEOPLE BEHIND THE WORK</p>
              <h2 className="ci-heading">
                Operations experience.
                <br />
                Engineering capability.
                <br />
                <span>One team.</span>
              </h2>
            </div>
            <p>
              Daniel understands how work happens on the ground. Josh turns that
              understanding into systems people can use. You work directly with
              the founders.
            </p>
          </div>
          <div className="ci-founder-grid">
            {[
              [
                "DV",
                "Daniel Vass",
                "Operations & Business Transformation",
                "Manufacturing, procurement, supply chain, and continuous improvement.",
                "daniel-vass",
              ],
              [
                "JO",
                "Josh Ogle",
                "Technology & Product Development",
                "Systems, IT, and software development grounded in practical delivery.",
                "josh-ogle",
              ],
            ].map(([initials, name, role, bio, slug]) => (
              <Link href={`/founders#${slug}`} key={slug}>
                <span className="ci-founder-initials">
                  {initials}
                  <span>CO-FOUNDER</span>
                </span>
                <div>
                  <h3>{name}</h3>
                  <p className="ci-founder-role">{role}</p>
                  <p>{bio}</p>
                </div>
                <ArrowUpRight size={22} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="ci-section ci-paper">
        <div className="ci-container ci-faq-layout">
          <div>
            <p className="ci-eyebrow">A FEW GOOD QUESTIONS</p>
            <h2 className="ci-heading">
              Let’s make
              <br />
              things clear.
            </h2>
            <Link href="/consultation" className="ci-text-link">
              Ask us something else <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="ci-faqs">
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <Plus size={18} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="ci-closing">
        <div className="ci-container">
          <p className="ci-eyebrow">LET’S BUILD YOUR BETTER WAY</p>
          <h2>
            What’s the one thing
            <br />
            you wish <span>worked better?</span>
          </h2>
          <div>
            <p>Tell us about it. We’ll start with a conversation.</p>
            <Link href="/consultation" className="ci-btn">
              Talk about your project <ArrowUpRight size={20} />
            </Link>
          </div>
          <span className="ci-closing-note">
            <Check size={14} /> Free 30-minute conversation · No obligation
          </span>
        </div>
      </section>
    </>
  );
}
