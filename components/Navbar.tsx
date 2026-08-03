"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LogoLockup } from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { navLinks, track } from "@/lib/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change (render-time adjustment, per React docs);
  // lock body scroll while open.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape closes the mobile menu (accessibility).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-navy-900/95 backdrop-blur-md shadow-[0_2px_20px_rgb(0_0_0/0.35)]"
          : "bg-transparent"
      }`}
    >
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <nav aria-label="Main" className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Catalyst Innovations home" className="shrink-0">
          <LogoLockup variant="dark-bg" />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-2 text-[0.86rem] font-medium transition-colors ${
                  active ? "text-white bg-white/10" : "text-ice-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <ThemeToggle className="ml-2" />
          <Link
            href="/consultation"
            onClick={() => track("cta_consultation_click", { location: "navbar" })}
            className="ml-1 inline-flex min-h-[44px] items-center rounded-lg bg-steel-400 px-5 text-[0.86rem] font-semibold text-white transition-colors hover:bg-steel-500"
          >
            Request a Consultation
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-white"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-navy-900 lg:hidden"
          >
            <div className="flex max-h-[calc(100dvh-72px)] flex-col gap-1 overflow-y-auto px-5 pb-8 pt-2">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-4 py-3.5 text-base font-medium text-ice-100 hover:bg-white/8"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/consultation"
                onClick={() => track("cta_consultation_click", { location: "mobile_menu" })}
                className="mt-3 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-steel-400 px-5 font-semibold text-white"
              >
                Request a Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
