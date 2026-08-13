import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { AppBottomNav, BOTTOM_NAV_ITEMS } from "./AppBottomNav"

vi.mock("@/lib/icons", () => {
  const FakeIcon = (props: Record<string, unknown>) => (
    <svg data-testid={`icon-${props["data-icon"] || "default"}`} />
  )
  return {
    LayoutGrid: (props: Record<string, unknown>) => (
      <svg data-testid="icon-LayoutGrid" {...props} />
    ),
    GraduationCap: (props: Record<string, unknown>) => (
      <svg data-testid="icon-GraduationCap" {...props} />
    ),
    FlaskConical: (props: Record<string, unknown>) => (
      <svg data-testid="icon-FlaskConical" {...props} />
    ),
    Target: (props: Record<string, unknown>) => <svg data-testid="icon-Target" {...props} />,
    Bell: (props: Record<string, unknown>) => <svg data-testid="icon-Bell" {...props} />,
    Trophy: (props: Record<string, unknown>) => <svg data-testid="icon-Trophy" {...props} />,
    User: (props: Record<string, unknown>) => <svg data-testid="icon-User" {...props} />,
  }
})

describe("AppBottomNav", () => {
  it("renderiza 6 itens de navegação", () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <AppBottomNav />
      </MemoryRouter>
    )
    expect(BOTTOM_NAV_ITEMS).toHaveLength(6)
  })

  it("exibe os labels de todos os itens", () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <AppBottomNav />
      </MemoryRouter>
    )
    expect(screen.getByText("Início")).toBeInTheDocument()
    expect(screen.getByText("Trilha")).toBeInTheDocument()
    expect(screen.getByText("Laboratório")).toBeInTheDocument()
    expect(screen.getByText("Missões")).toBeInTheDocument()
    expect(screen.getByText("Conquistas")).toBeInTheDocument()
    expect(screen.getByText("Perfil")).toBeInTheDocument()
  })

  it("destaca o item ativo com aria-current='page'", () => {
    render(
      <MemoryRouter initialEntries={["/achievements"]}>
        <AppBottomNav />
      </MemoryRouter>
    )

    const achievementsLink = screen.getByLabelText("Conquistas")
    expect(achievementsLink).toHaveAttribute("aria-current", "page")
  })

  it("não destaca itens inativos", () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <AppBottomNav />
      </MemoryRouter>
    )

    const labLink = screen.getByLabelText("Laboratório")
    expect(labLink).not.toHaveAttribute("aria-current")
  })

  it("cada item tem um link href válido", () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <AppBottomNav />
      </MemoryRouter>
    )

    BOTTOM_NAV_ITEMS.forEach((item) => {
      const link = screen.getByLabelText(item.label)
      expect(link).toHaveAttribute("href", item.href)
    })
  })
})
