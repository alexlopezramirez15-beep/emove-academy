# -*- coding: utf-8 -*-
"""Public website of EMOVE Profe, generated into dist/.

/                     home: what it is, microcourse, resources, eMove courses, how access works
/guides/              free Erasmus+ guides (web/guides.py)
/resources/           preview of the resource library (full resources need an account)
/privacy/             privacy notice
/app/                 the platform (built by build.py)
"""
import html, pathlib, re

from guides import GUIDES

E = html.escape
SITE_NAME = "EMOVE Profe"
EMOVE = "https://www.emoveacademy.com"
MAIL = "emovecourses@gmail.com"

IC = {
    "academy": '<path d="M2 9.5 12 5l10 4.5-10 4.5z"/><path d="M6 11.5V16c0 1.2 2.7 3 6 3s6-1.8 6-3v-4.5"/><path d="M22 9.5V15"/>',
    "book": '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/><path d="M8 7h7"/>',
    "open": '<path d="M2 5c3-1 6-1 10 1 4-2 7-2 10-1v14c-3-1-6-1-10 1-4-2-7-2-10-1z"/><path d="M12 6v14"/>',
    "plane": '<path d="M21 15.5 13.5 11V5a1.5 1.5 0 0 0-3 0v6L3 15.5V17l7.5-2.2V19L8 20.5V22l4-1 4 1v-1.5L13.5 19v-4.2L21 17z"/>',
    "cert": '<rect x="3" y="4" width="18" height="13" rx="1.5"/><circle cx="16" cy="15" r="3"/><path d="M14.5 17.5 14 21l2-1 2 1-.5-3.5M7 8h8M7 11h5"/>',
    "check": '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    "arrow": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "lock": '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "pin": '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.5"/>',
    "user": '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    "shield": '<path d="M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6z"/><path d="m9 12 2 2 4-4"/>',
    "external": '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    "spark": '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="m6 6 2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    "target": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    "heart": '<path d="M12 20s-7.5-4.5-7.5-10A4.3 4.3 0 0 1 12 7.5 4.3 4.3 0 0 1 19.5 10C19.5 15.5 12 20 12 20z"/>',
    "hands": '<circle cx="8" cy="6" r="2.5"/><circle cx="16" cy="6" r="2.5"/><path d="M3.5 20c0-4 2-7 4.5-7s3.5 1.5 4 3c.5-1.5 1.5-3 4-3s4.5 3 4.5 7"/>',
    "stars": '<circle cx="12" cy="12" r="9"/><path d="m12 7.5 1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z"/>',
    "compass": '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    "leaf": '<path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15"/><path d="M5 19 13 11"/>',
    "wallet": '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M16 14.5h2"/><path d="M6 6V5a2 2 0 0 1 2-2h9"/>',
    "route": '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h8a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h8"/>',
    "quiz": '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6"/>',
}


def ic(k, cls=""):
    return f'<svg class="ic {cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{IC.get(k, "")}</svg>'


