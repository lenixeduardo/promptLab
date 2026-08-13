import { useCallback, useEffect, useState } from "react"
import { completeMission } from "@/lib/missions"
import { scopedKey, USER_SCOPE_EVENT } from "@/lib/userScope"

const STORAGE_BASE = "promptlabz:favorite_prompts"

function readFavoritePrompts(): string[] {
  try {
    return JSON.parse(localStorage.getItem(scopedKey(STORAGE_BASE)) || "[]")
  } catch {
    return []
  }
}

export function useFavoritePrompts() {
  const [favorites, setFavorites] = useState<string[]>(readFavoritePrompts)

  useEffect(() => {
    const onStorage = () => setFavorites(readFavoritePrompts())
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  useEffect(() => {
    const onScope = () => setFavorites(readFavoritePrompts())
    window.addEventListener(USER_SCOPE_EVENT, onScope)
    return () => window.removeEventListener(USER_SCOPE_EVENT, onScope)
  }, [])

  const toggleFavoritePrompt = useCallback((promptId: string) => {
    setFavorites((prev) => {
      const isAdding = !prev.includes(promptId)
      const next = isAdding ? [...prev, promptId] : prev.filter((id) => id !== promptId)
      localStorage.setItem(scopedKey(STORAGE_BASE), JSON.stringify(next))
      if (isAdding) completeMission("share")
      return next
    })
  }, [])

  const isFavoritePrompt = useCallback(
    (promptId: string) => favorites.includes(promptId),
    [favorites]
  )

  return { favoritePrompts: favorites, toggleFavoritePrompt, isFavoritePrompt }
}
