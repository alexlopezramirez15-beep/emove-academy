/* ============ COMMUNITY: discussion spaces, threads and the teacher directory ============ */
const ago = s => {
  const m = Math.round((Date.now() - new Date(s)) / 6e4);
  return m < 1 ? "just now" : m < 60 ? m + " min ago" : m < 1440 ? Math.round(m / 60) + " h ago" : m < 10080 ? Math.round(m / 1440) + " d ago" : new Date(s).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};
const avatar = name => { const parts = String(name || "?").trim().split(/\s+/), hue = [...String(name)].reduce((a, ch) => a + ch.charCodeAt(0), 0) % 360; return `<span class="avatar" style="--h:${hue}">${esc((parts[0][0] || "?") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase()}</span>`; };
/* messages are plain text: escaped, line breaks kept and links made clickable */
const postHTML = t => esc(t).replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g, '<a href="$1" target="_blank" rel="noopener nofollow ugc">$1</a>').replace(/\n/g, "<br>");
const byLine = by => `${esc(by.name)}${by.admin ? ` <span class="team">eMove team</span>` : ""}${by.country ? ` · ${esc(by.country)}` : ""}`;
const offline = el => { el.innerHTML = `<section class="card notice-card">${icon("chat", "big")}<div><h3>The community opens when you sign in</h3><p class="muted">Discussion spaces and the teacher directory need an account. This copy is running in preview mode.</p></div></section>`; };

/* list of the discussions of one space, with a button to start a new one */
async function forumBlock(el, sid) {
  const sp = spaceById(sid);
  if (PREVIEW) return offline(el);
  el.innerHTML = `<div class="forum-h"><div><h2>${icon("chat")} Discussions</h2><p class="muted small">${esc(sp.line)}</p></div><button class="btn primary" id="newt">${icon("plus")} New discussion</button></div><div id="tl"><p class="muted">Loading…</p></div>`;
  $("#newt", el).onclick = () => newThread(sid);
  const r = await api("forum?space=" + encodeURIComponent(sid));
  const tl = $("#tl", el); if (!tl) return;
  if (!r.ok) { tl.innerHTML = `<p class="err">${esc(r.data.message || "Could not load the discussions.")}</p>`; return; }
  tl.innerHTML = r.data.threads.length ? `<ul class="threads">${r.data.threads.map(t => `<li><a href="#thread/${t.id}" class="thread-row">${avatar(t.by.name)}<div class="grow"><b>${t.pin ? `${icon("flag")} ` : ""}${esc(t.title)}</b><p class="muted">${esc(t.excerpt)}</p><small>${byLine(t.by)} · ${ago(t.at)}</small></div><span class="replies">${icon("chat")} ${t.n}</span></a></li>`).join("")}</ul>`
    : `<div class="empty-forum">${icon("chat", "big")}<p><b>No discussions yet.</b><br>Start the first one: ask a question, share an idea or introduce yourself.</p></div>`;
}
function newThread(sid) {
  const sp = spaceById(sid);
  const s = sheet(`<h2>New discussion</h2><p class="muted small">${icon(sp.icon)} ${esc(sp.name)}. Everyone with an approved account can read it.</p>
    <form class="form" id="nt"><label>Title<input name="title" maxlength="140" required placeholder="${sid === "partners" ? "Primary school in Lyon looking for an eTwinning partner" : sid === "erasmus" ? "How many participants can a KA122 project have?" : "What is your question or idea?"}"></label>
    <label>Message<textarea name="body" rows="6" maxlength="5000" required placeholder="Give enough context so others can help: your stage, subject, country…"></textarea></label>
    <p class="muted small">Be kind and don't share students' personal data.</p><p class="err" id="nte"></p><button class="btn primary">${icon("send")} Publish</button></form>`);
  $("#nt", s).onsubmit = async e => {
    e.preventDefault(); const f = new FormData(e.target), b = $("button", e.target); b.disabled = true;
    const r = await api("forum/thread", { space: sid, title: f.get("title"), body: f.get("body") });
    if (!r.ok) { $("#nte", s).textContent = r.data.message || "Could not publish."; b.disabled = false; return; }
    closeSheet(); if (!S.done["post-first"]) { S.done["post-first"] = { d: todayISO() }; addXP(15, "Started a discussion"); }
    go("thread/" + r.data.id);
  };
}

