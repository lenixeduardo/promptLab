import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Sparkles, Target, Trophy, ArrowRight, Check } from "lucide-react"

export const ONBOARDED_KEY = "promptlabz:onboarded"

const STEPS = [
  {
    icon: Sparkles,
    title: "Bem-vindo ao PromptLabz",
    desc: "Seu laboratório de ideias com IA. Aprenda prompts brincando, ganhe gemas e suba de nível.",
    cta: "Vamos lá",
  },
  {
    icon: Target,
    title: "Qual seu objetivo?",
    desc: "Vamos personalizar sua trilha de acordo com o que você quer dominar primeiro.",
    cta: "Definir meta",
    options: [
      "Aprender o básico de prompts",
      "Criar conteúdo com IA",
      "Automatizar tarefas no trabalho",
      "Competir e ganhar prêmios",
    ] as const,
  },
  {
    icon: Trophy,
    title: "Prepare-se para evoluir",
    desc: "Complete missões diárias, mantenha sua sequência e desbloqueie cosméticos para seu mascote.",
    cta: "Começar",
  },
] as const

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const navigate = useNavigate()
  const current = STEPS[step]

  // Guard: redirect already-onboarded users back to /home
  useEffect(() => {
    if (localStorage.getItem(ONBOARDED_KEY) === "true") {
      navigate("/home", { replace: true })
    }
  }, [navigate])
  const Icon = current.icon
  const isLast = step === STEPS.length - 1
  const needsPick = "options" in current

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full transition-colors ${
                i <= step ? "bg-emerald" : "bg-stroke-light"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => {
            localStorage.setItem(ONBOARDED_KEY, "true")
            navigate("/home")
          }}
          className="text-xs font-semibold text-foreground-tertiary hover:text-forest"
        >
          Pular
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald to-emerald-dark text-white shadow-lg shadow-emerald/30">
          <Icon className="h-12 w-12" strokeWidth={2} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-primary-dark">{current.title}</h1>
          <p className="text-sm text-foreground-tertiary">{current.desc}</p>
        </div>

        {needsPick && (
          <div className="w-full space-y-2">
            {(current as (typeof STEPS)[1]).options.map((opt, i) => (
              <button
                key={opt}
                onClick={() => setPicked(i)}
                className={`flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition-colors ${
                  picked === i
                    ? "border-emerald bg-surface-success text-foreground-dark"
                    : "border-stroke-light bg-card text-foreground-secondary hover:border-emerald/40"
                }`}
              >
                {opt}
                {picked === i && <Check className="h-4 w-4 text-emerald" strokeWidth={3} />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 pb-8">
        <button
          disabled={needsPick && picked === null}
          onClick={() => {
            if (needsPick && picked !== null) {
              const goal = (current as (typeof STEPS)[1]).options[picked]
              localStorage.setItem("promptlabz:learningGoal", goal)
            }
            if (isLast) {
              localStorage.setItem(ONBOARDED_KEY, "true")
              navigate("/home")
            } else {
              setStep((s) => s + 1)
            }
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald py-4 text-sm font-extrabold text-white shadow-md shadow-emerald/30 transition-colors hover:bg-emerald-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {current.cta} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
