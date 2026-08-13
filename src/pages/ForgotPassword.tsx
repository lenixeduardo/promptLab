import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { sileo } from "sileo"
import { PageSEO } from "@/components/PageSEO"

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await resetPassword(email)
    if (result.success) {
      sileo.success({ title: "E-mail de redefinição enviado com sucesso!" })
      setSent(true)
    } else {
      sileo.error({ title: result.error || "Erro ao enviar e-mail" })
    }
    setLoading(false)
  }

  // Classe "dark" fixa: tela do fluxo de login usa sempre a paleta escura
  return (
    <div className="dark relative min-h-screen overflow-hidden bg-gradient-to-b from-pageBgLight via-gradient-mid to-gradient-end px-5 py-8 text-foreground">
      <PageSEO
        title="Recuperar Senha"
        description="Recupere o acesso à sua conta PromptLabz."
        canonicalPath="/forgot-password"
        noIndex={true}
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
        <div className="mb-5 text-center">
          <h1 className="text-3xl font-extrabold text-primary-dark">
            Recupere seu acesso
          </h1>
          <p className="mt-1 text-sm text-foregroundSecondary">
            Enviaremos um link para você criar uma nova senha.
          </p>
        </div>

        {/* Mascot */}
        <div className="mb-5 flex items-center justify-center">
          <img
            src="/assets/mascot-login-new.png"
            alt=""
            className="h-28 w-auto object-contain drop-shadow-md"
          />
        </div>

        {/* Card */}
        <Card className="w-full border-stroke-muted bg-surface-success p-6 shadow-md sm:p-7">
          {sent ? (
            <div
              className="flex flex-col items-center gap-3 py-2 text-center"
              role="status"
              aria-live="polite"
            >
              <Mail className="h-10 w-10 text-link" strokeWidth={1.8} />
              <p className="text-base font-semibold text-primary-dark">Verifique seu e-mail</p>
              <p className="text-sm text-foregroundSecondary">
                Se existir uma conta com esse e-mail, você receberá as instruções em alguns minutos.
              </p>
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit} role="form" aria-label="Formulário de recuperação de senha">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="forgot-email" className="text-sm font-semibold text-foregroundDark">
                  E-mail
                </label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="h-5 w-5" strokeWidth={2.2} />}
                  autoComplete="email"
                  required
                  disabled={loading}
                  aria-required="true"
                  aria-describedby="email-help-forgot"
                />
              </div>
              <p id="email-help-forgot" className="text-sm text-foregroundSecondary">
                Enviaremos um link de redefinição de senha para o seu e-mail.
              </p>
              <Button type="submit" size="lg" className="mt-1 w-full gap-2" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Enviando..." : "Enviar link"}
              </Button>
            </form>
          )}
        </Card>

        <Link
          to="/login"
          className="mt-7 text-center text-sm font-medium text-link underline underline-offset-2 hover:text-primary"
        >
          Voltar para o login
        </Link>
      </div>
    </div>
  )
}
