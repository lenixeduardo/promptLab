import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from "react"
import { scopedKey, USER_SCOPE_EVENT } from "@/lib/userScope"
import { supabase } from "@/lib/supabase"

const STORAGE_BASE = "promptlabz-premium"

function readStored(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(scopedKey(STORAGE_BASE)) === "1"
}

interface PremiumContextType {
  isPremium: boolean
  source: "subscription" | "local" | "none"
  activate: () => void
  deactivate: () => void
  toggle: () => void
}

const PremiumContext = createContext<PremiumContextType | null>(null)

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [localPremium, setLocalPremium] = useState(readStored)
  const [hydrated, setHydrated] = useState(false)
  const [subscriptionActive, setSubscriptionActive] = useState(false)

  useEffect(() => {
    setHydrated(true)
    const onUserScope = () => setLocalPremium(readStored())
    window.addEventListener(USER_SCOPE_EVENT, onUserScope)
    return () => window.removeEventListener(USER_SCOPE_EVENT, onUserScope)
  }, [])

  // Check premium status from Supabase users table
  useEffect(() => {
    let mounted = true
    async function checkPremium() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user || !mounted) return
      const { data } = await supabase
        .from("users")
        .select("premium_status, trial_ends_at")
        .eq("id", user.id)
        .maybeSingle()
      if (!mounted || !data) return
      const isActive =
        data.premium_status === "active" ||
        (data.premium_status === "trial" &&
          data.trial_ends_at != null &&
          new Date(data.trial_ends_at) > new Date())
      setSubscriptionActive(isActive)
    }
    void checkPremium()
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void checkPremium()
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return
    localStorage.setItem(scopedKey(STORAGE_BASE), localPremium ? "1" : "0")
  }, [localPremium, hydrated])

  const activate = useCallback(() => setLocalPremium(true), [])
  const deactivate = useCallback(() => setLocalPremium(false), [])
  const toggle = useCallback(() => setLocalPremium((p) => !p), [])

  // localPremium is a dev-only manual test shortcut (see the toggle in
  // Profile.tsx, gated behind import.meta.env.DEV). It must never grant
  // premium access in production — the only real source of truth is
  // subscriptionActive, read from users.premium_status via Supabase.
  const isDevLocalPremiumAllowed = import.meta.env.DEV && localPremium
  const isPremium = subscriptionActive || isDevLocalPremiumAllowed
  const source: PremiumContextType["source"] = subscriptionActive
    ? "subscription"
    : isDevLocalPremiumAllowed
      ? "local"
      : "none"

  return (
    <PremiumContext.Provider value={{ isPremium, source, activate, deactivate, toggle }}>
      {children}
    </PremiumContext.Provider>
  )
}

export function usePremium() {
  const ctx = useContext(PremiumContext)
  if (!ctx) throw new Error("usePremium must be used within PremiumProvider")
  return ctx
}
