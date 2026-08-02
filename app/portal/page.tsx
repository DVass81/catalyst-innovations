import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { Section, Eyebrow, Heading, Lead, ButtonLink } from "@/components/ui";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Client Portal",
  description: "The Catalyst Innovations client portal — coming soon for active engagement partners.",
  robots: { index: false },
};

export default function PortalPage() {
  return (
    <Section className="bg-ice-50 min-h-[70vh] pt-40">
      <Reveal className="mx-auto max-w-xl text-center">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full border border-ice-200 bg-white shadow-card">
          <Lock size={26} className="text-steel-600" />
        </span>
        <Eyebrow>Client portal</Eyebrow>
        <Heading as="h1">Coming soon for engagement partners.</Heading>
        <Lead className="mx-auto">
          Active clients will sign in here to view project status, dashboards, documents,
          and support. If you&apos;re working with us and need access, contact your project
          lead directly.
        </Lead>
        <div className="mt-8">
          <ButtonLink href="/consultation">Become a client</ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}
