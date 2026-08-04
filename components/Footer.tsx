import Link from "next/link";
import { LogoLockup } from "./Logo";
import { site } from "@/lib/site";
import { services } from "@/data/services";
import { industries } from "@/data/industries";

const companyLinks = [
  { href: "/#about", label: "About" },
  { href: "/founders", label: "Founders" },
  { href: "/method", label: "The Catalyst Method" },
  { href: "/portfolio", label: "Innovation Portfolio" },
  { href: "/insights", label: "Insights" },
  { href: "/demo-lab", label: "Demo Lab" },
  { href: "/portal", label: "Client Portal" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-ice-300">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label="Catalyst Innovations home">
              <LogoLockup variant="dark-bg" />
            </Link>
            <p className="mt-5 font-display text-sm font-semibold tracking-[0.14em] text-white uppercase">
              {site.motto}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-silver-400">
              Catalyst Innovations identifies operational problems, redesigns inefficient
              processes, and builds intelligent technology that helps businesses make more
              money, save time, and operate more efficiently.
            </p>
            <p className="mt-4 text-sm text-silver-400">{site.location}</p>
            <Link
              href="/consultation"
              className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-steel-400 px-5 text-sm font-semibold text-white transition-colors hover:bg-steel-500"
            >
              Request a Consultation
            </Link>
            {/* Social placeholders — TODO(founders): add real account URLs in lib/site.ts */}
            <p className="mt-6 text-xs text-silver-500">
              Social profiles coming soon.
            </p>
          </div>

          <nav aria-label="Solutions">
            <h2 className="font-display text-xs font-semibold tracking-[0.22em] text-white uppercase">
              Solutions
            </h2>
            <ul className="mt-4 space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/solutions/${s.slug}`} className="text-sm hover:text-white transition-colors">
                    {s.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Industries">
            <h2 className="font-display text-xs font-semibold tracking-[0.22em] text-white uppercase">
              Industries
            </h2>
            <ul className="mt-4 space-y-2.5">
              {industries.slice(0, 8).map((i) => (
                <li key={i.slug}>
                  <Link href={`/industries#${i.slug}`} className="text-sm hover:text-white transition-colors">
                    {i.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/industries" className="text-sm text-steel-300 hover:text-white transition-colors">
                  All industries →
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="font-display text-xs font-semibold tracking-[0.22em] text-white uppercase">
              Company
            </h2>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-silver-500">
            © {new Date().getFullYear()} Catalyst Innovations. All rights reserved.
          </p>
          <p className="text-xs italic text-silver-500">
            Built to make more, save time, and work smarter.
          </p>
          <ul className="flex gap-5 text-xs">
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
            <li><Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
