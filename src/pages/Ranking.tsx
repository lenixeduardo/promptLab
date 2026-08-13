import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { getLeaderboard, getUserProfile, updateUserXP } from "@/lib/db"
import type { LeaderboardEntry } from "@/lib/db"
import { getLocalXP, getLocalGems, getLevel, getLevelProgress } from "@/lib/xp"
import { getLevelTitle } from "@/lib/levelTitles"
import { getAvatarById } from "@/data/avatarsData"
import { AppBottomNav } from "@/components/AppBottomNav"
import * as Icons from "@/lib/icons"
import { Crown, Star, Trophy, PartyPopper, Award } from "lucide-react"
import { cn } from "@/lib/utils"

const MOCK_ENTRIES: LeaderboardEntry[] = [
  { id: "mock-1", full_name: "Ana Lima", avatar_url: "cat-scientist", xp: 4200 },
  { id: "mock-2", full_name: "Pedro Silva", avatar_url: "cat-rocker", xp: 3800 },
  { id: "mock-3", full_name: "Julia Mendes", avatar_url: "cat-void", xp: 3500 },
  { id: "mock-4", full_name: "Carlos Rocha", avatar_url: "cat-ninja", xp: 2900 },
  { id: "mock-5", full_name: "Beatriz Costa", avatar_url: "cat-astronaut", xp: 2200 },
  { id: "mock-6", full_name: "Lucas Ferreira", avatar_url: "cat-purple", xp: 1950 },
  { id: "mock-7", full_name: "Mariana Alves", avatar_url: "cat-punk", xp: 1700 },
  { id: "mock-8", full_name: "Rafael Sousa", avatar_url: "cat-blue", xp: 1450 },
]

type Period = "semana" | "mes" | "geral"

interface RankedUser extends LeaderboardEntry {
  position: number
  isCurrentUser: boolean
  level: number
  levelTitle: string
}

function getLevelStyle(level: number): React.CSSProperties {
  if (level >= 9)
    return { background: "linear-gradient(135deg, var(--brand-gold), var(--brand-orange))" }
  if (level >= 7) return { background: "linear-gradient(135deg, var(--brand-purple), #7c3aed)" }
  if (level >= 5)
    return { background: "linear-gradient(135deg, var(--emerald), var(--emerald-dark))" }
  if (level >= 3) return { background: "linear-gradient(135deg, var(--brand-blue), #2563eb)" }
  return { background: "linear-gradient(135deg, #94a3b8, #64748b)" }
}

function LevelBadge({ level, size = "sm" }: { level: number; size?: "sm" | "md" }) {
  const dim = size === "md" ? "h-6 w-6 text-[10px]" : "h-5 w-5 text-[9px]"
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-extrabold text-white shadow",
        dim
      )}
      style={getLevelStyle(level)}
      aria-label={`Nível ${level}`}
    >
      {level}
    </div>
  )
}

function getAvatarImage(avatarUrl: string | null): string {
  if (!avatarUrl) return "/assets/avatar-cat.png"
  const found = getAvatarById(avatarUrl)
  return found?.image ?? "/assets/avatar-cat.png"
}

const PODIUM_DELAYS = { 1: 0.1, 2: 0, 3: 0.2 } as const

