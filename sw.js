const CACHE_NAME = 'meds-pwa-cache-v1';
const urlsToCache = [
    './', // Cacha el index.html
    './index.html',
    './manifest.json',
    // Asegúrate de que los íconos existan en tu carpeta 'icons'
    './icons/icon-72x72.png',
    './icons/icon-96x96.png',
    './icons/icon-128x128.png',
    './icons/icon-144x144.png',
    './icons/icon-152x152.png',
    './icons/icon-192x192.png',
    './icons/icon-384x384.png',
    './icons/icon-512x512.png',
    // URLs de CDN utilizadas en index.html que deben ser cacheadas para offline
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

// Evento 'install': se activa cuando el Service Worker se instala por primera vez.
// Aquí, abrimos un caché y agregamos todos los activos esenciales.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Cacheando archivos estáticos');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('Service Worker: Error al cachear', error);
            })
    );
});

// Evento 'fetch': se activa cada vez que la aplicación hace una solicitud de red.
// Aquí, intentamos servir desde el caché primero, y si no está, vamos a la red.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si encontramos una respuesta en el caché, la devolvemos.
                if (response) {
                    return response;
                }
                // Si no está en el caché, hacemos la solicitud de red.
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Opcional: Si quieres cachear nuevas solicitudes de red,
                        // clona la respuesta y agrégala al caché.
                        return caches.open(CACHE_NAME).then(cache => {
                            // Solo cachear respuestas exitosas y que no sean opacas (cross-origin)
                            if (networkResponse.ok || networkResponse.type === 'opaque') {
                                cache.put(event.request, networkResponse.clone());
                            }
                            return networkResponse;
                        });
                    });
            })
            .catch((error) => {
                console.error('Service Worker: Error en la solicitud fetch', event.request.url, error);
                // Aquí podrías servir una página offline si la solicitud falla completamente.
                // Por ejemplo, `return caches.match('/offline.html');`
            })
    );
});

// Evento 'activate': se activa cuando el Service Worker se activa.
// Aquí, limpiamos cachés antiguos para liberar espacio.
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Eliminando caché antiguo', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Registrar el Service Worker en index.html
/*
// En tu index.html, añade esto al final del <script> principal o en un nuevo bloque:
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registrado con éxito:', registration.scope);
            })
            .catch(error => {
                console.error('Fallo el registro del Service Worker:', error);
            });
    });
}
*/