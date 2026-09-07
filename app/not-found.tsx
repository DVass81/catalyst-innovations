import { ButtonLink } from "@/components/ui";
import { CatalystMark } from "@/components/Logo";

/**
 * "You've stepped off the path." Ties the 404 into the portal narrative —
 * lost in the warp between the two worlds — instead of a generic error page.
 */
export default function NotFound() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-navy-950 px-5 py-24 text-center text-white">
      <div className="warp-lines absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="grain absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-steel-400/15 blur-[100px]"
      />
      <div className="relative mx-auto max-w-xl">
        <CatalystMark size={56} className="mx-auto opacity-50" />
        <p className="mt-6 font-mono text-xs tracking-[0.3em] text-[#7ee694] opacity-80">
          404 · CONNECTION UNSTABLE
        </p>
        <h1 className="mt-4 font-grotesk text-3xl font-semibold leading-tight sm:text-4xl">
          You&apos;ve stepped off the path.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-ice-300">
          Somewhere between the old world and the new, this page doesn&apos;t exist — or
          hasn&apos;t been built yet. Let&apos;s get you back on solid ground.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ButtonLink href="/">Back to the beginning</ButtonLink>
          <ButtonLink href="/solutions" variant="ghost-dark">Explore solutions</ButtonLink>
        </div>
      </div>
    </section>
  );
}
