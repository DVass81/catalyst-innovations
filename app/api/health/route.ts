import { NextResponse } from "next/server";

/**
 * Trivial health-check endpoint for uptime monitors (UptimeRobot, Better
 * Uptime, Pingdom, etc.). Point a monitor at GET /api/health — a 200 means
 * the Node process is up and serving requests.
 */
export async function GET() {
  return NextResponse.json({ status: "ok", ts: new Date().toISOString() });
}
