import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useAchievements } from "@/hooks/useAchievements"
import { MascotGlow } from "@/components/MascotGlow"
import { cn } from "@/lib/utils"
import * as Icons from "@/lib/icons"
import { getProgressCount } from "@/lib/achievements"

export default function Achievements() {
  const navigate = useNavigate()
  const { allAchievements, unlocked, data } = useAchievements()

  const progressPct = useMemo(
    () => Math.round((data.totalLessonsCompleted / 50) * 100),
    [data.totalLessonsCompleted]
  )

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <div className="mx-auto w-full max-w-lg lg:max-w-4xl">
        {/* Header com Mascote */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <button
            onClick={() => navigate("/home")}
            className="rounded-full p-1.5 text-forest transition-colors hover:bg-surface-success"
            aria-label="Voltar para home"
          >
            <Icons.ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex flex-1 flex-col items-center">
            <MascotGlow size={140}>
              <img
                src="/assets/mascot-promo.png"
                alt="Mascote comemorando conquistas"
                className="h-24 w-24 object-contain drop-shadow-md"
              />
            </MascotGlow>
            <div className="mt-2 text-center">
              <p className="text-xs font-medium text-foregroundMuted">Parabéns!</p>
              <h1 className="text-2xl font-extrabold text-foregroundDark">Conquistas</h1>
              <p className="mt-1 text-sm font-semibold text-emerald">
                {unlocked.length} de {allAchievements.length}
              </p>
            </div>
          </div>

          <div className="w-12" />
        </div>

        {/* Stats overview */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { value: data.totalLessonsCompleted, label: "Lições" },
            { value: data.perfectCount, label: "100%" },
            { value: data.consecutiveDays, label: "Dias" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-stroke-muted bg-white p-3 text-center shadow-sm"
            >
              <p className="text-2xl font-extrabold text-primary-dark">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-foregroundMuted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Progress to 50 lessons */}
        <div className="mb-6 rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-dark">
              Progresso Total
            </span>
            <span className="text-xs font-semibold text-foregroundMuted">
              {data.totalLessonsCompleted} / 50 lições
            </span>
          </div>
          <div
            className="h-2.5 w-full overflow-hidden rounded-full bg-pageBgLight"
            role="progressbar"
            aria-valuenow={Math.min(progressPct, 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso de lições completadas"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald to-emerald transition-all duration-500"
              style={{ width: `${Math.min(progressPct, 100)}%` }}
            />
          </div>
        </div>

        {/* Achievement cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pb-6">
          {allAchievements.map((ach, idx) => {
            const isUnlocked = unlocked.includes(ach.id)
            const IconComp = Icons[ach.icon as keyof typeof Icons] as
              React.ComponentType<{ className?: string }> | undefined
            const progress = getProgressCount(ach.id, data)

            return (
              <article
                key={ach.id}
                className={cn(
                  "animate-rank-entry flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm transition-all duration-300",
                  isUnlocked
                    ? "border-stroke-muted scale-100"
                    : "border-pageBgLight opacity-65 scale-98"
                )}
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                {/* Icon Circle */}
                <div
                  className={cn(
                    "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                    isUnlocked
                      ? "animate-achievement-unlock bg-gradient-to-br from-emerald to-emerald shadow-md"
                      : "bg-gradient-to-br from-[#E8EEE9] to-[#DCEAE3]"
                  )}
                  style={isUnlocked ? { animationDelay: `${idx * 0.06 + 0.15}s` } : undefined}
                  aria-hidden="true"
                >
                  {isUnlocked ? (
                    <>
                      {IconComp && (
                        <IconComp className="h-6 w-6 text-white transition-transform duration-300" />
                      )}
                      <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md">
                        <Icons.Check className="h-3 w-3 text-emerald" />
                      </div>
                    </>
                  ) : (
                    <Icons.Lock className="h-5 w-5 text-neutral" />
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h2
                    className={cn(
                      "text-sm font-bold leading-snug",
                      isUnlocked ? "text-foregroundDark" : "text-foregroundTertiary"
                    )}
                  >
                    {ach.title}
                  </h2>
                  <p className="text-xs text-foregroundTertiary">{ach.description}</p>
                  {progress && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div
                        className="h-1.5 flex-1 overflow-hidden rounded-full bg-pageBgLight"
                        role="progressbar"
                        aria-valuenow={progress.current}
                        aria-valuemin={0}
                        aria-valuemax={progress.max}
                        aria-label={`Progresso: ${progress.current} de ${progress.max}`}
                      >
                        <div
                          className="h-full bg-gradient-to-r from-emerald to-emerald transition-all duration-500"
                          style={{ width: `${(progress.current / progress.max) * 100}%` }}
                        />
                      </div>
                      <span className="whitespace-nowrap text-xs font-semibold text-emerald">
                        {progress.current}/{progress.max}
                      </span>
                    </div>
                  )}
                </div>

                {/* Badge */}
                <div
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors duration-300",
                    isUnlocked
                      ? "bg-surface-success text-primary-dark"
                      : "bg-[#EEF1EF] text-foregroundPlaceholder"
                  )}
                >
                  {isUnlocked ? "✔" : ach.category}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
