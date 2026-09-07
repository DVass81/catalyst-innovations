# Catalyst: one continuous business story

The homepage follows one request from scattered work into a connected system, then introduces the people, delivery process, investment and next conversation.

## The five selected concepts

1. Chaos to clarity: matching SVG contours physically reshape into the opening workspace. Its approval action shares real demonstration state with Demo Lab.
2. Industry transformation: the same illustrated geometry becomes a factory, service van and professional-services workspace as visitors choose an industry.
3. Approval cascade: a decision gate reshapes into approval or return, with corresponding purchasing, scheduling and onboarding results. Scheduling conflicts remain visible.
4. Founder fusion: Daniel's operations view and Josh's engineering view converge into one working interface. Both founders receive equal space.
5. The blue thread: chapter navigation and a continuous visual line connect the opening, demonstrations, process, team, investment and final invitation.

The compositions and five-frame storyboard are in `design-review/motion-direction.html`. Motion uses the existing Framer Motion dependency and native SVG paths; no new runtime library was added.

## Interaction and accessibility

The five-second opening plays once per session. Opening and founder scenes have pause/replay controls and stop while offscreen or the document is hidden. Global motion preference persists across reloads. Reduced-motion mode renders completed scenes while retaining every demonstration action. Replaying the opening preserves an approved request.

Industry changes interrupt and resolve to the most recent selection. Approval and return sequences reflect actual demonstration state. All data remains fictional; no simulated decision sends an inquiry or creates a booking.

## Validation before publication

- Production Next.js build and separate Sites/vinext build passed.
- ESLint passed; 12 domain tests passed.
- All 24 browser tests passed against the production build, including four new motion tests covering actual path changes, pause/offscreen behavior, rapid industry switching, decision reversals, founder convergence, reduced motion and replay state preservation.
- Existing checks cover keyboard operation, calculator arithmetic, form failure/retry, scheduling fallback, retained routes, mobile/reflow and automated WCAG checks in both themes.
- Desktop and mobile compositions were visually inspected. Automated accessibility checks do not establish complete WCAG conformance or real-user performance.

## Deployment boundaries

Publish to the existing private Sites project and the DigitalOcean comparison app `c56051c5-8ccb-4bb9-a9a1-e3288e1ba3d9` via `comparison/catalyst-redesign` only. The restored original domain remains on `main` and is not a target of this change.

Comparison rollback baseline: commit `6e4073d7c6fbbf2fb912d38492bf11fc41b8e7ba`, healthy deployment `d46fed8e-ebc2-40d8-b7da-b92721df5ff9`. Inquiry delivery remains unconfigured on the comparison app; email/calendar alternatives remain available and the form never reports delivery without provider acceptance.
