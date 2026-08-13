import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface TrailCompleteCelebrationProps {
  active: boolean
  trackLabel: string
  onClose: () => void
}

export function TrailCompleteCelebration({
  active,
  trackLabel,
  onClose,
}: TrailCompleteCelebrationProps) {
  const [show, setShow] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)

  useEffect(() => {
    if (active) {
      setShow(true)
      setVideoEnded(false)
    }
  }, [active])

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
          src="/assets/animations/trail-complete.mp4"
          autoPlay
          muted
          playsInline
          onEnded={() => setVideoEnded(true)}
        />

        <div
          className={`absolute bottom-6 flex flex-col items-center gap-3 text-center transition-opacity duration-500 ${
            videoEnded ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-sm font-semibold text-white/80">Trilha {trackLabel} finalizada!</p>
          <button
            onClick={close}
            className="rounded-2xl bg-emerald px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-lg shadow-emerald/30 transition-transform active:scale-[0.98]"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}
