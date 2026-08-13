// APP_URL must be set in production, as a comma-separated list if the app is
// served from more than one origin (e.g. production domain + Vercel preview
// deployments + the Capacitor Android WebView origin). An empty/unset value
// disallows all origins, which is safer than a wildcard "*" fallback.
const allowedOrigins = (Deno.env.get("APP_URL") ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean)

/**
 * Resolves the Access-Control-Allow-Origin value for a given request.
 * Echoes back the request's Origin header only if it's in the allowlist —
 * required because a single static header can't represent multiple allowed
 * origins at once. Falls back to the first configured origin (or "") when
 * the request's origin isn't recognized, matching the previous fail-closed
 * behavior instead of a permissive wildcard.
 */
export function resolveCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") ?? ""
  const allowOrigin = allowedOrigins.includes(origin) ? origin : (allowedOrigins[0] ?? "")
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  }
}

// Backwards-compatible static export for call sites that haven't been
// migrated to resolveCorsHeaders(req) yet — behaves like before (single origin).
export const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigins[0] ?? "",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}
