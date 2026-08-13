import { useState, useRef, useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Wand2,
  Copy,
  Check,
  X,
  Clock,
  LayoutGrid,
  Lightbulb,
  Target,
  AlignLeft,
  Zap,
  Gem,
  ThumbsUp,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { getLocalGems } from "@/lib/xp";
import {
  enhancePrompt,
  type EnhancementResult,
  type FocusMode,
} from "@/lib/promptEnhancer";
import { AppBottomNav } from "@/components/AppBottomNav";
import { BackTapSetupCard } from "@/components/BackTapSetupCard";

// ── Constants ─────────────────────────────────────────────────────────────

const MAX_CHARS = 5000;

// ── Focus mode definitions ────────────────────────────────────────────────

interface FocusOption {
  mode: FocusMode;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const FOCUS_OPTIONS: FocusOption[] = [
  {
    mode: "general",
    label: "Geral",
    description: "Melhora completa e balanceada",
    icon: <LayoutGrid className="h-4 w-4" />,
  },
  {
    mode: "creativity",
    label: "Criatividade",
    description: "Aumenta a criatividade e originalidade",
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    mode: "precision",
    label: "Precisão",
    description: "Adiciona clareza ao(s) CTA(s)",
    icon: <Target className="h-4 w-4" />,
  },
  {
    mode: "detail",
    label: "Detalhamento",
    description: "Gera mais detalhes e especificações",
    icon: <AlignLeft className="h-4 w-4" />,
  },
];

// ── Types ─────────────────────────────────────────────────────────────────

interface HistoryItem {
  id: string;
  snippet: string;
  timestamp: string;
  result: EnhancementResult;
}

function formatTime(): string {
  const now = new Date();
  return now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

// ── Circular Score ────────────────────────────────────────────────────────

function CircularScore({ score }: { score: number }) {
  const pct = Math.round(score * 10);
  const displayScore = Math.round(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="2.5"
        />
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2.5"
          strokeDasharray={`${pct}, 100`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-2xl font-extrabold text-foreground-dark">
        {displayScore}
      </span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────

export default function PromptEnhancerPage() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [gems, setGems] = useState(0);
  const location = useLocation();

  const [promptText, setPromptText] = useState(
    (location.state as { initialPrompt?: string } | null)?.initialPrompt ?? ""
  );
  const [focusMode, setFocusMode] = useState<FocusMode>("general");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [result, setResult] = useState<EnhancementResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const enhanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastsTimerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    if (userId) setGems(getLocalGems(userId));
  }, [userId]);

  useEffect(() => {
    return () => {
      if (enhanceTimerRef.current) clearTimeout(enhanceTimerRef.current);
      toastsTimerRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleEnhance = useCallback(() => {
    const trimmed = promptText.trim();
    if (!trimmed || trimmed.length > MAX_CHARS) return;

    setIsEnhancing(true);
    setResult(null);

    enhanceTimerRef.current = setTimeout(() => {
      enhanceTimerRef.current = null;
      const enhanced = enhancePrompt(trimmed, focusMode);
      setResult(enhanced);
      setIsEnhancing(false);

      const snippet = trimmed.length > 60 ? trimmed.slice(0, 60) + "…" : trimmed;
      setHistory((prev) => [
        {
          id: Date.now().toString(36),
          snippet,
          timestamp: formatTime(),
          result: enhanced,
        },
        ...prev,
      ]);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 600);
  }, [promptText, focusMode]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    setCopyError(false);
    toastsTimerRef.current.forEach(clearTimeout);
    toastsTimerRef.current = [];

    try {
      await navigator.clipboard.writeText(result.enhanced);
      setCopied(true);
      const t = setTimeout(() => setCopied(false), 2000);
      toastsTimerRef.current.push(t);
    } catch {
      setCopyError(true);
      const t = setTimeout(() => setCopyError(false), 3000);
      toastsTimerRef.current.push(t);
    }
  }, [result]);

  const handleReset = useCallback(() => {
    setResult(null);
    setPromptText("");
    setCopied(false);
    setCopyError(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleOpenHistory = useCallback((item: HistoryItem) => {
    setResult(item.result);
    setPromptText(item.result.original);
    setFocusMode(item.result.focusMode);
    setHistoryOpen(false);
  }, []);

  const canEnhance =
    promptText.trim().length > 0 &&
    promptText.trim().length <= MAX_CHARS &&
    !isEnhancing;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* ── Header ── */}
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-stroke-muted bg-card px-4 py-3">
        <Link
          to="/home"
          className="rounded-full p-1.5 text-forest transition-colors hover:bg-surface-success"
          aria-label="Voltar para a Home"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-primary-dark truncate">
              Prompt Enhancer
            </h1>
            <span className="inline-flex items-center rounded-full bg-emerald/15 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald shrink-0">
              Novo
            </span>
          </div>
        </div>
        <div
          className="flex shrink-0 items-center gap-1 rounded-full bg-luxury/15 px-2.5 py-1.5"
          aria-label={`Saldo de gemas: ${gems}`}
        >
          <Gem className="h-4 w-4 text-luxury" />
          <span className="text-xs font-extrabold text-luxury">{gems.toLocaleString("pt-BR")}</span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-5 space-y-4 pb-32">

        {/* ── Hero Banner ── */}
        <div className="flex items-end justify-between rounded-2xl border border-emerald/20 bg-gradient-to-r from-emerald/5 to-emerald/10 pl-5 pr-0 pt-5">
          <div className="flex-1 pb-5 pr-2">
            <p className="text-sm leading-relaxed text-foreground-dark">
              Transforme seu prompt em instruções{" "}
              <strong className="text-foreground-dark">claras, detalhadas e otimizadas</strong>{" "}
              para IA.
            </p>
          </div>
          <img
            src="/prompt-asset.png"
            alt="Gatinha engenheira"
            className="h-44 w-44 shrink-0 object-contain self-end -mb-1"
          />
        </div>

        {/* ── Step 1: Prompt Input ── */}
        <div className="rounded-2xl border-2 border-stroke-light bg-card overflow-hidden">
          {/* Step header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-stroke-muted">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald text-white text-xs font-extrabold">
              1
            </div>
            <div>
              <p className="text-sm font-bold text-foreground-dark">Digite seu prompt</p>
              <p className="text-[11px] text-foreground-tertiary">Diga ao que a IA fará</p>
            </div>
          </div>

          {/* Textarea */}
          <div className="px-5 pt-4 pb-3">
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Cole ou digite seu prompt aqui…"
              className="w-full min-h-[120px] rounded-xl border-2 border-stroke-light bg-surface-soft p-3.5 text-sm text-foreground-dark placeholder-foreground-placeholder resize-none focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20 transition-colors"
              id="prompt-enhancer-input"
              aria-label="Digite ou cole o prompt que deseja melhorar"
              aria-describedby="prompt-enhancer-help char-limit-status"
              aria-required="true"
              rows={4}
            />
            <div className="mt-2 flex items-center justify-between px-0.5">
              <span
                id="char-limit-status"
                className={cn(
                  "text-[11px] font-semibold",
                  promptText.length > MAX_CHARS * 0.9
                    ? "text-red-400"
                    : "text-foreground-placeholder",
                )}
                role="status"
                aria-live="polite"
              >
                {promptText.length}/{MAX_CHARS} caracteres
              </span>
              {promptText.length > 0 && (
                <button
                  onClick={() => setPromptText("")}
                  className="text-[11px] font-semibold text-red-400 hover:text-red-500 transition-colors"
                  aria-label="Limpar texto do prompt"
                >
                  Limpar
                </button>
              )}
            </div>
            <p id="prompt-enhancer-help" className="sr-only">
              Digite ou cole um prompt existente. Você pode colar prompts de até {MAX_CHARS} caracteres. Use qualquer idioma.
            </p>
          </div>
        </div>

        {/* ── Step 2: Focus Mode ── */}
        <div className="rounded-2xl border-2 border-stroke-light bg-card overflow-hidden">
          {/* Step header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-stroke-muted">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald text-white text-xs font-extrabold">
              2
            </div>
            <div>
              <p className="text-sm font-bold text-foreground-dark">
                Escolha o foco do aprimoramento
              </p>
              <p className="text-[11px] text-foreground-tertiary">
                Selecione o objetivo principal do seu prompt
              </p>
            </div>
          </div>

          {/* Focus cards — single row of 4 */}
          <div className="grid grid-cols-4 gap-2 px-5 py-4">
            {FOCUS_OPTIONS.map((opt) => {
              const selected = focusMode === opt.mode;
              return (
                <button
                  key={opt.mode}
                  onClick={() => setFocusMode(opt.mode)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border-2 px-1.5 py-3 text-center transition-all active:scale-95",
                    selected
                      ? "border-emerald bg-emerald/5"
                      : "border-stroke-light bg-surface-soft hover:border-emerald/40",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                      selected
                        ? "bg-emerald/20 text-emerald"
                        : "bg-surface-muted text-foreground-tertiary",
                    )}
                  >
                    {opt.icon}
                  </div>
                  <p
                    className={cn(
                      "text-[10px] font-extrabold leading-tight",
                      selected ? "text-emerald" : "text-foreground-dark",
                    )}
                  >
                    {opt.label}
                  </p>
                  <p className="text-[8.5px] leading-tight text-foreground-tertiary line-clamp-3">
                    {opt.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Enhance Button (no result yet) ── */}
        {!result && !isEnhancing && (
          <button
            onClick={handleEnhance}
            disabled={!canEnhance}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all active:scale-[0.98]",
              canEnhance
                ? "bg-emerald hover:bg-emerald-dark"
                : "bg-stroke-light text-foreground-placeholder cursor-not-allowed",
            )}
          >
            <Zap className="h-4 w-4" />
            Aprimorar prompt
          </button>
        )}

        {/* ── Enhancing ── */}
        {isEnhancing && (
          <div className="flex items-center justify-center gap-3 rounded-2xl border-2 border-emerald/30 bg-card py-8">
            <Wand2 className="h-6 w-6 text-emerald animate-pulse" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-bold text-foreground-dark">Aprimorando seu prompt…</p>
              <p className="text-xs text-foreground-tertiary">
                A gatinha engenheira está trabalhando nisso!
              </p>
            </div>
          </div>
        )}

        {/* ── Result ── */}
        {result && (
          <div ref={resultRef} className="space-y-4">
            {/* Result card */}
            <div className="rounded-2xl overflow-hidden border-2 border-emerald/40 shadow-sm">
              {/* Green header */}
              <div className="flex items-center justify-between bg-emerald px-4 py-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
                  <span className="text-sm font-bold text-white">Seu prompt aprimorado</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-white/30 active:scale-95"
                  aria-label={copied ? "Copiado!" : "Copiar prompt"}
                >
                  {copyError ? (
                    <span>Erro</span>
                  ) : copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copiar
                    </>
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="bg-card px-5 py-4">
                <p className="text-sm text-foreground-dark leading-relaxed whitespace-pre-line">
                  {result.enhancedMain}
                </p>
                <div className="mt-3 space-y-1">
                  <p className="text-xs text-foreground-dark">
                    <span className="font-semibold">Público-alvo:</span>{" "}
                    {result.audience}
                  </p>
                  <p className="text-xs font-semibold text-emerald">
                    Tom de voz: {result.tone}
                  </p>
                </div>
              </div>
            </div>

            {/* Score + Techniques */}
            <div className="grid grid-cols-2 gap-3">
              {/* Score */}
              <div className="flex flex-col items-center rounded-2xl border-2 border-stroke-light bg-card px-3 py-5 text-center">
                <p className="mb-3 text-[11px] font-bold text-foreground-tertiary">
                  Pontuação do prompt
                </p>
                <CircularScore score={result.enhancedScore} />
                <p className={cn(
                  "mt-3 text-sm font-extrabold",
                  result.enhancedScore >= 85 ? "text-emerald" :
                  result.enhancedScore >= 65 ? "text-yellow-500" :
                  result.enhancedScore >= 40 ? "text-orange-400" :
                  "text-red-400"
                )}>
                  {result.enhancedScore >= 85 ? (
                    <span className="flex items-center gap-1">Excelente! <Sparkles className="h-4 w-4" /></span>
                  ) : result.enhancedScore >= 65 ? (
                    <span className="flex items-center gap-1">Bom trabalho! <ThumbsUp className="h-4 w-4" /></span>
                  ) : result.enhancedScore >= 40 ? (
                    <span className="flex items-center gap-1">Pode melhorar <FileText className="h-4 w-4" /></span>
                  ) : (
                    <span className="flex items-center gap-1">Prompt fraco <AlertTriangle className="h-4 w-4" /></span>
                  )}
                </p>
                <p className="mt-1 px-1 text-[9px] leading-tight text-foreground-tertiary text-center">
                  {result.enhancedScore >= 85 ? "Seu prompt está com ótima qualidade." :
                   result.enhancedScore >= 65 ? "Seu prompt tem boas práticas, mas pode melhorar." :
                   result.enhancedScore >= 40 ? "Seu prompt precisa de ajustes para ser mais eficaz." :
                   "Revise a estrutura do seu prompt seguindo as sugestões."}
                </p>
              </div>

              {/* Techniques */}
              <div className="rounded-2xl border-2 border-stroke-light bg-card px-4 py-5">
                <p className="mb-3 text-[11px] font-bold text-foreground-tertiary">
                  Técnicas aplicadas
                </p>
                <ul className="space-y-2.5">
                  {result.appliedTechniques.map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald/15">
                        <Check className="h-3 w-3 text-emerald" strokeWidth={3} />
                      </div>
                      <span className="text-xs text-foreground-dark">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* History button */}
            {history.length > 1 && (
              <button
                onClick={() => setHistoryOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-stroke-light bg-card px-4 py-3 text-sm font-bold text-foreground-secondary transition-colors hover:bg-surface-soft"
              >
                <Clock className="h-4 w-4" />
                Ver aprimoramentos anteriores ({history.length - 1})
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Sticky Bottom CTA ── */}
      {result && (
        <div className="fixed bottom-16 left-0 right-0 z-10 px-4 pb-2">
          <div className="mx-auto max-w-2xl">
            <button
              onClick={handleReset}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-emerald-dark active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4" />
              Aprimorar novamente
            </button>
          </div>
        </div>
      )}

      {/* History button when no result */}
      {!result && history.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 z-10 px-4 pb-2">
          <div className="mx-auto max-w-2xl">
            <button
              onClick={() => setHistoryOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-stroke-light bg-card py-3 text-sm font-bold text-foreground-secondary shadow-sm transition-colors hover:bg-surface-soft"
            >
              <Clock className="h-4 w-4" />
              Ver aprimoramentos anteriores ({history.length})
            </button>
          </div>
        </div>
      )}

      {/* ── History Modal ── */}
      {historyOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setHistoryOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setHistoryOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Aprimoramentos anteriores"
        >
          <div
            className="relative w-full max-w-lg rounded-t-2xl sm:rounded-2xl bg-card p-5 shadow-xl max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-foreground-dark">
                  Aprimoramentos anteriores
                </h2>
                <p className="text-[11px] text-foreground-tertiary">
                  Disponíveis somente nesta sessão.
                </p>
              </div>
              <button
                onClick={() => setHistoryOpen(false)}
                className="rounded-full p-1.5 text-foreground-tertiary hover:bg-surface-soft transition-colors"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleOpenHistory(item)}
                  className="flex w-full items-center gap-3 rounded-xl border-2 border-stroke-light bg-card p-3 text-left transition-colors hover:bg-surface-soft"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
                    <Wand2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground-dark truncate">
                      {item.snippet}
                    </p>
                    <p className="text-[10px] text-foreground-tertiary">
                      {item.timestamp} •{" "}
                      {FOCUS_OPTIONS.find((o) => o.mode === item.result.focusMode)?.label}
                    </p>
                  </div>
                  <span className="rounded-lg bg-emerald/10 px-3 py-1 text-[10px] font-extrabold text-emerald shrink-0">
                    Ver
                  </span>
                </button>
              ))}

              <button
                onClick={() => setHistoryOpen(false)}
                className="mt-2 w-full rounded-xl border-2 border-stroke-light bg-card py-2.5 text-sm font-bold text-foreground-secondary transition-colors hover:bg-surface-soft"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back Tap quick access setup guide */}
      <div className="px-4 pb-6">
        <BackTapSetupCard />
      </div>

      <AppBottomNav />
    </div>
  );
}
