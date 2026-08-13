import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { scopedKey, USER_SCOPE_EVENT } from "@/lib/userScope"
import { useAuth } from "@/hooks/useAuth"
import { getUserProfile, updateUserAvatar } from "@/lib/db"
import { loadInventory } from "@/lib/inventory"
import { AVATARS, getAvatarById, type Avatar } from "@/data/avatarsData"

const STORAGE_BASE = "promptlabz-avatar"
const DEFAULT_ID = "cat-green"

interface AvatarContextType {
  equippedId: string
  equipped: Avatar
  /** Equips an avatar the user already owns; no-ops otherwise. Persists to
   * Supabase in the background (offline-first: local state updates immediately). */
  setEquipped: (id: string) => void
  options: Avatar[]
}

const AvatarContext = createContext<AvatarContextType | null>(null)

function getCachedId(): string {
  if (typeof window === "undefined") return DEFAULT_ID
  const stored = localStorage.getItem(scopedKey(STORAGE_BASE))
  if (stored && getAvatarById(stored)) return stored
  return DEFAULT_ID
}

export function AvatarProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [equippedId, setEquippedId] = useState<string>(getCachedId)

  // Reset to the locally cached value whenever the logged-in user changes.
  useEffect(() => {
    setEquippedId(getCachedId())
    const onUserScope = () => setEquippedId(getCachedId())
    window.addEventListener(USER_SCOPE_EVENT, onUserScope)
    return () => window.removeEventListener(USER_SCOPE_EVENT, onUserScope)
  }, [])

  // Hydrate from Supabase — the source of truth — so a fresh device (empty
  // localStorage) picks up the avatar the user already equipped elsewhere.
  useEffect(() => {
    if (!user?.id) return
    getUserProfile(user.id)
      .then(({ data: profile }) => {
        if (profile?.avatar_url && getAvatarById(profile.avatar_url)) {
          setEquippedId(profile.avatar_url)
        }
      })
      .catch(() => {
        /* silent — localStorage remains as fallback */
      })
  }, [user?.id])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(scopedKey(STORAGE_BASE), equippedId)
    }
  }, [equippedId])

  const setEquipped = (id: string) => {
    if (!user?.id) return
    const owned = loadInventory(user.id).ownedAvatarIds
    if (!owned.includes(id)) return
    setEquippedId(id)
    updateUserAvatar(user.id, id).catch(() => {
      /* silent — next getUserProfile() hydration will reconcile */
    })
  }

  const value = useMemo<AvatarContextType>(() => {
    const equipped = getAvatarById(equippedId) ?? AVATARS[0]
    return { equippedId, equipped, setEquipped, options: AVATARS }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equippedId, user?.id])

  return <AvatarContext.Provider value={value}>{children}</AvatarContext.Provider>
}

export function useAvatar() {
  const ctx = useContext(AvatarContext)
  if (!ctx) throw new Error("useAvatar must be used within AvatarProvider")
  return ctx
}
