/* ============ HOME, RESOURCES, PROFILE ============ */
ROUTES.home = v => {
  const first = (USER.name || "").split(" ")[0], lv = level(), p = courseProgress(), nu = nextUnit();
  const fav = S.favs.map(resById).filter(Boolean);
  const ints = USER.interests || [];
  const forYou = [...RESOURCES.filter(r => ints.includes(r.pathway)), ...RESOURCES.filter(r => !ints.includes(r.pathway))].slice(0, 3);
  const c = pickCourse();
  v.innerHTML = `<section class="welcome"><div><span class="eyebrow">Welcome${S.xp ? " back" : ""}</span><h1>Hello, ${esc(first)}!</h1><p class="muted">Learn how Erasmus+ can fund your next training abroad, and find ideas for your class tomorrow.</p></div>
      <div class="lv card"><span class="lv-n">Level ${lv.lv}</span><b>${lv.name}</b><div class="bar"><i style="width:${lv.next ? Math.min(100, S.xp / lv.next * 100) : 100}%"></i></div><span class="muted small">${S.xp} XP${lv.next ? ` · ${lv.next - S.xp} to next level` : ""}</span></div></section>
    <section class="card continue"><div class="continue-ring">${ring(p, 84, Math.round(p * 100) + "%")}</div><div class="grow"><span class="eyebrow">${icon("academy")} Your microcourse</span><h2>${esc(COURSE().title)}</h2>
      <p class="muted">${nu ? `Next: <b>${esc(nu.title)}</b>` : S.quiz && S.quiz.pass ? "Completed. Your certificate is ready." : "All units done. Take the final quiz!"}</p></div>
      <a class="btn primary" href="${nu ? "#unit/" + nu.id : S.quiz && S.quiz.pass ? "#cert/" + COURSE().id : "#quiz"}">${nu ? (p ? "Continue" : "Start") : S.quiz && S.quiz.pass ? "Certificate" : "Final quiz"} ${icon("arrow")}</a></section>
    <div class="grid2">
      <section class="card deadline"><span class="eyebrow">${icon("calendar")} Erasmus+ calendar</span><h3>Main KA1 deadline: usually in February</h3><p class="muted">Short-term projects (KA122) and accredited projects (KA121) usually apply in February. Some countries open a second KA122 round in the autumn. Check your National Agency's dates.</p><a class="link" href="#unit/u2">Which route is yours? ${icon("arrow")}</a></section>
      <section class="card"><span class="eyebrow">${icon("plane")} Course for you</span><h3>${esc(c.title)}</h3><p class="muted">${esc(c.sub)}</p><p class="small">${icon("pin")} ${esc(c.city)} · ${esc(c.dates)} · ${esc(c.price)}</p><a class="link" href="#course/${c.id}">Syllabus, resources and community ${icon("arrow")}</a></section>
    </div>
    <div class="sec-row"><h2 class="sec-t">${fav.length ? "Your saved resources" : "Resources for your class"}</h2><a class="link" href="#resources">All resources ${icon("arrow")}</a></div>
    <div class="grid3">${(fav.length ? fav.slice(0, 3) : forYou).map(resCard).join("")}</div>
    <div class="sec-row"><h2 class="sec-t">From the community</h2><a class="link" href="#community">Community ${icon("arrow")}</a></div>
    <section class="card" id="hrec"><p class="muted">Loading…</p></section>`;
  if (PREVIEW) { $("#hrec").innerHTML = `<p class="muted">Discussions and the teacher directory open when you sign in.</p>`; return; }
  api("forum/recent").then(r => { const el = $("#hrec"); if (!el) return; el.innerHTML = r.ok && r.data.items.length ? recentList(r.data.items.slice(0, 4)) : `<p class="muted">No discussions yet. <a href="#space/staffroom">Introduce yourself in the staff room</a> and meet teachers from all over Europe.</p>`; });
};

/* ---------- resources ---------- */
const resCard = r => { const p = pathwayById(r.pathway); return `<a class="card res" href="#res/${r.id}" style="--c:${p.color}"><div class="res-top"><span class="chip" style="--c:${p.color}">${icon(p.icon)} ${esc(p.name)}</span>${S.favs.includes(r.id) ? `<span class="fav-on">${icon("bookmark")}</span>` : ""}</div>
  <b>${esc(r.title)}</b><p class="muted">${esc(r.summary)}</p><div class="res-meta"><span>${esc(r.type)}</span><span>${icon("clock")} ${r.minutes} min</span><span>${esc(r.stages.length > 2 ? r.stages[0] + " +" : r.stages.join(", "))}</span></div></a>`; };
