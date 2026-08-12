import { createClient } from "npm:@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!
const supabaseAdmin = createClient(
  supabaseUrl,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
)

// AI_PROVIDER selects which backend answers the enhancement request.
// "gemini" is the default because Google AI Studio issues a genuinely free
// API key (no billing account required) with a daily quota generous enough
// for this feature. "groq" and "anthropic" are supported as drop-in
// alternatives — see .env.example for how to switch and get each key.
type Provider = "gemini" | "groq" | "anthropic"

const PROVIDER = (Deno.env.get("AI_PROVIDER") ?? "gemini") as Provider
const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.0-flash"
const GROQ_MODEL = Deno.env.get("GROQ_MODEL") ?? "llama-3.3-70b-versatile"
const ANTHROPIC_MODEL = Deno.env.get("ANTHROPIC_MODEL") ?? "claude-sonnet-5"

const MAX_PROMPT_LENGTH = 5000
// Per-user guard rail against abuse of the shared free-tier key — this is
// NOT a cost control (the whole point of the default provider is $0 cost),
// it just protects the app's shared quota with the provider from being
// exhausted by a single user.
const FREE_DAILY_LIMIT = 15
const PREMIUM_DAILY_LIMIT = 300

const PREMIUM_STATUSES = new Set(["active", "trial"])

const FOCUS_DESCRIPTIONS: Record<string, string> = {
  general: "melhoria completa e balanceada: título, introdução clara, CTA definida, linguagem acessível, estrutura lógica",
  creativity: "criatividade e originalidade: gancho inicial surpreendente, storytelling envolvente, linguagem expressiva",
  precision: "precisão e objetividade: objetivo mensurável, CTA direta, linguagem sem ambiguidade, dados que sustentem a mensagem",
  detail: "detalhamento técnico: contexto específico, especificações claras, exemplos concretos, restrições bem definidas",
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
}

function buildSystemPrompt(mode: string) {
  const focusHint = FOCUS_DESCRIPTIONS[mode] ?? FOCUS_DESCRIPTIONS.general
  return `Você é um especialista em engenharia de prompts da plataforma PromptLabz. Reescreva o prompt do usuário para IAs (ChatGPT, Claude, Gemini etc.), priorizando ${focusHint}.

Responda EXCLUSIVAMENTE com um JSON válido, sem markdown, sem crases, sem texto antes ou depois, exatamente neste formato:

{
  "enhancedMain": "versão reescrita e mais completa do prompt original, pronta para uso",
  "audience": "público-alvo recomendado para este prompt, em poucas palavras",
  "tone": "tom de voz recomendado, em poucas palavras",
  "appliedTechniques": ["técnica 1", "técnica 2", "técnica 3", "técnica 4"]
}

"appliedTechniques" deve listar de 3 a 5 técnicas de prompt engineering realmente aplicadas na reescrita (ex: "Persona definida", "Contexto explícito", "Formato de saída especificado"). Responda em português do Brasil.`
}

async function callGemini(system: string, prompt: string, apiKey: string) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
      }),
    },
  )
  if (!res.ok) {
    const errText = await res.text().catch(() => "")
    throw new Error(`Gemini API error ${res.status}: ${errText}`)
  }
  const data = await res.json()
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
  return text
}

async function callGroq(system: string, prompt: string, apiKey: string) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    }),
  })
  if (!res.ok) {
    const errText = await res.text().catch(() => "")
    throw new Error(`Groq API error ${res.status}: ${errText}`)
  }
  const data = await res.json()
  const text: string = data?.choices?.[0]?.message?.content ?? ""
  return text
}

async function callAnthropic(system: string, prompt: string, apiKey: string) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: prompt }],
    }),
  })
  if (!res.ok) {
    const errText = await res.text().catch(() => "")
    throw new Error(`Anthropic API error ${res.status}: ${errText}`)
  }
  const data = await res.json()
  const text: string = data?.content?.[0]?.text ?? ""
  return text
}

