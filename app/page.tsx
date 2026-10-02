import RealSoftwarePreview from "@/components/RealSoftwarePreview";
import { LogoLockup } from "@/components/Logo";
import FounderIntro from "@/components/FounderIntro";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import VisualStory from "@/components/VisualStory";
import StoryFilm from "@/components/StoryFilm";
import IndustrySelector from "@/components/IndustrySelector";
import { DiscussCTA, SolutionCards, Projects } from "@/components/SiteSections";
import SavingsPreview from "@/components/SavingsPreview";
export const metadata: Metadata = {
  alternates: { canonical: '/' },
  title: "Catalyst Innovations — Custom software. A better-running business.",
  description:
    "Custom software that connects your customers, jobs, inventory, purchasing and accounting. Built around the way your business works.",
};
export default function Home() {
  return (
    <>
      <section className="hero hero-editorial wrap">
        <div className="hero-copy">
          <div className="hero-brand">
            <LogoLockup variant="light-bg" hero />
          </div>
          <p className="overline">
            <span className="live-dot" /> Custom business software & automation
          </p>
          <h1>
            Custom software.
            <br />A better-running <em>business.</em>
          </h1>
          <p className="hero-description">
            We build the tools your business needs to manage customers, run jobs,
            track inventory and bring your numbers together. Replace repeated
            paperwork and disconnected spreadsheets with one clearer way to work.
          </p>
          <div className="hero-actions">
            <Link href="/consultation" className="button">
              Discuss my business <ArrowUpRight size={18} />
            </Link>
            <Link href="/portfolio" className="text-link">
              See the actual software <ArrowRight size={16} />
            </Link>
          </div>
          <p className="hero-footnote">
            For business owners and teams. Built around your process and the tools you already use.
          </p>
        </div>
        <RealSoftwarePreview />
      </section>
      <div className="benefit-strip">
        <div className="wrap">
          <span>ONE CONNECTED BUSINESS</span>
          <span>Customers</span>
          <i>+</i>
          <span>Operations</span>
          <i>+</i>
          <span>Your numbers</span>
        </div>
      </div>
      <section className="section wrap" id="how-it-works">
        <div className="section-heading">
          <div>
            <p className="overline">01 / A better way to work</p>
            <h2>
              Goodbye, disconnected tasks.
              <br />
              Hello, <em>forward motion.</em>
            </h2>
          </div>
          <p>
            A customer calls. The details should move with the work—not get
            typed into five different places.
          </p>
        </div>
        <VisualStory kind="comparison" />
        <StoryFilm />
      </section>
      <section className="section section-white">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="overline">02 / What we build</p>
              <h2>
                The right tools.
                <br />
                Built around <em>your business.</em>
              </h2>
            </div>
            <p>
              Start with one frustrating process or connect the whole operation.
              We build what your team actually needs.
            </p>
          </div>
          <SolutionCards />
        </div>
      </section>
      <section className="section section-white">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="overline">03 / From ideas to useful software</p>
              <h2>
                Real work.
                <br />
                <em>Practical possibilities.</em>
              </h2>
            </div>
            <Link href="/portfolio" className="text-link">
              See what we build <ArrowUpRight size={17} />
            </Link>
          </div>
          <Projects />
        </div>
      </section>
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <p className="overline">04 / Made for your kind of work</p>
            <h2>
              Different businesses.
              <br />
              <em>Familiar challenges.</em>
            </h2>
          </div>
          <p>
            From a service crew to a warehouse to a community organization, we
            start by understanding how you work.
          </p>
        </div>
        <IndustrySelector />
      </section>
      <section className="section wrap">
        <SavingsPreview />
      </section>
      <FounderIntro />
      <section className="section process-section">
        <div className="wrap">
          <p className="overline">How we work together</p>
          <h2>
            We listen. We build.
            <br />
            <em>We make it work.</em>
          </h2>
          <div className="three-grid process-grid">
            {[
              [
                "01",
                "Show us one sticking point.",
                "Bring a repeated task, a spreadsheet or a process that slows your team down. We’ll talk through how it works today and what you want to improve.",
              ],
              [
                "02",
                "Agree on a useful first step.",
                "We define what the system needs to do, what it should connect to and the proposed scope and cost before building. You can start with one process.",
              ],
              [
                "03",
                "Launch and improve.",
                "We help your team put it to work and refine the system as your business evolves.",
              ],
            ].map(([n, h, p]) => (
              <div key={n}>
                <span>{n}</span>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section wrap faq-section">
        <div>
          <p className="overline">A few good questions</p>
          <h2>
            Let’s make
            <br />
            <em>this simple.</em>
          </h2>
        </div>
        <div>
          {[
            [
              "Do we need to replace all our software?",
              "Not necessarily. We can connect useful existing tools, build a missing piece, or develop a more complete system. We start with your needs.",
            ],
            [
              "Can you work with our industry?",
              "We work across a range of businesses and organizations. If your team has repetitive tasks, scattered information or disconnected tools, there may be a useful place to start.",
            ],
            [
              "What does a project cost?",
              "The scope determines the investment. Discuss your needs with us or visit our pricing page for the current packages. Calculator examples are not project quotes.",
            ],
            [
              "Are the calculator results guaranteed?",
              "No. They are estimates based on the numbers and assumptions you enter. Time returned, potential revenue and cash savings are shown separately.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span>+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <DiscussCTA />
    </>
  );
}