let RES_F = { p: "", stage: "", type: "", q: "", fav: false };
ROUTES.resources = v => {
  v.innerHTML = `<div class="page-h"><h1>${icon("book")} Resources</h1><p class="muted">Ready-to-use activities, routines and templates, organised by the seven eMove pathways.</p></div>
    <div class="filters"><div class="pchips"><button data-p="" class="${RES_F.p ? "" : "on"}">All</button>${PATHWAYS.map(p => `<button data-p="${p.id}" style="--c:${p.color}" class="${RES_F.p === p.id ? "on" : ""}">${icon(p.icon)} ${p.name}</button>`).join("")}</div>
    <div class="frow"><label class="search">${icon("search")}<input id="rq" placeholder="Search resources…" value="${esc(RES_F.q)}"></label>
      <select id="rs"><option value="">All stages</option>${STAGES.filter(s => s !== "All stages").map(s => `<option ${RES_F.stage === s ? "selected" : ""}>${s}</option>`).join("")}</select>
      <select id="rt"><option value="">All types</option>${RES_TYPES.map(t => `<option ${RES_F.type === t ? "selected" : ""}>${t}</option>`).join("")}</select>
      <label class="check inline"><input type="checkbox" id="rf" ${RES_F.fav ? "checked" : ""}><span>Saved only</span></label></div></div>
    <div id="rp"></div><div class="grid3" id="rl"></div>`;
  const draw = () => {
    const list = RESOURCES.filter(r => (!RES_F.p || r.pathway === RES_F.p) && (!RES_F.stage || r.stages.includes(RES_F.stage) || r.stages.includes("All stages")) && (!RES_F.type || r.type === RES_F.type)
      && (!RES_F.fav || S.favs.includes(r.id)) && (!RES_F.q || (r.title + r.summary + r.objective).toLowerCase().includes(RES_F.q.toLowerCase())));
    const p = RES_F.p && pathwayById(RES_F.p);
    $("#rp").innerHTML = p ? `<div class="path-intro" style="--c:${p.color}">${icon(p.icon)}<div><b>${p.name}</b><span>${esc(p.line)}</span></div></div>` : "";
    $("#rl").innerHTML = list.map(resCard).join("") || `<p class="muted empty">No resources match these filters yet.</p>`;
  };
  $$(".pchips button").forEach(b => b.onclick = () => { RES_F.p = b.dataset.p; $$(".pchips button").forEach(x => x.classList.toggle("on", x === b)); draw(); });
  $("#rq").oninput = e => { RES_F.q = e.target.value; draw(); };
  $("#rs").onchange = e => { RES_F.stage = e.target.value; draw(); };
  $("#rt").onchange = e => { RES_F.type = e.target.value; draw(); };
  $("#rf").onchange = e => { RES_F.fav = e.target.checked; draw(); };
  draw();
};
ROUTES.res = (v, [id]) => {
  const r = resById(id); if (!r) return go("resources");
  const p = pathwayById(r.pathway), fav = S.favs.includes(r.id);
  if (!S.done["res-" + r.id]) { S.done["res-" + r.id] = { d: todayISO() }; addXP(5, `Opened resource: ${r.title}`); }
  v.innerHTML = `<a class="back no-print" href="#resources">${icon("back")} Resources</a>
    <article class="resource" style="--c:${p.color}"><header><span class="chip" style="--c:${p.color}">${icon(p.icon)} ${esc(p.name)}</span><h1>${esc(r.title)}</h1><p class="lead">${esc(r.summary)}</p>
      <div class="res-meta big"><span>${esc(r.type)}</span><span>${icon("clock")} ${r.minutes} minutes</span><span>${icon("users")} ${esc(r.stages.join(", "))}</span></div>
      <div class="row gap no-print"><button class="btn ${fav ? "on" : ""}" id="fav">${icon("bookmark")} ${fav ? "Saved" : "Save"}</button><button class="btn" onclick="window.print()">${icon("print")} Print or save as PDF</button></div></header>
    <section><h2>Objective</h2><p>${esc(r.objective)}</p></section>
    <section><h2>Step by step</h2><ol class="steps-l">${r.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol></section>
    <div class="grid2"><section><h2>Materials</h2><ul>${r.materials.map(m => `<li>${esc(m)}</li>`).join("")}</ul></section><section><h2>Assessment</h2><p>${esc(r.assessment)}</p></section></div>
    ${r.variation ? `<section class="tip">${icon("spark")}<p><b>Variation.</b> ${esc(r.variation)}</p></section>` : ""}
    <p class="print-only small">EMOVE Profe · eMove Academy · ${EMOVE_SITE.replace("https://", "")}</p></article>
    ${r.course ? `<a class="card from-course no-print" href="#course/${r.course}/syllabus/${r.day}" style="--c:${p.color}">${icon("list")}<div class="grow"><span class="eyebrow">From the syllabus of ${esc(courseById(r.course).title)}</span><b>Day ${r.day} · ${esc(SYLLABUS[r.course].days[r.day - 1].title)}</b><span class="muted">${esc(SYLLABUS[r.course].days[r.day - 1].sub)}</span></div>${icon("arrow")}</a>` : ""}
    <div class="no-print">${courseCTA(r.pathway, coursesFor(r.pathway).length ? "This resource comes from the " + p.name + " pathway. Live it in a full course with teachers from all over Europe." : "We design tailor-made courses on this pathway for schools and groups.")}</div>`;
  $("#fav").onclick = () => { const i = S.favs.indexOf(r.id); i < 0 ? S.favs.push(r.id) : S.favs.splice(i, 1); save(); toast(i < 0 ? "Saved to your resources" : "Removed from saved"); route(); };
};

