import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import Signup from "./Signup"
import { sileo } from "sileo"

const mockSignup = vi.fn()
const mockLoginWithGoogle = vi.fn()

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    signup: mockSignup,
    loginWithGoogle: mockLoginWithGoogle,
    user: null,
  }),
}))

vi.mock("sileo", () => ({
  sileo: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => null,
}))

function renderSignup() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/signup"]}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<div>login</div>} />
          <Route path="/home" element={<div>home</div>} />
          <Route path="/onboarding" element={<div>onboarding</div>} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  )
}

async function fillForm(email = "novo@test.com", password = "Senha123", confirm = "Senha123") {
  await userEvent.type(screen.getByPlaceholderText("Nome completo"), "Novo User")
  await userEvent.type(screen.getByPlaceholderText("E-mail"), email)
  await userEvent.type(screen.getByPlaceholderText("Senha"), password)
  await userEvent.type(screen.getByPlaceholderText("Confirmar senha"), confirm)
}

beforeEach(() => vi.clearAllMocks())

describe("Signup — renderização", () => {
  it("exibe todos os campos do formulário", () => {
    renderSignup()
    expect(screen.getByPlaceholderText("Nome completo")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("E-mail")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Senha")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Confirmar senha")).toBeInTheDocument()
  })

  it("exibe o botão 'Criar Conta'", () => {
    renderSignup()
    expect(screen.getByRole("button", { name: /criar conta/i })).toBeInTheDocument()
  })

  it("exibe link 'Faça login'", () => {
    renderSignup()
    expect(screen.getByText(/faça login/i)).toBeInTheDocument()
  })
})

describe("Signup — validações", () => {
  it("exibe erro quando as senhas não coincidem", async () => {
    renderSignup()
    await fillForm("email@test.com", "Senha123", "diferente")
    await userEvent.click(screen.getByRole("button", { name: /criar conta/i }))

    await waitFor(() =>
      expect(sileo.error).toHaveBeenCalledWith({ title: "As senhas não coincidem" })
    )
    expect(mockSignup).not.toHaveBeenCalled()
  })

  it("exibe erro quando senha tem menos de 8 caracteres", async () => {
    renderSignup()
    await fillForm("email@test.com", "Abc1", "Abc1")
    await userEvent.click(screen.getByRole("button", { name: /criar conta/i }))

    await waitFor(() =>
      expect(sileo.error).toHaveBeenCalledWith({
        title: "A senha deve ter pelo menos 8 caracteres",
      })
    )
    expect(mockSignup).not.toHaveBeenCalled()
  })
})

describe("Signup — submissão", () => {
  it("navega para /onboarding quando signup é bem-sucedido", async () => {
    mockSignup.mockResolvedValue({ success: true })

    renderSignup()
    await fillForm()
    await userEvent.click(screen.getByRole("button", { name: /criar conta/i }))

    await waitFor(() => expect(screen.getByText("onboarding")).toBeInTheDocument())
    expect(mockSignup).toHaveBeenCalledWith("novo@test.com", "Senha123", "Novo User")
  })

  it("exibe mensagem de erro quando signup falha", async () => {
    mockSignup.mockResolvedValue({ success: false, error: "Email já cadastrado" })

    renderSignup()
    await fillForm()
    await userEvent.click(screen.getByRole("button", { name: /criar conta/i }))

    await waitFor(() => expect(sileo.error).toHaveBeenCalledWith({ title: "Email já cadastrado" }))
  })

  it("exibe 'Criando...' enquanto request está em andamento", async () => {
    mockSignup.mockImplementation(() => new Promise(() => {}))

    renderSignup()
    await fillForm()
    await userEvent.click(screen.getByRole("button", { name: /criar conta/i }))

    expect(screen.getByRole("button", { name: /criando/i })).toBeDisabled()
  })
})
