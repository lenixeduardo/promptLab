import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ""
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ""
const isTest = import.meta.env.MODE === "test"

if (!isTest && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error(
    "Supabase credentials not found. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local"
  )
}

export const supabase = createClient(
  supabaseUrl || "https://test-only.supabase.co",
  supabaseAnonKey || "test-only-anon-key",
  {
    // PKCE is required so OAuth redirects (e.g. Google login) return a
    // `?code=` param that AuthCallback.tsx exchanges for a session. The
    // default "implicit" flow returns tokens in the URL hash instead,
    // which AuthCallback never reads, breaking Google login.
    auth: {
      flowType: "pkce",
    },
  }
)

// ── Shared Helpers ───────────────────────────────────────────────────────

/** Check whether Supabase env vars are actually filled in. */
export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  return !!url && !!key && url !== "your_supabase_url_here"
}

/** Normalise error objects into a readable string. */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message
  if (typeof err === "object" && err && "message" in err) {
    const message = (err as { message?: unknown }).message
    if (typeof message === "string") return message
  }
  return fallback
}
