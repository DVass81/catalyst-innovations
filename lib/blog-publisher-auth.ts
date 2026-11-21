import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const derive = promisify(scrypt);
const IDLE_SECONDS = 90 * 24 * 60 * 60;
const ABSOLUTE_SECONDS = 365 * 24 * 60 * 60;
const PREVIEW_SECONDS = 10 * 60;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { start: number; count: number }>();
let globalWindow = { start: Date.now(), count: 0 };

function canonicalOrigin() {
  try {
    const origin = new URL(process.env.BLOG_EDITOR_ORIGIN ?? "");
    if (origin.username || origin.password || origin.pathname !== "/" || origin.search || origin.hash) return null;
    if (process.env.NODE_ENV === "production" ? origin.protocol !== "https:" : !["http:", "https:"].includes(origin.protocol)) return null;
    return origin.origin;
  } catch { return null; }
}

function config() {
  const passwordHash = process.env.BLOG_PUBLISHER_PASSWORD_HASH ?? "";
  const sessionSecret = process.env.BLOG_PUBLISHER_SESSION_SECRET ?? "";
  if (process.env.BLOG_PUBLISHER_ENABLED !== "true" || !canonicalOrigin()
    || !/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(passwordHash)
    || !/^[A-Za-z0-9_-]{43,128}$/.test(sessionSecret)) return null;
  return { passwordHash, sessionSecret };
}

export type PublisherSession = { issuedAt: number; refreshedAt: number };

export const publisherConfigured = () => config() !== null;
export const publisherCookieName = () => process.env.NODE_ENV === "production" ? "__Host-catalyst-blog-publisher" : "catalyst-blog-publisher-local";
export const publisherCookieOptions = (maxAge = IDLE_SECONDS) => ({
  httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const,
  path: "/", maxAge: Math.max(0, Math.min(IDLE_SECONDS, Math.floor(maxAge))),
});

function signature(audience: "session" | "preview", payload: string, settings: NonNullable<ReturnType<typeof config>>) {
  return createHmac("sha256", settings.sessionSecret)
    .update(`catalyst-blog-publisher:${audience}:v1\n`).update(settings.passwordHash).update("\n").update(payload).digest("base64url");
}

function matchesSignature(actual: string, expected: string) {
  return actual.length === expected.length && timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

function validTime(now: number) { return Number.isSafeInteger(now) && now > 0; }

function sessionToken(issuedAt: number, refreshedAt: number, settings: NonNullable<ReturnType<typeof config>>) {
  const payload = `v1.${issuedAt}.${refreshedAt}.${randomBytes(16).toString("base64url")}`;
  return `${payload}.${signature("session", payload, settings)}`;
}

export function createPublisherSession(now = Date.now()) {
  const settings = config();
  if (!settings) throw new Error("Publisher is not configured.");
  if (!validTime(now)) throw new Error("Invalid publisher session time.");
  return sessionToken(now, now, settings);
}

/** Reading does not renew a session; renewal is sent only by an authorized API response. */
export function readPublisherSession(value: string | undefined, now = Date.now()): PublisherSession | null {
  const settings = config();
  if (!settings || !value || value.length > 220 || !validTime(now)) return null;
  const match = /^(v1\.(\d{1,16})\.(\d{1,16})\.[A-Za-z0-9_-]{22})\.([A-Za-z0-9_-]{43})$/.exec(value);
  if (!match) return null;
  const issuedAt = Number(match[2]);
  const refreshedAt = Number(match[3]);
  if (!validTime(issuedAt) || !validTime(refreshedAt) || issuedAt > refreshedAt || refreshedAt > now
    || now - issuedAt >= ABSOLUTE_SECONDS * 1000 || now - refreshedAt >= IDLE_SECONDS * 1000) return null;
  if (!matchesSignature(match[4], signature("session", match[1], settings))) return null;
  return { issuedAt, refreshedAt };
}

export function refreshPublisherSession(value: string | undefined, now = Date.now()): string | null {
  const session = readPublisherSession(value, now);
  const settings = config();
  return session && settings ? sessionToken(session.issuedAt, now, settings) : null;
}

export async function checkPublisherPassword(password: unknown) {
  const settings = config();
  if (!settings || typeof password !== "string" || password.length < 16 || password.length > 256) return false;
  const [, salt, hash] = settings.passwordHash.split(":");
  const actual = await derive(password, Buffer.from(salt, "hex"), 64) as Buffer;
  return timingSafeEqual(actual, Buffer.from(hash, "hex"));
}

/** Bounded per-instance protection; pair production with the host's edge rate limit. */
export function limitPublisherLogin(ip: string, now = Date.now()) {
  if (now - globalWindow.start >= WINDOW_MS || now < globalWindow.start) globalWindow = { start: now, count: 0 };
  if (++globalWindow.count > 30) return false;
  const key = ip.slice(0, 80);
  let record = attempts.get(key);
  if (!record || now - record.start >= WINDOW_MS || now < record.start) {
    if (attempts.size >= 1000) attempts.delete(attempts.keys().next().value!);
    record = { start: now, count: 0 };
    attempts.set(key, record);
  }
  return ++record.count <= 5;
}

export function samePublisherOrigin(request: Request) {
  const expected = canonicalOrigin();
  return expected !== null && request.headers.get("origin") === expected;
}

function previewPayload(payload: string) {
  if (typeof payload !== "string" || !payload || payload.length > 2048) throw new Error("Invalid publisher preview.");
  return payload;
}

/** Ten-minute authorization binds the exact normalized input and saved catalog revision. */
export function signPublisherPreview(payload: string, now = Date.now()) {
  const settings = config();
  if (!settings) throw new Error("Publisher is not configured.");
  if (!validTime(now)) throw new Error("Invalid publisher preview time.");
  const body = `v1.${now}.${randomBytes(16).toString("base64url")}`;
  return `${body}.${signature("preview", `${body}\n${previewPayload(payload)}`, settings)}`;
}

export function verifyPublisherPreview(token: unknown, payload: string, now = Date.now()) {
  const settings = config();
  if (!settings || typeof token !== "string" || token.length > 200 || !validTime(now)) return false;
  const match = /^(v1\.(\d{1,16})\.[A-Za-z0-9_-]{22})\.([A-Za-z0-9_-]{43})$/.exec(token);
  if (!match) return false;
  const issuedAt = Number(match[2]);
  if (!validTime(issuedAt) || issuedAt > now || now - issuedAt >= PREVIEW_SECONDS * 1000) return false;
  try { return matchesSignature(match[3], signature("preview", `${match[1]}\n${previewPayload(payload)}`, settings)); }
  catch { return false; }
}
