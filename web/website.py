# -*- coding: utf-8 -*-
"""Public website of EMOVE Profe: one interactive landing page in English and Spanish, generated into dist/index.html.

The page is rendered once per language. English is served in the HTML; Spanish travels in a <template> and the
language switch swaps them (remembered in localStorage, ?lang=es forces it). All interactions use event delegation,
so they keep working after a swap. The platform itself lives at /app/ (built by build.py).
"""
import html, json, pathlib, re

from guides import GUIDES, ES as GUIDES_ES, TAB_EN

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
    "x": '<path d="M6 6l12 12M18 6 6 18"/>',
    "arrow": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "back": '<path d="M19 12H5M11 6l-6 6 6 6"/>',
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
    "bed": '<path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="2"/>',
    "school": '<path d="M3 21h18M5 21V10l7-5 7 5v11"/><path d="M10 21v-5h4v5"/>',
    "train": '<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 21l1.5-4M15 21l-1.5-4"/><circle cx="9" cy="14" r=".8"/><circle cx="15" cy="14" r=".8"/>',
    "people": '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.3-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.8c1.6.8 2.6 2.6 3 5.2"/>',
    "calendar": '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    "send": '<path d="M21 3 10 14"/><path d="m21 3-7 18-4-7-7-4z"/>',
    "share": '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>',
    "globe": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z"/>',
    "refresh": '<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 20v-4h-4"/>',
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
            out.append(f"<h3>{inline(line[3:])}</h3>")
        else:
            out.append(f"<p>{inline(line)}</p>")
    flush()
    return "\n".join(out)


# ---------- Spanish versions of the data shown on the page (the platform data stays in English) ----------
PW_ES = {
    "future": ("Aprendizaje del futuro", "IA, pedagogía digital y tecnologías emergentes que transforman el aula."),
    "excellence": ("Excelencia docente", "Estrategias basadas en la evidencia que mejoran la enseñanza y los resultados."),
    "wellbeing": ("Bienestar", "Cuidar el bienestar del profesorado y del alumnado en comunidades resilientes."),
    "inclusion": ("Inclusión", "Aprendizaje equitativo, accesible y culturalmente sensible para todo el alumnado."),
    "citizenship": ("Ciudadanía europea", "Identidad europea, valores compartidos, derechos y participación democrática."),
    "leadership": ("Liderazgo", "Liderar centros, departamentos y equipos en el cambio y la innovación."),
    "sustainability": ("Sostenibilidad", "Educación para el desarrollo sostenible y la ciudadanía global."),
}
TYPE_ES = {"Activity": "Actividad", "Lesson plan": "Plan de clase", "Routine": "Rutina", "Template": "Plantilla"}
RES_ES = {
    "mission-escape": ("Misión: escape en 15 minutos", "Convierte un repaso en una misión: los equipos abren cuatro candados resolviendo retos."),
    "ai-feedback-check": ("La IA como amiga crítica", "El alumnado compara el feedback de una IA con una rúbrica y decide qué acepta, corrige o descarta."),
    "think-routine": ("Veo, pienso, me pregunto en 10 minutos", "Una rutina de pensamiento para abrir cualquier tema con una imagen, un objeto o un gráfico."),
    "exit-ticket": ("Tres tickets de salida que cambian la clase de mañana", "Tres formatos rápidos para saber en dos minutos qué ha entendido tu grupo."),
    "staff-wellbeing": ("Check-in de bienestar de 15 minutos para el claustro", "Una rutina breve y segura para abrir reuniones y reducir el aislamiento."),
    "calm-corner": ("Crea un rincón de la calma con tu clase", "El alumnado diseña un espacio y una rutina para calmarse antes de volver al trabajo."),
    "udl-menu": ("Un menú de aprendizaje para cada alumno", "El mismo objetivo con tres formas de entrada (leer, ver o hacer) y tres de salida."),
    "strengths-cards": ("Cartas de fortalezas", "El alumnado descubre y nombra las fortalezas de sus compañeros para crear una identidad de grupo positiva."),
    "school-grounds": ("Ruta matemática por el patio", "Saca las matemáticas fuera: medir, estimar y mapear cosas reales del centro."),
    "waste-audit": ("Auditoría de residuos del aula", "El alumnado mide los residuos de su aula durante una semana y propone un cambio real."),
    "europe-map": ("Nuestra clase en el mapa de Europa", "El alumnado traza las conexiones europeas de su vida: comida, familia, música, viajes, productos."),
    "change-canvas": ("Plan de cambio en una página para equipos directivos", "Una plantilla de una página para planificar un cambio en tu centro, de la necesidad a la evidencia."),
    "mobility-plan": ("Mi plan de movilidad Erasmus+", "Una plantilla para preparar una movilidad: objetivos, plan de difusión y evidencias de impacto."),
}
COURSE_ES = {
    "game-on": "Convierte el aprendizaje en retos, misiones y experiencias en las que el alumnado quiera participar",
    "ai-teacher": "Transforma tu docencia con una inteligencia artificial ética",
    "think": "Enseña al alumnado a pensar, no qué pensar",
    "shine": "Convierte las diferencias de aprendizaje en oportunidades de éxito",
    "outside": "Saca el aprendizaje fuera de las paredes del aula",
    "happy": "Previene el burnout y redescubre la alegría de enseñar",
}
UNITS_ES = [
    ("Qué ofrece Erasmus+ al profesorado", "Entiende qué paga Erasmus+ y quién lo solicita."),
    ("Elige tu vía", "Descubre qué puerta puede usar tu centro: KA122, acreditación o consorcio."),
    ("Planifica una movilidad que cambie cosas", "Conecta objetivos, curso y preparación con las necesidades de tu centro."),
    ("El dinero", "Qué cubre la beca y cómo se calcula."),
    ("Antes, durante y después", "Convierte tu movilidad en un impacto que puedas demostrar."),
]
DATES_ES = {"July": "julio"}


