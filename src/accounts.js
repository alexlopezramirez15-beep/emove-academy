/* ============ ACCOUNTS: request access, super-admin approval, sign in and sync ============
   On the published site every teacher requests access and can only enter once the super-admin approves it.
   Opened as a local file, or on a host without the API, the app runs in preview mode with no accounts. */
const AUTH_KEY = "emove-profe-auth";
let AUTH = (() => { try { return JSON.parse(localStorage.getItem(AUTH_KEY)) || null; } catch (e) { return null; } })();
let PREVIEW = false;
let REV = 0;
function authSave(a) { AUTH = a; try { a ? localStorage.setItem(AUTH_KEY, JSON.stringify(a)) : localStorage.removeItem(AUTH_KEY); } catch (e) { } }
async function api(path, body, method) {
  const headers = { "content-type": "application/json" };
  if (AUTH && AUTH.token) headers.authorization = "Bearer " + AUTH.token;
  let r;
  try { r = await fetch("/api/" + path, { method: method || (body ? "POST" : "GET"), headers, body: body ? JSON.stringify(body) : undefined }); }
  catch (e) { return { net: true, ok: false, status: 0, data: { message: "No connection. Check your internet and try again." } }; }
  let data = {}; try { data = await r.json(); } catch (e) { data = { message: "The server is not answering. Please try again in a moment." }; }
  return { ok: r.ok, status: r.status, data };
}
/* progress is kept per device: if another account signs in, the previous one is set aside */
function adoptUser(u) {
  if (S.owner && S.owner !== u.email) {
    try { localStorage.setItem(KEY + ":" + S.owner, JSON.stringify(S)); const raw = localStorage.getItem(KEY + ":" + u.email); S = raw ? Object.assign(freshState(), JSON.parse(raw)) : freshState(); }
    catch (e) { S = freshState(); }
    REV = 0;
  }
  S.owner = u.email; USER = u;
  try { REV = +localStorage.getItem(KEY + ":rev:" + u.email) || 0; } catch (e) { }
  save(false);
}
async function accountsBoot(next) {
  const online = /^https?:$/.test(location.protocol);
  const ping = online ? await api("ping") : { ok: false };
  if (!ping.ok && !(ping.net && AUTH)) {
    PREVIEW = true; USER = { name: "Preview", email: "preview", admin: false, preview: true }; S.owner = S.owner || "preview";
    next(); toast("Preview mode: accounts are switched off on this copy.");
    return;
  }
  if (AUTH && AUTH.token && AUTH.user) {
    adoptUser(AUTH.user); next();
    const r = await api("me");
    if (r.net) return; // offline: keep the saved account
    if (r.ok) { const wasAdmin = !!USER.admin; AUTH.user = r.data.user; authSave(AUTH); adoptUser(r.data.user); if (wasAdmin !== !!USER.admin) { shell(); route(); } adminPoll(); syncPull(); return; }
    if (r.status === 401 || r.status === 403) { authSave(null); USER = null; authScreen(next, r.status === 403 ? r.data.status : "expired"); }
    return;
  }
  authScreen(next);
}
function signOut() { authSave(null); USER = null; location.hash = ""; authScreen(() => { shell(); route(); }); }

