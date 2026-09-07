import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LogoLockup } from "./Logo";
import { site } from "@/lib/site";
import { services } from "@/data/services";
export default function Footer() {
  return (
    <footer className="ci-footer">
      <div className="ci-container">
        <div className="ci-footer-grid">
          <div>
            <Link href="/" title="Home">
              <LogoLockup markSize={42} />
            </Link>
            <p>
              Custom systems.
              <br />
              Connected work.
              <br />A better way forward.
            </p>
            <span>{site.location}</span>
            <Link href="/consultation" className="ci-text-link">
              Talk about your project <ArrowUpRight size={16} />
            </Link>
          </div>
          <nav aria-label="Solutions">
            <h2>WHAT WE BUILD</h2>
            {services.map((s) => (
              <Link key={s.slug} href={`/solutions/${s.slug}`}>
                {s.navLabel}
              </Link>
            ))}
          </nav>
          <nav aria-label="Explore">
            <h2>EXPLORE</h2>
            {[
              ["/industries", "Industries"],
              ["/demo-lab", "Demo Lab"],
              ["/pricing", "Pricing"],
              ["/roi-estimator", "ROI estimator"],
              ["/roi-estimator#assessment", "Starting-point assessment"],
              ["/method", "The Catalyst Method"],
              ["/portfolio", "Innovation portfolio"],
            ].map(([href, label]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
          <nav aria-label="Company">
            <h2>CATALYST</h2>
            {[
              ["/about", "Our story"],
              ["/founders", "Daniel & Josh"],
              ["/contact", "Contact"],
              ["/consultation", "Start a conversation"],
              ["/portal", "Client portal"],
            ].map(([href, label]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
            {site.contactEmail && (
              <a href={`mailto:${site.contactEmail}`}>
                Email the team <ArrowUpRight size={13} />
              </a>
            )}
          </nav>
        </div>
        <div className="ci-footer-bottom">
          <span>© {new Date().getFullYear()} Catalyst Innovations</span>
          <span>Built around your business.</span>
          <nav aria-label="Policies">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/accessibility">Accessibility</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
