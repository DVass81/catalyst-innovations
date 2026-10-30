import { defineArrayMember, defineField, defineType } from "sanity";
import { SourceInput } from "../components/SourceInput";
import { categoryOptions, demoOptions, industryOptions, solutionOptions, toolOptions } from "./options";

const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const dateNotFuture = (value: string | undefined) => !value || value <= today() || "Use today or an earlier date. Scheduled publishing is not enabled.";
const textMember = () => defineArrayMember({ type: "text", rows: 4, validation: (rule) => rule.required().max(5000).custom(plainText) });
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const plainText = (value: string | undefined) => !value || !/<\/?[a-z][^>]*>/i.test(value) || "Enter plain text, without HTML tags.";

export const blogArticle = defineType({
  name: "blogArticle",
  title: "Blog article",
  type: "document",
  groups: [
    { name: "write", title: "Write", default: true },
    { name: "connections", title: "Links & sources" },
    { name: "promotion", title: "Promotion drafts" },
    { name: "review", title: "Review before publishing" },
  ],
  initialValue: () => ({ publishedAt: today(), updatedAt: today(), category: "Everyday operations", solution: "custom-software" }),
  fields: [
    defineField({ name: "title", title: "Article title", type: "string", group: "write", description: "Also used as the search and social-preview title. Write a useful, specific title.", validation: (rule) => rule.required().min(10).max(120).custom(plainText) }),
    defineField({ name: "slug", title: "Web address", type: "slug", group: "write", options: { source: "title", maxLength: 100 }, description: "Generate before publishing. Changing a published address can break shared links; ask for a redirect first.", validation: (rule) => rule.required().custom((value) => !value?.current || (slugPattern.test(value.current) && value.current.length <= 100) || "Use lowercase words separated by single hyphens (100 characters maximum).") }),
    defineField({ name: "description", title: "Short summary / search description", type: "text", rows: 3, group: "write", description: "Used on article cards, in search metadata and in shared previews.", validation: (rule) => rule.required().min(30).max(240).custom(plainText) }),
    defineField({ name: "category", title: "Topic", type: "string", group: "write", options: { list: categoryOptions }, validation: (rule) => rule.required().max(80).custom(plainText) }),
    defineField({ name: "publishedAt", title: "Publication date", type: "date", group: "write", validation: (rule) => rule.required().custom(dateNotFuture) }),
    defineField({ name: "updatedAt", title: "Last meaningful update", type: "date", group: "write", description: "Change after a substantive edit; this does not publish the draft.", validation: (rule) => rule.required().custom(dateNotFuture).custom((value, context) => !value || !context.document?.publishedAt || value >= String(context.document.publishedAt) || "The update cannot precede the publication date.") }),
    defineField({ name: "coverImage", title: "Optional cover image", type: "image", group: "write", options: { hotspot: true }, description: "Public marketing assets only. Sanity asset URLs are public, even before an article is published. Never upload customer data, internal screenshots or private documents.", fields: [
      defineField({ name: "alt", title: "Describe the image for someone who cannot see it", type: "string", validation: (rule) => rule.required().max(250) }),
      defineField({ name: "caption", title: "Visible image caption / credit", type: "string", validation: (rule) => rule.max(300) }),
    ] }),
    defineField({ name: "introduction", title: "Opening explanation", type: "text", rows: 6, group: "write", validation: (rule) => rule.required().min(40).max(5000).custom(plainText) }),
    defineField({ name: "takeaway", title: "Useful starting point", type: "text", rows: 3, group: "write", validation: (rule) => rule.required().max(1000).custom(plainText) }),
    defineField({ name: "sections", title: "Article sections", type: "array", group: "write", validation: (rule) => rule.required().min(1).max(30), of: [defineArrayMember({ name: "articleSection", type: "object", fields: [
      defineField({ name: "id", type: "string", hidden: true, readOnly: true, description: "Legacy anchors are preserved; new sections use their stable Sanity array keys." }),
      defineField({ name: "heading", title: "Section heading", type: "string", validation: (rule) => rule.required().max(200).custom(plainText) }),
      defineField({ name: "paragraphs", title: "Paragraphs", type: "array", of: [textMember()], validation: (rule) => rule.required().min(1).max(20) }),
      defineField({ name: "checklist", title: "Optional bullet points", type: "array", of: [defineArrayMember({ type: "string", validation: (rule) => rule.required().max(1000).custom(plainText) })], validation: (rule) => rule.max(20) }),
      defineField({ name: "sourceKey", title: "Optional background reference", type: "string", description: "Add sources in Links & sources, then choose the supporting reference here.", components: { input: SourceInput }, validation: (rule) => rule.custom((value, context) => !value || (context.document?.sources as Array<{ _key?: string }> | undefined)?.some((source) => source._key === value) || "The selected source no longer exists. Choose another source or clear this field.") }),
    ], preview: { select: { title: "heading" } } })] }),
    defineField({ name: "example", title: "Illustrative example", type: "object", group: "write", description: "Use a clearly fictional example or an explicitly verified public demonstration. Never invent a customer result.", validation: (rule) => rule.required(), fields: [
      defineField({ name: "title", type: "string", title: "Example title", validation: (rule) => rule.required().max(200).custom(plainText) }),
      defineField({ name: "text", type: "text", rows: 6, title: "Example explanation", validation: (rule) => rule.required().max(6000).custom(plainText) }),
    ] }),
    defineField({ name: "nextStep", title: "Practical next step", type: "text", rows: 4, group: "write", description: "Explain what the reader can bring or discuss. The website adds the inquiry action.", validation: (rule) => rule.required().max(3000).custom(plainText) }),
    defineField({ name: "tools", title: "Related savings tools", type: "array", group: "connections", of: [defineArrayMember({ type: "string", options: { list: toolOptions }, validation: (rule) => rule.valid(...toolOptions.map((item) => item.value)) })], validation: (rule) => rule.unique().min(1).max(4) }),
    defineField({ name: "solution", title: "Related solution", type: "string", group: "connections", options: { list: solutionOptions }, validation: (rule) => rule.required().valid(...solutionOptions.map((item) => item.value)) }),
    defineField({ name: "industry", title: "Related industry (optional)", type: "string", group: "connections", options: { list: industryOptions }, validation: (rule) => rule.valid(...industryOptions.map((item) => item.value)) }),
    defineField({ name: "demo", title: "Related actual demonstration (optional)", type: "string", group: "connections", options: { list: demoOptions }, validation: (rule) => rule.valid(...demoOptions.map((item) => item.value)) }),
    defineField({ name: "related", title: "Related article web-address slugs", type: "array", group: "connections", description: "Copy the final address segment of another published article. The site omits unavailable matches.", of: [defineArrayMember({ type: "string", validation: (rule) => rule.regex(slugPattern, { name: "article slug" }).max(100) })], validation: (rule) => rule.unique().max(4) }),
    defineField({ name: "sources", title: "Background sources", type: "array", group: "connections", description: "Prefer authoritative original references. These sources support the specific background attributed to them.", validation: (rule) => rule.max(30), of: [defineArrayMember({ name: "articleSource", type: "object", fields: [
      defineField({ name: "title", title: "Source title", type: "string", validation: (rule) => rule.required().max(300).custom(plainText) }),
      defineField({ name: "url", title: "Public HTTPS address", type: "url", validation: (rule) => rule.required().max(2000).uri({ scheme: ["https"] }).custom((value) => {
        if (!value) return true;
        try { const url = new URL(value); return (!url.username && !url.password && !url.hash && !url.search && !/^(localhost|127\.|0\.|10\.|192\.168\.|169\.254\.|\[?::1\]?$)/i.test(url.hostname)) || "Use a public source URL without credentials, tracking parameters or fragments."; } catch { return "Enter a valid HTTPS source URL."; }
      }) }),
      defineField({ name: "reviewedAt", title: "Date checked", type: "date", initialValue: today, validation: (rule) => rule.required().custom(dateNotFuture) }),
    ], preview: { select: { title: "title", subtitle: "url" } } })] }),
    defineField({ name: "promotion", title: "Ready-to-review sharing copy", type: "object", group: "promotion", description: "Drafts only. This editor does not post to social media or send email. Use the Share drafts pane to copy reviewed text and the public article link.", fields: [
      defineField({ name: "social", title: "Social post draft", type: "text", rows: 7, validation: (rule) => rule.max(5000).custom(plainText) }),
      defineField({ name: "emailSubject", title: "Email subject draft", type: "string", validation: (rule) => rule.max(200).custom(plainText) }),
      defineField({ name: "emailBody", title: "Email introduction draft", type: "text", rows: 7, validation: (rule) => rule.max(5000).custom(plainText) }),
    ] }),
    defineField({ name: "editorialReview", title: "Content review checklist", type: "object", group: "review", description: "Check these after reviewing the current draft, then use Sanity's Publish button. Recheck them after making meaningful changes. Publication is manual; there is no automatic scheduler.", validation: (rule) => rule.required(), fields: [
      defineField({ name: "accurate", title: "Claims are accurate; examples and prototypes are labeled", type: "boolean", initialValue: false, validation: (rule) => rule.required().custom((value) => value === true || "Review factual claims before publishing.") }),
      defineField({ name: "privateData", title: "No private information, credentials or unapproved client assets", type: "boolean", initialValue: false, validation: (rule) => rule.required().custom((value) => value === true || "Review privacy before publishing.") }),
      defineField({ name: "sources", title: "Source links, dates and related links have been checked", type: "boolean", initialValue: false, validation: (rule) => rule.required().custom((value) => value === true || "Check the article's links before publishing.") }),
      defineField({ name: "preview", title: "I reviewed the preview, spelling and next-step explanation", type: "boolean", initialValue: false, validation: (rule) => rule.required().custom((value) => value === true || "Review the preview before publishing.") }),
    ] }),
  ],
  orderings: [{ title: "Publication date (newest first)", name: "publicationDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "category", media: "coverImage" } },
});
