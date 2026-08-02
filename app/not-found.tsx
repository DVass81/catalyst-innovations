import { Section, Heading, Lead, ButtonLink } from "@/components/ui";
import { CatalystMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <Section className="bg-ice-50 min-h-[70vh] pt-44">
      <div className="mx-auto max-w-xl text-center">
        <CatalystMark size={56} className="mx-auto opacity-60" />
        <Heading as="h1" className="mt-6">This page took a wrong turn.</Heading>
        <Lead className="mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back to
          something useful.
        </Lead>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/solutions" variant="ghost-light">Explore solutions</ButtonLink>
        </div>
      </div>
    </Section>
  );
}