MARK_SVG = '<circle cx="32" cy="32" r="31" fill="#1965B8"/><polygon points="56.0,28.9 56.8,30.9 58.9,31.0 57.2,32.4 57.8,34.5 56.0,33.3 54.2,34.5 54.8,32.4 53.1,31.0 55.2,30.9" fill="#FFCA05"/><polygon points="52.8,40.9 53.5,42.9 55.7,43.0 54.0,44.4 54.6,46.5 52.8,45.3 51.0,46.5 51.5,44.4 49.8,43.0 52.0,42.9" fill="#FFCA05"/><polygon points="44.0,49.7 44.8,51.7 46.9,51.8 45.2,53.2 45.8,55.3 44.0,54.1 42.2,55.3 42.8,53.2 41.1,51.8 43.2,51.7" fill="#FFCA05"/><polygon points="32.0,52.9 32.8,54.9 34.9,55.0 33.2,56.4 33.8,58.5 32.0,57.3 30.2,58.5 30.8,56.4 29.1,55.0 31.2,54.9" fill="#FFCA05"/><polygon points="20.0,49.7 20.8,51.7 22.9,51.8 21.2,53.2 21.8,55.3 20.0,54.1 18.2,55.3 18.8,53.2 17.1,51.8 19.2,51.7" fill="#FFCA05"/><polygon points="11.2,40.9 12.0,42.9 14.2,43.0 12.5,44.4 13.0,46.5 11.2,45.3 9.4,46.5 10.0,44.4 8.3,43.0 10.5,42.9" fill="#FFCA05"/><polygon points="8.0,28.9 8.8,30.9 10.9,31.0 9.2,32.4 9.8,34.5 8.0,33.3 6.2,34.5 6.8,32.4 5.1,31.0 7.2,30.9" fill="#FFCA05"/><polygon points="11.2,16.9 12.0,18.9 14.2,19.0 12.5,20.4 13.0,22.5 11.2,21.3 9.4,22.5 10.0,20.4 8.3,19.0 10.5,18.9" fill="#FFCA05"/><polygon points="20.0,8.1 20.8,10.2 22.9,10.3 21.2,11.6 21.8,13.7 20.0,12.5 18.2,13.7 18.8,11.6 17.1,10.3 19.2,10.2" fill="#FFCA05"/><polygon points="32.0,4.9 32.8,6.9 34.9,7.0 33.2,8.4 33.8,10.5 32.0,9.3 30.2,10.5 30.8,8.4 29.1,7.0 31.2,6.9" fill="#FFCA05"/><polygon points="44.0,8.1 44.8,10.2 46.9,10.3 45.2,11.6 45.8,13.7 44.0,12.5 42.2,13.7 42.8,11.6 41.1,10.3 43.2,10.2" fill="#FFCA05"/><polygon points="52.8,16.9 53.5,18.9 55.7,19.0 54.0,20.4 54.6,22.5 52.8,21.3 51.0,22.5 51.5,20.4 49.8,19.0 52.0,18.9" fill="#FFCA05"/><circle cx="32" cy="32" r="15.5" fill="#FFCA05"/><path d="M23.5 39.5c0-6.5 4-10.5 10.5-10.5h3" fill="none" stroke="#1965B8" stroke-width="5" stroke-linecap="round"/><path d="M35.5 21.5 45 29l-9.5 7.5z" fill="#1965B8" stroke="#1965B8" stroke-width="2" stroke-linejoin="round"/>'


def mark(s=34):
    return f'<svg class="mark" width="{s}" height="{s}" viewBox="0 0 64 64" aria-hidden="true">{MARK_SVG}</svg>'


def logo():
    return f'<span class="logo">{mark(34)}<span class="logo-t"><b>EMOVE</b> Profe</span></span>'


def md(text):
    """Tiny markdown: ## headings, - lists, **bold**, *italic*, [link](url), paragraphs."""
    out, lst = [], []

    def inline(s):
        s = E(s)
        s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
        s = re.sub(r"\*(.+?)\*", r"<i>\1</i>", s)
        return re.sub(r"\[(.+?)\]\((https?://[^)]+)\)", r'<a href="\2" target="_blank" rel="noopener">\1</a>', s)

    def flush():
        if lst:
            out.append("<ul>" + "".join(f"<li>{inline(x)}</li>" for x in lst) + "</ul>")
            lst.clear()

    for block in text.strip().split("\n"):
        line = block.strip()
        if not line:
            flush()
            continue
        if line.startswith("- "):
            lst.append(line[2:])
            continue
        flush()
        if line.startswith("## "):
            out.append(f"<h2>{inline(line[3:])}</h2>")
        else:
            out.append(f"<p>{inline(line)}</p>")
    flush()
    return "\n".join(out)


