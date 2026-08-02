"use client";

import { HexWatermark } from "../ui";
import { Reveal } from "../Reveal";

/** Full-bleed editorial pause between the interactive set pieces. */
export default function EditorialBreak() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-24 sm:py-32">
      <HexWatermark className="-right-16 -top-16 h-72 w-72 text-steel-400/20" />
      <HexWatermark className="-bottom-20 -left-20 h-80 w-80 text-steel-400/10" />
      <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal>
          <span aria-hidden="true" className="block h-px w-16 bg-steel-400" />
          <p className="mt-8 font-grotesk text-3xl font-semibold leading-[1.2] text-white sm:text-4xl lg:text-[2.9rem]">
            We don&apos;t sell software.
            <br />
            We sell the hours it gives back{" "}
            <span className="text-steel-300">and the clarity it turns on.</span>
          </p>
          <p className="mt-6 max-w-xl text-lg text-silver-400">
            Every engagement is measured the same way: money made, time saved, work made
            smarter.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