/* ---------- profile ---------- */
ROUTES.profile = (v, [part]) => {
  const lv = level(), notes = Object.entries(S.notes).filter(([, t]) => t);
  const qOf = id => { const [u, i] = id.split("-"), un = unitById(u); return un && un.activities[+i] ? un.activities[+i].q : id; };
  v.innerHTML = `<div class="page-h"><h1>${icon("user")} ${esc(USER.name)}</h1><p class="muted">${esc([USER.school, USER.country].filter(Boolean).join(" · "))}</p></div>
    <div class="stats"><div class="stat"><b>${S.xp}</b><span>XP · ${lv.name}</span></div><div class="stat"><b>${COURSE().units.filter(u => S.units[u.id]).length}/${COURSE().units.length}</b><span>units</span></div><div class="stat"><b>${S.certs.length}</b><span>certificates</span></div><div class="stat"><b>${S.favs.length}</b><span>saved resources</span></div><div class="stat"><b>${S.days.length}</b><span>days learning</span></div></div>
    <div class="grid2">
    <section class="card"><h2>${icon("cert")} Certificates</h2>${S.certs.length ? S.certs.map(c => `<a class="row-link" href="#cert/${c.id}">${icon("cert")}<span><b>${esc(c.title)}</b><small>${esc(c.d)} · ${c.score}/${COURSE().quiz.length}</small></span>${icon("arrow")}</a>`).join("") : `<p class="muted">Finish the microcourse and pass the quiz to earn your first certificate.</p>`}</section>
    <section class="card"><h2>${icon("note")} My notes</h2>${notes.length ? notes.map(([id, t]) => `<div class="note"><small class="muted">${esc(qOf(id))}</small><p>${esc(t)}</p></div>`).join("") : `<p class="muted">Your answers to the "Reflect" activities will appear here.</p>`}</section>
    </div>
    ${PREVIEW ? `<p class="notice">Preview mode: accounts are switched off on this copy.</p>` : `<div class="grid2"><section class="card"><h2>Your details</h2><form id="pf" class="form">
      <label>Full name<input name="name" value="${esc(USER.name)}"></label>
      <div class="two"><label>School<input name="school" value="${esc(USER.school || "")}"></label><label>Country<select name="country">${COUNTRIES.map(c => `<option ${USER.country === c ? "selected" : ""}>${c}</option>`).join("")}</select></label></div>
      <div class="two"><label>Role<select name="role">${ROLES.map(([k, t]) => `<option value="${k}" ${USER.role === k ? "selected" : ""}>${t}</option>`).join("")}</select></label><label>Stage<select name="stage">${STAGES.map(s => `<option ${USER.stage === s ? "selected" : ""}>${s}</option>`).join("")}</select></label></div>
      <label>Subject or area<input name="subject" value="${esc(USER.subject || "")}"></label>
      <fieldset><legend>Interests</legend><div class="checks">${PATHWAYS.map(p => `<label class="check"><input type="checkbox" name="interests" value="${p.id}" ${(USER.interests || []).includes(p.id) ? "checked" : ""}><span>${p.name}</span></label>`).join("")}</div></fieldset>
      <label class="check"><input type="checkbox" name="news" ${USER.news ? "checked" : ""}><span>Send me news about Erasmus+ deadlines and eMove courses.</span></label>
      <button class="btn primary">Save details</button></form></section>
    <section class="card"><h2>Password</h2><form id="pw" class="form"><label>Current password<input type="password" name="old" autocomplete="current-password"></label><label>New password<input type="password" name="password" minlength="8" autocomplete="new-password"><small>At least 8 characters.</small></label><p class="err" id="pwe"></p><button class="btn">Change password</button></form>
    <hr><button class="btn danger" id="out">${icon("logout")} Sign out</button></section></div>
    <section class="card" id="community-profile"><h2>${icon("users")} Community profile</h2><p class="muted">Choose what other approved teachers can see in the directory and in the course spaces.</p><form id="cf" class="form">
      <label class="check"><input type="checkbox" name="directory" ${USER.directory ? "checked" : ""}><span><b>Show me in the teacher directory</b> (name, school, country, role, subject and what you write below)</span></label>
      <label class="check"><input type="checkbox" name="showEmail" ${USER.showEmail ? "checked" : ""}><span>Show my email in the directory so teachers can contact me</span></label>
      <label>A few words about you<textarea name="bio" rows="3" maxlength="300" placeholder="I teach English in a primary school near Porto. We want to start our first Erasmus+ project.">${esc(USER.bio || "")}</textarea></label>
      <fieldset><legend>I'm looking for</legend><div class="checks">${LOOKING.map(([k, t]) => `<label class="check"><input type="checkbox" name="looking" value="${k}" ${(USER.looking || []).includes(k) ? "checked" : ""}><span>${t}</span></label>`).join("")}</div></fieldset>
      <fieldset><legend>eMove courses I'm interested in</legend><div class="checks">${EMOVE_COURSES.map(c => `<label class="check"><input type="checkbox" name="going" value="${c.id}" ${(USER.going || []).includes(c.id) ? "checked" : ""}><span>${esc(c.title)}</span></label>`).join("")}</div></fieldset>
      <button class="btn primary">Save community profile</button></form></section>`}`;
  if (part === "community" && $("#community-profile")) setTimeout(() => $("#community-profile").scrollIntoView({ behavior: "smooth" }), 60);
  if (PREVIEW) return;
  $("#pf").onsubmit = async e => {
    e.preventDefault(); const f = new FormData(e.target);
    const b = Object.fromEntries(["name", "school", "country", "role", "stage", "subject"].map(k => [k, f.get(k) || ""])); b.interests = f.getAll("interests"); b.news = !!f.get("news");
    const r = await api("profile", b);
    if (!r.ok) return toast(r.data.message || "Could not save.");
    USER = r.data.user; AUTH.user = USER; authSave(AUTH); toast("Details saved"); route();
  };
  $("#pw").onsubmit = async e => {
    e.preventDefault(); const f = new FormData(e.target);
    const r = await api("password", { old: f.get("old"), password: f.get("password") });
    if (!r.ok) { $("#pwe").textContent = r.data.message || "Could not change it."; return; }
    AUTH.token = r.data.token; authSave(AUTH); e.target.reset(); $("#pwe").textContent = ""; toast("Password changed");
  };
  $("#out").onclick = signOut;
  $("#cf").onsubmit = async e => {
    e.preventDefault(); const f = new FormData(e.target);
    const r = await api("profile", { directory: !!f.get("directory"), showEmail: !!f.get("showEmail"), bio: f.get("bio") || "", looking: f.getAll("looking"), going: f.getAll("going") });
    if (!r.ok) return toast(r.data.message || "Could not save.");
    USER = r.data.user; AUTH.user = USER; authSave(AUTH); toast(USER.directory ? "Saved. You appear in the teacher directory." : "Saved. You don't appear in the directory.");
  };
};