def page(title, desc, body, path, ver, root=""):
    canon = path if path.endswith("/") else path + "/"
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{E(title)}</title><meta name="description" content="{E(desc)}">
<meta property="og:title" content="{E(title)}"><meta property="og:description" content="{E(desc)}"><meta property="og:type" content="website">
<link rel="icon" type="image/svg+xml" href="/icons/favicon.svg"><link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="/web.css?v={ver}"></head><body class="site">
<header class="top"><a href="/" class="brand" aria-label="{SITE_NAME} home">{logo()}</a>
<nav class="snav"><a href="/guides/" class="{'on' if canon.startswith('/guides/') else ''}">Erasmus+ guides</a><a href="/resources/" class="{'on' if canon.startswith('/resources/') else ''}">Resources</a><a href="{EMOVE}/courses" target="_blank" rel="noopener">eMove courses</a></nav>
<div class="sact"><a class="btn sm" href="/app/">Sign in</a><a class="btn sm primary" href="/app/#request">Request free access</a></div></header>
<main>{body}</main>
<footer class="sfoot"><div class="sfoot-in"><div>{logo()}<p>Free Erasmus+ training and classroom resources for European teachers, by <a href="{EMOVE}" target="_blank" rel="noopener">eMove Academy</a>.</p><p class="muted">Born in Spain. Built for Europe.</p></div>
<div><b>Platform</b><a href="/app/#request">Request access</a><a href="/app/">Sign in</a><a href="/guides/">Erasmus+ guides</a><a href="/resources/">Resources</a></div>
<div><b>eMove Academy</b><a href="{EMOVE}/courses" target="_blank" rel="noopener">Courses</a><a href="{EMOVE}/erasmus-plus" target="_blank" rel="noopener">Erasmus+</a><a href="{EMOVE}/for-schools" target="_blank" rel="noopener">For schools</a><a href="mailto:{MAIL}">{MAIL}</a></div>
<div><b>Legal</b><a href="/privacy/">Privacy notice</a></div></div></footer>
</body></html>"""


def home(d):
    course, res, pws, courses = d["COURSE"], d["RESOURCES"], {p["id"]: p for p in d["PATHWAYS"]}, d["EMOVE_COURSES"]
    units = "".join(f'<li><span class="u-n">{i + 1}</span><div><b>{E(u["title"])}</b><span>{E(u["goal"])}</span></div></li>' for i, u in enumerate(course["units"]))
    rescards = "".join(rcard(r, pws) for r in res[:6])
    ccards = "".join(f'''<a class="scourse" href="{E(c["url"])}" target="_blank" rel="noopener" style="--c:{pws[c["pathway"]]["color"]}"><span class="chip" style="--c:{pws[c["pathway"]]["color"]}">{E(pws[c["pathway"]]["name"])}</span><b>{E(c["title"])}</b><span>{E(c["sub"])}</span><small>{ic("pin")} {E(c["city"])} · {E(c["dates"])}</small></a>''' for c in courses)
    return f"""
<section class="hero"><div class="hero-in"><div class="hero-t"><span class="eyebrow">{ic("spark")} Free for teachers · by eMove Academy</span>
<h1>Learn how Erasmus+ can fund your training abroad.</h1>
<p>An interactive microcourse, ready-to-use classroom resources and clear guides for European teachers. Free, in English, at your own pace.</p>
<div class="row gap"><a class="btn primary lg" href="/app/#request">Request free access {ic("arrow")}</a><a class="btn lg ghost" href="/guides/">Read the free guides</a></div>
<ul class="ticks"><li>{ic("check")} {len(course["units"])} interactive units</li><li>{ic("check")} {len(res)} classroom resources</li><li>{ic("check")} Certificate of completion</li></ul></div>
<div class="hero-card"><div class="hc-top">{ic("academy")} <b>{E(course["title"])}</b></div><ol class="hc-path">{"".join(f'<li class="{"done" if i < 2 else "now" if i == 2 else ""}"><span>{ic("check") if i < 2 else i + 1}</span>{E(u["title"])}</li>' for i, u in enumerate(course["units"]))}</ol>
<div class="hc-q"><span class="eyebrow">Decide</span><p>Your school has never done Erasmus+. Four teachers want a course next summer. Which route fits best?</p><div class="hc-o ok">{ic("check")} KA122 short-term project</div><div class="hc-o">KA121 accredited project</div></div></div></div></section>

