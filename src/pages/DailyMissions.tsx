import { Link } from "react-router-dom"
import { ArrowLeft, CheckCircle2, Circle, Zap, PartyPopper } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { DAILY_MISSIONS, TOTAL_DAILY_XP } from "@/data/dailyMissionsData"
import { AppBottomNav } from "@/components/AppBottomNav"
import { useAchievements } from "@/hooks/useAchievements"
import { cn } from "@/lib/utils"

function getCompletedIds(consecutiveDays: number, totalLessons: number): Set<string> {
  const completed = new Set<string>()
  if (consecutiveDays >= 1) completed.add("daily-visit")
  if (totalLessons >= 1) completed.add("complete-lesson")
  return completed
}

export default function DailyMissions() {
  const navigate = useNavigate()
  const { data } = useAchievements()

  const completed = getCompletedIds(data.consecutiveDays, data.totalLessonsCompleted)
  const completedCount = completed.size
  const progressPct = Math.round((completedCount / DAILY_MISSIONS.length) * 100)
  const earnedXp = DAILY_MISSIONS.filter((m) => completed.has(m.id)).reduce(
    (sum, m) => sum + m.xpReward,
    0
  )

  return (
    <div className="flex min-h-screen flex-col bg-white pb-24 lg:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-stroke-muted bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full p-1.5 text-forest transition-colors hover:bg-surface-success"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-primary-dark">Missões Diárias</h1>
            <p className="text-xs text-foregroundTertiary">
              Complete todas para ganhar +{TOTAL_DAILY_XP} XP
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-lg px-4 py-4">
        {/* Progress summary */}
        <div className="mb-5 rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-primary-dark">
                {completedCount} de {DAILY_MISSIONS.length} missões
              </p>
              <p className="text-xs text-foregroundTertiary">Renovam todo dia à meia-noite</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-600">
              <Zap className="h-4 w-4" />
              <span>+{earnedXp} XP</span>
            </div>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-stroke-muted/40">
            <div
              className="h-full rounded-full bg-primary-dark transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="mt-1 text-right text-[10px] font-semibold text-foregroundMuted">
            {progressPct}% completo
          </p>
        </div>

        {/* Mission cards */}
        <div className="flex flex-col gap-3">
          {DAILY_MISSIONS.map((mission) => {
            const isDone = completed.has(mission.id)
            return (
              <div
                key={mission.id}
                className={cn(
                  "flex items-start gap-4 rounded-2xl border p-4 transition-colors",
                  isDone
                    ? "border-emerald/30 bg-surface-success/40"
                    : "border-stroke-muted bg-white"
                )}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl",
                    isDone ? "bg-emerald/10" : "bg-pageBgLight"
                  )}
                >
                  {mission.icon}
                </div>

                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm font-bold leading-snug",
                        isDone ? "text-emerald" : "text-foregroundDark"
                      )}
                    >
                      {mission.title}
                    </p>
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-stroke-muted" />
                    )}
                  </div>

                  <p className="text-xs leading-relaxed text-foregroundTertiary">
                    {mission.description}
                  </p>

                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                      <Zap className="h-3 w-3" />+{mission.xpReward} XP
                    </span>

                    {!isDone && (
                      <Link
                        to={mission.actionHref}
                        className="rounded-full bg-primary-dark px-3 py-1 text-xs font-bold text-white transition-opacity hover:opacity-90"
                      >
                        {mission.actionLabel}
                      </Link>
                    )}
                    {isDone && (
                      <span className="rounded-full bg-emerald/15 px-3 py-1 text-xs font-bold text-emerald">
                        Concluído ✓
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* All done state */}
        {completedCount === DAILY_MISSIONS.length && (
          <div className="mt-6 rounded-2xl border border-emerald/30 bg-surface-success/40 p-5 text-center">
            <PartyPopper className="h-8 w-8 text-luxury" />
            <p className="mt-2 text-base font-extrabold text-emerald">
              Todas as missões concluídas!
            </p>
            <p className="mt-1 text-xs text-foregroundTertiary">
              Você ganhou +{TOTAL_DAILY_XP} XP hoje. Volte amanhã para novas missões!
            </p>
          </div>
        )}
      </div>

      <AppBottomNav />
    </div>
  )
}
