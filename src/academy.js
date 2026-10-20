/* ============ ACADEMY: course map, lesson player, activities, quiz, certificate, glossary ============ */
const COURSE = () => COURSES[0];
const unitById = id => COURSE().units.find(u => u.id === id);
const actId = (u, i) => `${u.id}-${i}`;
const unitProgress = u => u.activities.filter((_, i) => S.done[actId(u, i)]).length / u.activities.length;
const unitOpen = (u) => { const us = COURSE().units, i = us.indexOf(u); return i === 0 || !!S.units[us[i - 1].id] || unitProgress(u) > 0; };
const allUnitsDone = () => COURSE().units.every(u => S.units[u.id]);
const courseProgress = () => { const us = COURSE().units; return (us.filter(u => S.units[u.id]).length + (S.quiz && S.quiz.pass ? 1 : 0)) / (us.length + 1); };
const nextUnit = () => COURSE().units.find(u => !S.units[u.id]);
const pickCourse = () => {
  const ints = (USER && USER.interests) || [];
  return EMOVE_COURSES.find(c => ints.includes(c.pathway)) || EMOVE_COURSES[(new Date().getDate()) % EMOVE_COURSES.length];
};

ROUTES.academy = v => {
  const c = COURSE(), p = courseProgress(), nu = nextUnit();
  v.innerHTML = `<section class="course-hero"><div><span class="eyebrow">${icon("academy")} Microcourse 1 · Free</span><h1>${esc(c.title)}</h1><p>${esc(c.sub)}</p>
      <div class="meta">${icon("clock")} About ${c.minutes} minutes · ${c.units.length} units · final quiz · certificate</div>
      <div class="row gap">${nu ? `<a class="btn primary" href="#unit/${nu.id}">${p ? "Continue" : "Start the course"} ${icon("arrow")}</a>` : allUnitsDone() && !(S.quiz && S.quiz.pass) ? `<a class="btn primary" href="#quiz">Take the final quiz ${icon("arrow")}</a>` : `<a class="btn primary" href="#cert/${c.id}">${icon("cert")} View your certificate</a>`}<a class="btn" href="#glossary">${icon("open")} Glossary</a></div></div>
      <div class="hero-ring">${ring(p, 132, Math.round(p * 100) + "%")}<span>completed</span></div></section>
    <ol class="path">${c.units.map((u, i) => {
      const done = !!S.units[u.id], open = unitOpen(u), pr = unitProgress(u);
      return `<li class="node ${done ? "done" : open ? "open" : "locked"}"><a ${open ? `href="#unit/${u.id}"` : ""} class="node-a"><span class="node-dot">${done ? icon("check") : open ? icon(u.icon) : icon("lock")}</span>
        <div class="node-b"><span class="eyebrow">Unit ${i + 1}</span><b>${esc(u.title)}</b><span class="muted">${esc(u.goal)}</span>${open && !done && pr ? `<div class="bar"><i style="width:${pr * 100}%"></i></div>` : ""}</div>
        <span class="node-n">${u.activities.length} activities</span></a></li>`;
    }).join("")}
      <li class="node ${S.quiz && S.quiz.pass ? "done" : allUnitsDone() ? "open" : "locked"}"><a ${allUnitsDone() ? `href="#quiz"` : ""} class="node-a"><span class="node-dot">${S.quiz && S.quiz.pass ? icon("check") : allUnitsDone() ? icon("quiz") : icon("lock")}</span>
        <div class="node-b"><span class="eyebrow">Final</span><b>Quiz and certificate</b><span class="muted">${c.quiz.length} questions. Get ${passMark()} right to earn your certificate.</span></div></a></li></ol>
    <h2 class="sec-t">Coming next</h2>
    <div class="grid3">${[["Write your KA122 application", "A guided walk through every section of the form, with examples."], ["Make your mobility count", "Dissemination and impact ideas that evaluators love."], ["eTwinning in practice", "Start a project with a partner school in a week."]].map(([t, d]) => `<div class="card soon"><span class="chip">Coming soon</span><b>${t}</b><p class="muted">${d}</p></div>`).join("")}</div>
    <p class="disclaimer">Summarised from the Erasmus+ Programme Guide. Rules, amounts and deadlines change every year: always check the current guide and your National Agency.</p>`;
};

