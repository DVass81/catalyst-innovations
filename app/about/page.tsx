import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { coreValues } from "@/data/content";
export const metadata: Metadata = {
  title: "About — Operations experience meets engineering",
  description:
    "Daniel Vass and Josh Ogle combine practical operations experience with technology and product development to build systems around your business.",
  alternates: { canonical: "/about" },
};
export default function AboutPage() {
  return (
    <>
      <section className="ci-page-hero">
        <div className="ci-container">
          <p className="ci-eyebrow">WHY CATALYST EXISTS</p>
          <h1>
            Good people deserve
            <br />
            <span>better systems.</span>
          </h1>
          <p>
            The work is already demanding. Finding the information,
            <br />
            chasing the approval, or updating the spreadsheet shouldn’t make it
            harder.
          </p>
        </div>
      </section>
      <section className="ci-section ci-paper">
        <div className="ci-container ci-about-intro">
          <div>
            <p className="ci-eyebrow">OPERATIONS + ENGINEERING</p>
            <h2 className="ci-heading">
              Understand the work.
              <br />
              Then build what helps.
            </h2>
          </div>
          <div>
            <p>
              Catalyst Innovations brings two perspectives to the same problem:
              how a business operates, and how technology can help it operate
              better.
            </p>
            <p>
              Daniel Vass brings experience in manufacturing, procurement,
              supply chain, and continuous improvement. Josh Ogle brings IT
              systems, software development, and technical delivery experience.
            </p>
            <p>
              Together, we map the workflow, define a practical scope, and build
              a system around the people who will use it.
            </p>
            <Link href="/founders" className="ci-text-link">
              Meet Daniel and Josh <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="ci-section ci-method-section">
        <div className="ci-container">
          <div className="ci-section-intro">
            <div>
              <p className="ci-eyebrow">HOW WE WORK</p>
              <h2 className="ci-heading">
                A practical partnership.
                <br />
                <span>From the first conversation.</span>
              </h2>
            </div>
            <p>
              Start with one priority. Make the proposed workflow visible. Agree
              the scope. Build, test, and support the handover.
            </p>
          </div>
          <div className="ci-about-principles">
            {[
              [
                "Listen before building",
                "The people doing the work help define the problem and judge whether the solution fits.",
              ],
              [
                "Make decisions visible",
                "Prototypes, clear milestones, and documented scope keep everyone working toward the same outcome.",
              ],
              [
                "Keep people in control",
                "Automation supports the team. Important decisions remain subject to the right human review.",
              ],
            ].map(([t, d]) => (
              <div key={t}>
                <Check size={23} />
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
          <Link href="/method" className="ci-text-link">
            Explore the Catalyst Method <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <section className="ci-section ci-paper">
        <div className="ci-container">
          <p className="ci-eyebrow">WHAT GUIDES US</p>
          <h2 className="ci-heading">The way we do the work matters.</h2>
          <div className="ci-values">
            {coreValues.map((v, i) => (
              <article key={v.title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="ci-closing">
        <div className="ci-container">
          <h2>
            Your business has its own way.
            <br />
            <span>Let’s make it work better.</span>
          </h2>
          <div>
            <p>Based in Knoxville, Tennessee. Building around your business.</p>
            <Link href="/consultation" className="ci-btn">
              Start a conversation <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
