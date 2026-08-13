import { useEffect, useState } from "react"
import { scopedKey, USER_SCOPE_EVENT } from "./userScope"

const STREAK_BASE = "promptlabz:streak"

type StreakState = {
  count: number
  longest: number
  lastDay: string // YYYY-MM-DD
}

function todayKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function yesterdayKey(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return todayKey(d)
}

function read(): StreakState {
  if (typeof window === "undefined") return { count: 0, longest: 0, lastDay: "" }
  try {
    const raw = localStorage.getItem(scopedKey(STREAK_BASE))
    if (!raw) return { count: 0, longest: 0, lastDay: "" }
    const parsed = JSON.parse(raw) as Partial<StreakState>
    return {
      count: Number(parsed.count) || 0,
      longest: Number(parsed.longest) || 0,
      lastDay: typeof parsed.lastDay === "string" ? parsed.lastDay : "",
    }
  } catch {
    return { count: 0, longest: 0, lastDay: "" }
  }
}

function write(state: StreakState) {
  if (typeof window === "undefined") return
  localStorage.setItem(scopedKey(STREAK_BASE), JSON.stringify(state))
}

export function markStreakActivity(): StreakState {
  const today = todayKey()
  const current = read()

  if (current.lastDay === today) return current

  let count: number
  if (current.lastDay === yesterdayKey()) {
    count = current.count + 1
  } else {
    count = 1
  }
  const longest = Math.max(current.longest, count)
  const next: StreakState = { count, longest, lastDay: today }
  write(next)
  return next
}

export function getStreak(): StreakState {
  const current = read()
  if (!current.lastDay) return current
  if (current.lastDay === todayKey() || current.lastDay === yesterdayKey()) {
    return current
  }
  return { count: 0, longest: current.longest, lastDay: current.lastDay }
}

export function useStreak(): StreakState {
  const [state, setState] = useState<StreakState>(() => ({ count: 0, longest: 0, lastDay: "" }))

  useEffect(() => {
    setState(markStreakActivity())

    const onFocus = () => setState(markStreakActivity())
    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key.includes(STREAK_BASE)) setState(getStreak())
    }
    const onUserScope = () => setState(markStreakActivity())
    window.addEventListener("focus", onFocus)
    window.addEventListener("storage", onStorage)
    window.addEventListener(USER_SCOPE_EVENT, onUserScope)
    return () => {
      window.removeEventListener("focus", onFocus)
      window.removeEventListener("storage", onStorage)
      window.removeEventListener(USER_SCOPE_EVENT, onUserScope)
    }
  }, [])

  return state
}
