import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { X, CheckCircle2, Diamond, Sparkles } from "@/lib/icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CHALLENGES, getChallengeByStep } from "@/data/challengeData"

const MIN_CHARS = 30
const MAX_CHARS = 500

type FeedbackScore = {
  contexto: boolean
  clareza: boolean
  detalhamento: boolean
  publicoAlvo: boolean
}

function scorePrompt(text: string): FeedbackScore {
  const t = text.toLowerCase()
  const len = text.length
  return {
    contexto: len >= 50,
    clareza:
      /\b(escreva|crie|liste|gere|fa[çc]a|elabore|descreva|explique|analise|sugira|produza|redija)\b/.test(
        t
      ),
    detalhamento:
      len >= 120 ||
      /\b(formato|estilo|tom|exemplos?|espec[íi]fico|detalhes?|estrutura|bullet|t[óo]picos?|\d+\s*(palavras?|itens?|passos?|etapas?|dicas?))\b/.test(
        t
      ),
    publicoAlvo:
      len >= 40 &&
      /\b(para|sobre|voltado|destina|direcionado|p[úu]blico|iniciantes?|especialistas?|crian[çc]as?|adultos?|profissionais?|estudantes?|empreendedores?)\b/.test(
        t
      ),
  }
}

function getIntroText(score: FeedbackScore): string {
  const passing = Object.values(score).filter(Boolean).length
  if (passing === 4) return "Excelente! Seu prompt está muito bem estruturado."
  if (passing >= 3) return "Ótimo começo! Vamos aprimorar:"
  return "Aqui está como você pode melhorar:"
}

const CRITERIA: { key: keyof FeedbackScore; label: string }[] = [
  { key: "contexto", label: "Contexto" },
  { key: "clareza", label: "Clareza" },
  { key: "detalhamento", label: "Detalhamento" },
  { key: "publicoAlvo", label: "Público-alvo" },
]

const RESULT_LABELS = [
  "Tente novamente",
  "Continue praticando",
  "Bom início!",
  "Muito bom!",
  "Excelente!",
]
const RESULT_ANALYSES = [
  "Continue praticando! Um bom prompt precisa de contexto claro, objetivo bem definido e especificações de saída.",
  "Você está no caminho certo! Foque em clareza e defina melhor o público-alvo para resultados melhores.",
  "Bom começo! Adicionar mais detalhamento e contexto vai ajudar a IA a gerar resultados muito mais precisos.",
  "Prompt muito bem estruturado! Pequenos ajustes no detalhamento podem elevá-lo ao máximo.",
  "Excelente! Contexto claro, objetivo bem definido e todos os critérios essenciais presentes. Seu prompt está pronto para produção.",
]

function buildLabResultState(promptText: string, score: FeedbackScore) {
  const passing = Object.values(score).filter(Boolean).length
  const scoreNum = Math.round((passing / 4) * 100)
  const stars = parseFloat(((passing / 4) * 5).toFixed(1))
  return {
    score: scoreNum,
    label: RESULT_LABELS[passing],
    stars,
    originalPrompt: promptText,
    analysis: RESULT_ANALYSES[passing],
    feedback: CRITERIA.map(
      ({ key, label }) => `${label}: ${score[key] ? "bem definido ✓" : "pode melhorar"}`
    ),
    aiCompatibility: [
      { name: "GPT-4", ok: true },
      { name: "Claude", ok: true },
      { name: "Gemini", ok: true },
    ],
  }
}

