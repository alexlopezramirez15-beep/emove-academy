/* ============ LEARN: the free microcourse and the hub of every eMove course (overview, syllabus, resources, community) ============ */
const sylDone = (cid, n) => !!(S.syl && S.syl[cid + "-" + n]);
const sylCount = cid => [1, 2, 3, 4, 5].filter(n => sylDone(cid, n)).length;
const going = cid => !!(USER && (USER.going || []).includes(cid));

/* the programmes are written as short lines: bullet runs become lists, the rest paragraphs */
function prose(lines, cls = "") {
  let out = "", ul = [];
  const flush = () => { if (ul.length) { out += `<ul>${ul.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`; ul = []; } };
  for (const l of lines || []) {
    if (l.startsWith("* ")) { ul.push(l.slice(2)); continue; }
    flush();
    out += /^[A-Z0-9 ·&’'“”.!?:,+-]{6,}$/.test(l) && l.toUpperCase() === l ? `<p class="shout">${esc(l)}</p>` : `<p>${esc(l)}</p>`;
  }
  flush();
  return `<div class="prose ${cls}">${out}</div>`;
}
const titleCase = s => s.charAt(0) + s.slice(1).toLowerCase().replace(/\b(ai|eu|ka\d+|vet)\b/g, m => m.toUpperCase());

ROUTES.learn = v => {
  const c = COURSE(), p = courseProgress(), nu = nextUnit();
  v.innerHTML = `<div class="page-h"><h1>${icon("academy")} Learn</h1><p class="muted">Start with the free Erasmus+ microcourse, then explore the full syllabus of every eMove course.</p></div>
    <section class="card continue learn-free"><div class="continue-ring">${ring(p, 84, Math.round(p * 100) + "%")}</div><div class="grow"><span class="eyebrow">${icon("academy")} Free microcourse · certificate</span><h2>${esc(c.title)}</h2>
      <p class="muted">${esc(c.sub)}. ${c.units.length} units, about ${c.minutes} minutes.</p></div>
      <a class="btn primary" href="#academy">${p ? (nu ? "Continue" : "Open") : "Start"} ${icon("arrow")}</a></section>
    <div class="sec-row"><h2 class="sec-t">eMove courses · the full syllabus</h2><span class="muted small">Summer 2027 · 5 days · 25 hours · Erasmus+ compatible</span></div>
    <p class="muted">Every course has a day-by-day syllabus, resources to try in your class now and a space to talk with the teachers who are going.</p>
    <div class="grid3">${EMOVE_COURSES.map(courseCard).join("")}</div>
    <section class="card fund"><div>${icon("wallet", "big")}</div><div class="grow"><h3>How do I pay for it with Erasmus+?</h3><p class="muted">Your school applies to its National Agency (KA122 or KA121). The grant can cover the course fee, travel and daily costs. Learn the whole process in the free microcourse.</p></div><a class="btn" href="#academy">Open the microcourse ${icon("arrow")}</a></section>
    <section class="card schools"><div class="grow"><h3>${esc(FOR_SCHOOLS.title)}</h3><p class="muted">${esc(FOR_SCHOOLS.sub)}. Ideal for whole teams and for the European Citizenship and Leadership pathways.</p></div><a class="btn" href="${FOR_SCHOOLS.url}" target="_blank" rel="noopener" data-course="schools">For schools ${icon("external")}</a></section>
    <h2 class="sec-t">Seven pathways</h2><div class="pathways">${PATHWAYS.map(p => `<a class="pw" href="#resources" data-pw="${p.id}" style="--c:${p.color}">${icon(p.icon)}<b>${p.name}</b><span>${esc(p.line)}</span><em>${coursesFor(p.id).length ? coursesFor(p.id).length + " course" + (coursesFor(p.id).length > 1 ? "s" : "") : "Tailor-made"} · ${RESOURCES.filter(r => r.pathway === p.id).length} resources</em></a>`).join("")}</div>`;
  $$("[data-pw]").forEach(a => a.onclick = () => { RES_F.p = a.dataset.pw; });
};
ROUTES.courses = () => go("learn");

function courseCard(c) {
  const p = pathwayById(c.pathway), n = sylCount(c.id);
  return `<a class="card course hub-card" href="#course/${c.id}" style="--c:${p.color}"><div class="res-top"><span class="chip" style="--c:${p.color}">${icon(p.icon)} ${esc(p.name)}</span>${going(c.id) ? `<span class="chip" style="--c:#15803D">${icon("check")} Interested</span>` : ""}</div>
    <h3>${esc(c.title)}</h3><p class="muted">${esc(c.sub)}</p>
    <ul class="facts"><li>${icon("pin")} ${esc(c.city)} · ${esc(c.dates)}</li><li>${icon("list")} Syllabus: ${n}/5 days studied</li></ul>
    <div class="bar"><i style="width:${n / 5 * 100}%"></i></div><span class="link">Open the course ${icon("arrow")}</span></a>`;
}

const COURSE_TABS = [["overview", "Overview", "eye"], ["syllabus", "Syllabus", "list"], ["resources", "Resources", "book"], ["community", "Community", "chat"]];
ROUTES.course = (v, [id, tab]) => {
  const c = courseById(id), sy = SYLLABUS[id]; if (!c || !sy) return go("learn");
  tab = COURSE_TABS.some(t => t[0] === tab) ? tab : "overview";
  const p = pathwayById(c.pathway), n = sylCount(id), res = resForCourse(id);
  if (!S.clicks["hub-" + id]) { S.clicks["hub-" + id] = todayISO(); logAct("Explored the course: " + c.title); save(); }
  v.innerHTML = `<a class="back" href="#learn">${icon("back")} Learn</a>
    <section class="hub-hero" style="--c:${p.color}"><div class="grow"><span class="eyebrow">${icon(p.icon)} ${esc(p.name)} · eMove course</span><h1>${esc(c.title)}</h1><p>${esc(c.sub)}</p>
      <ul class="hub-facts"><li>${icon("pin")} ${esc(c.city)}, Spain</li><li>${icon("calendar")} ${esc(c.dates)}</li><li>${icon("clock")} ${esc(c.days)}</li><li>${icon("globe")} ${esc(c.lang)}</li><li>${icon("wallet")} ${esc(c.price)} · Erasmus+ compatible</li></ul>
      <div class="row gap"><a class="btn primary" href="${c.url}" target="_blank" rel="noopener" data-course="${c.id}">Enrol on emoveacademy.com ${icon("external")}</a><button class="btn ${going(id) ? "on" : ""}" id="going">${icon(going(id) ? "check" : "plus")} ${going(id) ? "I'm interested" : "I'm interested"}</button></div></div>
      <div class="hero-ring">${ring(n / 5, 112, n + "/5")}<span>days studied</span></div></section>
    <nav class="hub-tabs">${COURSE_TABS.map(([k, t, i]) => `<a href="#course/${id}/${k}" class="${tab === k ? "on" : ""}">${icon(i)} ${t}${k === "resources" ? ` <em>${res.length}</em>` : ""}</a>`).join("")}</nav>
    <div id="hub"></div>`;
  $("#going").onclick = () => toggleGoing(id);
  const h = $("#hub");
  if (tab === "overview") hubOverview(h, c, sy);
  if (tab === "syllabus") hubSyllabus(h, c, sy);
  if (tab === "resources") hubResources(h, c);
  if (tab === "community") hubCommunity(h, c);
};

async function toggleGoing(id) {
  const list = new Set((USER.going || []));
  list.has(id) ? list.delete(id) : list.add(id);
  USER.going = [...list];
  if (!PREVIEW) {
    const r = await api("profile", { going: USER.going });
    if (!r.ok) { toast(r.data.message || "Could not save."); return; }
    USER = r.data.user; AUTH.user = USER; authSave(AUTH);
  }
  toast(USER.going.includes(id) ? (USER.directory ? "Saved. Teachers interested in this course can now find you." : "Saved. Join the teacher directory in your profile to meet others who are going.") : "Removed from your interests");
  route();
}

function hubOverview(h, c, sy) {
  const a = sy.approach;
  h.innerHTML = `<div class="hub-grid"><div>
      <section class="card">${prose(sy.hook, "hook")}</section>
      ${sy.why.length ? `<section class="card"><h2>${icon("quiz")} Why this course?</h2>${prose(sy.why)}</section>` : ""}
      ${a ? `<section class="card"><h2>${icon("route")} ${esc(a.t)}</h2>${prose(a.intro)}<div class="parts">${a.parts.map(x => `<details class="part"><summary><span class="part-k">${esc(x.k)}</span><b>${esc(titleCase(x.t))}</b></summary>${prose(x.lines)}</details>`).join("")}</div></section>` : ""}
      ${sy.outcomes.length ? `<section class="card"><h2>${icon("target")} Learning outcomes</h2><p class="muted">By the end of the course, participants will be able to:</p><ul class="ticks-l">${sy.outcomes.map(o => `<li>${icon("check")} ${esc(o)}</li>`).join("")}</ul></section>` : ""}
    </div><aside>
      <section class="card"><h3>${icon("users")} Who is it for?</h3>${prose(sy.who)}</section>
      ${sy.format.length ? `<section class="card"><h3>${icon("calendar")} Course format</h3><dl class="fmt">${sy.format.map(l => { const [k, ...r] = l.split(":"); return r.length ? `<div><dt>${esc(k)}</dt><dd>${esc(r.join(":").trim())}</dd></div>` : ""; }).join("")}</dl></section>` : ""}
      <section class="card"><h3>${icon("list")} The syllabus</h3><ol class="mini-days">${sy.days.map(d => `<li class="${sylDone(c.id, d.n) ? "done" : ""}"><a href="#course/${c.id}/syllabus/${d.n}"><span>${sylDone(c.id, d.n) ? icon("check") : d.n}</span><b>${esc(d.title)}</b></a></li>`).join("")}</ol><a class="btn wide" href="#course/${c.id}/syllabus">Study the syllabus ${icon("arrow")}</a></section>
      ${sy.takeHome.length ? `<section class="card"><h3>${icon("toolbox")} What will you take home?</h3>${prose(sy.takeHome)}</section>` : ""}
    </aside></div>
    <p class="disclaimer">Course programme by eMove Academy. Dates, places and fees: always check <a href="${c.url}" target="_blank" rel="noopener">the course page</a>.</p>`;
}

function hubSyllabus(h, c, sy) {
  const want = +location.hash.split("/")[3] || 0, first = (sy.days.find(d => !sylDone(c.id, d.n)) || sy.days[0]).n;
  h.innerHTML = `<p class="lead-s">${esc(sy.daysTitle || "Five days, day by day")}. Read each day, try the resources in your class and mark it as studied.</p>
    <div class="days">${sy.days.map(d => { const done = sylDone(c.id, d.n), rs = resForCourse(c.id, d.n); return `<details class="day card ${done ? "done" : ""}" id="day-${d.n}" ${d.n === (want || first) ? "open" : ""}>
      <summary><span class="day-n">${done ? icon("check") : "Day " + d.n}</span><div class="grow"><b>${esc(d.title)}</b><span class="muted">${esc(d.sub)}</span></div></summary>
      <div class="day-b">${prose(d.intro)}
        ${d.topics.length ? `<h4>What we explore</h4><ul class="topics">${d.topics.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
        ${d.notes.length ? prose(d.notes, "notes") : ""}
        ${d.challenge.length ? `<div class="challenge">${icon("target")}<div><span class="eyebrow">${d.final ? "Final challenge" : "Daily challenge"}</span>${prose(d.challenge)}</div></div>` : ""}
        ${rs.length ? `<h4>Try it in your class</h4><div class="grid2 tight">${rs.map(resCard).join("")}</div>` : ""}
        <div class="row gap"><button class="btn ${done ? "" : "primary"}" data-day="${d.n}">${done ? `${icon("check")} Studied` : `Mark day ${d.n} as studied`}</button>${d.n < 5 ? `<a class="link" href="#course/${c.id}/syllabus/${d.n + 1}">Day ${d.n + 1} ${icon("arrow")}</a>` : ""}</div></div></details>`; }).join("")}</div>
    ${sy.ideas.length ? `<h2 class="sec-t">Big ideas of the course</h2><div class="ideas">${sy.ideas.map(x => `<section class="card idea"><h3>${esc(titleCase(x.t))}</h3>${prose(x.lines)}</section>`).join("")}</div>` : ""}
    ${sy.method ? `<section class="card method"><h2>${esc(titleCase(sy.method.t))}</h2>${prose(sy.method.lines)}</section>` : ""}
    ${sy.toolkit.length ? `<section class="card"><h2>${icon("toolbox")} Your toolkit</h2><p class="muted">Participants leave the course with these resources:</p><ul class="toolkit">${sy.toolkit.map(t => `<li>${esc(t)}</li>`).join("")}</ul></section>` : ""}
    ${n5(c)}`;
  if (want) setTimeout(() => { const el = $("#day-" + want); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
  $$("[data-day]").forEach(b => b.onclick = () => {
    const k = c.id + "-" + b.dataset.day; S.syl = S.syl || {};
    if (S.syl[k]) { delete S.syl[k]; save(); }
    else { S.syl[k] = todayISO(); addXP(10, `Studied day ${b.dataset.day} of ${c.title}`); toast(sylCount(c.id) === 5 ? "You've studied the whole syllabus!" : "+10 XP"); }
    route();
  });
}
const n5 = c => sylCount(c.id) === 5 ? `<section class="card done-all">${icon("cert", "big")}<div class="grow"><h3>You've studied the whole syllabus</h3><p class="muted">Ready to live it? Five days in ${esc(c.city)} with teachers from all over Europe, funded by Erasmus+.</p></div><a class="btn primary" href="${c.url}" target="_blank" rel="noopener" data-course="${c.id}">Enrol ${icon("external")}</a></section>` : "";

