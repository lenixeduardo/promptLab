/**
 * enhancePromptAI.ts
 *
 * Thin client for the "enhance-prompt" Edge Function, which asks a real LLM
 * (Gemini by default — see .env.example) to rewrite the user's prompt. This
 * is the AI-powered path used by the Prompt Enhancer; when it's unreachable,
 * unconfigured, or the daily quota is exceeded, callers fall back to the
 * local, deterministic heuristics in `promptEnhancer.ts` instead.
 */

import { supabase, getErrorMessage } from "@/lib/supabase"
import type { FocusMode } from "@/lib/promptEnhancer"

// ── Types ─────────────────────────────────────────────────────────────────

export interface AIEnhancement {
  enhancedMain: string
  audience: string
  tone: string
  appliedTechniques: string[]
  provider?: string
  quota?: { used: number; limit: number }
}

export interface EnhancePromptError {
  message: string
  /** True when the free daily quota has been exhausted (HTTP 429). */
  quotaExceeded: boolean
}

export type EnhancePromptResult =
  | { ok: true; data: AIEnhancement }
  | { ok: false; error: EnhancePromptError }

const GENERIC_ERROR_MESSAGE = "Não foi possível aprimorar com IA agora. Usando o motor local."

// ── Public API ────────────────────────────────────────────────────────────

export async function enhancePromptWithAI(
  prompt: string,
  focusMode: FocusMode,
): Promise<EnhancePromptResult> {
  try {
    const { data, error } = await supabase.functions.invoke("enhance-prompt", {
      body: { prompt, focusMode },
    })

    if (error) {
      return { ok: false, error: await parseFunctionError(error) }
    }

    if (!isAIEnhancement(data)) {
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

function isAIEnhancement(value: unknown): value is AIEnhancement {
  if (!value || typeof value !== "object") return false
  const v = value as Record<string, unknown>
  return (
    typeof v.enhancedMain === "string" &&
    typeof v.audience === "string" &&
    typeof v.tone === "string" &&
    Array.isArray(v.appliedTechniques)
  )
}

/**
 * supabase-js resolves non-2xx function responses as a `FunctionsHttpError`
 * carrying the raw `Response` on `.context`. We read the JSON body (our Edge
 * Function always returns `{ error, quotaExceeded? }`) to surface a friendly
 * message and detect the 429 quota case.
 */
async function parseFunctionError(error: unknown): Promise<EnhancePromptError> {
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
