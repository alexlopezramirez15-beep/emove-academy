/* EMOVE Profe · accounts API
   Teachers request access with their details; the super-admin approves each account before it can sign in.
   Environment variables (Netlify): AUTH_SECRET (signs sessions, 32+ characters), ADMIN_EMAILS (super-admin emails, comma separated).
   Accounts live in Netlify Blobs (store "emove-users"). For local tests, EP_STORE_DIR keeps them as JSON files. */
import { scrypt as _scrypt, randomBytes, createHmac, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { promises as fs } from "node:fs";
import path from "node:path";

const scrypt = promisify(_scrypt);
const SESSION_DAYS = 30;
const MAX_FAILS = 6, LOCK_MIN = 15;
const ROLES = ["teacher", "coordinator", "head", "trainer", "other"];

/* ---- store ---- */
async function storeFor() {
  const dir = process.env.EP_STORE_DIR;
  if (dir) {
    await fs.mkdir(dir, { recursive: true });
    const file = k => path.join(dir, encodeURIComponent(k) + ".json");
    return {
      async get(k) { try { return JSON.parse(await fs.readFile(file(k), "utf8")); } catch (e) { return null; } },
      async set(k, v) { await fs.writeFile(file(k), JSON.stringify(v)); },
      async del(k) { await fs.rm(file(k), { force: true }); },
      async keys(prefix) { return (await fs.readdir(dir)).map(f => decodeURIComponent(f.replace(/\.json$/, ""))).filter(k => k.startsWith(prefix)); }
    };
  }
  const { getStore } = await import("@netlify/blobs");
  const s = getStore({ name: "emove-users", consistency: "strong" });
  return {
    get: k => s.get(k, { type: "json" }),
    set: (k, v) => s.setJSON(k, v),
    del: k => s.delete(k),
    async keys(prefix) { const { blobs } = await s.list({ prefix }); return blobs.map(b => b.key); }
  };
}
const ukey = email => "u/" + email;
const dkey = email => "d/" + email;

/* ---- helpers ---- */
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const err = (status, code, msg) => json({ error: code, message: msg }, status);
const normEmail = e => String(e || "").trim().toLowerCase();
const okEmail = e => /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(e) && e.length <= 254;
const clip = (v, n = 120) => String(v == null ? "" : v).replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n);
const admins = () => String(process.env.ADMIN_EMAILS || "").split(",").map(normEmail).filter(Boolean);
const isAdminEmail = e => admins().includes(e);
const b64u = b => Buffer.from(b).toString("base64url");

/* session key: AUTH_SECRET when set; otherwise a random one created once and kept in the store */
let SECRET = null;
async function loadSecret(store) {
  if (SECRET) return SECRET;
  const env = process.env.AUTH_SECRET;
  if (env && env.length >= 32) return (SECRET = env);
  let cfg = await store.get("cfg/secret");
  if (!cfg || !cfg.k) { cfg = { k: randomBytes(48).toString("base64url") }; await store.set("cfg/secret", cfg); cfg = (await store.get("cfg/secret")) || cfg; }
  return (SECRET = cfg.k);
}
async function hashPass(pw) {
  const salt = randomBytes(16);
  const h = await scrypt(pw, salt, 64, { N: 16384, r: 8, p: 1 });
  return "s1$" + salt.toString("base64") + "$" + h.toString("base64");
}
async function checkPass(pw, stored) {
  const [v, salt, h] = String(stored || "").split("$");
  if (v !== "s1" || !salt || !h) return false;
  const want = Buffer.from(h, "base64");
  const got = await scrypt(pw, Buffer.from(salt, "base64"), want.length, { N: 16384, r: 8, p: 1 });
  return timingSafeEqual(want, got);
}
function sign(payload) {
  const body = b64u(JSON.stringify(payload));
  return body + "." + createHmac("sha256", SECRET).update(body).digest("base64url");
}
function verify(token) {
  const [body, mac] = String(token || "").split(".");
  if (!body || !mac) return null;
  const want = createHmac("sha256", SECRET).update(body).digest();
  const got = Buffer.from(mac, "base64url");
  if (got.length !== want.length || !timingSafeEqual(want, got)) return null;
  try { const p = JSON.parse(Buffer.from(body, "base64url").toString()); return p.exp > Date.now() ? p : null; } catch (e) { return null; }
}
const session = u => sign({ e: u.email, v: u.tv || 0, exp: Date.now() + SESSION_DAYS * 864e5 });
/* what the user and the super-admin see (never the password) */
const pub = u => ({
  email: u.email, name: u.name, school: u.school, country: u.country, role: u.role, stage: u.stage, subject: u.subject,
  interests: u.interests || [], news: !!u.news, status: u.status, admin: isAdminEmail(u.email),
  created: u.created, decided: u.decided, lastLogin: u.lastLogin
});

