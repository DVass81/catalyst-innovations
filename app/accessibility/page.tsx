import type { Metadata } from "next";
import { Section, Heading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Catalyst Innovations' commitment to an accessible web experience (WCAG 2.2 AA target).",
};

export default function AccessibilityPage() {
  return (
    <Section className="bg-white pt-40">
      <div className="prose-ci mx-auto">
        <Heading as="h1">Accessibility Statement</Heading>
        <p className="mt-2 text-sm text-silver-500">Last updated: July 2026.</p>

        <h2>Our commitment</h2>
        <p>
          Catalyst Innovations is committed to a website usable by everyone. We target WCAG
          2.2 Level AA and build accessibility into our design system rather than adding it
          afterward.
        </p>

        <h2>What we&apos;ve implemented</h2>
        <ul>
          <li>Semantic HTML with a correct heading hierarchy on every page.</li>
          <li>Full keyboard navigation with visible focus indicators.</li>
          <li>A skip-to-content link on every page.</li>
          <li>Accessible forms with programmatic labels and clear, associated error messages.</li>
          <li>Reduced-motion alternatives for all animations, honoring your system preference.</li>
          <li>Color contrast meeting AA ratios, and status conveyed by text — never color alone.</li>
          <li>Screen-reader announcements for dynamic content such as form results.</li>
        </ul>

        <h2>Feedback</h2>
        <p>
          If you encounter an accessibility barrier on this site, please tell us through
          the contact page. We treat accessibility issues as defects and prioritize them
          accordingly.
        </p>
      </div>
    </Section>
  );
}