ROUTES.community = async v => {
  v.innerHTML = `<div class="page-h"><h1>${icon("chat")} Community</h1><p class="muted">Ask, share and find colleagues and partners from all over Europe.</p></div>
    <div class="grid2 comm-top"><a class="card comm-dir" href="#members">${icon("users", "big")}<div><b>Teacher directory</b><span class="muted">Find teachers by country, subject or what they are looking for: project partners, eTwinning, job shadowing.</span></div>${icon("arrow")}</a>
    <section class="card"><h3>${icon("bolt")} Latest activity</h3><div id="recent"><p class="muted">Loading…</p></div></section></div>
    <h2 class="sec-t">Discussion spaces</h2><div class="spaces">${SPACES.filter(s => !s.course).map(spaceCard).join("")}</div>
    <h2 class="sec-t">Course spaces</h2><p class="muted">Prepare your mobility and meet the teachers going to the same eMove course.</p><div class="spaces">${SPACES.filter(s => s.course).map(spaceCard).join("")}</div>`;
  if (PREVIEW) { $("#recent").innerHTML = `<p class="muted">Available when you sign in.</p>`; return; }
  const [rc, cn] = await Promise.all([api("forum/recent"), api("forum/counts")]);
  if ($("#recent")) $("#recent").innerHTML = rc.ok && rc.data.items.length ? recentList(rc.data.items.slice(0, 5)) : `<p class="muted">${rc.ok ? "Nothing yet. Start the first discussion!" : esc(rc.data.message || "Could not load.")}</p>`;
  if (cn.ok) for (const [k, x] of Object.entries(cn.data.counts)) { const el = $(`[data-space-n="${k}"]`); if (el) el.textContent = x.threads ? `${x.threads} discussion${x.threads > 1 ? "s" : ""} · ${ago(x.last)}` : "No discussions yet"; }
};
const spaceCard = s => { const c = s.course && courseById(s.course), col = c ? pathwayById(c.pathway).color : "#1965B8"; return `<a class="card space" href="#space/${s.id}" style="--c:${col}">${icon(s.icon)}<div class="grow"><b>${esc(s.name)}</b><span class="muted">${esc(c ? c.sub : s.line)}</span><small data-space-n="${s.id}"></small></div>${icon("arrow")}</a>`; };
const recentList = items => `<ul class="recent">${items.map(x => `<li><a href="#thread/${x.id}">${avatar(x.name)}<div><span><b>${esc(x.name)}</b> ${x.kind === "thread" ? "started" : "replied to"} <b>${esc(x.title)}</b></span><small>${esc((spaceById(x.space) || {}).name || "")} · ${ago(x.at)}</small></div></a></li>`).join("")}</ul>`;

ROUTES.space = (v, [sid]) => {
  const sp = spaceById(sid); if (!sp) return go("community");
  const c = sp.course && courseById(sp.course);
  v.innerHTML = `<a class="back" href="#community">${icon("back")} Community</a><div class="page-h"><h1>${icon(sp.icon)} ${esc(sp.name)}</h1><p class="muted">${esc(sp.line)}</p>${c ? `<a class="link" href="#course/${c.id}">Syllabus and resources of ${esc(c.title)} ${icon("arrow")}</a>` : ""}</div><div id="forum"></div>`;
  forumBlock($("#forum"), sid);
};

ROUTES.thread = async (v, [tid]) => {
  if (PREVIEW) return offline(v);
  v.innerHTML = `<p class="muted">Loading…</p>`;
  const r = await api("forum/thread?id=" + encodeURIComponent(tid));
  if (!r.ok) { v.innerHTML = `<a class="back" href="#community">${icon("back")} Community</a><p class="err">${esc(r.data.message || "Could not load this discussion.")}</p>`; return; }
  const t = r.data.thread, mod = r.data.mod, sp = spaceById(t.space) || { name: "Community", icon: "chat" };
  const back = sp.course ? `#course/${sp.course}/community` : `#space/${t.space}`;
  v.innerHTML = `<a class="back" href="${back}">${icon("back")} ${esc(sp.name)}</a>
    <div class="page-h"><h1>${t.pin ? icon("flag") + " " : ""}${esc(t.title)}</h1><p class="muted small">${icon(sp.icon)} ${esc(sp.name)} · ${t.posts.length - 1} repl${t.posts.length === 2 ? "y" : "ies"}</p></div>
    <ol class="posts">${t.posts.map((p, i) => `<li class="card post ${i === 0 ? "op" : ""}" id="${p.id}">${avatar(p.by.name)}<div class="grow"><div class="post-h"><span><b>${byLine(p.by)}</b>${p.by.school ? `<small class="muted"> · ${esc(p.by.school)}</small>` : ""}</span><small class="muted">${ago(p.at)}</small></div>
      <div class="post-b">${postHTML(p.body)}</div>${p.by.mine || mod ? `<div class="post-a">${mod && i === 0 ? `<button class="link" data-pin>${icon("flag")} ${t.pin ? "Unpin" : "Pin"}</button>` : ""}<button class="link danger" data-del="${p.id}">${icon("trash")} Delete</button></div>` : ""}</div></li>`).join("")}</ol>
    <section class="card reply"><h3>Reply</h3><form class="form" id="rp"><textarea name="body" rows="4" maxlength="5000" required placeholder="Write your reply…"></textarea><p class="err" id="rpe"></p><button class="btn primary">${icon("send")} Send reply</button></form></section>`;
  $("#rp").onsubmit = async e => {
    e.preventDefault(); const b = $("button", e.target); b.disabled = true;
    const r2 = await api("forum/reply", { id: t.id, body: new FormData(e.target).get("body") });
    if (!r2.ok) { $("#rpe").textContent = r2.data.message || "Could not send."; b.disabled = false; return; }
    if (!S.done["reply-first"]) { S.done["reply-first"] = { d: todayISO() }; addXP(10, "Replied in the community"); }
    route();
  };
  $$("[data-del]").forEach(b => b.onclick = async () => {
    const op = b.dataset.del === "p0";
    if (!confirm(op ? "Delete this discussion?" : "Delete this message?")) return;
    const r2 = await api("forum/delete", { id: t.id, post: b.dataset.del });
    if (!r2.ok) return toast(r2.data.message || "Could not delete.");
    toast("Deleted"); op ? (location.hash = back) : route();
  });
  const pin = $("[data-pin]"); if (pin) pin.onclick = async () => { const r2 = await api("forum/pin", { id: t.id }); r2.ok ? route() : toast(r2.data.message || "Could not do that."); };
};

