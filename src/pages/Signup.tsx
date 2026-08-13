import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, User, Mail, Lock, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { sileo } from "sileo"
import { z } from "zod"
import { trackSignUp } from "@/lib/analytics"
import { PageSEO } from "@/components/PageSEO"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  )
}

export default function Signup() {
  const navigate = useNavigate()
  const { signup, loginWithGoogle, user } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [pendingEmail, setPendingEmail] = useState("")

  useEffect(() => {
    if (user) {
      navigate("/home")
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Email validation
    const emailParsed = z.string().email("Formato de e-mail inválido").safeParse(email)
    if (!emailParsed.success) {
      sileo.error({ title: emailParsed.error.errors[0].message })
      return
    }

    if (password !== confirmPassword) {
      sileo.error({ title: "As senhas não coincidem" })
      return
    }

    // Password strength validation (8+ chars, uppercase, number)
    const passwordParsed = z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número")
      .safeParse(password)

    if (!passwordParsed.success) {
      sileo.error({ title: passwordParsed.error.errors[0].message })
      return
    }

    setLoading(true)
    const result = await signup(email, password, name.trim())
    if (result.success) {
      trackSignUp("email")
      localStorage.setItem("promptlabz:hasAccount", "true")
      if (result.needsConfirmation) {
        setPendingEmail(email)
      } else {
        sileo.success({ title: "Conta criada com sucesso!" })
        navigate("/onboarding")
      }
    } else {
      sileo.error({ title: result.error || "Erro ao criar conta" })
    }
    setLoading(false)
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    localStorage.setItem("promptlabz:hasAccount", "true")
    const result = await loginWithGoogle()
    if (result.success) {
      trackSignUp("google")
      sileo.success({ title: "Conta criada com o Google!" })
      navigate("/home")
    } else {
      localStorage.removeItem("promptlabz:hasAccount")
      sileo.error({ title: result.error || "Erro ao criar conta com Google" })
    }
    setLoading(false)
  }

  if (pendingEmail) {
    return (
      <div className="dark flex min-h-screen flex-col items-center justify-center gap-5 bg-gradient-to-b from-pageBgLight via-gradient-mid to-gradient-end px-6 text-center text-foreground">
        <img
          src="/assets/mascot-login-new.png"
          alt="Mascot"
          className="h-36 w-auto drop-shadow-md"
        />
        <h2 className="text-2xl font-bold text-primary-dark">Verifique seu e-mail</h2>
        <p className="max-w-sm text-base text-foregroundSecondary">
          Enviamos um link de confirmação para{" "}
          <strong className="text-foregroundDark">{pendingEmail}</strong>.
          Acesse seu e-mail e clique no link para ativar sua conta.
        </p>
        <Link
          to="/login"
          className="font-semibold text-link underline underline-offset-2 hover:text-primary"
        >
          Voltar ao login
        </Link>
      </div>
    )
  }

  // Classe "dark" fixa: esta tela usa sempre a paleta escura (fundo preto),
  // independente do tema do app — evita texto claro sobre fundo branco
  return (
    <div className="dark relative min-h-screen overflow-hidden bg-gradient-to-b from-pageBgLight via-gradient-mid to-gradient-end px-5 py-8 text-foreground">
      <PageSEO
        title="Comece Gratis — Aprenda Prompts de IA"
        description="Crie sua conta gratuita em 30 segundos. Aprenda engenharia de prompts com gamificacao, XP e conquistas. Do zero ao avancado. Sem cartao de credito!"
        canonicalPath="/signup"
      />
      <div className="mx-auto flex w-full max-w-[420px] flex-col">
        {/* Back */}
        <Link
          to="/login"
          className="mb-2 flex w-fit items-center text-link hover:text-primary"
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={2.2} />
        </Link>

        {/* Title */}
        <h1 className="mb-5 text-center text-4xl font-extrabold text-primary-dark">
          Criar Conta
        </h1>

        {/* Mascot + speech bubble */}
        <div className="mb-5 flex items-center justify-center gap-2">
          <img
            src="/assets/mascot-login-new.png"
            alt="Mascot"
            className="h-36 w-auto object-contain drop-shadow-md"
          />
          <div className="relative rounded-2xl border border-stroke-light bg-white px-3 py-2 text-sm font-medium leading-snug text-foregroundDark shadow-sm">
            Vamos começar!
            {/* bubble tail pointing left */}
            <div
              style={{
                position: "absolute",
                left: -8,
                top: 12,
                width: 0,
                height: 0,
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderRight: "8px solid #BFE3CC",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: -6,
                top: 12,
                width: 0,
                height: 0,
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderRight: "8px solid white",
              }}
            />
          </div>
        </div>

        {/* Form card */}
        <Card className="w-full border-stroke-muted bg-surface-success p-6 shadow-md sm:p-7">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} role="form" aria-label="Formulário de cadastro">
            <label htmlFor="signup-name" className="sr-only">
              Nome completo
            </label>
            <Input
              id="signup-name"
              type="text"
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="h-5 w-5" strokeWidth={2.2} />}
              autoComplete="name"
              disabled={loading}
              aria-required="false"
            />
            <label htmlFor="signup-email" className="sr-only">
              Endereço de e-mail
            </label>
            <Input
              id="signup-email"
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-5 w-5" strokeWidth={2.2} />}
              autoComplete="email"
              required
              disabled={loading}
              aria-required="true"
              aria-describedby="email-help"
            />
            <small id="email-help" className="sr-only">
              Você usará este e-mail para fazer login
            </small>
            <label htmlFor="signup-password" className="sr-only">
              Senha
            </label>
            <Input
              id="signup-password"
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-5 w-5" strokeWidth={2.2} />}
              autoComplete="new-password"
              required
              disabled={loading}
              aria-required="true"
              aria-describedby="password-help"
            />
            <small id="password-help" className="sr-only">
              Mínimo 8 caracteres, pelo menos uma letra maiúscula e um número
            </small>
            <label htmlFor="signup-confirm-password" className="sr-only">
              Confirmar senha
            </label>
            <Input
              id="signup-confirm-password"
              type="password"
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<CheckCircle2 className="h-5 w-5" strokeWidth={2.2} />}
              autoComplete="new-password"
              required
              disabled={loading}
              aria-required="true"
              aria-describedby="confirm-help"
            />
            <small id="confirm-help" className="sr-only">
              Deve ser idêntica à senha inserida acima
            </small>

            <p className="text-center text-xs text-foregroundSecondary">
              Ao criar a conta, você concorda com os{" "}
              <Link
                to="/terms"
                className="font-medium text-link underline underline-offset-2"
              >
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link
                to="/privacy"
                className="font-medium text-link underline underline-offset-2"
              >
                Política de Privacidade
              </Link>
            </p>

            <Button type="submit" size="lg" className="mt-1 w-full gap-2" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Criando..." : "Criar Conta"}
            </Button>

            {/* Divider */}
            <div className="my-1 flex items-center gap-3">
              <span className="h-px flex-1 bg-stroke-light" />
              <span className="text-sm text-foregroundTertiary">ou continue com</span>
              <span className="h-px flex-1 bg-stroke-light" />
            </div>

            {/* Social logins */}
            <div className="flex justify-center gap-5">
              <Button
                type="button"
                variant="social"
                size="icon"
                aria-label="Google"
                onClick={handleGoogleSignup}
                disabled={loading}
              >
                <GoogleIcon />
              </Button>
              <Button type="button" variant="social" size="icon" aria-label="E-mail" disabled>
                <Mail className="h-6 w-6 text-primary" strokeWidth={2.2} />
              </Button>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <p className="mt-7 text-center text-base text-foregroundDark">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="font-semibold text-link underline underline-offset-2 hover:text-primary"
          >
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}
