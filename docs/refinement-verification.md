# Faster stories, clearer industries, real demos

Verified 2026-09-30 on `redesign/clearer-catalyst`. Preview: http://127.0.0.1:3100. No push, production deployment, archived-app restoration or hosting purchase.

## Delivered

- Three visual stories now run for nine seconds, in three-second scenes with 350 ms fades. Nine separately framed WebP scenes preserve the complete original illustration panels. No mobile zoom or camera crop. Pause, replay, scene selection and single-player coordination remain available.
- Nineteen existing industry routes lead with distinct paired problems and proposed help. The homepage selector uses the same content. Repeated industry illustrations were removed. Sources and synthesis limitations are in `industry-research.md`.
- `/portfolio` is now See What We Build, with three actual-screen guided previews. Only the verified public HOA sample links out. Flooring has no owner-entry link. Painting is clearly a planned system with a recovered prototype. See `demo-verification.md` for provenance and capture boundaries.
- Daniel and Josh appear together on the homepage, About, founders page and founder metadata.
- The single-page questionnaire adds optional struggle categories, current tools, desired improvement and demo context. Existing calculator attachment consent and delivery behavior remain intact. Microsoft booking is configured to remain hidden until a public URL has been supplied and marked verified.

## Checks

- 20 automated tests pass: all 24 calculators, invalid/zero/extreme cases, legacy and new questionnaire schemas, forwarded context, mocked successful and failed providers, missing production delivery configuration, motion timing/visibility/reduced-motion behavior, static content, demo asset/link rules and booking visibility. No real test inquiries were sent.
- Lint, TypeScript checking and production build pass. 86 generated routes. Git whitespace check passes.
- HTTP checks: all 19 directory destinations return 200, each has three problem/help pairs and the correct inquiry context; all 57 recommended calculator links return 200. Existing ROI redirect returns 308.
- Browser checks at 390×844, 820×1180 and 1440×1000: no horizontal overflow in inspected homepage, questionnaire, About and showcase views. Complete illustrations use contain framing. Homepage industry selection updates the relevant text and calculators. Electrical navigation opens its specific content. Demo and scene controls work by keyboard; selection pauses autoplay. Replay was observed to finish on scene three after nine seconds. Inquiry keeps the selected industry and demo context; its four required fields and six optional categories are present. Booking is absent while unconfigured. No showcase console errors observed.
- Reduced-motion and hidden-document behavior are covered by controller tests and CSS. No physical screen-reader session or manual OS motion-preference toggle was performed.
- Lighthouse 13.0.1 automated accessibility: homepage, portfolio, questionnaire and construction industry page each 100. This is an automated result, not a guarantee of full accessibility compliance.

## Performance and remaining dependency

Two comparable mobile Lighthouse 13 runs (simulated mobile, 4× CPU slowdown, 150 ms RTT, 1.6 Mbps) measured:

| Run | Performance | LCP | CLS |
|---|---:|---:|---:|
| Repeat 1 | 95 | 3.009 s | 0 |
| Repeat 2 | 94 | 3.079 s | 0 |

The 2.5-second LCP target remains unmet by approximately 0.5–0.6 seconds. CLS meets the under-0.1 target. The text headline is the LCP element; remaining delay is primarily render delay. Scenes are now smaller individually framed WebP assets. No film is loaded on the critical path. These are local lab measurements, not production field data.

Lighthouse wrote valid reports with no runtime errors, then its Chrome cleanup reported a Windows temporary-directory permission error. Scores were taken from the completed reports, not from the command exit status.

Daniel's public Microsoft Bookings with me URL is still required. It has not been guessed or replaced with an unrelated calendar. Production publication remains a separate review step.
