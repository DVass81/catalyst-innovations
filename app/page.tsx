import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import WorkflowIntro from "@/components/home/WorkflowIntro";
import IndustryShowcase from "@/components/demos/IndustryShowcase";
import HomeContent from "@/components/home/HomeContent";
import StoryJourney, { StoryNavigation } from "@/components/story/StoryJourney";
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: {
    absolute: "Catalyst Innovations — See your business working better",
  },
};
export default function Home() {
  return (
    <StoryJourney>
      <section className="ci-hero" id="possibility">
        <div className="ci-container ci-hero-grid">
          <div className="ci-hero-copy">
            <p className="ci-eyebrow">
              <span /> 01 / FROM SCATTERED TO CONNECTED
            </p>
            <h1>
              See your business
              <br />
              <em>working better.</em>
            </h1>
            <p className="ci-hero-description">
              Custom software, automation, and connected systems built around
              how your business actually works.
            </p>
            <div className="ci-hero-actions">
              <Link className="ci-btn" href="#demos">
                Explore the demos <ArrowUpRight size={19} />
              </Link>
              <Link className="ci-text-link" href="/consultation">
                Talk about your project <ArrowUpRight size={17} />
              </Link>
            </div>
            <p className="ci-hero-footnote">
              The work is yours. Let’s give it a better way forward.
            </p>
          </div>
          <WorkflowIntro />
        </div>
        <div className="ci-container ci-hero-footer">
          <span>LESS CHASING. MORE DOING.</span>
          <a href="#demos">
            Find your industry <ArrowDown size={15} />
          </a>
          <span>KNOXVILLE, TN · BUILT FOR YOUR BUSINESS</span>
        </div>
      </section>
      <StoryNavigation />
      <IndustryShowcase />
      <HomeContent />
    </StoryJourney>
  );
}
