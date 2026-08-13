import { createClient } from "npm:@supabase/supabase-js@2"
import { resolveCorsHeaders } from "../_shared/cors.ts"

// Real server-side login rate limiting (see TRADEOFFS.md and migration
// 20260813_023_login_attempts.sql for the "why"). This function is invoked
// by useAuth.ts's login() BEFORE the direct supabase.auth.signInWithPassword
// call. If this function isn't deployed, is unreachable, or returns anything
// unexpected, the client falls back to the direct call — login never
// depends on this function being up. See useAuth.ts's tryRateLimitedLogin().

const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!
const supabaseAdmin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!)

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // failed attempts older than this don't count
const LOCKOUT_MS = 15 * 60 * 1000 // how long an email is locked after MAX_ATTEMPTS

interface LoginAttemptRow {
  email: string
  attempt_count: number
  window_start: string
  locked_until: string | null
}

Deno.serve(async (req) => {
  const corsHeaders = resolveCorsHeaders(req)

  function jsonResponse(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405)
  }

  try {
    let body: { email?: unknown; password?: unknown }
    try {
      body = await req.json()
    } catch {
      return jsonResponse({ error: "Corpo da requisição inválido" }, 400)
    }

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const password = typeof body.password === "string" ? body.password : ""
    if (!email || !password) {
      return jsonResponse({ error: "E-mail e senha são obrigatórios" }, 400)
    }

    const now = new Date()

    const { data: attempt } = await supabaseAdmin
      .from("login_attempts")
      .select("email,attempt_count,window_start,locked_until")
      .eq("email", email)
      .maybeSingle<LoginAttemptRow>()

    if (attempt?.locked_until && new Date(attempt.locked_until) > now) {
      const retryAfterSec = Math.ceil(
        (new Date(attempt.locked_until).getTime() - now.getTime()) / 1000
      )
      return jsonResponse(
        {
          error: `Muitas tentativas de login. Tente novamente em ${Math.ceil(retryAfterSec / 60)} min.`,
          retryAfter: retryAfterSec,
        },
        429
      )
    }

    // Attempt the real login with an anon-scoped client — this function
    // never uses the service role to authenticate on the user's behalf,
    // only to read/write the rate-limit bookkeeping table.
    const anonClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await anonClient.auth.signInWithPassword({ email, password })

    if (error || !data.session) {
      const windowExpired =
        !attempt?.window_start ||
        now.getTime() - new Date(attempt.window_start).getTime() > WINDOW_MS
      const newCount = windowExpired ? 1 : (attempt?.attempt_count ?? 0) + 1
      const lockedUntil =
        newCount >= MAX_ATTEMPTS ? new Date(now.getTime() + LOCKOUT_MS).toISOString() : null

      await supabaseAdmin.from("login_attempts").upsert({
        email,
        attempt_count: newCount,
        window_start: windowExpired ? now.toISOString() : attempt!.window_start,
        locked_until: lockedUntil,
      })

      return jsonResponse({ error: error?.message ?? "Credenciais inválidas" }, 401)
    }

    // Success: clear any recorded failures for this email.
    await supabaseAdmin.from("login_attempts").delete().eq("email", email)

    return jsonResponse({
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      },
      user: data.user,
    })
  } catch (err) {
    console.error("login-rate-limited error:", err)
    return jsonResponse({ error: "Internal error" }, 500)
  }
})
