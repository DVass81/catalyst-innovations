import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industryList, groups } from "@/data/redesign";
import { PageIntro, DiscussCTA } from "@/components/SiteSections";
export const metadata = pageMetadata({
  path: "/industries",
  title: "Industries We Help",
  description:
    "Custom software for trades, manufacturing, warehouses, communities, nonprofits and growing businesses.",
});
export default function Industries() {
  return (
    <>
      <PageIntro
        eyebrow="Industries"
        title="Different work. The same need for a better way."
        text="Your business has its own rhythm. We build around it—with connected workflows, useful information and less repetitive work."
      />

      <section className="wrap content-section">
        {groups.map((g) => (
          <div className="industry-directory" key={g}>
            <h2>{g}</h2>
            <div className="directory-links">
              {industryList
                .filter((i) => i.group === g)
                .map((i) => (
                  <Link id={i.slug} key={i.slug} href={`/industries/${i.slug}`}>
                    {i.name}
                    <ArrowUpRight size={17} />
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </section>
      <DiscussCTA />
    </>
  );
}
