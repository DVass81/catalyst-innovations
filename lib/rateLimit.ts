/**
 * Rate limiting for the consultation API.
 *
 * Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (Upstash's free
 * tier is plenty) and limits become durable and correct across redeploys
 * and multiple instances. Without them, falls back to the original
 * in-memory window — fine for a single instance, but it silently resets on
 * every redeploy and won't coordinate across instances if the app ever
 * scales out.
 */

const WINDOW_SECONDS = 60;
const MAX_PER_WINDOW = 5;

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// In-memory fallback state.
const hits = new Map<string, { count: number; start: number }>();

function checkInMemory(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 5000) {
    for (const [key, value] of hits)
      if (now - value.start > WINDOW_SECONDS * 1000) hits.delete(key);
    if (hits.size > 10000 && !hits.has(ip)) return true;
  }
  const h = hits.get(ip);
  if (!h || now - h.start > WINDOW_SECONDS * 1000) {
    hits.set(ip, { count: 1, start: now });
    return false;
  }
  h.count += 1;
  return h.count > MAX_PER_WINDOW;
}

async function checkUpstash(ip: string): Promise<boolean> {
  const key = `ratelimit:consultation:${ip}`;
  try {
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, String(WINDOW_SECONDS), "NX"],
      ]),
    });
    if (!res.ok) throw new Error(`Upstash responded ${res.status}`);
    const [incrResult] = (await res.json()) as { result: number }[];
    return incrResult.result > MAX_PER_WINDOW;
  } catch {
    console.error(
      "[rateLimit] Durable limiter unavailable; using local window",
    );
    return checkInMemory(ip);
  }
}

/** Returns true if the request should be rejected as rate-limited. */
export async function isRateLimited(ip: string): Promise<boolean> {
  if (UPSTASH_URL && UPSTASH_TOKEN) return checkUpstash(ip);
  return checkInMemory(ip);
}
