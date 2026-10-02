import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { calculators, getCalculator } from "@/lib/calculators";
import CalculatorForm from "@/components/CalculatorForm";
import { industryList } from "@/data/redesign";
export const generateStaticParams = () =>
  calculators.map((c) => ({ slug: c.slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const c = getCalculator((await params).slug);
  return {
    title: c ? `${c.title} Calculator` : "Calculator not found",
    description: c?.description,
    alternates: c ? { canonical: `/tools/${c.slug}` } : undefined,
  };
}
export default async function Tool({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ industry?: string }>;
}) {
  const c = getCalculator((await params).slug);
  if (!c) notFound();
  const industry = (await searchParams).industry;
  const valid = industryList.some((i) => i.slug === industry)
    ? industry
    : undefined;
  return (
    <>
      <section className="page-intro wrap">
        <Link className="breadcrumb" href="/tools">
          ← All calculators
        </Link>
        <p className="overline">{c.category}</p>
        <h1>{c.title}</h1>
        <p className="intro-copy">{c.description}</p>
      </section>
      <section className="wrap content-section">
        <p className="print-only">
          Catalyst Innovations · Illustrative estimate · {c.title}
        </p>
        <CalculatorForm calculator={c} industry={valid} />
      </section>
    </>
  );
}
