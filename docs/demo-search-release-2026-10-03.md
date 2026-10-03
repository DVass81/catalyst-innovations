# Searchable software demonstrations — October 3, 2026

> Production update: the demo release and shared-CSS follow-up are now live. See the final deployment record below. The original preparation and measurements are retained as dated evidence; the latest performance results are in `shared-css-performance-2026-10-03.md`.

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

Originally prepared on `redesign/clearer-catalyst` for review, then published under Daniel's explicit instruction to push and deploy. The final rollout and search follow-up are recorded below. Google Business Profile verification was not changed or advanced during this work.

Preview screenshot: `../../outputs/demo-search-desktop-preview.png`. Search Console evidence: `../../outputs/sitemap-success-2026-10-03.png`.

## Final deployment and search follow-up

- Demo release `af897160297fdfc8ea864d00552b3bfb789dba86` reached DigitalOcean Success / Live Deployment at 7:38:47 p.m. Eastern on October 3. Deployment ID: `c3487894-a980-4eab-bccf-22145f62589d`.
- Shared-CSS follow-up `71ce6798273e25ab1fef4b4d3f60cceee0e7822c` reached Success / Live Deployment at 7:48:16 p.m. Eastern. Deployment ID: `496d2fbf-c560-4025-8172-7181fc186a16`. Both production `main` and the redesign branch received the tested code.
- Final read-only production crawl passed **76/76 pages**, all nine demo media assets, metadata/canonicals/social images, redirects, missing-page responses, robots and portal handling. No forms, appointments or analytics events were sent by the crawler. Evidence: `../../work/seo-live-crawl-71ce679.json` and `.md`.
- The live flooring page was inspected in the browser; its content, complete framed player and inquiry action render correctly. No browser errors or warnings were reported. Live screenshot: `../../outputs/catalyst-demo-live-2026-10-03.png`.
- Google accepted one sitemap resubmission. The live sitemap has **76 page entries and three video entries**. Its existing report still showed Success / 71 discovered pages / zero videos from the earlier read; processing the new entries remains pending.
- Each of `/portfolio/flooring`, `/portfolio/hoa` and `/portfolio/painting` was inspected as unknown to Google. One indexing request per URL completed successfully after Google's live eligibility test; all three were added to its priority crawl queue. This is not confirmation of indexing or ranking. Confirmation screenshot: `../../outputs/google-indexing-requested-2026-10-03.png`.
- Search Console Performance still says it is processing data. Representative impressions, clicks, queries and positions remain pending rather than zero. No recurring monitoring was enabled.
- Latest local lab medians are **2.823 seconds homepage LCP** and **3.383 seconds flooring LCP**, both above the 2.5-second target; CLS remains below 0.1. Homepage CSS transfer is 10.5% lower. The host slowed during testing, so no LCP improvement is claimed. See the shared-CSS report for all six results and limitations.

## External dependencies and prepared promotion

Resend remains pending. Public DNS checks found all three required sending records absent. The accessible Cloudflare account only contains `cbssolutions.app`, not the Catalyst domain, so no DNS was changed. The Microsoft MX and root SPF remain intact. The exact handoff is `../../outputs/catalyst-resend-dns-handoff.html`; server secret configuration and a controlled delivery check follow successful DNS verification.

The updated `../../outputs/seo-growth-package.html` contains three finished demo posts, two tailored introduction drafts, ten researched Tennessee organizations and a 30-day checklist. Proposed recipients are Knoxville Entrepreneur Center (`info@knoxec.net`) and Tennessee MEP East Tennessee's Harold Booker (`harold.booker@tennessee.edu`), from Daniel's Outlook account. Specific sending approval has been requested. Nothing has been posted or emailed.

A public Catalyst Innovations LLC LinkedIn post is a candidate, but company-domain matching and administrator access remain unverified. LinkedIn presented a security check/sign-in; Daniel has been asked to complete it. No duplicate profile was created, no CAPTCHA was solved, and the user's Google Business Profile verification tab was left untouched.
