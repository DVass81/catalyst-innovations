# Catalyst Innovations redesign audit

September 7, 2026. **Provisional score: 88/100 (87.60 weighted). Original: 55/100. Target: 99/100.**

This is an expert-judgment design and implementation audit using the original categories and weights, not a certification or a Lighthouse score. It assesses the review build; production release and live delivery are not yet verified. The redesign is materially stronger, but 99 is not supported by the evidence.

| Category      | Weight | Original | Redesign |
| ------------- | -----: | -------: | -------: |
| Visual        |    15% |       70 |       92 |
| Functionality |    15% |       70 |       88 |
| Messaging     |    15% |       65 |       94 |
| Accessibility |    10% |       55 |       92 |
| Visibility    |    15% |       50 |       82 |
| Motion        |    10% |       50 |       94 |
| Trust         |    20% |       30 |       78 |

## What passed

20 browser journeys and 12 domain tests passed. Both Next.js public-production and separate Sites builds completed. Browser coverage includes all three demos, rejection/conflict/reset, short inquiry validation and retry, duplicate clicks, calculator arithmetic/PDF, assessment branches, search, canonical URLs, internal routes, scheduling fallback, keyboard behavior, both themes, reduced motion and responsive layouts. A controlled local delivery destination verifies acceptance and failure behavior; this does not prove receipt in the company's real inbox.

## What prevents 99 and public release

- Production inquiry delivery has no configured service. Public deployment is held until an authorized controlled test reaches the intended inbox/CRM.
- Mobile loading exceeds the LCP target in local laboratory measurements. Performance is reported separately in qa/lighthouse-lab.json, and cannot establish field INP.
- No customer case studies, testimonials or approved portraits have been supplied. Licensed stock photography and equal founder name-and-role treatments are intentional adaptations.
- Search Console, real analytics receipt, external identity verification, physical-device and real screen-reader evidence remain incomplete.
- Policies describe the code's current behavior, but provider-specific retention and legal review need completion.

## All 80 recommendations

Implemented: 48; Adapted: 25; Deferred: 7. Implemented means the site behavior was built and checked within the stated coverage; adapted means a scoped alternative or partial completion; deferred means evidence, configuration or content is still needed. Scores do not come from counting completed rows.

### 10 visual design improvements

| ID        | Original recommendation                                        | Outcome     | Evidence / remaining work                                                                                      |
| --------- | -------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------- |
| visual-01 | Put a real workflow in the hero                                | Implemented | The opening scene is a working purchasing interface; its approval state is shared with the manufacturing demo. |
| visual-02 | Show the people behind the offer                               | Adapted     | Daniel and Josh have equal name-and-role treatments. Approved portraits are still needed.                      |
| visual-03 | Use authentic operational photography                          | Adapted     | Three licensed operational photographs replace generic artwork. Original client photography needs permission.  |
| visual-04 | Reduce the uninterrupted dark sections                         | Implemented | Ink hero and closing invitation alternate with bright editorial reading sections.                              |
| visual-05 | Replace decorative floating cards with readable product detail | Implemented | Readable request, status and history replace decorative cards; mobile removes perspective.                     |
| visual-06 | Vary section composition deliberately                          | Implemented | Split hero, interactive demo, solution rows, process, pricing and founder sections vary the composition.       |
| visual-07 | Cut excess space in text-only sections                         | Implemented | Founder and differentiation copy is consolidated into compact sections.                                        |
| visual-08 | Strengthen typography hierarchy                                | Implemented | Locally hosted Space Grotesk and Inter establish a consistent hierarchy; body copy is 18px.                    |
| visual-09 | Simplify the permanent overlays                                | Implemented | Search moved into the header. The consultation action remains prominent.                                       |
| visual-10 | Art-direct the footer                                          | Implemented | Footer links are grouped around services, useful tools, company identity and contact.                          |

### 10 functional improvements