/* ---------- sign in / request access ---------- */
const SELL = [
  ["academy", "Learn", "The free Erasmus+ microcourse and the full syllabus of every eMove course."],
  ["book", "Classroom resources", "Ready-to-use activities, routines and templates for every stage."],
  ["chat", "Community", "Discussion spaces and a directory to find colleagues and project partners."],
  ["cert", "Certificate", "Finish the microcourse and download your certificate of completion."]
];
function authScreen(next, notice) {
  document.body.innerHTML = `<div class="auth"><section class="auth-side">
      <a href="/" class="brand">${LOGO}</a>
      <h1>Free Erasmus+ training and classroom resources for European teachers.</h1>
      <ul class="sell">${SELL.map(([i, t, d]) => `<li>${icon(i)}<div><b>${t}</b><span>${d}</span></div></li>`).join("")}</ul>
      <p class="small">By <a href="${EMOVE_SITE}" target="_blank" rel="noopener">eMove Academy</a> · A European Teacher Academy</p>
    </section>
    <section class="auth-main"><div class="card auth-card" id="authCard"></div></section></div>`;
  const card = $("#authCard");
  const tabs = mode => `<div class="tabs"><button data-m="in" class="${mode === "in" ? "on" : ""}">Sign in</button><button data-m="up" class="${mode === "up" ? "on" : ""}">Request access</button></div>`;
  const NOTICE = {
    pending: ["Your request is waiting for approval", "The eMove team reviews every request. Try signing in again once it has been approved."],
    rejected: ["Your request was not approved", `If you think this is a mistake, write to ${EMOVE_MAIL}.`],
    expired: ["Your session has ended", "Please sign in again."]
  };
  const noteHTML = n => NOTICE[n] ? `<div class="notice ${n}"><b>${NOTICE[n][0]}</b><span>${esc(NOTICE[n][1])}</span></div>` : "";
  const signIn = (n) => {
    card.innerHTML = tabs("in") + noteHTML(n) + `<form id="f" class="form" novalidate>
      <label>Email<input name="email" type="email" autocomplete="email" required></label>
      <label>Password<input name="password" type="password" autocomplete="current-password" required></label>
      <p class="err" id="err"></p>
      <button class="btn primary wide">Sign in</button>
      <p class="small center">Forgot your password? Write to <a href="mailto:${EMOVE_MAIL}">${EMOVE_MAIL}</a> and we will reset it.</p></form>`;
    bindTabs();
    $("#f").onsubmit = async e => {
      e.preventDefault(); const f = new FormData(e.target), b = $("button.primary", card); b.disabled = true; $("#err").textContent = "";
      const r = await api("login", { email: f.get("email"), password: f.get("password") }); b.disabled = false;
      if (r.ok) { authSave({ token: r.data.token, user: r.data.user }); adoptUser(r.data.user); await syncPull(); next(); adminPoll(); return; }
      if (r.status === 403) return signIn(r.data.status);
      $("#err").textContent = r.data.message || "Something went wrong.";
    };
  };
  const requestAccess = () => {
    card.innerHTML = tabs("up") + `<p class="muted">Access is free. Tell us a little about you; the eMove team approves every account.</p>
      <form id="f" class="form" novalidate>
      <label>Full name<input name="name" autocomplete="name" required></label>
      <label>Email<input name="email" type="email" autocomplete="email" required></label>
      <div class="two"><label>School or organisation<input name="school" required></label>
      <label>Country<select name="country" required><option value="">Choose…</option>${COUNTRIES.map(c => `<option>${c}</option>`).join("")}</select></label></div>
      <div class="two"><label>Your role<select name="role">${ROLES.map(([k, t]) => `<option value="${k}">${t}</option>`).join("")}</select></label>
      <label>Stage you teach<select name="stage"><option value="">Choose…</option>${STAGES.map(s => `<option>${s}</option>`).join("")}</select></label></div>
      <label><span>Subject or area <span class="optional">optional</span></span><input name="subject"></label>
      <fieldset><legend>What interests you most? <span class="optional">optional</span></legend><div class="checks">${PATHWAYS.map(p => `<label class="check"><input type="checkbox" name="interests" value="${p.id}"><span>${p.name}</span></label>`).join("")}</div></fieldset>
      <label>Password<input name="password" type="password" minlength="8" autocomplete="new-password" required><small>At least 8 characters.</small></label>
      <label class="hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
      <label class="check"><input type="checkbox" name="accept" required><span>I accept the <a href="/privacy/" target="_blank">privacy notice</a>: eMove Academy uses my details to manage my access.</span></label>
      <label class="check"><input type="checkbox" name="news"><span>I would like to receive news about Erasmus+ deadlines and eMove courses.</span></label>
      <p class="err" id="err"></p>
      <button class="btn primary wide">Request access</button></form>`;
    bindTabs();
    $("#f").onsubmit = async e => {
      e.preventDefault(); const f = new FormData(e.target), b = $("button.primary", card); b.disabled = true; $("#err").textContent = "";
      const body = Object.fromEntries(["name", "email", "school", "country", "role", "stage", "subject", "password", "website"].map(k => [k, f.get(k) || ""]));
      Object.assign(body, { interests: f.getAll("interests"), accept: !!f.get("accept"), news: !!f.get("news") });
      const r = await api("register", body); b.disabled = false;
      if (!r.ok) { $("#err").textContent = r.data.message || "Something went wrong."; return; }
      if (r.data.status === "approved") { const l = await api("login", { email: body.email, password: body.password }); if (l.ok) { authSave({ token: l.data.token, user: l.data.user }); adoptUser(l.data.user); next(); adminPoll(); return; } }
      card.innerHTML = `<div class="done-box">${icon("check", "big ok")}<h2>Thank you, ${esc(body.name.split(" ")[0])}!</h2>
        <p>Your request is with the eMove team. As soon as it is approved you can sign in with your email and password.</p>
        <p class="muted small">Meanwhile, read our free <a href="/guides/">Erasmus+ guides</a>.</p>
        <button class="btn" id="toIn">Back to sign in</button></div>`;
      $("#toIn").onclick = () => signIn();
    };
  };
  function bindTabs() { $$(".tabs button", card).forEach(b => b.onclick = () => b.dataset.m === "in" ? signIn() : requestAccess()); }
  location.hash.includes("request") ? requestAccess() : signIn(notice);
}