async function authed(req, store) {
  const h = req.headers.get("authorization") || "";
  const p = verify(h.replace(/^Bearer\s+/i, ""));
  if (!p) return null;
  const u = await store.get(ukey(p.e));
  if (!u || (u.tv || 0) !== p.v) return null;
  return u;
}
async function body(req) { try { const b = await req.json(); return b && typeof b === "object" ? b : {}; } catch (e) { return {}; } }
async function activeUser(req, store) {
  const u = await authed(req, store);
  if (!u) return [null, err(401, "auth", "Your session has expired. Please sign in again.")];
  if (u.status !== "approved" && !isAdminEmail(u.email)) return [null, json({ error: u.status, status: u.status }, 403)];
  return [u, null];
}
async function adminOnly(req, store) {
  const a = await authed(req, store);
  return a && isAdminEmail(a.email) ? a : null;
}

/* ---- routes ---- */
async function register(req, store) {
  const b = await body(req);
  if (b.website) return json({ ok: true, status: "pending" }); // honeypot for bots
  const email = normEmail(b.email), pw = String(b.password || "");
  const u = {
    email, name: clip(b.name, 80), school: clip(b.school, 120), country: clip(b.country, 60),
    role: ROLES.includes(b.role) ? b.role : "teacher", stage: clip(b.stage, 40), subject: clip(b.subject, 80),
    interests: (Array.isArray(b.interests) ? b.interests : []).map(x => clip(x, 40)).filter(Boolean).slice(0, 10), news: !!b.news
  };
  if (!okEmail(email)) return err(400, "email", "Please enter a valid email address.");
  if (u.name.length < 2) return err(400, "name", "Please enter your full name.");
  if (u.school.length < 2) return err(400, "school", "Please tell us your school or organisation.");
  if (u.country.length < 2) return err(400, "country", "Please choose your country.");
  if (pw.length < 8 || pw.length > 200) return err(400, "password", "Your password needs at least 8 characters.");
  if (!b.accept) return err(400, "accept", "Please accept the privacy notice so we can manage your access.");
  if (await store.get(ukey(email))) return err(409, "exists", "There is already a request with this email. Sign in with your password or contact us.");
  const admin = isAdminEmail(email), now = new Date().toISOString();
  Object.assign(u, { pass: await hashPass(pw), status: admin ? "approved" : "pending", created: now, decided: admin ? now : null, tv: 0, fails: 0, lockUntil: 0 });
  await store.set(ukey(email), u);
  return json({ ok: true, status: u.status });
}
async function login(req, store) {
  const b = await body(req);
  const email = normEmail(b.email), pw = String(b.password || "");
  const u = email && await store.get(ukey(email));
  if (!u) { await checkPass(pw, "s1$AAAAAAAAAAAAAAAAAAAAAA==$" + "A".repeat(86)).catch(() => { }); return err(401, "bad", "Wrong email or password."); }
  if (u.lockUntil > Date.now()) return err(429, "locked", "Too many attempts. Please try again in a few minutes.");
  if (!(await checkPass(pw, u.pass))) {
    u.fails = (u.fails || 0) + 1;
    if (u.fails >= MAX_FAILS) { u.fails = 0; u.lockUntil = Date.now() + LOCK_MIN * 60e3; }
    await store.set(ukey(email), u);
    return err(401, "bad", "Wrong email or password.");
  }
  if (u.fails || u.lockUntil) { u.fails = 0; u.lockUntil = 0; }
  if (isAdminEmail(email) && u.status !== "approved") u.status = "approved";
  if (u.status !== "approved") { await store.set(ukey(email), u); return json({ error: u.status, status: u.status, user: { name: u.name, email: u.email } }, 403); }
  u.lastLogin = new Date().toISOString();
  await store.set(ukey(email), u);
  return json({ token: session(u), user: pub(u) });
}
async function me(req, store) {
  const [u, bad] = await activeUser(req, store); if (bad) return bad;
  return json({ user: pub(u) });
}
async function profile(req, store) {
  const [u, bad] = await activeUser(req, store); if (bad) return bad;
  const b = await body(req);
  for (const [k, n] of [["name", 80], ["school", 120], ["country", 60], ["stage", 40], ["subject", 80]]) if (b[k] != null) u[k] = clip(b[k], n);
  if (ROLES.includes(b.role)) u.role = b.role;
  if (Array.isArray(b.interests)) u.interests = b.interests.map(x => clip(x, 40)).filter(Boolean).slice(0, 10);
  if (typeof b.news === "boolean") u.news = b.news;
  if (u.name.length < 2) return err(400, "name", "Please enter your full name.");
  await store.set(ukey(u.email), u);
  return json({ ok: true, user: pub(u) });
}
async function changePass(req, store) {
  const [u, bad] = await activeUser(req, store); if (bad) return bad;
  const b = await body(req);
  if (!(await checkPass(String(b.old || ""), u.pass))) return err(400, "old", "Your current password is not correct.");
  const pw = String(b.password || "");
  if (pw.length < 8 || pw.length > 200) return err(400, "password", "Your password needs at least 8 characters.");
  u.pass = await hashPass(pw); u.tv = (u.tv || 0) + 1;
  await store.set(ukey(u.email), u);
  return json({ ok: true, token: session(u) });
}
async function adminUsers(req, store) {
  if (!(await adminOnly(req, store))) return err(403, "forbidden", "Only the super-admin can see this.");
  const keys = await store.keys("u/");
  const users = (await Promise.all(keys.map(k => store.get(k)))).filter(Boolean).map(pub);
  const progress = await Promise.all(users.map(u => store.get(dkey(u.email)).then(d => d && d.state && d.state.summary || null).catch(() => null)));
  users.forEach((u, i) => u.progress = progress[i]);
  users.sort((x, y) => String(y.created).localeCompare(String(x.created)));
  return json({ users });
}
async function adminUser(req, store) {
  const a = await adminOnly(req, store);
  if (!a) return err(403, "forbidden", "Only the super-admin can do this.");
  const b = await body(req), email = normEmail(b.email);
  const u = await store.get(ukey(email));
  if (!u) return err(404, "missing", "That user does not exist.");
  const self = email === a.email, now = new Date().toISOString();
  switch (b.action) {
    case "approve": u.status = "approved"; u.decided = now; break;
    case "reject": if (self) return err(400, "self", "You cannot block your own account."); u.status = "rejected"; u.decided = now; break;
    case "pending": if (self) return err(400, "self", "You cannot change your own account."); u.status = "pending"; u.decided = null; break;
    case "reset": {
      const abc = "abcdefghjkmnpqrstuvwxyz23456789", temp = [...randomBytes(10)].map(x => abc[x % abc.length]).join("");
      u.pass = await hashPass(temp); u.tv = (u.tv || 0) + 1; u.fails = 0; u.lockUntil = 0;
      await store.set(ukey(email), u);
      return json({ ok: true, temp, user: pub(u) });
    }
    case "delete": if (self) return err(400, "self", "You cannot delete your own account."); await store.del(ukey(email)); await store.del(dkey(email)); return json({ ok: true });
    default: return err(400, "action", "Unknown action.");
  }
  await store.set(ukey(email), u);
  return json({ ok: true, user: pub(u) });
}

