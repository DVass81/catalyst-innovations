# Warm working studio: complete website preview

Daniel approved the Home and Manufacturing pilot on October 30, 2026. This release extends that direction across the remaining public pages on `design/warm-working-studio`. The approved homepage film and Manufacturing composition remain intact. Production publication is a separate step after review of this complete preview.

## What changed

- **Industries:** all 19 direct pages retain their three early problem/improvement pairs, guide, FAQ, calculators and inquiry context. Eighteen gain photographed editorial layouts and individual proposed workflows with exception paths; Manufacturing retains its approved pilot. The directory keeps all industry links and anchor IDs in six photographed groups.
- **Services and Solutions:** ten service offerings and their destinations remain. The actual three demo links and prototype distinctions are preserved. Eight solution pages now use distinct, labeled process diagrams and appropriate contextual photography. The Solutions directory retains its problem finder and all eight destinations.
- **About and Method:** verified founder profiles lead the About content, followed by the on-site working approach. The shared discovery/build process and its written-proposal qualifications remain consistent. Original portrait photography can replace the approved edited portraits when supplied.
- **Blog and Guides:** the separate editorial Blog keeps its Friday direction and honest empty state. Guides remain eight static references at their existing URLs, with relevant photographs and concise visual introductions. Approved CMS cover support, attribution, sources, sharing and inquiry context remain. The editor connection remains a separate dependency.
- **Discovery, Contact and questionnaire:** updated typography, spacing and restrained panels; discovery remains $250, credited toward implementation if Catalyst is selected. The introductory Calendly conversation stays separate. Form payloads, validation, delivery integrations and booking destinations are unchanged.
- **Demos, tools and legal pages:** larger readable application screenshots with existing players/transcripts; focused calculator and reading layouts; no decorative photography in calculation or legal tasks. Calculator formulas, local processing, optional figure attachment and legal text are unchanged. Native print styling stays outside the screen-only visual overrides.
- **Other states:** the portal placeholder remains noindex and outside the sitemap; missing-page and editorial error screens use the same visual language. Existing retired-page redirects remain.

## Assets and implementation

Eight actual, licensed photographs are hosted locally, with representative labels, photographer credits and official source links. Plumbing and Painting have their own trade-specific photos; financial institutions use planning imagery for internal review workflows. No photograph is presented as Catalyst staff, a client or a verified project. Provenance is recorded in `studio-media-sources.md`; the phone-photo checklist remains in `studio-photo-guide.md`.

Typed visual definitions feed shared server-rendered `StudioPhoto` and `WorkflowDiagram` components. New diagrams remain readable without playback or JavaScript and are clearly distinguished from delivered application capabilities. No media generation, paid service, hosting, public API or dependency-package changes are included.

## Verification

- All 131 tests pass, including calculator edge cases, mocked inquiry delivery/failure paths, analytics consent/privacy, content context, media boundaries and Blog/Guides separation. A regression check verifies that diagrams keep a valid heading sequence with or without their own title.
- ESLint, TypeScript and production build pass.
- The final local production crawl passes all 78 sitemap pages, canonical/social metadata, redirects, missing-page responses and media checks. Updated evidence is in `seo-crawl-verification.json` and `.md`.
- A 390-pixel phone viewport was checked across Services, Custom Software, Plumbing, HOA, About, questionnaire, calculator, Blog, Guide, Discovery, Contact, Privacy, demo player and Industries. No horizontal overflow was found. Services, Solutions, Industries and About were also checked at 820 pixels. Desktop source imagery and actual-screen presentation were reviewed.
- Phone navigation opens with Enter and closes with Escape, preserving the existing order and returning focus to the trigger. The calculator example returns 200 hours for 1,200 activities at ten minutes each; the attach-results checkbox remains unchecked. The inquiry receives the tool and Plumbing context without automatically attaching figures.
- No real inquiry, external email, appointment, payment or live customer record was submitted or changed. Local preview delivery credentials are not configured, so its existing email-draft option is shown honestly; production provider configuration was not changed or verified by this visual release.
- The hero's existing reduced-motion, visibility, playback-error and one-player controller tests pass. New process illustrations are static. The screen-only task-page CSS preserves existing calculator print rules; no physical print job was created.

Initial full-rollout captures identified a skipped heading level in untitled industry diagrams, an above-fold Guide image using lazy loading, and a demo poster without an early priority hint. The heading sequence now follows its surrounding section; the first Guide photograph loads eagerly with high priority; demo watch pages preload only their poster image with high priority. Native video still uses `preload="none"`, manual direct-visit playback, captions and its existing controls.

### Mobile performance and accessibility

Official Lighthouse 13.0.1 / Chrome 155 mobile checks used fresh browser profiles, a 412 × 823 viewport, simulated mobile networking and four-times CPU slowdown. Each median below represents three comparable runs. All sampled pages have zero measured layout shift (CLS).

| Page | Performance | Median LCP | CLS |
| --- | ---: | ---: | ---: |
| Home | 98 | 2.262 s | 0 |
| Services | 98 | 2.263 s | 0 |
| Custom Software | 99 | 2.114 s | 0 |
| Plumbing, corrected build | 99 | 2.041 s | 0 |
| Data Migration Guide, corrected build | 99 | 2.112 s | 0 |
| Painting walkthrough, corrected build | 95 | 2.960 s | 0 |

The Painting walkthrough remains **0.460 seconds above the 2.5-second LCP target**. Its poster now passes all early-discovery, eager-loading and priority checks, but the measured LCP did not improve materially. That remaining gap is reported rather than hidden by a passing performance score. The Guide improved from an initial single 2.753-second sample to the corrected 2.112-second median.

The pre-rollout Services and Custom Software baseline medians were 2.187 and 2.039 seconds respectively. Their first full-rollout medians increased by approximately 0.076 and 0.075 seconds, while remaining within target. A final-build Custom Software spot check measured 2.039 seconds; one spot check is not a replacement for the earlier three-run median. Other initial single samples were About 2.113 seconds, Manual-work Calculator 1.958 seconds, Contact 1.957 seconds and Discovery 2.039 seconds.

All ten corrected-build captures score **100 accessibility, 100 best practices and 100 SEO**, with no failed weighted accessibility checks, heading-order or contrast checks, runtime errors or unexpected process failures. The earlier primary-page and broader samples also score 100 in those categories except the industry heading issue, which the corrected build resolves.

The final production build is `DFPaGLXlyWjBdtYY2uFMP`. All reports are retained outside this repository in the surrounding workspace's `work/studio-rollout` folder: twelve original primary-page reports in `candidate`, six broader samples in `candidate-extras`, ten final targeted reports in `candidate-corrections`, and the pre-rollout reports in `baseline`. Initial full-rollout primary medians came from build `f0Pl77Nvq_FUW5FlBIqXa`. These measurements are local lab tests, not a Google ranking score or real-user field data.

## Review addresses

- http://127.0.0.1:3132/services
- http://127.0.0.1:3132/solutions/custom-software
- http://127.0.0.1:3132/industries
- http://127.0.0.1:3132/industries/painting
- http://127.0.0.1:3132/about
- http://127.0.0.1:3132/insights/software-data-migration

The pending Blog/Guides correction is preserved beneath this work. Deploy the corrected code before or together with any future Sanity configuration; do not activate new CMS settings on the older live implementation. This preview does not claim that the publishing account has been connected.