<section class="band"><div class="wrap"><h2>Everything a teacher needs to get started</h2><div class="g4">
<div class="feat">{ic("academy")}<b>Erasmus+ from scratch</b><p>A free interactive microcourse: routes, money, planning and impact, with instant feedback.</p></div>
<div class="feat">{ic("book")}<b>Classroom resources</b><p>Activities, routines and templates for every stage, ready to print and use tomorrow.</p></div>
<div class="feat">{ic("open")}<b>Clear guides</b><p>KA122, KA121, budgets and course choice explained in plain English.</p></div>
<div class="feat">{ic("plane")}<b>Courses abroad</b><p>Five-day eMove courses in Spain that your school can fund with an Erasmus+ grant.</p></div></div></div></section>

<section class="wrap split"><div><span class="eyebrow">{ic("academy")} Microcourse · about {course["minutes"]} minutes</span><h2>{E(course["title"])}</h2><p class="lead">{E(course["sub"])}. Every unit mixes short explanations with activities: decide in real school scenarios, sort, put steps in order and reflect on your own school.</p>
<a class="btn primary" href="/app/#request">Start for free {ic("arrow")}</a></div><ol class="units">{units}<li class="final"><span class="u-n">{ic("cert")}</span><div><b>Final quiz and certificate</b><span>Pass the quiz and download your certificate of completion.</span></div></li></ol></section>

<section class="band"><div class="wrap"><div class="sec-row"><h2>Resources for your class</h2><a class="link" href="/resources/">See all {len(res)} resources {ic("arrow")}</a></div>
<p class="muted">Organised by the seven eMove pathways. Each one comes with a step-by-step plan, materials and assessment ideas.</p><div class="g3">{rescards}</div></div></section>

<section class="wrap"><div class="sec-row"><h2>eMove courses · Summer 2027</h2><a class="link" href="{EMOVE}/courses" target="_blank" rel="noopener">emoveacademy.com {ic("external")}</a></div>
<p class="muted">Five days, 25 training hours, taught in English in small international groups. Erasmus+ compatible.</p><div class="g3">{ccards}</div></section>

<section class="band"><div class="wrap"><h2>How access works</h2><ol class="how">
<li><span>1</span><b>Request access</b><p>Tell us your name, school and country. It takes one minute.</p></li>
<li><span>2</span><b>We approve it</b><p>The eMove team reviews every request to keep the community for educators.</p></li>
<li><span>3</span><b>Learn and use</b><p>Sign in on any device, follow the course and save your favourite resources.</p></li></ol>
<div class="center"><a class="btn primary lg" href="/app/#request">Request free access {ic("arrow")}</a></div></div></section>"""


def rcard(r, pws, locked=False):
    p = pws[r["pathway"]]
    return f'''<a class="rcard" href="/app/#res/{r["id"]}" style="--c:{p["color"]}"><span class="chip" style="--c:{p["color"]}">{ic(p["icon"])} {E(p["name"])}</span><b>{E(r["title"])}</b><p>{E(r["summary"])}</p><small>{E(r["type"])} · {ic("clock")} {r["minutes"]} min{" · " + ic("lock") + " Free account" if locked else ""}</small></a>'''


def resources(d):
    pws = {p["id"]: p for p in d["PATHWAYS"]}
    groups = ""
    for p in d["PATHWAYS"]:
        rs = [r for r in d["RESOURCES"] if r["pathway"] == p["id"]]
        if rs:
            groups += f'<section class="pgroup"><h2 style="--c:{p["color"]}">{ic(p["icon"])} {E(p["name"])}</h2><p class="muted">{E(p["line"])}</p><div class="g3">{"".join(rcard(r, pws, True) for r in rs)}</div></section>'
    return f"""<section class="phead"><div class="wrap"><span class="eyebrow">{ic("book")} Resource library</span><h1>Classroom resources for European teachers</h1>
<p class="lead">Activities, routines and templates organised by the seven eMove pathways. Open them for free with your account.</p><a class="btn primary" href="/app/#request">Request free access {ic("arrow")}</a></div></section><div class="wrap">{groups}</div>"""


def guides_index():
    cards = "".join(f'<a class="gcard" href="/guides/{g["slug"]}/"><span class="eyebrow">{ic("clock")} {g["minutes"]} min read</span><b>{E(g["title"])}</b><p>{E(g["desc"])}</p><span class="link">Read the guide {ic("arrow")}</span></a>' for g in GUIDES)
    return f"""<section class="phead"><div class="wrap"><span class="eyebrow">{ic("open")} Erasmus+ guides</span><h1>Erasmus+ explained for teachers</h1>
