# Workarounds film: preview review

Status: Daniel approved the finished preview and explicitly requested push and deployment on 2026-10-02. Release verification follows deployment.

## Actual media

- Single Seedance 2.5 generation, job `14dc3920-d229-4d7b-a1f8-b8bb85a465ae`; estimated cost before submission 240 credits. No paid retries or purchases.
- Original: 1920 × 1080, 24 fps, 20.0417 seconds, HEVC Main 10, no audio stream.
- Website delivery: 1920 × 1080, 24 fps, exactly 20 seconds / 480 frames, H.264 yuv420p, silent, fast-start MP4. 6,576,422 bytes. Opening WebP poster: 62,284 bytes.
- Official transparent logo composited into the actual screen, using per-frame corner measurements from 17–17.625 seconds. Fade-in 17–17.35 seconds; original aspect and colors retained. Final composition held still from 17.625 to 20 seconds. Screen measurements saved in `workarounds-screen-tracking.json`.
- Local finishing used deterministic Pillow/numpy perspective compositing and FFmpeg encoding; no generated recreation of the final logo. `workarounds-finishing.py` archives the local recipe (original working location: workspace `work/finish-workarounds.py`).

## Visual findings

| Requirement | Observation | Result |
|---|---|---|
| Old computer, ordered separation and inside journey | 0–5s recognizable beige CRT/base/keyboard; layered structure opens, camera approaches process trays | Present |
| Customer details entered once | 5–8s record cards, compartments and blue record token; specific duplicate-merge semantics less explicit than prompt | Caption carries some meaning; review caveat |
| Approval, schedule and materials | 8–11s checkmark, connected forms, grid and materials blocks | Present as illustrative symbols; not literal application functionality |
| Completion and invoice preparation | 11–14s checked form connects with document stack | Present as metaphor; caption identifies invoice meaning |
| Fast reassembly into future workstation | 14–17s layers align into navy workstation, camera settles frontally | Present |
| Exact logo and final still | 17–20s original official artwork composited on screen; final frame locked | Present and checked in exported frame |
| No generated text | Small pseudo-lettering exists on forms, especially 12.5s; no readable customer data or substantiated metric | Departure from requested clean non-text forms; visible at full size, texture at homepage size |
| No audio | Stream inspection and decode show video only | Pass |

An independent visual review agreed the overall transformation is recognizable, while the detailed business meanings rely on website captions. No claim that generation matched every prompt detail. Still sheets and sampled in-browser playback were inspected; these do not constitute an exhaustive frame-by-frame temporal quality review. These caveats were disclosed with the finished preview before Daniel authorized publication.

## Website checks

- Existing headline, copy, actions and other homepage sections retained. Only hero, scoped styles, playback definitions and tests changed.
- 32 tests passed, including calculator and inquiry regression tests and new media controller cases. Full lint, TypeScript checks and production build passed.
- Browser: 390 × 844 phone, 768 × 1024 tablet and default desktop checked. Full 16:9 image, readable captions, no phone horizontal overflow. Keyboard Enter activates pause and replay; end stops at 20 seconds; offscreen scroll pauses; replay restarts captions.
- Local reduced-motion harness: no video `src`, loaded poster, static summary and readable full story. Local deliberate video-failure harness: poster/story remain and unusable controls disappear. These are test-only proxy pages, not production code.
- Unit tests cover hidden-tab/combined visibility, user pause persistence, playback ownership, stale promises, errors, end state and replay.
- Two local, unthrottled 390px preview measurements: LCP 112ms / 164ms; CLS 0 / 0. Video resource begins at 412.5ms / 363.2ms, after page load at 110.5ms / 80.8ms. These are warm local laboratory checks, not production/mobile-network performance certification.
- Production mobile LCP <2.5s and CLS <0.1 remain to be verified after release. Previous live still version measured LCP 2.6s, CLS 0; do not apply those results to this unreleased version.

Working preview: http://127.0.0.1:3106/
