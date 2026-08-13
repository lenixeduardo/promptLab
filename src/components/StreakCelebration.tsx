import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface StreakCelebrationProps {
  active: boolean
  streak: number
  onClose: () => void
}

export function StreakCelebration({ active, streak, onClose }: StreakCelebrationProps) {
  const [show, setShow] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)

  useEffect(() => {
    if (active) {
      setShow(true)
      setVideoEnded(false)
    }
  }, [active])

  useEffect(() => {
    if (!videoEnded) return
    const t = setTimeout(close, 1400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoEnded])

  if (!active && !show) return null

  function close() {
    setShow(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black animate-fade-in"
      onClick={close}
    >
      <button
        onClick={close}
        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        aria-label="Fechar"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="relative flex w-full max-w-lg flex-col items-center">
        <video
          className="w-full"
          src="/assets/animations/streak-fire.mp4"
          autoPlay
          muted
          playsInline
          onEnded={() => setVideoEnded(true)}
        />

        <div
          className={`absolute bottom-6 flex flex-col items-center gap-1 text-center transition-opacity duration-500 ${
            videoEnded ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-xs font-extrabold uppercase tracking-wider text-brand-orange">
            Streak em chamas!
          </p>
          <p className="text-4xl font-extrabold text-white">{streak} dias</p>
        </div>
      </div>
    </div>
  )
}