def landing(d, L):
    """The whole page body (header, sections, footer) in language L ("en" or "es")."""
    es = L == "es"

    def t(en, es_):
        return es_ if es else en

    pws = {p["id"]: p for p in d["PATHWAYS"]}
    course, res, courses = d["COURSE"], d["RESOURCES"], d["EMOVE_COURSES"]

    def pname(pid):
        return PW_ES[pid][0] if es else pws[pid]["name"]

    def dates(s):
        if not es:
            return s
        for k, v in DATES_ES.items():
            s = s.replace(k, v)
        return re.sub(r"(\d+)–(\d+) ", r"\1–\2 de ", s)

    req = f'/app/#request'
    app_note = f'<p class="app-note">{ic("globe")} La plataforma de momento está en inglés.</p>' if es else ""

    # ---------- header ----------
    nav = [("erasmus", t("Erasmus+", "Erasmus+")), ("course", t("Microcourse", "Microcurso")), ("resources", t("Resources", "Recursos")), ("courses", t("Courses abroad", "Cursos")), ("faq", t("FAQ", "Preguntas"))]
    header = f"""<header class="top"><a href="#top" class="brand" aria-label="{SITE_NAME}">{logo()}</a>
<nav class="snav">{"".join(f'<a href="#{k}">{E(v)}</a>' for k, v in nav)}</nav>
<div class="sact"><div class="lang" role="group" aria-label="{t("Language", "Idioma")}"><button type="button" data-lang="en" class="{"on" if not es else ""}" aria-pressed="{str(not es).lower()}">EN</button><button type="button" data-lang="es" class="{"on" if es else ""}" aria-pressed="{str(es).lower()}">ES</button></div>
<a class="btn sm hide-m" href="/app/">{t("Sign in", "Entrar")}</a><a class="btn sm primary" href="{req}">{t("Free access", "Acceso gratis")}</a></div></header>"""

    # ---------- hero with a live question ----------
    hero_opts = [("ka122", t("KA122 short-term project", "Proyecto de corta duración KA122"), True), ("ka121", t("KA121 accredited project", "Proyecto acreditado KA121"), False), ("alone", t("Each teacher applies alone", "Cada docente lo pide por su cuenta"), False)]
    hero = f"""<section class="hero" id="top"><div class="hero-in"><div class="hero-t reveal"><span class="eyebrow">{ic("spark")} {t("Free for teachers · by eMove Academy", "Gratis para docentes · de eMove Academy")}</span>
<h1>{t("Learn how Erasmus+ can fund your training abroad.", "Descubre cómo Erasmus+ puede pagar tu formación en el extranjero.")}</h1>
<p>{t("An interactive microcourse, ready-to-use classroom resources and clear answers for European teachers. Free and at your own pace.", "Un microcurso interactivo, recursos listos para el aula y respuestas claras para el profesorado europeo. Gratis y a tu ritmo.")}</p>
<div class="row gap"><a class="btn primary lg" href="{req}">{t("Request free access", "Solicita acceso gratis")} {ic("arrow")}</a><a class="btn lg ghost" href="#finder">{t("Find your route", "Encuentra tu vía")}</a></div>
<ul class="ticks"><li>{ic("check")} {len(course["units"])} {t("interactive units", "unidades interactivas")}</li><li>{ic("check")} {len(res)} {t("classroom resources", "recursos de aula")}</li><li>{ic("check")} {t("Certificate", "Certificado")}</li></ul></div>
<div class="hero-card reveal" data-quiz="hero"><div class="hc-top">{ic("quiz")} <b>{t("Try it: a 10-second question", "Pruébalo: una pregunta de 10 segundos")}</b></div>
<p class="hc-q-t">{t("Your school has never done Erasmus+. Four teachers want a course next summer. Which route fits best?", "Tu centro nunca ha hecho Erasmus+. Cuatro docentes quieren hacer un curso el próximo verano. ¿Qué vía encaja mejor?")}</p>
{"".join(f'<button type="button" class="hc-o" data-ok="{1 if ok else 0}">{E(txt)}</button>' for _, txt, ok in hero_opts)}
<p class="hc-fb" data-fb-ok hidden>{ic("check")} {t("Right! KA122 is designed for schools without an accreditation: up to 30 participants, 6 to 18 months.", "¡Correcto! KA122 está pensado para centros sin acreditación: hasta 30 participantes, de 6 a 18 meses.")}</p>
<p class="hc-fb bad" data-fb-bad hidden>{ic("x")} {t("Not quite. KA121 needs an accreditation, and teachers never apply alone: the school does. Try again.", "Casi. KA121 necesita acreditación y el docente nunca lo pide solo: lo pide el centro. Prueba otra vez.")}</p>
</div></div></section>"""

    # ---------- what Erasmus+ pays for (tap cards) ----------
    acts = [
        ("academy", t("Courses", "Cursos"), t("2 to 30 days", "De 2 a 30 días"), t("A structured course with teachers from other countries. The most common first step.", "Un curso estructurado con docentes de otros países. El primer paso más habitual.")),
        ("people", t("Job shadowing", "Job shadowing"), t("2 to 60 days", "De 2 a 60 días"), t("Observe colleagues in a school or organisation abroad and bring their practice home.", "Observa a colegas en un centro u organización de otro país y trae su práctica a tu aula.")),
        ("school", t("Teaching assignments", "Docencia"), t("2 to 365 days", "De 2 a 365 días"), t("Teach in a partner school abroad and share your own methods.", "Da clase en un centro socio del extranjero y comparte tus métodos.")),
    ]
    erasmus = f"""<section class="band" id="erasmus"><div class="wrap"><div class="sec-h reveal"><span class="eyebrow">{ic("globe")} Erasmus+</span><h2>{t("Erasmus+ pays for teachers to learn abroad", "Erasmus+ paga para que el profesorado se forme en el extranjero")}</h2>
<p class="lead">{t("Your school applies, the European Union funds it. Tap each option to see what it is.", "Lo solicita tu centro y lo financia la Unión Europea. Toca cada opción para ver qué es.")}</p></div>
<div class="g3 flips">{"".join(f'<button type="button" class="flip reveal" aria-expanded="false"><span class="flip-f">{ic(i, "big")}<b>{E(a)}</b><small>{E(b)}</small><em>{t("Tap to see", "Toca para ver")}</em></span><span class="flip-b"><b>{E(a)}</b><span>{E(c)}</span></span></button>' for i, a, b, c in acts)}</div>
{route_finder(t)}
</div></section>"""

    # ---------- the money: interactive explorer ----------
    money = [
        ("train", t("Travel", "Viaje"), t("A fixed amount based on the distance band between your town and the destination. Green travel (train, bus, car-sharing) receives a higher amount.", "Un importe fijo según la franja de distancia entre tu localidad y el destino. El viaje sostenible (tren, autobús, coche compartido) recibe más.")),
        ("bed", t("Individual support", "Apoyo individual"), t("A daily amount for accommodation and living costs. It depends on the destination country.", "Un importe diario para alojamiento y manutención. Depende del país de destino.")),
        ("academy", t("Course fees", "Tasas del curso"), t("For structured courses: an amount per participant per day of the course, up to a maximum per participant.", "Para cursos estructurados: un importe por participante y día de curso, con un máximo por participante.")),
        ("school", t("Organisational support", "Apoyo organizativo"), t("A fixed amount per participant for the school's work: preparation, follow-up and sharing results.", "Un importe fijo por participante para el trabajo del centro: preparación, seguimiento y difusión.")),
        ("heart", t("Inclusion support", "Apoyo a la inclusión"), t("Extra funding for participants with fewer opportunities or special needs.", "Financiación extra para participantes con menos oportunidades o necesidades especiales.")),
        ("x", t("Not covered", "No cubre"), t("Private extensions of the trip, extra holiday days and personal expenses that are not part of the learning activity.", "Ampliaciones privadas del viaje, días extra de vacaciones y gastos personales ajenos a la actividad.")),
    ]
    money_sec = f"""<section class="wrap" id="money"><div class="split money reveal"><div><span class="eyebrow">{ic("wallet")} {t("The grant", "La beca")}</span><h2>{t("What does the grant cover?", "¿Qué cubre la beca?")}</h2>
<p class="lead">{t("Erasmus+ uses fixed amounts per participant, per day or per distance. Your school shows the activity happened, not every receipt.", "Erasmus+ usa importes fijos por participante, por día o por distancia. Tu centro demuestra que la actividad se hizo, no cada factura.")}</p>
<div class="mtabs" role="tablist">{"".join(f'<button type="button" role="tab" class="mtab{" on" if n == 0 else ""}{" no" if k == "x" else ""}" data-m="{n}" aria-selected="{"true" if n == 0 else "false"}">{ic(k)} {E(a)}</button>' for n, (k, a, _) in enumerate(money))}</div></div>
<div class="mpanel">{"".join(f'<div class="mp{" no" if k == "x" else ""}" data-mp="{n}"{"" if n == 0 else " hidden"}>{ic(k, "big")}<b>{E(a)}</b><p>{E(b)}</p></div>' for n, (k, a, b) in enumerate(money))}
<p class="disclaimer">{t("Amounts change every year: check the current Erasmus+ Programme Guide and your National Agency.", "Los importes cambian cada año: consulta la Guía del Programa Erasmus+ vigente y tu Agencia Nacional.")}</p></div></div></section>"""

    # ---------- timeline ----------
    steps = [
        ("calendar", t("Sep – Jan", "Sep – ene"), t("Prepare", "Prepara"), t("Agree the needs of your school, choose the teachers and pick courses that answer those needs.", "Acordad las necesidades del centro, elegid a los docentes y buscad cursos que respondan a ellas.")),
        ("send", t("February", "Febrero"), t("Apply", "Solicita"), t("The main KA121 and KA122 deadline is usually in February. Some countries open a second KA122 round in the autumn.", "El plazo principal de KA121 y KA122 suele ser en febrero. Algunos países abren una segunda convocatoria de KA122 en otoño.")),
        ("check", t("May – Jul", "May – jul"), t("Results", "Resolución"), t("Your National Agency publishes the results and the school signs the grant agreement.", "Tu Agencia Nacional publica la resolución y el centro firma el convenio de subvención.")),
        ("plane", t("Summer", "Verano"), t("Go", "Viaja"), t("Five days of training abroad with teachers from all over Europe.", "Cinco días de formación en el extranjero con docentes de toda Europa.")),
        ("share", t("Back home", "A la vuelta"), t("Share", "Comparte"), t("Try what you learned with your class, share it with colleagues and write the final report.", "Prueba lo aprendido en clase, compártelo con el claustro y redacta el informe final.")),
    ]
    timeline = f"""<section class="band" id="year"><div class="wrap"><div class="sec-h reveal"><span class="eyebrow">{ic("calendar")} {t("The Erasmus+ year", "El año Erasmus+")}</span><h2>{t("From idea to classroom in five steps", "De la idea al aula en cinco pasos")}</h2></div>
<ol class="tl reveal" role="tablist">{"".join(f'<li><button type="button" role="tab" class="tl-b{" on" if n == 1 else ""}" data-tl="{n}" aria-selected="{"true" if n == 1 else "false"}"><span>{ic(k)}</span><b>{E(w)}</b><small>{E(m)}</small></button></li>' for n, (k, m, w, _) in enumerate(steps))}</ol>
<div class="tl-p">{"".join(f'<p data-tlp="{n}"{"" if n == 1 else " hidden"}><b>{E(w)} · {E(m)}.</b> {E(x)}</p>' for n, (_, m, w, x) in enumerate(steps))}</div>
<p class="disclaimer">{t("Dates change every year and country: always check your National Agency.", "Las fechas cambian cada año y en cada país: consulta siempre tu Agencia Nacional.")}</p></div></section>"""

    # ---------- microcourse with a mini quiz ----------
    units = course["units"]
    ulist = "".join(f'<li><span class="u-n">{i + 1}</span><div><b>{E(UNITS_ES[i][0] if es else u["title"])}</b><span>{E(UNITS_ES[i][1] if es else u["goal"])}</span></div></li>' for i, u in enumerate(units))
    tf = [
        (t("The teacher applies for the grant personally.", "El docente solicita la beca a título personal."), False, t("False: the school (or a consortium) applies to its National Agency.", "Falso: lo solicita el centro (o un consorcio) a su Agencia Nacional.")),
        (t("Travelling by train can bring a higher travel grant.", "Viajar en tren puede dar una ayuda de viaje mayor."), True, t("True: green travel receives a higher amount.", "Verdadero: el viaje sostenible recibe un importe mayor.")),
        (t("A school needs an accreditation for its first project.", "Un centro necesita acreditación para su primer proyecto."), False, t("False: KA122 is made for schools without an accreditation.", "Falso: KA122 está pensado para centros sin acreditación.")),
    ]
    quiz = "".join(f'''<li class="tfq" data-a="{1 if a else 0}"><p>{E(q)}</p><div class="row gap"><button type="button" class="btn sm" data-v="1">{t("True", "Verdadero")}</button><button type="button" class="btn sm" data-v="0">{t("False", "Falso")}</button></div><small class="tf-fb" hidden>{E(fb)}</small></li>''' for q, a, fb in tf)
    course_sec = f"""<section class="wrap" id="course"><div class="split reveal"><div><span class="eyebrow">{ic("academy")} {t("Microcourse", "Microcurso")} · {t("about", "unos")} {course["minutes"]} min</span><h2>{t("Erasmus+ from scratch", "Erasmus+ desde cero")}</h2>
<p class="lead">{t("Five short units with activities and instant feedback: decide in real school scenarios, sort, order and reflect on your own school.", "Cinco unidades breves con actividades y feedback inmediato: decide en situaciones reales, clasifica, ordena y reflexiona sobre tu centro.")}</p>
<ol class="units">{ulist}<li class="final"><span class="u-n">{ic("cert")}</span><div><b>{t("Final quiz and certificate", "Test final y certificado")}</b><span>{t("Pass the quiz and download your certificate.", "Aprueba el test y descarga tu certificado.")}</span></div></li></ol></div>
<div class="card mini"><span class="eyebrow">{ic("quiz")} {t("True or false?", "¿Verdadero o falso?")}</span><h3>{t("Test yourself in 30 seconds", "Ponte a prueba en 30 segundos")}</h3><ol class="tfl">{quiz}</ol>
<div class="mini-r" hidden><b class="mini-s"></b><p>{t("The full course goes much further, with a certificate at the end.", "El curso completo va mucho más allá, con certificado al final.")}</p><a class="btn primary" href="{req}">{t("Start the course for free", "Empieza el curso gratis")} {ic("arrow")}</a>{app_note}</div></div></div></section>"""

    # ---------- resources with pathway filter ----------
    used = [p for p in d["PATHWAYS"] if any(r["pathway"] == p["id"] for r in res)]
    chips = f'<button type="button" class="fchip on" data-f="all">{t("All", "Todos")}</button>' + "".join(f'<button type="button" class="fchip" data-f="{p["id"]}" style="--c:{p["color"]}">{ic(p["icon"])} {E(pname(p["id"]))}</button>' for p in used)
    rcards = "".join(f'''<a class="rcard" data-p="{r["pathway"]}" href="/app/#res/{r["id"]}" style="--c:{pws[r["pathway"]]["color"]}"><span class="chip" style="--c:{pws[r["pathway"]]["color"]}">{ic(pws[r["pathway"]]["icon"])} {E(pname(r["pathway"]))}</span><b>{E(RES_ES[r["id"]][0] if es else r["title"])}</b><p>{E(RES_ES[r["id"]][1] if es else r["summary"])}</p><small>{E(TYPE_ES.get(r["type"], r["type"]) if es else r["type"])} · {ic("clock")} {r["minutes"]} min · {ic("lock")} {t("Free account", "Cuenta gratis")}</small></a>''' for r in res)
    res_sec = f"""<section class="band" id="resources"><div class="wrap"><div class="sec-h reveal"><span class="eyebrow">{ic("book")} {t("Resource library", "Biblioteca de recursos")}</span><h2>{t("Ideas for your class tomorrow", "Ideas para tu clase de mañana")}</h2>
<p class="lead">{t("Activities, routines and templates with a step-by-step plan. Filter by pathway.", "Actividades, rutinas y plantillas con un plan paso a paso. Filtra por itinerario.")}</p></div>
<div class="fchips" data-group="res">{chips}</div><div class="g3 rgrid" data-grid="res">{rcards}</div>{app_note}</div></section>"""

    # ---------- eMove courses with pathway filter ----------
    cused = [p for p in d["PATHWAYS"] if any(c["pathway"] == p["id"] for c in courses)]
    cchips = f'<button type="button" class="fchip on" data-f="all">{t("All", "Todos")}</button>' + "".join(f'<button type="button" class="fchip" data-f="{p["id"]}" style="--c:{p["color"]}">{ic(p["icon"])} {E(pname(p["id"]))}</button>' for p in cused)
    ccards = "".join(f'''<a class="scourse" data-p="{c["pathway"]}" href="{E(c["url"])}" target="_blank" rel="noopener" style="--c:{pws[c["pathway"]]["color"]}"><span class="chip" style="--c:{pws[c["pathway"]]["color"]}">{E(pname(c["pathway"]))}</span><b>{E(c["title"])}</b><span>{E(COURSE_ES[c["id"]] if es else c["sub"])}</span><small>{ic("pin")} {E(c["city"])} · {E(dates(c["dates"]))}</small><small>{ic("clock")} {t("5 days · 25 hours", "5 días · 25 horas")} · {E(c["price"])}</small></a>''' for c in courses)
    courses_sec = f"""<section class="wrap" id="courses"><div class="sec-h reveal"><span class="eyebrow">{ic("plane")} eMove Academy</span><h2>{t("Courses abroad · Summer 2027", "Cursos en el extranjero · Verano 2027")}</h2>
<p class="lead">{t("Five days in Spain, taught in English in small international groups, designed to fit Erasmus+ projects.", "Cinco días en España, en inglés y en grupos internacionales pequeños, pensados para proyectos Erasmus+.")}</p></div>
<div class="fchips" data-group="crs">{cchips}</div><div class="g3" data-grid="crs">{ccards}</div>
<p class="center more-l"><a class="link" href="{EMOVE}/courses" target="_blank" rel="noopener">{t("All courses on emoveacademy.com", "Todos los cursos en emoveacademy.com")} {ic("external")}</a></p></section>"""

    # ---------- guides as tabs ----------
    gtabs = "".join(f'<button type="button" role="tab" class="gtab{" on" if n == 0 else ""}" data-g="{n}" aria-selected="{"true" if n == 0 else "false"}">{E(GUIDES_ES[g["slug"]]["tab"] if es else TAB_EN[g["slug"]])}</button>' for n, g in enumerate(GUIDES))
    gpanels = "".join(f'<article class="gp" data-gp="{n}"{"" if n == 0 else " hidden"}><h3 class="gp-t">{E(GUIDES_ES[g["slug"]]["title"] if es else g["title"])}</h3>{md(GUIDES_ES[g["slug"]]["body"] if es else g["body"])}</article>' for n, g in enumerate(GUIDES))
    guides_sec = f"""<section class="band" id="guides"><div class="wrap narrow"><div class="sec-h reveal"><span class="eyebrow">{ic("open")} {t("Erasmus+ explained", "Erasmus+ explicado")}</span><h2>{t("Everything you need to know, in plain words", "Todo lo que necesitas saber, en palabras claras")}</h2></div>
<div class="gtabs" role="tablist">{gtabs}</div><div class="gbox">{gpanels}<p class="disclaimer">{t("Summarised from the Erasmus+ Programme Guide. Rules, amounts and deadlines change every year: always check the current guide and your National Agency.", "Resumen de la Guía del Programa Erasmus+. Las normas, importes y plazos cambian cada año: consulta siempre la guía vigente y tu Agencia Nacional.")}</p></div></div></section>"""

    # ---------- how access works + FAQ + privacy ----------
    how = f"""<section class="wrap" id="access"><div class="sec-h center reveal"><span class="eyebrow">{ic("user")} {t("Free access", "Acceso gratis")}</span><h2>{t("How access works", "Cómo funciona el acceso")}</h2></div><ol class="how">
<li class="reveal"><span>1</span><b>{t("Request access", "Solicita acceso")}</b><p>{t("Tell us your name, school and country. It takes one minute.", "Dinos tu nombre, centro y país. Es un minuto.")}</p></li>
<li class="reveal"><span>2</span><b>{t("We approve it", "Lo aprobamos")}</b><p>{t("The eMove team reviews every request to keep the community for educators.", "El equipo de eMove revisa cada solicitud para que la comunidad sea solo de docentes.")}</p></li>
<li class="reveal"><span>3</span><b>{t("Learn and use", "Aprende y usa")}</b><p>{t("Sign in on any device, follow the course and save your favourite resources.", "Entra desde cualquier dispositivo, haz el curso y guarda tus recursos favoritos.")}</p></li></ol>
<div class="center"><a class="btn primary lg" href="{req}">{t("Request free access", "Solicita acceso gratis")} {ic("arrow")}</a>{app_note}</div></section>"""

    faqs = [
        (t("Is it really free?", "¿De verdad es gratis?"), t("Yes. The microcourse, the resources and the certificate are free. You only need an approved account.", "Sí. El microcurso, los recursos y el certificado son gratis. Solo necesitas una cuenta aprobada.")),
        (t("Who can join?", "¿Quién puede entrar?"), t("Teachers, coordinators, school leaders and teacher trainers from any European country.", "Docentes, coordinadores, equipos directivos y formadores de cualquier país europeo.")),
        (t("Can my school pay an eMove course with Erasmus+?", "¿Mi centro puede pagar un curso de eMove con Erasmus+?"), t("Yes. eMove courses are structured courses designed for Erasmus+ KA1 projects, so the grant can cover the course fee, travel and daily costs.", "Sí. Los cursos de eMove son cursos estructurados pensados para proyectos KA1 de Erasmus+, así que la beca puede cubrir la matrícula, el viaje y los gastos diarios.")),
        (t("What language is the platform in?", "¿En qué idioma está la plataforma?"), t("The platform is in English, the common language of eMove courses.", "La plataforma está en inglés, el idioma común de los cursos de eMove.")),
        (t("How long does approval take?", "¿Cuánto tarda la aprobación?"), t("We review requests by hand, usually within a few days. You can check the status by signing in.", "Revisamos las solicitudes a mano, normalmente en pocos días. Puedes ver el estado al entrar.")),
    ]
    faq = f"""<section class="band" id="faq"><div class="wrap narrow"><div class="sec-h reveal"><span class="eyebrow">{ic("quiz")} {t("Questions", "Preguntas")}</span><h2>{t("Frequently asked questions", "Preguntas frecuentes")}</h2></div>
<div class="faq">{"".join(f'<details><summary>{E(q)}</summary><p>{E(a)}</p></details>' for q, a in faqs)}
<details id="privacy"><summary>{t("Privacy notice", "Aviso de privacidad")}</summary>{privacy(t)}</details></div></div></section>"""

    footer = f"""<footer class="sfoot"><div class="sfoot-in"><div>{logo()}<p>{t("Free Erasmus+ training and classroom resources for European teachers, by", "Formación Erasmus+ y recursos de aula gratis para el profesorado europeo, de")} <a href="{EMOVE}" target="_blank" rel="noopener">eMove Academy</a>.</p><p class="muted">Born in Spain. Built for Europe.</p></div>
<div><b>{t("Platform", "Plataforma")}</b><a href="{req}">{t("Request access", "Solicitar acceso")}</a><a href="/app/">{t("Sign in", "Entrar")}</a><a href="#guides">{t("Erasmus+ explained", "Erasmus+ explicado")}</a><a href="#resources">{t("Resources", "Recursos")}</a></div>
<div><b>eMove Academy</b><a href="{EMOVE}/courses" target="_blank" rel="noopener">{t("Courses", "Cursos")}</a><a href="{EMOVE}/erasmus-plus" target="_blank" rel="noopener">Erasmus+</a><a href="{EMOVE}/for-schools" target="_blank" rel="noopener">{t("For schools", "Para centros")}</a><a href="mailto:{MAIL}">{MAIL}</a></div>
<div><b>Legal</b><a href="#privacy" data-open="privacy">{t("Privacy notice", "Aviso de privacidad")}</a></div></div></footer>"""

    return header + "<main>" + hero + erasmus + money_sec + timeline + course_sec + res_sec + courses_sec + guides_sec + how + faq + "</main>" + footer


