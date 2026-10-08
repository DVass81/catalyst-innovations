"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { LogoLockup } from "./Logo";
export const links = [
  ["Services", "/services"],
  ["Solutions", "/solutions"],
  ["Industries", "/industries"],
  ["Pricing", "/pricing"],
  ["Savings Tools", "/tools"],
  ["About", "/about"],
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  return (
    <header
      className="site-header"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="site-nav wrap">
        <Link
          href="/"
          title="Catalyst Innovations home"
          onClick={() => setOpen(false)}
        >
          <LogoLockup variant="light-bg" />
        </Link>
        <nav className="desktop-nav" aria-label="Main">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={path.startsWith(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link className="button nav-cta" href="/consultation">
          Discuss my business <ArrowUpRight size={15} />
        </Link>
        <button
          ref={toggle}
          className="mobile-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={path.startsWith(href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link href="/consultation" onClick={() => setOpen(false)}>
            Discuss my business ↗
          </Link>
        </nav>
      )}
    </header>
  );
}
