const CACHE = "ieq-salvador-v3";
const ARQUIVOS = [
  "./",
  "./css/base.css",
  "./css/conteudo.css",
  "./js/projeto.js",
  "./img/avante.jpg",
  "./img/reflexao.svg",
  "./img/logo.png",
  "./img/pastores.webp",
  "./favicon.png",
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
    fetch(event.request)
      .then((resposta) => {
        const copia = resposta.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copia));
        return resposta;
      })
      .catch(() => caches.match(event.request)),
  );
});
