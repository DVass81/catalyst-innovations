/* eslint-disable @typescript-eslint/no-require-imports -- Standalone private Node setup helper, with no application environment loading. */
"use strict";

const http = require("node:http");
const { randomBytes, scrypt, timingSafeEqual } = require("node:crypto");
const { promisify } = require("node:util");

const derive = promisify(scrypt);
const address = "127.0.0.1";
const port = 3157;
const host = `${address}:${port}`;
const origin = `http://${host}`;
const maxBodyBytes = 2048;
let values = null;
let generating = false;
let generation = 0;

function headers(nonce) {
  return {
    "Cache-Control": "no-store, private, max-age=0",
    Pragma: "no-cache",
    "Content-Security-Policy": `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'`,
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Cross-Origin-Opener-Policy": "same-origin",
    "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
  };
}

function json(response, status, data) {
  response.writeHead(status, { ...headers(randomBytes(16).toString("base64url")), "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(data));
}

async function readBody(request) {
  const chunks = [];
  let size = 0;
  try {
    for await (const chunk of request) {
      size += chunk.length;
      if (size > maxBodyBytes) throw new Error("BODY_LIMIT");
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  } finally {
    for (const chunk of chunks) chunk.fill(0);
  }
}

function page(nonce) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive,nosnippet"><title>Private publisher password setup</title><style nonce="${nonce}">
    :root{color-scheme:light;font-family:system-ui,sans-serif;background:#f6f5f0;color:#153d36}*{box-sizing:border-box}body{margin:0;padding:32px 18px}main{max-width:700px;margin:auto}h1{font-size:clamp(1.8rem,5vw,2.5rem);line-height:1.1}p,li{line-height:1.6}form,section{margin-top:28px}label{display:block;font-weight:650;margin:18px 0 7px}input{width:100%;padding:13px;border:1px solid #759087;border-radius:8px;font:inherit;min-width:0}button{padding:12px 17px;min-height:44px;border:0;border-radius:8px;background:#185547;color:white;font:inherit;font-weight:650;cursor:pointer;margin-top:12px}button:disabled{opacity:.55;cursor:wait}button.secondary{background:#e2e8df;color:#153d36}code{overflow-wrap:anywhere}#status{min-height:2em}#status[role=alert]{color:#9a261f}.field{margin-top:20px}.field label{overflow-wrap:anywhere}.notice{border-left:3px solid #bb8b39;padding:1px 0 1px 17px}ul{padding-left:23px}[hidden]{display:none!important}
  </style></head><body><main>
    <p>Local and private · Catalyst Innovations</p><h1>Publisher password setup</h1>
    <p>Choose a separate password for Echo’s limited Blog publisher. This helper runs only on this computer. It makes no external requests, writes no files, and never prints passwords or setup values.</p>
    <p>Keep the password in your password manager. Enter it here privately; do not paste it into a chat.</p>
    <form id="setup-form" action="/setup" method="post" autocomplete="off">
      <label for="publisher-password">New publisher password · 16–256 characters</label><input id="publisher-password" name="password" type="password" minlength="16" maxlength="256" autocomplete="new-password" required>
      <label for="publisher-confirm">Confirm publisher password</label><input id="publisher-confirm" name="confirm" type="password" minlength="16" maxlength="256" autocomplete="new-password" required>
      <button id="generate" type="submit">Create private setup values</button>
    </form>
    <p id="status" role="status" aria-live="polite">No setup values generated.</p>
    <section id="result" hidden aria-labelledby="result-title"><h2 id="result-title">Private runtime settings</h2>
      <p>Copy these values directly into the existing Catalyst DigitalOcean app only after approving that change. For each setting, choose <strong>encrypted</strong> and <strong>runtime only</strong>. Preserve all existing settings.</p>
      <div class="field"><label for="publisher-hash">BLOG_PUBLISHER_PASSWORD_HASH</label><input id="publisher-hash" type="password" readonly autocomplete="off" spellcheck="false"><button type="button" data-copy="publisher-hash">Copy password verifier</button></div>
      <div class="field"><label for="publisher-secret">BLOG_PUBLISHER_SESSION_SECRET</label><input id="publisher-secret" type="password" readonly autocomplete="off" spellcheck="false"><button type="button" data-copy="publisher-secret">Copy session secret</button></div>
      <div class="field"><label for="publisher-enabled">BLOG_PUBLISHER_ENABLED</label><input id="publisher-enabled" value="true" readonly autocomplete="off"><button type="button" data-copy="publisher-enabled">Copy activation value</button></div>
      <div class="notice"><p><strong>Activation grants new publishing access.</strong> Set <code>BLOG_PUBLISHER_ENABLED=true</code> only after approving the limited publisher and its session policy. The ordinary editor password and eight-hour session stay unchanged.</p></div>
      <ul><li>This helper does not sign in to DigitalOcean, transfer settings, or deploy anything.</li><li>Private values remain only in this helper’s memory and this browser page until cleared or stopped.</li><li>After copying approved settings, clear the page, close the tab, and stop the helper. Clear copied secrets from your clipboard when finished.</li></ul>
      <button id="clear" type="button" class="secondary">Clear private setup values</button>
    </section>
    <noscript>JavaScript is required for this private setup. Do not submit your password without it.</noscript>
  </main><script nonce="${nonce}">
    "use strict";
    const form=document.getElementById("setup-form");
    const status=document.getElementById("status");
    const result=document.getElementById("result");
    const generate=document.getElementById("generate");
    function message(text,error=false){status.setAttribute("role",error?"alert":"status");status.textContent=text;}
    function erase(){document.getElementById("publisher-hash").value="";document.getElementById("publisher-secret").value="";form.reset();result.hidden=true;}
    form.addEventListener("submit",async event=>{
      event.preventDefault();generate.disabled=true;message("Creating private setup values…");
      try{
        const response=await fetch("/setup",{method:"POST",credentials:"omit",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:document.getElementById("publisher-password").value,confirm:document.getElementById("publisher-confirm").value})});
        form.reset();
        const data=await response.json();
        if(!response.ok)throw new Error(data.error||"Private setup could not be completed.");
        document.getElementById("publisher-hash").value=data.passwordHash;
        document.getElementById("publisher-secret").value=data.sessionSecret;
        result.hidden=false;message("Private setup values created. Review the activation instructions before saving them to hosting.");
      }catch(error){form.reset();message(error.message||"Private setup could not be completed.",true);}
      finally{generate.disabled=false;}
    });
    document.querySelectorAll("[data-copy]").forEach(button=>button.addEventListener("click",async()=>{
      const input=document.getElementById(button.dataset.copy);
      if(!input.value){message("Create private setup values first.",true);return;}
      try{await navigator.clipboard.writeText(input.value);message("Copied the selected setting. Paste it only into the approved private hosting form.");}
      catch{message("Copy was not available. Use this browser’s permission controls, then try the copy button again.",true);}
    }));
    document.getElementById("clear").addEventListener("click",async()=>{
      erase();
      try{const response=await fetch("/clear",{method:"POST",credentials:"omit",cache:"no-store",headers:{"Content-Type":"application/json"},body:"{}"});if(!response.ok)throw new Error();message("Private values cleared from the helper and page. You may close this tab and stop the helper.");}
      catch{message("The page was cleared. Stop the local helper to ensure its memory is cleared too.",true);}
    });
    window.addEventListener("pagehide",erase);
  </script></body></html>`;
}

const server = http.createServer(async (request, response) => {
  const client = request.socket.remoteAddress;
  if (request.headers.host !== host || !["127.0.0.1", "::ffff:127.0.0.1"].includes(client)) {
    json(response, 403, { error: "Only the exact local setup address is accepted." });
    return;
  }
  // Exact paths reject query strings, including attempts to put credentials in a URL.
  if (request.method === "GET" && request.url === "/") {
    const nonce = randomBytes(16).toString("base64url");
    response.writeHead(200, { ...headers(nonce), "Content-Type": "text/html; charset=utf-8" });
    response.end(page(nonce));
    return;
  }
  if (request.method !== "POST" || !["/setup", "/clear"].includes(request.url)) {
    json(response, 404, { error: "This setup route is not available." });
    return;
  }
  if (request.headers.origin !== origin) {
    json(response, 403, { error: "Use the private form at the local setup address." });
    return;
  }
  if (request.headers["content-type"]?.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
    json(response, 415, { error: "The private setup form is required." });
    return;
  }
  let body;
  let input;
  try {
    body = await readBody(request);
    input = JSON.parse(body.toString("utf8"));
  } catch {
    json(response, 400, { error: "The private form could not be read or exceeded its size limit." });
    return;
  } finally { body?.fill(0); }
  if (request.url === "/clear") {
    generation++;
    values = null;
    input = null;
    json(response, 200, { cleared: true });
    console.log("Private setup values cleared.");
    return;
  }
  if (generating) {
    input = null;
    json(response, 409, { error: "A setup is already in progress. Wait, then try again." });
    return;
  }
  if (!input || typeof input !== "object" || typeof input.password !== "string" || typeof input.confirm !== "string"
    || input.password.length < 16 || input.password.length > 256 || input.confirm.length < 16 || input.confirm.length > 256) {
    input = null;
    json(response, 422, { error: "Enter and confirm a password between 16 and 256 characters." });
    return;
  }
  const password = Buffer.from(input.password, "utf8");
  const confirmation = Buffer.from(input.confirm, "utf8");
  input = null;
  if (password.length !== confirmation.length || !timingSafeEqual(password, confirmation)) {
    password.fill(0); confirmation.fill(0);
    json(response, 422, { error: "The two passwords do not match." });
    return;
  }
  confirmation.fill(0);
  generating = true;
  const currentGeneration = ++generation;
  let key;
  try {
    const salt = randomBytes(16);
    key = await derive(password, salt, 64);
    if (currentGeneration !== generation) {
      json(response, 409, { error: "The private setup was cleared. Start again when ready." });
      return;
    }
    values = { passwordHash: `scrypt:${salt.toString("hex")}:${key.toString("hex")}`, sessionSecret: randomBytes(32).toString("base64url") };
    json(response, 200, values);
    console.log("Private setup values generated; activation still requires approval.");
  } catch {
    values = null;
    json(response, 500, { error: "The private setup could not be completed. Try again." });
  } finally {
    password.fill(0);
    key?.fill(0);
    generating = false;
  }
});

server.requestTimeout = 10_000;
server.headersTimeout = 10_000;
server.keepAliveTimeout = 5_000;
server.maxHeadersCount = 30;
server.on("clientError", (_error, socket) => { socket.end("HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n"); });
server.on("error", () => { values = null; console.error("The private setup helper could not start. Its local port may already be in use."); process.exitCode = 1; });
function shutdown() { generation++; values = null; server.close(() => process.exit(0)); }
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
server.listen(port, address, () => { console.log(`Private publisher setup: ${origin}/`); console.log("Activation is not enabled or changed by this helper."); });
