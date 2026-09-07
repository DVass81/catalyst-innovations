import type { Metadata } from "next";
import { Section, Heading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing use of the Catalyst Innovations website.",
};

export default function TermsPage() {
  return (
    <Section className="bg-white pt-40">
      <div className="prose-ci mx-auto">
        <Heading as="h1">Terms of Use</Heading>
        <p className="mt-2 text-sm text-silver-500">
          Placeholder terms — to be reviewed by legal counsel before launch. This draft is
          provided for structure and is not legal advice.
        </p>

        <h2>Use of this website</h2>
        <p>
          This website is provided for informational purposes. Content, including the ROI
          estimator and starting-point assessment, is illustrative and does not constitute
          professional, financial, or legal advice, nor a guarantee of results.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The Catalyst Innovations name, logo, and site content are the property of
          Catalyst Innovations and may not be reproduced without permission.
        </p>

        <h2>Product information</h2>
        <p>
          Items in the Innovation Portfolio are labeled by development status. Concepts and
          in-development products are described as such and are subject to change.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          The website is provided &ldquo;as is&rdquo; without warranties of any kind. Catalyst
          Innovations is not liable for decisions made based on illustrative estimates or
          demo content.
        </p>

        <h2>Changes</h2>
        <p>We may update these terms; continued use constitutes acceptance.</p>
      </div>
    </Section>
  );
}
