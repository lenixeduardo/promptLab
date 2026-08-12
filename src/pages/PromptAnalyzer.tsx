import { useState, useRef, useEffect } from "react"
import {
  ArrowLeft,
  FileUp,
  FileText,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  X,
  Zap,
  MessageCircle,
  BarChart2,
  Trophy,
  User,
  Gem,
  Sparkles,
  Loader2,
  Lock,
} from "lucide-react"
import { Link } from "react-router-dom"
import { AppBottomNav } from "@/components/AppBottomNav"
import { useAuth } from "@/hooks/useAuth"
import { getLocalGems } from "@/lib/xp"
import { cn } from "@/lib/utils"
import { isSupabaseConfigured } from "@/lib/supabase"
import { evaluatePromptWithAI, type PromptEvaluation } from "@/lib/evaluatePrompt"

// ── Types ──────────────────────────────────────────────────────────────────

type PageState = "upload" | "analyzing" | "result"

interface MessageAnalysis {
  text: string
  snippet: string
  clarity: number
  specificity: number
  context: number
  score: number
  issues: string[]
  suggestions: string[]
}

interface ConversationAnalysis {
  messages: MessageAnalysis[]
  overallScore: number
  positives: string[]
  improvements: string[]
}

// ── Conversation parser ────────────────────────────────────────────────────

