const CACHE_NAME = "one-piece-rpg-app-v15";
const CACHE_PREFIX = "one-piece-rpg-app-";

const APP_SHELL = [
  "./",
  "./index.html",
  "./download.html",
  "./lobby.html",
  "./aventura.html",
  "./inventario.html",
  "./atributos.html",
  "./habilidades.html",
  "./missoes.html",
  "./treinos.html",
  "./biblioteca-itens.html",
  "./amigos.html",
  "./eventos.html",
  "./correio.html",
  "./perfil.html",
  "./loja.html",
  "./conquistas.html",
  "./bando.html",
  "./estilo.css",
  "./musica-fundo.js",
  "./rpg-sistemas.js",
  "./banco-personagens.js?v=20260619-db2",
  "./supabase-config.js",
  "./mares-dados.js",
  "./mar-rota.js",
  "./mar-rota.css",
  "./downloads/one-piece-rpg-pc-app.html",
  "./downloads/one-piece-rpg-android-app.html",
  "./downloads/one-piece-rpg-ios-app.html",
  "./fundo-login.jpeg",
  "./fundo-login.mp4",
  "./assets/audio/drums-of-liberation.mp3",
  "./assets/img/app-logo-source.jpeg",
  "./assets/img/app-logo-192.png",
  "./assets/img/app-logo-512.png",
  "./favicon.ico",
  "./assets/img/menu-lobby.jpeg",
  "./assets/img/botao-entrar-aventura.jpeg",
  "./assets/img/botao-registros.jpeg",
  "./assets/img/menu-game/atributos.webp",
  "./assets/img/menu-game/inventario.webp",
  "./assets/img/menu-game/lojas.webp",
  "./assets/img/menu-game/eventos.webp",
  "./assets/img/menu-game/missoes.webp",
  "./assets/img/menu-game/treinos.webp",
  "./assets/img/menu-game/habilidades.webp",
  "./assets/img/menu-game/amigos.webp",
  "./assets/img/menu-game/organizacao.webp",
  "./assets/img/menu-game/aparencia.webp",
  "./assets/img/menu-game/ajustes.webp",
  "./assets/img/menu-game/viagem.webp",
  "./assets/mares/mar-sprite.webp",
  "./assets/mares/mar-east.webp",
  "./assets/mares/mar-north.webp",
  "./assets/mares/mar-south.webp",
  "./assets/mares/mar-west.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key === CACHE_NAME ? false : key.startsWith(CACHE_PREFIX) || key.includes("one-piece"))
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

function salvarNoCache(request, response) {
  if (!response || !response.ok) return response;
  if (deveBuscarSempreNaRede(request)) return response;
  const copy = response.clone();
  caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
  return response;
}

function deveBuscarSempreNaRede(request) {
  const destino = new URL(request.url);
  const aceitaHtml = request.headers.get("accept") || "";
  return request.mode === "navigate" ||
    aceitaHtml.includes("text/html") ||
    destino.pathname.endsWith(".html") ||
    destino.pathname.endsWith(".css") ||
    destino.pathname.endsWith(".js") ||
    destino.pathname.endsWith(".webmanifest");
}

function buscarRedePrimeiro(event) {
  const request = deveBuscarSempreNaRede(event.request)
    ? new Request(event.request, { cache: "no-store" })
    : event.request;

  return fetch(request)
    .then((response) => salvarNoCache(event.request, response))
    .catch(() => caches.match(event.request).then((cached) => {
      if (cached) return cached;
      if (event.request.mode === "navigate") return caches.match("./index.html");
      return caches.match("./assets/img/app-logo-192.png");
    }));
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (deveBuscarSempreNaRede(event.request)) {
    event.respondWith(buscarRedePrimeiro(event));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || buscarRedePrimeiro(event))
  );
});
