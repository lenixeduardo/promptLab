// ═══════════════════════════════════════════════════════════════════════════
// PromptLabz — Service Worker
// Handles push notifications and notification clicks for the PWA.
// ═══════════════════════════════════════════════════════════════════════════

const SW_VERSION = "1.0.0"
const CACHE_NAME = `promptlabz-v${SW_VERSION}`

// ── Install ─────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  self.skipWaiting()
})

// ── Activate ────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim())
})

// ── Push Event (from server — ready for future push server integration) ─
self.addEventListener("push", (event) => {
  if (!event.data) return

  try {
    const data = event.data.json()

    const options = {
      title: data.title || "PromptLabz",
      body: data.body || "",
      icon: data.icon || "/assets/favicon.png",
      badge: "/assets/favicon.png",
      tag: data.tag || "promptlabz-reminder",
      data: {
        url: data.url || "/home",
        timestamp: Date.now(),
      },
      vibrate: [200, 100, 200],
      requireInteraction: true,
    }

    event.waitUntil(self.registration.showNotification(options.title, options))
  } catch {
    // If not JSON, just show the body as text
    const options = {
      body: event.data.text(),
      icon: "/assets/favicon.png",
      badge: "/assets/favicon.png",
      tag: "promptlabz-reminder",
      requireInteraction: true,
    }
    event.waitUntil(self.registration.showNotification("PromptLabz", options))
  }
})

// ── Notification Click ──────────────────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const urlToOpen = event.notification.data?.url || "/home"

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // If a window tab is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.focus()
            client.navigate(urlToOpen)
            return
          }
        }
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})