/* ---------- sync between devices ---------- */
function mergeState(a, b) {
  if (!b) return a;
  const m = Object.assign(freshState(), a);
  m.xp = Math.max(a.xp || 0, b.xp || 0);
  for (const k of ["done", "units", "clicks", "syl"]) m[k] = Object.assign({}, b[k] || {}, a[k] || {});
  m.notes = Object.assign({}, b.notes || {}); for (const [k, v] of Object.entries(a.notes || {})) if (v) m.notes[k] = v;
  m.favs = [...new Set([...(a.favs || []), ...(b.favs || [])])];
  m.days = [...new Set([...(a.days || []), ...(b.days || [])])].sort();
  m.quiz = [a.quiz, b.quiz].filter(Boolean).sort((x, y) => y.score - x.score)[0] || null;
  const certs = {}; for (const c of [...(b.certs || []), ...(a.certs || [])]) certs[c.id] = c; m.certs = Object.values(certs);
  const seen = new Set(); m.log = [...(a.log || []), ...(b.log || [])].filter(x => { const k = x.t + x.d; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 40);
  return m;
}
function setRev(r) { REV = r; try { localStorage.setItem(KEY + ":rev:" + S.owner, String(r)); } catch (e) { } }
async function syncPull() {
  if (PREVIEW || !AUTH) return;
  const r = await api("data"); if (!r.ok) return;
  if (r.data.state) { const owner = S.owner; S = mergeState(S, r.data.state); S.owner = owner; save(false); }
  setRev(r.data.rev || 0);
  if (!r.data.state || JSON.stringify(r.data.state) !== JSON.stringify(S)) syncPush(true);
  if ($("#view")) route();
}
let syncT = null;
function syncPush(now) {
  if (PREVIEW || !AUTH) return;
  clearTimeout(syncT);
  syncT = setTimeout(async () => {
    const r = await api("data", { base: REV, state: S }, "PUT");
    if (r.ok) return setRev(r.data.rev);
    if (r.status === 409) { const owner = S.owner; S = mergeState(S, r.data.state); S.owner = owner; save(false); setRev(r.data.rev); const r2 = await api("data", { base: REV, state: S }, "PUT"); if (r2.ok) setRev(r2.data.rev); }
  }, now ? 0 : 1500);
}

/* ---------- super-admin ---------- */
async function adminPoll() {
  if (!USER || !USER.admin) return;
  const r = await api("admin/users"); if (!r.ok) return;
  const n = r.data.users.filter(u => u.status === "pending").length;
  const el = $("#pend"); if (el) el.textContent = n ? n : "";
}
const ROLE_NAME = Object.fromEntries(ROLES);
const fmtDate = s => s ? new Date(s).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "–";
ROUTES.admin = async (v) => {
  if (!USER.admin) return go("home");
  v.innerHTML = `<div class="page-h"><h1>${icon("shield")} Super-admin</h1><p class="muted">Approve teachers, see their progress and export contacts.</p></div><div id="adm"><p class="muted">Loading…</p></div>`;
  const r = await api("admin/users");
  if (!r.ok) { $("#adm").innerHTML = `<p class="err">${esc(r.data.message || "Could not load users.")}</p>`; return; }
  let users = r.data.users, tab = users.some(u => u.status === "pending") ? "pending" : "approved", q = "";
  const draw = () => {
    const count = s => users.filter(u => s === "all" || u.status === s).length;
    const list = users.filter(u => (tab === "all" || u.status === tab) && (!q || JSON.stringify(u).toLowerCase().includes(q)));
    $("#adm").innerHTML = `<div class="stats">
        <div class="stat"><b>${users.length}</b><span>accounts</span></div>
        <div class="stat"><b>${count("pending")}</b><span>waiting for approval</span></div>
        <div class="stat"><b>${users.filter(u => u.progress && u.progress.units).length}</b><span>started the microcourse</span></div>
        <div class="stat"><b>${users.filter(u => u.progress && u.progress.clicks).length}</b><span>opened an eMove course</span></div>
        <div class="stat"><b>${users.filter(u => u.news).length}</b><span>accept news</span></div></div>
      <div class="adm-bar"><div class="tabs">${[["pending", "Pending"], ["approved", "Approved"], ["rejected", "Rejected"], ["all", "All"]].map(([k, t]) => `<button data-t="${k}" class="${tab === k ? "on" : ""}">${t} <em>${count(k)}</em></button>`).join("")}</div>
      <label class="search">${icon("search")}<input id="q" placeholder="Search name, school, country…" value="${esc(q)}"></label>
      <button class="btn" id="csv">${icon("download")} Export CSV</button></div>
      <div class="users">${list.length ? list.map(u => `<article class="card user ${u.status}" data-e="${esc(u.email)}">
        <div class="user-h"><div><b>${esc(u.name)}</b> ${u.admin ? chip("super-admin", "#101C38") : ""}<span class="muted">${esc(u.email)}</span></div><span class="status ${u.status}">${u.status}</span></div>
        <dl><div><dt>School</dt><dd>${esc(u.school)}</dd></div><div><dt>Country</dt><dd>${esc(u.country)}</dd></div><div><dt>Role</dt><dd>${esc(ROLE_NAME[u.role] || u.role)}</dd></div><div><dt>Stage</dt><dd>${esc(u.stage || "–")}${u.subject ? " · " + esc(u.subject) : ""}</dd></div>
        <div><dt>Interests</dt><dd>${(u.interests || []).map(i => esc(pathwayById(i).name)).join(", ") || "–"}</dd></div><div><dt>News</dt><dd>${u.news ? "Yes" : "No"}</dd></div>
        <div><dt>Community</dt><dd>${u.directory ? "In the directory" : "Not in the directory"}${(u.going || []).length ? " · interested in " + u.going.map(id => esc((courseById(id) || {}).title || id)).join(", ") : ""}</dd></div>
        <div><dt>Requested</dt><dd>${fmtDate(u.created)}</dd></div><div><dt>Last sign-in</dt><dd>${fmtDate(u.lastLogin)}</dd></div>
        <div><dt>Progress</dt><dd>${u.progress ? `${u.progress.units}/${u.progress.of} units · ${u.progress.xp} XP${u.progress.quiz ? ` · quiz ${u.progress.quiz.score}/${u.progress.quiz.of}` : ""}${u.progress.clicks ? ` · opened ${u.progress.clicks} eMove course${u.progress.clicks > 1 ? "s" : ""}` : ""}` : "Not started"}</dd></div></dl>
        <div class="row gap">${u.status !== "approved" ? `<button class="btn primary sm" data-a="approve">${icon("check")} Approve</button>` : ""}${u.status !== "rejected" && !u.admin ? `<button class="btn sm" data-a="reject">Reject</button>` : ""}
        ${u.status === "approved" ? `<button class="btn sm" data-a="reset">Reset password</button>` : ""}${!u.admin ? `<button class="btn sm danger" data-a="delete">Delete</button>` : ""}</div></article>`).join("") : `<p class="muted empty">No accounts here.</p>`}</div>`;
    $$("[data-t]").forEach(b => b.onclick = () => { tab = b.dataset.t; draw(); });
    const qi = $("#q"); qi.oninput = () => { q = qi.value.toLowerCase(); const pos = qi.selectionStart; draw(); const n = $("#q"); n.focus(); n.setSelectionRange(pos, pos); };
    $("#csv").onclick = () => exportCSV(list);
    $$("[data-a]").forEach(b => b.onclick = async () => {
      const email = b.closest("[data-e]").dataset.e, a = b.dataset.a;
      if (a === "delete" && !confirm(`Delete ${email} and all their progress? This cannot be undone.`)) return;
      if (a === "reset" && !confirm(`Create a temporary password for ${email}?`)) return;
      b.disabled = true;
      const r = await api("admin/user", { email, action: a });
      if (!r.ok) { toast(r.data.message || "Could not do that."); b.disabled = false; return; }
      if (a === "delete") users = users.filter(u => u.email !== email);
      else users = users.map(u => u.email === email ? Object.assign(u, r.data.user) : u);
      if (a === "reset") sheet(`<h2>Temporary password</h2><p>Send this password to <b>${esc(email)}</b>. They can change it in their profile.</p><p class="temp">${esc(r.data.temp)}</p>`);
      else toast(a === "approve" ? "Approved. Let them know they can sign in." : a === "reject" ? "Request rejected." : "Deleted.");
      draw(); adminPoll();
    });
  };
  draw();
};
function exportCSV(list) {
  const cols = [["name", "Name"], ["email", "Email"], ["school", "School"], ["country", "Country"], ["role", "Role"], ["stage", "Stage"], ["subject", "Subject"], ["interests", "Interests"], ["news", "Accepts news"], ["status", "Status"], ["created", "Requested"], ["units", "Units done"], ["quiz", "Quiz"], ["courses", "eMove courses opened"]];
  const val = (u, k) => k === "interests" ? (u.interests || []).map(i => pathwayById(i).name).join("; ") : k === "news" ? (u.news ? "yes" : "no") : k === "role" ? ROLE_NAME[u.role] || u.role
    : k === "units" ? (u.progress ? u.progress.units : 0) : k === "quiz" ? (u.progress && u.progress.quiz ? `${u.progress.quiz.score}/${u.progress.quiz.of}` : "") : k === "courses" ? (u.progress ? u.progress.clicks : 0) : u[k] || "";
  const cell = x => `"${String(x).replace(/"/g, '""')}"`;
  const csv = [cols.map(c => cell(c[1])).join(","), ...list.map(u => cols.map(([k]) => cell(val(u, k))).join(","))].join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv" })); a.download = `emove-profe-teachers-${todayISO()}.csv`; a.click();
}
