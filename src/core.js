/* ============================================================
   EMOVE Profe · core: helpers, icons, state, shell and router
   ============================================================ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
/* **bold** in content strings */
const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
const todayISO = () => new Date().toISOString().slice(0, 10);
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

/* ---------- icons (stroke 1.8) ---------- */
const IC = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-5h4v5"/>',
  academy: '<path d="M2 9.5 12 5l10 4.5-10 4.5z"/><path d="M6 11.5V16c0 1.2 2.7 3 6 3s6-1.8 6-3v-4.5"/><path d="M22 9.5V15"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/><path d="M8 7h7"/>',
  open: '<path d="M2 5c3-1 6-1 10 1 4-2 7-2 10-1v14c-3-1-6-1-10 1-4-2-7-2-10-1z"/><path d="M12 6v14"/>',
  plane: '<path d="M21 15.5 13.5 11V5a1.5 1.5 0 0 0-3 0v6L3 15.5V17l7.5-2.2V19L8 20.5V22l4-1 4 1v-1.5L13.5 19v-4.2L21 17z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  shield: '<path d="M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6z"/><path d="m9 12 2 2 4-4"/>',
  stars: '<circle cx="12" cy="12" r="9"/><path d="m12 7.5 1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M16 14.5h2"/><path d="M6 6V5a2 2 0 0 1 2-2h9"/>',
  route: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h8a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h8"/>',
  heart: '<path d="M12 20s-7.5-4.5-7.5-10A4.3 4.3 0 0 1 12 7.5 4.3 4.3 0 0 1 19.5 10C19.5 15.5 12 20 12 20z"/>',
  leaf: '<path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15"/><path d="M5 19 13 11"/>',
  hands: '<circle cx="8" cy="6" r="2.5"/><circle cx="16" cy="6" r="2.5"/><path d="M3.5 20c0-4 2-7 4.5-7s3.5 1.5 4 3c.5-1.5 1.5-3 4-3s4.5 3 4.5 7"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="m6 6 2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  teacher: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/><path d="m7 12 3-3 2 2 4-4"/>',
  school: '<path d="M3 21h18M5 21V10l7-5 7 5v11"/><path d="M10 21v-5h4v5"/><path d="M12 5V2.5h3"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  print: '<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M15 5 8 12l7 7"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  logout: '<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
  note: '<path d="M5 3h10l4 4v14H5z"/><path d="M15 3v4h4M8 12h8M8 16h5"/>',
  cert: '<rect x="3" y="4" width="18" height="13" rx="1.5"/><circle cx="16" cy="15" r="3"/><path d="M14.5 17.5 14 21l2-1 2 1-.5-3.5M7 8h8M7 11h5"/>',
  quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6"/><circle cx="12" cy="17" r=".6" fill="currentColor"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="9" r="2.5"/><path d="M3 19c.8-3 3-5 6-5s5.2 2 6 5"/><path d="M15 14.5c2.5 0 4.5 1.5 5.5 4"/>',
  download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  pin: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
  send: '<path d="M21 3 10 14"/><path d="m21 3-7 18-4-7-7-4z"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  toolbox: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V5h8v3M3 13h18M10 13v2h4v-2"/>'
};
const icon = (k, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k] || ""}</svg>`;
/* brand mark: EU-blue disc, ring of stars and the yellow forward arrow */
const MARK_SVG = '<circle cx="32" cy="32" r="31" fill="#1965B8"/><polygon points="56.0,28.9 56.8,30.9 58.9,31.0 57.2,32.4 57.8,34.5 56.0,33.3 54.2,34.5 54.8,32.4 53.1,31.0 55.2,30.9" fill="#FFCA05"/><polygon points="52.8,40.9 53.5,42.9 55.7,43.0 54.0,44.4 54.6,46.5 52.8,45.3 51.0,46.5 51.5,44.4 49.8,43.0 52.0,42.9" fill="#FFCA05"/><polygon points="44.0,49.7 44.8,51.7 46.9,51.8 45.2,53.2 45.8,55.3 44.0,54.1 42.2,55.3 42.8,53.2 41.1,51.8 43.2,51.7" fill="#FFCA05"/><polygon points="32.0,52.9 32.8,54.9 34.9,55.0 33.2,56.4 33.8,58.5 32.0,57.3 30.2,58.5 30.8,56.4 29.1,55.0 31.2,54.9" fill="#FFCA05"/><polygon points="20.0,49.7 20.8,51.7 22.9,51.8 21.2,53.2 21.8,55.3 20.0,54.1 18.2,55.3 18.8,53.2 17.1,51.8 19.2,51.7" fill="#FFCA05"/><polygon points="11.2,40.9 12.0,42.9 14.2,43.0 12.5,44.4 13.0,46.5 11.2,45.3 9.4,46.5 10.0,44.4 8.3,43.0 10.5,42.9" fill="#FFCA05"/><polygon points="8.0,28.9 8.8,30.9 10.9,31.0 9.2,32.4 9.8,34.5 8.0,33.3 6.2,34.5 6.8,32.4 5.1,31.0 7.2,30.9" fill="#FFCA05"/><polygon points="11.2,16.9 12.0,18.9 14.2,19.0 12.5,20.4 13.0,22.5 11.2,21.3 9.4,22.5 10.0,20.4 8.3,19.0 10.5,18.9" fill="#FFCA05"/><polygon points="20.0,8.1 20.8,10.2 22.9,10.3 21.2,11.6 21.8,13.7 20.0,12.5 18.2,13.7 18.8,11.6 17.1,10.3 19.2,10.2" fill="#FFCA05"/><polygon points="32.0,4.9 32.8,6.9 34.9,7.0 33.2,8.4 33.8,10.5 32.0,9.3 30.2,10.5 30.8,8.4 29.1,7.0 31.2,6.9" fill="#FFCA05"/><polygon points="44.0,8.1 44.8,10.2 46.9,10.3 45.2,11.6 45.8,13.7 44.0,12.5 42.2,13.7 42.8,11.6 41.1,10.3 43.2,10.2" fill="#FFCA05"/><polygon points="52.8,16.9 53.5,18.9 55.7,19.0 54.0,20.4 54.6,22.5 52.8,21.3 51.0,22.5 51.5,20.4 49.8,19.0 52.0,18.9" fill="#FFCA05"/><circle cx="32" cy="32" r="15.5" fill="#FFCA05"/><path d="M23.5 39.5c0-6.5 4-10.5 10.5-10.5h3" fill="none" stroke="#1965B8" stroke-width="5" stroke-linecap="round"/><path d="M35.5 21.5 45 29l-9.5 7.5z" fill="#1965B8" stroke="#1965B8" stroke-width="2" stroke-linejoin="round"/>';
const MARK = (s = 34) => `<svg class="mark" width="${s}" height="${s}" viewBox="0 0 64 64" aria-hidden="true">${MARK_SVG}</svg>`;
const LOGO = `<span class="logo">${MARK(34)}<span class="logo-t"><b>EMOVE</b> Profe</span></span>`;

/* ---------- state (per device, synced to the account) ---------- */
const KEY = "emove-profe-v1";
const freshState = () => ({ xp: 0, done: {}, units: {}, notes: {}, favs: [], quiz: null, certs: [], clicks: {}, syl: {}, days: [], log: [] });
let S = (() => { try { return Object.assign(freshState(), JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { return freshState(); } })();
let USER = null;      // signed-in account (from the server)
function summary() {
  const c = COURSES[0];
  return { xp: S.xp, units: c.units.filter(u => S.units[u.id]).length, of: c.units.length, quiz: S.quiz, certs: S.certs.length, favs: S.favs.length, clicks: Object.keys(S.clicks).length, syl: Object.keys(S.syl || {}).length, last: todayISO() };
}
function save(sync = true) {
  S.summary = summary();
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { }
  if (sync && typeof syncPush === "function") syncPush();
}
function logAct(t) { S.log.unshift({ t, d: todayISO() }); S.log = S.log.slice(0, 40); }
function addXP(n, why) {
  S.xp += n;
  if (!S.days.includes(todayISO())) S.days.push(todayISO());
  if (why) logAct(why);
  save();
}
const level = () => { const xp = S.xp; const lv = xp < 60 ? 1 : xp < 160 ? 2 : xp < 320 ? 3 : xp < 520 ? 4 : 5; return { lv, name: ["Explorer", "Planner", "Applicant", "Mobility pro", "Erasmus+ champion"][lv - 1], next: [60, 160, 320, 520, null][lv - 1] }; };

/* ---------- UI helpers ---------- */
function toast(msg) {
  let t = $("#toast"); if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
  t.textContent = msg; t.className = "show"; clearTimeout(t._h); t._h = setTimeout(() => t.className = "", 2600);
}
function sheet(html, cls = "") {
  closeSheet();
  const d = document.createElement("div"); d.className = "sheet-bg"; d.innerHTML = `<div class="sheet ${cls}" role="dialog" aria-modal="true"><button class="x" aria-label="Close">${icon("close")}</button>${html}</div>`;
  d.addEventListener("click", e => { if (e.target === d || e.target.closest(".x")) closeSheet(); });
  document.body.appendChild(d); return d.querySelector(".sheet");
}
function closeSheet() { $$(".sheet-bg").forEach(x => x.remove()); }
const chip = (t, color) => `<span class="chip" ${color ? `style="--c:${color}"` : ""}>${esc(t)}</span>`;
const ring = (p, s = 64, label = "") => { const r = (s - 8) / 2, c = 2 * Math.PI * r; return `<svg class="ring" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><circle cx="${s / 2}" cy="${s / 2}" r="${r}" class="ring-bg"/><circle cx="${s / 2}" cy="${s / 2}" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p)}" transform="rotate(-90 ${s / 2} ${s / 2})"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`; };

