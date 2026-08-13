// ═══════════════════════════════════════════════════════════════════════════
// useInactiveReminder — Detects when the user hasn't accessed in 12+ hours
// and hasn't visited today, then triggers a push notification.
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useRef } from "react"
import { insertNotification } from "@/lib/db"
import { supabase } from "@/lib/supabase"

// ── Storage keys ──────────────────────────────────────────────────────────
const LAST_ACTIVITY_KEY = "promptlabz:lastActivity" // ISO timestamp
const REMINDER_ENABLED_KEY = "promptlabz:reminderEnabled" // "true" | "false"
const LAST_NOTIFIED_KEY = "promptlabz:lastNotifiedDay" // "YYYY-MM-DD"
const HAS_ACCOUNT_KEY = "promptlabz:hasAccount" // "true" | undefined

// ── Motivational messages ─────────────────────────────────────────────────
const DAILY_MISSIONS_MESSAGES = [
  "Suas missões diárias estão te esperando! Complete-as e ganhe XP extra. 🎯",
  "Hora de cumprir as missões de hoje! Cada uma te deixa mais perto do próximo baú. 📦",
  "Que tal dar uma olhada nas missões diárias? São rapidinhas e valem XP! ⚡",
  "Você tem missões pendentes hoje — bora completar? 💪",
]

const MODULE_MESSAGES = [
  "Continue de onde parou — seu módulo atual está pegando fogo! 🔥",
  "Uma nova lição te espera! 10 minutinhos e você aprende algo novo. 📚",
  "Não quebre sua sequência! Dá um pulo na sua trilha de aprendizado. 🧠",
  "O conhecimento de hoje é o superpoder de amanhã. Vem aprender! ✨",
  "Sabia que 10 minutos por dia já fazem diferença? Sua lição te espera. ⏰",
]

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ── Read preference ───────────────────────────────────────────────────────
function isReminderEnabled(): boolean {
  if (typeof window === "undefined") return false
  try {
    return localStorage.getItem(REMINDER_ENABLED_KEY) !== "false"
  } catch {
    return true // enabled by default
  }
}

function hasAccount(): boolean {
  if (typeof window === "undefined") return false
  try {
    return localStorage.getItem(HAS_ACCOUNT_KEY) === "true"
  } catch {
    return false
  }
}

function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

// ── Check & show notification ─────────────────────────────────────────────
function checkAndNotify() {
  if (typeof window === "undefined") return
  if (!("Notification" in window)) return // browser doesn't support it
  if (!isReminderEnabled()) return // user disabled reminders
  if (Notification.permission === "denied") return
  if (!hasAccount()) return // only for users with an account

  try {
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY)
    const lastNotifiedDay = localStorage.getItem(LAST_NOTIFIED_KEY)
    const today = todayKey()

    // Already notified today — skip
    if (lastNotifiedDay === today) return

    // If never visited, don't notify (first time user)
    if (!lastActivity) return

    const lastActivityTime = new Date(lastActivity).getTime()
    const now = Date.now()
    const hoursSinceLastActivity = (now - lastActivityTime) / (1000 * 60 * 60)

    // Must be at least 12 hours since last activity AND last activity was not today
    const lastActivityDay = lastActivity.slice(0, 10)
    if (hoursSinceLastActivity < 12 || lastActivityDay === today) return

    // Request permission if needed
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          showNotification()
        }
      })
      return
    }

    if (Notification.permission === "granted") {
      showNotification()
    }
  } catch {
    // Silently fail — notifications are non-critical
  }
}

function showNotification() {
  const today = todayKey()

  // Decide which message to show (50/50 between daily missions and module)
  const useMissionMessage = Math.random() < 0.5
  const title = useMissionMessage ? "🎯 Missões do dia!" : "📚 Hora de aprender!"
  const body = useMissionMessage ? pickRandom(DAILY_MISSIONS_MESSAGES) : pickRandom(MODULE_MESSAGES)
  const url = useMissionMessage ? "/daily-missions" : "/home"

  try {
    // Try using the service worker first (better PWA experience)
    if (navigator.serviceWorker?.ready) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body,
          icon: "/assets/favicon.png",
          badge: "/assets/favicon.png",
          tag: "promptlabz-reminder",
          data: { url },
          requireInteraction: true,
        } as NotificationOptions)
      })
    } else {
      // Fallback: use the Notification API directly
      const notif = new Notification(title, {
        body,
        icon: "/assets/favicon.png",
        tag: "promptlabz-reminder",
        data: { url },
      })
      notif.onclick = () => {
        window.focus()
        window.location.href = url
        notif.close()
      }
    }

    // Try to also insert an in-app notification via Supabase
    insertInAppNotification(title, body, url)

    // Mark as notified today so we don't spam
    localStorage.setItem(LAST_NOTIFIED_KEY, today)
  } catch {
    // Silently fail
  }
}

// ── In-app notification via Supabase ───────────────────────────────────────
function insertInAppNotification(title: string, description: string, href: string) {
  try {
    supabase.auth.getSession().then(({ data }) => {
      const userId = data.session?.user?.id
      if (!userId) return

      insertNotification(userId, {
        type: "reminder",
        title,
        description,
        action_label: "Ver agora",
        href,
      })
    })
  } catch {
    // Silently fail — in-app notification is a nice-to-have
  }
}

// ── Record activity (internal — called AFTER check) ───────────────────────
function recordActivity() {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(LAST_ACTIVITY_KEY, new Date().toISOString())
  } catch {
    // Silently fail
  }
}

// ── Enable / disable reminders ────────────────────────────────────────────
export function setReminderEnabled(enabled: boolean) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(REMINDER_ENABLED_KEY, enabled ? "true" : "false")
    // Request permission when enabling
    if (enabled && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  } catch {
    // Silently fail
  }
}

export function getReminderEnabled(): boolean {
  return isReminderEnabled()
}

// ── Runner: check then record (preserves ordering) ─────────────────────────
function runCheck() {
  checkAndNotify() // must run BEFORE recordActivity so the 12h check reads the old timestamp
  recordActivity() // updates timestamp so future checks work correctly
}

// ── Hook — call once at app root ──────────────────────────────────────────
export function useInactiveReminder() {
  const checkedRef = useRef(false)

  useEffect(() => {
    // Check on mount (page load / SPA navigation)
    if (!checkedRef.current) {
      checkedRef.current = true
      runCheck()
    }

    // Check when user comes back to the tab
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        runCheck()
      }
    }
    document.addEventListener("visibilitychange", onVisibility)

    // Check on focus (e.g., switching back to browser)
    const onFocus = () => runCheck()
    window.addEventListener("focus", onFocus)

    return () => {
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("focus", onFocus)
    }
  }, [])
}
