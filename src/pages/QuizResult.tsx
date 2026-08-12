import { useLocation, useNavigate } from "react-router-dom"
import { Sparkles, Check, X, Clock, Zap, Flame, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MascotGlow } from "@/components/MascotGlow"
import { useAchievements } from "@/hooks/useAchievements"

const CONFETTI = [
  { color: "#7CC79A", x: "10%", delay: "0s",    dur: "3s",   size: 8,  rotate: 20  },
  { color: "#FFD166", x: "20%", delay: "0.3s",  dur: "3.5s", size: 6,  rotate: -30 },
  { color: "#A8EDCA", x: "35%", delay: "0.1s",  dur: "2.8s", size: 10, rotate: 45  },
  { color: "#3E8E5E", x: "55%", delay: "0.5s",  dur: "3.2s", size: 7,  rotate: -15 },
  { color: "#FFD166", x: "70%", delay: "0.2s",  dur: "3.7s", size: 5,  rotate: 60  },
  { color: "#7CC79A", x: "80%", delay: "0.4s",  dur: "2.6s", size: 9,  rotate: -45 },
  { color: "#E8F9EF", x: "90%", delay: "0.6s",  dur: "3.4s", size: 6,  rotate: 30  },
  { color: "#FFD166", x: "45%", delay: "0.15s", dur: "4s",   size: 8,  rotate: -20 },
  { color: "#3E8E5E", x: "62%", delay: "0.7s",  dur: "2.9s", size: 5,  rotate: 55  },
  { color: "#A8EDCA", x: "15%", delay: "0.45s", dur: "3.1s", size: 7,  rotate: -35 },
]

interface QuizResultState {
  score: number
  total: number
  timeElapsed: number
  xpEarned: number
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

function getPerformanceLabel(score: number, total: number) {
  const pct = total > 0 ? score / total : 0
  if (pct === 1) return "Excelente!"
  if (pct >= 0.7) return "Muito bem!"
  if (pct >= 0.5) return "Bom trabalho!"
  return "Continue praticando!"
}

function CircularScore({ score, total }: { score: number; total: number }) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const fraction = total > 0 ? score / total : 0
  const offset = circumference * (1 - fraction)

  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      <svg width="140" height="140" className="-rotate-90">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#E0F3E9"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#3E8E5E"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-extrabold text-primary-dark">{score}</span>
        <div className="h-px w-8 bg-stroke-muted" />
        <span className="text-lg font-bold text-foregroundMuted">{total}</span>
      </div>
    </div>
  )
}

export default function QuizResult() {
  const navigate = useNavigate()
  const location = useLocation()
  const { data } = useAchievements()

  const state = location.state as QuizResultState | null
  const score = state?.score ?? 0
  const total = state?.total ?? 0
  const timeElapsed = state?.timeElapsed ?? 0
  const xpEarned = state?.xpEarned ?? score * 50

  const isPerfect = score === total && total > 0
  const wrong = total - score
  const performanceLabel = getPerformanceLabel(score, total)

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-white px-5 pb-10 pt-8">
      {CONFETTI.map((c, i) => (
        <span
          key={i}
          className="pointer-events-none absolute top-0"
          style={{
            left: c.x,
            width: c.size,
            height: c.size * 2.2,
            backgroundColor: c.color,
            borderRadius: 2,
            transform: `rotate(${c.rotate}deg)`,
            animation: `confettiFall ${c.dur} ${c.delay} ease-in infinite`,
            opacity: 0,
          }}
        />
      ))}

      <Sparkles className="absolute left-6 top-20 h-5 w-5 animate-twinkle text-emerald/60" style={{ animationDelay: "0.3s" }} />
      <Sparkles className="absolute right-8 top-28 h-4 w-4 animate-twinkle text-[#7CC79A]"    style={{ animationDelay: "1s" }} />
      <Sparkles className="absolute left-10 top-52 h-3 w-3 animate-twinkle text-[#FFD166]"    style={{ animationDelay: "1.7s" }} />
      <Sparkles className="absolute right-6 top-64 h-5 w-5 animate-twinkle text-emerald/50" style={{ animationDelay: "0.6s" }} />

      <div className="mx-auto flex w-full max-w-[380px] flex-col items-center">
        {/* Header */}
        <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-foregroundMuted">
          Resultado da Prova
        </p>
        <h1 className="mb-5 text-4xl font-extrabold text-primary-dark">{performanceLabel}</h1>

        {/* Mascot */}
        <MascotGlow size={160}>
          <img
            src="/assets/mascot-promo.png"
            alt="Mascote comemorando"
            className="h-32 w-auto object-contain drop-shadow-lg"
          />
        </MascotGlow>

        {/* Circular score */}
        <div className="mt-4">
          <CircularScore score={score} total={total} />
        </div>

        {/* XP + Streak badges */}
        <div className="mt-5 flex gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-pageBgLight px-4 py-2 shadow-sm">
            <Zap className="h-4 w-4 text-emerald" />
            <span className="text-sm font-extrabold text-primary-dark">+{xpEarned} xp</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-[#FFF8EC] px-4 py-2 shadow-sm">
            <Flame className="h-4 w-4 text-accent" />
            <span className="text-sm font-extrabold text-[#B87422]">
              Streak +{data.consecutiveDays > 0 ? "1" : "0"} dia
            </span>
          </div>
        </div>

        {/* "Nova skill liberada" banner */}
        {isPerfect && (
          <div className="mt-4 flex w-full items-center gap-2 rounded-2xl border border-[#FFD166] bg-[#FFFBEA] px-4 py-3 shadow-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-[#D4A017]" />
            <p className="text-sm font-semibold text-[#92600A]">
              Nova skill liberada!{" "}
              <span className="font-bold text-emerald">Certificado</span>
            </p>
          </div>
        )}

        {/* Stats row */}
        <div className="mt-5 flex w-full divide-x divide-gradient-mid rounded-2xl border border-stroke-muted bg-white shadow-sm">
          <div className="flex flex-1 flex-col items-center gap-1 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-success">
              <Check className="h-4 w-4 text-primary-dark" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-extrabold text-primary-dark">{score}</span>
            <span className="text-[10px] font-medium text-neutral">certas</span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-1 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
              <X className="h-4 w-4 text-red-600 dark:text-red-400" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-extrabold text-red-600 dark:text-red-400">{wrong}</span>
            <span className="text-[10px] font-medium text-neutral">erradas</span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-1 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pageBgLight">
              <Clock className="h-4 w-4 text-emerald" strokeWidth={2} />
            </div>
            <span className="text-xl font-extrabold text-primary-dark">{formatTime(timeElapsed)}</span>
            <span className="text-[10px] font-medium text-neutral">tempo</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex w-full flex-col gap-3">
          <Button size="lg" className="w-full text-base" onClick={() => navigate("/home")}>
            Continuar
          </Button>
          <button
            onClick={() => navigate("/quiz", { replace: true })}
            className="w-full rounded-2xl border-2 border-stroke-light py-3.5 text-base font-semibold text-primary-dark transition-all hover:bg-surface-soft"
          >
            Refazer prova
          </button>
        </div>
      </div>
    </div>
  )
}