function PodiumSpot({ user, rank }: { user: RankedUser | undefined; rank: 1 | 2 | 3 }) {
  if (!user) return <div className="flex-1" />

  const isFirst = rank === 1

  const avatarSizes = {
    1: "h-[68px] w-[68px]",
    2: "h-[52px] w-[52px]",
    3: "h-[52px] w-[52px]",
  }

  const pedestalColors = {
    1: "bg-gradient-to-t from-yellow-400/30 to-yellow-300/10 border-t-2 border-yellow-300/60",
    2: "bg-gradient-to-t from-slate-300/40 to-slate-200/10 border-t-2 border-slate-300/60",
    3: "bg-gradient-to-t from-amber-600/25 to-amber-500/10 border-t-2 border-amber-400/40",
  }

  const pedestalHeights = { 1: "h-[80px]", 2: "h-[56px]", 3: "h-[40px]" }

  const avatarRings = {
    1: "border-[3px] border-yellow-400 shadow-lg shadow-yellow-200/60",
    2: "border-2 border-slate-300",
    3: "border-2 border-amber-400/70",
  }

  const medalColors = {
    1: "text-yellow-400",
    2: "text-slate-400",
    3: "text-amber-600",
  } as const

  return (
    <div
      className={cn(
        "animate-podium-rise flex flex-1 flex-col items-center gap-1",
        isFirst ? "order-2" : rank === 2 ? "order-1" : "order-3"
      )}
      style={{ animationDelay: `${PODIUM_DELAYS[rank]}s` }}
    >
      {/* Crown / medal icon */}
      {isFirst ? (
        <Crown className="h-5 w-5 text-yellow-400 animate-crown-float" strokeWidth={2} />
      ) : (
        <Award
          className={cn("h-5 w-5 animate-bounce-slow", medalColors[rank])}
          strokeWidth={2}
          style={{ animationDelay: `${rank * 0.15}s` }}
        />
      )}

      {/* Avatar */}
      <div className="relative">
        <div
          className={cn(
            "overflow-hidden rounded-full",
            avatarSizes[rank],
            avatarRings[rank],
            isFirst && "ring-4 ring-yellow-300/30",
            user.isCurrentUser && "ring-2 ring-emerald ring-offset-2"
          )}
        >
          <img
            src={getAvatarImage(user.avatar_url)}
            alt={user.full_name ?? ""}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute -bottom-1 -right-1">
          <LevelBadge level={user.level} size={isFirst ? "md" : "sm"} />
        </div>
      </div>

      {/* Name */}
      <p className="mt-1.5 max-w-[80px] text-center text-[11px] font-bold leading-tight text-foreground-dark">
        {user.full_name ?? "Usuário"}
      </p>

      {/* XP */}
      <div className="flex items-center gap-0.5">
        <Icons.Zap className="h-3 w-3 text-yellow-500" />
        <span className="text-[11px] font-extrabold text-foreground-dark">
          {user.xp.toLocaleString("pt-BR")} XP
        </span>
      </div>

      {/* Level title */}
      <p className="text-[9px] text-foreground-tertiary">{user.levelTitle}</p>

      {/* Pedestal */}
      <div className={cn("w-full rounded-t-2xl", pedestalHeights[rank], pedestalColors[rank])} />
    </div>
  )
}

