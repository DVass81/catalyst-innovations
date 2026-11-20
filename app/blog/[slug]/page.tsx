import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogArticle, { BlogArticleSchema } from "@/components/BlogArticle";
import { getPublishedPost, getPublishedPosts } from "@/lib/blog";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import "../../insights/insights.css";
import "../blog.css";

export const generateStaticParams = async () => (await getPublishedPosts()).map(post => ({ slug: post.slug }));
export const dynamicParams = true;
export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPublishedPost((await params).slug);
  if (!post) notFound();
  const metadata = pageMetadata({ title: post.title, description: post.description, path: `/blog/${post.slug}` });
  const image = { url: new URL(`/blog/${post.slug}/opengraph-image`, site.url).toString(), width: 1200, height: 630, alt: `${post.title} | ${site.name}` };
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, type: "article", publishedTime: post.publishedAt, modifiedTime: post.updatedAt, images: [image] },
    twitter: { ...metadata.twitter, images: [image] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPublishedPost((await params).slug);
  if (!post) notFound();
  const published = await getPublishedPosts();
  const related = post.related?.length
    ? post.related.flatMap(slug => { const match = published.find(item => item.slug === slug && item.slug !== post.slug); return match ? [match] : []; })
    : published.filter(item => item.slug !== post.slug).slice(0, 2);
  const breadcrumbs = breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]);
  return <div className="insights-page catalyst-blog-page blog-reading-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }} />
    <BlogArticleSchema post={post} />
    <BlogArticle post={post} related={related} />
  </div>;
}