const USER_ROLE_RE = /^(\s*#{1,6}\s*)?(Você|Eu|Human|User|You|Usuario)\s*:?\s*$/i
const AI_ROLE_RE =
  /^(\s*#{1,6}\s*)?(Assistant|Assistente|Model|Modelo|Claude|ChatGPT|Gemini|IA|AI|GPT)\s*:?\s*$/i
const INLINE_USER_RE = /^\s*\*\*(Você|Eu|Human|User|You|Usuario)\s*:\*\*\s*(.*)/i

function extractUserMessages(content: string): string[] {
  const lines = content.split("\n")
  const messages: string[] = []
  let buffer: string[] = []
  let inUser = false

  for (const line of lines) {
    const inlineMatch = line.match(INLINE_USER_RE)
    if (inlineMatch) {
      if (buffer.length > 0 && inUser) messages.push(buffer.join("\n").trim())
      buffer = inlineMatch[2] ? [inlineMatch[2]] : []
      inUser = true
    } else if (USER_ROLE_RE.test(line)) {
      if (buffer.length > 0 && inUser) messages.push(buffer.join("\n").trim())
      buffer = []
      inUser = true
    } else if (AI_ROLE_RE.test(line)) {
      if (inUser && buffer.length > 0) messages.push(buffer.join("\n").trim())
      buffer = []
      inUser = false
    } else if (inUser) {
      buffer.push(line)
    }
  }

  if (inUser && buffer.length > 0) messages.push(buffer.join("\n").trim())
  const filtered = messages.filter((m) => m.trim().length > 5)
  if (filtered.length === 0) {
    return content
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 10)
  }
  return filtered
}

// ── Message analyzer ───────────────────────────────────────────────────────

function analyzeMessage(text: string): MessageAnalysis {
  const trimmed = text.trim()
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length
  const hasContext =
    /contexto|context|você é|you are|atue como|act as|especialista|expert/i.test(trimmed)
  const hasExamples = /exemplo|example|por exemplo|e\.g\.|such as/i.test(trimmed)
  const hasGoal =
    /quero|preciso|gere|crie|escreva|want|need|generate|create|write|faça|elabore|liste|explique|analise/i.test(
      trimmed,
    )
  const hasFormat =
    /formato|format|lista|list|tabela|table|json|markdown|bullet|parágrafo/i.test(trimmed)

  const clarity = Math.min(100, Math.round((wordCount / 30) * 50 + (hasGoal ? 50 : 0)))
  const specificity = Math.min(
    100,
    Math.round((wordCount / 50) * 60 + (hasExamples ? 25 : 0) + (hasFormat ? 15 : 0)),
  )
  const context = Math.min(100, Math.round((hasContext ? 70 : 0) + (wordCount > 20 ? 30 : 0)))
  const score = Math.round(((clarity + specificity + context) / 3 / 10) * 10) / 10

  const issues: string[] = []
  const suggestions: string[] = []
  if (wordCount < 5) issues.push("Prompt muito curto")
  if (!hasGoal) issues.push("Ausência de objetivo claro")
  if (!hasContext) issues.push("Sem contexto ou papel definido")
  if (!hasExamples && wordCount < 20) issues.push("Ausência de exemplos")
  if (wordCount < 10) suggestions.push("Expanda o prompt — seja mais detalhado.")
  if (!hasGoal) suggestions.push("Descreva claramente o que quer que a IA faça.")
  if (!hasContext) suggestions.push("Adicione contexto: 'Você é um especialista em…'")
  if (!hasExamples) suggestions.push("Inclua exemplos do resultado esperado.")
  if (issues.length === 0)
    suggestions.push("Ótimo prompt! Considere adicionar restrições de formato.")

  const snippet = trimmed.length > 70 ? trimmed.slice(0, 70) + "…" : trimmed
  return { text: trimmed, snippet, clarity, specificity, context, score, issues, suggestions }
}

function analyzeConversation(messages: string[]): ConversationAnalysis {
  const last2 = messages.slice(-2)
  const analyzed = last2.map(analyzeMessage)
  const overallScore =
    Math.round((analyzed.reduce((s, m) => s + m.score, 0) / analyzed.length) * 10) / 10

  const positives: string[] = []
  const improvements: string[] = []
  if (analyzed.some((m) => m.context >= 70)) positives.push("Bom uso de contexto e papel definido.")
  if (analyzed.some((m) => m.specificity >= 70))
    positives.push("Boa especificidade nas solicitações.")
  if (analyzed.every((m) => m.issues.length === 0))
    positives.push("Todos os prompts têm objetivo claro e bem definido.")
  if (positives.length === 0)
    positives.push("Os prompts foram identificados e analisados com sucesso.")
  const uniqueImprovements = [...new Set(analyzed.flatMap((m) => m.suggestions))].slice(0, 3)
  improvements.push(...uniqueImprovements)

  return { messages: analyzed, overallScore, positives, improvements }
}

// ── Static example data (matches mockup exactly) ───────────────────────────

const EXAMPLE_TURNS = [
  {
    text: "Crie um texto sobre marketing",
    score: 59,
    analysisType: "error" as const,
    analysisTitle: "Prompt muito vago",
    analysisDetail: "Ausência de objetivo, público, formato, tom e exemplos detalhados.",
    solutionLabel: "Solução sugerida",
    solution:
      "Crie um texto persuasivo sobre marketing digital para pequenas empresas em tom profissional com foco em atrair clientes.",
  },
  {
    text: "Explique como funciona o marketing de conteúdo para iniciantes",
    score: 82,
    analysisType: "warning" as const,
    analysisTitle: "Bom descrição, mas poderia melhorar!",
    analysisDetail:
      "Inclua mais detalhes sobre o formato e o contexto para tornar ainda mais eficaz.",
    solutionLabel: "Excelente prompt!",
    solution:
      "Com base no contexto e no bom prompt, a resposta da IA será mais precisa e relevante.",
  },
  {
    text: "Quais são as melhores estratégias de SEO para 2024 e como aplicá-las no meu site?",
    score: 91,
    analysisType: "success" as const,
    analysisTitle: "Excelente prompt!",
    analysisDetail:
      "Com base no contexto e no bom prompt, a resposta da IA terá contexto suficiente para gerar uma ótima resposta.",
    solutionLabel: null,
    solution: null,
  },
]

// ── Sub-components ─────────────────────────────────────────────────────────

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 70 ? "bg-emerald" : value >= 40 ? "bg-amber-400" : "bg-red-400"
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-foreground-secondary">{label}</span>
        <span className="text-[11px] font-bold text-foreground-tertiary">{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-stroke-muted/40">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const cls =
    score >= 7
      ? "bg-emerald/10 text-emerald border-emerald/20"
      : score >= 4
        ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
        : "bg-red-50 text-red-500 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold",
        cls,
      )}
    >
      {score.toFixed(1)}/10
    </span>
  )
}

