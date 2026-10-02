"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { industryList } from "@/data/redesign";
const problemFor = (kind: string) => {
  if (kind === "time") return "Time lost to repetitive work";
  if (["opportunity", "changes"].includes(kind)) return "Missed revenue opportunities";
  if (["software", "roi"].includes(kind)) return "Software costs and investment";
  if (["margin", "campaign"].includes(kind)) return "Understanding profit and proceeds";
  if (["inventory", "reorder"].includes(kind)) return "Stock levels and carrying costs";
  return "Downtime, scrap and rework";
};
export default function ToolLibraryClient({ calculators }: { calculators: { slug: string; title: string; category: string; description: string; kind: string }[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [industry, setIndustry] = useState("");
  const chosen = industryList.find((i) => i.slug === industry);
  const common = [
    "manual-work",
    "duplicate-entry",
    "software-consolidation",
    "project-roi",
    "reporting-time",
    "customer-onboarding",
  ];
  const tools = calculators.filter(
    (c) =>
      (!category || problemFor(c.kind) === category) &&
      (!chosen || chosen.tools.includes(c.slug) || common.includes(c.slug)) &&
      `${c.title} ${c.category} ${c.description}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="tool-filters">
        <label>
          Find a calculator
          <input
            type="search"
            placeholder="Try inventory, quoting or time…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          Problem to explore
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All problems</option>
            {[...new Set(calculators.map((c) => problemFor(c.kind)))].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Your industry
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          >
            <option value="">All industries</option>
            {industryList.map((i) => (
              <option value={i.slug} key={i.slug}>
                {i.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="tool-count" role="status">
        {tools.length} of {calculators.length} calculators · Free to use · No
        email required
      </p>
      {tools.length ? (
        <div className="three-grid">
          {tools.map((c) => (
            <article className="tool-card" key={c.slug}>
              <p className="overline">{c.category}</p>
              <h2>{c.title}</h2>
              <p>{c.description}</p>
              <Link
                className="text-link"
                href={`/tools/${c.slug}${industry ? `?industry=${industry}` : ""}`}
              >
                Open calculator <ArrowUpRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="content-card">
          <h2>No matches just yet.</h2>
          <p>Try another search or clear the filters.</p>
          <button
            className="quiet-button"
            onClick={() => {
              setQuery("");
              setCategory("");
              setIndustry("");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
