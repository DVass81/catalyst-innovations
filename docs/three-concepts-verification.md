# Three visual concepts — website preview

The approved storyboard artwork is integrated as native website motion: three selectable scenes, gentle camera movement, crossfades, live text captions and shared pause/replay controls. These are animated still compositions, not generated films or object-morphing footage. No Higgsfield job was submitted.

## Placement

- Living Blueprint: homepage opening, industry selector, industry directory and all 19 industry detail pages.
- Impossible Desk: solutions overview and all eight solution pages.
- Same Day, Two Ways: homepage benefits and below the calculator library on Savings Tools.
- Industry and solution pages retain their own workflow labels and inquiry context. Artwork is explicitly identified as an illustrative service business; it does not pretend to show different industry environments or client projects.
- Portfolio examples, calculator pages, forms, APIs, pricing and legal content remain unchanged.

## Verification

- 16 automated tests pass, including all existing calculator/inquiry tests and the shared motion controller cases. A new server-render test checks all three concepts provide readable initial content, semantic controls, local artwork and contextual workflow without JavaScript.
- Lint, TypeScript and production build pass (86 generated pages).
- Desktop 1440px and phone 390px layouts inspected; no horizontal overflow at 390px. Keyboard scene selection pauses playback. Industry switching to HOA resets to scene zero, remains paused and displays the HOA workflow. Final production browser console showed no errors.
- Lighthouse mobile performance: 93; LCP 3.180 seconds; CLS 0. The previous 2.5-second LCP target remains unmet. These local simulated results are not field measurements.
- A small contrast issue on chapter numbers was fixed; the follow-up accessibility audit scored 100 with no runtime error. The initial performance audit wrote a valid complete report, then encountered the known Windows temporary-directory cleanup error.
- Reduced-motion behavior is covered by controller tests and CSS disabling transitions. A full assistive-technology walkthrough was not performed.

Original approved images are preserved in public/stories. Next Image optimizes delivery; CSS frames each scene from the original boards. All headings, explanatory captions and controls remain website text. Only one illustration plays at a time, and offscreen/background-tab playback pauses.

Saved on the existing redesign branch for local review. No production publication or GitHub push.
