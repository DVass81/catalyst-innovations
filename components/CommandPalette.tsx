"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, CornerDownLeft, ArrowUp, ArrowDown } from "lucide-react";
import { services } from "@/data/services";
import { industries } from "@/data/industries";
import { products } from "@/data/products";
import { insights } from "@/data/content";
import { Icon } from "./Icon";
import { track } from "@/lib/site";

type Item = { group: string; title: string; subtitle: string; href: string; icon: string };

const staticPages: Item[] = [
  { group: "Pages", title: "Home", subtitle: "Back to the beginning", href: "/", icon: "AppWindow" },
  { group: "Pages", title: "The Catalyst Method", subtitle: "How we work, six stages", href: "/method", icon: "Rocket" },
  { group: "Pages", title: "Demo Lab", subtitle: "Interactive product demonstrations", href: "/demo-lab", icon: "MonitorPlay" },
  { group: "Pages", title: "Founders", subtitle: "Daniel Vass & Josh Ogle", href: "/founders", icon: "Briefcase" },
  { group: "Pages", title: "Request a Consultation", subtitle: "Start a conversation", href: "/consultation", icon: "ShoppingCart" },
  { group: "Pages", title: "Find Your Starting Point", subtitle: "A short assessment", href: "/start", icon: "Search" },
];

function buildIndex(): Item[] {
  return [
    ...staticPages,
    ...services.map((s) => ({ group: "Solutions", title: s.title, subtitle: s.tagline, href: `/solutions/${s.slug}`, icon: s.icon })),
    ...industries.map((i) => ({ group: "Industries", title: i.name, subtitle: i.problems[0] ?? "", href: `/industries#${i.slug}`, icon: i.icon })),
    ...products.map((p) => ({ group: "Innovation Portfolio", title: p.name, subtitle: p.status, href: "/portfolio", icon: p.icon })),
    ...insights.filter((a) => !a.draft).map((a) => ({ group: "Insights", title: a.title, subtitle: a.category, href: `/insights/${a.slug}`, icon: "PenTool" })),
  ];
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const index = useMemo(() => buildIndex(), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index.slice(0, 8);
    return index
      .filter((i) => i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q) || i.group.toLowerCase().includes(q))
      .slice(0, 12);
  }, [query, index]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Render-time state reset (React-recommended alternative to setState-in-effect):
  // whenever the dialog opens or the query changes, adjust state during render
  // itself instead of in a follow-up effect.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setActive(0);
    }
  }
  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActive(0);
  }

  // Genuine side effects (DOM mutation, analytics, focus) stay in an effect.
  useEffect(() => {
    if (open) {
      track("demo_interaction", { widget: "command_palette", action: "open" });
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function go(item: Item) {
    setOpen(false);
    router.push(item.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  }

  return (
    <>
      {/* Discoverability trigger — small, unobtrusive, bottom corner */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open search (Ctrl+K)"
        className="fixed bottom-5 right-5 z-40 hidden min-h-[44px] items-center gap-2 rounded-full border border-ice-200 bg-white/95 px-4 text-sm font-medium text-navy-700 shadow-card backdrop-blur transition-colors hover:border-steel-400/50 lg:flex"
      >
        <Search size={15} />
        Search
        <kbd className="ml-1 rounded border border-ice-200 bg-ice-50 px-1.5 py-0.5 font-mono text-[0.65rem] text-silver-500">Ctrl K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Site search"
            className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-xl overflow-hidden rounded-card border border-ice-200 bg-white shadow-card-dark"
            >
              <div className="flex items-center gap-3 border-b border-ice-200 px-5 py-4">
                <Search size={18} className="shrink-0 text-silver-400" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search solutions, industries, portfolio, insights…"
                  className="w-full bg-transparent text-[0.95rem] text-navy-900 placeholder:text-silver-400 focus:outline-none"
                />
                <kbd className="hidden shrink-0 rounded border border-ice-200 bg-ice-50 px-1.5 py-0.5 font-mono text-[0.65rem] text-silver-500 sm:block">Esc</kbd>
              </div>

              <div role="listbox" className="max-h-[60vh] overflow-y-auto p-2">
                {results.length === 0 && (
                  <p className="px-4 py-8 text-center text-sm text-silver-500">No matches. Try a different term.</p>
                )}
                {results.map((item, i) => (
                  <button
                    key={item.href + item.title}
                    type="button"
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(item)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                      i === active ? "bg-steel-400/10" : "hover:bg-ice-50"
                    }`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ice-100 text-steel-600">
                      <Icon name={item.icon} size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-navy-900">{item.title}</span>
                      <span className="block truncate text-xs text-silver-500">{item.group} · {item.subtitle}</span>
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 border-t border-ice-200 px-5 py-2.5 text-[0.7rem] text-silver-500">
                <span className="flex items-center gap-1"><ArrowUp size={11} /><ArrowDown size={11} /> Navigate</span>
                <span className="flex items-center gap-1"><CornerDownLeft size={11} /> Select</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