ROUTES.unit = (v, [id]) => {
  const u = unitById(id); if (!u) return go("academy");
  if (!unitOpen(u)) { toast("Finish the previous unit first."); return go("academy"); }
  const idx = COURSE().units.indexOf(u), first = u.activities.findIndex((_, i) => !S.done[actId(u, i)]);
  const KIND = { learn: ["Learn", "open"], cards: ["Discover", "eye"], choice: ["Decide", "target"], tf: ["True or false", "quiz"], sort: ["Sort", "route"], order: ["Order", "route"], reflect: ["Reflect", "note"] };
  v.innerHTML = `<a class="back" href="#academy">${icon("back")} Course map</a>
    <section class="unit-h"><span class="node-dot big">${icon(u.icon)}</span><div><span class="eyebrow">Unit ${idx + 1} of ${COURSE().units.length}</span><h1>${esc(u.title)}</h1><p class="muted">${esc(u.goal)}</p></div></section>
    <ol class="acts">${u.activities.map((a, i) => { const d = S.done[actId(u, i)], k = KIND[a.type]; return `<li><a href="#lesson/${u.id}/${i}" class="act-row ${d ? "done" : ""}"><span class="act-i">${d ? icon("check") : icon(k[1])}</span><div><span class="eyebrow">${k[0]}</span><b>${esc(a.title || a.q)}</b></div>${icon("arrow")}</a></li>`; }).join("")}</ol>
    <div class="row gap"><a class="btn primary" href="#lesson/${u.id}/${first < 0 ? 0 : first}">${first < 0 ? "Review the unit" : first ? "Continue" : "Start"} ${icon("arrow")}</a></div>`;
};

