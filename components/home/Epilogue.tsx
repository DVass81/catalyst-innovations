"use client";

import Link from "next/link";
import { Reveal } from "../Reveal";

/** Closing bookend: the old machine again — small, dark, powered off. */
export default function Epilogue() {
  return (
    <section className="bg-navy-950 py-24 text-center">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <Reveal>
          {/* The CRT, powered down */}
          <div aria-hidden="true" className="mx-auto w-[150px]">
            <div className="rounded-[10px] bg-gradient-to-b from-[#4a4639] to-[#35322a] p-2.5 pb-3.5 opacity-70">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-[#0a0d0a]">
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.05) 0%, transparent 30%)" }}
                />
              </div>
              <div className="mt-1.5 flex items-center justify-end gap-1 pr-1">
                <span className="font-mono text-[0.3rem] text-[#5c584c]">PWR</span>
                <span className="h-[4px] w-[4px] rounded-full bg-[#3a372e]" />
              </div>
            </div>
            <div className="mx-auto h-[8px] w-[34%] bg-[#35322a] opacity-70 [clip-path:polygon(15%_0,85%_0,100%_100%,0_100%)]" />
          </div>

          <p className="mt-10 font-grotesk text-2xl font-semibold text-white sm:text-3xl">
            You&apos;ve seen the other side.
          </p>
          <p className="mt-3 text-lg text-silver-400">The door is open.</p>
          <Link
            href="/consultation"
            className="mt-8 inline-flex min-h-[48px] items-center rounded-lg bg-steel-400 px-8 font-semibold text-white transition-colors hover:bg-steel-500"
          >
            Step through
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
