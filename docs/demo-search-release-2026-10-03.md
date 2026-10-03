# Searchable software demonstrations — October 3, 2026

## Prepared release

Three dedicated pages explain the existing real application recordings for buyers who search for a workflow rather than Catalyst's name:

| Page | Focus | Boundary |
| --- | --- | --- |
| `/portfolio/hoa` | HOA maintenance request intake and review | Fictional public sample; recording stops before submission |
| `/portfolio/flooring` | Flooring measurements, allowances, costing and estimate review | Actual application with sample data; no private entry link or proposal sending |
| `/portfolio/painting` | Room-by-room painting scope, costing and review | Planned system and demonstration prototype; sending/approval simulated |

Each page includes an initial-HTML native video player, English captions, the complete visible transcript, verified screenshots, related services/industries/guides/calculators, and a demo-specific inquiry link. Native controls support manual playback on direct visits. Existing homepage/gallery buttons retain click-to-play modal behavior and original anchors. New text links expose the dedicated pages to visitors and crawlers.

Unique titles, descriptions, canonicals and breadcrumb markup are present. The sitemap includes all three watch pages and video entries with the actual content and thumbnail URLs and duration. No public upload date is authenticated in the source evidence, so no date is invented for VideoObject markup. Video indexing or a rich result is not guaranteed.

The homepage industry selector now prepares its data on the server and sends only the fields the interaction needs. Its content, recommendations and controls remain intact. The approved homepage layout, film, calculator formulas, inquiry API, booking and pricing are unchanged.

## Verification

- 62 automated tests pass, including six new watch-page tests. Full lint, TypeScript and production build pass; 98 routes generated.
- Local production crawl: **76/76 sitemap pages pass**. Unique titles/descriptions, canonical/social metadata, structured information, redirects, unknown-route 404/noindex behavior and portal handling checked. All nine demo video/poster/caption assets return the expected HTTP status and content type. See `seo-crawl-verification.md` and `.json`.
- Browser checks: desktop, 390-pixel phone and 820-pixel tablet layouts; no horizontal overflow in sampled mobile views; complete 16:9 video framing; keyboard play/pause; navigation resets to the correct new recording; inquiry carries painting industry/demo context.
- Homepage selector changed from plumbing to manufacturing with the correct problems, examples and calculators. Existing gallery button starts the flooring recording, pauses the hero, closes on Escape and restores focus. Browser logs show no errors or warnings during normal checks.
- Local-only failure fixture returned 404 for demo MP4 requests. The player displayed a readable error, offered manual retry, and retained working transcript/screenshot access. Fixture stopped after the check. No live customer records, inquiries or bookings were created.
- Initial HTML checks establish readable content without JavaScript. Existing reduced-motion and visibility/controller regression tests pass; no new autoplay is introduced on the watch pages. A physical phone, every browser/assistive technology combination and forced hidden-tab playback were not separately re-tested.
- Preview analytics was disabled. New paths are explicitly allowlisted; privacy/consent/event tests pass. No live analytics or inquiry delivery claims follow from these local tests.

## Measured mobile loading

Three comparable local production homepage runs show median LCP **2.682 seconds**, compared with **2.750 seconds** immediately before the release. JavaScript transfer decreases **3.5%**; all final homepage runs score 96 performance, 100 accessibility/SEO/best practices and 0 CLS. LCP remains **182 ms above** the 2.5-second target. The small timing difference is subject to laboratory noise.

One flooring-page audit scores 94 performance, 100 accessibility/SEO/best practices and 0 CLS, with **3.037-second LCP**. Its remaining work is primarily rendering rather than late poster discovery. These are simulated local measurements, not real-user Core Web Vitals or search-ranking scores. Full methodology and evidence: `demo-search-performance-2026-10-03.md`.

## Google status and release boundary

The existing production sitemap now reports **Sitemap processed successfully**, last read October 3, with **71 discovered pages** and 0 discovered videos. The earlier fetch warning has cleared. This count is discovery, not indexed pages. Search Console Performance still says it is processing data; impressions, clicks and query/position baseline remain pending.

Prepared on `redesign/clearer-catalyst`, preview `http://127.0.0.1:3113/portfolio/flooring`. No production push, deployment, sitemap resubmission or indexing request was performed for this release. The current live site remains in place for review. After an approved deployment, verify the three live pages/media URLs and the video sitemap, then assess discovery/indexing through Search Console once reporting is available. Google Business Profile verification was not changed or advanced during this work.

Preview screenshot: `../../outputs/demo-search-desktop-preview.png`. Search Console evidence: `../../outputs/sitemap-success-2026-10-03.png`.