| ID            | Original recommendation                             | Outcome     | Evidence / remaining work                                                                                                                     |
| ------------- | --------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| functional-01 | Offer a short default inquiry                       | Adapted     | Approved four-field form requires name, email, company and challenge. Detailed qualification is optional.                                     |
| functional-02 | Make booking a first-class choice                   | Implemented | Consultation offers inquiry and direct scheduling, with a 30-minute initial conversation.                                                     |
| functional-03 | Provide a calendar fallback                         | Implemented | Calendar loads on request and retains a direct link when the embedded provider is blocked.                                                    |
| functional-04 | Make referral context survive the journey           | Implemented | Industry, demo and offering context is preserved in consultation links and editable form context.                                             |
| functional-05 | Promote the Demo Lab in navigation                  | Implemented | Demo Lab is a primary navigation item and a homepage action.                                                                                  |
| functional-06 | Make each demo a complete small task                | Implemented | Three complete tasks include success, rejection or conflict, live status, history and reset. Original procurement examples remain accessible. |
| functional-07 | Add precise numeric inputs beside ROI sliders       | Implemented | The calculator has exact numeric inputs for capacity assumptions, project cost, support, third-party costs and timing.                        |
| functional-08 | Carry the ROI scenario into consultation            | Adapted     | A tested printable PDF contains all assumptions and results. Automatic insertion of the ROI scenario into the inquiry is deferred.            |
| functional-09 | Remove the unfinished portal from the sales journey | Implemented | The retained noindex portal route now sends existing clients to working team contact information.                                             |
| functional-10 | Verify lead handling end to end                     | Deferred    | Local controlled delivery, rejection, retries and spam tests pass. The real inbox/CRM is not configured; production release is held.          |

### 10 visibility and search improvements

| ID            | Original recommendation                    | Outcome     | Evidence / remaining work                                                                                                                                         |
| ------------- | ------------------------------------------ | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| visibility-01 | Verify indexing in Search Console          | Deferred    | Search Console account verification and indexing inspection remain outstanding.                                                                                   |
| visibility-02 | Add consistent canonical URL signals       | Implemented | Public routes have consistent canonicals and sitemap entries; /start permanently redirects. Preview and portal are noindex.                                       |
| visibility-03 | Choose three high-intent topic clusters    | Adapted     | Manufacturing, field service and professional services form the approved demo-led industry structure; search-demand research remains outstanding.                 |
| visibility-04 | Make service pages answer buying questions | Adapted     | Existing solution pages are retained with honest language and explicit investment/scoping pages. Deeper per-service integration guides remain future content.     |
| visibility-05 | Create selective industry landing pages    | Deferred    | Existing industry URLs and anchors are preserved. Standalone industry landing pages require distinct verified content.                                            |
| visibility-06 | Clarify local identity everywhere          | Adapted     | Business identity and founder contact details are consistent in the site. External chamber and local listings have not been reconciled.                           |
| visibility-07 | Publish evidence-led educational content   | Adapted     | Interactive fictional walkthroughs demonstrate buying problems; no client-outcome educational articles are claimed.                                               |
| visibility-08 | Deepen internal links                      | Implemented | Industry demos connect to relevant solution and consultation paths; navigation and footer preserve useful tools.                                                  |
| visibility-09 | Improve structured and sharing metadata    | Adapted     | Canonical metadata, Organization/founder data and existing social images are retained or corrected. Further verified profile and breadcrumb coverage is deferred. |
| visibility-10 | Build discoverability beyond the website   | Deferred    | External profiles, partnerships and discoverability work need verified accounts and publishable evidence.                                                         |

### 10 motion and interaction-design improvements

| ID        | Original recommendation                                | Outcome     | Evidence / remaining work                                                                                                           |
| --------- | ------------------------------------------------------ | ----------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| motion-01 | Turn the legacy-computer concept into a workflow story | Implemented | A five-second request-to-approval workflow replaces the legacy-computer story.                                                      |
| motion-02 | Shorten the time to understanding                      | Adapted     | The timed sequence is shorter and the headline/action remain available immediately. Prospect comprehension testing is still needed. |
| motion-03 | Let the visitor control the sequence                   | Adapted     | Pause and replay are available; playback stops offscreen and in hidden tabs. Individual frame scrubbing was omitted.                |
| motion-04 | Replace the futuristic skyline payoff                  | Implemented | The payoff is a usable operational interface with approval status and history.                                                      |
| motion-05 | Use microinteractions for feedback                     | Implemented | Tabs, request decisions and checklist completion use coordinated state feedback.                                                    |
| motion-06 | Make the static experience complete                    | Implemented | Reduced motion shows the completed scene. Important copy and actions are server rendered.                                           |
| motion-07 | Design a lighter mobile sequence                       | Adapted     | Mobile removes perspective and simplifies the composition. Emulated phone/tablet checks pass; physical-device validation remains.   |
| motion-08 | Keep sound optional and unnecessary                    | Adapted     | The new experience is silent and has no audio dependency.                                                                           |
| motion-09 | Use one restrained motion language                     | Implemented | A consistent, restrained transition language replaces simultaneous decorative loops.                                                |
| motion-10 | Select animation technology after a prototype          | Implemented | The signature scene uses the existing motion library and interface elements, without an added 3D/video runtime.                     |

