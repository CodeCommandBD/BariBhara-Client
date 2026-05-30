/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

// Precache generated assets
precacheAndRoute(self.__WB_MANIFEST || []);

// Handle Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  
  const title = data.title || 'Bari Bhara';
  const options = {
    body: data.body || 'আপনার জন্য একটি নতুন মেসেজ আছে।',
    icon: '/icon-192.png',
    badge: '/icon-192.png', // Small icon for android status bar
    data: data.url || '/', // URL to open on click
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If the app is already open, focus on it and navigate
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If the app is closed, open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
