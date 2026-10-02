import { calculators } from "@/lib/calculators";
import IndustrySelectorClient from "./IndustrySelectorClient";

// Only titles cross the client boundary; calculator fields and examples stay on the server.
const toolTitles = Object.fromEntries(calculators.map(({ slug, title }) => [slug, title]));

export default function IndustrySelector() {
  return <IndustrySelectorClient toolTitles={toolTitles} />;
}
