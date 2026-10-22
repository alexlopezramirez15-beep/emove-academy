"""Builds the website and the platform into dist/.

dist/index.html          public website: one landing page in English and Spanish → web/website.py
dist/app/index.html      the platform: installable web app (PWA) with manifest, service worker and icons
"""
import hashlib, json, pathlib, shutil, subprocess, sys

root = pathlib.Path(__file__).parent
src = root / "src"
dist = root / "dist"
app = dist / "app"
FILES = ["data-emove.js", "data-course.js", "data-resources.js", "data-syllabus.js", "core.js", "accounts.js", "academy.js", "pages.js", "learn.js", "community.js"]

if dist.exists():
    shutil.rmtree(dist)
app.mkdir(parents=True)
css = (src / "styles.css").read_text()
js = "\n".join((src / f).read_text() for f in FILES)
boot = 'document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();'
FONTS = """<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">"""

# 1. the platform (PWA)
(app / "index.html").write_text(f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>EMOVE Profe</title>
<meta name="description" content="Free Erasmus+ training and classroom resources for European teachers, by eMove Academy.">
<meta name="theme-color" content="#101C38"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="EMOVE Profe"><link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/svg+xml" href="icons/favicon.svg"><link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32.png"><link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
{FONTS}
<style>{css}</style></head><body>
<script>
{js}
{boot}
if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js");
</script></body></html>""")
for d in (dist / "icons", app / "icons"):
    shutil.copytree(root / "public" / "icons", d)
shutil.copytree(root / "public" / "img", dist / "img")
manifest = {
    "name": "EMOVE Profe", "short_name": "EMOVE Profe", "lang": "en",
    "description": "Free Erasmus+ training and classroom resources for European teachers.",
    "start_url": "./", "scope": "./", "display": "standalone", "orientation": "any",
    "background_color": "#F6F3EE", "theme_color": "#101C38", "categories": ["education"],
    "icons": [
        {"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png"},
        {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png"},
        {"src": "icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
        {"src": "icons/favicon.svg", "sizes": "any", "type": "image/svg+xml"},
    ],
    "shortcuts": [{"name": "Learn", "url": "./#learn"}, {"name": "Resources", "url": "./#resources"}, {"name": "Community", "url": "./#community"}],
}
(app / "manifest.webmanifest").write_text(json.dumps(manifest, indent=2))
version = hashlib.sha1((app / "index.html").read_bytes()).hexdigest()[:10]
assets = ["./", "index.html", "manifest.webmanifest"] + [f"icons/{p.name}" for p in sorted((app / "icons").iterdir())]
(app / "sw.js").write_text((root / "public" / "sw.js").read_text().replace("__VERSION__", version).replace("__ASSETS__", json.dumps(assets)))

# 2. the public website
data = json.loads(subprocess.run(["node", str(root / "tools" / "export-data.mjs")], check=True, capture_output=True, text=True).stdout)
sys.path.insert(0, str(root / "web"))
import website  # web/website.py
(dist / "web.css").write_text(css + "\n" + (root / "web" / "web.css").read_text())
wver = hashlib.sha1((dist / "web.css").read_bytes()).hexdigest()[:10]
pages = website.build(dist, data, wver)
(dist / "robots.txt").write_text("User-agent: *\nAllow: /\nDisallow: /app/\n")
print("ok · app", version, "·", len(pages), "web pages")
