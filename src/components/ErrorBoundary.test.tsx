import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { ErrorBoundary } from "./ErrorBoundary"

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error("Explosão de teste")
  return <div>conteúdo ok</div>
}

describe("ErrorBoundary", () => {
  it("renderiza filhos normalmente quando não há erro", () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>
    )
    expect(screen.getByText("conteúdo ok")).toBeInTheDocument()
  })

  it("exibe tela de erro quando um filho lança exceção", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText("Algo deu errado")).toBeInTheDocument()
    expect(screen.getByText("Explosão de teste")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /voltar ao início/i })).toBeInTheDocument()

    consoleSpy.mockRestore()
  })
})
