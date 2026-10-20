/* Local server: serves dist/ and runs the accounts API with a file store in .store/.
   ADMIN_EMAILS=you@example.com node tools/dev.mjs   →   http://localhost:8888 */
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = new URL("..", import.meta.url).pathname;
process.env.EP_STORE_DIR ||= path.join(root, ".store");
const { default: api } = await import(path.join(root, "netlify/functions/api.mjs"));
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml", ".png": "image/png", ".jpeg": "image/jpeg", ".txt": "text/plain" };
const PORT = +process.env.PORT || 8888;

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname.startsWith("/api/")) {
    const chunks = []; for await (const c of req) chunks.push(c);
    const r = await api(new Request(url, { method: req.method, headers: req.headers, body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks) }));
    res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(Buffer.from(await r.arrayBuffer())); return;
  }
  let file = path.join(root, "dist", decodeURIComponent(url.pathname));
  try { if ((await stat(file)).isDirectory()) file = path.join(file, "index.html"); res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }); res.end(await readFile(file)); }
  catch (e) { res.writeHead(404, { "content-type": "text/plain" }); res.end("Not found"); }
}).listen(PORT, () => console.log(`EMOVE Profe on http://localhost:${PORT}`));
