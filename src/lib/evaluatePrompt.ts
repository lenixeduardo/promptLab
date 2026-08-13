/**
 * evaluatePrompt.ts
 *
 * Thin client for the optional "evaluate-prompt" Edge Function, which asks
 * Claude to evaluate a user's prompt (score, strengths, improvements, an
 * enhanced version). This is an opt-in complement to the local, deterministic
 * heuristics in `promptEnhancer.ts` — it never replaces them.
 *
 * If Supabase isn't configured, the function is unreachable, the daily quota
 * is exceeded, or anything else goes wrong, callers get back a normalized
 * `{ ok: false, error }` so the UI can fall back silently to the local
 * heuristic engine instead of breaking.
 */

import { supabase, getErrorMessage } from "@/lib/supabase"

// ── Types ─────────────────────────────────────────────────────────────────

export interface PromptEvaluation {
  score: number
  strengths: string[]
  improvements: string[]
  enhancedPrompt: string
  quota?: { used: number; limit: number }
}

export interface EvaluatePromptError {
  message: string
  /** True when the free daily quota has been exhausted (HTTP 429). */
  quotaExceeded: boolean
}

export type EvaluatePromptResult =
  { ok: true; data: PromptEvaluation } | { ok: false; error: EvaluatePromptError }

const GENERIC_ERROR_MESSAGE =
  "Não foi possível concluir a análise com IA. Tente novamente mais tarde."

// ── Public API ────────────────────────────────────────────────────────────

export async function evaluatePromptWithAI(
  prompt: string,
  mode?: string
): Promise<EvaluatePromptResult> {
  try {
    const { data, error } = await supabase.functions.invoke("evaluate-prompt", {
      body: { prompt, mode },
    })

    if (error) {
      return { ok: false, error: await parseFunctionError(error) }
    }

    if (!isPromptEvaluation(data)) {
      return {
        ok: false,
        error: { message: "Resposta inesperada do serviço de IA.", quotaExceeded: false },
      }
    }

    return { ok: true, data }
  } catch (err) {
    return {
      ok: false,
      error: {
        message: getErrorMessage(err, "Não foi possível conectar ao serviço de IA."),
        quotaExceeded: false,
      },
    }
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────

function isPromptEvaluation(value: unknown): value is PromptEvaluation {
  if (!value || typeof value !== "object") return false
  const v = value as Record<string, unknown>
  return (
    typeof v.score === "number" &&
    Array.isArray(v.strengths) &&
    Array.isArray(v.improvements) &&
    typeof v.enhancedPrompt === "string"
  )
}

/**
 * supabase-js resolves non-2xx function responses as a `FunctionsHttpError`
 * carrying the raw `Response` on `.context`. We read the JSON body (our Edge
 * Function always returns `{ error, quotaExceeded? }`) to surface a friendly
 * message and detect the 429 quota case.
 */
async function parseFunctionError(error: unknown): Promise<EvaluatePromptError> {
  const context = (error as { context?: Response } | null)?.context

  if (context && typeof context.json === "function") {
    try {
      const body = await context.json()
      return {
        message: typeof body?.error === "string" ? body.error : GENERIC_ERROR_MESSAGE,
        quotaExceeded: body?.quotaExceeded === true || context.status === 429,
      }
    } catch {
      // Body wasn't JSON — fall through to the generic message below.
    }
  }

  return {
    message: getErrorMessage(error, GENERIC_ERROR_MESSAGE),
    quotaExceeded: false,
  }
}
