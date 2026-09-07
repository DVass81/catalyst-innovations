# Catalyst Innovations

“See your business working better.” Custom software, automation and connected operations, with three interactive industry demonstrations.

## Run and verify

Use Node.js 24 and npm. Run `npm ci`, copy `.env.example` to `.env.local`, then `npm run dev`.

- Public DigitalOcean build: `npm run build`, then `npm start`.
- Separate private Sites build: `npm run build:sites`.
- Checks: `npm run lint`, `npm test`, and `npm run test:browser` against a running server.
- Controlled delivery check: `node scripts/test-delivery.mjs` with production running on port 3100.

See [release checklist](docs/release-checklist.md), [rollback baseline](docs/release-baseline.md), and [design review](docs/design-review/review-and-exact-prompts.md).

## Production configuration

Keep the existing DigitalOcean app connected to GitHub main. Do not create another application. The dashboard is authoritative for domains and secrets; .do/app.yaml is a non-secret reference, not a replacement export.

Inquiry success requires an accepting webhook or Resend with all sender/recipient settings. Missing configuration and delivery failures return recoverable errors. No inquiry details are logged or automatically persisted in the browser.

The booking calendar loads on demand and has a direct fallback link. Optional analytics loads only after visitor consent. Demo events contain no personal information, and scheduling clicks are not claimed as confirmed bookings.

## Content and assets

Pricing and scope terms are in data/pricing.ts and the pricing page. Both founders receive equal prominence. Initials are intentional until approved portraits are available. Three licensed local industry photographs have provenance in public/industries/SOURCES.md. Font licenses accompany the local font assets. Existing social-preview images and public routes remain available; /start permanently redirects.

Demonstrations use fictional data and make no real purchases, assignments or client changes. Customer results and testimonials require evidence and publication permission.
