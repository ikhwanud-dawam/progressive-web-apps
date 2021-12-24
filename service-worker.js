let staticCacheName = "pwa";

self.addEventListener("install", function (e) {
    e.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            return cache.addAll(["./"]);
        })
    );
});

self.addEventListener("fetch", function (event) {
    console.log(event.request.url);

    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('notificationclick', (e) => {
    var notification = e.notification
    var primaryKey = notification.data.primaryKey
    var action = e.action

    if(action === 'close'){
        notification.close()
    } else{
        clients.openWindow('https://ikhwanud-dawam.github.io/progressive-web-apps/')
        notification.close()
    }
})