def route_finder(t):
    """Three questions that recommend KA121, a consortium, KA122 or accreditation. Steps and results are shown by the page script."""
    def q(n, text, opts):
        return f'<div class="rf-q" data-q="{n}"{"" if n == 1 else " hidden"}><b>{E(text)}</b><div class="rf-o">{"".join(f'<button type="button" class="btn" data-go="{go}">{E(lbl)}</button>' for lbl, go in opts)}</div></div>'

    results = {
        "ka121": (t("Use your school's KA121 budget", "Usa el presupuesto KA121 de tu centro"), t("Your school is accredited: it asks for a budget every year with KA121. Talk to your Erasmus+ coordinator about joining the next mobility.", "Tu centro está acreditado: pide presupuesto cada año con KA121. Habla con tu coordinador Erasmus+ para entrar en la próxima movilidad.")),
        "consortium": (t("Join a consortium", "Únete a un consorcio"), t("A coordinator with an accreditation organises mobilities for several schools. Ask them how to take part: it is the lightest way in.", "Un coordinador acreditado organiza movilidades para varios centros. Pregúntale cómo participar: es la forma más ligera de entrar.")),
        "ka122": (t("Start with a KA122 short-term project", "Empieza con un proyecto KA122"), t("Made for schools without an accreditation: up to 30 participants, 6 to 18 months. The usual deadline is in February.", "Pensado para centros sin acreditación: hasta 30 participantes, de 6 a 18 meses. El plazo habitual es en febrero.")),
        "accr": (t("Apply for an Erasmus accreditation", "Solicita la acreditación Erasmus"), t("If you plan mobilities every year, an accreditation (KA120) lets you request a KA121 budget each year. While you wait, a KA122 project gets you started.", "Si queréis movilidades cada año, la acreditación (KA120) os permite pedir presupuesto KA121 cada año. Mientras tanto, un KA122 os permite empezar.")),
    }
    return f"""<div class="rf card reveal" id="finder"><div class="rf-h"><span class="eyebrow">{ic("route")} {t("Route finder", "Buscador de vía")}</span><h3>{t("Which Erasmus+ route fits your school?", "¿Qué vía Erasmus+ encaja con tu centro?")}</h3><div class="rf-dots"><i class="on"></i><i></i><i></i></div></div>
{q(1, t("Does your school have an Erasmus accreditation?", "¿Tu centro tiene acreditación Erasmus?"), [(t("Yes", "Sí"), "r:ka121"), (t("No", "No"), "2"), (t("I don't know", "No lo sé"), "2")])}
{q(2, t("Does a local or regional authority run an Erasmus+ consortium you could join?", "¿Hay una administración local o regional con un consorcio Erasmus+ al que podáis uniros?"), [(t("Yes", "Sí"), "r:consortium"), (t("No / not sure", "No / no lo sé"), "3")])}
{q(3, t("How often would your school like to send teachers?", "¿Con qué frecuencia queréis enviar docentes?"), [(t("One project to start", "Un proyecto para empezar"), "r:ka122"), (t("Every year", "Cada año"), "r:accr")])}
{"".join(f'<div class="rf-r" data-r="{k}" hidden>{ic("check", "big")}<b>{E(a)}</b><p>{E(b)}</p></div>' for k, (a, b) in results.items())}
<button type="button" class="link rf-reset" hidden>{ic("refresh")} {t("Start again", "Empezar de nuevo")}</button></div>"""


