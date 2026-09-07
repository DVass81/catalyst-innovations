import type { Metadata } from "next";
import { site } from "@/lib/site";
export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "Accessibility features, motion controls, and how to report a problem using the Catalyst Innovations website.",
  alternates: { canonical: "/accessibility" },
};
export default function AccessibilityPage() {
  return (
    <section className="ci-policy ci-paper">
      <div className="ci-container">
        <p className="ci-eyebrow">BUILT FOR PEOPLE</p>
        <h1>Accessibility</h1>
        <div className="ci-policy-content">
          <p>
            We aim to make this website usable with different devices and
            assistive technologies, using WCAG 2.2 Level AA as a design and
            testing target.
          </p>
          <h2>Ways to use the site</h2>
          <ul>
            <li>
              Navigate with a keyboard and use the skip link to reach the main
              content.
            </li>
            <li>Use arrow keys to move between industry demo tabs.</li>
            <li>
              Pause or replay the opening animation. Your device’s
              reduced-motion preference simplifies motion automatically.
            </li>
            <li>
              Increase text size or zoom the page. Content is designed to reflow
              on smaller screens.
            </li>
            <li>
              Use labeled controls and status messages in the demos, calculator,
              and inquiry form.
            </li>
          </ul>
          <h2>External services</h2>
          <p>
            The booking calendar is provided by an external service. If the
            embedded calendar is difficult to use, open its direct link or email
            the team to arrange a conversation.
          </p>
          <h2>Report a problem</h2>
          <p>
            Email{" "}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> with
            the page, what you were trying to do, and the device or assistive
            technology involved. Please avoid sending sensitive information. We
            will review the problem and help you access the information or
            service you need.
          </p>
        </div>
      </div>
    </section>
  );
}
