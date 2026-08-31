// Dev-time only. Servidor estatico minimo para previsualizar el sitio.
// No se despliega.  Uso:  node tools/servidor.mjs 8765
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const PORT = Number(process.argv[2] || 8765);
const RAIZ = resolve(process.cwd());
const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    const abs = resolve(join(RAIZ, p));
    if (!abs.startsWith(RAIZ)) {
      res.writeHead(403).end("403");
      return;
    }
    await stat(abs);
    const buf = await readFile(abs);
    res.writeHead(200, {
      "Content-Type": TIPOS[extname(abs).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache, must-revalidate",
    });
    res.end(buf);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("404");
  }
}).listen(PORT, () => console.log("Tabaquillo en http://localhost:" + PORT + "/"));
