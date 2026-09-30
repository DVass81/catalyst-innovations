# Catalyst in Motion — preview verification

Date: September 30, 2026. Branch: `redesign/clearer-catalyst`.

## Delivered

- Homepage compact preview and 15-second interactive story, with the same JOB 104 carried through customer approval, scheduling/materials, completion and invoice review.
- Shared demonstrations on eight solution pages, the solutions overview, all 19 industry pages and the industry selector. Industry changes reset the story; existing workflow labels, recommendations and inquiry links remain intact.
- Three user-triggered portfolio concepts. Anonymous project descriptions and the painting system's Planned status remain intact.
- One playback owner, play/pause/replay, selectable steps, visibility pauses and static reduced-motion behavior. Initial HTML contains the example and explanation before JavaScript runs. Motion features load separately from the initial component bundle.
- Conditional film player remains hidden while the film is unreviewed. No video or media requests are made by that hidden component.

## Checks

- 15 automated tests pass. These cover all 24 existing calculator formulas and inquiry validation/delivery cases, story timing, once-only autoplay, visibility pauses, manual selection, reduced motion, exclusive playback, industry/solution definitions, server rendering and the film publication/load gate.
- Existing delivery tests use mocked providers; no test inquiries were sent.
- Lint passes. Production build and its TypeScript check pass; 86 pages generated.
- Browser checks at 320px and 390px phone widths, 768px tablet width and 1440px desktop width. No horizontal document overflow at the checked widths. Keyboard Space activates a selected step and pauses playback. Quote approval and procurement approval were inspected. Industry switching resets to step zero. Portfolio demos initially remain stopped. Final production browser console showed no errors.
- Final desktop and phone screenshots were visually inspected. Native reduced-motion controller behavior is covered by tests; an OS-level preference toggle and a full screen-reader walkthrough were not performed.

## Performance exception

Two repeat Lighthouse 13 mobile audits of the final production preview on `127.0.0.1:3100` reported:

| Run | Performance | Accessibility | LCP | CLS |
| --- | --- | --- | --- | --- |
| 1 | 94 | 100 | 3.056 seconds | 0 |
| 2 | 94 | 100 | 3.038 seconds | 0 |

The 2.5-second mobile LCP target is **not met**. The CLS target is met. These are local simulated mobile results, not production field measurements. The LCP element is the homepage heading. Animation feature splitting has been applied, but further initial rendering optimization remains before claiming the performance target is achieved. Automated accessibility scores do not replace manual assistive-technology testing.

One audit emitted a Windows temporary-folder cleanup permission error after writing its report. Both final JSON reports have no runtime error and complete audit results. Raw audit reports remain in the workspace's `work` folder.

## Film and publication

The complete seven-shot Glass UI Launch adaptation is in `signature-film-prompt.md`, with the original interface reference in `motion-story-reference.png` and generation settings/hashes in `signature-film-record.json`.

Generation was not submitted: the approved estimate is 67.5 credits and the observed balance is 9.49. No credits were purchased or spent, no unrelated preset was substituted and no automatic retries were scheduled. Film playback/failure handling has not been exercised against a generated film because no reviewed film exists.

Changes are local on the redesign branch. The production website and GitHub main branch have not been published or changed by this motion update.