def privacy(t):
    if t("en", "es") == "es":
        return f"""<div class="priv"><p class="muted">Última actualización: octubre de 2026</p>
<h4>Responsable</h4><p>EMOVE Profe lo gestiona eMove Academy (Barcelona, España). Contacto: <a href="mailto:{MAIL}">{MAIL}</a>.</p>
<h4>Qué datos recogemos</h4><ul><li>Los datos que das al solicitar acceso: nombre, email, centro, país, rol, etapa, materia e intereses.</li><li>Tu contraseña, guardada solo de forma cifrada.</li><li>Tu progreso en la plataforma: actividades completadas, notas, recursos guardados, resultados del test, certificados y los cursos de eMove que abres.</li></ul>
<h4>Para qué los usamos</h4><ul><li>Para revisar tu solicitud y gestionar tu acceso.</li><li>Para sincronizar tu progreso entre dispositivos.</li><li>Para entender cómo se usa la plataforma y mejorarla.</li><li>Solo si marcas la casilla: para enviarte novedades sobre plazos Erasmus+ y cursos de eMove. Puedes cambiarlo en tu perfil cuando quieras.</li></ul>
<h4>Dónde se guardan</h4><p>Tu cuenta se guarda en nuestro proveedor de alojamiento (Netlify). Tu navegador guarda también una copia local de tu progreso para que la plataforma funcione sin conexión. No usamos cookies de publicidad ni de seguimiento; esta web solo guarda en tu navegador el idioma que eliges.</p>
<h4>Cuánto tiempo</h4><p>Mientras tu cuenta esté activa. Pídenos borrar tu cuenta cuando quieras y eliminaremos tus datos y tu progreso.</p>
<h4>Tus derechos</h4><p>Puedes pedir acceder, corregir o borrar tus datos, u oponerte a su uso, escribiendo a <a href="mailto:{MAIL}">{MAIL}</a>. También puedes reclamar ante la autoridad de protección de datos.</p></div>"""
    return f"""<div class="priv"><p class="muted">Last updated: October 2026</p>
<h4>Who is responsible</h4><p>EMOVE Profe is run by eMove Academy (Barcelona, Spain). Contact: <a href="mailto:{MAIL}">{MAIL}</a>.</p>
<h4>What we collect</h4><ul><li>The details you give when you request access: name, email, school, country, role, stage, subject and interests.</li><li>Your password, stored only in encrypted form.</li><li>Your progress on the platform: completed activities, notes, saved resources, quiz results, certificates and the eMove courses you open.</li></ul>
<h4>Why we use it</h4><ul><li>To review your request and manage your access.</li><li>To keep your progress in sync across your devices.</li><li>To understand how the platform is used and improve it.</li><li>Only if you tick the box: to send you news about Erasmus+ deadlines and eMove courses. You can change this in your profile at any time.</li></ul>
<h4>Where it is stored</h4><p>Your account is stored with our hosting provider (Netlify). Your browser also keeps a local copy of your progress so the platform works offline. We do not use advertising or tracking cookies; this website only remembers the language you choose in your browser.</p>
<h4>How long we keep it</h4><p>While your account is active. Ask us to delete your account at any time and we will erase your details and progress.</p>
<h4>Your rights</h4><p>You can ask to access, correct or delete your data, or object to its use, by writing to <a href="mailto:{MAIL}">{MAIL}</a>. You can also complain to your data protection authority.</p></div>"""


