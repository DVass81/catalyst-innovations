"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function SavingsPreview() {
  const [hours, setHours] = useState(5);
  return (
    <div className="savings-preview">
      <div>
        <p className="overline">05 / A little less busywork adds up</p>
        <h2>
          What could your team
          <br />
          do with <em>more time?</em>
        </h2>
        <p>
          Start with a simple example. Then use our 24 free calculators to
          explore the numbers behind your own business.
        </p>
        <Link href="/tools" className="button">
          Explore the savings tools <ArrowUpRight size={18} />
        </Link>
      </div>
      <div className="preview-calculator">
        <p className="overline">Illustrative example · time only</p>
        <label htmlFor="hours-preview">
          Hours returned to your team each week <strong>{hours}</strong>
        </label>
        <input
          id="hours-preview"
          type="range"
          min="0"
          max="40"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
        />
        <div className="preview-result">
          <strong>{hours * 52}</strong>
          <span>
            hours a year
            <br />
            for work that matters.
          </span>
        </div>
        <p>
          Weekly hours × 52. Time returned is capacity—not guaranteed cash
          savings.
        </p>
      </div>
    </div>
  );
}
