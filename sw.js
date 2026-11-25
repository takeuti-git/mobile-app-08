/// <reference lib="webworker" />
console.log("hello from sw.js");

const CACHE_NAME = "level-cache-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
];

self.addEventListener("install", (/** @type {ExtendableEvent} */e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener("fetch", (/** @type {FetchEvent} */e) => {
    if (e.request.method !== "GET") {
        return;
    }

    e.respondWith((async () => {
        const res = await caches.match(e.request);
        return res || fetch(e.request);
    })());

    // e.respondWith(
    //     caches.match(e.request).then((res) => {
    //         // キャッシュがあるならそれを返す、ないなら新しくwebサーバーから取得
    //         if (res) {
    //             return res;
    //         }
    //         return fetch(e.request);
    //     })
    // );
});

self.addEventListener("activate", (/** @type {ExtendableEvent} */e) => {
    e.waitUntil((async () => {
        const cacheNames = await caches.keys();
        return Promise.all(
            cacheNames
                .filter(name => name.startsWith("level-cache-") && name !== CACHE_NAME)
                .map(name => caches.delete(name))
        );
    })());
    // e.waitUntil(Promise.all(
    //     cacheNames
    //         .filter(name => name.startsWith("level-cache-") && name !== CACHE_NAME)
    //         .map(name => caches.delete(name))
    // ));
    //
    // e.waitUntil(
    //     caches.keys().then(cacheNames => {
    //         return Promise.all(
    //             cacheNames
    //                 .filter(name => name.startsWith("level-cache-") && name !== CACHE_NAME)
    //                 .map(name => caches.delete(name))
    //         );
    //     })
    // );
});
