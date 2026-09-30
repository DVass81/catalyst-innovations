"use client";
import { useState } from "react";
import VisualStory from "./VisualStory";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { industryList, groups } from "@/data/redesign";
import { getCalculator } from "@/lib/calculators";
export default function IndustrySelector() {
  const [slug, setSlug] = useState("plumbing");
  const i = industryList.find((x) => x.slug === slug) ?? industryList[0];
  return (
    <div className="industry-selector">
      <div className="industry-select-row">
        <label htmlFor="industry-choice">
          What kind of business do you run?
        </label>
        <select
          id="industry-choice"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
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
      <div className="industry-content">
        <div>
          <p className="overline">For {i.name.toLowerCase()}</p>
          <h3>
            Less chasing.
            <br />
            More getting things done.
          </h3>
          <p className="muted">Sound familiar?</p>
          <ul className="check-list">
            {i.problems.map((p) => (
              <li key={p}>
                <Check size={16} />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <Link className="text-link" href={`/industries/${i.slug}`}>
            See what we can build <ArrowRight size={16} />
          </Link>
        </div>
        <div className="industry-example">
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
      <div className="industry-motion">
        <VisualStory
          key={i.slug}
          kind="blueprint"
          context={i.name}
          workflow={i.workflow}
          autoplay={false}
        />
      </div>
    </div>
  );
}
