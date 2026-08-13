import { createClient } from "npm:@supabase/supabase-js@2"
import { resolveCorsHeaders } from "../_shared/cors.ts"

const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!
const supabaseAdmin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!)

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"
const ANTHROPIC_MODEL = "claude-sonnet-5"

const MAX_PROMPT_LENGTH = 5000
const FREE_DAILY_LIMIT = 5
// Kept for the open-beta revert noted below, not used directly yet.
void FREE_DAILY_LIMIT
// Premium users are not truly "unlimited" — this is a guard rail against abuse.
const PREMIUM_DAILY_LIMIT = 200

const PREMIUM_STATUSES = new Set(["active", "trial"])

function buildSystemPrompt(mode: string) {
  return `Você é um avaliador especialista em engenharia de prompts, ajudando usuários de uma plataforma de aprendizado (PromptLabz) a melhorar seus prompts para modelos de linguagem.

Avalie o prompt do usuário considerando o modo de foco "${mode}" (ex: geral, criatividade, precisão, detalhamento) e responda EXCLUSIVAMENTE com um JSON válido, sem markdown, sem crases, sem texto antes ou depois, exatamente neste formato:

{
  "score": <número inteiro de 0 a 100>,
  "strengths": ["ponto forte 1", "ponto forte 2"],
  "improvements": ["sugestão de melhoria 1", "sugestão de melhoria 2"],
  "enhancedPrompt": "versão aprimorada e mais completa do prompt original"
}

Responda em português do Brasil. Seja objetivo e prático.`
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

  try {
    // ── Auth ────────────────────────────────────────────────────────────
    const authorization = req.headers.get("Authorization")
    if (!authorization) {
      return jsonResponse({ error: "Missing authorization header" }, 401)
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authorization } },
    })
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return jsonResponse({ error: "Unauthorized" }, 401)
    }

    // ── Input validation ────────────────────────────────────────────────
    let body: { prompt?: unknown; mode?: unknown }
    try {
      body = await req.json()
    } catch {
      return jsonResponse({ error: "Corpo da requisição inválido" }, 400)
    }

    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : ""
    const mode = typeof body.mode === "string" && body.mode.trim() ? body.mode.trim() : "general"

    if (!prompt) {
      return jsonResponse({ error: "O campo 'prompt' é obrigatório" }, 400)
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
      return jsonResponse(
        { error: `Prompt muito longo. Máximo de ${MAX_PROMPT_LENGTH} caracteres.` },
        400
      )
    }

    // ── AI availability ─────────────────────────────────────────────────
    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY")
    if (!anthropicApiKey) {
      return jsonResponse({ error: "Serviço de IA não configurado" }, 503)
    }

    // ── Daily quota ─────────────────────────────────────────────────────
    const userId = user.id
    const { data: userRow } = await supabaseAdmin
      .from("users")
      .select("premium_status")
      .eq("id", userId)
      .maybeSingle()

    const isPremium = PREMIUM_STATUSES.has(userRow?.premium_status ?? "free")
    // TEMPORARY (open beta): premium daily limit applied to everyone regardless
    // of subscription status. Revert to `isPremium ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT`
    // once premium gating comes back.
    void isPremium
    const dailyLimit = PREMIUM_DAILY_LIMIT

    const today = new Date().toISOString().slice(0, 10)
    // Atomic check-and-increment (see 20260812_020 migration) so concurrent
    // requests can't all read the same pre-increment count and collectively
    // exceed the daily quota.
    const { data: newCount, error: usageError } = await supabaseAdmin.rpc(
      "increment_prompt_evaluation_usage",
      { p_user_id: userId, p_usage_date: today, p_daily_limit: dailyLimit }
    )

    if (usageError) {
      console.error("evaluate-prompt: failed to record usage:", usageError)
      // Non-fatal — we still evaluate the prompt rather than block the user
      // over an internal bookkeeping error.
    } else if (newCount === null) {
      return jsonResponse(
        {
          error:
            "Limite diário de avaliações com IA atingido. Assine o Premium para análises ilimitadas.",
          quotaExceeded: true,
        },
        429
      )
    }

    // ── Call Anthropic ──────────────────────────────────────────────────
    const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1024,
        system: buildSystemPrompt(mode),
        messages: [
          {
            role: "user",
            content: `Avalie o seguinte prompt:\n\n"""\n${prompt}\n"""`,
          },
        ],
      }),
    })

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text().catch(() => "")
      console.error("evaluate-prompt: Anthropic API error:", anthropicResponse.status, errText)
      return jsonResponse({ error: "Falha ao consultar o serviço de IA" }, 502)
    }

    const anthropicData = await anthropicResponse.json()
    const textContent: string = anthropicData?.content?.[0]?.text ?? ""

    let parsed: {
      score?: unknown
      strengths?: unknown
      improvements?: unknown
      enhancedPrompt?: unknown
    }
    try {
      parsed = JSON.parse(textContent)
    } catch (parseErr) {
      console.error("evaluate-prompt: failed to parse AI response:", parseErr, textContent)
      return jsonResponse({ error: "Não foi possível interpretar a resposta da IA" }, 502)
    }

    if (
      typeof parsed.score !== "number" ||
      !Array.isArray(parsed.strengths) ||
      !Array.isArray(parsed.improvements) ||
      typeof parsed.enhancedPrompt !== "string"
    ) {
      console.error("evaluate-prompt: AI response missing expected fields:", parsed)
      return jsonResponse({ error: "Resposta da IA em formato inesperado" }, 502)
    }

    return jsonResponse({
      score: parsed.score,
      strengths: parsed.strengths,
      improvements: parsed.improvements,
      enhancedPrompt: parsed.enhancedPrompt,
      quota: { used: currentCount + 1, limit: dailyLimit },
    })
  } catch (err) {
    console.error("evaluate-prompt error:", err)
    return jsonResponse({ error: "Internal error" }, 500)
  }
})
