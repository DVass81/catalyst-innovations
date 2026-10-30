import { pageMetadata } from "@/lib/seo";
import { industryList } from "@/data/redesign";
import { IndustryDirectory } from "@/components/studio/IndustryStudio";

export const metadata = pageMetadata({
  path: "/industries",
  title: "Industries We Help",
  description: "Custom software for trades, manufacturing, warehouses, communities, nonprofits and growing businesses.",
});

export default function Industries() {
  return <IndustryDirectory industries={industryList} />;
}