META = {
    "en": (f"{SITE_NAME} · Free Erasmus+ training for European teachers", "Learn how Erasmus+ can fund your training abroad: a free interactive microcourse, classroom resources and clear answers by eMove Academy."),
    "es": (f"{SITE_NAME} · Formación Erasmus+ gratis para docentes", "Descubre cómo Erasmus+ puede pagar tu formación en el extranjero: microcurso interactivo, recursos de aula y respuestas claras de eMove Academy."),
}

SCRIPT = r"""
(function () {
  var KEY = "emove-web-lang", page = document.getElementById("page");
  var META = __META__;
  function store(l) { try { localStorage.setItem(KEY, l); } catch (e) {} }
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setLang(l, keep) {
    if (l !== "es") l = "en";
    if (document.documentElement.lang !== l) {
      var y = window.scrollY;
      page.innerHTML = document.getElementById("tpl-" + l).innerHTML;
      document.documentElement.lang = l;
      document.title = META[l][0];
      document.querySelector('meta[name="description"]').setAttribute("content", META[l][1]);
      window.scrollTo(0, y);
      reveal();
    }
    if (!keep) store(l);
  }
  var q = new URLSearchParams(location.search).get("lang");
  var first = q || saved() || ((navigator.language || "").toLowerCase().indexOf("es") === 0 ? "es" : "en");
  setLang(first, !q && !saved());

  function reveal() {
    var els = page.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }
  reveal();

  function tabs(btn, attr, panelAttr, scope) {
    var box = btn.closest(scope), n = btn.getAttribute(attr);
    box.querySelectorAll("[" + attr + "]").forEach(function (b) { var on = b === btn; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
    box.querySelectorAll("[" + panelAttr + "]").forEach(function (p) { p.hidden = p.getAttribute(panelAttr) !== n; });
  }

  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("button, a");
    if (!b) return;
    if (b.dataset.lang) return setLang(b.dataset.lang);
    if (b.dataset.open) { var d = document.getElementById(b.dataset.open); if (d) d.open = true; return; }
    // hero question
    if (b.classList.contains("hc-o")) {
      var card = b.closest(".hero-card"), ok = b.dataset.ok === "1";
      card.querySelectorAll(".hc-o").forEach(function (o) { o.classList.remove("ok", "no"); });
      b.classList.add(ok ? "ok" : "no");
      card.querySelector("[data-fb-ok]").hidden = !ok; card.querySelector("[data-fb-bad]").hidden = ok;
      return;
    }
    // flip cards
    if (b.classList.contains("flip")) { var f = b.classList.toggle("on"); b.setAttribute("aria-expanded", f); return; }
    // route finder
    if (b.dataset.go) {
      var rf = b.closest(".rf"), go = b.dataset.go;
      rf.querySelectorAll(".rf-q, .rf-r").forEach(function (x) { x.hidden = true; });
      if (go.indexOf("r:") === 0) { rf.querySelector('[data-r="' + go.slice(2) + '"]').hidden = false; rf.querySelector(".rf-reset").hidden = false; dots(rf, 3); }
      else { rf.querySelector('[data-q="' + go + '"]').hidden = false; dots(rf, +go - 1); }
      return;
    }
    if (b.classList.contains("rf-reset")) {
      var r = b.closest(".rf");
      r.querySelectorAll(".rf-q, .rf-r").forEach(function (x) { x.hidden = x.dataset.q !== "1"; });
      b.hidden = true; dots(r, 0); return;
    }
    if (b.dataset.m) return tabs(b, "data-m", "data-mp", ".money");
    if (b.dataset.tl) return tabs(b, "data-tl", "data-tlp", ".wrap");
    if (b.dataset.g) return tabs(b, "data-g", "data-gp", ".wrap");
    // true or false
    if (b.dataset.v && b.closest(".tfq")) {
      var li = b.closest(".tfq"); if (li.classList.contains("done")) return;
      var right = b.dataset.v === li.dataset.a;
      li.classList.add("done", right ? "ok" : "no"); b.classList.add("picked");
      li.querySelector(".tf-fb").hidden = false;
      var mini = li.closest(".mini"), all = mini.querySelectorAll(".tfq"), done = mini.querySelectorAll(".tfq.done");
      if (done.length === all.length) {
        var s = mini.querySelectorAll(".tfq.ok").length, es = document.documentElement.lang === "es";
        mini.querySelector(".mini-s").textContent = es ? s + " de " + all.length + " correctas" : s + " out of " + all.length + " right";
        mini.querySelector(".mini-r").hidden = false;
      }
      return;
    }
    // filters
    if (b.dataset.f) {
      var grp = b.closest(".fchips"), grid = grp.parentNode.querySelector('[data-grid="' + grp.dataset.group + '"]'), f2 = b.dataset.f;
      grp.querySelectorAll(".fchip").forEach(function (c) { c.classList.toggle("on", c === b); });
      grid.querySelectorAll("[data-p]").forEach(function (c) { c.hidden = f2 !== "all" && c.dataset.p !== f2; });
    }
  });
  function dots(rf, n) { rf.querySelectorAll(".rf-dots i").forEach(function (d, i) { d.classList.toggle("on", i <= n); }); }
  if (location.hash === "#privacy") { var p = document.getElementById("privacy"); if (p) p.open = true; }
})();
"""


def page(data, ver):
    en, es = landing(data, "en"), landing(data, "es")
    script = SCRIPT.replace("__META__", json.dumps(META))
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{E(META["en"][0])}</title><meta name="description" content="{E(META["en"][1])}">
<meta property="og:title" content="{E(META["en"][0])}"><meta property="og:description" content="{E(META["en"][1])}"><meta property="og:type" content="website">
<link rel="icon" type="image/svg+xml" href="/icons/favicon.svg"><link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="/web.css?v={ver}"></head><body class="site">
<div id="page">{en}</div>
<template id="tpl-en">{en}</template><template id="tpl-es">{es}</template>
<script>{script}</script>
</body></html>"""


def build(dist, data, ver):
    dist = pathlib.Path(dist)
    (dist / "index.html").write_text(page(data, ver))
    return {"/": True}
