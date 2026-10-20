// Servidor estático simples para testar o PWA localmente (sem dependências).
// Uso: node server.mjs  ->  http://localhost:8080
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = fileURLToPath(new URL(".", import.meta.url));
const porta = process.env.PORT || 8080;

const tipos = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8"
};

createServer(async (req, res) => {
  try {
    let caminho = decodeURIComponent(req.url.split("?")[0]);
    if (caminho === "/") caminho = "/index.html";
    const arquivo = join(raiz, normalize(caminho).replace(/^(\.\.[/\\])+/, ""));
    const info = await stat(arquivo);
    if (!info.isFile()) throw new Error("não é arquivo");
    const dados = await readFile(arquivo);
    res.writeHead(200, {
      "Content-Type": tipos[extname(arquivo)] || "application/octet-stream",
      "Cache-Control": "no-cache"
    });
    res.end(dados);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 - não encontrado");
  }
}).listen(porta, () => {
  console.log(`PWA rodando em http://localhost:${porta}`);
});
