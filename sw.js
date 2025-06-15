// Nombre de la caché. Incrementa la versión si cambias los activos cacheables.
// Cambiar el nombre de la caché (ej. de v1 a v2) fuerza al Service Worker a instalar una nueva caché
// y activar la limpieza de cachés antiguas en el evento 'activate'.
const CACHE_NAME = 'meds-pwa-cache-v2'; // Mantenemos v2, pero si ya intentaste con v2, cámbialo a v3 para forzar la actualización.

// Lista de URLs a cachear durante la instalación del Service Worker.
// ¡Importante! Las rutas locales DEBEN ser absolutas para GitHub Pages si la aplicación
// está en un subdirectorio (ej. /nombre-repo/).
const urlsToCache = [
    // La URL raíz de tu aplicación en GitHub Pages (sin index.html si es la página por defecto)
    '/meds-abueloHastamorir/',
    // Archivos principales de la aplicación
    '/meds-abueloHastamorir/index.html',
    '/meds-abueloHastamorir/manifest.json',
    '/meds-abueloHastamorir/sw.js',
    '/meds-abueloHastamorir/styles.css', // ¡CORREGIDO! Cambiado de 'style.css' a 'styles.css'
    '/meds-abueloHastamorir/app.js',     // Tu JS externo
    '/meds-abueloHastamorir/offline.html', // Página de fallback offline

    // Íconos de la PWA. Asegúrate de que existan en tu carpeta 'icons' dentro del repositorio.
    '/meds-abueloHastamorir/icons/icon-72x72.png',
    '/meds-abueloHastamorir/icons/icon-96x96.png',
    '/meds-abueloHastamorir/icons/icon-128x128.png',
    '/meds-abueloHastamorir/icons/icon-144x144.png',
    '/meds-abueloHastamorir/icons/icon-152x152.png',
    '/meds-abueloHastamorir/icons/icon-180x180.png', // Añadido para Apple Touch Icon
    '/meds-abueloHastamorir/icons/icon-192x192.png',
    '/meds-abueloHastamorir/icons/icon-384x384.png',
    '/meds-abueloHastamorir/icons/icon-512x512.png',
    // Tus otros iconos como 'share-image.png' y 'test.png' si quieres que también se cacheen
    '/meds-abueloHastamorir/icons/share-image.png',
    '/meds-abueloHastamorir/icons/test.png',


    // URLs de CDN utilizadas en index.html que deben ser cacheadas para el funcionamiento offline.
    // Aunque se cachean aquí, la mejor práctica para PWAs offline-first es auto-hospedar estos archivos
    // para tener control total sobre ellos y evitar posibles problemas de CORS o interrupciones de CDN.
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

// Evento 'install': se activa cuando el Service Worker se instala por primera vez.
// Aquí, abrimos un caché y agregamos todos los activos esenciales definidos en urlsToCache.
self.addEventListener('install', (event) => {
    // waitUntil asegura que el Service Worker no se considere instalado hasta que la promesa se resuelva.
    event.waitUntil(
        caches.open(CACHE_NAME) // Abre (o crea) el caché con el nombre definido
            .then((cache) => {
                console.log('Service Worker: Cacheando archivos estáticos...');
                // Añade todas las URLs a la caché. Si alguna falla, toda la instalación falla.
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                // Registra cualquier error durante el proceso de cacheo
                console.error('Service Worker: Error al cachear archivos durante la instalación:', error);
            })
    );
});

// Evento 'fetch': se activa cada vez que la aplicación (o el navegador) hace una solicitud de red.
// Aquí, implementamos una estrategia de "cache-first, then network, with offline fallback".
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request) // Intenta encontrar la solicitud en el caché
            .then((response) => {
                // Si encontramos una respuesta en el caché, la devolvemos inmediatamente.
                if (response) {
                    return response;
                }
                // Si no está en el caché, hacemos la solicitud de red.
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Si la solicitud de red es exitosa (estado 2xx) o es una respuesta opaca (cross-origin),
                        // clonamos la respuesta y la añadimos al caché para futuras visitas.
                        return caches.open(CACHE_NAME).then(cache => {
                            if (networkResponse.ok || networkResponse.type === 'opaque') {
                                cache.put(event.request, networkResponse.clone());
                            }
                            return networkResponse; // Devuelve la respuesta de la red
                        });
                    })
                    .catch((error) => {
                        // Este 'catch' se ejecuta si la solicitud de red falla (ej. sin conexión).
                        console.error('Service Worker: Fallo en la solicitud fetch:', event.request.url, error);

                        // Si la solicitud que falló era para una página HTML (navegación),
                        // intentamos servir una página de fallback offline desde el caché.
                        if (event.request.mode === 'navigate') {
                            console.log('Service Worker: Sirviendo página offline de fallback.');
                            return caches.match('/meds-abueloHastamorir/offline.html');
                        }
                        // Para otros tipos de recursos (imágenes, CSS, JS que no son HTML),
                        // si no están en caché y la red falla, simplemente rechazamos la promesa
                        // para que el navegador maneje el error (ej. mostrar un icono de imagen rota).
                        return Promise.reject(error);
                    });
            })
    );
});

// Evento 'activate': se activa cuando el Service Worker se activa (después de la instalación).
// Aquí, limpiamos las cachés antiguas para asegurar que solo la versión actual esté en uso.
self.addEventListener('activate', (event) => {
    // waitUntil asegura que el Service Worker no se active completamente hasta que se resuelva la promesa.
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            // Filtra y elimina todas las cachés que no coincidan con el CACHE_NAME actual.
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Eliminando caché antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