/* course recommendation: courses of the pathway, or the offer for schools */
function courseCTA(pid, why) {
  const list = coursesFor(pid), p = pathwayById(pid);
  const items = list.length ? list : [FOR_SCHOOLS];
  return `<div class="cta-course" style="--c:${p.color}"><div class="cta-k">${icon("plane")} Go further with eMove · ${esc(p.name)}</div>${why ? `<p class="muted">${esc(why)}</p>` : ""}
    ${items.map(c => `<a class="cta-item" href="${c.url}" target="_blank" rel="noopener" data-course="${esc(c.id || "schools")}"><div><b>${esc(c.title)}</b><span>${esc(c.sub)}</span>${c.city ? `<small>${icon("pin")} ${esc(c.city)} · ${esc(c.dates)} · ${esc(c.price)} · Erasmus+ compatible</small>` : ""}</div>${icon("external")}</a>`).join("")}</div>`;
}
/* interest in courses is recorded so the super-admin can see who to contact */
document.addEventListener("click", e => {
  const a = e.target.closest("[data-course]"); if (!a) return;
  S.clicks[a.dataset.course] = todayISO(); logAct("Opened eMove course: " + (courseById(a.dataset.course) || FOR_SCHOOLS).title); save();
});

/* ---------- shell and router ---------- */
const NAV = [["home", "Home", "home"], ["learn", "Learn", "academy"], ["resources", "Resources", "book"], ["community", "Community", "chat"], ["profile", "Profile", "user"]];
/* which tab of the menu each page belongs to */
const NAV_OF = { academy: "learn", unit: "learn", lesson: "learn", quiz: "learn", glossary: "learn", cert: "learn", course: "learn", courses: "learn", res: "resources", space: "community", thread: "community", members: "community" };
function shell() {
  document.body.innerHTML = `<header class="top"><a href="#home" class="brand" aria-label="EMOVE Profe home">${LOGO}</a>
    <nav class="nav">${NAV.map(([k, t, i]) => `<a href="#${k}" data-nav="${k}">${icon(i)}<span>${t}</span></a>`).join("")}${USER && USER.admin ? `<a href="#admin" data-nav="admin">${icon("shield")}<span>Admin</span><em id="pend"></em></a>` : ""}</nav></header>
    <main id="view"></main>
    <footer class="foot"><span>EMOVE Profe · free training for European teachers by <a href="${EMOVE_SITE}" target="_blank" rel="noopener">eMove Academy</a></span><span>Born in Spain. Built for Europe.</span></footer>`;
}
const ROUTES = {};
function route() {
  const h = (location.hash || "#home").slice(1).split("/");
  const fn = ROUTES[h[0]] || ROUTES.home;
  $$("[data-nav]").forEach(a => a.classList.toggle("on", a.dataset.nav === (NAV_OF[h[0]] || h[0])));
  const v = $("#view"); v.innerHTML = ""; v.className = "view v-" + h[0];
  fn(v, h.slice(1));
  window.scrollTo(0, 0);
}
const go = h => { if (location.hash === "#" + h) route(); else location.hash = h; };
window.addEventListener("hashchange", () => { closeSheet(); if (USER) route(); });

function start() {
  accountsBoot(() => { shell(); route(); });
}
