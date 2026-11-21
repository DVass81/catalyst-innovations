import Image from "next/image";

export type BlogCover = { url: string; alt: string; width?: number; height?: number; caption?: string; credit?: string; sourceUrl?: string };

/** Article imagery is stored on our site; captions preserve its original attribution. */
export default function BlogFeaturedImage({ cover, priority = false, thumbnail = false }: { cover?: BlogCover; priority?: boolean; thumbnail?: boolean }) {
  if (!cover) return null;
  return <figure className={`blog-featured-image${thumbnail ? " blog-featured-thumbnail" : ""}`}>
    {cover.url.startsWith("/") ? <Image src={cover.url} alt={cover.alt} width={cover.width ?? 1200} height={cover.height ?? 800}
      sizes={thumbnail ? "(max-width: 680px) calc(100vw - 64px), 340px" : "(max-width: 780px) calc(100vw - 64px), 718px"}
      loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} />
      // Preserve the legacy, validated published cover path without expanding the image optimizer allowlist.
      // eslint-disable-next-line @next/next/no-img-element
      : <img src={cover.url} alt={cover.alt} width={cover.width ?? 1600} height={cover.height ?? 900} loading={priority ? "eager" : "lazy"} decoding="async" />}
    {(cover.caption || cover.credit) && <figcaption>{cover.caption}{cover.caption && cover.credit && <span aria-hidden="true"> · </span>}
      {cover.credit && (cover.sourceUrl ? <a href={cover.sourceUrl} target="_blank" rel="noopener noreferrer">{cover.credit}<span className="sr-only"> (opens in a new tab)</span></a> : cover.credit)}</figcaption>}
  </figure>;
}
