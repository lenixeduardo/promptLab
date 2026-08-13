import { useCallback, useEffect, useState } from "react"
import { completeMission } from "@/lib/missions"
import { scopedKey, USER_SCOPE_EVENT } from "@/lib/userScope"

const STORAGE_BASE = "promptlabz:favorite_skills"
const SKILL_MISSION_THRESHOLD = 3

function readFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(scopedKey(STORAGE_BASE)) || "[]")
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(readFavorites)

  // Sync across tabs via the "storage" event
  useEffect(() => {
    const onStorage = () => setFavorites(readFavorites())
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  useEffect(() => {
    const onScope = () => setFavorites(readFavorites())
    window.addEventListener(USER_SCOPE_EVENT, onScope)
    return () => window.removeEventListener(USER_SCOPE_EVENT, onScope)
  }, [])

  const toggleFavorite = useCallback((skillName: string) => {
    setFavorites((prev) => {
      const isAdding = !prev.includes(skillName)
      const next = isAdding ? [...prev, skillName] : prev.filter((n) => n !== skillName)
      localStorage.setItem(scopedKey(STORAGE_BASE), JSON.stringify(next))
      if (isAdding && next.length >= SKILL_MISSION_THRESHOLD) {
        completeMission("skill")
      }
      return next
    })
  }, [])

  const isFavorite = useCallback((skillName: string) => favorites.includes(skillName), [favorites])

  return { favorites, toggleFavorite, isFavorite }
}
