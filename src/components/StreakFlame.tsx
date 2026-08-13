import { memo } from "react"
import { Flame } from "lucide-react"

export const StreakFlame = memo(function StreakFlame({ streak }: { streak: number }) {
  const isHighStreak = streak >= 7
  const isRecord = streak >= 12

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <div
        className={`relative ${isHighStreak ? "animate-flame-flicker will-change-transform" : ""}`}
      >
        <Flame
          className={`h-6 w-6 ${
            isRecord
              ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
              : isHighStreak
                ? "text-orange-500 drop-shadow-[0_0_6px_rgba(249,115,22,0.5)]"
                : "text-orange-500"
          }`}
          strokeWidth={2.5}
        />
        {isHighStreak && (
          <>
            <span className="absolute -inset-1 rounded-full bg-orange-500/20 animate-ping-slow will-change-transform" />
            <span className="absolute -inset-2 rounded-full bg-amber-400/10 animate-ping-slower will-change-transform" />
          </>
        )}
      </div>
      <span className="text-xl font-extrabold text-foreground-dark">{streak} dias</span>
      {isRecord && (
        <span className="absolute -top-1 -right-6 text-[9px] font-extrabold text-amber-500 animate-bounce-slow">
          RECORDE!
        </span>
      )}
    </div>
  )
})