export default function Ranking() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [rankedUsers, setRankedUsers] = useState<RankedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [userAvatarImage, setUserAvatarImage] = useState("/assets/avatar-cat.png")

  useEffect(() => {
    if (!user?.id) return

    getUserProfile(user.id).then(({ data: profile }) => {
      if (profile?.avatar_url) {
        const found = getAvatarById(profile.avatar_url)
        if (found) setUserAvatarImage(found.image)
      }
    })

    async function buildRanking() {
      const currentXP = getLocalXP(user!.id)
      const currentGems = getLocalGems(user!.id)
      const currentName = user!.user_metadata?.full_name ?? user!.email?.split("@")[0] ?? "Você"

      await updateUserXP(user!.id, currentXP, currentGems)

      const { data } = await getLeaderboard(20)
      const base: LeaderboardEntry[] = data && data.length > 0 ? data : [...MOCK_ENTRIES]

      const others = base.filter((e) => e.id !== user!.id)

      const currentEntry: LeaderboardEntry = {
        id: user!.id,
        full_name: currentName,
        avatar_url: null,
        xp: currentXP,
      }

      const all = [...others, currentEntry].sort((a, b) => b.xp - a.xp)

      const ranked: RankedUser[] = all.map((entry, i) => {
        const level = getLevel(entry.xp)
        return {
          ...entry,
          position: i + 1,
          isCurrentUser: entry.id === user!.id,
          level,
          levelTitle: getLevelTitle(level),
        }
      })

      setRankedUsers(ranked)
      setLoading(false)
    }

    buildRanking().catch(() => {
      setRankedUsers(
        MOCK_ENTRIES.map((entry, i) => ({
          ...entry,
          position: i + 1,
          isCurrentUser: false,
          level: getLevel(entry.xp),
          levelTitle: getLevelTitle(getLevel(entry.xp)),
        }))
      )
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const top3 = [rankedUsers[0], rankedUsers[1], rankedUsers[2]]
  const rest = rankedUsers.slice(3)
  const currentUser = rankedUsers.find((u) => u.isCurrentUser)
  const { currentXP: progressXP, targetXP } = currentUser
    ? getLevelProgress(currentUser.xp)
    : { currentXP: 0, targetXP: 100 }
  const progressPct = currentUser ? Math.min(100, Math.round((progressXP / targetXP) * 100)) : 0

  const PERIOD_LABELS: Record<Period, string> = {
    semana: "Semana",
    mes: "Mês",
    geral: "Geral",
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="mx-auto flex w-full max-w-[420px] lg:max-w-2xl flex-col px-5 pb-24 lg:pb-8 pt-8">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Icons.Trophy className="h-6 w-6 text-emerald" />
              <h1 className="text-2xl font-extrabold text-primary-dark">Ranking</h1>
            </div>
            {!loading && currentUser && (
              <p className="mt-0.5 text-xs text-foreground-tertiary">
                #{currentUser.position} · {currentUser.levelTitle} · Nível {currentUser.level}
              </p>
            )}
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="h-10 w-10 overflow-hidden rounded-full border-2 border-stroke-light shadow-sm"
            aria-label="Ir para perfil"
          >
            <img src={userAvatarImage} alt="Perfil" className="h-full w-full object-cover" />
          </button>
        </div>

        {/* Period label - period filtering coming in v0.1 */}
        <div className="mb-5 flex items-center justify-center">
          <span className="rounded-full bg-emerald/10 px-4 py-1.5 text-xs font-bold text-emerald">
            Ranking Geral (todos os tempos)
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <img
                src="/assets/mascot-login-new.png"
                alt="Carregando"
                className="mx-auto mb-3 h-20 w-auto"
              />
              <p className="text-sm text-emerald">Carregando ranking...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Top 10 celebration banner */}
            {currentUser && currentUser.position <= 10 && (
              <div className="animate-celebration-pop mb-5 flex items-center gap-3 rounded-2xl border border-emerald/40 bg-gradient-to-r from-emerald/10 to-mint/10 px-4 py-3 shadow-sm animate-top10-glow">
                <PartyPopper className="h-6 w-6 shrink-0 text-luxury" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-primary-dark">
                    Você está no Top {currentUser.position <= 3 ? currentUser.position : "10"}!
                  </p>
                  <p className="text-xs text-foreground-muted">
                    {currentUser.position === 1
                      ? "Você é o #1 do PromptLab"
                      : currentUser.position <= 3
                        ? `Incrível! Pódio garantido na posição #${currentUser.position}`
                        : `Continue assim — você está no top 10`}
                  </p>
                </div>
                {currentUser.position === 1 ? (
                  <Crown className="h-5 w-5 shrink-0 text-yellow-400" strokeWidth={2} />
                ) : (
                  <Star
                    className="h-5 w-5 shrink-0 text-yellow-400 fill-yellow-400"
                    strokeWidth={2}
                  />
                )}
              </div>
            )}

            {/* Podium — white card */}
            <div className="mb-5 overflow-hidden rounded-3xl border border-stroke-muted bg-white shadow-sm">
              <div className="px-4 pt-4 pb-0">
                <p className="mb-4 flex items-center justify-center gap-1.5 text-center text-[11px] font-bold tracking-widest uppercase text-foreground-muted">
                  <Trophy className="h-3.5 w-3.5 text-yellow-500" strokeWidth={2} />
                  Top 3 do PromptLab
                </p>
                <div className="flex items-end justify-center gap-2">
                  <PodiumSpot user={top3[1]} rank={2} />
                  <PodiumSpot user={top3[0]} rank={1} />
                  <PodiumSpot user={top3[2]} rank={3} />
                </div>
              </div>
            </div>

            {/* Current user progress bar (if outside top 3) */}
            {currentUser && currentUser.position > 3 && (
              <div className="mb-4 rounded-2xl border border-emerald/30 bg-surface-success px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald/15 text-sm font-black text-emerald">
                    #{currentUser.position}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-primary-dark truncate">
                      {currentUser.full_name ?? "Você"}
                      <span className="ml-1.5 rounded-full bg-emerald/20 px-1.5 py-px text-[9px] font-semibold text-emerald">
                        você
                      </span>
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-emerald/15">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald to-mint transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <span className="shrink-0 text-[9px] tabular-nums text-foreground-tertiary">
                        {progressXP}/{targetXP} XP
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Icons.Zap className="h-3.5 w-3.5 text-yellow-500" />
                    <span className="text-sm font-extrabold text-primary-dark">
                      {currentUser.xp.toLocaleString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* List — positions 4+ */}
            {rest.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="mb-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-foreground-muted">
                  <span>Classificação geral</span>
                  <span className="text-[9px] text-foreground-tertiary">i</span>
                </p>

                {rest.map((entry, idx) => (
                  <div
                    key={entry.id}
                    className={cn(
                      "animate-rank-entry flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all",
                      entry.isCurrentUser
                        ? "border-emerald/40 bg-surface-success shadow-sm shadow-emerald/10"
                        : "border-stroke-muted bg-white shadow-sm"
                    )}
                    style={{ animationDelay: `${0.3 + idx * 0.07}s` }}
                  >
                    {/* Position */}
                    <span
                      className={cn(
                        "w-6 shrink-0 text-center text-sm font-black",
                        entry.isCurrentUser ? "text-emerald" : "text-foreground-tertiary"
                      )}
                    >
                      {entry.position}
                    </span>

                    {/* Avatar */}
                    <div className="relative h-10 w-10 shrink-0">
                      <div
                        className={cn(
                          "h-full w-full overflow-hidden rounded-full border-2",
                          entry.isCurrentUser ? "border-emerald" : "border-stroke-light"
                        )}
                      >
                        <img
                          src={getAvatarImage(entry.avatar_url)}
                          alt={entry.full_name ?? ""}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5">
                        <LevelBadge level={entry.level} />
                      </div>
                    </div>

                    {/* Name + title */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p
                          className={cn(
                            "text-sm font-bold",
                            entry.isCurrentUser ? "text-primary-dark" : "text-foreground-dark"
                          )}
                        >
                          {entry.full_name ?? "Usuário"}
                        </p>
                        {entry.isCurrentUser && (
                          <span className="rounded-full bg-emerald/15 px-1.5 py-px text-[9px] font-semibold text-emerald">
                            você
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-foreground-tertiary">{entry.levelTitle}</p>
                    </div>

                    {/* XP */}
                    <div className="flex shrink-0 flex-col items-end gap-0.5">
                      <div className="flex items-center gap-1">
                        <Icons.Zap className="h-3.5 w-3.5 text-yellow-400" />
                        <span className="text-sm font-extrabold text-primary-dark tabular-nums">
                          {entry.xp.toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <span className="text-[9px] text-foreground-tertiary">
                        XP · Nv {entry.level}
                      </span>
                    </div>
                  </div>
                ))}

                {rankedUsers.length >= 20 && (
                  <p className="mt-2 text-center text-xs text-foreground-tertiary py-2">
                    Mostrando top 20 · mais posições em breve
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <AppBottomNav />
    </div>
  )
}
