import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { AuthProvider, useAuthContext } from "./AuthContext"

const { mockGetSession, mockOnAuthStateChange } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockOnAuthStateChange: vi.fn(),
}))

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
  },
}))

function TestConsumer() {
  const { user, loading, error } = useAuthContext()
  if (loading) return <div>carregando</div>
  if (error) return <div>{error}</div>
  return <div>{user ? `logado: ${user.email}` : "deslogado"}</div>
}

beforeEach(() => {
  mockOnAuthStateChange.mockImplementation((callback) => {
    setTimeout(() => callback("INITIAL_SESSION", null), 0)
    return { data: { subscription: { unsubscribe: vi.fn() } } }
  })
})

describe("AuthProvider", () => {
  it("exibe estado de carregamento inicial", () => {
    mockGetSession.mockResolvedValue({ data: { session: null } })

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    expect(screen.getByText("carregando")).toBeInTheDocument()
  })

  it("exibe usuário deslogado quando não há sessão", async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } })

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await waitFor(() => expect(screen.getByText("deslogado")).toBeInTheDocument())
  })

  it("exibe usuário logado quando há sessão ativa", async () => {
    mockOnAuthStateChange.mockImplementation((callback) => {
      setTimeout(() => callback("INITIAL_SESSION", { user: { email: "user@test.com" } }), 0)
      return { data: { subscription: { unsubscribe: vi.fn() } } }
    })

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await waitFor(() => expect(screen.getByText("logado: user@test.com")).toBeInTheDocument())
  })

  it("lança erro ao usar useAuthContext fora do AuthProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<TestConsumer />)).toThrow(
      "useAuthContext must be used within AuthProvider"
    )
    consoleSpy.mockRestore()
  })

  it("exibe estado inicial de carregamento", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    expect(screen.getByText("carregando")).toBeInTheDocument()
  })
})
