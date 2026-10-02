import { calculators } from "@/lib/calculators";
import ToolLibraryClient from "./ToolLibraryClient";

// Filtering needs summaries, not calculator field definitions, formulas or examples.
const summaries = calculators.map(({ slug, title, category, description, kind }) => ({
  slug, title, category, description, kind,
}));

export default function ToolLibrary() {
  return <ToolLibraryClient calculators={summaries} />;
}
