import { useMemo, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  Check,
  Clock,
  GraduationCap,
  RotateCcw,
  Trophy,
  X,
  XCircle,
  Star,
  PartyPopper,
} from "lucide-react"
import { AppBottomNav } from "@/components/AppBottomNav"
import { cn } from "@/lib/utils"
import { CelebrationCanvas } from "@/components/CelebrationCanvas"

const PASS_THRESHOLD = 0.6

type Question = {
  prompt: string
  options: string[]
  answer: number
  explanation: string
}

const QUESTIONS: Question[] = [
  {
    prompt: "Qual elemento NÃO é essencial em um prompt bem estruturado?",
    options: ["Contexto", "Persona", "Emoji", "Objetivo claro"],
    answer: 2,
    explanation: "Emojis decoram, mas contexto, persona e objetivo guiam o resultado.",
  },
  {
    prompt: "Pedir 'aja como um especialista em X' é um exemplo de…",
    options: ["Few-shot", "Persona", "Cadeia de pensamento", "Refino"],
    answer: 1,
    explanation: "Atribuir um papel orienta tom e profundidade da resposta.",
  },
  {
    prompt: "Quando o few-shot funciona melhor?",
    options: [
      "Em prompts muito curtos",
      "Quando o formato de saída precisa ser preciso",
      "Sempre, em todo prompt",
      "Somente em modelos pequenos",
    ],
    answer: 1,
    explanation: "Exemplos few-shot ajudam a fixar o formato de saída esperado.",
  },
  {
    prompt: "Qual é a melhor forma de pedir uma lista numerada?",
    options: [
      "Pedir 'me dê uma lista'",
      "Pedir 'em formato de lista numerada de 1 a 5'",
      "Não especificar o formato",
      "Usar caixa alta",
    ],
    answer: 1,
    explanation: "Quanto mais explícito o formato, mais previsível a resposta.",
  },
  {
    prompt: "Cadeia de pensamento (chain-of-thought) serve para…",
    options: [
      "Reduzir o tamanho da resposta",
      "Pedir que a IA mostre o raciocínio passo a passo",
      "Aumentar a criatividade aleatória",
      "Esconder a resposta final",
    ],
    answer: 1,
    explanation: "Ela melhora respostas em problemas que exigem várias etapas.",
  },
  {
    prompt: "Refino iterativo significa…",
    options: [
      "Mandar o mesmo prompt várias vezes",
      "Ajustar o prompt baseado na resposta anterior",
      "Trocar de modelo a cada tentativa",
      "Encurtar o prompt o máximo possível",
    ],
    answer: 1,
    explanation: "Você itera, aprende com a saída e refina o pedido.",
  },
  {
    prompt: "O que ajuda a evitar respostas vagas?",
    options: [
      "Pedir 'algo legal'",
      "Definir público, formato e restrições",
      "Não dar contexto",
      "Usar muitas perguntas ao mesmo tempo",
    ],
    answer: 1,
    explanation: "Especificidade reduz ambiguidade e melhora a saída.",
  },
  {
    prompt: "Restrições explícitas (ex.: 'no máximo 100 palavras') servem para…",
    options: [
      "Confundir o modelo",
      "Controlar tamanho e estilo da resposta",
      "Reduzir custo de tokens automaticamente",
      "Bloquear o modelo",
    ],
    answer: 1,
    explanation: "Restrições guiam tamanho, estilo e foco da resposta.",
  },
  {
    prompt: "Qual abordagem geralmente dá MELHORES resultados?",
    options: [
      "Prompt curto e genérico",
      "Persona + contexto + objetivo + formato",
      "Apenas a pergunta final",
      "Lista de palavras-chave soltas",
    ],
    answer: 1,
    explanation: "A combinação cria um briefing completo para a IA.",
  },
  {
    prompt: "Para conferir se a IA entendeu, é boa prática…",
    options: [
      "Aceitar a primeira resposta sempre",
      "Pedir que a IA resuma sua interpretação antes de responder",
      "Usar prompts cada vez mais curtos",
      "Mudar de modelo no meio da conversa",
    ],
    answer: 1,
    explanation: "Pedir o entendimento antes da resposta evita retrabalho.",
  },
]

