import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useAuth } from "./useAuth"

// Mock Supabase
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      signInWithOAuth: vi.fn(),
    },
  },
  getErrorMessage: (err: unknown, fallback: string) =>
    err && typeof err === "object" && "message" in err
      ? String((err as { message: unknown }).message)
      : fallback,
}))

// Mock AuthContext
vi.mock("@/contexts/AuthContext", () => ({
  useAuthContext: () => ({ user: null, loading: false, error: null }),
}))

import { supabase } from "@/lib/supabase"

const mockAuth = supabase.auth as any

beforeEach(() => vi.clearAllMocks())

describe("useAuth — login", () => {
  it("retorna sucesso ao fazer login com credenciais válidas", async () => {
    mockAuth.signInWithPassword.mockResolvedValue({
      data: { user: { id: "123", email: "test@test.com" } },
      error: null,
    })

    const { result } = renderHook(() => useAuth())
    let res: any
    await act(async () => {
      res = await result.current.login("test@test.com", "senha123")
    })

    expect(res.success).toBe(true)
    expect(res.user?.email).toBe("test@test.com")
  })

  it("retorna erro com credenciais inválidas", async () => {
    mockAuth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: "Invalid login credentials" },
    })

    const { result } = renderHook(() => useAuth())
    let res: any
    await act(async () => {
      res = await result.current.login("test@test.com", "errada")
    })

    expect(res.success).toBe(false)
    expect(res.error).toBe("Invalid login credentials")
  })

  it("retorna erro genérico quando a exceção não tem mensagem", async () => {
    mockAuth.signInWithPassword.mockRejectedValue({})

    const { result } = renderHook(() => useAuth())
    let res: any
    await act(async () => {
      res = await result.current.login("test@test.com", "senha")
    })

    expect(res.success).toBe(false)
    expect(res.error).toBe("Erro ao fazer login")
  })
})

describe("useAuth — signup", () => {
  it("retorna sucesso ao criar conta com dados válidos", async () => {
    mockAuth.signUp.mockResolvedValue({
      data: { user: { id: "abc", email: "novo@test.com" }, session: null },
      error: null,
    })

    const { result } = renderHook(() => useAuth())
    let res: any
    await act(async () => {
      res = await result.current.signup("novo@test.com", "senha123", "Novo User")
    })

    expect(res.success).toBe(true)
    expect(res.user.email).toBe("novo@test.com")
    expect(mockAuth.signUp).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          data: { full_name: "Novo User" },
        }),
      })
    )
  })

  it("retorna sucesso quando a sessão é criada imediatamente", async () => {
    mockAuth.signUp.mockResolvedValue({
      data: {
        user: { id: "abc", email: "novo@test.com" },
        session: { access_token: "token" },
      },
      error: null,
    })

    const { result } = renderHook(() => useAuth())
    let res: any
    await act(async () => {
      res = await result.current.signup("novo@test.com", "senha123")
    })

    expect(res.success).toBe(true)
  })

  it("retorna erro quando email já está cadastrado", async () => {
    mockAuth.signUp.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "User already registered" },
    })

    const { result } = renderHook(() => useAuth())
    let res: any
    await act(async () => {
      res = await result.current.signup("existente@test.com", "senha123")
    })

    expect(res.success).toBe(false)
    expect(res.error).toBe("User already registered")
  })
})

describe("useAuth — logout", () => {
  it("faz logout com sucesso", async () => {
    mockAuth.signOut.mockResolvedValue({ error: null })

    const { result } = renderHook(() => useAuth())
    let res: any
    await act(async () => {
      res = await result.current.logout()
    })

    expect(res.success).toBe(true)
  })

  it("retorna erro quando logout falha", async () => {
    mockAuth.signOut.mockResolvedValue({ error: { message: "Logout failed" } })

    const { result } = renderHook(() => useAuth())
    let res: any
    await act(async () => {
      res = await result.current.logout()
    })

    expect(res.success).toBe(false)
    expect(res.error).toBe("Logout failed")
  })
})

describe("useAuth — resetPassword", () => {
  it("envia email de reset com sucesso", async () => {
    mockAuth.resetPasswordForEmail.mockResolvedValue({ error: null })

    const { result } = renderHook(() => useAuth())
    let res: any
    await act(async () => {
      res = await result.current.resetPassword("test@test.com")
    })

    expect(res.success).toBe(true)
    expect(mockAuth.resetPasswordForEmail).toHaveBeenCalledWith(
      "test@test.com",
      expect.objectContaining({ redirectTo: expect.stringContaining("/reset-password") })
    )
  })

  it("retorna erro quando email não está cadastrado", async () => {
    mockAuth.resetPasswordForEmail.mockResolvedValue({
      error: { message: "Email not found" },
    })

    const { result } = renderHook(() => useAuth())
    let res: any
    await act(async () => {
      res = await result.current.resetPassword("nao@existe.com")
    })

    expect(res.success).toBe(false)
    expect(res.error).toBe("Email not found")
  })
})

describe("useAuth — loginWithGoogle", () => {
  it("inicia fluxo OAuth com Google sem erro", async () => {
    mockAuth.signInWithOAuth.mockResolvedValue({ error: null })

    const { result } = renderHook(() => useAuth())
    let res: any
    await act(async () => {
      res = await result.current.loginWithGoogle()
    })

    expect(res.success).toBe(true)
    expect(mockAuth.signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: expect.objectContaining({ redirectTo: expect.stringContaining("/auth/callback") }),
    })
  })

  it("retorna erro quando OAuth falha", async () => {
    mockAuth.signInWithOAuth.mockResolvedValue({
      error: { message: "OAuth error" },
    })

    const { result } = renderHook(() => useAuth())
    let res: any
    await act(async () => {
      res = await result.current.loginWithGoogle()
    })

    expect(res.success).toBe(false)
    expect(res.error).toBe("OAuth error")
  })
})
