"use client";
import Link from "next/link";

export default function GuidesError({ reset }: { reset: () => void }) {
  return <div className="studio-page"><section className="wrap studio-placeholder"><p className="overline">Catalyst Guides</p><h1>A brief pause<br />in the reading.</h1><p>Our guides are temporarily unavailable. Please try again in a moment.</p><div className="hero-actions"><button className="button" onClick={reset}>Try again</button><Link className="text-link" href="/">Return to Catalyst ↗</Link></div></section></div>;
}
