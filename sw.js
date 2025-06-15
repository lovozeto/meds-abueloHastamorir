// sw.js

// This event is fired when a user clicks on a notification.
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification.tag);
  
  // Close the notification
  event.notification.close();
  
  // This opens the app window (or focuses it if it's already open).
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window for the app is already open, focus it.
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      // Otherwise, open a new window.
      return clients.openWindow('/');
    })
  );
});

// A simple console.log to confirm the service worker is installed.
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalado');
});

// And another to confirm activation.
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activado');
    // This line is important to ensure the service worker takes control immediately.
    return self.clients.claim();
});
