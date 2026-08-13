import { FunctionsHttpError } from "@supabase/supabase-js"
import { supabase, getErrorMessage } from "@/lib/supabase"
import { useAuthContext } from "@/contexts/AuthContext"

interface RateLimitedLoginResponse {
  session: { access_token: string; refresh_token: string }
  user: unknown
}

function isRateLimitedLoginResponse(data: unknown): data is RateLimitedLoginResponse {
  if (!data || typeof data !== "object") return false
  const session = (data as { session?: unknown }).session
  if (!session || typeof session !== "object") return false
  const { access_token, refresh_token } = session as Record<string, unknown>
  return typeof access_token === "string" && typeof refresh_token === "string"
}

/**
 * Tries the login-rate-limited Edge Function first (real server-side rate
 * limiting — see TRADEOFFS.md). Returns null whenever the function isn't
 * deployed, is unreachable, or responds with anything unexpected, so the
 * caller falls back to the direct supabase.auth.signInWithPassword call.
 * Login must never depend on this function being up.
 */
async function tryRateLimitedLogin(email: string, password: string) {
  try {
    const { data, error } = await supabase.functions.invoke("login-rate-limited", {
      body: { email, password },
    })

    if (error) {
      if (error instanceof FunctionsHttpError) {
        const status: number | undefined = error.context?.status
        // 429 (rate limited) and 401 (the function itself rejected the
        // credentials) are deliberate responses from our own function —
        // honor them instead of silently retrying against GoTrue directly.
        if (status === 429 || status === 401) {
          let message = "Erro ao fazer login"
          try {
            const body = await error.context.json()
            if (typeof body?.error === "string") message = body.error
          } catch {
            /* body wasn't JSON — keep the generic message */
          }
          return { success: false as const, error: message }
        }
      }
      // 404 (not deployed), 5xx, relay/network errors, or anything else
      // unexpected — fall through to the direct call.
      return null
    }

    if (!isRateLimitedLoginResponse(data)) return null

    const { error: setErr } = await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    })
    if (setErr) return null

    return { success: true as const, user: data.user }
  } catch {
    return null
  }
}

export function useAuth() {
  const { user, loading, error } = useAuthContext()

  const login = async (email: string, password: string) => {
    try {
      const rateLimited = await tryRateLimitedLogin(email, password)
      if (rateLimited) return rateLimited

      const { data, error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (err) throw err
      return { success: true, user: data.user }
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err, "Erro ao fazer login")
      return { success: false, error: errorMsg }
    }
  }

  const signup = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: fullName ? { full_name: fullName } : undefined,
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })
      if (err) throw err
      return { success: true, user: data.user, needsConfirmation: !data.session }
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err, "Erro ao criar conta")
      return { success: false, error: errorMsg, needsConfirmation: false }
    }
  }

  const logout = async () => {
    try {
      const { error: err } = await supabase.auth.signOut()
      if (err) throw err
      return { success: true }
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err, "Erro ao fazer logout")
      return { success: false, error: errorMsg }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (err) throw err
      return { success: true }
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err, "Erro ao enviar email de reset")
      return { success: false, error: errorMsg }
    }
  }

  const loginWithGoogle = async () => {
    return loginWithProvider("google", "Erro ao fazer login com Google")
  }

  const loginWithProvider = async (provider: "google", fallback: string) => {
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (err) throw err
      return { success: true, user: null }
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err, fallback)
      return { success: false, error: errorMsg }
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const { data, error: err } = await supabase.auth.updateUser({
        password,
      })
      if (err) throw err
      return { success: true, user: data.user }
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err, "Erro ao atualizar senha")
      return { success: false, error: errorMsg }
    }
  }

  return {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    resetPassword,
    loginWithGoogle,
    updatePassword,
  }
}
