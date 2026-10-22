/* EMOVE Profe · accounts and community API
   Teachers request access with their details; the super-admin approves each account before it can sign in.
   Approved teachers can post in the discussion spaces and appear in the teacher directory if they choose to.
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
const COURSE_IDS = ["game-on", "ai-teacher", "think", "shine", "outside", "happy"];
const SPACES = ["staffroom", "erasmus", "partners", "ideas", ...COURSE_IDS.map(c => "course-" + c)];
const LOOKING = ["partners", "etwinning", "shadowing", "host", "resources", "course-buddy"];
const POSTS_PER_HOUR = 20;

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
  created: u.created, decided: u.decided, lastLogin: u.lastLogin,
  directory: !!u.directory, showEmail: !!u.showEmail, bio: u.bio || "", looking: u.looking || [], going: u.going || []
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
  if (typeof b.directory === "boolean") u.directory = b.directory;
  if (typeof b.showEmail === "boolean") u.showEmail = b.showEmail;
  if (b.bio != null) u.bio = clip(b.bio, 300);
  if (Array.isArray(b.looking)) u.looking = b.looking.filter(x => LOOKING.includes(x));
  if (Array.isArray(b.going)) u.going = b.going.filter(x => COURSE_IDS.includes(x));
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


/* ---- community: discussion spaces and teacher directory ----
   f/i/<space>  index of the threads of a space (newest activity first)
   f/t/<id>     one thread with its posts; posts[0] is the opening post
   f/recent     latest activity across spaces, for the home page */
