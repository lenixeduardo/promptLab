import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Send,
  Sparkles,
  RotateCcw,
  Star,
  Zap,
  MessageSquare,
  CheckCircle2,
  PartyPopper,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CelebrationCanvas } from "@/components/CelebrationCanvas"

interface EvalResult {
  score: number
  comment: string
  badges: string[]
}

function evaluatePrompt(text: string): EvalResult {
  const raw = text.trim()
  const t = raw.toLowerCase()
  const words = raw.split(/\s+/).filter(Boolean)
  const wc = words.length
  const sentences = raw.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
  const badges: string[] = []
  let score = 20

  if (wc >= 8 && wc < 20) {
    score += 6
  } else if (wc >= 20 && wc < 60) {
    score += 12
    badges.push("Boa extensão")
  } else if (wc >= 60 && wc <= 200) {
    score += 15
    badges.push("Detalhado")
  } else if (wc > 200) {
    score += 8
    badges.push("Muito longo")
  }

  if (
    /\b(aja como|atue como|você é um|você é uma|assuma o papel|persona|especialista em|seja um|seja uma)\b/.test(
      t
    )
  ) {
    score += 12
    badges.push("Persona definida")
  }

  if (
    /\b(crie|escreva|gere|liste|explique|resuma|traduza|analise|compare|sugira|descreva|reescreva|classifique|extraia|recomende|elabore|desenvolva|produza)\b/.test(
      t
    )
  ) {
    score += 10
    badges.push("Ação clara")
  }

  if (
    /\b(contexto|cenário|background|situação|estou|tenho|preciso|meu objetivo|nosso produto|a empresa)\b/.test(
      t
    )
  ) {
    score += 10
    badges.push("Contexto claro")
  }

  if (
    /\b(formato|estrutura|em formato|responda em|saída em|lista|tabela|markdown|json|tópicos|bullet|seções|parágrafos)\b/.test(
      t
    )
  ) {
    score += 12
    badges.push("Formato especificado")
  }

  if (
    /\b(máximo|mínimo|no máximo|no mínimo|até \d+|limite|palavras|caracteres|tokens|frases|parágrafos)\b/.test(
      t
    )
  ) {
    score += 10
    badges.push("Restrições definidas")
  }

  if (
    /\b(público[- ]alvo|destinado a|voltado para|para iniciantes|para leigos|para crianças|para desenvolvedores|para gerentes|audiência|leitor)\b/.test(
      t
    )
  ) {
    score += 8
    badges.push("Público-alvo")
  }

  if (/\b(exemplo|exemplos|por exemplo|ex:|few[- ]?shot|como no exemplo|veja:)\b/.test(t)) {
    score += 10
    badges.push("Few-shot / Exemplos")
  }

  if (
    /\b(tom|estilo|formal|informal|amigável|profissional|divertido|técnico|didático|conciso|persuasivo)\b/.test(
      t
    )
  ) {
    score += 6
    badges.push("Tom definido")
  }

  if (/\b(não use|evite|sem usar|não inclua|nunca|jamais|exceto|não mencione)\b/.test(t)) {
    score += 5
    badges.push("Diretrizes negativas")
  }

  if (
    /\b(passo a passo|step by step|pense em etapas|raciocine|justifique|explique seu raciocínio|chain of thought)\b/.test(
      t
    )
  ) {
    score += 6
    badges.push("Raciocínio guiado")
  }

  if (/(```|---|###|<\w+>|"""|\[\[)/.test(raw)) {
    score += 4
    badges.push("Delimitadores")
  }

  if (wc < 5) score -= 15
  if (sentences === 1 && wc < 12) score -= 5
  if (/^(faça|faz|me ajuda|me ajude|preciso de ajuda|help|oi|olá)\s*[.!?]?$/i.test(raw)) score -= 20

  const variance = (raw.length % 5) - 2
  score += variance

  score = Math.max(0, Math.min(100, score))

  let comment = ""
  if (score >= 90) {
    comment =
      "Uau! Esse prompt está no nível sênior. Contexto, persona, formato e restrições — tudo no lugar. A IA vai entregar ouro! 🏆"
  } else if (score >= 80) {
    comment =
      "Excelente trabalho! Seu prompt é claro e bem estruturado. Com poucos ajustes, pode ficar ainda mais afiado. ✨"
  } else if (score >= 60) {
    comment =
      "Boa base! Tente adicionar uma persona ou definir melhor o formato de saída. Quanto mais específico, melhor o resultado. 💡"
  } else if (score >= 40) {
    comment =
      "Está no caminho! Mas prompts genéricos geram respostas genéricas. Adicione contexto, persona e restrições. 🐱"
  } else {
    comment =
      "Ainda está muito vago. Pense em quem a IA deve ser, o que deve fazer e como deve entregar. Eu acredito em você! 🌱"
  }

  return { score, comment, badges }
}

export default function PromptLabPage() {
  const navigate = useNavigate()
  const [input, setInput] = useState("")
  const [evaluating, setEvaluating] = useState(false)
  const [result, setResult] = useState<EvalResult | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [mascotSpeaking, setMascotSpeaking] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (result && result.score > 80) {
      const t = setTimeout(() => setShowCelebration(true), 400)
      return () => clearTimeout(t)
    }
  }, [result])

  function handleEvaluate() {
    if (!input.trim()) return
    setEvaluating(true)
    setResult(null)
    setShowCelebration(false)

    setTimeout(() => {
      const res = evaluatePrompt(input)
      setResult(res)
      setEvaluating(false)
      setMascotSpeaking(true)
      setTimeout(() => setMascotSpeaking(false), 2000)
    }, 1200)
  }

  function handleReset() {
    setInput("")
    setResult(null)
    setShowCelebration(false)
    setEvaluating(false)
    textareaRef.current?.focus()
  }

  const scoreColor =
    result && result.score >= 80
      ? "text-emerald"
      : result && result.score >= 60
        ? "text-luxury"
        : "text-red-400"

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <CelebrationCanvas active={showCelebration} duration={3500} />

      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-stroke-muted bg-card px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full p-1.5 text-forest hover:bg-surface-success"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-primary-dark">Laboratório de Prompts</h1>
          <p className="text-[11px] text-foreground-tertiary">
            Escreva seu prompt e receba feedback da gatinha
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-lg flex-1 px-4 py-5 flex flex-col gap-4">
        <div className="rounded-2xl border-2 border-stroke-light bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-luxury/15 text-luxury">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground-dark">Como funciona?</p>
              <p className="mt-0.5 text-xs text-foreground-tertiary leading-relaxed">
                Escreva um prompt completo no campo abaixo. Nossa gatinha especialista vai analisar
                e dar uma nota de 0 a 100. Acima de 80, prepare-se para a festa!
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          {evaluating && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 rounded-full bg-card border border-stroke-light px-3 py-1.5 shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald" />
              <span className="text-[10px] font-bold text-foreground-tertiary">
                A gatinha está analisando…
              </span>
            </div>
          )}

          <div className="flex items-end gap-3 mb-3">
            <div className="flex-1">
              <label className="text-xs font-bold text-foreground-secondary mb-1 block">
                Seu prompt
              </label>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ex: Atue como um copywriter sênior e escreva um anúncio de Instagram para um curso de IA..."
                className="w-full min-h-[100px] rounded-xl border-2 border-stroke-light bg-surface-soft p-3 text-sm text-foreground-dark placeholder:text-foreground-placeholder outline-none focus:border-emerald resize-none"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleEvaluate}
              disabled={!input.trim() || evaluating}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-extrabold transition-all",
                input.trim() && !evaluating
                  ? "bg-emerald text-white hover:bg-emerald-dark active:scale-[0.98]"
                  : "bg-stroke-light text-neutral cursor-not-allowed"
              )}
            >
              <Zap className="h-4 w-4" />
              {evaluating ? "Analisando…" : "Avaliar prompt"}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-stroke-light bg-card px-4 py-3 text-sm font-bold text-foreground-secondary hover:bg-surface-soft transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {result && (
          <div
            className={cn(
              "rounded-2xl border-2 p-5 text-center animate-fade-in",
              result.score >= 80
                ? "border-emerald/50 bg-gradient-to-br from-emerald/10 to-card"
                : result.score >= 60
                  ? "border-luxury/40 bg-gradient-to-br from-luxury/10 to-card"
                  : "border-red-300/50 bg-gradient-to-br from-red-50 to-card"
            )}
          >
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="var(--stroke-light)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={
                    result.score >= 80 ? "#22C55E" : result.score >= 60 ? "#D97706" : "#EF4444"
                  }
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(result.score / 100) * 264} 264`}
                />
              </svg>
              <div className="text-center">
                <span className={cn("block text-3xl font-extrabold", scoreColor)}>
                  {result.score}
                </span>
                <span className="text-[10px] font-bold text-foreground-tertiary">/ 100</span>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={cn(
                    "h-5 w-5 transition-all",
                    s <= Math.round(result.score / 20)
                      ? "fill-luxury text-luxury"
                      : "text-stroke-light"
                  )}
                />
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl border border-stroke-muted bg-card p-3 text-left">
              <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
              <p className="text-sm text-foreground-dark leading-relaxed">{result.comment}</p>
            </div>

            {result.badges.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {result.badges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald/15 px-2.5 py-1 text-[10px] font-extrabold text-emerald"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {badge}
                  </span>
                ))}
              </div>
            )}

            {result.score > 80 && (
              <div className="mt-4 rounded-xl bg-emerald/10 px-4 py-2">
                <p className="flex items-center gap-1.5 text-xs font-extrabold text-emerald animate-pulse">
                  <PartyPopper className="h-3.5 w-3.5 shrink-0" /> Nota acima de 80! Você dominou a
                  arte do prompt!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
