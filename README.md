# Catalyst Innovations — Official Website

Premium marketing site and interactive digital experience for **Catalyst Innovations**
(“Make more. Save time. Work smarter.”), founded by Daniel Vass and Josh Ogle.

## Technology stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS 4** (design tokens in `app/globals.css` under `@theme`)
- **Framer Motion** — scroll story, reveals, micro-interactions (with reduced-motion fallbacks)
- **Zod** — shared client/server form validation
- **lucide-react** — icons

## Local setup

```bash
npm install
cp .env.example .env.local   # then edit values
npm run dev                  # http://localhost:3000
```

> On this machine Node.js lives at
> `%LOCALAPPDATA%\nodejs-portable\node-v24.18.0-win-x64` (portable install, added
> to the user PATH). Open a **new** terminal so PATH changes apply.

## Build & quality checks

```bash
npm run lint    # ESLint (clean)
npm run build   # production build + TypeScript check (clean)
npm start       # serve the production build
```

## Environment variables (`.env.example`)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO metadata, sitemap, robots |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public email (UI shows “coming soon” until set) |
| `NEXT_PUBLIC_CONTACT_PHONE` | Public phone (optional) |
| `CONSULTATION_WEBHOOK_URL` | Form submissions POST here as JSON (CRM/Zapier/Make) |
| `RESEND_API_KEY` + `CONSULTATION_TO_EMAIL` | Form submissions emailed via Resend (`CONSULTATION_FROM_EMAIL` optional) |
| `NEXT_PUBLIC_SCHEDULING_URL` | Calendly-style link shown on the form confirmation screen |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Set to your domain → Plausible analytics activates |
| `NEXT_PUBLIC_GA_ID` | Set to `G-…` → GA4 activates (anonymized IPs) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` + `NEXT_PUBLIC_SANITY_DATASET` | Set both → Solutions/Industries/Portfolio pages fetch live content instead of `data/*.ts` (see `lib/cms.ts` for the expected schema) |
| `NEXT_PUBLIC_ERROR_WEBHOOK_URL` | Any JSON-accepting endpoint → production errors POST there instead of only logging to console |

With no delivery vars set, form submissions log to the server console (dev mode).
All site events flow through `window.ciTrack` and forward automatically to any
configured provider.

**Founder photos:** drop headshots at `public/founders/daniel-vass.jpg` and
`public/founders/josh-ogle.jpg` (jpg/png/webp) — the hexagon portraits pick
them up automatically; initials render until then.

**Social share images:** generated automatically at build time
(`/opengraph-image` + one per solution page) — no design tool needed.

## Project structure

```
app/            routes (home, solutions[+8 slugs], industries, portfolio, method,
                about, founders, insights[+article], contact, consultation, start,
                demo-lab, portal, privacy, terms, accessibility, api/consultation)
components/     Navbar, Footer, Logo, ui primitives, Reveal (motion), CTABand,
                ROICalculator, Assessment, ConsultationForm, DemoLab, IndustryExplorer,
                CommandPalette (Ctrl+K search), Spotlight (cursor-reactive card glow),
                DuotoneIcon, HexPortrait, ErrorMonitoring,
                home/ (PortalHero teleport intro, StoryTransform, DayStory,
                MethodJourney, EditorialBreak, Epilogue, HomeSections)
data/           editable content: services.ts, industries.ts, products.ts, content.ts
lib/            site.ts (config + analytics hook), consultation.ts (zod schema),
                cms.ts (optional Sanity layer), leadScoring.ts, useAnimatedNumber.ts
.github/        workflows/lighthouse.yml — informational Lighthouse CI on every push/PR
```

## Content editing guide

All copy lives in `data/*.ts` — services, industries, portfolio products (with
honest status labels), method stages, founder bios, insights, FAQs, differentiators.
Edit those files; no component changes needed.

**Optional live CMS**: `lib/cms.ts` fetches from Sanity when
`NEXT_PUBLIC_SANITY_PROJECT_ID`/`NEXT_PUBLIC_SANITY_DATASET` are set (currently
wired into the Solutions, Industries, and Portfolio pages), falling back to the
local data files instantly on any fetch failure or when unconfigured — a broken
CMS can never take the site down. The homepage preview sections and Demo Lab
still read the local files directly; extend the same pattern there if needed.

## Command palette

Press **Ctrl+K** (or click "Search" in the bottom-right corner) anywhere on the
site to fuzzy-search Solutions, Industries, Portfolio, and published Insights.
Client-side only, no backend — see `components/CommandPalette.tsx`.

## Lead scoring

Every consultation submission gets a transparent 0–11 point score (timeline +
company size + budget + inquiry type — see `lib/leadScoring.ts`) and a Hot /
Warm / Standard tier included in the webhook payload and the email subject
line, so a full inbox can be triaged at a glance.

## Error monitoring

Dependency-free (`components/ErrorMonitoring.tsx`): a React error boundary plus
global `window.onerror` / `unhandledrejection` listeners. Set
`NEXT_PUBLIC_ERROR_WEBHOOK_URL` to any JSON-accepting endpoint to receive
production errors; without it, they just go to server/browser console logs.

## Analytics

`lib/site.ts` exports `track(event, props)`. Wire any provider by defining
`window.ciTrack = (event, props) => …` in a script, or replace the function body.
Events already instrumented: consultation CTA clicks (by location), form start /
step / completion, ROI calculator use, assessment start/completion, demo
interactions, founder profile views.

## Forms & security

- Multi-step consultation form → `POST /api/consultation`, with autosave
  (localStorage) so an accidental tab close doesn't lose an in-progress lead
- Zod validation on client **and** server, honeypot field, rate limiting
  (Upstash Redis when `UPSTASH_REDIS_REST_URL`/`_TOKEN` are set, in-memory
  fallback otherwise — see `lib/rateLimit.ts`), no secrets in source
- Every submission gets a transparent Hot/Warm/Standard lead score (see
  `lib/leadScoring.ts`)
- Security headers + CSP configured in `next.config.ts`
- `GET /api/health` — point an uptime monitor (UptimeRobot, Better Uptime,
  etc.) here; a 200 means the process is up

## SEO — Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console),
   add a property for your live domain.
2. Choose **HTML tag** verification, copy just the `content="..."` value.
3. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to that value and redeploy —
   the meta tag appears automatically (`app/layout.tsx`).
4. Back in Search Console, click **Verify**.
5. Under **Sitemaps**, submit `sitemap.xml` (the site already generates one
   at `/sitemap.xml` — `app/sitemap.ts`).

## Dark mode

A user-toggleable theme (button in the navbar, persisted in `localStorage`,
defaults to system preference, no flash on load — see `ThemeToggle.tsx` and
the blocking init script in `layout.tsx`). Scope: page backgrounds and every
heading/body/eyebrow/button/hex element repaint correctly everywhere, since
they're all driven through the shared primitives in `components/ui.tsx` and
the `ice-*` CSS variable swap in `globals.css`. Individual white card
components sprinkled through specific page files were **not** individually
converted in this pass — extend with `dark:` variants on a page as needed.

## View transitions

Internal navigation uses the browser's native View Transitions API when
available (`components/ViewTransitionNav.tsx`) — a soft crossfade by
default, and true shared-element morphing for elements tagged with a
matching `viewTransitionName` on both pages (currently: a solution's icon,
from its card on the homepage/listing page to its detail-page hero — see
`lib/viewTransitionStyle.ts`). Pure enhancement layer: unsupported browsers
and any runtime error fall straight back to normal navigation.

## Logo & brand assets

`components/Logo.tsx` contains a **placeholder SVG recreation** of the hexagonal
“C” mark (extracted from booth photography). Replace the paths with the official
vector when available — the component API stays the same. Brand tokens (navy,
steel blue, silver, ice) live in `app/globals.css`.

## Known placeholders / assets still needed from the founders

- [ ] Official logo files (SVG + PNG) and favicon source
- [ ] Official brand color values, if different from extracted ones
- [ ] Daniel's and Josh's professional headshots (`/founders`, home founders section)
- [ ] Founder biographies approved for publication (current copy is draft-accurate)
- [x] Founder emails set (daniel@mycatalystinnovations.com, josh@mycatalystinnovations.com — `data/content.ts`, shown on `/founders` and `/contact`)
- [ ] Official business phone (set `NEXT_PUBLIC_CONTACT_PHONE`)
- [ ] Business address (if public) and social account URLs (footer)
- [ ] Domain name → set `NEXT_PUBLIC_SITE_URL`
- [ ] Legal review of Privacy / Terms / Accessibility placeholder pages
- [ ] Approved case studies & testimonials (placeholders are clearly labeled)
- [ ] CRM/email webhook → `CONSULTATION_WEBHOOK_URL`
- [ ] Analytics provider + `window.ciTrack` wiring
- [ ] Scheduling link (optional, for consultation confirmation page)
- [ ] Remaining insight articles: 9 drafts are listed but labeled “Draft — publishing soon”;
      only “Why Most Business Software Fails…” is fully written

## Deployment

Any Node host works. Vercel is simplest:

1. Push this folder to a Git repository.
2. Import into Vercel; set the environment variables above.
3. `npm run build` is the build command (default).

## QA summary (last verified)

- `npm run build`: ✅ 40 routes, zero TypeScript errors
- `npm run lint`: ✅ zero warnings/errors
- API: ✅ valid submission returns `{ok:true}`; malformed returns 400 with field issues
- Accessibility: skip link, focus states, labels/errors, reduced-motion fallbacks,
  keyboard-reachable menus/accordions, non-color status badges
- All demo data clearly labeled fictional; portfolio labeled by honest dev status
- Command palette, cursor-spotlight cards, ROI payback gauge, and both CRT
  click easter eggs verified interactively (browser automation), no console errors
- DigitalOcean App Platform: deploys as a Web Service (Node), auto-deploy on
  push to `main` enabled — see `.do/app.yaml`
