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
                home/ (Hero, StoryTransform scroll story, HomeSections)
data/           editable content: services.ts, industries.ts, products.ts, content.ts
lib/            site.ts (config + analytics hook), consultation.ts (zod schema)
```

## Content editing guide

All copy lives in `data/*.ts` — services, industries, portfolio products (with
honest status labels), method stages, founder bios, insights, FAQs, differentiators.
Edit those files; no component changes needed. The structure is deliberately
CMS-ready: each file maps 1:1 to a future headless-CMS collection.

## Analytics

`lib/site.ts` exports `track(event, props)`. Wire any provider by defining
`window.ciTrack = (event, props) => …` in a script, or replace the function body.
Events already instrumented: consultation CTA clicks (by location), form start /
step / completion, ROI calculator use, assessment start/completion, demo
interactions, founder profile views.

## Forms & security

- Multi-step consultation form → `POST /api/consultation`
- Zod validation on client **and** server, honeypot field, in-memory rate limiting
  (swap for Redis in production), no secrets in source
- Security headers + CSP configured in `next.config.ts`

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
- [ ] Official business email / phone (set env vars)
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

- `npm run build`: ✅ 31 routes, zero TypeScript errors
- `npm run lint`: ✅ zero warnings/errors
- API: ✅ valid submission returns `{ok:true}`; malformed returns 400 with field issues
- Accessibility: skip link, focus states, labels/errors, reduced-motion fallbacks,
  keyboard-reachable menus/accordions, non-color status badges
- All demo data clearly labeled fictional; portfolio labeled by honest dev status
