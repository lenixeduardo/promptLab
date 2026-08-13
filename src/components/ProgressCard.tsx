import { memo } from "react"
import { BarChart2 } from "lucide-react"

interface ProgressCardProps {
  level: number
  currentXP: number
  targetXP: number
}

export const ProgressCard = memo(function ProgressCard({
  level,
  currentXP,
  targetXP,
}: ProgressCardProps) {
  const percent = Math.min((currentXP / targetXP) * 100, 100)

  return (
    <div className="rounded-2xl border-2 border-stroke-light bg-card px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-foregroundDark">Seu progresso</span>
        <BarChart2 className="h-5 w-5 text-emerald" strokeWidth={2} />
      </div>

      <div className="flex items-center gap-4">
        {/* Hexagon badge */}
        <div
          className="relative flex-shrink-0 flex items-center justify-center"
          style={{ width: 52, height: 52 }}
        >
          <div
            className="absolute inset-0 bg-primary-dark"
            style={{
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          />
          <div className="relative z-10 flex flex-col items-center leading-none">
            <span className="text-[9px] font-semibold text-white/80 uppercase tracking-wide">
              Nível
            </span>
            <span className="text-xl font-extrabold text-white">{level}</span>
          </div>
        </div>

        {/* XP + progress bar */}
        <div className="flex-1">
          <p className="text-sm font-semibold text-foregroundDark mb-2">
            {currentXP.toLocaleString("pt-BR")} / {targetXP.toLocaleString("pt-BR")} XP
          </p>
          <div className="h-2.5 rounded-full bg-gradient-mid overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-dark transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
})
