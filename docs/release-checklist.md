# Redesign release

The existing DigitalOcean app deploys from main. Keep the redesign branch isolated until delivery configuration is complete. See release-baseline.md for rollback.

## Local checks

- npm ci; npm run lint; npm test; npm audit --omit=dev
- npm run build; npm start -- -p 3100
- TEST_BASE_URL=http://localhost:3100 npm run test:browser
- node scripts/test-delivery.mjs tests accepted delivery, rejection, missing configuration, spam, rate limiting and absence of personal details in logs against a local controlled destination.
- npm run build:sites produces the separate private review with noindex independently of public Next.js production.

## Production gate

Configure CONSULTATION_WEBHOOK_URL, or RESEND_API_KEY plus CONSULTATION_TO_EMAIL and CONSULTATION_FROM_EMAIL, directly in the existing DigitalOcean application's environment settings. Use a verified sender; never commit credentials. Confirm an authorized test reaches the intended inbox/CRM before launch. A local delivery stub cannot verify that account.

Preserve public site and scheduling URLs. Merge the validated PR only after delivery passes. Watch the existing app's deployment, then verify HTTPS, home, demos, pricing, calculator, inquiry and calendar fallback on the public domain. Roll back a critical regression to the recorded release.

## Remaining evidence

Verify Search Console indexing and actual analytics receipt when those accounts are configured. Scheduling clicks are not confirmed bookings. Measure Core Web Vitals at the 75th percentile from real visitors; laboratory measurements are not field INP. Complete physical-device and assistive-technology checks. Publish customer evidence only with permission. Assign monitoring and inquiry ownership to the founders.
