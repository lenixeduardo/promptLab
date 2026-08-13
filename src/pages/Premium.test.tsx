import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import Premium from "./Premium"

const { mockGetSession, mockInvoke } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockInvoke: vi.fn(),
}))

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
    },
    functions: {
      invoke: mockInvoke,
    },
  },
}))

const mockSileoError = vi.fn()
vi.mock("sileo", () => ({
  sileo: {
    success: vi.fn(),
    error: (...args: unknown[]) => mockSileoError(...args),
  },
}))

vi.mock("@/components/AppBottomNav", () => ({
  AppBottomNav: () => <div data-testid="bottom-nav">Bottom Nav</div>,
}))

vi.mock("@/contexts/AuthContext", () => ({
  useAuthContext: () => ({ user: { id: "user-1" }, loading: false, error: null }),
}))

function renderPremium(initialRoute = "/premium") {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/premium" element={<Premium />} />
          <Route path="/home" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mockGetSession.mockResolvedValue({ data: { session: null } })
  mockInvoke.mockResolvedValue({ data: { url: "https://checkout.stripe.com/session" }, error: null })
})

describe("Premium — renderização", () => {
  it("exibe o título 'Seja Premium'", () => {
    renderPremium()
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Seja Premium")
  })

  it("exibe o texto descritivo", () => {
    renderPremium()
    expect(
      screen.getByText(/Acesse recursos exclusivos/i)
    ).toBeInTheDocument()
  })

  it("exibe o toggle de cobrança com Anual e Mensal", () => {
    renderPremium()
    const anualNodes = screen.getAllByText("Anual")
    const mensalNodes = screen.getAllByText("Mensal")
    expect(anualNodes.length).toBeGreaterThanOrEqual(1)
    expect(mensalNodes.length).toBeGreaterThanOrEqual(1)
  })

  it("exibe o badge -40% no plano anual", () => {
    renderPremium()
    expect(screen.getByText("-40%")).toBeInTheDocument()
  })

  it("exibe o preço do plano anual", () => {
    renderPremium()
    expect(screen.getByText("R$ 29,90")).toBeInTheDocument()
  })

  it("exibe o preço do plano mensal", () => {
    renderPremium()
    expect(screen.getByText("R$ 49,90")).toBeInTheDocument()
  })

  it("exibe o CTA de assinatura", () => {
    renderPremium()
    expect(screen.getByText("Quero ser Premium")).toBeInTheDocument()
  })

  it("exibe o texto do período de teste grátis", () => {
    renderPremium()
    expect(screen.getByText(/30 dias grátis/i)).toBeInTheDocument()
  })

  it("exibe a linha de confiança no rodapé", () => {
    renderPremium()
    expect(screen.getByText(/Pagamento seguro/i)).toBeInTheDocument()
  })

  it("exibe os benefícios inclusos", () => {
    renderPremium()
    expect(screen.getByText("Todos os planos incluem")).toBeInTheDocument()
    expect(screen.getByText("IA ilimitada")).toBeInTheDocument()
    expect(screen.getByText("Gamificação")).toBeInTheDocument()
    expect(screen.getByText("Conteúdo Premium")).toBeInTheDocument()
    expect(screen.getByText("Suporte Prioritário")).toBeInTheDocument()
  })

  it("renderiza a bottom nav", () => {
    renderPremium()
    expect(screen.getByTestId("bottom-nav")).toBeInTheDocument()
  })
})

describe("Premium — interação", () => {
  it("plano Anual está selecionado por padrão", () => {
    renderPremium()
    // Toggle buttons have "Anual" and "Mensal" as their text content
    // Plan card titles also have "Anual" and "Mensal"
    const buttons = screen.getAllByRole("button")
    const anualToggle = buttons.find(
      (b) => b.textContent?.includes("Anual") && b.getAttribute("data-selected") === "true"
    )
    expect(anualToggle).toBeTruthy()
  })

  it("troca para Mensal ao clicar", async () => {
    renderPremium()
    const buttons = screen.getAllByRole("button")
    const mensalToggle = buttons.find(
      (b) => b.textContent?.includes("Mensal") && !b.textContent?.includes("R$")
    )
    expect(mensalToggle).toBeTruthy()
    if (mensalToggle) {
      await userEvent.click(mensalToggle)
      expect(mensalToggle).toHaveAttribute("data-selected", "true")
    }
  })

  it("exibe o badge 'Mais escolhido' no plano anual", () => {
    renderPremium()
    expect(screen.getByText("Mais escolhido")).toBeInTheDocument()
  })

  it("exibe o preço antigo riscado no plano anual", () => {
    renderPremium()
    // The old price "R$ 69,90" has line-through styling and might be split across elements
    const allElements = screen.getAllByText(/69,90/)
    expect(allElements.length).toBeGreaterThanOrEqual(1)
  })
})

describe("Premium — navegação", () => {
  it("volta para Home pelo botão de voltar", async () => {
    renderPremium()
    const backButton = screen.getByLabelText("Voltar")
    await userEvent.click(backButton)
    await waitFor(() => {
      expect(screen.getByText("Home Page")).toBeInTheDocument()
    })
  })
})

describe("Premium — checkout", () => {
  it("redireciona para login ao clicar sem sessão ativa", async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } })
    renderPremium("/premium")
    await userEvent.click(screen.getByText("Quero ser Premium"))
    expect(mockInvoke).not.toHaveBeenCalled()
  })

  it("chama o checkout do Stripe quando o usuário está logado", async () => {
    mockGetSession.mockResolvedValue({ data: { session: { access_token: "token" } } })
    const originalLocation = window.location
    // @ts-expect-error - simplify window.location for assertion in jsdom
    delete window.location
    window.location = { ...originalLocation, href: "" } as unknown as Location

    renderPremium("/premium")
    await userEvent.click(screen.getByText("Quero ser Premium"))

    await waitFor(() => {
      expect(mockInvoke).toHaveBeenCalledWith("stripe-checkout")
    })
    await waitFor(() => {
      expect(window.location.href).toBe("https://checkout.stripe.com/session")
    })

    window.location = originalLocation
  })

  it("exibe erro quando o checkout falha", async () => {
    mockGetSession.mockResolvedValue({ data: { session: { access_token: "token" } } })
    mockInvoke.mockResolvedValue({ data: null, error: new Error("failed") })

    renderPremium("/premium")
    await userEvent.click(screen.getByText("Quero ser Premium"))

    await waitFor(() => {
      expect(mockSileoError).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Erro" })
      )
    })
  })
})
