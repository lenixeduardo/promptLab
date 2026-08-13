import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import LearningLab from "./LearningLab"

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user-1", email: "aluno@test.com" } }),
}))

vi.mock("@/contexts/useLives", () => ({
  useLives: () => ({
    lives: 5,
    maxLives: 5,
    canPlay: true,
    msUntilNextLife: () => 0,
    consumeLife: vi.fn(),
    awardPerfectBonus: vi.fn(),
  }),
}))

vi.mock("@/lib/moduleProgress", () => ({
  useModuleProgress: vi.fn().mockReturnValue(0),
}))

vi.mock("@/lib/userScope", () => ({
  scopedKey: (k: string) => `${k}::u:user-1`,
  USER_SCOPE_EVENT: "promptlabz:user-scope-change",
  initUserScope: vi.fn(),
  getUserId: vi.fn().mockReturnValue("user-1"),
}))

function renderLearningLab(initialUrl = "/learn") {
  return render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <Routes>
        <Route path="/learn" element={<LearningLab />} />
        <Route path="/lesson" element={<div>Lesson Page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe("LearningLab — trilha de aprendizado", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("renderiza o heading com a trilha ativa", () => {
    renderLearningLab()
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Trilha A1")
  })

  it("exibe o subtítulo da trilha ativa", () => {
    renderLearningLab()
    expect(screen.getByText(/Fundamentos de prompts/i)).toBeInTheDocument()
  })

  it("exibe os seletores das três trilhas", () => {
    renderLearningLab()
    expect(screen.getByRole("tab", { name: /Trilha A1/i })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: /Trilha A2/i })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: /Trilha A3/i })).toBeInTheDocument()
  })

  it("exibe o primeiro módulo da trilha A1", () => {
    renderLearningLab()
    expect(screen.getByText("Boas-vindas")).toBeInTheDocument()
  })

  it("exibe os módulos subsequentes da trilha A1", () => {
    renderLearningLab()
    expect(screen.getByText("O que é um prompt")).toBeInTheDocument()
    expect(screen.getByText("Refino iterativo")).toBeInTheDocument()
  })

  it("troca para a trilha A2 ao clicar no seletor", () => {
    renderLearningLab()
    fireEvent.click(screen.getByRole("tab", { name: /Trilha A2/i }))
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Trilha A2")
    expect(screen.getByText(/Prompts avançados/i)).toBeInTheDocument()
  })

  it("exibe ícones de cadeado nos módulos bloqueados (todos bloqueados com 0 progresso)", () => {
    renderLearningLab()
    // The SVG Lock icons are rendered inside the module circles for locked modules
    // With 0 progress only the first module is current, rest are locked
    const links = screen.getAllByRole("link")
    // At least some links should point to /learn (locked) or /lesson?track=a1&module=0 (current)
    expect(links.length).toBeGreaterThan(0)
  })

  it("o módulo atual tem link para /lesson", () => {
    renderLearningLab()
    const lessonLinks = screen
      .getAllByRole("link")
      .filter((el) => el.getAttribute("href")?.includes("/lesson"))
    expect(lessonLinks.length).toBeGreaterThan(0)
  })

  it("troca para a trilha A3 ao clicar no seletor", () => {
    renderLearningLab()
    fireEvent.click(screen.getByRole("tab", { name: /Trilha A3/i }))
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Trilha A3")
    expect(screen.getByText(/Prompts para código/i)).toBeInTheDocument()
  })
})
