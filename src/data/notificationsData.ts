// ═══════════════════════════════════════════════════════════════════════════
// Notifications — Types & Helpers
// ═══════════════════════════════════════════════════════════════════════════

export type NotificationType = "achievement" | "mention" | "system" | "reminder"

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  description: string
  createdAt: string // ISO date
  unread: boolean
  mention: boolean
  actionLabel?: string
  href?: string
}

// ── Helpers ──────────────────────────────────────────────────────────────

export type NotificationsFilter = "all" | "unread" | "mentions"

export function getNotificationsCounts(
  notifications: AppNotification[]
): Record<NotificationsFilter, number> {
  const all = notifications.length
  const unread = notifications.filter((n) => n.unread).length
  const mentions = notifications.filter((n) => n.mention).length
  return { all, unread, mentions }
}

export function filterNotifications(
  notifications: AppNotification[],
  filter: NotificationsFilter
): AppNotification[] {
  switch (filter) {
    case "unread":
      return notifications.filter((n) => n.unread)
    case "mentions":
      return notifications.filter((n) => n.mention)
    default:
      return notifications
  }
}

export type NotificationGroup = {
  label: string
  items: AppNotification[]
}

/**
 * Group notifications into "Hoje" and "Anterior" based on their createdAt date.
 */
export function groupNotifications(notifications: AppNotification[]): NotificationGroup[] {
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10) // YYYY-MM-DD
  const yesterdayStr = new Date(today.getTime() - 86_400_000).toISOString().slice(0, 10)

  const todayItems: AppNotification[] = []
  const olderItems: AppNotification[] = []

  for (const n of notifications) {
    const dateStr = n.createdAt.slice(0, 10)
    if (dateStr === todayStr || dateStr === yesterdayStr) {
      todayItems.push(n)
    } else {
      olderItems.push(n)
    }
  }

  const groups: NotificationGroup[] = []
  if (todayItems.length > 0) groups.push({ label: "Hoje", items: todayItems })
  if (olderItems.length > 0) groups.push({ label: "Anterior", items: olderItems })
  return groups
}
