"use client";
import { track } from "@/lib/site";
import { recommendedDemo } from "@/data/startingPoints";
import { useState } from "react";
import IndustryProblems from "./IndustryProblems";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { industryList, groups } from "@/data/redesign";
import { getCalculator } from "@/lib/calculators";
export default function IndustrySelector() {
  const [slug, setSlug] = useState("plumbing");
  const i = industryList.find((x) => x.slug === slug) ?? industryList[0];
  const example = recommendedDemo(i.group, i.slug);
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
              {industryList
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
            Explore the guided demo ↗
          </Link>
          <p className="overline">Put your numbers to work</p>
          <div className="recommended-tools">
            {i.tools.map((slug) => (
              <Link key={slug} href={`/tools/${slug}?industry=${i.slug}`}>
                {getCalculator(slug)?.title}
                <ArrowRight size={15} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
