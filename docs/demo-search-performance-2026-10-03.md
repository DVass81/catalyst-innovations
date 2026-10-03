# Demo search release: mobile performance — October 3, 2026

The updated homepage's three-run median largest contentful paint (LCP) is **2.682 seconds**, compared with **2.750 seconds** for the existing production build tested immediately before it. The **2.5-second target is not yet met**: the current gap is 182 ms. All three updated runs measured **0 layout shift (CLS)**, within the 0.1 target, and scored **100 for accessibility, SEO and best practices**.

These are local, simulated mobile measurements, not real-user Core Web Vitals or proof of Google rankings. The full release includes new demo links as well as the selector change, and a 68 ms difference is small enough that machine variation matters. It should not be presented as a guaranteed visitor-speed improvement attributable to one change.

## Retained implementation

The homepage industry selector now receives display-ready fields from its server wrapper. Its browser code no longer imports and processes the complete industry source records and workflow definitions. The selector's initial server-rendered content, all 19 options, problems, recommendations and interactions remain. No offscreen content was hidden, and the approved hero poster, footage and playback logic were unchanged.

Measured transferred JavaScript fell from **183,083 to 176,744 bytes** (6,339 bytes / 3.5%). Moving the necessary display data into server props increased HTML from **17,118 to 21,590 bytes**. Combined JavaScript plus HTML transfer therefore decreased by **1,867 bytes**. This is a modest payload reduction, not a large performance claim.

## Comparable homepage measurements

Lighthouse 13.0.1, signed Google Chrome 154.0.8037.57, 412 × 823 simulated mobile viewport, 1.75 device scale factor, 4× CPU slowdown and the default simulated mobile network. Browser storage reset was enabled. Both sets used an isolated benchmark profile rather than Daniel's browser session. Baseline URL: `http://127.0.0.1:3112/`; updated build: `http://127.0.0.1:3113/`.

| Build / run | Performance | LCP | CLS | Total blocking time | Accessibility / SEO / best practices |
| --- | ---: | ---: | ---: | ---: | --- |
| Existing / 1 | 94 | 2.858 s | 0.073 | 47 ms | 100 / 100 / 100 |
| Existing / 2 | 96 | 2.750 s | 0 | 28 ms | 100 / 100 / 100 |
| Existing / 3 | 96 | 2.737 s | 0 | 24.5 ms | 100 / 100 / 100 |
| Updated / 1 | 96 | 2.682 s | 0 | 32 ms | 100 / 100 / 100 |
| Updated / 2 | 96 | 2.684 s | 0 | 33 ms | 100 / 100 / 100 |
| Updated / 3 | 96 | 2.669 s | 0 | 28 ms | 100 / 100 / 100 |

Lighthouse benchmark indices were 3,085–3,178.5 for the baseline and 2,857–3,129.5 for the updated build. The reports contain no Lighthouse runtime errors or run warnings. Initial sandbox attempts could not connect to the isolated benchmark browser; the completed audits used an approved escalation. Windows temporary-profile cleanup failed after valid reports had already been written for baseline run 3 and updated run 2; this was a CLI cleanup error, not a page-audit error.

## New flooring demonstration page

One initial mobile audit of `/portfolio/flooring` scored **94 performance**, **100 accessibility**, **100 SEO**, and **100 best practices**, with **3.037-second LCP**, **0 CLS**, and **25 ms total blocking time**. This single run is not a three-run performance baseline.

The LCP element was the video's full-size 1920 × 1080 poster (43,494-byte resource; 44,432 transferred including headers) at a 372 px displayed width. It did not receive a high-priority image hint. The raw trace recorded 5.98 ms TTFB, 9.156 ms resource load delay, 9.089 ms resource load time and 220.541 ms rendering delay. The poster request already began at 19.125 ms, close to CSS requests at 17.47–17.88 ms, so discovery is not the dominant observed bottleneck. These are raw phases, not the simulated 3.037-second LCP.

An explicit high-priority poster preload is a small, reasonable experiment for constrained-network queueing; it should not be represented as a proven large improvement. Responsive poster delivery could reduce transfer size, but an additional image overlay would need playback, accessibility and duplicate-request checks. The native video itself uses `preload="none"`; no autoplay was added to direct visits.

The homepage's remaining likely opportunities are framework execution and render-blocking shared styles; its hero poster is already small, server-rendered, eager and high priority. Further work must preserve keyboard access, complete server-rendered content and the approved appearance. The previously rejected content-visibility experiment was not reintroduced.

## Evidence

Paths are relative to this repository; full reports and traces remain in the workspace outside tracked source:

- Existing build: `../../work/seo-demo-baseline-2026-10-03-{1,2,3}.json`
- Existing compact summary: `../../work/seo-demo-baseline-summary-2026-10-03.json`
- Existing compiled homepage: `../../work/seo-demo-baseline-home.html`
- Updated homepage: `../../work/seo-demo-final-2026-10-03-{1,2,3}.json`
- Flooring: `../../work/seo-demo-flooring-2026-10-03.json`
- Matching `-0.trace.json` and `-0.devtoolslog.json` files accompany all seven reports. The flooring CLI also encountered a temporary-profile cleanup error only after its valid report was saved.
