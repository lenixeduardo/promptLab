import { supabase, getErrorMessage } from "@/lib/supabase"
import { useAuthContext } from "@/contexts/AuthContext"

export function useAuth() {
  const { user, loading, error } = useAuthContext()

  const login = async (email: string, password: string) => {
    try {
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
