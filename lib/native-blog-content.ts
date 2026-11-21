import { z } from "zod";

/**
 * Existing licensed studio photography, frozen under content-addressed names.
 * Sources, license review and representative-use limits: docs/studio-media-sources.md.
 * Never overwrite these files; a new image version receives a new asset ID.
 */
export const nativeBlogImages = [
  {
    assetId: "05d5d59601b54f95f56e0ef35543e57bed10c6a15f05861ee3eab61de1234c2e",
    label: "Manufacturing", src: "/blog-images/05d5d59601b54f95f56e0ef35543e57bed10c6a15f05861ee3eab61de1234c2e.webp",
    width: 1400, height: 1000, alt: "Two workers guide a suspended metal component on a factory floor.",
    credit: "Photo by Cemrecan Yurtman on Unsplash",
    sourceUrl: "https://unsplash.com/photos/a-factory-filled-with-lots-of-machines-and-workers-WysVHhi69js",
    licenseUrl: "https://unsplash.com/license", caption: "Representative photography",
  },
  {
    assetId: "7b5a3562937e179b6cd5f2289196559fe5ed976c9f637bb50461c3592bcfc889",
    label: "Planning", src: "/blog-images/7b5a3562937e179b6cd5f2289196559fe5ed976c9f637bb50461c3592bcfc889.webp",
    width: 1200, height: 900, alt: "Two colleagues organize yellow sticky notes on a glass planning wall.",
    credit: "Photo by airfocus on Unsplash",
    sourceUrl: "https://unsplash.com/photos/people-collaborating-on-project-plan-v89zhr0iBFY",
    licenseUrl: "https://unsplash.com/license", caption: "Representative photography",
  },
  {
    assetId: "1a329330baac6864e4f19245d7befa3f97803c02fd75a4808a8e9b8f284a25c1",
    label: "Skilled trades", src: "/blog-images/1a329330baac6864e4f19245d7befa3f97803c02fd75a4808a8e9b8f284a25c1.webp",
    width: 1200, height: 900, alt: "A technician uses insulated test probes to check an electrical control panel.",
    credit: "Photo by Toolmash Expo on Unsplash",
    sourceUrl: "https://unsplash.com/photos/electrician-testing-electrical-panel-with-multimeter-PkHf7BUWbtk",
    licenseUrl: "https://unsplash.com/license", caption: "Representative photography",
  },
  {
    assetId: "bb8e44824daf63574ac39c5433c34a35c5de5f67f6c4ba92c65a93b501265b6e",
    label: "Warehouse", src: "/blog-images/bb8e44824daf63574ac39c5433c34a35c5de5f67f6c4ba92c65a93b501265b6e.webp",
    width: 1200, height: 900, alt: "A warehouse worker retrieves stock from a shelf while standing on a stepladder.",
    credit: "Photo by Kseniia Ilinykh on Unsplash",
    sourceUrl: "https://unsplash.com/photos/a-man-standing-on-a-ladder-in-a-warehouse-cNyDTmtBQbc",
    licenseUrl: "https://unsplash.com/license", caption: "Representative photography",
  },
  {
    assetId: "b7915c6a14df94a4869d9d35ae2635b440114635a89b6b672e6ae8ee51f039bf",
    label: "Office and paperwork", src: "/blog-images/b7915c6a14df94a4869d9d35ae2635b440114635a89b6b672e6ae8ee51f039bf.webp",
    width: 1200, height: 800, alt: "Hands review a blank tax form beside a calculator, notebook and laptop.",
    credit: "Photo by Kelly Sikkema on Unsplash",
    sourceUrl: "https://unsplash.com/photos/person-reviewing-documents-with-calculator-and-laptop-0oZpRxG5Hkk",
    licenseUrl: "https://unsplash.com/license", caption: "Representative photography",
  },
  {
    assetId: "2b5bcd6e9378e5fbd6f5e666041c391e3168595b70fb296c2bec8b7df33de5fc",
    label: "Community", src: "/blog-images/2b5bcd6e9378e5fbd6f5e666041c391e3168595b70fb296c2bec8b7df33de5fc.webp",
    width: 1200, height: 800, alt: "An aerial view of homes, trees, playing fields and a neighborhood playground.",
    credit: "Photo by Alex Reynolds on Unsplash",
    sourceUrl: "https://unsplash.com/photos/aerial-view-of-suburban-neighborhood-with-park-and-trees-fI4J4hWCKRo",
    licenseUrl: "https://unsplash.com/license", caption: "Representative photography",
  },
  {
    assetId: "89855a5a83374d1138943b839979ef89081a16cc3989c01a997b0a410b7750ac",
    label: "Plumbing", src: "/blog-images/89855a5a83374d1138943b839979ef89081a16cc3989c01a997b0a410b7750ac.webp",
    width: 1200, height: 900, alt: "A technician fits a threaded radiator pipe with plumbing tools beside the work.",
    credit: "Photo by Sergei Starostin on Pexels",
    sourceUrl: "https://www.pexels.com/photo/professional-plumber-installing-a-radiator-pipe-29226620/",
    licenseUrl: "https://www.pexels.com/license/", caption: "Representative photography",
  },
  {
    assetId: "958ee4bd63bcc9c7e9c5fb28e626f1da5792406f06367de482ee75b7d9afeaae",
    label: "Painting", src: "/blog-images/958ee4bd63bcc9c7e9c5fb28e626f1da5792406f06367de482ee75b7d9afeaae.webp",
    width: 1200, height: 900, alt: "A person uses a roller to paint an interior wall beside a protected window and paint tray.",
    credit: "Photo by Tima Miroshnichenko on Pexels",
    sourceUrl: "https://www.pexels.com/photo/man-painting-the-wall-6474471/",
    licenseUrl: "https://www.pexels.com/license/", caption: "Representative photography",
  },
] as const;

