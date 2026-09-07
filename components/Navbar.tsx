"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { LogoLockup } from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { MotionToggle } from "./story/StoryMotion";
import { track } from "@/lib/site";
const links = [
  ["/solutions", "Solutions"],
  ["/industries", "Industries"],
  ["/demo-lab", "Demo Lab"],
  ["/pricing", "Pricing"],
  ["/about", "About"],
];
export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
      if (e.key === "Tab") {
        const items = panel.current?.querySelectorAll<HTMLElement>("a, button");
        if (!items?.length) return;
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          trigger.current?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          trigger.current?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  const search = () =>
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true }),
    );
  return (
    <header className="ci-nav">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <nav aria-label="Main" className="ci-container ci-nav-inner">
        <Link href="/" title="Home" onClick={() => setOpen(false)}>
          <LogoLockup markSize={40} />
        </Link>
        <div className="ci-desktop-nav">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="ci-nav-actions">
          <MotionToggle />
          <button
            className="ci-icon-btn ci-search"
            onClick={search}
            aria-label="Search website"
          >
            <Search size={18} />
          </button>
          <span className="ci-theme">
            <ThemeToggle />
          </span>
          <Link
            className="ci-btn ci-btn-small ci-nav-cta"
            href="/consultation"
            onClick={() =>
              track("cta_consultation_click", { location: "navigation" })
            }
          >
            Let’s talk <ArrowUpRight size={17} />
          </Link>
          <button
            ref={trigger}
            className="ci-icon-btn ci-mobile-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
      {open && (
        <div id="mobile-navigation" ref={panel} className="ci-mobile-nav">
          {links.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
              <ArrowUpRight size={18} />
            </Link>
          ))}
          <Link href="/consultation" onClick={() => setOpen(false)}>
            Talk about your project <ArrowUpRight size={18} />
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              search();
            }}
          >
            Search website <Search size={18} />
          </button>
        </div>
      )}
    </header>
  );
}
