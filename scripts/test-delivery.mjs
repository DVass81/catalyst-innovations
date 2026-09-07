import http from "node:http";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
let mode = "accept",
  received = null;
const stub = http.createServer(async (req, res) => {
  let body = "";
  for await (const chunk of req) body += chunk;
  received = JSON.parse(body);
  res.writeHead(mode === "accept" ? 202 : 503, {
    "Content-Type": "application/json",
  });
  res.end("{}");
});
await new Promise((resolve) => stub.listen(3110, "127.0.0.1", resolve));
const proc = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "--port", "3102"],
  {
    env: {
      ...process.env,
      NODE_ENV: "production",
      CONSULTATION_WEBHOOK_URL: "http://127.0.0.1:3110",
      RESEND_API_KEY: "",
      CONSULTATION_TO_EMAIL: "",
      CONSULTATION_FROM_EMAIL: "",
      UPSTASH_REDIS_REST_URL: "",
      UPSTASH_REDIS_REST_TOKEN: "",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let logs = "";
proc.stdout.on("data", (b) => {
  logs += b.toString();
});
proc.stderr.on("data", (b) => {
  logs += b.toString();
});
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const payload = {
  name: "Controlled QA",
  email: "controlled@example.com",
  company: "QA Company",
  challenge: "This is a local controlled delivery test.",
  demoContext: "manufacturing",
};
const post = (ip, data = payload) =>
  fetch("http://localhost:3102/api/consultation", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(data),
  });
try {
  for (let n = 0; n < 40; n++) {
    try {
      if ((await fetch("http://localhost:3102/api/health")).ok) break;
    } catch {}
    await pause(250);
  }
  let r = await post("delivery-success");
  assert.equal(r.status, 200);
  assert.equal((await r.json()).ok, true);
  assert.equal(received.demoContext, "manufacturing");
  assert.equal(received.inquiryType, "Request a consultation");
  assert.equal("website" in received, false);
  mode = "reject";
  r = await post("delivery-failure");
  assert.equal(r.status, 502);
  assert.equal((await r.json()).ok, false);
  r = await post("spam", { ...payload, website: "spam.example" });
  assert.equal(r.status, 400);
  mode = "accept";
  for (let i = 0; i < 5; i++)
    assert.equal((await post("rate-limit")).status, 200);
  r = await post("rate-limit");
  assert.equal(r.status, 429);
  assert.equal(r.headers.get("retry-after"), "60");
  // The separately running local production server has no delivery settings.
  r = await fetch("http://localhost:3100/api/consultation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "no-config",
    },
    body: JSON.stringify(payload),
  });
  assert.equal(r.status, 503);
  assert.equal((await r.json()).ok, false);
  assert.equal(logs.includes(payload.email), false);
  assert.equal(logs.includes(payload.challenge), false);
  console.log(
    "PASS: provider acceptance, rejected delivery, missing configuration, spam protection, rate limiting, demo context, and absence of inquiry contents in server logs.",
  );
} finally {
  proc.kill();
  await new Promise((resolve) => stub.close(resolve));
}
