const CACHE = "ieq-salvador-v1";
const ARQUIVOS = [
  "./",
  "./css/base.css",
  "./css/conteudo.css",
  "./js/projeto.js",
  "./img/hero.svg",
  "./img/reflexao.svg",
  "./img/pastores.svg",
  "./favicon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ARQUIVOS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((chaves) =>
      Promise.all(chaves.filter((chave) => chave !== CACHE).map((chave) => caches.delete(chave))),
    ),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((salvo) => salvo || fetch(event.request)),
  );
});