// score badge used inside example (integer, no /10)
function ExScoreBadge({ score }: { score: number }) {
  const cls =
    score >= 70
      ? "bg-emerald/10 text-emerald border-emerald/20"
      : "bg-red-50 text-red-500 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-1.5 py-0.5 text-[10px] font-extrabold",
        cls,
      )}
    >
      {score}
    </span>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function PromptAnalyzerPage() {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [gems, setGems] = useState(0)

  const [pageState, setPageState] = useState<PageState>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [result, setResult] = useState<ConversationAnalysis | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── AI analysis (opt-in, complements the local heuristic result) ──────
  const [aiStatus, setAiStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [aiResult, setAiResult] = useState<PromptEvaluation | null>(null)
  const [aiError, setAiError] = useState<{ message: string; quotaExceeded: boolean } | null>(null)

  useEffect(() => {
    if (userId) setGems(getLocalGems(userId))
  }, [userId])

  function processFile(f: File) {
    setFileError(null)
    const ext = f.name.split(".").pop()?.toLowerCase()
    if (!["txt", "md", "pdf"].includes(ext ?? "")) {
      setFileError("Formato não suportado. Use .txt ou .md.")
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setFileError("Arquivo muito grande. Máximo 10 MB.")
      return
    }
    if (ext === "pdf") {
      setFileError("PDF ainda não suportado. Use .txt ou .md.")
      return
    }
    setFile(f)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) processFile(f)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) processFile(f)
  }

  function handleAnalyze() {
    if (!file) return
    setPageState("analyzing")
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = (e.target?.result as string) ?? ""
      const messages = extractUserMessages(content)
      setTimeout(() => {
        if (messages.length === 0) {
          setFileError("Nenhuma mensagem de usuário encontrada no arquivo.")
          setPageState("upload")
          return
        }
        setResult(analyzeConversation(messages))
        setPageState("result")
      }, 800)
    }
    reader.readAsText(file, "utf-8")
  }

  function handleReset() {
    setFile(null)
    setFileError(null)
    setResult(null)
    setPageState("upload")
    setAiStatus("idle")
    setAiResult(null)
    setAiError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function handleAiAnalyze() {
    if (!result || result.messages.length === 0) return
    const lastMessage = result.messages[result.messages.length - 1]
    setAiStatus("loading")
    setAiError(null)

    const outcome = await evaluatePromptWithAI(lastMessage.text)
    if (outcome.ok === true) {
      setAiResult(outcome.data)
      setAiStatus("success")
    } else {
      setAiError(outcome.error)
      setAiStatus("error")
    }
  }

  const overallColor =
    (result?.overallScore ?? 0) >= 7
      ? "text-emerald border-emerald"
      : (result?.overallScore ?? 0) >= 4
        ? "text-amber-500 border-amber-400"
        : "text-red-500 border-red-400"

  return (
    <div className="flex min-h-screen flex-col bg-white pb-28 lg:pb-8">

      {/* ── Header ── */}
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-stroke-muted bg-card px-4 py-3">
        <Link
          to="/home"
          className="rounded-full p-1.5 text-forest transition-colors hover:bg-surface-success"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-primary-dark truncate">
              Analisador de Prompts
            </h1>
            <span className="inline-flex shrink-0 items-center rounded-full bg-emerald/15 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald">
              Novo
            </span>
          </div>
          <p className="text-[11px] text-foreground-tertiary">Receba uma análise completa</p>
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-luxury/15 px-2.5 py-1.5">
          <Gem className="h-4 w-4 text-luxury" />
          <span className="text-xs font-extrabold text-luxury">{gems.toLocaleString()}</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-lg px-4 py-4 space-y-4">

        {/* ══════════════════════════════════════════
            UPLOAD STATE
        ══════════════════════════════════════════ */}
        {pageState === "upload" && (
          <>
            {/* ── Upload card ── */}
            <div
              className={cn(
                "rounded-2xl border-2 bg-card overflow-hidden transition-colors",
                file ? "border-emerald/40" : "border-stroke-light",
              )}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="flex items-stretch">
                {/* Mascote — coluna esquerda */}
                <div className="flex shrink-0 items-end justify-center bg-emerald/5 px-3 pt-3 w-[148px]">
                  <img
                    src="/assets/mascot-analyzer.png"
                    alt="Mascote analisadora"
                    className="w-full h-auto object-contain max-h-[148px]"
                  />
                </div>

                {/* Info + botão — coluna direita */}
                <div className="flex flex-1 flex-col justify-center gap-3 p-4">
                  <div>
                    <p className="text-sm font-bold text-foreground-dark leading-snug">
                      Anexe seu histórico de conversa
                    </p>
                    <p className="mt-1.5 text-[11px] text-foreground-tertiary leading-relaxed">
                      Formatos aceitos: .txt, .md
                    </p>
                    <p className="text-[11px] text-foreground-tertiary">Tamanho máximo: 10MB</p>
                    {file && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald truncate">
                        <FileText className="h-3 w-3 shrink-0" />
                        {file.name}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded-xl border-2 border-foreground-dark/20 bg-card py-2 text-[11px] font-bold text-foreground-dark transition-colors hover:bg-surface-soft"
                  >
                    {file ? "Trocar arquivo" : "Escolher arquivo"}
                  </button>
                </div>
              </div>

              {/* Erro + botão analisar */}
              {(fileError || file) && (
                <div className="border-t border-stroke-muted px-4 py-3 space-y-2">
                  {fileError && (
                    <p className="flex items-center gap-1.5 text-xs text-red-500" role="alert">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {fileError}
                    </p>
                  )}
                  {file && (
                    <button
                      onClick={handleAnalyze}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald py-2.5 text-sm font-bold text-white transition-all hover:bg-emerald-dark active:scale-[0.98]"
                    >
                      <Zap className="h-4 w-4" />
                      Analisar conversa
                    </button>
                  )}
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.pdf,text/plain,text/markdown"
              className="hidden"
              onChange={handleFileChange}
              aria-hidden="true"
              aria-label="Selecione um arquivo de conversação em formato .txt ou .md"
            />

            {/* ── Dica ── */}
            <div className="flex items-start gap-2.5 rounded-xl border border-stroke-muted bg-surface-soft px-4 py-3">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" strokeWidth={2} />
              <p className="text-xs text-foreground-secondary leading-relaxed">
                <span className="font-bold">Dica:</span> Exporte suas conversas do ChatGPT, Gemini,
                Claude ou outra IA em formato .txt ou .md para facilitar a análise.
              </p>
            </div>

            {/* ── Como funciona — 4 cards em linha ── */}
            <div>
              <h2 className="mb-3 text-sm font-extrabold text-foreground-dark">Como funciona</h2>
              <div className="grid grid-cols-4 gap-2">
                {(
                  [
                    { n: 1, label: "Envie seu arquivo com a IA", icon: <FileUp className="h-4 w-4" /> },
                    { n: 2, label: "Analisamos tudo", icon: <BarChart2 className="h-4 w-4" /> },
                    { n: 3, label: "Você recebe o feedback", icon: <MessageCircle className="h-4 w-4" /> },
                    { n: 4, label: "Nota final", icon: <Trophy className="h-4 w-4" /> },
                  ] as const
                ).map((item) => (
                  <div
                    key={item.n}
                    className="flex flex-col items-center gap-2 rounded-xl border-2 border-stroke-light bg-card px-1.5 py-3 text-center"
                  >
                    <div className="relative">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                        {item.icon}
                      </div>
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald text-[9px] font-extrabold text-white">
                        {item.n}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-foreground-dark leading-tight">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Exemplo de análise ── */}
            <div>
              <h2 className="mb-3 text-sm font-extrabold text-foreground-dark">
                Exemplo de análise
              </h2>

              {/* 3 turnos em layout 2 colunas: prompt | análise */}
              <div className="space-y-2">
                {EXAMPLE_TURNS.map((turn, i) => (
                  <div key={i} className="grid grid-cols-[2fr_3fr] gap-2">

                    {/* Coluna esquerda — prompt do usuário */}
                    <div className="rounded-xl border-2 border-stroke-light bg-card p-2.5">
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <div className="flex items-center gap-1">
                          <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald/15">
                            <User className="h-2.5 w-2.5 text-emerald" />
                          </div>
                          <span className="text-[10px] font-bold text-foreground-tertiary">
                            Você
                          </span>
                        </div>
                        <ExScoreBadge score={turn.score} />
                      </div>
                      <p className="text-[10px] leading-snug text-foreground-dark line-clamp-4">
                        {turn.text}
                      </p>
                    </div>

                    {/* Coluna direita — análise */}
                    <div className="rounded-xl border-2 border-stroke-light bg-card p-2.5">
                      {turn.analysisType === "error" && (
                        <>
                          <div className="flex items-center gap-1 mb-1">
                            <X className="h-3 w-3 shrink-0 text-red-500" />
                            <p className="text-[10px] font-bold text-red-500 leading-tight">
                              {turn.analysisTitle}
                            </p>
                          </div>
                          <p className="text-[9px] text-foreground-tertiary leading-snug mb-2">
                            {turn.analysisDetail}
                          </p>
                          <div className="flex items-center gap-1 mb-1">
                            <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald" />
                            <p className="text-[10px] font-bold text-emerald">{turn.solutionLabel}</p>
                          </div>
                          <p className="text-[9px] text-foreground-secondary leading-snug">
                            {turn.solution}
                          </p>
                        </>
                      )}

                      {turn.analysisType === "warning" && (
                        <>
                          <p className="text-[10px] font-bold text-amber-600 leading-tight mb-1">
                            {turn.analysisTitle}
                          </p>
                          <p className="text-[9px] text-foreground-tertiary leading-snug mb-2">
                            {turn.analysisDetail}
                          </p>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald/10 px-2 py-0.5 text-[9px] font-bold text-emerald">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            {turn.solutionLabel}
                          </span>
                        </>
                      )}

                      {turn.analysisType === "success" && (
                        <>
                          <div className="flex items-center gap-1 mb-1">
                            <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald" />
                            <p className="text-[10px] font-bold text-emerald">
                              {turn.analysisTitle}
                            </p>
                          </div>
                          <p className="text-[9px] text-foreground-tertiary leading-snug">
                            {turn.analysisDetail}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Nota final da conversa (exemplo) ── */}
              <div className="mt-2 rounded-xl border-2 border-stroke-light bg-card p-4">
                <div className="flex items-start justify-between gap-4">
                  {/* Score + label + resumo */}
                  <div className="flex-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-foreground-tertiary">
                      Nota final da conversa
                    </p>
                    <p className="mt-0.5 text-[42px] font-extrabold leading-none text-foreground-dark">
                      8.2
                      <span className="text-base font-semibold text-foreground-tertiary">/10</span>
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-emerald">Muito bom!</p>

                    <div className="mt-3 space-y-1">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-foreground-tertiary">
                        Resumo da análise
                      </p>
                      {["3 prompts analisados", "2 pontos de melhoria", "1 excelente prompt"].map(
                        (item, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
                            <span className="text-[11px] text-foreground-secondary">{item}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Círculo de score */}
                  <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border-[5px] border-emerald">
                    <span className="text-lg font-extrabold text-emerald">82%</span>
                  </div>
                </div>
              </div>

              {/* ── Botões de ação (exemplo) ── */}
              <div className="mt-2 flex gap-2">
                <button className="flex flex-1 items-center justify-center rounded-xl border-2 border-stroke-light bg-card py-3 text-xs font-bold text-foreground-secondary transition-colors hover:bg-surface-soft">
                  Nova análise
                </button>
                <button className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-emerald py-3 text-xs font-bold text-white transition-all hover:bg-emerald-dark active:scale-[0.98]">
                  Nova análise →
                </button>
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════
            ANALYZING STATE
        ══════════════════════════════════════════ */}
        {pageState === "analyzing" && (
          <div className="rounded-2xl border-2 border-emerald/30 bg-card p-8 text-center">
            <img
              src="/assets/mascot-analyzer.png"
              alt="Analisando"
              className="mx-auto w-36 h-auto object-contain animate-pulse"
            />
            <h2 className="mt-4 text-base font-extrabold text-foreground-dark">
              Analisando seus prompts…
            </h2>
            <p className="mt-1 text-sm text-foreground-tertiary">
              Identificando as 2 últimas solicitações e avaliando qualidade.
            </p>
            <div className="mt-5 mx-auto h-2 w-48 overflow-hidden rounded-full bg-surface-soft">
              <div className="h-full w-2/3 rounded-full bg-emerald animate-pulse" />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            RESULT STATE
        ══════════════════════════════════════════ */}
        {pageState === "result" && result && (
          <>
            {/* Arquivo selecionado */}
            <div className="flex items-center justify-between rounded-xl border-2 border-stroke-light bg-card px-4 py-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald" />
                <span className="text-xs font-bold text-foreground-dark truncate max-w-[200px]">
                  {file?.name}
                </span>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 rounded-lg bg-surface-soft px-2.5 py-1 text-[11px] font-bold text-foreground-tertiary transition-colors hover:bg-stroke-light"
              >
                <X className="h-3.5 w-3.5" />
                Trocar
              </button>
            </div>

            {/* Análise por mensagem */}
            <div>
              <h2 className="mb-1 text-sm font-extrabold text-foreground-dark">
                Análise das solicitações
              </h2>
              <p className="mb-3 text-[11px] text-foreground-tertiary">
                Considerando as {result.messages.length} última
                {result.messages.length > 1 ? "s" : ""} solicitaç
                {result.messages.length > 1 ? "ões" : "ão"} da conversa.
              </p>
              <div className="space-y-4">
                {result.messages.map((msg, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border-2 border-stroke-light bg-card p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald/10">
                          <span className="text-[10px] font-extrabold text-emerald">{i + 1}</span>
                        </div>
                        <span className="text-xs font-bold text-foreground-tertiary">
                          Solicitação {i + 1}
                        </span>
                      </div>
                      <ScoreBadge score={msg.score} />
                    </div>
                    <p className="rounded-lg bg-surface-soft px-3 py-2 text-xs text-foreground-secondary leading-relaxed">
                      "{msg.snippet}"
                    </p>
                    <div className="space-y-2">
                      <ScoreBar label="Clareza" value={msg.clarity} />
                      <ScoreBar label="Especificidade" value={msg.specificity} />
                      <ScoreBar label="Contexto" value={msg.context} />
                    </div>
                    {msg.issues.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-foreground-tertiary">
                          Problemas
                        </p>
                        {msg.issues.map((issue, j) => (
                          <div key={j} className="flex items-center gap-1.5">
                            <X className="h-3.5 w-3.5 shrink-0 text-red-500" />
                            <span className="text-xs text-red-500">{issue}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-foreground-tertiary">
                        Sugestões
                      </p>
                      {msg.suggestions.map((s, j) => (
                        <div key={j} className="flex items-start gap-1.5">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald" />
                          <span className="text-xs text-foreground-secondary">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nota final */}
            <div className="rounded-2xl border-2 border-stroke-light bg-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-foreground-tertiary">
                    Nota final da conversa
                  </p>
                  <p className="mt-0.5 text-[42px] font-extrabold leading-none text-foreground-dark">
                    {result.overallScore.toFixed(1)}
                    <span className="text-base font-semibold text-foreground-tertiary">/10</span>
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 text-xs font-bold",
                      result.overallScore >= 7
                        ? "text-emerald"
                        : result.overallScore >= 4
                          ? "text-amber-500"
                          : "text-red-500",
                    )}
                  >
                    {result.overallScore >= 7
                      ? "Muito bom!"
                      : result.overallScore >= 4
                        ? "Pode melhorar!"
                        : "Precisa de atenção!"}
                  </p>
                  <div className="mt-3 space-y-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-foreground-tertiary">
                      Resumo da análise
                    </p>
                    {result.positives.map((p, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald" />
                        <span className="text-[11px] text-foreground-secondary">{p}</span>
                      </div>
                    ))}
                    {result.improvements.slice(0, 2).map((imp, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <span className="text-[11px] text-foreground-secondary">{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className={cn(
                    "flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border-[5px]",
                    result.overallScore >= 7
                      ? "border-emerald"
                      : result.overallScore >= 4
                        ? "border-amber-400"
                        : "border-red-400",
                  )}
                >
                  <span
                    className={cn(
                      "text-lg font-extrabold",
                      result.overallScore >= 7
                        ? "text-emerald"
                        : result.overallScore >= 4
                          ? "text-amber-500"
                          : "text-red-500",
                    )}
                  >
                    {Math.round(result.overallScore * 10)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Análise com IA — opt-in, complementa a análise heurística acima */}
            {isSupabaseConfigured() && (
              <div className="rounded-2xl border-2 border-emerald/30 bg-card p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald/15">
                      <Sparkles className="h-3.5 w-3.5 text-emerald" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground-dark">Análise com IA</p>
                      <p className="text-[11px] text-foreground-tertiary">
                        Peça um segundo parecer ao Claude sobre sua última solicitação.
                      </p>
                    </div>
                  </div>
                  {aiStatus !== "success" && (
                    <button
                      onClick={handleAiAnalyze}
                      disabled={aiStatus === "loading"}
                      className={cn(
                        "flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold text-white transition-all active:scale-95",
                        aiStatus === "loading"
                          ? "bg-emerald/60 cursor-wait"
                          : "bg-emerald hover:bg-emerald-dark",
                      )}
                    >
                      {aiStatus === "loading" ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5" />
                      )}
                      {aiStatus === "loading" ? "Analisando…" : "Analisar com IA"}
                    </button>
                  )}
                </div>

                {aiStatus === "loading" && (
                  <div className="space-y-2" aria-live="polite" aria-busy="true">
                    <div className="h-3 w-3/4 animate-pulse rounded-full bg-surface-soft" />
                    <div className="h-3 w-1/2 animate-pulse rounded-full bg-surface-soft" />
                    <div className="h-16 w-full animate-pulse rounded-xl bg-surface-soft" />
                  </div>
                )}

                {aiStatus === "error" && aiError && (
                  <div
                    className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 dark:border-amber-800 dark:bg-amber-950/40"
                    role="alert"
                  >
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500 dark:text-amber-300" />
                    <div className="text-xs text-amber-700 leading-relaxed dark:text-amber-300">
                      <p>
                        {aiError.quotaExceeded
                          ? "Você atingiu o limite diário gratuito de análises com IA."
                          : aiError.message}
                      </p>
                      {aiError.quotaExceeded && (
                        <Link
                          to="/premium"
                          className="mt-1 inline-flex items-center gap-1 font-bold text-emerald hover:underline"
                        >
                          <Lock className="h-3 w-3" />
                          Assine o Premium para análises ilimitadas
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {aiStatus === "success" && aiResult && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-foreground-tertiary">
                        Nota da IA
                      </span>
                      <ScoreBadge score={Math.round(aiResult.score) / 10} />
                    </div>

                    {aiResult.strengths.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-foreground-tertiary">
                          Pontos fortes
                        </p>
                        {aiResult.strengths.map((s, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald" />
                            <span className="text-xs text-foreground-secondary">{s}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {aiResult.improvements.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-foreground-tertiary">
                          Melhorias sugeridas
                        </p>
                        {aiResult.improvements.map((s, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                            <span className="text-xs text-foreground-secondary">{s}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {aiResult.enhancedPrompt && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-foreground-tertiary">
                          Prompt aprimorado pela IA
                        </p>
                        <p className="rounded-lg bg-surface-soft px-3 py-2 text-xs text-foreground-secondary leading-relaxed whitespace-pre-line">
                          {aiResult.enhancedPrompt}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex flex-1 items-center justify-center rounded-xl border-2 border-stroke-light bg-card py-3 text-xs font-bold text-foreground-secondary transition-colors hover:bg-surface-soft"
              >
                Nova análise
              </button>
              <button
                onClick={handleReset}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-emerald py-3 text-xs font-bold text-white transition-all hover:bg-emerald-dark active:scale-[0.98]"
              >
                Nova análise →
              </button>
            </div>
          </>
        )}
      </div>

      <AppBottomNav />
    </div>
  )
}
