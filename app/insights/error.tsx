"use client";
import Link from "next/link";

export default function GuidesError({ reset }: { reset: () => void }) {
  return <section className="wrap page-intro"><p className="overline">Catalyst Guides</p><h1>A brief pause<br /><em>in the reading.</em></h1><p className="intro-copy">Our guides are temporarily unavailable. Please try again in a moment.</p><div className="hero-actions"><button className="button" onClick={reset}>Try again</button><Link className="text-link" href="/">Return to Catalyst ↗</Link></div></section>;
}