const featuredImageSchema = z.object({
  assetId: z.enum(nativeBlogImages.map(image => image.assetId)),
  alt: z.string().trim().min(10).max(250).refine(value => !/[<>\u0000-\u001f\u007f]/.test(value), "Describe the image using plain text."),
}).strict();

export type NativeBlogFeaturedImage = z.infer<typeof featuredImageSchema>;

export function nativeBlogImage(featuredImage: NativeBlogFeaturedImage | undefined) {
  if (!featuredImage) return undefined;
  const image = nativeBlogImages.find(item => item.assetId === featuredImage.assetId);
  if (!image) return undefined;
  return {
    url: image.src, alt: featuredImage.alt, width: image.width, height: image.height,
    credit: image.credit, sourceUrl: image.sourceUrl, caption: image.caption, licenseUrl: image.licenseUrl,
  };
}

const calendarDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, "Enter a valid calendar date.");

export const nativeBlogSchema = z.object({
  title: z.string().trim().min(10).max(120),
  slug: z.string().trim().max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .refine(value => !["editor", "publisher"].includes(value), "Choose a different article address."),
  description: z.string().trim().min(30).max(240),
  category: z.string().trim().min(1).max(80),
  body: z.string().min(100).max(60_000).refine(value => value.trim().length >= 100, "Enter at least 100 characters of article text."),
  featuredImage: featuredImageSchema.optional(),
});

export const nativeBlogDocumentSchema = nativeBlogSchema.extend({
  publishedAt: calendarDate,
  updatedAt: calendarDate,
  publicationId: z.string().uuid(),
}).refine(value => value.updatedAt >= value.publishedAt, "Updated date cannot be before publication.");

export type NativeBlogInput = z.infer<typeof nativeBlogSchema>;
export type NativeBlogDocument = z.infer<typeof nativeBlogDocumentSchema>;

export function parseNativeBlogInput(value: unknown): NativeBlogInput | null {
  const result = nativeBlogSchema.safeParse(value);
  return result.success ? result.data : null;
}

export function parseNativeBlogDocument(value: unknown): NativeBlogDocument | null {
  const result = nativeBlogDocumentSchema.safeParse(value);
  return result.success ? result.data : null;
}

export type BlogBodyBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; id: string; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[]; start: number }
  | { type: "blockquote"; text: string }
  | { type: "rule" };

export type BlogInline =
  | { type: "text"; text: string }
  | { type: "bold"; children: BlogInline[] }
  | { type: "italic"; children: BlogInline[] }
  | { type: "link"; href: string; children: BlogInline[] };

function httpsLink(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !/[\s\u0000-\u001f\u007f]/.test(value);
  } catch {
    return false;
  }
}

