import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { User, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { CircleRevealEntry } from "@/components/CircleTransition"
import { useAuth } from "@/hooks/useAuth"
import { sileo } from "sileo"
import { trackLogin } from "@/lib/analytics"
import { PageSEO } from "@/components/PageSEO"
import { errorLogger } from "@/lib/errorLogging"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
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

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M16.365 1.43c0 1.14-.42 2.06-1.26 2.94-.9.98-2.01 1.56-3.21 1.46-.06-1.14.42-2.28 1.2-3.06C13.98.86 15.42.2 16.38 0c.06.48 0 .96-.015 1.43ZM20.3 17.09c-.42 1-.93 1.94-1.62 2.82-.93 1.2-1.86 2.4-3.33 2.42-1.44.03-1.92-.87-3.6-.87-1.68 0-2.2.84-3.57.9-1.44.06-2.52-1.29-3.48-2.49C2.84 17.47 1.4 13.12 3.32 10.15c.93-1.47 2.61-2.4 4.41-2.43 1.41-.03 2.73.96 3.6.96.87 0 2.46-1.17 4.14-.99.7.03 2.68.28 3.96 2.13-.1.06-2.36 1.38-2.34 4.12.03 3.27 2.85 4.36 2.91 4.15Z" />
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const { login, loginWithGoogle, user } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rateLimitCooldown, setRateLimitCooldown] = useState(0)

  useEffect(() => {
    if (user) {
      navigate("/home")
    }
  }, [user, navigate])

  useEffect(() => {
    if (rateLimitCooldown > 0) {
      const timer = setTimeout(() => setRateLimitCooldown(c => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [rateLimitCooldown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rateLimitCooldown > 0) {
      errorLogger.logRateLimit("/auth/login", rateLimitCooldown)
      sileo.error({
        title: `Aguarde ${rateLimitCooldown}s`,
        description: "Você tentou fazer login muitas vezes. Por favor, tente novamente em alguns segundos."
      })
      return
    }

    setLoading(true)
    setRateLimitCooldown(3)

    const result = await login(email, password)
    if (result.success) {
      errorLogger.logAuthEvent("login", user?.id || "unknown", true)
      trackLogin("email")
      sileo.success({ title: "Login realizado com sucesso!" })
      navigate("/home")
    } else {
      errorLogger.logAuthEvent("login", email, false)
      sileo.error({ title: result.error || "Erro ao fazer login" })
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    if (rateLimitCooldown > 0) {
      errorLogger.logRateLimit("/auth/google", rateLimitCooldown)
      sileo.error({
        title: `Aguarde ${rateLimitCooldown}s`,
        description: "Você tentou fazer login muitas vezes. Por favor, tente novamente em alguns segundos."
      })
      return
    }

    setLoading(true)
    setRateLimitCooldown(3)

    const result = await loginWithGoogle()
    if (result.success) {
      errorLogger.logAuthEvent("login", user?.id || "unknown", true)
      trackLogin("google")
      sileo.success({ title: "Login com Google realizado!" })
      navigate("/home")
    } else {
      errorLogger.logAuthEvent("login", "google-user", false)
      sileo.error({ title: result.error || "Erro ao fazer login com Google" })
    }
    setLoading(false)
  }

  // Classe "dark" fixa: tela do fluxo de login usa sempre a paleta escura,
  // igual a Signup/ForgotPassword/ResetPassword — evita texto claro sobre fundo branco
  return (
    <div className="dark relative min-h-screen overflow-hidden bg-gradient-to-b from-pageBgLight via-gradient-mid to-gradient-end px-5 py-8 text-foreground">
      <PageSEO
        title="Entrar no PromptLabz — Aprenda IA com Gamificacao"
        description="Acesse sua conta PromptLabz e retome seu progresso. Trilha gamificada de engenharia de prompts com sistema de vidas, XP e conquistas. Continue agora."
        canonicalPath="/login"
      />
      {/* Shrinking circle reveal — plays when arriving from Hero */}
      <CircleRevealEntry />
      <div className="mx-auto flex w-full max-w-[420px] flex-col items-center">
        {/* Mascot + wordmark lockup (brand asset) */}
        <img
          src="/assets/mascot-login-hero.png"
          alt="PromptLabz — Aprenda. Crie. Evolua."
          className="w-full max-w-[300px] object-contain"
        />

        {/* Welcome heading */}
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-extrabold text-primary-dark">
            Bem-vindo de volta! <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-1 text-sm text-foregroundSecondary">
            Entre para continuar sua jornada criativa
          </p>
        </div>

        {/* Login form */}
        <Card className="mt-7 w-full border-stroke-muted bg-surface-success p-6 shadow-md sm:p-7">
          <form
            className="flex w-full flex-col gap-4"
            onSubmit={handleSubmit}
            role="form"
            aria-label="Formulário de login"
          >
            <Input
              type="text"
              placeholder="E-mail ou nome de usuário"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<User className="h-5 w-5" strokeWidth={2.2} />}
              autoComplete="username"
              required
              disabled={loading}
              aria-label="E-mail ou nome de usuário"
              aria-required="true"
              aria-describedby="email-help-login"
            />
            <small id="email-help-login" className="sr-only">
              Insira o e-mail ou nome de usuário da sua conta
            </small>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="h-5 w-5" strokeWidth={2.2} />}
                autoComplete="current-password"
                required
                disabled={loading}
                aria-label="Senha"
                aria-required="true"
                aria-describedby="password-help-login"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-primary"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <small id="password-help-login" className="sr-only">
              Insira sua senha de acesso segura
            </small>

            <Link
              to="/forgot-password"
              className="-mt-1 self-end text-sm font-semibold text-link underline underline-offset-2 hover:text-primary"
            >
              Esqueceu sua senha?
            </Link>

            <Button
              type="submit"
              size="lg"
              className="mt-1 w-full gap-2"
              disabled={loading || rateLimitCooldown > 0}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Entrando..." : rateLimitCooldown > 0 ? `Tente em ${rateLimitCooldown}s` : "Entrar"}
            </Button>

            {/* Divider */}
            <div className="my-1 flex items-center gap-3">
              <span className="h-px flex-1 bg-stroke-light" />
              <span className="text-sm text-foregroundTertiary">ou</span>
              <span className="h-px flex-1 bg-stroke-light" />
            </div>

            {/* Social logins */}
            <Button
              type="button"
              variant="social"
              size="lg"
              className="w-full justify-center gap-3 normal-case tracking-normal"
              onClick={handleGoogleLogin}
              disabled={loading || rateLimitCooldown > 0}
            >
              <GoogleIcon />
              Entrar com Google
            </Button>
            <Button
              type="button"
              variant="social"
              size="lg"
              className="w-full justify-center gap-3 normal-case tracking-normal"
              onClick={() => sileo.info({ title: "Login com Apple em breve" })}
              aria-label="Entrar com Apple"
            >
              <AppleIcon />
              Entrar com Apple
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <p className="mt-7 text-center text-base text-foregroundDark">
          Ainda não tem uma conta?{" "}
          <Link to="/signup" className="font-semibold text-link underline underline-offset-2 hover:text-primary">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