<p class="lead">Short, practical guides to understand the programme. For the full interactive course, request free access.</p></div></section><div class="wrap"><div class="g2">{cards}</div>{cta_box()}</div>"""


def guide(g):
    others = "".join(f'<a href="/guides/{o["slug"]}/">{E(o["title"])}</a>' for o in GUIDES if o is not g)
    return f"""<article class="wrap article"><a class="back" href="/guides/">← All guides</a><span class="eyebrow">{ic("clock")} {g["minutes"]} min read</span><h1>{E(g["title"])}</h1><p class="lead">{E(g["desc"])}</p>
{md(g["body"])}
<p class="disclaimer">Summarised from the Erasmus+ Programme Guide. Rules, amounts and deadlines change every year: always check the current guide and your National Agency.</p>
{cta_box()}<aside class="more"><b>More guides</b>{others}</aside></article>"""


def cta_box():
    return f"""<div class="cta-box"><div><b>Learn it step by step, for free</b><p>The interactive microcourse <i>Erasmus+ from scratch</i> takes you from zero to a plan for your school, with a certificate at the end.</p></div><a class="btn primary" href="/app/#request">Request free access {ic("arrow")}</a></div>"""


def privacy():
    return f"""<article class="wrap article"><h1>Privacy notice</h1><p class="muted">Last updated: October 2026</p>
<h2>Who is responsible</h2><p>EMOVE Profe is run by eMove Academy (Barcelona, Spain). Contact: <a href="mailto:{MAIL}">{MAIL}</a>.</p>
<h2>What we collect</h2><ul><li>The details you give when you request access: name, email, school, country, role, stage, subject and interests.</li><li>Your password, stored only in encrypted form.</li><li>Your progress on the platform: completed activities, notes, saved resources, quiz results, certificates and the eMove courses you open.</li></ul>
<h2>Why we use it</h2><ul><li>To review your request and manage your access.</li><li>To keep your progress in sync across your devices.</li><li>To understand how the platform is used and improve it.</li><li>Only if you tick the box: to send you news about Erasmus+ deadlines and eMove courses. You can change this in your profile at any time.</li></ul>
<h2>Where it is stored</h2><p>Your account is stored with our hosting provider (Netlify). Your browser also keeps a local copy of your progress so the platform works offline. We do not use advertising or tracking cookies.</p>
<h2>How long we keep it</h2><p>While your account is active. Ask us to delete your account at any time and we will erase your details and progress.</p>
<h2>Your rights</h2><p>You can ask to access, correct or delete your data, or object to its use, by writing to <a href="mailto:{MAIL}">{MAIL}</a>. You can also complain to your data protection authority.</p></article>"""


def build(dist, data, ver):
    dist = pathlib.Path(dist)
    pages = {
        "/": page(f"{SITE_NAME} · Free Erasmus+ training for European teachers", "Learn how Erasmus+ can fund your training abroad: a free interactive microcourse, classroom resources and guides by eMove Academy.", home(data), "/", ver),
        "/resources/": page(f"Classroom resources · {SITE_NAME}", "Activities, routines and templates for European teachers, organised by the seven eMove pathways.", resources(data), "/resources/", ver),
        "/guides/": page(f"Erasmus+ guides for teachers · {SITE_NAME}", "Short, practical guides to understand Erasmus+ for school staff.", guides_index(), "/guides/", ver),
        "/privacy/": page(f"Privacy notice · {SITE_NAME}", "How EMOVE Profe uses your data.", privacy(), "/privacy/", ver),
    }
    for g in GUIDES:
        pages[f"/guides/{g['slug']}/"] = page(f"{g['title']} · {SITE_NAME}", g["desc"], guide(g), f"/guides/{g['slug']}/", ver)
    for path, htmltext in pages.items():
        out = dist / path.strip("/") / "index.html" if path != "/" else dist / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(htmltext)
    return pages
