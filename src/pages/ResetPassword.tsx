import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Lock, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { sileo } from "sileo"
import { z } from "zod"

export default function ResetPassword() {
  const navigate = useNavigate()
  const { updatePassword } = useAuth()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
    const result = await updatePassword(password)
    if (result.success) {
      sileo.success({ title: "Senha atualizada com sucesso!" })
      navigate("/login")
    } else {
      sileo.error({ title: result.error || "Erro ao atualizar senha" })
    }
    setLoading(false)
  }

  // Classe "dark" fixa: tela do fluxo de login usa sempre a paleta escura
  return (
    <div className="dark relative min-h-screen overflow-hidden bg-gradient-to-b from-pageBgLight via-gradient-mid to-gradient-end px-5 py-8 text-foreground">
      <div className="mx-auto flex w-full max-w-[420px] flex-col">
        {/* Back */}
        <Link to="/login" className="mb-2 flex w-fit items-center text-link hover:text-primary">
          <ArrowLeft className="h-6 w-6" strokeWidth={2.2} />
        </Link>

        {/* Title */}
        <h1 className="mb-5 text-center text-4xl font-extrabold text-primary-dark">Nova Senha</h1>

        {/* Mascot + speech bubble */}
        <div className="mb-5 flex items-center justify-center gap-2">
          <img
            src="/assets/mascot-login-new.png"
            alt="Mascot"
            className="h-36 w-auto object-contain drop-shadow-md"
          />
          <div className="relative rounded-2xl border border-stroke-light bg-white px-3 py-2 text-sm font-medium leading-snug text-foregroundDark shadow-sm">
            Escolha uma senha bem forte, ok? <Lock className="inline h-3.5 w-3.5 text-emerald" />
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

        {/* Card */}
        <Card className="w-full border-stroke-muted bg-surface-success p-6 shadow-md sm:p-7">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            role="form"
            aria-label="Formulário de redefinição de senha"
          >
            <Input
              type="password"
              placeholder="Nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-5 w-5" strokeWidth={2.2} />}
              autoComplete="new-password"
              required
              disabled={loading}
              aria-label="Nova senha"
              aria-required="true"
              aria-describedby="password-requirements"
            />
            <Input
              type="password"
              placeholder="Confirmar nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock className="h-5 w-5" strokeWidth={2.2} />}
              autoComplete="new-password"
              required
              disabled={loading}
              aria-label="Confirmar nova senha"
              aria-required="true"
              aria-describedby="password-requirements"
            />

            <p id="password-requirements" className="text-center text-xs text-foregroundSecondary">
              A senha deve ter pelo menos 8 caracteres, uma letra maiúscula e um número.
            </p>

            <Button type="submit" size="lg" className="mt-1 w-full gap-2" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Salvando..." : "Redefinir Senha"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
