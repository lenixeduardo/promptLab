import { Flame, HeartCrack } from "lucide-react"

interface StreakWidgetProps {
  streak: number
  longestStreak: number
  loading?: boolean
  streakBroken?: boolean
}

export function StreakWidget({ streak, longestStreak, loading = false, streakBroken = false }: StreakWidgetProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border-2 border-stroke-light bg-surface-soft px-4 py-3 animate-pulse">
        <div className="h-4 w-32 rounded bg-stroke-light" />
        <div className="mt-1 h-3 w-24 rounded bg-stroke-light" />
      </div>
    )
  }

  if (streakBroken) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border-2 border-orange-200 bg-orange-50 px-4 py-3 dark:border-orange-800 dark:bg-orange-950/40">
        <HeartCrack className="h-6 w-6 text-orange-400 dark:text-orange-300" />
        <div>
          <p className="text-sm font-bold text-orange-800 dark:text-orange-300">Streak zerado — recomeça hoje!</p>
          {longestStreak > 0 && (
            <p className="text-xs text-[#A0714A] dark:text-orange-300">Seu recorde foi de {longestStreak} {longestStreak === 1 ? "dia" : "dias"}</p>
          )}
        </div>
      </div>
    )
  }

  if (streak === 0) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border-2 border-stroke-light bg-surface-soft px-4 py-3">
        <Flame className="h-6 w-6 text-emerald" strokeWidth={2.5} />
        <p className="text-sm font-semibold text-primary-dark">Comece hoje e inicie seu streak!</p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border-2 border-stroke-light bg-surface-soft px-4 py-3">
      <Flame className="h-7 w-7 shrink-0 text-orange-500" strokeWidth={2.5} />
      <div>
        <p className="text-sm font-bold text-foregroundDark">
          {streak} {streak === 1 ? "dia seguido" : "dias seguidos"}
        </p>
        {longestStreak > streak && (
          <p className="text-xs text-foregroundTertiary">Recorde: {longestStreak} dias</p>
        )}
      </div>
    </div>
  )
}
