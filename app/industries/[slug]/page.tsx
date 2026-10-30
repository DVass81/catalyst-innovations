import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { industryList } from "@/data/redesign";
import { industryContent } from "@/data/seoContent";
import { pageMetadata } from "@/lib/seo";
import IndustryPilot from "@/components/studio/IndustryPilot";
import IndustryStudio from "@/components/studio/IndustryStudio";

export const generateStaticParams = () => industryList.map(industry => ({ slug: industry.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = industryList.find(item => item.slug === slug);
  if (!industry) notFound();
  return pageMetadata({ title: `Custom Software for ${industry.name}`, description: `${industry.problems[0]} Explore custom workflows for ${industry.name.toLowerCase()}, practical starting points and relevant calculators.`, path: `/industries/${industry.slug}` });
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = industryList.find(item => item.slug === slug);
  if (!industry) notFound();
  const content = industryContent[industry.slug];
  if (industry.slug === "manufacturing") return <IndustryPilot industry={industry} content={content} />;
  return <IndustryStudio industry={industry} content={content} />;
}
