const CACHE_NAME = "calc-app-v1";
const ASSETS = [
  "/Never-/",
  "/Never-/index.html",
  "/Never-/manifest.json",
  "/Never-/icon-192.png",
  "/Never-/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
