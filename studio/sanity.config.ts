import { defineConfig } from "sanity";
import { structureTool, type DefaultDocumentNodeResolver } from "sanity/structure";
import { ArticlePreview } from "./components/ArticlePreview";
import { PromotionPanel } from "./components/PromotionPanel";
import { blogArticle } from "./schema/blogArticle";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET || "production";

if (!projectId || !/^[a-z0-9]+$/.test(projectId)) {
  throw new Error("Set SANITY_STUDIO_PROJECT_ID to your real Sanity project ID. Follow studio/README.md; no project is created automatically.");
}
if (!/^[a-z0-9_-]+$/.test(dataset)) throw new Error("Use a valid Sanity dataset name.");

const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) =>
  schemaType === "blogArticle"
    ? S.document().views([
        S.view.form().title("Write"),
        S.view.component(ArticlePreview).title("Preview"),
        S.view.component(PromotionPanel).title("Share drafts"),
      ])
    : S.document();

export default defineConfig({
  name: "catalyst-blog",
  title: process.env.SANITY_STUDIO_TITLE || "Catalyst Blog Editor",
  projectId,
  dataset,
  plugins: [structureTool({ defaultDocumentNode })],
  schema: { types: [blogArticle] },
  document: {
    // Autosave preserves drafts. Publishing always requires the editor's deliberate action.
    // Keep Sanity's built-in duplicate, unpublish, delete and revision/history controls.
    actions: (previous) => previous,
  },
});
