import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import { NEWS_ARTICLES } from "@/data/newsData"
import News from "./News"
import { getNewsArticles } from "@/lib/db"

vi.mock("@/components/AppBottomNav", () => ({
  AppBottomNav: () => <div data-testid="bottom-nav">Bottom Nav</div>,
}))

vi.mock("@/lib/db", () => ({
  getNewsArticles: vi.fn().mockResolvedValue({ data: null, error: null }),
}))

function makeArticle(id: string, title: string) {
  return {
    id,
    title,
    description: "desc",
    category: "General" as const,
    image_emoji: "📰",
    image_url: null,
    source_url: null,
    published_at: new Date().toISOString(),
  }
}

function renderNews() {
  return render(
    <MemoryRouter>
      <News />
    </MemoryRouter>
  )
}

describe("News - detalhe da noticia", () => {
  it("abre o conteudo completo ao clicar em uma noticia e permite fechar", async () => {
    const user = userEvent.setup()
    const article = NEWS_ARTICLES[0]

    renderNews()
    await user.click(await screen.findByRole("button", { name: article.title }))

    const dialog = screen.getByRole("dialog", { name: article.title })
    expect(within(dialog).getByText(article.description)).toBeInTheDocument()

    await user.click(within(dialog).getByRole("button", { name: "Fechar noticia" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})

describe("News - paginacao (Carregar mais)", () => {
  it("mostra 'Carregar mais notícias' quando a primeira pagina remota vem cheia e busca a proxima com o offset correto", async () => {
    const PAGE_SIZE = 30
    const firstPage = Array.from({ length: PAGE_SIZE }, (_, i) =>
      makeArticle(`p1-${i}`, `Noticia ${i}`)
    )
    const secondPage = [makeArticle("p2-0", "Noticia extra")]

    vi.mocked(getNewsArticles).mockImplementation(async (_limit, offset = 0) => {
      return { data: offset === 0 ? firstPage : secondPage, error: null }
    })

    renderNews()
    await screen.findByRole("button", { name: "Noticia 0" })

    const loadMoreButton = await screen.findByText("Carregar mais notícias")
    await userEvent.click(loadMoreButton)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Noticia extra" })).toBeInTheDocument()
    })

    expect(getNewsArticles).toHaveBeenLastCalledWith(PAGE_SIZE, PAGE_SIZE)
    expect(screen.queryByText("Carregar mais notícias")).not.toBeInTheDocument()
  })

  it("nao mostra 'Carregar mais' quando os dados vem do fallback estatico (sem Supabase)", async () => {
    vi.mocked(getNewsArticles).mockResolvedValue({ data: null, error: null })

    renderNews()
    await screen.findByRole("button", { name: NEWS_ARTICLES[0].title })

    expect(screen.queryByText("Carregar mais notícias")).not.toBeInTheDocument()
  })
})
