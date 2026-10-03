# Shared CSS performance follow-up — October 3, 2026

The site now downloads **3,442 fewer bytes of render-blocking CSS** on both the homepage and dedicated demo pages. This change preserves the approved appearance and film. **The measured 2.5-second LCP target remains unmet**, and these latest tests do not demonstrate faster LCP.

## What changed

The root layout previously loaded the full 23,562-byte `motion-story.css` file on every route. Almost all of that stylesheet belongs to the retired simulated-software interface. Neither `SoftwareStory` nor `RealSoftwarePreview` is imported by a current route or another component.

The six shared rules still relevant to the surrounding site were copied without changing their declarations, media conditions or cascade position into `motion-shared.css` (487 source bytes). This preserves hero gaps at the existing breakpoints, the optional story-film presentation and print behavior, and the industry wrapper rule. The full legacy stylesheet is now imported only by the two legacy components that need it, so it remains available if those components are deliberately reused.

A source audit and scan of 56 compiled HTML documents found no other current matches needing the legacy sheet. No offscreen content was hidden. There were no changes to the hero artwork, film, playback, API, privacy, calculator or booking behavior.

All **62 existing tests** pass, including the server-rendered motion-content checks; the standalone test loader required one CSS no-op mock. Full lint passes. The parent release check also completed the production build, type checking and 76-page SEO crawl.

## Transfer results

| Page | Before: CSS transferred | After: CSS transferred | Reduction |
| --- | ---: | ---: | ---: |
| Homepage | 32,740 bytes | 29,298 bytes | 3,442 bytes / 10.5% |
| Flooring demo | 35,459 bytes | 32,017 bytes | 3,442 bytes / 9.7% |

These network totals include response headers. The reduction is consistent across all three runs for each page. Browser JavaScript and HTML transfer remained effectively unchanged from the immediately preceding demo release.

## Current measured performance

The same Lighthouse 13.0.1 and signed Chrome 154 toolchain used the same mobile settings: 412 × 823 viewport, device scale factor 1.75, 4× CPU slowdown, default simulated mobile network, storage reset enabled, isolated benchmark profile. The tested production preview was `http://127.0.0.1:3115/`.

| Page / run | Performance | LCP | CLS | Total blocking time | Host benchmark index |
| --- | ---: | ---: | ---: | ---: | ---: |
| Home / 1 | 92 | 3.091 s | 0.073 | 98 ms | 2,490.5 |
| Home / 2 | 96 | 2.779 s | 0 | 43 ms | 2,502.5 |
| Home / 3 | 95 | 2.823 s | 0 | 57 ms | 2,659 |
| Flooring / 1 | 90 | 3.390 s | 0 | 148 ms | 1,422.5 |
| Flooring / 2 | 90 | 3.383 s | 0 | 132.5 ms | 2,103 |
| Flooring / 3 | 92 | 3.286 s | 0 | 73.5 ms | 2,199 |

Every run scored **100 for accessibility, SEO and best practices**. The homepage median is **2.823 seconds**, leaving a **323 ms** gap to the 2.5-second target; flooring's median is **3.383 seconds**, leaving an **883 ms** gap. All CLS measurements meet the 0.1 target.

The preceding demo release measured 2.682-second median homepage LCP and a single 3.037-second flooring result. Those runs had substantially faster host benchmark indices: 2,857–3,129.5 for the homepage and 3,146 for flooring. The host slowed during this follow-up, and blocking time increased. Therefore the apparent LCP worsening cannot be reliably attributed to the CSS change, and the payload reduction cannot be advertised as a proven LCP improvement. Do not substitute the earlier, better timing for this final build's measurements or claim that the mobile target has been achieved.

These are local lab results, not production real-user Core Web Vitals. Future work should measure production under controlled conditions, then target the remaining framework execution and shared layout work. The earlier flooring trace already showed that its poster was discovered promptly; no speculative image-overlay or preload change was made. The previous accessibility-breaking `content-visibility` experiment remains excluded.

## Evidence and tool limitations

Paths are relative to the repository root:

- Homepage reports: `../../work/seo-css-home-2026-10-03-{1,2,3}.json`
- Flooring reports: `../../work/seo-css-flooring-2026-10-03-{1,2,3}.json`
- Compact metrics: `../../work/seo-css-followup-summary-2026-10-03.json`
- Matching `-0.trace.json` and `-0.devtoolslog.json` files accompany all six reports.
- Earlier comparison: [demo-search-performance-2026-10-03.md](demo-search-performance-2026-10-03.md)

All six Lighthouse reports completed without report-level runtime errors or warnings. Windows temporary-profile cleanup failed after the valid report was saved for homepage run 1 and flooring run 1. This CLI cleanup failure did not invalidate the captured page audits. Daniel's browsing profile was not used or changed, and the preview server remained running after testing.
