// Run in the configured deployment environment. Reports missing settings, never values or secrets.
import { readFileSync } from 'node:fs';
const booking = JSON.parse(readFileSync(new URL('../data/booking.json', import.meta.url), 'utf8'));
const results = [];
const add = (check, ready) => results.push({ check, ready: Boolean(ready) });
add('Inquiry delivery provider', process.env.CONSULTATION_WEBHOOK_URL || (process.env.RESEND_API_KEY && process.env.CONSULTATION_TO_EMAIL));
add('Verified email sender when using Resend', !process.env.RESEND_API_KEY || (process.env.CONSULTATION_FROM_EMAIL && !process.env.CONSULTATION_FROM_EMAIL.includes('onboarding@resend.dev')));
let bookingReady = false;
try {
  const url = new URL(process.env.NEXT_PUBLIC_SCHEDULING_URL || booking.publicUrl);
  bookingReady = url.protocol === 'https:' && url.hostname === 'calendly.com' && url.pathname !== '/' && process.env.NEXT_PUBLIC_BOOKING_VERIFIED !== 'false' && (url.href === booking.publicUrl || process.env.NEXT_PUBLIC_BOOKING_VERIFIED === 'true');
} catch {}
add('Reviewed public Calendly event', bookingReady);
const plausibleReady = /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? '');
const gaReady = /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_ID ?? '') && process.env.NEXT_PUBLIC_GA_MANUAL_TRACKING_VERIFIED === 'true';
add('Consent-controlled analytics provider ready', plausibleReady || gaReady);
console.table(results);
console.log('Configuration presence only. Verify delivery, bookings and analytics in their providers before release.');
process.exitCode = results.every(result => result.ready) ? 0 : 1;
