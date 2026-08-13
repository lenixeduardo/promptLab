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
import { evaluatePromptWithAI } from "./evaluatePrompt"

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

describe("evaluatePromptWithAI — sucesso", () => {
  it("retorna a avaliação estruturada quando a function responde com sucesso", async () => {
    mockInvoke.mockResolvedValue({
      data: {
        score: 82,
        strengths: ["Objetivo claro"],
        improvements: ["Adicione exemplos"],
        enhancedPrompt: "Versão aprimorada do prompt.",
        quota: { used: 1, limit: 5 },
      },
      error: null,
    })

    const result = await evaluatePromptWithAI("Crie um texto sobre marketing")

    expect(result.ok).toBe(true)
    if (result.ok === true) {
      expect(result.data.score).toBe(82)
      expect(result.data.strengths).toEqual(["Objetivo claro"])
      expect(result.data.improvements).toEqual(["Adicione exemplos"])
      expect(result.data.enhancedPrompt).toBe("Versão aprimorada do prompt.")
    }
    expect(mockInvoke).toHaveBeenCalledWith("evaluate-prompt", {
      body: { prompt: "Crie um texto sobre marketing", mode: undefined },
    })
  })

  it("passa o mode adiante quando informado", async () => {
    mockInvoke.mockResolvedValue({
      data: { score: 50, strengths: [], improvements: [], enhancedPrompt: "x" },
      error: null,
    })

    await evaluatePromptWithAI("prompt", "precision")

    expect(mockInvoke).toHaveBeenCalledWith("evaluate-prompt", {
      body: { prompt: "prompt", mode: "precision" },
    })
  })
})

describe("evaluatePromptWithAI — erro genérico", () => {
  it("retorna erro amigável quando a function retorna um erro genérico (500/503)", async () => {
    mockInvoke.mockResolvedValue({
      data: null,
      error: {
        message: "Edge Function returned a non-2xx status code",
        context: buildContext(503, { error: "Serviço de IA não configurado" }),
      },
    })

    const result = await evaluatePromptWithAI("prompt qualquer")

    expect(result.ok).toBe(false)
    if (result.ok === false) {
      expect(result.error.message).toBe("Serviço de IA não configurado")
      expect(result.error.quotaExceeded).toBe(false)
    }
  })

  it("retorna erro genérico quando invoke lança uma exceção (ex: rede offline)", async () => {
    mockInvoke.mockRejectedValue(new Error("Failed to fetch"))

    const result = await evaluatePromptWithAI("prompt qualquer")

    expect(result.ok).toBe(false)
    if (result.ok === false) {
      expect(result.error.message).toBe("Failed to fetch")
      expect(result.error.quotaExceeded).toBe(false)
    }
  })

  it("retorna erro quando a resposta de sucesso vem em formato inesperado", async () => {
    mockInvoke.mockResolvedValue({ data: { foo: "bar" }, error: null })

    const result = await evaluatePromptWithAI("prompt qualquer")

    expect(result.ok).toBe(false)
    if (result.ok === false) {
      expect(result.error.quotaExceeded).toBe(false)
    }
  })
})

describe("evaluatePromptWithAI — cota excedida (429)", () => {
  it("marca quotaExceeded=true e propaga a mensagem do servidor", async () => {
    mockInvoke.mockResolvedValue({
      data: null,
      error: {
        message: "Edge Function returned a non-2xx status code",
        context: buildContext(429, {
          error:
            "Limite diário de avaliações com IA atingido. Assine o Premium para análises ilimitadas.",
          quotaExceeded: true,
        }),
      },
    })

    const result = await evaluatePromptWithAI("prompt qualquer")

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

    const result = await evaluatePromptWithAI("prompt qualquer")

    expect(result.ok).toBe(false)
    if (result.ok === false) {
      expect(result.error.quotaExceeded).toBe(true)
    }
  })
})
