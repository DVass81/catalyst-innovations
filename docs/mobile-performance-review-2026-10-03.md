# Mobile performance review — October 3, 2026

No performance code change was retained. The final local production preview has a **2.753-second median LCP**, still **253 ms above the 2.5-second target**. Its highest measured layout shift was **0.073**, within the 0.1 target.

## Final release measurements

Lighthouse 13.0.1, official signed Google Chrome 154.0.8037.57, local production preview `http://127.0.0.1:3111/`. All three runs used the same mobile simulation settings as the earlier reports: 412 × 823 viewport, 1.75 device scale factor, 4× CPU slowdown and Lighthouse's default simulated mobile network. Browser storage reset was enabled.

| Run | Performance | LCP | CLS | Total blocking time | Accessibility / SEO / Best practices |
| --- | ---: | ---: | ---: | ---: | --- |
| 1 | 94 | 2.846 s | 0.073 | 63 ms | 100 / 100 / 100 |
| 2 | 96 | 2.753 s | 0 | 30.5 ms | 100 / 100 / 100 |
| 3 | 96 | 2.744 s | 0 | 26.5 ms | 100 / 100 / 100 |

No run warnings or Lighthouse runtime errors occurred in these final runs. Separate accessibility and SEO audits both scored 100 for `/contact` and the new `/insights/software-data-migration` guide. Those two audits did not measure performance.

## Investigation and rejected experiment

The actual mobile LCP element is the hero film's poster image. It is present in the initial HTML, loads eagerly with high priority, and transfers about 10.7 KB at the tested viewport. Earlier warm runs spent only 35–39 ms fetching it, followed by 286–370 ms before rendering it. These are raw trace phases, not Lighthouse's simulated LCP times. Layout and framework execution warrant investigation before further image compression.

A mobile-only CSS experiment deferred offscreen homepage layout using `content-visibility: auto` and remembered intrinsic heights. It retained the complete server-rendered HTML and left hero/film logic unchanged. Its three LCP measurements were 2.849, 2.121 and 2.191 seconds, but all three accessibility scores fell to 93. The audit found inconsistent offscreen geometry affecting contrast and target-size checks, and browser checks raised anchor/focus concerns. The CSS was removed in full before the final build. No audit was suppressed to retain the faster result.

The earlier release median was 2.904 seconds. The current 2.753-second result is a fresh measurement, **not proof of a retained optimization**: content changed, and the Lighthouse machine benchmark was much faster this session (final 3014–3061 versus earlier 795.5–1312.5). These local simulated results do not establish real-user Core Web Vitals or production mobile performance.

Further work should test isolated reductions to initial layout and framework/component execution while preserving server content, keyboard navigation, the approved design and film behavior. The rejected containment rule should not be reintroduced without resolving its accessibility and navigation risks. Chrome's [content-visibility guidance](https://web.dev/articles/content-visibility) explains its rendering benefits and accessibility/sizing caveats.

## Evidence

Paths below are relative to the repository root; full Lighthouse reports and captured trace/devtools assets remain in the workspace, outside tracked source:

- Final runs: `../../work/seo-lighthouse-release-2026-10-03-{1,2,3}.json`
- Contact: `../../work/seo-lighthouse-contact-2026-10-03.json`
- New guide: `../../work/seo-lighthouse-guide-2026-10-03.json`
- Rejected experiment: `../../work/seo-lighthouse-render-{1,2,3}.json`
- Earlier baseline: `../../work/seo-lighthouse-final-{1,2,3}.json`
- Compact comparison: `../../work/seo-mobile-performance-evidence-2026-10-03.json`

The first experiment report completed successfully, but its CLI exited during Windows temporary-profile cleanup after saving the report. Later runs used a dedicated benchmark-only Chrome profile and exited successfully. No personal browsing profile was used, and no production changes were made by this review.
