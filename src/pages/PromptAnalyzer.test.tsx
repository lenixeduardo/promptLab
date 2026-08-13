import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import PromptAnalyzerPage from "./PromptAnalyzer"
import { evaluatePromptWithAI } from "@/lib/evaluatePrompt"

vi.mock("@/components/AppBottomNav", () => ({
  AppBottomNav: () => <div data-testid="bottom-nav">Bottom Nav</div>,
}))

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "test-user" } }),
}))

vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: vi.fn(() => true),
}))

vi.mock("@/lib/evaluatePrompt", () => ({
  evaluatePromptWithAI: vi.fn(),
}))

const mockEvaluatePromptWithAI = vi.mocked(evaluatePromptWithAI)

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/prompt-analyzer"]}>
      <Routes>
        <Route path="/prompt-analyzer" element={<PromptAnalyzerPage />} />
        <Route path="/premium" element={<div>Página Premium</div>} />
        <Route path="/home" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

async function uploadAndAnalyze() {
  const user = userEvent.setup()
  renderPage()

  const content =
    "Você:\nCrie um texto persuasivo sobre marketing digital para pequenas empresas com foco em vendas online."
  const file = new File([content], "conversa.txt", { type: "text/plain" })

  const input = screen.getByLabelText(/Selecione um arquivo de conversação/i) as HTMLInputElement
  await user.upload(input, file)

  const analyzeButton = await screen.findByRole("button", { name: /Analisar conversa/i })
  await user.click(analyzeButton)

  // The heuristic analysis runs after an internal 800ms setTimeout.
  await waitFor(() => expect(screen.getByText("Análise das solicitações")).toBeInTheDocument(), {
    timeout: 3000,
  })

  return user
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("PromptAnalyzer — Análise com IA", () => {
  it("exibe o botão de análise com IA após o resultado heurístico", async () => {
    await uploadAndAnalyze()
    expect(screen.getByRole("button", { name: /Analisar com IA/i })).toBeInTheDocument()
  })

  it("mostra score, pontos fortes, melhorias e prompt aprimorado em caso de sucesso", async () => {
    mockEvaluatePromptWithAI.mockResolvedValue({
      ok: true,
      data: {
        score: 88,
        strengths: ["Objetivo bem definido"],
        improvements: ["Adicione um exemplo de tom de voz"],
        enhancedPrompt: "Prompt aprimorado pela IA: seja mais específico sobre o público.",
      },
    })

    const user = await uploadAndAnalyze()
    await user.click(screen.getByRole("button", { name: /Analisar com IA/i }))

    await waitFor(() => {
      expect(screen.getByText("Objetivo bem definido")).toBeInTheDocument()
    })
    expect(screen.getByText("Adicione um exemplo de tom de voz")).toBeInTheDocument()
    expect(
      screen.getByText("Prompt aprimorado pela IA: seja mais específico sobre o público.")
    ).toBeInTheDocument()
    expect(mockEvaluatePromptWithAI).toHaveBeenCalledTimes(1)
  })

  it("mostra mensagem amigável em caso de erro genérico, sem quebrar a tela", async () => {
    mockEvaluatePromptWithAI.mockResolvedValue({
      ok: false,
      error: { message: "Serviço de IA não configurado", quotaExceeded: false },
    })

    const user = await uploadAndAnalyze()
    await user.click(screen.getByRole("button", { name: /Analisar com IA/i }))

    await waitFor(() => {
      expect(screen.getByText("Serviço de IA não configurado")).toBeInTheDocument()
    })
    // The rest of the heuristic result must still be visible — nothing crashed.
    expect(screen.getByText("Análise das solicitações")).toBeInTheDocument()
    expect(screen.queryByText(/Assine o Premium/i)).not.toBeInTheDocument()
  })

  it("mostra aviso de cota diária excedida (429) com link para /premium", async () => {
    mockEvaluatePromptWithAI.mockResolvedValue({
      ok: false,
      error: {
        message: "Limite diário de avaliações com IA atingido.",
        quotaExceeded: true,
      },
    })

    const user = await uploadAndAnalyze()
    await user.click(screen.getByRole("button", { name: /Analisar com IA/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/Você atingiu o limite diário gratuito de análises com IA\./i)
      ).toBeInTheDocument()
    })
    const premiumLink = screen.getByRole("link", { name: /Assine o Premium/i })
    expect(premiumLink).toHaveAttribute("href", "/premium")
  })
})