export default function ModuleExamPage() {
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const total = QUESTIONS.length
  const minToPass = useMemo(() => Math.ceil(total * PASS_THRESHOLD), [total])
  const q = QUESTIONS[step]
  const finished = step >= total
  const isLast = step === total - 1
  const pct = Math.round(((step + (picked !== null ? 1 : 0)) / total) * 100)

  const passed = score >= minToPass
  const perfect = finished && score === total

  useEffect(() => {
    if (perfect) {
      const t = setTimeout(() => setShowConfetti(true), 300)
      const off = setTimeout(() => setShowConfetti(false), 5000)
      return () => {
        clearTimeout(t)
        clearTimeout(off)
      }
    }
  }, [perfect])

  function pick(i: number) {
    if (picked !== null) return
    setPicked(i)
    if (i === q.answer) setScore((s) => s + 1)
  }

  function next() {
    setPicked(null)
    setStep((s) => s + 1)
  }

  function restart() {
    setStep(0)
    setPicked(null)
    setScore(0)
  }

  return (
    <>
      <CelebrationCanvas active={showConfetti} duration={4000} />
      <div className="flex min-h-screen flex-col bg-white pb-24 lg:pb-8">
        <div className="sticky top-0 z-10 border-b border-stroke-muted bg-card px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-luxury" strokeWidth={2.4} />
              <div>
                <h1 className="text-base font-bold text-primary-dark">Prova final</h1>
                <p className="text-[11px] text-foreground-tertiary">
                  {finished
                    ? "Resultado"
                    : `Questão ${step + 1} de ${total} · mínimo ${minToPass} acertos (60%)`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-luxury/15 px-3 py-1 text-xs font-bold text-luxury">
              <Clock className="h-3.5 w-3.5" /> 10 min
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-soft">
            <div
              className="h-full rounded-full bg-emerald transition-all"
              style={{ width: `${finished ? 100 : pct}%` }}
            />
          </div>
        </div>

        <div className="mx-auto w-full max-w-md flex-1 px-4 py-6">
          {!finished ? (
            <div className="rounded-2xl border-2 border-stroke-light bg-card p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-tertiary">
                Pergunta {step + 1} de {total}
              </p>
              <h2 className="mt-1 text-lg font-extrabold leading-snug text-foreground-dark">
                {q.prompt}
              </h2>

              <div className="mt-5 flex flex-col gap-2.5">
                {q.options.map((opt, i) => {
                  const isPicked = picked === i
                  const isCorrect = i === q.answer
                  const revealed = picked !== null
                  return (
                    <button
                      key={i}
                      onClick={() => pick(i)}
                      disabled={revealed}
                      className={cn(
                        "flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition-all",
                        !revealed &&
                          "border-stroke-light bg-surface-soft text-foreground-dark hover:border-emerald hover:bg-emerald/10",
                        revealed && isCorrect && "border-emerald bg-emerald/15 text-emerald",
                        revealed &&
                          isPicked &&
                          !isCorrect &&
                          "border-red-500 bg-red-500/10 text-red-400",
                        revealed &&
                          !isPicked &&
                          !isCorrect &&
                          "border-stroke-light bg-surface-soft text-foreground-tertiary opacity-60"
                      )}
                    >
                      <span>{opt}</span>
                      {revealed && isCorrect && <Check className="h-5 w-5" strokeWidth={3} />}
                      {revealed && isPicked && !isCorrect && (
                        <X className="h-5 w-5" strokeWidth={3} />
                      )}
                    </button>
                  )
                })}
              </div>

              {picked !== null && (
                <div className="mt-5 rounded-xl border border-stroke-muted bg-surface-soft p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-emerald">
                    Explicação
                  </p>
                  <p className="mt-1 text-sm text-foreground-dark">{q.explanation}</p>
                </div>
              )}

              {picked !== null && (
                <button
                  onClick={isLast ? () => setStep(step + 1) : next}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-dark"
                >
                  {isLast ? "Ver resultado" : "Próxima"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <div
              className={cn(
                "rounded-2xl border-2 p-6 text-center",
                passed
                  ? "border-emerald/50 bg-gradient-to-br from-emerald/10 to-card"
                  : "border-red-500/40 bg-gradient-to-br from-red-500/10 to-card"
              )}
            >
              <div
                className={cn(
                  "mx-auto flex h-20 w-20 items-center justify-center rounded-full",
                  perfect
                    ? "bg-gradient-to-br from-luxury/30 to-amber-400/30 text-luxury animate-bounce-slow"
                    : passed
                      ? "bg-emerald/20 text-emerald"
                      : "bg-red-500/15 text-red-400"
                )}
              >
                {perfect ? (
                  <Star className="h-10 w-10 fill-luxury" strokeWidth={2} />
                ) : passed ? (
                  <Trophy className="h-10 w-10" strokeWidth={2} />
                ) : (
                  <XCircle className="h-10 w-10" strokeWidth={2} />
                )}
              </div>
              <h2 className="mt-4 flex items-center justify-center gap-2 text-2xl font-extrabold text-foreground-dark">
                {perfect ? (
                  <>
                    <PartyPopper className="h-6 w-6 text-luxury" /> Nota máxima!
                  </>
                ) : passed ? (
                  "Módulo concluído!"
                ) : (
                  "Quase lá!"
                )}
              </h2>
              <p className="mt-1 text-sm text-foreground-tertiary">
                Você acertou {score} de {total} ({Math.round((score / total) * 100)}%)
              </p>
              <p className="mt-1 text-xs font-semibold text-foreground-tertiary">
                {perfect
                  ? "Perfeição! Você gabaritou a prova. Prepare-se para a festa!"
                  : passed
                    ? "Aprovação garantida — você passou do mínimo de 60%."
                    : `Você precisa de ao menos ${minToPass} acertos (60%) para concluir o módulo.`}
              </p>

              {perfect && (
                <div className="mt-3 flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="h-5 w-5 fill-luxury text-luxury"
                      style={{ animationDelay: `${s * 120}ms` }}
                    />
                  ))}
                </div>
              )}

              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-stroke-muted bg-surface-soft py-3">
                  <p className="text-[10px] font-semibold text-foreground-tertiary">Acertos</p>
                  <p className="text-base font-extrabold text-foreground-dark">
                    {score}/{total}
                  </p>
                </div>
                <div className="rounded-xl border border-stroke-muted bg-surface-soft py-3">
                  <p className="text-[10px] font-semibold text-foreground-tertiary">XP</p>
                  <p className="text-base font-extrabold text-emerald">
                    +{passed ? score * 20 : 0}
                  </p>
                </div>
                <div className="rounded-xl border border-stroke-muted bg-surface-soft py-3">
                  <p className="text-[10px] font-semibold text-foreground-tertiary">Gemas</p>
                  <p className="text-base font-extrabold text-luxury">+{passed ? 25 : 0}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                {passed ? (
                  <Link
                    to="/learn"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald py-4 text-sm font-extrabold uppercase tracking-wide text-white hover:bg-emerald-dark"
                  >
                    Avançar para o próximo módulo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <button
                    onClick={restart}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald py-4 text-sm font-extrabold uppercase tracking-wide text-white hover:bg-emerald-dark"
                  >
                    <RotateCcw className="h-4 w-4" /> Tentar novamente
                  </button>
                )}
                <Link
                  to="/learn"
                  className="rounded-2xl border-2 border-stroke-light bg-card py-3 text-sm font-bold text-foreground-dark hover:bg-surface-soft"
                >
                  Voltar à trilha
                </Link>
              </div>
            </div>
          )}
        </div>

        <AppBottomNav />
      </div>
    </>
  )
}
