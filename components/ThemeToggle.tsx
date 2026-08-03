"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * Toggles the `.dark` class on <html>. Pairs with the blocking inline
 * script in layout.tsx (ThemeScript) that sets the class before first
 * paint, so there's no flash of the wrong theme.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Reads DOM state set by the blocking pre-hydration script (see layout.tsx).
    // Deliberately deferred to an effect (not a lazy initializer) so SSR and
    // first client render match — the icon corrects itself right after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("ci-theme", next ? "dark" : "light");
    } catch {
      /* localStorage unavailable — theme just won't persist */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-ice-300 transition-colors hover:bg-white/10 hover:text-white ${className}`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
