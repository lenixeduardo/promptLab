import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

/**
 * Namespaces localStorage keys by user.id, preventing different accounts
 * in the same browser from sharing progress, streak, avatar, missions, etc.
 * Also clears those keys on SIGNED_OUT.
 */

let cachedUid: string | null = null
let initialized = false

const SCOPED_PREFIXES = [
  "promptlabz:module-progress:v2",
  "promptlabz:streak",
  "promptlabz-avatar",
  "promptlabz-premium",
  "promptlabz:dailyMissions",
  "promptlabz:proof:",
  "promptlabz:lastStreakCelebrated",
  "promptlabz:specialQuestV2",
  "promptlabz:favorite_prompts",
  "promptlabz:favorite_skills",
]

const EVENT = "promptlabz:user-scope-change"

function clearScopedKeys() {
  if (typeof window === "undefined") return
  const toRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (!k) continue
    if (SCOPED_PREFIXES.some((p) => k.startsWith(p))) toRemove.push(k)
  }
  toRemove.forEach((k) => localStorage.removeItem(k))
}

export function initUserScope() {
  if (initialized || typeof window === "undefined") return
  initialized = true

  supabase.auth.getSession().then(({ data }) => {
    const uid = data.session?.user?.id ?? null
    if (uid !== cachedUid) {
      cachedUid = uid
      window.dispatchEvent(new CustomEvent(EVENT))
    }
  })

  supabase.auth.onAuthStateChange((event, session) => {
    const newUid = session?.user?.id ?? null
    if (event === "SIGNED_OUT") {
      clearScopedKeys()
    }
    if (newUid !== cachedUid) {
      cachedUid = newUid
      window.dispatchEvent(new CustomEvent(EVENT))
    }
  })
}

export function getUserId(): string | null {
  if (import.meta.env.VITE_PREVIEW_MODE === "true") return "preview"
  return cachedUid
}

export function scopedKey(base: string): string {
  const uid = cachedUid ?? "anon"
  return `${base}::u:${uid}`
}

export function useUserId(): string | null {
  const [uid, setUid] = useState<string | null>(cachedUid)
  useEffect(() => {
    const onChange = () => setUid(cachedUid)
    window.addEventListener(EVENT, onChange)
    return () => window.removeEventListener(EVENT, onChange)
  }, [])
  return uid
}

export const USER_SCOPE_EVENT = EVENT
