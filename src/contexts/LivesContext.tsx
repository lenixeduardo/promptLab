import { useCallback, useEffect, useRef, useState } from "react"
import { useAuthContext } from "./AuthContext"
import { MAX_LIVES, RECHARGE_MS } from "./lives-config"
import { LivesContext } from "./LivesState"

interface Stored {
  lives: number
  lastRechargeTime: number // timestamp of the last full-hour recharge tick
  lastPerfectDate: string | null // "YYYY-MM-DD" – daily 100% bonus
}

function storageKey(userId: string) {
  return `pl:lives:${userId}`
}

// Advance lives by however many full hours have elapsed since lastRechargeTime
function applyPassiveRecharge(s: Stored): Stored {
  if (s.lives >= MAX_LIVES) return s
  const hours = Math.floor((Date.now() - s.lastRechargeTime) / RECHARGE_MS)
  if (hours === 0) return s
  return {
    ...s,
    lives: Math.min(s.lives + hours, MAX_LIVES),
    lastRechargeTime: s.lastRechargeTime + hours * RECHARGE_MS,
  }
}

export function LivesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext()

  const [stored, setStored] = useState<Stored>({
    lives: MAX_LIVES,
    lastRechargeTime: Date.now(),
    lastPerfectDate: null,
  })

  // Keep a ref so callbacks can read current state without stale closure
  const ref = useRef(stored)
  useEffect(() => {
    ref.current = stored
  }, [stored])

  // Load from localStorage and apply any offline recharge
  useEffect(() => {
    if (!user) return
    let parsed: Stored = { lives: MAX_LIVES, lastRechargeTime: Date.now(), lastPerfectDate: null }
    const raw = localStorage.getItem(storageKey(user.id))
    if (raw) {
      try {
        parsed = JSON.parse(raw)
      } catch (e) {
        console.error("Falha ao parsear lives do localStorage:", e)
      }
    }
    setStored(applyPassiveRecharge(parsed))
  }, [user])

  // Persist on every change
  useEffect(() => {
    if (!user) return
    localStorage.setItem(storageKey(user.id), JSON.stringify(stored))
  }, [user, stored])

  // Schedule a tick that fires exactly when the next life is ready
  useEffect(() => {
    if (stored.lives >= MAX_LIVES) return
    const msLeft = RECHARGE_MS - ((Date.now() - stored.lastRechargeTime) % RECHARGE_MS)
    const t = setTimeout(() => setStored((prev) => applyPassiveRecharge(prev)), msLeft + 200)
    return () => clearTimeout(t)
  }, [stored.lives, stored.lastRechargeTime])

  const msUntilNextLife = useCallback((): number => {
    const s = ref.current
    if (s.lives >= MAX_LIVES) return 0
    return RECHARGE_MS - ((Date.now() - s.lastRechargeTime) % RECHARGE_MS)
  }, [])

  const consumeLife = useCallback(() => {
    setStored((prev) => ({ ...prev, lives: Math.max(0, prev.lives - 1) }))
  }, [])

  const awardPerfectBonus = useCallback((): boolean => {
    const today = new Date().toISOString().slice(0, 10)
    const s = ref.current
    if (s.lastPerfectDate === today) return false
    setStored((prev) => ({
      ...prev,
      lives: Math.min(prev.lives + 1, MAX_LIVES),
      lastPerfectDate: today,
    }))
    return true
  }, [])

  return (
    <LivesContext.Provider
      value={{
        lives: stored.lives,
        maxLives: MAX_LIVES,
        canPlay: stored.lives > 0,
        msUntilNextLife,
        consumeLife,
        awardPerfectBonus,
      }}
    >
      {children}
    </LivesContext.Provider>
  )
}
