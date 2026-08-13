import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import ForgotPassword from "./ForgotPassword"
import { sileo } from "sileo"

const mockResetPassword = vi.fn()

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ resetPassword: mockResetPassword }),
}))

vi.mock("sileo", () => ({
  sileo: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => null,
}))

function renderForgotPassword() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/forgot-password"]}>
        <Routes>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/login" element={<div>login</div>} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  )
}

beforeEach(() => vi.clearAllMocks())

describe("ForgotPassword — renderização", () => {
  it("exibe campo de e-mail", () => {
    renderForgotPassword()
    expect(screen.getByPlaceholderText("Digite seu e-mail cadastrado")).toBeInTheDocument()
  })

  it("exibe botão 'Enviar link de redefinição'", () => {
    renderForgotPassword()
    expect(screen.getByRole("button", { name: /enviar link de redefinição/i })).toBeInTheDocument()
  })

  it("exibe link 'Voltar para o login'", () => {
    renderForgotPassword()
    expect(screen.getByText(/voltar para o login/i)).toBeInTheDocument()
  })
})

describe("ForgotPassword — submissão", () => {
  it("exibe tela de sucesso após envio", async () => {
    mockResetPassword.mockResolvedValue({ success: true })

    renderForgotPassword()
    await userEvent.type(
      screen.getByPlaceholderText("Digite seu e-mail cadastrado"),
      "user@test.com"
    )
    await userEvent.click(screen.getByRole("button", { name: /enviar link de redefinição/i }))

    await waitFor(() => expect(screen.getByText("E-mail enviado!")).toBeInTheDocument())
    expect(screen.getByText(/verifique sua caixa de entrada/i)).toBeInTheDocument()
  })

  it("exibe mensagem de erro quando reset falha", async () => {
    mockResetPassword.mockResolvedValue({ success: false, error: "Email não encontrado" })

    renderForgotPassword()
    await userEvent.type(
      screen.getByPlaceholderText("Digite seu e-mail cadastrado"),
      "nao@existe.com"
    )
    await userEvent.click(screen.getByRole("button", { name: /enviar link de redefinição/i }))

    await waitFor(() => expect(sileo.error).toHaveBeenCalledWith({ title: "Email não encontrado" }))
  })

  it("exibe 'Enviando...' enquanto request está em andamento", async () => {
    mockResetPassword.mockImplementation(() => new Promise(() => {}))

    renderForgotPassword()
    await userEvent.type(
      screen.getByPlaceholderText("Digite seu e-mail cadastrado"),
      "user@test.com"
    )
    await userEvent.click(screen.getByRole("button", { name: /enviar link de redefinição/i }))

    expect(screen.getByRole("button", { name: /enviando/i })).toBeDisabled()
  })
})

describe("ForgotPassword — navegação", () => {
  it("navega para /login ao clicar em 'Voltar para o login'", async () => {
    renderForgotPassword()
    await userEvent.click(screen.getByText(/voltar para o login/i))
    await waitFor(() => expect(screen.getByText("login")).toBeInTheDocument())
  })
})