/* ---- user data (progress, favourites, certificates), synced between devices ----
   One copy per account with a revision number: if another device saved first, the server answers 409
   with its copy so the browser can merge and send again. */
const MAX_DATA = 1024 * 1024;
async function getData(req, store) {
  const [u, bad] = await activeUser(req, store); if (bad) return bad;
  const d = await store.get(dkey(u.email));
  return json(d ? { rev: d.rev, updated: d.updated, state: d.state } : { rev: 0, updated: null, state: null });
}
async function putData(req, store) {
  const [u, bad] = await activeUser(req, store); if (bad) return bad;
  const raw = await req.text();
  if (raw.length > MAX_DATA) return err(413, "big", "Your data is too large to save online.");
  let b; try { b = JSON.parse(raw); } catch (e) { return err(400, "json", "Invalid data."); }
  if (!b || typeof b.state !== "object" || Array.isArray(b.state) || b.state === null) return err(400, "state", "Invalid data.");
  const cur = await store.get(dkey(u.email));
  const rev = cur ? cur.rev : 0;
  if ((+b.base || 0) !== rev) return json({ error: "conflict", rev, updated: cur && cur.updated, state: cur && cur.state }, 409);
  const d = { rev: rev + 1, updated: new Date().toISOString(), state: b.state };
  await store.set(dkey(u.email), d);
  return json({ rev: d.rev, updated: d.updated });
}

const ROUTES = {
  "GET ping": () => json({ ok: true, app: "emove-profe" }),
  "POST register": register, "POST login": login, "GET me": me, "POST profile": profile, "POST password": changePass,
  "GET admin/users": adminUsers, "POST admin/user": adminUser,
  "GET data": getData, "PUT data": putData
};
export default async function handler(req) {
  const p = new URL(req.url).pathname.replace(/^\/api\/?/, "").replace(/\/$/, "");
  const fn = ROUTES[req.method + " " + p];
  if (!fn) return err(404, "notfound", "Route not found.");
  try { const store = await storeFor(); await loadSecret(store); return await fn(req, store); }
  catch (e) { console.error(e); return err(500, "server", "Server error. Please try again."); }
}
export const config = { path: "/api/*" };
