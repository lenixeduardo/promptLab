import { Link } from "react-router-dom"
import { Check, Lock, Sparkles, Trophy } from "lucide-react"

export interface TrailPathModule {
  label: string
  status: "completed" | "current" | "locked"
}

interface TrailPathProps {
  trail: TrailPathModule[]
  trackLabel: string
  completedCount: number
  totalCount: number
  missionsDone: number
  missionsTotal: number
  missionsPct: number
}

const ROW_HEIGHT = 108
const NODE_SIZE = 60
// Gentle left/right sway so the nodes read as a winding map path, like the
// section-overview artwork this widget is based on.
const nodeX = (i: number) => 50 + 24 * Math.sin((i + 0.5) * 1.05)

const DECORATIONS = [
  { left: "12%", top: "6%", size: 6 },
  { left: "82%", top: "16%", size: 5 },
  { left: "78%", top: "46%", size: 6 },
  { left: "10%", top: "58%", size: 5 },
  { left: "86%", top: "78%", size: 6 },
  { left: "16%", top: "92%", size: 5 },
]

export function TrailPath({
  trail,
  trackLabel,
  completedCount,
  totalCount,
  missionsDone,
  missionsTotal,
  missionsPct,
}: TrailPathProps) {
  const points = trail.map((_, i) => ({ x: nodeX(i), y: i * ROW_HEIGHT + ROW_HEIGHT / 2 }))
  const trophyPoint = { x: 50, y: trail.length * ROW_HEIGHT + ROW_HEIGHT / 2 }
  const allPoints = [...points, trophyPoint]
  const pathHeight = allPoints[allPoints.length - 1].y + ROW_HEIGHT / 2

  const pathD = allPoints
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`
      const prev = allPoints[i - 1]
      const midY = (prev.y + p.y) / 2
      return `C ${prev.x} ${midY}, ${p.x} ${midY}, ${p.x} ${p.y}`
    })
    .join(" ")

  const progressFraction =
    trail.length > 1 ? Math.min(completedCount, trail.length - 1) / (allPoints.length - 1) : 0

  return (
    <div className="rounded-2xl border-2 border-stroke-light bg-gradient-to-b from-[#0d1512] to-[#05080a] p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-base font-bold text-white">Sua trilha</h2>
          <p className="text-[11px] text-white/50">Trilha {trackLabel} em andamento</p>
        </div>
        <span className="text-xs font-semibold text-duo-green">
          {completedCount} / {totalCount} módulos
        </span>
      </div>

      <div className="relative" style={{ height: pathHeight }}>
        {DECORATIONS.map((d, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-duo-green/40"
            style={{ left: d.left, top: d.top, width: d.size, height: d.size }}
          />
        ))}

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 100 ${pathHeight}`}
          preserveAspectRatio="none"
        >
          <path
            d={pathD}
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray="0.5 9"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={pathD}
            fill="none"
            stroke="var(--duo-green)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray="0.5 9"
            pathLength={100}
            style={{
              strokeDasharray: 100,
              strokeDashoffset: 100 - progressFraction * 100,
            }}
            vectorEffect="non-scaling-stroke"
            className="transition-all duration-500"
          />
        </svg>

        {trail.map((m, i) => {
          const p = points[i]
          return (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{ left: `${p.x}%`, top: p.y, transform: "translate(-50%, -50%)" }}
            >
              {m.status === "current" && (
                <div
                  className={`absolute top-1/2 flex -translate-y-1/2 flex-col items-center ${
                    p.x < 50 ? "left-full ml-2" : "right-full mr-2"
                  }`}
                >
                  <img
                    src="/assets/mascot-trail-guide.png"
                    alt=""
                    className="h-20 w-20 rounded-full object-cover object-top shadow-lg animate-mascot-float"
                  />
                  <span className="mt-1 whitespace-nowrap rounded-full bg-duo-green px-2.5 py-1 text-[11px] font-bold text-white shadow">
                    Você está aqui!
                  </span>
                </div>
              )}
              <div
                className="relative flex items-center justify-center rounded-full"
                style={{ height: NODE_SIZE, width: NODE_SIZE }}
              >
                {m.status === "current" && (
                  <span className="absolute inset-0 rounded-full bg-duo-green/30 animate-ping-slow" />
                )}
                <div
                  className={`flex h-full w-full items-center justify-center rounded-full ${
                    m.status === "completed"
                      ? "bg-duo-green text-white shadow-[0_5px_0_0_var(--duo-green-press)]"
                      : m.status === "current"
                        ? "bg-white text-duo-green"
                        : "bg-[#2b3138] text-white/40 shadow-[0_5px_0_0_#181c20] ring-2 ring-white/10"
                  }`}
                  style={
                    m.status === "current"
                      ? {
                          boxShadow: "0 5px 0 0 var(--duo-green-press), 0 0 0 4px var(--duo-green)",
                        }
                      : undefined
                  }
                >
                  {m.status === "completed" ? (
                    <Check className="h-6 w-6" strokeWidth={3} />
                  ) : m.status === "current" ? (
                    <Sparkles className="h-6 w-6" strokeWidth={2.5} />
                  ) : (
                    <Lock className="h-5 w-5" />
                  )}
                </div>
              </div>
              <span
                className={`mt-2 w-24 text-center text-[11px] font-semibold leading-tight ${
                  m.status === "locked" ? "text-white/35" : "text-white"
                }`}
              >
                {m.label}
              </span>
            </div>
          )
        })}

        <Link
          to="/missions"
          className="group absolute flex flex-col items-center"
          style={{
            left: `${trophyPoint.x}%`,
            top: trophyPoint.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="relative flex items-center justify-center rounded-full bg-gradient-to-br from-luxury to-amber-500 text-luxury-foreground shadow-[0_5px_0_0_theme(colors.amber.700)] transition-transform group-active:scale-95"
            style={{ height: NODE_SIZE, width: NODE_SIZE }}
          >
            <span className="absolute inset-0 -z-10 scale-150 rounded-full bg-luxury/50 blur-lg" />
            <Trophy className="h-7 w-7" strokeWidth={2.4} />
          </div>
          <p className="mt-2 text-center text-[11px] font-extrabold text-white">Baú de Missões</p>
          <span className="text-[10px] font-bold text-luxury">
            {Math.min(missionsDone, missionsTotal)}/{missionsTotal}
          </span>
          <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-luxury transition-all"
              style={{ width: `${missionsPct}%` }}
            />
          </div>
        </Link>
      </div>
    </div>
  )
}
