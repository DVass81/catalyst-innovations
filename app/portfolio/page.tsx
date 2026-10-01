import type { Metadata } from "next";
import { PageIntro, Projects, DiscussCTA } from "@/components/SiteSections";
export const metadata: Metadata = {
  title: "See What We Build",
  description:
    "Explore actual community, flooring and painting software screens in three guided previews from Catalyst Innovations.",
};
export default function Work() {
  return (
    <>
      <PageIntro
        eyebrow="See what we build"
        title="Real software. A clearer picture of what’s possible."
        text="Explore three short walkthroughs of actual application screens. See how a request, a room measurement or a painting scope becomes a useful next step."
      />
      <section className="wrap content-section">
        <Projects detailed />
        <p className="muted" style={{ fontSize: 12, marginTop: 25 }}>
          Screens are cropped from actual applications. Client branding and
          account details are excluded. Figures are sample inputs, not verified
          business results. Painting is a recovered local prototype for a
          planned system.
        </p>
      </section>
      <DiscussCTA />
    </>
  );
}
