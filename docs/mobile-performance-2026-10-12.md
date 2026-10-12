# Mobile performance follow-up — October 12, 2026

The release removes unused legacy styling from the page load. It does **not** establish that the 2.5-second mobile LCP target has been reached.

## Retained change

`app/globals.css` now excludes `components/home` from Tailwind's class discovery. That directory contains the retired September homepage concepts and has no imports from current routes or components. The files remain available; the adjacent comment requires restoring class discovery before reusing them.

This changes generated CSS only. It does not hide or delay server-rendered content, alter the approved homepage or Catalyst Process, change the film, or change calculator, inquiry, booking, or analytics behavior. The previous `content-visibility` experiment was not reused.

The [Tailwind source-detection documentation](https://tailwindcss.com/docs/detecting-classes-in-source-files#ignoring-specific-paths) documents the `@source not` directive. The bundled Next.js 16.3.8 lazy-loading, server/client component, and production guidance was reviewed before implementation. Lazy-loading the demo modal was not attempted because its existing immediate `play()` call preserves the trusted click gesture needed for audible playback.

## Measurements

Official Lighthouse 13.0.1 CLI, Headless Chrome 154, default mobile simulation: 412 × 823 CSS pixels, DPR 1.75, 4× CPU slowdown, 150 ms simulated RTT / 1,638.4 Kbps throughput. All categories were run, with storage reset and a dedicated benchmark profile. No personal browser profile was used.

Baseline: the existing October 9 production build, `03YUKciJ2rwOutj97iJNT`, served on port 3120. Candidate: the October 12 production build on port 3121, including the other approved text/sitemap changes. Both use the same homepage headline, layout, film and controls. Three runs per build were recorded in order; no runs were discarded.

| Mobile homepage | Baseline 1 | Baseline 2 | Baseline 3 | Candidate 1 | Candidate 2 | Candidate 3 |
|---|---:|---:|---:|---:|---:|---:|
| Performance score | 94 | 94 | 95 | 85 | 91 | 96 |
| LCP, seconds | 2.928 | 2.908 | 2.849 | 3.378 | 2.971 | 2.818 |
| CLS | 0.0717 | 0 | 0 | 0 | 0 | 0 |
| Total blocking time, ms | 41.5 | 113 | 96 | 267 | 195 | 60.5 |
| Accessibility | 100 | 100 | 100 | 100 | 100 | 100 |
| Best practices | 100 | 100 | 100 | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 | 100 | 100 | 100 |

- CSS transferred on the homepage: **29,661 → 23,037 bytes**, a reduction of **6,624 bytes / 22.3%** in every run.
- Uncompressed CSS loaded by the homepage: **137,797 → 105,172 bytes**, a reduction of **32,625 bytes / 23.7%**. The smaller output also consolidated a stylesheet request.
- Initial JavaScript transfer: **176,774 bytes before and after**. No JavaScript reduction is claimed.
- Median LCP: **2.908 → 2.971 seconds**. This session does not demonstrate an LCP improvement. The candidate median is about **0.47 seconds above** the target.
- Median CLS is **0** in both sets, within the 0.1 target. Every recorded run is below 0.1.

The mobile headline remains the LCP element with the same measured bounds. Main-thread execution varied from 1.40–2.14 seconds in the baseline and 1.43–2.41 seconds in the candidate. Independent work occurred on the host during parts of the session, including tests near the third baseline run. These are comparable lab settings, not an isolated causal experiment or real-user field data. The deterministic CSS reduction is the reason to retain the change; the score and timing variation should not be presented as a speed guarantee.

Some Windows Lighthouse processes reported an `EPERM` error deleting their temporary directory **after** saving their complete reports and traces. All six reports have no report-level runtime error and no run warnings. Those cleanup errors were not used as grounds for selective reruns.

## Safety and content checks

- Production build and TypeScript completed successfully, with 99 prerendered pages in the build progress.
- Parsed the before/after CSS with Lightning CSS and scanned the 119 current TypeScript/JavaScript source files outside the legacy directory using Tailwind's scanner. Of the **396 removed class selectors**, **none** matched a class candidate in those current sources.
- The current source import check found **zero** imports from `components/home`.
- Prerendered homepage HTML still includes the headline and Catalyst Process; Lighthouse accessibility, SEO and best-practices checks remained at 100 in all candidate runs.
- Interactive and visual browser review, lint, full regression tests and the final route crawl are recorded with the consolidated release checks by the parent task.

## Redirect finding

On October 12, a direct request to `https://mycatalystinnovations.com/` returned **200 with zero redirects**. Starting from HTTP produced **one redirect to HTTPS**, then 200. One observation measured approximately 67 ms for the redirect; this is not a stable latency promise. Ubersuggest's redirect recommendation should not lead to removal of the HTTPS redirect or a claim that canonical HTTPS visitors incur its reported 630 ms delay. Public links should continue to use HTTPS directly.

## Evidence files

All paths below are relative to the repository:

- `../../work/seo-mobile-before-2026-10-12-{1,2,3}.json`
- `../../work/seo-mobile-after-2026-10-12-{1,2,3}.json`
- Matching `-0.trace.json` and `-0.devtoolslog.json` files for each run.
- `../../work/seo-mobile-before-shared-2026-10-12.css`
- `../../work/seo-css-coverage-2026-10-12.json`

The next performance decision should use a quiet-host comparison and, when sufficient traffic exists, real-user Core Web Vitals. The remaining unused-JavaScript finding is primarily in the shared React/Next framework chunk; no safe application-specific removal was established in this pass.
