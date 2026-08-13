import { useLocation, useNavigate } from "react-router-dom"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LivesBar } from "@/components/LivesBar"

interface ResultState {
  score?: number
  total?: number
  perfect?: boolean
  bonusAwarded?: boolean
}

const CONFETTI = [
  { color: "#7CC79A", x: "10%", delay: "0s", dur: "3s", size: 8, rotate: 20 },
  { color: "#FFD166", x: "20%", delay: "0.3s", dur: "3.5s", size: 6, rotate: -30 },
  { color: "#A8EDCA", x: "35%", delay: "0.1s", dur: "2.8s", size: 10, rotate: 45 },
  { color: "#3E8E5E", x: "55%", delay: "0.5s", dur: "3.2s", size: 7, rotate: -15 },
  { color: "#FFD166", x: "70%", delay: "0.2s", dur: "3.7s", size: 5, rotate: 60 },
  { color: "#7CC79A", x: "80%", delay: "0.4s", dur: "2.6s", size: 9, rotate: -45 },
  { color: "#E8F9EF", x: "90%", delay: "0.6s", dur: "3.4s", size: 6, rotate: 30 },
  { color: "#FFD166", x: "45%", delay: "0.15s", dur: "4s", size: 8, rotate: -20 },
  { color: "#3E8E5E", x: "62%", delay: "0.7s", dur: "2.9s", size: 5, rotate: 55 },
  { color: "#A8EDCA", x: "15%", delay: "0.45s", dur: "3.1s", size: 7, rotate: -35 },
]

export default function MissionComplete() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as ResultState | null

  const score = state?.score ?? 0
  const total = state?.total ?? 0
  const perfect = state?.perfect ?? false
  const bonusAwarded = state?.bonusAwarded ?? false

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-white px-6 py-10">
      {CONFETTI.map((confetti, index) => (
        <span
          key={index}
          className="pointer-events-none absolute top-0"
          style={{
            left: confetti.x,
            width: confetti.size,
            height: confetti.size * 2.2,
            backgroundColor: confetti.color,
            borderRadius: 2,
            transform: `rotate(${confetti.rotate}deg)`,
            animation: `confettiFall ${confetti.dur} ${confetti.delay} ease-in infinite`,
            opacity: 0,
          }}
        />
      ))}

      <Sparkles
        className="absolute left-6 top-24 h-5 w-5 animate-twinkle text-emerald/60"
        style={{ animationDelay: "0.3s" }}
      />
      <Sparkles
        className="absolute right-8 top-32 h-4 w-4 animate-twinkle text-[#7CC79A]"
        style={{ animationDelay: "1s" }}
      />
      <Sparkles
        className="absolute left-12 top-60 h-3 w-3 animate-twinkle text-[#FFD166]"
        style={{ animationDelay: "1.7s" }}
      />
      <Sparkles
        className="absolute right-6 top-72 h-5 w-5 animate-twinkle text-emerald/50"
        style={{ animationDelay: "0.6s" }}
      />

      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <h1 className="text-5xl font-extrabold leading-tight text-forest">
          Missao
          <br />
          Cumprida!
        </h1>

        <div
          className="relative flex items-center justify-center"
          style={{ width: 280, height: 280 }}
        >
          <div
            className="animate-glow absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(124,199,154,0.9) 0%, rgba(124,199,154,0.4) 45%, transparent 70%)",
              filter: "blur(14px)",
            }}
          />
          <div
            className="animate-shine absolute inset-3 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(124,199,154,0.7) 60deg, transparent 150deg)",
              filter: "blur(8px)",
            }}
          />
          <div className="animate-ring absolute inset-1 rounded-full border-2 border-dashed border-[#7CC79A]/70" />
          <div className="animate-spin-slow absolute inset-6 rounded-full border border-[#B8E8CA]/80" />

          <Sparkles
            className="absolute right-4 top-6 h-5 w-5 animate-twinkle text-[#FFD166]"
            style={{ animationDelay: "0s" }}
          />
          <Sparkles
            className="absolute bottom-8 left-3 h-4 w-4 animate-twinkle text-[#7CC79A]"
            style={{ animationDelay: "0.9s" }}
          />
          <Sparkles
            className="absolute bottom-5 right-8 h-3 w-3 animate-twinkle text-emerald"
            style={{ animationDelay: "1.6s" }}
          />
          <Sparkles
            className="absolute left-6 top-10 h-4 w-4 animate-twinkle text-[#FFD166]"
            style={{ animationDelay: "0.5s" }}
          />

          <img
            src="/assets/mascot-login-new.png"
            alt="PromptLabz mascot celebrating"
            className="relative z-10 h-52 w-auto object-contain drop-shadow-lg"
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl font-extrabold tracking-tight">
            <span className="text-forest">Prompt</span>
            <span className="text-[#7CC79A]">Lab</span>
          </span>

          {total > 0 && (
            <div className="mt-1 flex items-center gap-2 rounded-full bg-pageBgLight px-4 py-1.5">
              <span className="text-2xl font-extrabold text-forest">
                {score}/{total}
              </span>
              <span className="text-sm font-medium text-emerald">respostas certas</span>
            </div>
          )}

          <p className="max-w-xs text-lg text-[#4A6155]">
            {perfect ? "Perfeito! 100% de acerto!" : "Voce completou mais uma aula!"}
            <br />
            Continue assim.
          </p>
        </div>
      </div>

      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        <Button size="lg" className="w-full text-lg" onClick={() => navigate("/learn")}>
          Continuar
        </Button>

        <div className="flex flex-col items-center gap-2">
          <LivesBar />

          {bonusAwarded ? (
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
                <polygon
                  points="12,2 22,9 12,22 2,9"
                  fill="#4ADE80"
                  stroke="#2E7A4E"
                  strokeWidth="1.5"
                />
                <polygon points="12,2 22,9 12,13 2,9" fill="#86EFAC" />
              </svg>
              <span className="text-xl font-bold text-forest">+1 Vida</span>
            </div>
          ) : perfect ? (
            <p className="text-xs text-neutral">Bonus diario ja resgatado hoje</p>
          ) : (
            <p className="text-xs text-neutral">Acerte 100% para ganhar +1 vida</p>
          )}
        </div>
      </div>
    </div>
  )
}
