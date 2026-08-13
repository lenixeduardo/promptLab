import { Link } from "react-router-dom"
import {
  Heart,
  Brain,
  ArrowRight,
  Clock,
  Sparkles,
  Zap,
  Search,
  Wand2,
  Gem,
  Hand,
  PartyPopper,
} from "lucide-react"
import { NotificationsBell } from "@/components/NotificationsBell"
import { AppBottomNav } from "@/components/AppBottomNav"
import { DailyTipCard } from "@/components/DailyTipCard"
import { TrailPath } from "@/components/TrailPath"
import { useAvatar } from "@/components/AvatarProvider"
import { StreakFlame } from "@/components/StreakFlame"
import { StreakCelebration } from "@/components/StreakCelebration"
import { useStreak } from "@/lib/streak"
import { useState, useEffect } from "react"
import { useModuleProgress, type TrackId } from "@/lib/moduleProgress"
import { scopedKey, USER_SCOPE_EVENT } from "@/lib/userScope"
import { useAuth } from "@/hooks/useAuth"
import { getLocalXP, getLocalGems, GEMS_UPDATE_EVENT, XP_UPDATE_EVENT } from "@/lib/xp"
import { getDailyTip } from "@/lib/dailyTip"

type TrackInfo = { id: TrackId; label: string; modules: string[] }

const TRACKS: TrackInfo[] = [
  {
    id: "a1",
    label: "A1",
    modules: [
      "Boas-vindas",
      "O que é um prompt",
      "Contexto & clareza",
      "Personas e papéis",
      "Estruturas de prompt",
      "Few-shot & exemplos",
      "Refino iterativo",
    ],
  },
  {
    id: "a2",
    label: "A2",
    modules: [
      "Chain-of-thought",
      "Decomposição de tarefas",
      "Prompts com restrições",
      "Estilo e tom controlado",
      "Prompts multi-etapa",
      "Avaliação de respostas",
      "Refino guiado por dados",
    ],
  },
  {
    id: "a3",
    label: "A3",
    modules: [
      "Prompts para código",
      "Automação com IA",
      "Prompts para negócios",
      "Fluxos com agentes (Workflows)",
      "Avaliação & métricas",
      "Segurança e proteções (Guardrails)",
      "Projeto final",
      "Usando agentes de IA (Agents)",
      "Usando OpenRouter",
      "Modelos locais (Local Models)",
      "Claude Code na prática",
      "Habilidades (Skills) no Claude Code",
      "Personalizar modelos prontos (Templates)",
      "O que é API key",
      "Migrations e banco de dados",
      "Health check (banco e backend)",
      "Cron jobs para automações",
      "Node.js — O que é e para que serve",
      "Git Bash — Terminal e versionamento",
      "npm — Gerenciador de pacotes",
      "Skills em LLMs — Como usar",
    ],
  },
  {
    id: "a4",
    label: "A4",
    modules: [
      "Introdução à Técnica SAFE",
      "S — Sujeito",
      "A — Atributos",
      "F — Enquadramento",
      "E — Ambiente",
      "Restrições negativas",
      "Prova final — Dissertativa SAFE",
    ],
  },
]

const MISSIONS_BASE = "promptlabz:dailyMissions"
const CHEST_TOTAL = 5

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function useMissionsDone(): number {
  const [done, setDone] = useState(0)
  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem(scopedKey(MISSIONS_BASE))
        if (!raw) return setDone(0)
        const parsed = JSON.parse(raw) as { day?: string; completed?: Record<string, boolean> }
        if (parsed.day !== todayKey() || !parsed.completed) return setDone(0)
        setDone(Object.values(parsed.completed).filter(Boolean).length)
      } catch {
        setDone(0)
      }
    }
    read()
    window.addEventListener("storage", read)
    window.addEventListener("focus", read)
    window.addEventListener(USER_SCOPE_EVENT, read)
    return () => {
      window.removeEventListener("storage", read)
      window.removeEventListener("focus", read)
      window.removeEventListener(USER_SCOPE_EVENT, read)
    }
  }, [])
  return done
}