### 10 messaging and conversion improvements

| ID           | Original recommendation                      | Outcome     | Evidence / remaining work                                                                                                                                 |
| ------------ | -------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| messaging-01 | Name the primary buyer in the first screen   | Adapted     | The approved multi-industry positioning is immediately supported by three specific workflow demonstrations.                                               |
| messaging-02 | Replace abstract benefits with specific work | Implemented | Purchasing approvals, technician assignment and onboarding handoffs replace abstract-only benefit claims.                                                 |
| messaging-03 | Clarify what the business sells today        | Implemented | Project services and optional support are distinguished from fictional demonstrations and concept work.                                                   |
| messaging-04 | Package the first engagement                 | Implemented | A $1,500 single-workflow Blueprint states deliverables and the 60-day implementation credit.                                                              |
| messaging-05 | Organize around a few buyer problems         | Implemented | Solutions are organized around purchasing, disconnected operations and repeated administrative work.                                                      |
| messaging-06 | Make every CTA describe its outcome          | Implemented | Actions state their outcome: try a demo, review investment or discuss a workflow.                                                                         |
| messaging-07 | Remove self-referential marketing copy       | Implemented | Unsupported averages and self-referential differentiation language were removed.                                                                          |
| messaging-08 | Explain the method through deliverables      | Implemented | The process explains scoped planning, working demonstrations, testing, training and handover.                                                             |
| messaging-09 | Explain the full commercial commitment       | Implemented | All approved prices, support limits, payment milestones, exclusions and cancellation terms are published.                                                 |
| messaging-10 | Answer the hard objections                   | Adapted     | FAQs and scope terms address fit, existing tools, ownership and maintenance. Detailed project-specific migration/security commitments remain contractual. |

### 10 trust and proof improvements

| ID       | Original recommendation                        | Outcome     | Evidence / remaining work                                                                                                                                        |
| -------- | ---------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| trust-01 | Substantiate or revise the time-saving average | Implemented | Unsupported client time-saving averages were removed; demo results are explicitly fictional.                                                                     |
| trust-02 | Replace live draft policies                    | Adapted     | Privacy and terms now describe implemented behavior and scope. Provider-specific retention and professional legal review remain outstanding.                     |
| trust-03 | Resolve the Josh/Daniel booking mismatch       | Implemented | Founder responsibilities and calendar-host wording are aligned; both founders receive equal prominence.                                                          |
| trust-04 | Publish one defensible case study              | Deferred    | No defensible customer case study is published without source evidence and permission.                                                                           |
| trust-05 | Attach verifiable people to testimonials       | Deferred    | No fabricated testimonials or customer logos. Approved references are still needed.                                                                              |
| trust-06 | Make founder experience inspectable            | Adapted     | Named biographies and responsibilities use existing business information. Independent professional credential/profile verification remains outstanding.          |
| trust-07 | Clarify the founding offer                     | Implemented | Unmaintainable scarcity and founding-offer pricing were replaced with approved transparent terms.                                                                |
| trust-08 | Separate delivered work from the roadmap       | Implemented | Demonstrations and concept work are labeled separately from delivered client outcomes.                                                                           |
| trust-09 | Explain security and support with evidence     | Adapted     | Care hours, exclusions, business-hours coverage and project responsibilities are explicit. No unverified certification or blanket security guarantee is claimed. |
| trust-10 | Remove unfinished identity signals             | Implemented | Placeholder social-profile notices were removed. Contact and founder identity are consistent.                                                                    |

### 10 accessibility and mobile-usability improvements