function hubResources(h, c) {
  const rs = resForCourse(c.id), more = RESOURCES.filter(r => r.pathway === c.pathway && r.course !== c.id);
  h.innerHTML = `<p class="lead-s">Resources connected to the syllabus of ${esc(c.title)}. Use them in your class now: on the course you will go much deeper.</p>
    <div class="grid3">${rs.map(r => resCard(r).replace('<b>', `<span class="eyebrow">Day ${r.day} · ${esc(SYLLABUS[c.id].days[r.day - 1].title)}</span><b>`)).join("")}</div>
    ${more.length ? `<h2 class="sec-t">More from the ${esc(pathwayById(c.pathway).name)} pathway</h2><div class="grid3">${more.map(resCard).join("")}</div>` : ""}`;
}

function hubCommunity(h, c) {
  h.innerHTML = `<div class="hub-grid"><div><div id="forum"></div></div><aside><section class="card"><h3>${icon("users")} Teachers interested</h3><div id="who"><p class="muted">Loading…</p></div></section></aside></div>`;
  forumBlock($("#forum"), "course-" + c.id);
  interestedIn($("#who"), c.id);
}
async function interestedIn(el, cid) {
  if (PREVIEW) { el.innerHTML = `<p class="muted">Available when you sign in.</p>`; return; }
  const r = await api("members");
  if (!r.ok) { el.innerHTML = `<p class="muted">${esc(r.data.message || "Could not load.")}</p>`; return; }
  const list = r.data.members.filter(m => m.going.includes(cid));
  el.innerHTML = (list.length ? `<ul class="people">${list.map(m => `<li>${avatar(m.name)}<div><b>${esc(m.name)}${m.me ? " (you)" : ""}</b><small>${esc([m.school, m.country].filter(Boolean).join(" · "))}</small></div></li>`).join("")}</ul>` : `<p class="muted">Nobody has said they are interested yet. Be the first!</p>`)
    + (going(cid) && !USER.directory ? `<p class="small notice">You are interested, but other teachers can't see you yet. <a href="#profile">Join the teacher directory</a>.</p>` : "")
    + (!going(cid) ? `<button class="btn wide" onclick="toggleGoing('${cid}')">${icon("plus")} I'm interested</button>` : "")
    + `<a class="link" href="#members">Open the teacher directory ${icon("arrow")}</a>`;
}
