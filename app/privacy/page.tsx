import type { Metadata } from "next";
import { Section, Heading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Catalyst Innovations collects, uses, and protects information.",
};

export default function PrivacyPage() {
  return (
    <Section className="bg-white pt-40">
      <div className="prose-ci mx-auto">
        <Heading as="h1">Privacy Policy</Heading>
        <p className="mt-2 text-sm text-silver-500">
          Placeholder policy — to be reviewed by legal counsel before launch. This draft is
          provided for structure and is not legal advice.
        </p>

        <h2>Information we collect</h2>
        <p>
          When you submit a consultation request or contact form, we collect the
          information you provide: name, company, contact details, and the description of
          your inquiry. We use privacy-conscious analytics that do not build personal
          profiles.
        </p>

        <h2>How we use it</h2>
        <ul>
          <li>To respond to your inquiry and provide requested services.</li>
          <li>To improve our website and offerings.</li>
          <li>We do not sell your personal information.</li>
        </ul>

        <h2>Data retention & security</h2>
        <p>
          We retain inquiry data only as long as needed for the purpose it was provided,
          and apply reasonable technical safeguards to protect it.
        </p>

        <h2>Your choices</h2>
        <p>
          You may request access to, correction of, or deletion of your information by
          contacting us through the contact page.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy can be sent via our contact page.
        </p>
      </div>
    </Section>
  );
}
