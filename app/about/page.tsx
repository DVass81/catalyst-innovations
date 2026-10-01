import FounderIntro from "@/components/FounderIntro";
import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, DiscussCTA } from "@/components/SiteSections";
export const metadata: Metadata = {
  title: "About Catalyst Innovations",
  description:
    "Operations experience and custom software, brought together to help businesses work better. Based in Knoxville, Tennessee.",
};
export default function About() {
  return (
    <>
      <PageIntro
        eyebrow="About Catalyst / Knoxville, Tennessee"
        title="We understand the work behind the software."
        text="Catalyst brings operational experience and software development together. We care about whether a system makes the work easier for the people using it."
      />
      <section className="wrap content-section two-grid">
        <p className="about-story">
          The best starting point isn’t a feature list. It’s a conversation with
          the people doing the work.
        </p>
        <div>
          <p>
            Our experience includes production floors and purchasing
            departments—places where missing information, repeated tasks and
            disconnected systems have a real cost.
          </p>
          <p style={{ marginTop: 20 }}>
            That background shapes how we build. We ask what slows your team
            down, understand the handoffs, and create software around the
            process.
          </p>
          <Link className="text-link" href="/founders">
            Meet the team ↗
          </Link>
        </div>
      </section>
      <section className="wrap content-section three-grid">
        {[
          [
            "Understand first.",
            "Your team knows the work. We listen before recommending a solution.",
          ],
          [
            "Make it useful.",
            "Clear workflows and practical tools come before a long list of features.",
          ],
          [
            "Build together.",
            "Feedback from the people using the system shapes what comes next.",
          ],
        ].map(([h, p]) => (
          <div className="content-card about-block" key={h}>
            <h2>{h}</h2>
            <p>{p}</p>
          </div>
        ))}
      </section>
      <FounderIntro />
      <DiscussCTA />
    </>
  );
}