export default function HomePage() {
  const { equipped } = useAvatar()
  const a1 = useModuleProgress("a1")
  const a2 = useModuleProgress("a2")
  const a3 = useModuleProgress("a3")
  const a4 = useModuleProgress("a4")
  const completions: Record<TrackId, number> = { a1, a2, a3, a4 }

  const activeTrack =
    TRACKS.find((t) => completions[t.id] < t.modules.length) ?? TRACKS[TRACKS.length - 1]
  const activeCompleted = completions[activeTrack.id]
  const currentModuleIdx = Math.min(activeCompleted, activeTrack.modules.length - 1)
  const currentModuleTitle = activeTrack.modules[currentModuleIdx]

  const WINDOW = 5
  const startIdx = Math.max(0, Math.min(activeTrack.modules.length - WINDOW, currentModuleIdx - 2))
  const trail = activeTrack.modules.slice(startIdx, startIdx + WINDOW).map((label, i) => {
    const absIdx = startIdx + i
    const status: "completed" | "current" | "locked" =
      absIdx < activeCompleted ? "completed" : absIdx === activeCompleted ? "current" : "locked"
    return { label, status }
  })

  const missionsDone = useMissionsDone()
  const missionsPct = Math.round((Math.min(missionsDone, CHEST_TOTAL) / CHEST_TOTAL) * 100)

  const { user } = useAuth()
  const userId = user?.id ?? null
  const [xp, setXp] = useState(0)
  useEffect(() => {
    const readXP = () => setXp(userId ? getLocalXP(userId) : 0)
    readXP()
    window.addEventListener(XP_UPDATE_EVENT, readXP)
    window.addEventListener("storage", readXP)
    return () => {
      window.removeEventListener(XP_UPDATE_EVENT, readXP)
      window.removeEventListener("storage", readXP)
    }
  }, [userId])
  const [gems, setGems] = useState(0)
  useEffect(() => {
    const readGems = () => setGems(userId ? getLocalGems(userId) : 0)
    readGems()
    window.addEventListener(GEMS_UPDATE_EVENT, readGems)
    window.addEventListener("storage", readGems)
    return () => {
      window.removeEventListener(GEMS_UPDATE_EVENT, readGems)
      window.removeEventListener("storage", readGems)
    }
  }, [userId])
  const { count: streak, longest: longestStreak } = useStreak()
  const [streakCelebration, setStreakCelebration] = useState(false)

  const dailyTip = getDailyTip()

  useEffect(() => {
    if (streak < 7) return
    try {
      const key = scopedKey("promptlabz:lastStreakCelebrated")
      const last = Number(localStorage.getItem(key) || "0")
      if (streak > last) {
        const t = setTimeout(() => setStreakCelebration(true), 800)
        localStorage.setItem(key, String(streak))
        return () => clearTimeout(t)
      }
    } catch {
      // ignore storage errors
    }
  }, [streak])

  return (
    <>
      <StreakCelebration
        active={streakCelebration}
        streak={streak}
        onClose={() => setStreakCelebration(false)}
      />
      <div className="flex flex-col min-h-screen bg-white pb-24 lg:pb-8">
        <div className="bg-card border-b border-stroke-muted px-4 lg:px-8 py-3 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="flex items-center gap-1.5 text-lg lg:text-xl font-bold text-primary-dark">
              Olá, {user?.user_metadata?.full_name?.split(" ")[0] ?? "Explorador"}!{" "}
              <Hand className="h-5 w-5 text-yellow-400" />
            </h1>
            <p className="text-xs text-foreground-tertiary">Pronto para mais um desafio?</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/favorites"
              className="flex items-center justify-center rounded-full border border-stroke-light bg-card/70 p-2 shadow-sm text-forest hover:bg-surface-soft transition-colors"
              aria-label="Favoritos"
            >
              <Heart className="h-5 w-5" strokeWidth={2.2} />
            </Link>
            <NotificationsBell />
            <Link to="/profile" aria-label="Ir para perfil">
              <img
                src={equipped.image}
                alt={equipped.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-stroke-light bg-card transition-opacity hover:opacity-80"
              />
            </Link>
          </div>
        </div>

        {/* Desktop: 2-column layout; Mobile: single column */}
        <div className="flex-1 lg:grid lg:grid-cols-[1fr_340px] lg:gap-6 lg:px-8 lg:py-6 lg:items-start lg:max-w-6xl lg:mx-auto lg:w-full">
          {/* ── LEFT column (main content) ── */}
          <div className="px-4 py-5 lg:px-0 lg:py-0 flex flex-col gap-5">
            {xp === 0 && streak === 0 && (
              <div className="rounded-2xl border-2 border-emerald/30 bg-gradient-to-br from-emerald/10 to-card p-5">
                <div className="flex items-start gap-3 mb-4">
                  <img
                    src={equipped.image}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover border-2 border-emerald/30 shrink-0"
                  />
                  <div>
                    <p className="flex items-center gap-1.5 text-base font-extrabold text-foreground-dark">
                      Bem-vindo ao PromptLabz! <PartyPopper className="h-4 w-4 text-luxury" />
                    </p>
                    <p className="mt-1 text-xs text-foreground-tertiary leading-relaxed">
                      Comece pela primeira lição e ganhe seus primeiros XP. São só 10 minutos!
                    </p>
                  </div>
                </div>
                <Link
                  to="/lesson?track=a1"
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-dark"
                >
                  Começar agora
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
            <DailyTipCard tip={dailyTip.text} />

            {/* ── Analisador de Prompts card ── */}
            <Link
              to="/prompt-analyzer"
              className="group flex items-center gap-3 rounded-2xl border-2 border-emerald/30 bg-gradient-to-br from-emerald/[0.08] to-card p-4 transition-all hover:border-emerald/60 hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
                <Search className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-extrabold text-foreground-dark">
                    Analisador de Prompts
                  </p>
                  <span className="inline-flex items-center rounded-full bg-emerald/15 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-emerald shrink-0">
                    Novo
                  </span>
                </div>
                <p className="text-[11px] text-foreground-tertiary mt-0.5">
                  Envie seu histórico e descubra como melhorar seus prompts.
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-emerald transition-transform group-hover:translate-x-0.5" />
            </Link>

            {/* ── Prompt Enhancer card ── */}
            <Link
              to="/prompt-enhancer"
              className="group flex items-center gap-3 rounded-2xl border-2 border-luxury/30 bg-gradient-to-br from-luxury/[0.08] to-card p-4 transition-all hover:border-luxury/60 hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-luxury/10 text-luxury">
                <Wand2 className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-extrabold text-foreground-dark">Prompt Enhancer</p>
                  <span className="inline-flex items-center rounded-full bg-emerald/15 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-emerald shrink-0">
                    Novo
                  </span>
                </div>
                <p className="text-[11px] text-foreground-tertiary mt-0.5">
                  Cole seu prompt e receba uma versão melhorada em segundos.
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-luxury transition-transform group-hover:translate-x-0.5" />
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border-2 border-stroke-light bg-card px-4 py-3">
                <p className="text-[11px] font-semibold text-foreground-tertiary mb-1">
                  Sequência diária
                </p>
                <div className="flex items-center gap-1.5">
                  <StreakFlame streak={streak} />
                </div>
                <p className="text-[11px] text-foreground-placeholder mt-0.5">
                  Recorde: {longestStreak} dias
                </p>
              </div>
              <div className="rounded-2xl border-2 border-stroke-light bg-card px-4 py-3">
                <p className="text-[11px] font-semibold text-foreground-tertiary mb-1">Gemas</p>
                <div className="flex items-center gap-1.5">
                  <Gem className="h-6 w-6 text-luxury" />
                  <span className="text-xl font-extrabold text-foreground-dark">{gems}</span>
                </div>
                <p className="text-[11px] text-foreground-placeholder mt-0.5">
                  Use para desbloquear
                </p>
              </div>
            </div>

            <Link
              to="/quiz"
              className="group relative block overflow-hidden rounded-2xl border-2 border-luxury/40 bg-gradient-to-br from-luxury/15 to-card p-4 transition-transform active:scale-[0.98]"
            >
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-luxury/20 blur-2xl" />
              <div className="relative flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-luxury/20 text-luxury">
                  <Zap className="h-5 w-5" strokeWidth={2.4} />
                </div>
                <span className="rounded-full bg-luxury/20 px-2 py-0.5 text-[9px] font-extrabold uppercase text-luxury">
                  2 min
                </span>
              </div>
              <p className="mt-3 text-sm font-extrabold text-foreground-dark">Prova rápida</p>
              <p className="mt-0.5 text-[11px] text-foreground-tertiary">Ganhe XP em 3 perguntas</p>
            </Link>

            <Link
              to="/prompt-lab"
              className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border-2 border-emerald/40 bg-gradient-to-br from-emerald/15 to-card p-4 transition-transform active:scale-[0.99]"
            >
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald/20 blur-2xl" />
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald/20 text-emerald">
                <Sparkles className="h-6 w-6" strokeWidth={2.2} />
              </div>
              <div className="relative flex-1">
                <p className="text-sm font-extrabold text-foreground-dark">
                  Laboratório de Avaliação
                </p>
                <p className="text-[11px] text-foreground-tertiary">
                  Escreva seu prompt e receba nota da gatinha
                </p>
              </div>
              <ArrowRight className="relative h-5 w-5 text-emerald" />
            </Link>
          </div>
          {/* ── RIGHT column (sidebar widgets — desktop only) ── */}
          <div className="hidden lg:flex flex-col gap-5">
            <TrailPath
              trail={trail}
              trackLabel={activeTrack.label}
              completedCount={activeCompleted}
              totalCount={activeTrack.modules.length}
              missionsDone={missionsDone}
              missionsTotal={CHEST_TOTAL}
              missionsPct={missionsPct}
            />

            <div>
              <h2 className="text-base font-bold text-foreground-dark mb-3">Aula em destaque</h2>
              <div className="rounded-2xl border-2 border-stroke-light bg-card p-4">
                <div className="flex gap-4 mb-4">
                  <div className="w-20 h-20 flex-shrink-0 rounded-xl bg-page-bg-light flex items-center justify-center">
                    <Brain className="h-9 w-9 text-primary-dark" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-tertiary">
                      Trilha {activeTrack.label} · Módulo {currentModuleIdx + 1}
                    </p>
                    <p className="text-sm font-bold text-foreground-dark leading-snug">
                      {currentModuleTitle}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-foreground-tertiary">
                      <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                      <span className="text-xs">10 min</span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/lesson?track=${activeTrack.id}`}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-dark"
                >
                  {activeCompleted === 0 ? "Começar lição" : "Continuar lição"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* ── Mobile: trail + lesson (shown below other cards) ── */}
          <div className="lg:hidden px-4 pb-5 flex flex-col gap-5">
            <TrailPath
              trail={trail}
              trackLabel={activeTrack.label}
              completedCount={activeCompleted}
              totalCount={activeTrack.modules.length}
              missionsDone={missionsDone}
              missionsTotal={CHEST_TOTAL}
              missionsPct={missionsPct}
            />

            <div>
              <h2 className="text-base font-bold text-foreground-dark mb-3">Aula em destaque</h2>
              <div className="rounded-2xl border-2 border-stroke-light bg-card p-4">
                <div className="flex gap-4 mb-4">
                  <div className="w-20 h-20 flex-shrink-0 rounded-xl bg-page-bg-light flex items-center justify-center">
                    <Brain className="h-9 w-9 text-primary-dark" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-tertiary">
                      Trilha {activeTrack.label} · Módulo {currentModuleIdx + 1}
                    </p>
                    <p className="text-sm font-bold text-foreground-dark leading-snug">
                      {currentModuleTitle}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-foreground-tertiary">
                      <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                      <span className="text-xs">10 min</span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/lesson?track=${activeTrack.id}`}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-dark"
                >
                  {activeCompleted === 0 ? "Começar lição" : "Continuar lição"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* end grid */}

        <AppBottomNav />
      </div>
    </>
  )
}
