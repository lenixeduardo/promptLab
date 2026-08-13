import { useEffect, useState } from "react"

export function ScoreBurst({
  value,
  label,
  color = "emerald",
  active,
}: {
  value: number
  label: string
  color?: "emerald" | "luxury" | "blue"
  active: boolean
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const [showBurst, setShowBurst] = useState(false)

  useEffect(() => {
    if (active) {
      setShowBurst(true)
      let start = 0
      const end = value
      const duration = 1200
      const startTime = performance.now()

      function animate(now: number) {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        // easeOutQuart
        const eased = 1 - Math.pow(1 - progress, 4)
        start = Math.round(end * eased)
        setDisplayValue(start)
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)

      const timeout = setTimeout(() => setShowBurst(false), 2500)
      return () => clearTimeout(timeout)
    }
  }, [active, value])

  const colorClass =
    color === "luxury" ? "text-luxury" : color === "blue" ? "text-blue-500" : "text-emerald"

  return (
    <div className="relative text-center">
      <p className="text-[10px] font-semibold text-foreground-tertiary">{label}</p>
      <p
        className={`text-base font-extrabold ${colorClass} transition-transform ${
          showBurst ? "animate-score-pop" : ""
        }`}
      >
        +{displayValue}
      </p>
      {showBurst && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="absolute w-12 h-12 rounded-full bg-current opacity-20 animate-ring-expand" />
        </span>
      )}
    </div>
  )
}
