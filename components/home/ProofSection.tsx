import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Reveal } from "../Reveal";
import { clientResults as c } from "@/data/content";

/**
 * A real, aggregate result given room to breathe. Deliberately not a wall
 * of self-asserted benefit tags — one specific, verifiable number
 * outperforms a long list of claims.
 */
export default function ProofSection() {
  return (
    <section className="bg-ice-50 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-steel-400/30 bg-steel-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-steel-600 uppercase">
            <ShieldCheck size={13} /> Real results, real businesses
          </span>
          <p className="mt-8 font-display text-[5rem] font-bold leading-none text-navy-900 sm:text-[6.5rem]">
            {c.stat}
          </p>
          <p className="-mt-2 font-display text-lg font-semibold tracking-wide text-steel-600">
            average {c.statUnit} back
          </p>
          <h2 className="mx-auto mt-6 max-w-xl font-grotesk text-2xl font-semibold leading-tight text-navy-900 sm:text-3xl">
            {c.headline}
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-navy-700">{c.text}</p>
          <p className="mt-6 text-sm font-semibold text-navy-500">{c.proof}</p>
          <Link
            href="/consultation"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-steel-600 underline-offset-4 hover:underline"
          >
            See what this could look like for your operation <ArrowRight size={15} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
