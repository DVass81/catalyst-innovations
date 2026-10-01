import Link from "next/link";
import { LogoLockup } from "./Logo";
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
        </div>
        <div>
          <span className="overline">Explore</span>
          <Link href="/solutions">Solutions</Link>
          <Link href="/industries">Industries</Link>
          <Link href="/portfolio">Demos</Link>
        </div>
        <div>
          <span className="overline">Start a conversation</span>
          <Link href="/consultation">Discuss my business ↗</Link>
          <Link href="/tools">Savings tools</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/about">About Catalyst</Link>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} Catalyst Innovations</span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/accessibility">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
}