/* ---------- lesson player ---------- */
ROUTES.lesson = (v, [uid, n]) => {
  const u = unitById(uid); if (!u || !unitOpen(u)) return go("academy");
  const i = Math.max(0, Math.min(+n || 0, u.activities.length - 1)), a = u.activities[i], id = actId(u, i);
  v.innerHTML = `<div class="player"><div class="player-top"><a href="#unit/${u.id}" class="icon-btn" aria-label="Close lesson">${icon("close")}</a>
      <div class="steps">${u.activities.map((_, k) => `<i class="${k < i || S.done[actId(u, k)] ? "done" : ""} ${k === i ? "now" : ""}"></i>`).join("")}</div><span class="xp-pill">${icon("bolt")} ${S.xp} XP</span></div>
    <div class="act card" id="act"></div><div class="player-foot" id="foot"></div></div>`;
  const host = $("#act"), foot = $("#foot");
  /* ok: true/false for graded activities, null for the rest; auto: move on straight away (nothing to read after) */
  const finish = (ok, auto) => {
    const first = !S.done[id];
    S.done[id] = { ok: ok !== false, d: todayISO() };
    if (first) addXP(ok === true ? 15 : 10, null); else save();
    $(".xp-pill").innerHTML = `${icon("bolt")} ${S.xp} XP`;
    const last = i === u.activities.length - 1, advance = () => last ? unitDone(u) : go(`lesson/${u.id}/${i + 1}`);
    if (auto) return advance();
    foot.innerHTML = `<button class="btn primary wide" id="next">${last ? "Finish unit" : "Continue"} ${icon("arrow")}</button>`;
    $("#next").onclick = advance;
    const fb = $("#fb", host) || $(".tf li:last-child .tf-fb", host);
    if (fb) setTimeout(() => fb.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };
  (ACT[a.type] || ACT.learn)(host, a, foot, finish, id);
};
function unitDone(u) {
  const firstTime = !S.units[u.id];
  if (firstTime) { S.units[u.id] = todayISO(); addXP(30, `Unit completed: ${u.title}`); }
  const c = pickCourse(), us = COURSE().units, nx = us[us.indexOf(u) + 1];
  $("#view").innerHTML = `<div class="celebrate card"><div class="medal">${icon(u.icon)}</div><h1>Unit complete!</h1><p>${esc(u.title)}${firstTime ? " · +30 XP bonus" : ""}</p>
    <div class="row gap center">${nx ? `<a class="btn primary" href="#unit/${nx.id}">Next: ${esc(nx.title)} ${icon("arrow")}</a>` : `<a class="btn primary" href="#quiz">Take the final quiz ${icon("arrow")}</a>`}<a class="btn" href="#academy">Course map</a></div></div>
    <div class="card tip-course"><p><b>Did you know?</b> eMove courses are Erasmus+ compatible: what you are learning here is exactly how a school funds one.</p>${courseCTA(c.pathway)}</div>`;
  window.scrollTo(0, 0);
}

/* ---------- activity types ---------- */
const ACT = {};
const feedback = (ok, html) => `<div class="fb ${ok ? "ok" : "no"}">${icon(ok ? "check" : "close")}<div>${html}</div></div>`;
ACT.learn = (h, a, foot, finish) => {
  h.innerHTML = `<span class="eyebrow">${icon("open")} Learn</span><h2>${esc(a.title)}</h2><p class="lead">${md(a.body)}</p>
    ${a.points ? `<ul class="points">${a.points.map(p => `<li>${icon("check")}<span>${md(p)}</span></li>`).join("")}</ul>` : ""}${a.tip ? `<div class="tip">${icon("spark")}<p>${md(a.tip)}</p></div>` : ""}`;
  foot.innerHTML = `<button class="btn primary wide">Got it ${icon("arrow")}</button>`; foot.firstChild.onclick = () => finish(null, true);
};
ACT.cards = (h, a, foot, finish) => {
  const seen = new Set();
  h.innerHTML = `<span class="eyebrow">${icon("eye")} Discover</span><h2>${esc(a.title)}</h2><p class="muted">${md(a.intro || "Tap each card.")}</p>
    <div class="flip-grid">${a.cards.map((c, k) => `<button class="flip" data-k="${k}"><span class="flip-i">${icon(c.icon || "star")}</span><b>${esc(c.t)}</b><span class="flip-d">${md(c.d)}</span><span class="flip-hint">Tap to discover</span></button>`).join("")}</div>`;
  foot.innerHTML = `<button class="btn primary wide" disabled>Open all the cards (0/${a.cards.length})</button>`;
  $$(".flip", h).forEach(b => b.onclick = () => { b.classList.add("open"); seen.add(b.dataset.k); const btn = foot.firstChild; btn.textContent = seen.size === a.cards.length ? "Continue" : `Open all the cards (${seen.size}/${a.cards.length})`; if (seen.size === a.cards.length) { btn.disabled = false; btn.onclick = () => finish(null, true); } });
};
ACT.choice = (h, a, foot, finish) => {
  let pick = null;
  h.innerHTML = `<span class="eyebrow">${icon("target")} Decide</span>${a.scenario ? `<div class="scenario">${icon("school")}<p>${md(a.scenario)}</p></div>` : ""}<h2>${esc(a.q)}</h2>
    <div class="opts">${a.options.map((o, k) => `<button class="opt" data-k="${k}"><span class="opt-l">${"ABCD"[k]}</span><span>${esc(o)}</span></button>`).join("")}</div><div id="fb"></div>`;
  foot.innerHTML = `<button class="btn primary wide" disabled>Check</button>`;
  const check = foot.firstChild;
  $$(".opt", h).forEach(b => b.onclick = () => { if (h.dataset.locked) return; $$(".opt", h).forEach(x => x.classList.remove("sel")); b.classList.add("sel"); pick = +b.dataset.k; check.disabled = false; });
  check.onclick = () => {
    h.dataset.locked = 1; const ok = pick === a.answer;
    $$(".opt", h).forEach(x => { const k = +x.dataset.k; x.classList.toggle("right", k === a.answer); x.classList.toggle("wrong", k === pick && !ok); x.disabled = true; });
    $("#fb", h).innerHTML = feedback(ok, `<b>${ok ? "Well done!" : "Not quite."}</b> ${md(a.why[pick])}${ok ? "" : `<br><span class="muted">${md(a.why[a.answer])}</span>`}`);
    finish(ok);
  };
};
ACT.tf = (h, a, foot, finish) => {
  const ans = {};
  h.innerHTML = `<span class="eyebrow">${icon("quiz")} True or false</span><h2>${esc(a.title || "True or false?")}</h2>
    <ol class="tf">${a.items.map((it, k) => `<li data-k="${k}"><p>${md(it.s)}</p><div class="tf-b"><button data-v="1">True</button><button data-v="0">False</button></div><div class="tf-fb"></div></li>`).join("")}</ol>`;
  foot.innerHTML = `<button class="btn primary wide" disabled>Check</button>`;
  const check = foot.firstChild;
  $$(".tf li", h).forEach(li => $$("button", li).forEach(b => b.onclick = () => { if (h.dataset.locked) return; $$("button", li).forEach(x => x.classList.remove("sel")); b.classList.add("sel"); ans[li.dataset.k] = b.dataset.v === "1"; check.disabled = Object.keys(ans).length < a.items.length; }));
  check.onclick = () => {
    h.dataset.locked = 1; let all = true;
    a.items.forEach((it, k) => { const li = $(`li[data-k="${k}"]`, h), ok = ans[k] === it.a; all = all && ok; li.classList.add(ok ? "right" : "wrong"); $(".tf-fb", li).innerHTML = feedback(ok, `<b>${it.a ? "True" : "False"}.</b> ${md(it.why)}`); });
    finish(all);
  };
};
ACT.sort = (h, a, foot, finish) => {
  const place = {}; let sel = null;
  const items = shuffle(a.items.map((it, k) => Object.assign({ k }, it)));
  const draw = () => {
    h.innerHTML = `<span class="eyebrow">${icon("route")} Sort</span><h2>${esc(a.q)}</h2><p class="muted small">Tap a card, then tap the box where it belongs.</p>
      <div class="pool">${items.filter(it => place[it.k] == null).map(it => `<button class="tile ${sel === it.k ? "sel" : ""}" data-k="${it.k}">${esc(it.t)}</button>`).join("") || `<span class="muted small">All placed. Tap a card in a box to move it back.</span>`}</div>
      <div class="buckets" style="--n:${a.buckets.length}">${a.buckets.map((b, bi) => `<div class="bucket" data-b="${bi}"><b>${esc(b)}</b>${items.filter(it => place[it.k] === bi).map(it => `<button class="tile in ${h.dataset.locked ? (it.b === bi ? "right" : "wrong") : ""}" data-k="${it.k}">${esc(it.t)}${h.dataset.locked && it.b !== bi ? `<small>→ ${esc(a.buckets[it.b])}</small>` : ""}</button>`).join("")}</div>`).join("")}</div><div id="fb"></div>`;
    if (h.dataset.locked) return;
    $$(".pool .tile", h).forEach(t => t.onclick = () => { sel = +t.dataset.k; draw(); });
    $$(".bucket", h).forEach(b => b.onclick = e => {
      const t = e.target.closest(".tile.in");
      if (sel != null) { place[sel] = +b.dataset.b; sel = null; draw(); return; }
      if (t) { delete place[t.dataset.k]; draw(); }
    });
    const btn = foot.firstChild; btn.disabled = Object.keys(place).length < items.length;
  };
  foot.innerHTML = `<button class="btn primary wide" disabled>Check</button>`;
  foot.firstChild.onclick = () => {
    h.dataset.locked = 1; const ok = items.every(it => place[it.k] === it.b); draw();
    $("#fb", h).innerHTML = feedback(ok, `<b>${ok ? "Perfect!" : `${items.filter(it => place[it.k] === it.b).length} of ${items.length} in the right box.`}</b> ${md(a.explain || "")}`);
    finish(ok);
  };
  draw();
};
ACT.order = (h, a, foot, finish) => {
  let list = shuffle(a.steps.map((t, k) => ({ t, k })));
  if (list.every((x, i) => x.k === i)) list.reverse();
  const draw = () => {
    const locked = !!h.dataset.locked;
    h.innerHTML = `<span class="eyebrow">${icon("route")} Order</span><h2>${esc(a.q)}</h2><p class="muted small">Use the arrows to move each step.</p>
      <ol class="order">${list.map((x, i) => `<li class="${locked ? (x.k === i ? "right" : "wrong") : ""}"><span class="num">${i + 1}</span><span class="t">${esc(x.t)}</span>${locked ? (x.k === i ? icon("check") : `<small>should be ${x.k + 1}</small>`) : `<span class="mv"><button data-i="${i}" data-d="-1" aria-label="Move up" ${i ? "" : "disabled"}>↑</button><button data-i="${i}" data-d="1" aria-label="Move down" ${i < list.length - 1 ? "" : "disabled"}>↓</button></span>`}</li>`).join("")}</ol><div id="fb"></div>`;
    $$(".mv button", h).forEach(b => b.onclick = () => { const i = +b.dataset.i, j = i + +b.dataset.d; [list[i], list[j]] = [list[j], list[i]]; draw(); });
  };
  foot.innerHTML = `<button class="btn primary wide">Check</button>`;
  foot.firstChild.onclick = () => {
    h.dataset.locked = 1; const ok = list.every((x, i) => x.k === i); draw();
    $("#fb", h).innerHTML = feedback(ok, `<b>${ok ? "Right order!" : "Here is the right order."}</b> ${ok ? "" : `<ol class="small">${a.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>`}${md(a.explain || "")}`);
    finish(ok);
  };
  draw();
};
ACT.reflect = (h, a, foot, finish, id) => {
  h.innerHTML = `<span class="eyebrow">${icon("note")} Reflect</span><h2>${esc(a.q)}</h2><textarea id="note" rows="5" placeholder="${esc(a.placeholder || "")}">${esc(S.notes[id] || "")}</textarea><p class="muted small">Your answer is saved in <b>Profile › My notes</b>. Only you can see it.</p>`;
  foot.innerHTML = `<button class="btn primary wide" disabled>Save</button>`;
  const ta = $("#note", h), btn = foot.firstChild;
  const upd = () => btn.disabled = ta.value.trim().length < 5; ta.oninput = upd; upd();
  btn.onclick = () => { S.notes[id] = ta.value.trim(); save(); toast("Saved in My notes"); finish(null, true); };
};

/* ---------- final quiz and certificate ---------- */
const passMark = () => Math.ceil(COURSE().quiz.length * 0.75);
ROUTES.quiz = v => {
  const c = COURSE();
  if (!allUnitsDone()) { toast("Complete all the units to unlock the quiz."); return go("academy"); }
  let i = 0, score = 0;
  const qs = c.quiz.map(q => { const order = shuffle(q.options.map((o, k) => k)); return { q: q.q, options: order.map(k => q.options[k]), answer: order.indexOf(q.answer) }; });
  const draw = () => {
    if (i === qs.length) return result();
    const q = qs[i];
    v.innerHTML = `<div class="player"><div class="player-top"><a href="#academy" class="icon-btn" aria-label="Close quiz">${icon("close")}</a><div class="steps">${qs.map((_, k) => `<i class="${k < i ? "done" : ""} ${k === i ? "now" : ""}"></i>`).join("")}</div><span class="xp-pill">${score}/${qs.length}</span></div>
      <div class="act card"><span class="eyebrow">${icon("quiz")} Final quiz · question ${i + 1} of ${qs.length}</span><h2>${esc(q.q)}</h2><div class="opts">${q.options.map((o, k) => `<button class="opt" data-k="${k}"><span class="opt-l">${"ABC"[k]}</span><span>${esc(o)}</span></button>`).join("")}</div></div><div class="player-foot" id="foot"></div></div>`;
    $$(".opt", v).forEach(b => b.onclick = () => {
      const k = +b.dataset.k, ok = k === q.answer; if (ok) score++;
      $$(".opt", v).forEach(x => { x.disabled = true; x.classList.toggle("right", +x.dataset.k === q.answer); x.classList.toggle("wrong", +x.dataset.k === k && !ok); });
      $("#foot").innerHTML = `<button class="btn primary wide">${i === qs.length - 1 ? "See result" : "Next question"} ${icon("arrow")}</button>`;
      $("#foot button").onclick = () => { i++; draw(); };
    });
  };
  const result = () => {
    const pass = score >= passMark(), prev = S.quiz;
    if (!prev || score > prev.score) S.quiz = { score, of: qs.length, pass, d: todayISO() };
    if (pass && !S.certs.some(x => x.id === c.id)) { S.certs.push({ id: c.id, title: c.title, name: USER.name, d: todayISO(), score }); addXP(50, `Certificate earned: ${c.title}`); }
    else save();
    v.innerHTML = `<div class="celebrate card"><div class="medal ${pass ? "" : "grey"}">${icon(pass ? "cert" : "quiz")}</div><h1>${pass ? "You passed!" : "Almost there"}</h1><p class="big-score">${score} / ${qs.length}</p>
      <p>${pass ? "Your certificate is ready." : `You need ${passMark()} correct answers. Review the units and try again.`}</p>
      <div class="row gap center">${pass ? `<a class="btn primary" href="#cert/${c.id}">${icon("cert")} View certificate</a>` : `<a class="btn primary" href="#quiz" onclick="setTimeout(route)">Try again</a>`}<a class="btn" href="#academy">Course map</a></div></div>
      ${pass ? `<div class="card tip-course"><p><b>Next step:</b> put it into practice. Your school can use an Erasmus+ grant to send you on an eMove course.</p>${courseCTA(pickCourse().pathway)}</div>` : ""}`;
  };
  draw();
};
ROUTES.cert = (v, [id]) => {
  const c = S.certs.find(x => x.id === id); if (!c) return go("academy");
  v.innerHTML = `<div class="row gap no-print"><a class="back" href="#academy">${icon("back")} Course map</a><button class="btn primary" onclick="window.print()">${icon("print")} Print or save as PDF</button></div>
    <div class="cert"><div class="cert-in">${MARK(64)}<span class="eyebrow">EMOVE Profe · eMove Academy</span><h1>Certificate of completion</h1><p>This certifies that</p><p class="cert-name">${esc(c.name || (USER && USER.name) || "")}</p>
    <p>has completed the online microcourse</p><p class="cert-course">${esc(c.title)}</p><p class="muted">About ${COURSE().minutes} minutes · ${COURSE().units.length} units · final quiz ${c.score}/${COURSE().quiz.length}</p>
    <div class="cert-foot"><span>${new Date(c.d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span><span>eMove Academy · A European Teacher Academy</span></div>
    <p class="cert-note">Certificate of completion of a free online microcourse. It is not an official qualification.</p></div></div>`;
};

ROUTES.glossary = v => {
  v.innerHTML = `<a class="back" href="#academy">${icon("back")} Course map</a><div class="page-h"><h1>${icon("open")} Erasmus+ glossary</h1><p class="muted">The words you will find in calls, forms and guides.</p></div>
    <label class="search wide">${icon("search")}<input id="gq" placeholder="Search a term…"></label><dl class="gloss" id="gl"></dl>`;
  const draw = q => { $("#gl").innerHTML = GLOSSARY.filter(([t, d]) => !q || (t + d).toLowerCase().includes(q)).map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join("") || `<p class="muted">No terms found.</p>`; };
  $("#gq").oninput = e => draw(e.target.value.toLowerCase()); draw("");
};
