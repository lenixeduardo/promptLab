import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { User, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-5 py-8 text-foreground">
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
          <h1 className="text-2xl font-extrabold text-foreground">
            Bem-vindo de volta! <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-1 text-sm text-foregroundTertiary">
            Entre para continuar sua jornada criativa
          </p>
        </div>

        {/* Login form */}
        <form
          className="mt-7 flex w-full flex-col gap-4"
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
            className="border-stroke-light text-foreground placeholder:text-foregroundTertiary focus-visible:border-primary focus-visible:ring-primary/25"
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
              className="border-stroke-light pr-12 text-foreground placeholder:text-foregroundTertiary focus-visible:border-primary focus-visible:ring-primary/25"
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
            className="-mt-1 self-end text-sm font-semibold text-link hover:text-primary"
          >
            Esqueceu sua senha?
          </Link>

          <Button
            type="submit"
            size="lg"
            className="mt-1 w-full rounded-2xl text-black"
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
            variant="ghost"
            size="lg"
            className="w-full justify-center gap-3 rounded-2xl border-2 border-stroke-light bg-transparent normal-case tracking-normal text-foreground hover:bg-surface-soft active:bg-stroke-light"
            onClick={handleGoogleLogin}
            disabled={loading || rateLimitCooldown > 0}
          >
            <GoogleIcon />
            Entrar com Google
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-7 text-center text-base text-foregroundDark">
          Ainda não tem uma conta?{" "}
          <Link to="/signup" className="font-semibold text-link hover:text-primary">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
