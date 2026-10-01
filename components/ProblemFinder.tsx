"use client";
import { useState } from "react";
import Link from "next/link";
import { startingPoints } from "@/data/startingPoints";
import { track } from "@/lib/site";
export default function ProblemFinder() {
  const [selected, setSelected] = useState(0);
  const item = startingPoints[selected];
  return (
    <section
      className="problem-finder"
      data-section-track="problem-finder"
      aria-label="Find your starting point"
    >
      <p className="overline">Start with the work</p>
      <h2>Where does work get stuck?</h2>
      <p>Choose a familiar problem. See a practical starting point.</p>
      <div
        className="finder-options"
        role="group"
        aria-label="Business challenges"
      >
        {startingPoints.map((s, i) => (
          <button
            key={s.id}
            aria-pressed={i === selected}
            aria-controls="finder-result"
            onClick={() => {
              setSelected(i);
              track("assessment_start", { problem: s.id });
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div id="finder-result" className="finder-result" aria-live="polite">
        <div>
          <p className="overline">The friction</p>
          <h3>{item.before}</h3>
        </div>
        <div>
          <p className="overline">A way forward</p>
          <p>{item.after}</p>
          <Link className="button" href={`/consultation?problem=${item.id}`}>
            Discuss {item.label.toLowerCase()} ↗
          </Link>
          <div className="demo-actions">
            <Link
              className="text-link"
              href={`/portfolio?problem=${item.id}#${item.demo}`}
            >
              See a relevant demo ↗
            </Link>
            <Link className="text-link" href={`/tools/${item.tool}`}>
              Explore the numbers ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