/* ---------- teacher directory ---------- */
let DIR_F = { q: "", country: "", looking: "", course: "" };
ROUTES.members = async v => {
  v.innerHTML = `<a class="back" href="#community">${icon("back")} Community</a><div class="page-h"><h1>${icon("users")} Teacher directory</h1><p class="muted">Teachers who chose to appear here. Find colleagues for Erasmus+ projects, eTwinning or job shadowing.</p></div><div id="dir"><p class="muted">Loading…</p></div>`;
  if (PREVIEW) return offline($("#dir"));
  const r = await api("members");
  if (!r.ok) { $("#dir").innerHTML = `<p class="err">${esc(r.data.message || "Could not load the directory.")}</p>`; return; }
  const all = r.data.members;
  $("#dir").innerHTML = `${USER.directory ? "" : `<section class="card join-dir">${icon("user", "big")}<div class="grow"><h3>You're not in the directory yet</h3><p class="muted">Add a short presentation and say what you are looking for, so other teachers can find you.</p></div><a class="btn primary" href="#profile/community">Join the directory</a></section>`}
    <div class="filters"><div class="frow"><label class="search">${icon("search")}<input id="dq" placeholder="Search name, school, subject…" value="${esc(DIR_F.q)}"></label>
      <select id="dc"><option value="">All countries</option>${[...new Set(all.map(m => m.country).filter(Boolean))].sort().map(c => `<option ${DIR_F.country === c ? "selected" : ""}>${esc(c)}</option>`).join("")}</select>
      <select id="dl"><option value="">Looking for anything</option>${LOOKING.map(([k, t]) => `<option value="${k}" ${DIR_F.looking === k ? "selected" : ""}>${esc(t)}</option>`).join("")}</select>
      <select id="dk"><option value="">Any eMove course</option>${EMOVE_COURSES.map(c => `<option value="${c.id}" ${DIR_F.course === c.id ? "selected" : ""}>${esc(c.title)}</option>`).join("")}</select></div></div>
    <p class="muted small" id="dn"></p><div class="grid3" id="dlist"></div>`;
  const draw = () => {
    const q = DIR_F.q.toLowerCase();
    const list = all.filter(m => (!DIR_F.country || m.country === DIR_F.country) && (!DIR_F.looking || m.looking.includes(DIR_F.looking)) && (!DIR_F.course || m.going.includes(DIR_F.course))
      && (!q || [m.name, m.school, m.subject, m.bio, m.stage].join(" ").toLowerCase().includes(q)));
    $("#dn").textContent = `${list.length} of ${all.length} teacher${all.length === 1 ? "" : "s"}`;
    $("#dlist").innerHTML = list.map(memberCard).join("") || `<p class="muted empty">No teachers match these filters.</p>`;
  };
  $("#dq").oninput = e => { DIR_F.q = e.target.value; draw(); };
  $("#dc").onchange = e => { DIR_F.country = e.target.value; draw(); };
  $("#dl").onchange = e => { DIR_F.looking = e.target.value; draw(); };
  $("#dk").onchange = e => { DIR_F.course = e.target.value; draw(); };
  draw();
};
const memberCard = m => `<article class="card member">${avatar(m.name)}<div class="grow"><b>${esc(m.name)}${m.me ? " (you)" : ""}${m.team ? ` <span class="team">eMove team</span>` : ""}</b>
  <small class="muted">${esc([ROLE_NAME[m.role] || "", m.subject, m.stage].filter(Boolean).join(" · "))}</small><small>${icon("school")} ${esc([m.school, m.country].filter(Boolean).join(", "))}</small>
  ${m.bio ? `<p>${esc(m.bio)}</p>` : ""}
  ${m.looking.length ? `<div class="tags">${m.looking.map(k => `<span class="tag">${esc(LOOKING_NAME[k] || k)}</span>`).join("")}</div>` : ""}
  ${m.going.length ? `<small>${icon("plane")} Interested in ${m.going.map(id => `<a href="#course/${id}">${esc((courseById(id) || {}).title || id)}</a>`).join(", ")}</small>` : ""}
  ${m.email && !m.me ? `<a class="btn sm" href="mailto:${esc(m.email)}">${icon("mail")} Email</a>` : ""}</div></article>`;
