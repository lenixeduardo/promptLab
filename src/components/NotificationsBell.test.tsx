import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { NotificationsBell } from "./NotificationsBell"

const mockGetNotifications = vi.fn()
const mockMarkNotificationsRead = vi.fn()

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user-1", email: "test@test.com" } }),
}))

vi.mock("@/lib/db", () => ({
  getNotifications: (...args: unknown[]) => mockGetNotifications(...args),
  markNotificationsRead: (...args: unknown[]) => mockMarkNotificationsRead(...args),
}))

const makeNotif = (overrides = {}) => ({
  id: "n1",
  user_id: "user-1",
  type: "achievement" as const,
  title: "Conquista desbloqueada! 🏆",
  description: "Você completou sua primeira lição!",
  created_at: new Date().toISOString(),
  read_at: null,
  mention: false,
  action_label: null,
  href: null,
  ...overrides,
})

function renderBell() {
  return render(
    <MemoryRouter>
      <NotificationsBell />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mockMarkNotificationsRead.mockResolvedValue({ data: null, error: null })
})

describe("NotificationsBell — badge de não lidas", () => {
  it("exibe badge com contagem de itens não lidos", async () => {
    mockGetNotifications.mockResolvedValue({
      data: [makeNotif({ id: "n1", read_at: null }), makeNotif({ id: "n2", read_at: null })],
      error: null,
    })

    renderBell()

    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument()
    })
  })

  it("não exibe badge quando todas as notificações estão lidas", async () => {
    mockGetNotifications.mockResolvedValue({
      data: [makeNotif({ read_at: new Date().toISOString() })],
      error: null,
    })

    renderBell()

    await waitFor(() => {
      expect(screen.queryByText("1")).not.toBeInTheDocument()
    })
  })

  it("não exibe badge quando não há notificações", async () => {
    mockGetNotifications.mockResolvedValue({ data: [], error: null })
    renderBell()

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument()
    })
  })
})

describe("NotificationsBell — conteúdo do popover", () => {
  it("abre o popover ao clicar no sino", async () => {
    mockGetNotifications.mockResolvedValue({ data: [], error: null })

    renderBell()

    await userEvent.click(screen.getByRole("button", { name: /notificações/i }))
    expect(screen.getByText("Notificações")).toBeInTheDocument()
  })

  it("exibe notificações com título e descrição", async () => {
    mockGetNotifications.mockResolvedValue({
      data: [
        makeNotif({
          title: "Conquista desbloqueada! 🏆",
          description: "Você completou sua primeira lição!",
        }),
      ],
      error: null,
    })

    renderBell()
    await userEvent.click(screen.getByRole("button", { name: /notificações/i }))

    await waitFor(() => {
      expect(screen.getByText("Conquista desbloqueada! 🏆")).toBeInTheDocument()
      expect(screen.getByText("Você completou sua primeira lição!")).toBeInTheDocument()
    })
  })

  it("exibe estado vazio quando sem notificações", async () => {
    mockGetNotifications.mockResolvedValue({ data: [], error: null })

    renderBell()
    await userEvent.click(screen.getByRole("button", { name: /notificações/i }))

    expect(screen.getByText("Sem notificações.")).toBeInTheDocument()
  })

  it("exibe link para ver todas as notificações", async () => {
    mockGetNotifications.mockResolvedValue({ data: [], error: null })

    renderBell()
    await userEvent.click(screen.getByRole("button", { name: /notificações/i }))

    expect(screen.getByText("Ver todas as notificações")).toBeInTheDocument()
  })
})

describe("NotificationsBell — marcar como lidas", () => {
  it("chama markNotificationsRead ao clicar em 'Marcar todas como lidas'", async () => {
    mockGetNotifications.mockResolvedValue({
      data: [makeNotif({ read_at: null })],
      error: null,
    })

    renderBell()
    await userEvent.click(screen.getByRole("button", { name: /notificações/i }))

    await waitFor(() => {
      expect(screen.getByText("Marcar todas como lidas")).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText("Marcar todas como lidas"))

    await waitFor(() => {
      expect(mockMarkNotificationsRead).toHaveBeenCalledWith("user-1")
    })
  })

  it("remove o badge após marcar todas como lidas", async () => {
    mockGetNotifications.mockResolvedValue({
      data: [makeNotif({ read_at: null })],
      error: null,
    })

    renderBell()

    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole("button", { name: /notificações/i }))

    await waitFor(() => {
      expect(screen.getByText("Marcar todas como lidas")).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText("Marcar todas como lidas"))

    await waitFor(() => {
      expect(screen.queryByText("1")).not.toBeInTheDocument()
    })
  })

  it("não chama markNotificationsRead se não há itens não lidos", async () => {
    mockGetNotifications.mockResolvedValue({
      data: [makeNotif({ read_at: new Date().toISOString() })],
      error: null,
    })

    renderBell()
    await userEvent.click(screen.getByRole("button", { name: /notificações/i }))
    await userEvent.click(screen.getByText("Marcar todas como lidas"))

    expect(mockMarkNotificationsRead).not.toHaveBeenCalled()
  })
})

describe("NotificationsBell — busca por usuário", () => {
  it("busca notificações com limit 5 para o usuário", async () => {
    mockGetNotifications.mockResolvedValue({ data: [], error: null })
    renderBell()

    await waitFor(() => {
      expect(mockGetNotifications).toHaveBeenCalledWith("user-1", 5)
    })
  })

  it("exibe estado vazio quando Supabase retorna erro", async () => {
    mockGetNotifications.mockResolvedValue({ data: null, error: "Supabase não configurado" })
    renderBell()
    await userEvent.click(screen.getByRole("button", { name: /notificações/i }))

    expect(screen.getByText("Sem notificações.")).toBeInTheDocument()
  })
})
