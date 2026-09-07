import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { type PricingTier, formatPriceRange } from "@/data/pricing";
export default function PricingGrid({ tiers }: { tiers: PricingTier[] }) {
  return (
    <div className="ci-pricing-grid">
      {tiers.map((t, i) => (
        <article key={t.id} className="ci-price-card">
          <p className="ci-eyebrow">0{i + 1} / PROJECT SCOPE</p>
          <h3>{t.name}</h3>
          <p className="ci-price-description">{t.idealFor}</p>
          <p className="ci-price-number">
            {formatPriceRange(t.oneTimeLow, t.oneTimeHigh)}
            {t.id === "connected-operations" ? "+" : ""}
          </p>
          <p className="ci-price-caption">One-time project investment · USD</p>
          <ul>
            {t.features.map((f) => (
              <li key={f}>
                <Check size={15} />
                {f}
              </li>
            ))}
          </ul>
          <Link href={`/consultation?scope=${t.id}`} className="ci-text-link">
            Discuss your scope <ArrowUpRight size={17} />
          </Link>
        </article>
      ))}
    </div>
  );
}
