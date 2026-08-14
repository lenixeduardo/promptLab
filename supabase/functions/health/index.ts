import { createClient } from "npm:@supabase/supabase-js@2"
import { resolveCorsHeaders } from "../_shared/cors.ts"

// Minimal health check: confirms this Edge Function's runtime is up and
// that it can reach Postgres with the service role, using a HEAD-only
// count query so no row data is ever read or returned. Public and
// unauthenticated on purpose — a health check that requires a valid user
// session can't tell you the service is down when auth itself is down.

const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

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

  const startedAt = Date.now()

  try {
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
    const { error } = await supabaseAdmin
      .from("login_attempts")
      .select("*", { count: "exact", head: true })

    if (error) throw error

    return jsonResponse({
      status: "ok",
      db: "reachable",
      latencyMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error("health check failed:", err)
    return jsonResponse(
      {
        status: "error",
        db: "unreachable",
        timestamp: new Date().toISOString(),
      },
      503
    )
  }
})
