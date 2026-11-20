import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const derive = promisify(scrypt);
const SESSION_SECONDS = 8 * 60 * 60;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { start: number; count: number }>();
let globalWindow = { start: Date.now(), count: 0 };

function config() {
  const passwordHash = process.env.BLOG_EDITOR_PASSWORD_HASH ?? "";
  const sessionSecret = process.env.BLOG_EDITOR_SESSION_SECRET ?? "";
  if (!/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(passwordHash) || !/^[A-Za-z0-9_-]{43,128}$/.test(sessionSecret)) return null;
  return { passwordHash, sessionSecret };
}

export const editorConfigured = () => config() !== null;
export const editorCookieName = () => process.env.NODE_ENV === "production" ? "__Host-catalyst-blog" : "catalyst-blog-local";
export const editorCookieOptions = () => ({ httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/", maxAge: SESSION_SECONDS });

function signature(payload: string, settings: NonNullable<ReturnType<typeof config>>) {
  return createHmac("sha256", settings.sessionSecret).update(settings.passwordHash).update("\n").update(payload).digest("base64url");
}

export function createEditorSession(now = Date.now()) {
  const settings = config();
  if (!settings) throw new Error("Editor is not configured.");
  const payload = `${Math.floor(now / 1000) + SESSION_SECONDS}.${randomBytes(16).toString("base64url")}`;
  return `${payload}.${signature(payload, settings)}`;
}

export function hasEditorSession(value: string | undefined, now = Date.now()) {
  const settings = config();
  if (!settings || !value || value.length > 200) return false;
  const match = /^(\d{10})\.([A-Za-z0-9_-]{22})\.([A-Za-z0-9_-]{43})$/.exec(value);
  if (!match) return false;
  const current = Math.floor(now / 1000);
  const expires = Number(match[1]);
  if (expires <= current || expires > current + SESSION_SECONDS) return false;
  const expected = signature(`${match[1]}.${match[2]}`, settings);
  return timingSafeEqual(Buffer.from(expected), Buffer.from(match[3]));
}

export async function checkEditorPassword(password: unknown) {
  const settings = config();
  if (!settings || typeof password !== "string" || password.length < 16 || password.length > 256) return false;
  const [, salt, hash] = settings.passwordHash.split(":");
  const actual = await derive(password, Buffer.from(salt, "hex"), 64) as Buffer;
  return timingSafeEqual(actual, Buffer.from(hash, "hex"));
}

/** Bounded per-instance protection; pair production with the host's edge rate limit. */
export function limitEditorLogin(ip: string, now = Date.now()) {
  if (now - globalWindow.start >= WINDOW_MS) globalWindow = { start: now, count: 0 };
  if (++globalWindow.count > 30) return false;
  let record = attempts.get(ip);
  if (!record || now - record.start >= WINDOW_MS) {
    if (attempts.size >= 1000) attempts.delete(attempts.keys().next().value!);
    record = { start: now, count: 0 };
    attempts.set(ip, record);
  }
  return ++record.count <= 5;
}

export function sameEditorOrigin(request: Request) {
  const configured = process.env.BLOG_EDITOR_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL;
  if (!configured) return false;
  try {
    const expected = new URL(configured);
    if (process.env.NODE_ENV === "production" && expected.protocol !== "https:") return false;
    return request.headers.get("origin") === expected.origin;
  } catch { return false; }
}

export async function readEditorBody(request: Request, limit: number) {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > limit) { await reader.cancel(); throw new Error("Request is too large."); }
      chunks.push(value);
    }
    return Buffer.concat(chunks).toString("utf8");
  } finally { reader.releaseLock(); }
}