export default function PromptChallenge() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const stepParam = parseInt(searchParams.get("step") ?? "0", 10)
  const challenge = getChallengeByStep(isNaN(stepParam) ? 0 : stepParam)

  const [promptText, setPromptText] = useState("")
  const [showExample, setShowExample] = useState(false)

  const score = scorePrompt(promptText)
  const showFeedback = promptText.length >= MIN_CHARS
  const progressPct = ((challenge.step + 1) / challenge.totalSteps) * 100

  function handleNext() {
    const nextStep = challenge.step + 1
    if (nextStep < CHALLENGES.length) {
      navigate(`/challenge?step=${nextStep}`)
    } else {
      navigate("/lab-result", { state: buildLabResultState(promptText, score) })
    }
  }

  function handleShowExample() {
    setShowExample(true)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="mx-auto flex w-full max-w-[420px] flex-col px-5 pb-10 pt-6">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stroke-muted bg-white shadow-sm transition-all hover:bg-surface-soft"
            aria-label="Fechar"
          >
            <X className="h-5 w-5 text-primary-dark" />
          </button>
          <p className="text-base font-bold text-primary-dark">{challenge.module}</p>
          <span className="text-sm font-semibold text-foregroundPlaceholder">
            {challenge.step + 1}/{challenge.totalSteps}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-stroke-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald to-emerald-dark transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Challenge title */}
        <h1 className="mb-1 text-xl font-extrabold text-foregroundDark">{challenge.title}</h1>
        <p className="mb-5 text-sm text-foregroundTertiary">{challenge.subtitle}</p>

        {/* Task card */}
        <div className="mb-5 rounded-2xl border border-stroke-light bg-pageBgLight px-4 py-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-emerald">Sua tarefa</p>
          <p className="text-sm leading-relaxed text-foregroundDark">{challenge.task}</p>
        </div>

        {/* Prompt textarea */}
        <label htmlFor="prompt-input" className="mb-2 text-base font-bold text-foregroundDark">
          Seu prompt
        </label>
        <div className="relative mb-4">
          <textarea
            id="prompt-input"
            value={promptText}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) setPromptText(e.target.value)
            }}
            placeholder="Digite aqui seu prompt..."
            rows={6}
            aria-label="Campo de entrada para seu prompt"
            aria-describedby="prompt-description char-count"
            className="w-full resize-none rounded-2xl border border-stroke-muted bg-white px-4 py-3 pb-7 text-sm leading-relaxed text-foregroundDark placeholder:text-[#B0C0B5] focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20"
          />
          <span
            id="char-count"
            className="absolute bottom-3 right-4 text-xs text-foregroundPlaceholder"
            aria-live="polite"
          >
            {promptText.length}/{MAX_CHARS} caracteres
          </span>
          <span id="prompt-description" className="sr-only">
            Digite seu prompt com contexto claro, objetivo bem definido e especificações de saída.
            Mínimo {MIN_CHARS} caracteres, máximo {MAX_CHARS} caracteres.
          </span>
        </div>

        {/* AI Feedback panel */}
        {showFeedback ? (
          <div className="mb-5 rounded-2xl border border-stroke-light bg-pageBgLight p-4">
            <div className="mb-3 flex items-start gap-3">
              <img
                src="/assets/mascot-teacher.png"
                alt="Mascote"
                className="h-16 w-auto shrink-0 object-contain"
              />
              <div className="flex-1">
                <p className="font-bold text-foregroundDark">Feedback da IA</p>
                <p className="mt-0.5 text-xs text-foregroundMuted">{getIntroText(score)}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              {CRITERIA.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  {score[key] ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald" />
                  ) : (
                    <Diamond className="h-4 w-4 shrink-0 text-accent" />
                  )}
                  <span className="text-sm text-foregroundDark">
                    {label}:{" "}
                    <span
                      className={cn("font-medium", score[key] ? "text-emerald" : "text-accent")}
                    >
                      {score[key] ? "bom" : "pode melhorar"}
                    </span>
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-foregroundMuted">{challenge.tip}</p>
          </div>
        ) : (
          <div className="mb-5 rounded-2xl border border-stroke-muted bg-white px-4 py-3 text-center">
            <p className="text-xs text-foregroundPlaceholder">
              Digite pelo menos {MIN_CHARS} caracteres para receber feedback ao vivo.
            </p>
          </div>
        )}

        {/* Example panel (revealed on CTA click) */}
        {showExample && (
          <div className="mb-5 rounded-2xl border border-stroke-light bg-white p-4">
            <p className="mb-2 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald">
              <Sparkles className="h-3.5 w-3.5" /> Exemplo aprimorado
            </p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foregroundDark">
              {challenge.examplePrompt}
            </p>
          </div>
        )}

        {/* CTA button */}
        <Button
          size="lg"
          className="w-full"
          onClick={showExample ? handleNext : handleShowExample}
          disabled={!showExample && promptText.length < MIN_CHARS}
        >
          {showExample ? (
            challenge.step + 1 < CHALLENGES.length ? (
              "Próximo desafio →"
            ) : (
              "Ver resultado →"
            )
          ) : (
            <span className="flex items-center gap-1.5 justify-center">
              Ver exemplo aprimorado <Sparkles className="h-4 w-4" />
            </span>
          )}
        </Button>

        {/* Skip link */}
        <button
          onClick={handleNext}
          className="mt-3 w-full text-center text-sm text-foregroundMuted transition-colors hover:text-primary-dark"
        >
          Pular por agora
        </button>
      </div>
    </div>
  )
}
