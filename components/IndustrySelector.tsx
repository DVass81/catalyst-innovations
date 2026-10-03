import { calculators } from "@/lib/calculators";
import { industryList, groups } from "@/data/redesign";
import { recommendedDemo } from "@/data/startingPoints";
import IndustrySelectorClient from "./IndustrySelectorClient";

// Only selector content crosses the client boundary. Source industry research,
// unused workflows and calculator definitions stay on the server.
const toolTitles = Object.fromEntries(calculators.map(({ slug, title }) => [slug, title]));
const industries = industryList.map(({ slug, name, group, problems, solutions, tools }) => ({
  slug,
  name,
  group,
  problems,
  solutions,
  tools,
  example: recommendedDemo(group, slug),
}));

export default function IndustrySelector() {
  return <IndustrySelectorClient industries={industries} groups={groups} toolTitles={toolTitles} />;
}
