import { useEffect, useState } from "react"
import { scopedKey, getUserId, USER_SCOPE_EVENT } from "./userScope"
import { saveModuleProgress, fetchModuleProgress } from "./db"

const BASE_KEY = "promptlabz:module-progress:v2"

export type TrackId = "a1" | "a2" | "a3" | "a4"

// A1 starts pre-completed as the initial experience
const DEFAULTS: Record<TrackId, number> = {
  a1: 7,
  a2: 0,
  a3: 0,
  a4: 0,
}

type State = Partial<Record<TrackId, number>>

function readAll(): State {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(scopedKey(BASE_KEY))
    return raw ? (JSON.parse(raw) as State) : {}
  } catch {
    return {}
  }
}

function writeAll(state: State) {
  if (typeof window === "undefined") return
  localStorage.setItem(scopedKey(BASE_KEY), JSON.stringify(state))
  window.dispatchEvent(new CustomEvent("module-progress-change"))
}

function read(track: TrackId): number {
  const all = readAll()
  const stored = all[track]
  const fallback = DEFAULTS[track]
  return typeof stored === "number" && Number.isFinite(stored) ? Math.max(stored, 0) : fallback
}

export function getCompletedCount(track: TrackId = "a1"): number {
  return read(track)
}

export function advanceModule(total: number, track: TrackId = "a1") {
  const all = readAll()
  const current = read(track)
  if (current < total) {
    const next = current + 1
    all[track] = next
    writeAll(all)

    const userId = getUserId()
    if (userId)
      saveModuleProgress(userId, track, next).catch(() => {
        /* localStorage remains the fallback */
      })
  }
}

// Pulls module progress from Supabase and merges it into localStorage, keeping
// the higher completed count per track. Call on login/mount so progress survives
// a cleared/new browser. See src/lib/db.ts:fetchModuleProgress.
export async function syncModuleProgressFromServer(userId: string): Promise<void> {
  const { data } = await fetchModuleProgress(userId)
  if (!data) return

  const all = readAll()
  let changed = false
  for (const track of Object.keys(data) as TrackId[]) {
    const remote = data[track]
    if (typeof remote === "number" && remote > read(track)) {
      all[track] = remote
      changed = true
    }
  }
  if (changed) writeAll(all)
}

export function useModuleProgress(track: TrackId = "a1") {
  const [completed, setCompleted] = useState<number>(() => read(track))

  useEffect(() => {
    setCompleted(read(track))
    const onChange = () => setCompleted(read(track))
    window.addEventListener("module-progress-change", onChange)
    window.addEventListener(USER_SCOPE_EVENT, onChange)
    return () => {
      window.removeEventListener("module-progress-change", onChange)
      window.removeEventListener(USER_SCOPE_EVENT, onChange)
    }
  }, [track])

  return completed
}
