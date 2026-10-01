# Experience improvements — 2026-10-01

Implemented on redesign/clearer-catalyst; production has not been published.

## Visual recommendations

1. Actual flooring software leads the homepage.
2. Mobile stories use vertical, readable native panels instead of shrunken panoramas.
3. Larger demo stages and an enlarged viewer.
4. Founder photo support uses existing asset lookup; no supplied portraits exist, so text profiles remain. Real photos are still required.
5. Split homepage composition with one headline and one real screen.
6. Blue highlights selected tasks, handoffs and controls; navy anchors primary actions.
7. Alternating detailed demos, editorial founder profiles and expandable solution paths vary the page rhythm.
8. Consistent screenshot frames and restrained shadows.
9. One active step and caption at a time, with focused mobile handoff panels.
10. Navy closing invitation introduces a conversation with Josh and Daniel.

## Functional recommendations

1. Five-choice problem finder on home and Solutions.
2. All industry pages and the selector recommend a verified demo, with an explanation of cross-industry relevance.
3. Each tour explains a starting problem and three verified workflow steps.
4. Native modal viewer supports Previous/Next, arrow keys, Escape, focus restoration and native focus containment.
5. Microsoft booking remains independently available when a verified public URL is configured. No URL supplied; action remains hidden.
6. Successful inquiries show a local receipt and explain what happens next.
7. Selected challenges recommend up to three relevant calculators; default is manual-work savings.
8. Industry/problem context survives the demo-to-inquiry journey. Existing calculator consent and industry context remain intact.
9. Mobile first-load performance improved versus the preceding 3.0–3.1s baseline. Two audits: LCP 2.662s and 2.707s; CLS 0; performance 97 and 96. Target 2.5s remains unmet.
10. Anonymous section views, industry selections, finder choices, demo interactions, form starts/errors/completions use the existing analytics provider hook. No questionnaire answers or calculator figures are event properties. A configured analytics provider is needed to collect reports.

## UI recommendations

1. Navigation now says Solutions and Demos.
2. Each finder result prioritizes a contextual inquiry, with subordinate demo/calculator links.
3. Solutions uses three expandable paths rather than two repeated card collections.
4. Industry selection updates the named panel, paired problems/help, demo and calculators.
5. Plain task language precedes CRM/ERP/WMS explanations.
6. Visible Play story, Pause story and Replay story controls match accessible names.
7. Public sample / guided preview / planned prototype labels remain explicit.
8. Four required questionnaire fields appear first; optional details live in a disclosure.
9. Finder and industry inquiry actions name the selected work.
10. Mobile navigation uses comfortable targets and a distinct inquiry action.

## Founders

Home introduces both perspectives before the process and FAQ. About and the existing founders URL now share the cream/navy design and full existing factual biographies, including Josh’s military/IT background and Daniel’s operations background. Existing Person and Organization structured data are preserved. How they met and why they formed Catalyst has not been supplied; no origin story was invented.

## Verification

- 22 tests passed: independent calculator examples and edge cases, industry recommendations, optional and legacy inquiry fields, mocked delivery success/failure/missing-production configuration, nine-second playback, reduced motion, visibility handling, single-owner playback and demo availability.
- Lint, TypeScript and production build passed (86 generated pages).
- Browser checks: problem selection, contextual demo link, enlarged viewer next/arrow/Escape/focus restoration, industry switching, optional form defaults, mobile menu and scene selection.
- No horizontal overflow in inspected 390px phone, 820px tablet and 1440px desktop layouts.
- Homepage mobile accessibility score 100. Audit reports are in work/experience-*.json.
- Lighthouse produced complete reports without runtimeError; Windows temporary-profile cleanup returned EPERM after reporting.
- No test inquiries or appointments were sent, and no live demos were changed.

Pending user material: official founder portraits, the shared founding story, and Daniel’s reviewed public Microsoft Bookings URL.