| ID               | Original recommendation                        | Outcome     | Evidence / remaining work                                                                                                                          |
| ---------------- | ---------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| accessibility-01 | Fix primary-button contrast                    | Implemented | Primary actions use accessible contrast. Automated checks cover both themes and core/remaining public routes.                                      |
| accessibility-02 | Use one primary page heading                   | Implemented | Each page has one primary heading; the animated scene does not create another H1.                                                                  |
| accessibility-03 | Test every keyboard journey                    | Implemented | Browser tests cover keyboard tabs, search, Escape/focus return, demos, calculator and inquiry form.                                                |
| accessibility-04 | Move focus to useful validation feedback       | Implemented | Invalid submission focuses the first invalid field and presents associated errors.                                                                 |
| accessibility-05 | Verify the reduced-motion implementation       | Implemented | Reduced-motion behavior is tested; the scene is complete and usable.                                                                               |
| accessibility-06 | Provide motion controls where needed           | Implemented | Pause/replay controls and offscreen/tab suspension are tested.                                                                                     |
| accessibility-07 | Validate real phone and tablet layouts         | Adapted     | Reflow checked at 320, 390, 768, 1280 and 1920px. Physical phone/tablet checks remain.                                                             |
| accessibility-08 | Make touch interaction forgiving               | Adapted     | Main controls target 44px with spacing. Third-party calendar controls remain provider-owned; real touch checks are outstanding.                    |
| accessibility-09 | Expose demo and calculator changes accessibly  | Implemented | Demo state and calculator results have semantic text and restrained live announcements.                                                            |
| accessibility-10 | Test zoom, contrast and reading order together | Adapted     | Automated contrast, keyboard order, narrow reflow and 200% text tests pass. Real screen-reader and full 400% zoom verification remain outstanding. |

### 10 performance, reliability and measurement improvements

| ID             | Original recommendation                            | Outcome     | Evidence / remaining work                                                                                                                                                                                |
| -------------- | -------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| performance-01 | Establish mobile and desktop performance baselines | Implemented | Local production Lighthouse samples cover home, demo, pricing and consultation on simulated mobile and desktop. These are not field measurements.                                                        |
| performance-02 | Adopt explicit Core Web Vitals targets             | Adapted     | Targets are documented: LCP <=2.5s, INP <=200ms and CLS <=0.1. Mobile LCP currently exceeds its target; field INP is unavailable.                                                                        |
| performance-03 | Profile JavaScript by page and feature             | Adapted     | Heavy decorative homepage modules were removed and builds checked. Further bundle profiling is needed to reduce mobile loading time.                                                                     |
| performance-04 | Load expensive work only when useful               | Implemented | Booking loads on demand and lower-page photos defer loading with stable dimensions.                                                                                                                      |
| performance-05 | Stop offscreen animation work                      | Implemented | Signature animation work stops offscreen and when the tab is hidden.                                                                                                                                     |
| performance-06 | Optimize the real assets you add                   | Implemented | Licensed images are local, responsive and dimensioned; no new video or 3D payload.                                                                                                                       |
| performance-07 | Review font loading and fallbacks                  | Implemented | Two font families are hosted locally with licenses and display fallbacks.                                                                                                                                |
| performance-08 | Verify analytics is actually configured            | Deferred    | Privacy-safe instrumentation is present, but no analytics destination is configured or receiving verified events.                                                                                        |
| performance-09 | Measure the lead funnel and lead quality           | Adapted     | Demo selection/completion, pricing interest, inquiry success and scheduling clicks are instrumented without personal details. Lead-quality reconciliation and confirmed bookings need connected systems. |
| performance-10 | Add a small operational monitoring routine         | Adapted     | CI runs builds, tests and production dependency audit. A health endpoint and release/rollback checklist exist; external alert delivery and monitoring ownership need configuration.                      |

## Evidence locations

Design compositions and five-frame storyboard: docs/design-review/. Automated journeys: tests/browser/. Arithmetic and validation: tests/domain.test.mjs. Controlled delivery: scripts/test-delivery.mjs. Deployment baseline and rollback: docs/release-baseline.md. Release gate: docs/release-checklist.md. Laboratory observations: docs/qa/lighthouse-lab.json. Original source: Catalyst-Innovations-Website-Audit.html and catalyst-audit-artifact.json in the parent workspace.
