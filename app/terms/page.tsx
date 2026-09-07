import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Website Terms of Use",
  description:
    "How to use the Catalyst Innovations website, demonstrations, estimates, and pricing information.",
  alternates: { canonical: "/terms" },
};
export default function TermsPage() {
  return (
    <section className="ci-policy ci-paper">
      <div className="ci-container">
        <p className="ci-eyebrow">USING THIS WEBSITE</p>
        <h1>Website terms of use</h1>
        <p className="ci-policy-date">Updated September 7, 2026</p>
        <div className="ci-policy-content">
          <h2>Information and demonstrations</h2>
          <p>
            This website explains Catalyst Innovations’ services and provides
            illustrative demonstrations and planning tools. Demo names,
            companies, records, and outcomes are fictional. Demo actions do not
            create real purchases, send messages, or book appointments.
          </p>
          <h2>Estimates and pricing</h2>
          <p>
            Calculator results depend on the assumptions you enter and are not
            measured customer results or guaranteed financial outcomes. Project
            ranges are indicative. A written project agreement establishes the
            actual scope, price, ownership, milestones, acceptance criteria, and
            support terms. Submitting an inquiry does not purchase a service.
          </p>
          <p>
            Current general pricing is described on our{" "}
            <Link href="/pricing">pricing page</Link>. Existing signed
            agreements and negotiated pilots retain their own terms.
          </p>
          <h2>Portfolio information</h2>
          <p>
            Portfolio entries are labeled by development status. A concept or
            in-development item is not represented as a delivered customer
            system. Features and availability can change as development
            progresses.
          </p>
          <h2>Responsible use</h2>
          <p>
            Use the site lawfully. Do not attempt to disrupt its operation,
            bypass access controls, or submit harmful material. Do not submit
            confidential credentials or sensitive records through a general
            inquiry.
          </p>
          <h2>Site content and third-party services</h2>
          <p>
            The Catalyst name, mark, and original site content belong to
            Catalyst Innovations. Licensed photographs, fonts, and other
            third-party materials remain subject to their respective licenses.
            External calendars and other linked services have their own terms
            and privacy practices.
          </p>
          <h2>Questions and updates</h2>
          <p>
            Contact us through the <Link href="/contact">contact page</Link>{" "}
            with questions. This page may be updated as the website or services
            change; the date above identifies the latest revision.
          </p>
        </div>
      </div>
    </section>
  );
}
