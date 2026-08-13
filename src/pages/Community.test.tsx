import { describe, it, expect, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import Community from "./Community"
import { getReviews } from "@/lib/db"

vi.mock("@/components/AppBottomNav", () => ({
  AppBottomNav: () => <div data-testid="bottom-nav">Bottom Nav</div>,
}))

vi.mock("@/lib/db", () => ({
  getReviews: vi.fn().mockResolvedValue({ data: [], error: null }),
}))

function makeReview(id: string, comment: string) {
  return {
    id,
    user_id: "u1",
    rating: 5,
    comment,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

function renderCommunity() {
  return render(
    <MemoryRouter>
      <Community />
    </MemoryRouter>
  )
}

describe("Community — placeholder", () => {
  it("exibe o estado 'Em breve' do feed da comunidade", () => {
    renderCommunity()
    expect(screen.getByText("Em breve")).toBeInTheDocument()
  })
})

describe("Community — reviews reais", () => {
  it("não mostra a seção de reviews quando não há nenhuma", async () => {
    vi.mocked(getReviews).mockResolvedValue({ data: [], error: null })
    renderCommunity()
    await waitFor(() => expect(getReviews).toHaveBeenCalled())
    expect(screen.queryByText("O que dizem sobre o PromptLabz")).not.toBeInTheDocument()
  })

  it("mostra reviews reais e pagina com 'Carregar mais'", async () => {
    const PAGE_SIZE = 10
    const firstPage = Array.from({ length: PAGE_SIZE }, (_, i) =>
      makeReview(`p1-${i}`, `Comentário ${i}`)
    )
    const secondPage = [makeReview("p2-0", "Comentário extra")]

    vi.mocked(getReviews).mockImplementation(async (_limit, offset = 0) => {
      return { data: offset === 0 ? firstPage : secondPage, error: null }
    })

    renderCommunity()
    await screen.findByText("Comentário 0")

    const loadMoreButton = await screen.findByText("Carregar mais")
    await userEvent.click(loadMoreButton)

    await waitFor(() => {
      expect(screen.getByText("Comentário extra")).toBeInTheDocument()
    })

    expect(getReviews).toHaveBeenLastCalledWith(PAGE_SIZE, PAGE_SIZE)
    expect(screen.queryByText("Carregar mais")).not.toBeInTheDocument()
  })
})
