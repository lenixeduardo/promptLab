import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import LessonHistory from "./LessonHistory"
import { getLessonCompletions } from "@/lib/db"

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user-1" } }),
}))

vi.mock("@/lib/db", () => ({
  getLessonCompletions: vi.fn(),
}))

vi.mock("@/lib/moduleProgress", () => ({
  getCompletedCount: (track: string) => (track === "a1" ? 7 : 0),
}))

vi.mock("@/components/AppBottomNav", () => ({
  AppBottomNav: () => <div data-testid="bottom-nav">Bottom Nav</div>,
}))

function makeCompletion(id: string, track: string, moduleIndex: number) {
  return { id, track, module_index: moduleIndex, completed_at: new Date().toISOString() }
}

function renderPage() {
  return render(
    <MemoryRouter>
      <LessonHistory />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("LessonHistory — estados", () => {
  it("mostra o total agregado de lições concluídas (soma de todas as trilhas)", async () => {
    vi.mocked(getLessonCompletions).mockResolvedValue({ data: [], error: null })
    renderPage()
    await waitFor(() => expect(screen.getByText("7")).toBeInTheDocument())
    expect(screen.getByText("lições concluídas no total")).toBeInTheDocument()
  })

  it("mostra estado vazio quando não há lições com data registrada", async () => {
    vi.mocked(getLessonCompletions).mockResolvedValue({ data: [], error: null })
    renderPage()
    expect(await screen.findByText("Nenhuma lição com data registrada ainda")).toBeInTheDocument()
  })

  it("lista as lições concluídas com o título real do módulo", async () => {
    vi.mocked(getLessonCompletions).mockResolvedValue({
      data: [makeCompletion("c1", "a1", 0)],
      error: null,
    })
    renderPage()
    expect(await screen.findByText("Trilha A1")).toBeInTheDocument()
  })
})

describe("LessonHistory — paginação", () => {
  it("mostra 'Carregar mais' quando a página vem cheia e busca a próxima com o offset certo", async () => {
    const PAGE_SIZE = 20
    const firstPage = Array.from({ length: PAGE_SIZE }, (_, i) =>
      makeCompletion(`p1-${i}`, "a1", 0)
    )
    const secondPage = [makeCompletion("p2-0", "a2", 0)]

    vi.mocked(getLessonCompletions).mockImplementation(async (_userId, _limit, offset = 0) => {
      return { data: offset === 0 ? firstPage : secondPage, error: null }
    })

    renderPage()
    await screen.findByText("Carregar mais")

    await userEvent.click(screen.getByText("Carregar mais"))

    await waitFor(() => {
      expect(getLessonCompletions).toHaveBeenLastCalledWith("user-1", PAGE_SIZE, PAGE_SIZE)
    })
  })
})
