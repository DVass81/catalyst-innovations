"use client";
import Link from "next/link";

export default function BlogError({ reset }: { reset: () => void }) {
  return <div className="studio-page"><section className="wrap studio-placeholder"><p className="overline">The Catalyst Blog</p><h1>A brief pause<br />in the reading.</h1><p>The blog is temporarily unavailable. Please try again in a moment, or explore our practical guides.</p><div className="hero-actions"><button className="button" onClick={reset}>Try again</button><Link className="text-link" href="/insights">Explore the guides ↗</Link></div></section></div>;
}
