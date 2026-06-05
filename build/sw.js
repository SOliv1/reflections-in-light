self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = {};

  try {
    payload = event.data ? event.data.json() : {};
  } catch (_error) {
    payload = {
      body: event.data ? event.data.text() : "",
    };
  }

  const title = payload.title || "Reflections in Light";
  const options = {
    body: payload.body || "Open the app to review your quiet actions.",
    icon: payload.icon || "/logo192.png",
    badge: payload.badge || "/logo192.png",
    tag: payload.tag || "reflections-reminder",
    renotify: Boolean(payload.renotify),
    actions: Array.isArray(payload.actions) ? payload.actions : [],
    data: {
      url: payload.data?.url || "/",
      ...payload.data,
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification?.data?.url || "/";

  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of clients) {
        if (client.url && client.url.startsWith(targetUrl) && typeof client.focus === "function") {
          await client.focus();
          return client;
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })()
  );
});