/** A small formatting subset. HTML always remains ordinary text. */
export function parseBlogInline(text: string, depth = 0): BlogInline[] {
  if (depth >= 8) return [{ type: "text", text }];
  const pattern = /\[([^\[\]\n]+)\]\(([^()\s]+(?:\([^()\s]*\)[^()\s]*)*)\)|(\*\*|__)(?=\S)([\s\S]*?\S)\3|(\*|_)(?=\S)([^*_\n]*?\S)\5/g;
  const result: BlogInline[] = [];
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index;
    if (index > cursor) result.push({ type: "text", text: text.slice(cursor, index) });
    if (match[1] !== undefined) {
      result.push(httpsLink(match[2])
        ? { type: "link", href: match[2], children: parseBlogInline(match[1], depth + 1) }
        : { type: "text", text: match[0] });
    } else {
      result.push({ type: match[3] ? "bold" : "italic", children: parseBlogInline(match[4] ?? match[6], depth + 1) });
    }
    cursor = index + match[0].length;
  }
  if (cursor < text.length) result.push({ type: "text", text: text.slice(cursor) });
  return result;
}

function inlineText(nodes: BlogInline[]): string {
  return nodes.map(node => node.type === "text" ? node.text : inlineText(node.children)).join("");
}

const headingPattern = /^ {0,3}(#{1,3})[\t ]+(.+?)(?:[\t ]+#+)?[\t ]*$/;
const unorderedPattern = /^ {0,3}[-+*][\t ]+(.+)$/;
const orderedPattern = /^ {0,3}(\d{1,9})[.)][\t ]+(.+)$/;
const quotePattern = /^ {0,3}>[\t ]?(.*)$/;
const rulePattern = /^ {0,3}(?:(?:\*[\t ]*){3,}|(?:-[\t ]*){3,}|(?:_[\t ]*){3,})$/;

function startsBlock(line: string): boolean {
  return headingPattern.test(line) || unorderedPattern.test(line) || orderedPattern.test(line)
    || quotePattern.test(line) || rulePattern.test(line);
}

export function parseBlogBody(body: string): BlogBodyBlock[] {
  const lines = body.replace(/\r\n?/g, "\n").split("\n");
  const blocks: BlogBodyBlock[] = [];
  const ids = new Set<string>();
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index++; continue; }
    const heading = line.match(headingPattern);
    if (heading) {
      const text = heading[2];
      const slug = inlineText(parseBlogInline(text)).normalize("NFKD").replace(/\p{M}/gu, "")
        .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 100) || "heading";
      const base = `section-${slug}`;
      let id = base;
      let suffix = 2;
      while (ids.has(id)) id = `${base}-${suffix++}`;
      ids.add(id);
      blocks.push({ type: "heading", level: heading[1].length === 3 ? 3 : 2, id, text });
      index++;
      continue;
    }
    if (rulePattern.test(line)) { blocks.push({ type: "rule" }); index++; continue; }

    const unordered = line.match(unorderedPattern);
    const ordered = line.match(orderedPattern);
    if (unordered || ordered) {
      const pattern = unordered ? unorderedPattern : orderedPattern;
      const items: string[] = [];
      while (index < lines.length) {
        const item = lines[index].match(pattern);
        if (!item) break;
        let text = item[unordered ? 1 : 2];
        index++;
        while (index < lines.length && lines[index].trim() && !startsBlock(lines[index])) {
          text += `\n${lines[index].trimStart()}`;
          index++;
        }
        items.push(text);
      }
      blocks.push(unordered ? { type: "ul", items } : { type: "ol", items, start: Number(ordered![1]) });
      continue;
    }

    if (quotePattern.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && quotePattern.test(lines[index])) {
        quote.push(lines[index].replace(quotePattern, "$1"));
        index++;
      }
      blocks.push({ type: "blockquote", text: quote.join("\n") });
      continue;
    }

    const paragraph = [line];
    index++;
    while (index < lines.length && lines[index].trim() && !startsBlock(lines[index])) paragraph.push(lines[index++]);
    blocks.push({ type: "paragraph", text: paragraph.join("\n") });
  }
  return blocks;
}

export function nativeBlogHeadings(body: string): Array<{ id: string; level: 2 | 3; text: string }> {
  return parseBlogBody(body).flatMap(block => block.type === "heading"
    ? [{ id: block.id, level: block.level, text: inlineText(parseBlogInline(block.text)) }]
    : []);
}

export function nativeReadingMinutes(body: string): number {
  const text = parseBlogBody(body).map(block => {
    if (block.type === "rule") return "";
    return inlineText(parseBlogInline("items" in block ? block.items.join("\n") : block.text));
  }).join("\n");
  const count = text.match(/\S+/g)?.length ?? 0;
  return Math.max(1, Math.ceil(count / 200));
}