const MAX_THREADS = 300, MAX_POSTS = 400, MAX_RECENT = 30;
const text = (v, n) => String(v == null ? "" : v).replace(/\r\n/g, "\n").replace(/[\u0000-\u0008\u000b-\u001f]/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, n);
const author = u => ({ e: u.email, name: u.name, country: u.country || "", school: u.school || "", role: u.role || "teacher", admin: isAdminEmail(u.email) });
/* the email never leaves the server: each post says only whether it is yours */
const showBy = (by, viewer) => ({ name: by.name, country: by.country, school: by.school, role: by.role, admin: !!by.admin, mine: by.e === viewer.email });
const newId = () => Date.now().toString(36) + randomBytes(4).toString("hex");
function rateOk(u) {
  const hour = Date.now() - 36e5;
  u.posts = (u.posts || []).filter(t => t > hour);
  if (u.posts.length >= POSTS_PER_HOUR && !isAdminEmail(u.email)) return false;
  u.posts.push(Date.now());
  return true;
}
async function touchIndex(store, space, item) {
  const ix = (await store.get("f/i/" + space)) || { threads: [] };
  ix.threads = [item, ...ix.threads.filter(t => t.id !== item.id)].slice(0, MAX_THREADS);
  ix.threads.sort((a, b) => (b.pin ? 1 : 0) - (a.pin ? 1 : 0) || String(b.last).localeCompare(String(a.last)));
  await store.set("f/i/" + space, ix);
}
async function addRecent(store, item) {
  const r = (await store.get("f/recent")) || { items: [] };
  r.items = [item, ...r.items.filter(x => !(x.id === item.id && x.kind === item.kind && x.post === item.post))].slice(0, MAX_RECENT);
  await store.set("f/recent", r);
}
const summaryOf = t => ({ id: t.id, space: t.space, title: t.title, by: t.posts[0].by, at: t.at, last: t.posts[t.posts.length - 1].at, n: t.posts.length - 1, pin: !!t.pin, excerpt: t.posts[0].body.slice(0, 160) });
async function forumList(req, store) {
  const [u, bad] = await activeUser(req, store); if (bad) return bad;
  const space = new URL(req.url).searchParams.get("space");
  if (!SPACES.includes(space)) return err(400, "space", "Unknown discussion space.");
  const ix = (await store.get("f/i/" + space)) || { threads: [] };
  return json({ threads: ix.threads.map(t => Object.assign({}, t, { by: showBy(t.by, u) })) });
}
async function forumCounts(req, store) {
  const [u, bad] = await activeUser(req, store); if (bad) return bad;
  const all = await Promise.all(SPACES.map(s => store.get("f/i/" + s)));
  const counts = {};
  SPACES.forEach((s, i) => { const t = (all[i] || { threads: [] }).threads; counts[s] = { threads: t.length, last: t.length ? t.reduce((m, x) => x.last > m ? x.last : m, "") : null }; });
  return json({ counts });
}
async function forumThread(req, store) {
  const [u, bad] = await activeUser(req, store); if (bad) return bad;
  const t = await store.get("f/t/" + new URL(req.url).searchParams.get("id"));
  if (!t) return err(404, "missing", "This discussion no longer exists.");
  return json({ thread: { id: t.id, space: t.space, title: t.title, at: t.at, pin: !!t.pin, posts: t.posts.map(p => ({ id: p.id, body: p.body, at: p.at, by: showBy(p.by, u) })) }, mod: isAdminEmail(u.email) });
}
async function forumNew(req, store) {
  const [u, bad] = await activeUser(req, store); if (bad) return bad;
  const b = await body(req), space = String(b.space || ""), title = text(b.title, 140), msg = text(b.body, 5000);
  if (!SPACES.includes(space)) return err(400, "space", "Unknown discussion space.");
  if (title.length < 4) return err(400, "title", "Please write a title of at least 4 characters.");
  if (msg.length < 2) return err(400, "body", "Please write your message.");
  if (!rateOk(u)) return err(429, "rate", "You have posted a lot in the last hour. Please try again later.");
  await store.set(ukey(u.email), u);
  const now = new Date().toISOString(), id = newId();
  const t = { id, space, title, at: now, pin: false, posts: [{ id: "p0", by: author(u), body: msg, at: now }] };
  await store.set("f/t/" + id, t);
  await touchIndex(store, space, summaryOf(t));
  await addRecent(store, { kind: "thread", id, space, title, name: u.name, country: u.country || "", at: now });
  return json({ ok: true, id });
}
async function forumReply(req, store) {
  const [u, bad] = await activeUser(req, store); if (bad) return bad;
  const b = await body(req), msg = text(b.body, 5000);
  const t = await store.get("f/t/" + String(b.id || ""));
  if (!t) return err(404, "missing", "This discussion no longer exists.");
  if (msg.length < 2) return err(400, "body", "Please write your message.");
  if (t.posts.length >= MAX_POSTS) return err(400, "full", "This discussion is full. Please start a new one.");
  if (!rateOk(u)) return err(429, "rate", "You have posted a lot in the last hour. Please try again later.");
  await store.set(ukey(u.email), u);
  const now = new Date().toISOString(), pid = "p" + newId();
  t.posts.push({ id: pid, by: author(u), body: msg, at: now });
  await store.set("f/t/" + t.id, t);
  await touchIndex(store, t.space, summaryOf(t));
  await addRecent(store, { kind: "reply", id: t.id, post: pid, space: t.space, title: t.title, name: u.name, country: u.country || "", at: now });
  return json({ ok: true, post: pid });
}
async function forumDelete(req, store) {
  const [u, bad] = await activeUser(req, store); if (bad) return bad;
  const b = await body(req), t = await store.get("f/t/" + String(b.id || ""));
  if (!t) return err(404, "missing", "This discussion no longer exists.");
  const mod = isAdminEmail(u.email), pid = String(b.post || "p0");
  const p = t.posts.find(x => x.id === pid);
  if (!p) return err(404, "missing", "This message no longer exists.");
  if (!mod && p.by.e !== u.email) return err(403, "forbidden", "You can only delete your own messages.");
  if (pid === "p0") {
    if (!mod && t.posts.length > 1) return err(400, "replies", "This discussion already has replies, so only the eMove team can remove it.");
    await store.del("f/t/" + t.id);
    const ix = (await store.get("f/i/" + t.space)) || { threads: [] };
    ix.threads = ix.threads.filter(x => x.id !== t.id); await store.set("f/i/" + t.space, ix);
  } else {
    t.posts = t.posts.filter(x => x.id !== pid);
    await store.set("f/t/" + t.id, t);
    await touchIndex(store, t.space, summaryOf(t));
  }
  const r = (await store.get("f/recent")) || { items: [] };
  r.items = r.items.filter(x => !(x.id === t.id && (pid === "p0" || x.post === pid))); await store.set("f/recent", r);
  return json({ ok: true });
}
async function forumPin(req, store) {
  const a = await adminOnly(req, store);
  if (!a) return err(403, "forbidden", "Only the eMove team can pin discussions.");
  const b = await body(req), t = await store.get("f/t/" + String(b.id || ""));
  if (!t) return err(404, "missing", "This discussion no longer exists.");
  t.pin = !t.pin; await store.set("f/t/" + t.id, t); await touchIndex(store, t.space, summaryOf(t));
  return json({ ok: true, pin: t.pin });
}
async function forumRecent(req, store) {
  const [u, bad] = await activeUser(req, store); if (bad) return bad;
  return json({ items: ((await store.get("f/recent")) || { items: [] }).items });
}
/* teacher directory: only approved members who chose to appear; the email only if they chose to share it */
async function members(req, store) {
  const [u, bad] = await activeUser(req, store); if (bad) return bad;
  const all = (await Promise.all((await store.keys("u/")).map(k => store.get(k)))).filter(m => m && m.directory && (m.status === "approved" || isAdminEmail(m.email)));
  const list = all.map(m => ({ name: m.name, school: m.school, country: m.country, role: m.role, stage: m.stage, subject: m.subject, interests: m.interests || [], bio: m.bio || "", looking: m.looking || [], going: m.going || [], email: m.showEmail ? m.email : null, me: m.email === u.email, team: isAdminEmail(m.email) }));
  list.sort((a, b) => (b.me ? 1 : 0) - (a.me ? 1 : 0) || a.name.localeCompare(b.name));
  return json({ members: list, total: all.length });
}

const ROUTES = {
  "GET ping": () => json({ ok: true, app: "emove-profe" }),
  "POST register": register, "POST login": login, "GET me": me, "POST profile": profile, "POST password": changePass,
  "GET admin/users": adminUsers, "POST admin/user": adminUser,
  "GET data": getData, "PUT data": putData,
  "GET forum": forumList, "GET forum/counts": forumCounts, "GET forum/thread": forumThread, "GET forum/recent": forumRecent,
  "POST forum/thread": forumNew, "POST forum/reply": forumReply, "POST forum/delete": forumDelete, "POST forum/pin": forumPin,
  "GET members": members
};
export default async function handler(req) {
  const p = new URL(req.url).pathname.replace(/^\/api\/?/, "").replace(/\/$/, "");
  const fn = ROUTES[req.method + " " + p];
  if (!fn) return err(404, "notfound", "Route not found.");
  try { const store = await storeFor(); await loadSecret(store); return await fn(req, store); }
  catch (e) { console.error(e); return err(500, "server", "Server error. Please try again."); }
}
export const config = { path: "/api/*" };