function apiKeyForProvider(provider: Provider): string | undefined {
  switch (provider) {
    case "gemini":
      return Deno.env.get("GEMINI_API_KEY")
    case "groq":
      return Deno.env.get("GROQ_API_KEY")
    case "anthropic":
      return Deno.env.get("ANTHROPIC_API_KEY")
  }
}

async function callProvider(provider: Provider, apiKey: string, system: string, prompt: string) {
  switch (provider) {
    case "gemini":
      return callGemini(system, prompt, apiKey)
    case "groq":
      return callGroq(system, prompt, apiKey)
    case "anthropic":
      return callAnthropic(system, prompt, apiKey)
  }
}

Deno.serve(async (req) => {
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
    let body: { prompt?: unknown; focusMode?: unknown }
    try {
      body = await req.json()
    } catch {
      return jsonResponse({ error: "Corpo da requisição inválido" }, 400)
    }

    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : ""
    const focusMode =
      typeof body.focusMode === "string" && body.focusMode.trim() ? body.focusMode.trim() : "general"

    if (!prompt) {
      return jsonResponse({ error: "O campo 'prompt' é obrigatório" }, 400)
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
      return jsonResponse(
        { error: `Prompt muito longo. Máximo de ${MAX_PROMPT_LENGTH} caracteres.` },
        400,
      )
    }

    // ── AI availability ─────────────────────────────────────────────────
    const apiKey = apiKeyForProvider(PROVIDER)
    if (!apiKey) {
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
    const dailyLimit = isPremium ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT

    const today = new Date().toISOString().slice(0, 10)
    const { data: usageRow } = await supabaseAdmin
      .from("prompt_enhancement_usage")
      .select("count")
      .eq("user_id", userId)
      .eq("usage_date", today)
      .maybeSingle()

    const currentCount = usageRow?.count ?? 0

    if (currentCount >= dailyLimit) {
      return jsonResponse(
        {
          error: "Limite diário de aprimoramentos com IA atingido. Tente novamente amanhã.",
          quotaExceeded: true,
        },
        429,
      )
    }

    const { error: usageError } = await supabaseAdmin
      .from("prompt_enhancement_usage")
      .upsert(
        {
          user_id: userId,
          usage_date: today,
          count: currentCount + 1,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,usage_date" },
      )

    if (usageError) {
      console.error("enhance-prompt: failed to record usage:", usageError)
      // Non-fatal — we still enhance the prompt rather than block the user
      // over an internal bookkeeping error.
    }

    // ── Call AI provider ────────────────────────────────────────────────
    const system = buildSystemPrompt(focusMode)
    let textContent: string
    try {
      textContent = await callProvider(PROVIDER, apiKey, system, prompt)
    } catch (providerErr) {
      console.error("enhance-prompt: provider error:", providerErr)
      return jsonResponse({ error: "Falha ao consultar o serviço de IA" }, 502)
    }

    let parsed: {
      enhancedMain?: unknown
      audience?: unknown
      tone?: unknown
      appliedTechniques?: unknown
    }
    try {
      parsed = JSON.parse(textContent)
    } catch (parseErr) {
      console.error("enhance-prompt: failed to parse AI response:", parseErr, textContent)
      return jsonResponse({ error: "Não foi possível interpretar a resposta da IA" }, 502)
    }

    if (
      typeof parsed.enhancedMain !== "string" ||
      typeof parsed.audience !== "string" ||
      typeof parsed.tone !== "string" ||
      !Array.isArray(parsed.appliedTechniques)
    ) {
      console.error("enhance-prompt: AI response missing expected fields:", parsed)
      return jsonResponse({ error: "Resposta da IA em formato inesperado" }, 502)
    }

    return jsonResponse({
      enhancedMain: parsed.enhancedMain,
      audience: parsed.audience,
      tone: parsed.tone,
      appliedTechniques: parsed.appliedTechniques,
      provider: PROVIDER,
      quota: { used: currentCount + 1, limit: dailyLimit },
    })
  } catch (err) {
    console.error("enhance-prompt error:", err)
    return jsonResponse({ error: "Internal error" }, 500)
  }
})
