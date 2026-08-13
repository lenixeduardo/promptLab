import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowRight, CheckCircle2, BookmarkPlus } from "lucide-react"
import { sileo } from "sileo"
import { AppBottomNav } from "@/components/AppBottomNav"

interface LabResultState {
  score: number
  label: string
  stars: number
  originalPrompt: string
  analysis: string
  feedback: string[]
  aiCompatibility: { name: string; ok: boolean }[]
}

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = stars >= i
        const half = !filled && stars >= i - 0.5
        return (
          <span
            key={i}
            className={
              filled ? "text-accent" : half ? "text-accent opacity-60" : "text-[#D1D5DB]"
            }
            style={{ fontSize: 16 }}
          >
            ★
          </span>
        )
      })}
      <span className="ml-1 text-xs text-foregroundMuted">{stars}/5</span>
    </div>
  )
}

export default function LabResult() {
  const navigate = useNavigate()
  const location = useLocation()
  const result = location.state as LabResultState | null

  useEffect(() => {
    if (!result) {
      sileo.error({
        title: "Nenhum resultado encontrado",
        description: "Analise um prompt no laboratório para ver o resultado aqui.",
      })
      navigate("/lab", { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!result) return null

  const handleSaveResult = () => {
    sileo.info({ title: "Em breve", description: "Salvar resultados do laboratório estará disponível em breve." })
  }

  return (
    <div className="min-h-screen bg-white pb-32 lg:pb-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#C8EDD8] via-[#D5F0E2] to-pageBgLight px-5 pb-6 pt-12">
        <div className="mb-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stroke-muted bg-white shadow-sm transition-all active:scale-95"
            aria-label="Voltar"
          >
            <ArrowRight className="h-4 w-4 rotate-180 text-primary-dark" />
          </button>
        </div>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-extrabold leading-tight text-foregroundDark">
              Resultado do<br />Laboratório
            </h1>
            <p className="mt-1 text-xs text-[#3E6B50]">
              Análise completa do seu prompt pela IA
            </p>
          </div>
          <img
            src="/assets/mascot-login-new.png"
            alt="Mascote"
            className="h-24 w-auto shrink-0 object-contain"
          />
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {/* Pontuação geral */}
        <div className="rounded-2xl border border-stroke-muted bg-white p-5 shadow-sm text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-foregroundMuted">
            Pontuação geral
          </p>
          <div className="relative mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald to-primary-dark shadow-lg">
            <span className="text-4xl font-extrabold text-white">{result.score}</span>
          </div>
          <span className="inline-block rounded-full bg-pageBgLight px-4 py-1 text-sm font-bold text-primary-dark">
            {result.label}
          </span>
          <div className="mt-3 flex justify-center">
            <StarRating stars={result.stars} />
          </div>
        </div>

        {/* Prompt original */}
        <div className="rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-foregroundMuted">
            Seu prompt original:
          </p>
          <div className="rounded-xl bg-[#F5FBF7] p-3">
            <p className="text-xs leading-relaxed text-foregroundDark">{result.originalPrompt}</p>
          </div>
        </div>

        {/* Análise da IA */}
        <div className="rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-foregroundMuted">
            Análise da IA:
          </p>
          <p className="text-xs leading-relaxed text-foregroundDark">{result.analysis}</p>
        </div>

        {/* Feedback da IA */}
        <div className="rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-foregroundMuted">
            Feedback da IA:
          </p>
          <div className="flex flex-col gap-2">
            {result.feedback.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                <span className="text-xs leading-relaxed text-foregroundDark">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compatibilidade */}
        <div className="rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-foregroundMuted">
            Compatibilidade com IAs:
          </p>
          <div className="flex gap-2">
            {result.aiCompatibility.map(({ name, ok }) => (
              <span
                key={name}
                className="flex items-center gap-1 rounded-full border border-stroke-light bg-pageBgLight px-3 py-1 text-xs font-semibold text-primary-dark"
              >
                {ok && <CheckCircle2 className="h-3 w-3 text-emerald" />}
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed bottom action */}
      <div className="fixed bottom-[72px] left-0 right-0 z-30 border-t border-pageBgLight bg-white px-4 py-3">
        <div className="mx-auto max-w-[460px]">
          <button
            onClick={handleSaveResult}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-dark py-3 text-sm font-semibold text-white transition-all active:scale-95 hover:bg-emerald"
          >
            <BookmarkPlus className="h-4 w-4" />
            Salvar Resultado
          </button>
        </div>
      </div>

      <AppBottomNav />
    </div>
  )
}
