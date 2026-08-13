import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Lesson from "./Lesson"
import { uploadLessonProof } from "@/lib/db"
import { sileo } from "sileo"

// Dedicated test file for the "print de comprovação" upload flow
// (Lesson.tsx handleFile -> uploadLessonProof). Uses a fake single-question
// lesson with a proof task attached so the test doesn't depend on the real
// (and much longer) lesson content used by Lesson.test.tsx.

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

vi.mock("@/lib/db", () => ({
  uploadLessonProof: vi.fn(),
  recordLessonCompletion: vi.fn().mockResolvedValue({ data: null, error: null }),
}))

vi.mock("sileo", () => ({
  sileo: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))

const FAKE_QUESTION = {
  id: "fake-q1",
  prompt: "Pergunta única desta lição de teste",
  options: [
    { id: "a", text: "Opção certa" },
    { id: "b", text: "Opção errada" },
  ],
  correct: "a",
  explanation: "Explicação",
}

vi.mock("@/lib/lessonContent", () => ({
  getActivities: () => [FAKE_QUESTION],
  getProofTask: () => ({
    title: "Tarefa de teste",
    description: "Envie um print para testar o upload",
    examples: ["Exemplo 1"],
  }),
  TRACK_TOTALS: { a1: 1, a2: 1, a3: 1, a4: 1 },
  isMatch: () => false,
  isOrder: () => false,
  isEssay: () => false,
  isContentSlide: () => false,
  isFillBlank: () => false,
}))

function renderLesson() {
  return render(
    <MemoryRouter initialEntries={["/lesson?track=a1&module=0"]}>
      <Routes>
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/learn" element={"Learning Lab Page"} />
      </Routes>
    </MemoryRouter>
  )
}

function makeImageFile(name = "print.png") {
  return new File(["fake-image-content"], name, { type: "image/png" })
}

async function reachProofScreen() {
  renderLesson()
  const correctOption = await screen.findByText("Opção certa")
  fireEvent.click(correctOption)
  fireEvent.click(await screen.findByRole("button", { name: /Ver resultado/i }))
  await screen.findByText(/Toque para enviar um print/i)
}

describe("Lesson — upload de comprovação (Supabase Storage)", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("chama uploadLessonProof com userId, nome de arquivo e o File selecionado", async () => {
    vi.mocked(uploadLessonProof).mockResolvedValue({ data: "user-1/a1-0.png", error: null })

    await reachProofScreen()

    const input = document.getElementById("proof-file") as HTMLInputElement
    fireEvent.change(input, { target: { files: [makeImageFile()] } })

    await waitFor(() => {
      expect(uploadLessonProof).toHaveBeenCalledWith("user-1", "a1-0.png", expect.any(File))
    })
  })

  it("mostra 'Enviando...' enquanto o upload está em andamento", async () => {
    let resolveUpload: (v: { data: string | null; error: string | null }) => void
    vi.mocked(uploadLessonProof).mockReturnValue(
      new Promise((resolve) => {
        resolveUpload = resolve
      })
    )

    await reachProofScreen()

    const input = document.getElementById("proof-file") as HTMLInputElement
    fireEvent.change(input, { target: { files: [makeImageFile()] } })

    // setProofUploading(true) runs synchronously in handleFile, before the
    // (async) FileReader finishes — so it's visible immediately, in the same
    // tick, without waiting.
    expect(screen.getByText("Enviando...")).toBeInTheDocument()

    resolveUpload!({ data: "user-1/a1-0.png", error: null })
    await waitFor(() => {
      expect(screen.queryByText("Enviando...")).not.toBeInTheDocument()
    })
  })

  it("mostra toast de erro quando o upload falha, mas mantém o print salvo localmente", async () => {
    vi.mocked(uploadLessonProof).mockResolvedValue({ data: null, error: "Erro de rede" })

    await reachProofScreen()

    const input = document.getElementById("proof-file") as HTMLInputElement
    fireEvent.change(input, { target: { files: [makeImageFile()] } })

    await waitFor(() => {
      expect(sileo.error).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Não foi possível salvar a comprovação no servidor",
        })
      )
    })

    // A cópia local (offline-first) continua disponível mesmo com falha no upload
    await waitFor(() => {
      expect(localStorage.getItem("promptlabz:proof:a1:0::u:user-1")).toBeTruthy()
    })
  })

  it("não chama uploadLessonProof para um arquivo que não é imagem", async () => {
    await reachProofScreen()

    const input = document.getElementById("proof-file") as HTMLInputElement
    const textFile = new File(["not an image"], "doc.txt", { type: "text/plain" })
    fireEvent.change(input, { target: { files: [textFile] } })

    await new Promise((r) => setTimeout(r, 0))
    expect(uploadLessonProof).not.toHaveBeenCalled()
  })
})
