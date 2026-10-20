/* =============================================
   Service Worker — cache offline do PWA
   ============================================= */
const CACHE = "esportes-escola-v1";

const RECURSOS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/app.js",
  "./manifest.webmanifest",
  "./favicon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./img/hero.svg",
  "./img/jiu-banner.svg",
  "./img/volei-banner.svg",
  "./img/jiu-armbar.svg",
  "./img/jiu-triangulo.svg",
  "./img/jiu-kimura.svg",
  "./img/volei-saque.svg",
  "./img/volei-passe.svg",
  "./img/volei-ataque.svg"
];

// Instalação: pré-carrega tudo
self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(RECURSOS)).then(() => self.skipWaiting())
  );
});

// Ativação: limpa caches antigos
self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((chaves) =>
        Promise.all(chaves.filter((chave) => chave !== CACHE).map((chave) => caches.delete(chave)))
      )
      .then(() => self.clients.claim())
  );
});

// Requisições: rede primeiro, cache como reserva (offline)
self.addEventListener("fetch", (evento) => {
  const requisicao = evento.request;
  if (requisicao.method !== "GET") return;

  evento.respondWith(
    caches.match(requisicao).then((resposta) => {
      const naRede = fetch(requisicao)
        .then((respostaRede) => {
          if (respostaRede && respostaRede.status === 200 && respostaRede.type === "basic") {
            const copia = respostaRede.clone();
            caches.open(CACHE).then((cache) => cache.put(requisicao, copia));
          }
          return respostaRede;
        })
        .catch(() => resposta || caches.match("./index.html"));

      return resposta || naRede;
    })
  );
});
