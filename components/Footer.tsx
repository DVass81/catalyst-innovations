import Link from "next/link";
import { LogoLockup } from "./Logo";
import AnalyticsPreferences from "./AnalyticsPreferences";
import { site } from "@/lib/site";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <LogoLockup variant="dark-bg" />
          <p>
            Make more. Save time.
            <br />
            Work smarter.
          </p>
          <small>Knoxville, Tennessee</small>
          <a href={`tel:${site.contactPhone}`}>{site.contactPhoneLabel}</a>
        </div>
        <div>
          <span className="overline">Explore</span>
          <Link href="/solutions">Solutions</Link>
          <Link href="/industries">Industries</Link>
          <Link href="/portfolio">Demos</Link>
          <Link href="/insights">Insights</Link>
        </div>
        <div>
          <span className="overline">Start a conversation</span>
          <Link href="/consultation">Discuss my business ↗</Link>
          <Link href="/tools">Savings tools</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/about">About Catalyst</Link>
          <Link href="/contact">Contact & hours</Link>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} Catalyst Innovations</span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/accessibility">Accessibility</Link>
          <AnalyticsPreferences />
        </div>
      </div>
    </footer>
  );
}
