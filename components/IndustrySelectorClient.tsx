"use client";
import { track } from "@/lib/site";
import { useState } from "react";
import IndustryProblems from "./IndustryProblems";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Industry } from "@/data/redesign";

type SelectorIndustry = Omit<Industry, "workflow"> & {
  example: { id: string; reason: string };
};

export default function IndustrySelectorClient({ industries, groups, toolTitles }: {
  industries: SelectorIndustry[];
  groups: readonly string[];
  toolTitles: Record<string, string>;
}) {
  const [slug, setSlug] = useState("plumbing");
  const i = industries.find((x) => x.slug === slug) ?? industries[0];
  const example = i.example;
  return (
    <div className="industry-selector">
      <div className="industry-select-row">
        <label htmlFor="industry-choice">
          What kind of business do you run?
        </label>
        <select
          id="industry-choice"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            track("industry_select", { industry: e.target.value });
          }}
        >
          {groups.map((g) => (
            <optgroup label={g} key={g}>
              {industries
                .filter((x) => x.group === g)
                .map((x) => (
                  <option value={x.slug} key={x.slug}>
                    {x.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div className="industry-content" aria-live="polite">
        <div>
          <p className="overline">For {i.name.toLowerCase()}</p>
          <h3>{i.name}</h3>
          <IndustryProblems industry={i} />
          <Link className="text-link" href={`/industries/${i.slug}`}>
            See what we can build <ArrowRight size={16} />
          </Link>
        </div>
        <div className="industry-example">
          <p className="overline">A relevant example</p>
          <p>{example.reason}</p>
          <Link
            className="text-link"
            href={`/portfolio?industry=${i.slug}#${example.id}`}
          >
            See the application walkthrough ↗
          </Link>
          <p className="overline">Put your numbers to work</p>
          <div className="recommended-tools">
            {i.tools.map((slug) => (
              <Link key={slug} href={`/tools/${slug}?industry=${i.slug}`}>
                {toolTitles[slug]}
                <ArrowRight size={15} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
