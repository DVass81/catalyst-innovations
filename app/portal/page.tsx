import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { Section, Eyebrow, Heading, Lead, ButtonLink } from "@/components/ui";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/portal" },
  title: "Client Portal",
  description:
    "Contact your Catalyst Innovations project team for current project access and support.",
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
        <Heading as="h1">Your project. Your team.</Heading>
        <Lead className="mx-auto">
          For project updates, document access or support, contact your project
          lead through your agreed project channel. If you need help reaching
          the team, our contact page lists both founders.
        </Lead>
        <div className="mt-8">
          <ButtonLink href="/contact">Contact your team</ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}
