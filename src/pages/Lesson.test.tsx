import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Lesson from "./Lesson"
import { recordLessonCompletion } from "@/lib/db"
import { sileo } from "sileo"

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user-1", email: "aluno@test.com" } }),
}))

vi.mock("@/lib/db", () => ({
  uploadLessonProof: vi.fn().mockResolvedValue({ data: "user-1/a1-0.png", error: null }),
  recordLessonCompletion: vi.fn().mockResolvedValue({ data: null, error: null }),
}))

vi.mock("sileo", () => ({
  sileo: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
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

vi.mock("@/hooks/useAchievements", () => ({
  useAchievements: () => ({
    checkLessonComplete: vi.fn().mockReturnValue([]),
  }),
}))

vi.mock("@/lib/xp", () => ({
  saveLocalXP: vi.fn(),
  saveLocalGems: vi.fn(),
  getLocalXP: vi.fn().mockReturnValue(0),
  getLocalGems: vi.fn().mockReturnValue(0),
  awardXP: vi.fn().mockReturnValue({ newXP: 0, prevLevel: 1, newLevel: 1, leveledUp: false }),
  XP_UPDATE_EVENT: "promptlabz:xp-updated",
  GEMS_UPDATE_EVENT: "promptlabz:gems-updated",
}))

vi.mock("@/lib/moduleProgress", () => ({
  advanceModule: vi.fn(),
  useModuleProgress: vi.fn().mockReturnValue(0),
}))

vi.mock("@/lib/userScope", () => ({
  scopedKey: (k: string) => `${k}::u:user-1`,
  USER_SCOPE_EVENT: "promptlabz:user-scope-change",
  initUserScope: vi.fn(),
  getUserId: vi.fn().mockReturnValue("user-1"),
}))

// a1Boas_vindas for track=a1, module=0: 1 content slide + 3 questions, all correct = "b"
const Q1_PROMPT = "O que é o PromptLabz?"
const Q1_OPT_B = "Uma trilha de aprendizado prática para você dominar a arte de escrever prompts"

function renderLesson(url = "/lesson?track=a1&module=0") {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/learn" element={"Learning Lab Page"} />
        <Route path="/module-exam" element={"Module Exam Page"} />
      </Routes>
    </MemoryRouter>
  )
}

// Click past any content slides so tests start at the first quiz question
function skipSlides() {
  const continueBtn = screen.queryByRole("button", { name: /Continuar/i })
  if (continueBtn) fireEvent.click(continueBtn)
}

describe("Lesson — fluxo de aprendizado", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("exibe a primeira pergunta e a barra de progresso", () => {
    renderLesson()
    skipSlides()
    expect(screen.getByText(/^\s*\d+\s+de\s+\d+\s*$/)).toBeInTheDocument()
  })

  it("exibe o botão desabilitado antes de selecionar uma opção", () => {
    renderLesson()
    skipSlides()
    expect(screen.getByText(/Selecione uma opção/i)).toBeInTheDocument()
  })

  it("mostra feedback positivo ao acertar a resposta", () => {
    renderLesson()
    skipSlides()
    // Click on option B (correct answer)
    const optionB = screen.getAllByRole("button").find((el) => el.textContent?.includes(Q1_OPT_B))
    expect(optionB).toBeTruthy()
    fireEvent.click(optionB!)
    expect(screen.getByText(/Mandou bem!/i)).toBeInTheDocument()
  })

  it("mostra feedback negativo ao errar a resposta", () => {
    renderLesson()
    skipSlides()
    // Click on option A (wrong answer for q1 — a1bv0)
    const optionA = screen
      .getAllByRole("button")
      .find((el) => el.textContent?.includes("Uma plataforma para treinar modelos de IA do zero"))
    expect(optionA).toBeTruthy()
    fireEvent.click(optionA!)
    expect(screen.getByText(/Quase lá!/i)).toBeInTheDocument()
  })

  it("exibe o botão 'Próxima atividade' após responder", () => {
    renderLesson()
    skipSlides()
    const optionB = screen.getAllByRole("button").find((el) => el.textContent?.includes(Q1_OPT_B))
    fireEvent.click(optionB!)
    expect(screen.getByRole("button", { name: /Próxima atividade/i })).toBeInTheDocument()
  })

  it("avança para a próxima pergunta ao clicar em 'Próxima atividade'", () => {
    renderLesson()
    skipSlides()
    // Answer q1 (now step 1 of 4 total)
    const optionB = screen.getAllByRole("button").find((el) => el.textContent?.includes(Q1_OPT_B))
    fireEvent.click(optionB!)
    fireEvent.click(screen.getByRole("button", { name: /Próxima atividade/i }))
    // step 2 of 4 (slide + q1 + q2 + q3)
    expect(screen.getByText(/^\s*3\s+de\s+4\s*$/)).toBeInTheDocument()
  })

  it("exibe tela de resultado após completar todas as perguntas", async () => {
    renderLesson()
    skipSlides()
    // Answer all 3 questions correctly (a1Boas_vindas — all correct = option "b")
    const answers = [
      Q1_OPT_B,
      "Escrever prompts claros, específicos e eficazes",
      "prompts bem escritos multiplicam sua produtividade",
    ]
    for (let i = 0; i < answers.length; i++) {
      const btn = screen.getAllByRole("button").find((el) => el.textContent?.includes(answers[i]))
      fireEvent.click(btn!)
      const nextBtn = screen.queryByRole("button", { name: /Próxima atividade/i })
      const finishBtn = screen.queryByRole("button", { name: /Ver resultado/i })
      if (i < answers.length - 1) {
        fireEvent.click(nextBtn!)
      } else if (finishBtn) {
        fireEvent.click(finishBtn)
      }
    }

    await waitFor(() => {
      expect(screen.getByText(/Perfeito!/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/XP/i)).toBeInTheDocument()
  })

  it("exibe 'Boa tentativa!' ao errar alguma pergunta", async () => {
    renderLesson()
    skipSlides()
    // Answer q1 wrong (option A — a1bv0)
    const wrongBtn = screen
      .getAllByRole("button")
      .find((el) => el.textContent?.includes("Uma plataforma para treinar modelos de IA do zero"))
    fireEvent.click(wrongBtn!)
    fireEvent.click(screen.getByRole("button", { name: /Próxima atividade/i }))

    // Answer rest correctly (a1bv1 and a1bv2)
    let btn = screen
      .getAllByRole("button")
      .find((el) => el.textContent?.includes("Escrever prompts claros, específicos e eficazes"))
    fireEvent.click(btn!)
    fireEvent.click(screen.getByRole("button", { name: /Próxima atividade/i }))

    btn = screen
      .getAllByRole("button")
      .find((el) => el.textContent?.includes("prompts bem escritos multiplicam sua produtividade"))
    fireEvent.click(btn!)
    fireEvent.click(screen.getByRole("button", { name: /Ver resultado/i }))

    await waitFor(() => {
      expect(screen.getByText(/Boa tentativa!/i)).toBeInTheDocument()
    })
  })

  it("acertando todas as questões: mostra a pontuação real e libera 'Próxima aula'", async () => {
    renderLesson()
    skipSlides()
    const answers = [
      Q1_OPT_B,
      "Escrever prompts claros, específicos e eficazes",
      "prompts bem escritos multiplicam sua produtividade",
    ]
    for (let i = 0; i < answers.length; i++) {
      const btn = screen.getAllByRole("button").find((el) => el.textContent?.includes(answers[i]))
      fireEvent.click(btn!)
      const nextBtn = screen.queryByRole("button", { name: /Próxima atividade/i })
      const finishBtn = screen.queryByRole("button", { name: /Ver resultado/i })
      if (i < answers.length - 1) fireEvent.click(nextBtn!)
      else if (finishBtn) fireEvent.click(finishBtn)
    }

    await waitFor(() => {
      expect(screen.getByText(/Perfeito!/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/Você acertou\s*3\s*de\s*3\s*atividades/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Próxima aula/i })).toBeInTheDocument()
    expect(recordLessonCompletion).toHaveBeenCalledWith("user-1", "a1", 0)
  })

  it("errando todas as questões: mostra 0/3 e NÃO libera 'Próxima aula'", async () => {
    renderLesson()
    skipSlides()
    const wrongAnswers = [
      "Uma plataforma para treinar modelos de IA do zero",
      "Programar modelos de linguagem (LLMs) em Python",
      "Porque a IA não funciona sem prompts perfeitos",
    ]
    for (let i = 0; i < wrongAnswers.length; i++) {
      const btn = screen
        .getAllByRole("button")
        .find((el) => el.textContent?.includes(wrongAnswers[i]))
      fireEvent.click(btn!)
      const nextBtn = screen.queryByRole("button", { name: /Próxima atividade/i })
      const finishBtn = screen.queryByRole("button", { name: /Ver resultado/i })
      if (i < wrongAnswers.length - 1) fireEvent.click(nextBtn!)
      else if (finishBtn) fireEvent.click(finishBtn)
    }

    await waitFor(() => {
      expect(screen.getByText(/Boa tentativa!/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/Você acertou\s*0\s*de\s*3\s*atividades/i)).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /Próxima aula/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /Fazer prova final/i })).not.toBeInTheDocument()
    expect(recordLessonCompletion).not.toHaveBeenCalled()
  })

  it("ao navegar para a próxima aula (mesma rota, só troca a query), o progresso não vaza da aula anterior", async () => {
    // Regression test: React Router keeps the same LessonPage instance when
    // only the `module` query param changes (clicking "Próxima aula" doesn't
    // remount). Local state (step/answers/etc.) used to leak from the
    // finished lesson into the next one, making the next lesson render
    // already "finished" with a bogus near-zero score.
    renderLesson("/lesson?track=a1&module=0")
    skipSlides()
    const answers = [
      Q1_OPT_B,
      "Escrever prompts claros, específicos e eficazes",
      "prompts bem escritos multiplicam sua produtividade",
    ]
    for (let i = 0; i < answers.length; i++) {
      const btn = screen.getAllByRole("button").find((el) => el.textContent?.includes(answers[i]))
      fireEvent.click(btn!)
      const nextBtn = screen.queryByRole("button", { name: /Próxima atividade/i })
      const finishBtn = screen.queryByRole("button", { name: /Ver resultado/i })
      if (i < answers.length - 1) fireEvent.click(nextBtn!)
      else if (finishBtn) fireEvent.click(finishBtn)
    }
    await waitFor(() => {
      expect(screen.getByText(/Perfeito!/i)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole("link", { name: /Próxima aula/i }))

    // The next lesson must start at its own first activity, not jump
    // straight to a stale "Lição concluída" screen.
    await waitFor(() => {
      expect(screen.queryByText(/Lição concluída/i)).not.toBeInTheDocument()
    })
  })
})
