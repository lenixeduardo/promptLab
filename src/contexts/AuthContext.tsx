import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const IS_PREVIEW = import.meta.env.VITE_PREVIEW_MODE === "true"

const PREVIEW_USER = {
  id: "preview-user",
  aud: "authenticated",
  role: "authenticated",
  email: "preview@promptlabz.com",
  created_at: "",
  updated_at: "",
  app_metadata: {},
  user_metadata: { name: "Aluno Preview" },
} as User

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(!IS_PREVIEW)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (IS_PREVIEW) return

    // onAuthStateChange fires INITIAL_SESSION synchronously with the current
    // session on the first call, so no separate getSession() is needed.
    // This avoids a race condition where getSession() and the listener
    // could resolve in different orders and briefly show a wrong auth state.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setError(null)
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const value = useMemo(
    () => ({
      user: IS_PREVIEW ? PREVIEW_USER : user,
      loading: IS_PREVIEW ? false : loading,
      error: IS_PREVIEW ? null : error,
    }),
    [user, loading, error]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook lives beside provider to keep auth API centralized.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within AuthProvider")
  }
  return context
}
