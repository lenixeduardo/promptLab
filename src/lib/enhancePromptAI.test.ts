import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/supabase", () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
  getErrorMessage: (err: unknown, fallback: string) => {
    if (err instanceof Error) return err.message
    if (typeof err === "object" && err && "message" in err) {
      const message = (err as { message?: unknown }).message
      if (typeof message === "string") return message
    }
    return fallback
  },
}))

import { supabase } from "@/lib/supabase"
import { enhancePromptWithAI } from "./enhancePromptAI"

const mockInvoke = supabase.functions.invoke as ReturnType<typeof vi.fn>

function buildContext(status: number, body: unknown) {
  return {
    status,
    json: vi.fn().mockResolvedValue(body),
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("enhancePromptWithAI — sucesso", () => {
  it("retorna o texto aprimorado quando a function responde com sucesso", async () => {
    mockInvoke.mockResolvedValue({
      data: {
        enhancedMain: "Versão aprimorada do prompt.",
        audience: "Profissionais de marketing",
        tone: "Persuasivo",
        appliedTechniques: ["Persona definida", "Contexto explícito"],
        quota: { used: 1, limit: 15 },
      },
      error: null,
    })

    const result = await enhancePromptWithAI("Crie um texto sobre marketing", "general")

    expect(result.ok).toBe(true)
    if (result.ok === true) {
      expect(result.data.enhancedMain).toBe("Versão aprimorada do prompt.")
      expect(result.data.audience).toBe("Profissionais de marketing")
      expect(result.data.tone).toBe("Persuasivo")
      expect(result.data.appliedTechniques).toEqual(["Persona definida", "Contexto explícito"])
    }
    expect(mockInvoke).toHaveBeenCalledWith("enhance-prompt", {
      body: { prompt: "Crie um texto sobre marketing", focusMode: "general" },
    })
  })

  it("passa o focusMode adiante", async () => {
    mockInvoke.mockResolvedValue({
      data: { enhancedMain: "x", audience: "y", tone: "z", appliedTechniques: [] },
      error: null,
    })

    await enhancePromptWithAI("prompt", "precision")

    expect(mockInvoke).toHaveBeenCalledWith("enhance-prompt", {
      body: { prompt: "prompt", focusMode: "precision" },
    })
  })
})

describe("enhancePromptWithAI — erro genérico", () => {
  it("retorna erro amigável quando a function retorna um erro genérico (500/503)", async () => {
    mockInvoke.mockResolvedValue({
      data: null,
      error: {
        message: "Edge Function returned a non-2xx status code",
        context: buildContext(503, { error: "Serviço de IA não configurado" }),
      },
    })

    const result = await enhancePromptWithAI("prompt qualquer", "general")

    expect(result.ok).toBe(false)
    if (result.ok === false) {
      expect(result.error.message).toBe("Serviço de IA não configurado")
      expect(result.error.quotaExceeded).toBe(false)
    }
  })

  it("retorna erro genérico quando invoke lança uma exceção (ex: rede offline)", async () => {
    mockInvoke.mockRejectedValue(new Error("Failed to fetch"))

    const result = await enhancePromptWithAI("prompt qualquer", "general")

    expect(result.ok).toBe(false)
    if (result.ok === false) {
      expect(result.error.message).toBe("Failed to fetch")
      expect(result.error.quotaExceeded).toBe(false)
    }
  })

  it("retorna erro quando a resposta de sucesso vem em formato inesperado", async () => {
    mockInvoke.mockResolvedValue({ data: { foo: "bar" }, error: null })

    const result = await enhancePromptWithAI("prompt qualquer", "general")

    expect(result.ok).toBe(false)
    if (result.ok === false) {
      expect(result.error.quotaExceeded).toBe(false)
    }
  })
})

describe("enhancePromptWithAI — cota excedida (429)", () => {
  it("marca quotaExceeded=true e propaga a mensagem do servidor", async () => {
    mockInvoke.mockResolvedValue({
      data: null,
      error: {
        message: "Edge Function returned a non-2xx status code",
        context: buildContext(429, {
          error: "Limite diário de aprimoramentos com IA atingido. Tente novamente amanhã.",
          quotaExceeded: true,
        }),
      },
    })

    const result = await enhancePromptWithAI("prompt qualquer", "general")

    expect(result.ok).toBe(false)
    if (result.ok === false) {
      expect(result.error.quotaExceeded).toBe(true)
      expect(result.error.message).toMatch(/Limite diário/)
    }
  })

  it("marca quotaExceeded=true a partir do status 429 mesmo sem o campo explícito", async () => {
    mockInvoke.mockResolvedValue({
      data: null,
      error: {
        message: "Edge Function returned a non-2xx status code",
        context: buildContext(429, { error: "Limite atingido" }),
      },
    })

    const result = await enhancePromptWithAI("prompt qualquer", "general")

    expect(result.ok).toBe(false)
    if (result.ok === false) {
      expect(result.error.quotaExceeded).toBe(true)
    }
  })
})
