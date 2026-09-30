"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Progressive enhancement: content stays readable when scripts or motion fail. */
export default function SectionMotion() {
  const path = usePathname();
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          observer.unobserve(target);
          if (!preference.matches)
            animations.push(
              target.animate(
                [
                  { opacity: 0.75, transform: "translateY(12px)" },
                  { opacity: 1, transform: "none" },
                ],
                { duration: 450, easing: "cubic-bezier(.2,.7,.3,1)" },
              ),
            );
        });
      },
      { threshold: 0.2 },
    );
    document
      .querySelectorAll(".section-heading, .process-grid > div")
      .forEach((el) => observer.observe(el));
    const stop = () => {
      if (preference.matches) animations.forEach((a) => a.cancel());
    };
    preference.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", stop);
      animations.forEach((a) => a.cancel());
    };
  }, [path]);
  return null;
}
