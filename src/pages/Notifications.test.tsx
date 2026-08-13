import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Notifications from "./Notifications"
import { getNotifications } from "@/lib/db"

const mockUser = { id: "user-1", email: "test@test.com" }

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user-1", email: "test@test.com" } }),
}))

vi.mock("@/lib/db", () => ({
  getNotifications: vi.fn().mockResolvedValue({
    data: [
      {
        id: "n1",
        user_id: "user-1",
        type: "achievement",
        title: "Conquista desbloqueada! 🏆",
        description: "Você completou sua primeira lição!",
        created_at: new Date().toISOString(),
        read_at: null,
        mention: false,
        action_label: null,
        href: null,
      },
      {
        id: "n2",
        user_id: "user-1",
        type: "mention",
        title: "Mencionaram você no fórum",
        description: "Carlos respondeu seu comentário.",
        created_at: new Date().toISOString(),
        read_at: null,
        mention: true,
        action_label: null,
        href: null,
      },
      {
        id: "n3",
        user_id: "user-1",
        type: "system",
        title: "Nova skill disponível",
        description: "Nova skill adicionada ao catálogo.",
        created_at: new Date().toISOString(),
        read_at: new Date().toISOString(),
        mention: false,
        action_label: null,
        href: null,
      },
      {
        id: "n4",
        user_id: "user-1",
        type: "system",
        title: "Atualização da plataforma",
        description: "Novo recurso disponível.",
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        read_at: new Date().toISOString(),
        mention: false,
        action_label: null,
        href: null,
      },
    ],
    error: null,
  }),
  markNotificationsRead: vi.fn().mockResolvedValue({ data: null, error: null }),
}))

vi.mock("@/components/AppBottomNav", () => ({
  AppBottomNav: () => <div data-testid="bottom-nav">Bottom Nav</div>,
}))

function renderNotifications(initialRoute = "/notifications") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/home" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("Notifications — renderização", () => {
  it("exibe o título 'Notificações'", () => {
    renderNotifications()
    expect(screen.getByText("Notificações")).toBeInTheDocument()
  })

  it("exibe as 3 abas de filtro com contagens", () => {
    renderNotifications()
    expect(screen.getByText("Todas")).toBeInTheDocument()
    expect(screen.getByText("Não lidas")).toBeInTheDocument()
    expect(screen.getByText("Mentions")).toBeInTheDocument()
  })

  it("exibe notificações agrupadas", async () => {
    renderNotifications()
    expect(await screen.findByText("Hoje")).toBeInTheDocument()
    expect(screen.getByText("Anterior")).toBeInTheDocument()
  })

  it("exibe itens de notificação com títulos", async () => {
    renderNotifications()
    expect(await screen.findByText(/Conquista desbloqueada/i)).toBeInTheDocument()
    expect(screen.getByText(/Mencionaram você/i)).toBeInTheDocument()
    expect(screen.getByText(/Nova skill disponível/i)).toBeInTheDocument()
  })

  it("exibe o botão de configurações", () => {
    renderNotifications()
    expect(screen.getByLabelText("Configurações")).toBeInTheDocument()
  })

  it("renderiza a bottom nav", () => {
    renderNotifications()
    expect(screen.getByTestId("bottom-nav")).toBeInTheDocument()
  })
})

describe("Notifications — filtros", () => {
  it("filtra por 'Não lidas' ao clicar na aba", async () => {
    renderNotifications()
    await screen.findByText(/Conquista desbloqueada/i)
    await userEvent.click(screen.getByText("Não lidas"))

    expect(screen.getByText(/Conquista desbloqueada/i)).toBeInTheDocument()
  })

  it("filtra por 'Mentions' ao clicar na aba", async () => {
    renderNotifications()
    await screen.findByText(/Mencionaram você/i)
    await userEvent.click(screen.getByText("Mentions"))

    expect(screen.getByText(/Mencionaram você/i)).toBeInTheDocument()
  })

  it("aba 'Todas' está ativa por padrão", () => {
    renderNotifications()
    const allTab = screen.getByText("Todas")
    expect(allTab.closest("button")).toHaveClass("bg-primary-dark")
  })
})

describe("Notifications — navegação", () => {
  it("volta para Home pelo botão de voltar", async () => {
    renderNotifications()
    const backButton = screen.getByLabelText("Voltar")
    await userEvent.click(backButton)
    await waitFor(() => {
      expect(screen.getByText("Home Page")).toBeInTheDocument()
    })
  })
})

function makeNotification(id: string, title: string) {
  return {
    id,
    user_id: "user-1",
    type: "system" as const,
    title,
    description: "desc",
    created_at: new Date().toISOString(),
    read_at: new Date().toISOString(),
    mention: false,
    action_label: null,
    href: null,
  }
}

describe("Notifications — paginação (Carregar mais)", () => {
  it("mostra 'Carregar mais' quando a primeira página vem cheia (50 itens) e busca a próxima página com o offset correto", async () => {
    const firstPage = Array.from({ length: 50 }, (_, i) =>
      makeNotification(`p1-${i}`, `Notificação ${i}`)
    )
    const secondPage = [makeNotification("p2-0", "Notificação extra")]

    vi.mocked(getNotifications).mockImplementation(async (_userId, _limit, offset = 0) => {
      return { data: offset === 0 ? firstPage : secondPage, error: null }
    })

    renderNotifications()
    await screen.findByText("Notificação 0")

    const loadMoreButton = await screen.findByText("Carregar mais")
    expect(loadMoreButton).toBeInTheDocument()

    await userEvent.click(loadMoreButton)

    await waitFor(() => {
      expect(screen.getByText("Notificação extra")).toBeInTheDocument()
    })

    // Segunda chamada deve pedir a partir do offset = itens já carregados (50)
    expect(getNotifications).toHaveBeenLastCalledWith("user-1", 50, 50)
    // Página seguinte veio incompleta (1 item) → não há mais páginas
    expect(screen.queryByText("Carregar mais")).not.toBeInTheDocument()
  })

  it("não mostra 'Carregar mais' quando a primeira página já vem incompleta", async () => {
    vi.mocked(getNotifications).mockResolvedValue({
      data: [makeNotification("n1", "Única notificação")],
      error: null,
    })

    renderNotifications()
    await screen.findByText("Única notificação")

    expect(screen.queryByText("Carregar mais")).not.toBeInTheDocument()
  })
})
