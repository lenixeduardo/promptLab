import { memo } from "react"

interface DailyTipCardProps {
  tip: string
}

export const DailyTipCard = memo(function DailyTipCard({ tip }: DailyTipCardProps) {
  return (
    <section
      aria-labelledby="daily-tip-title"
      className="relative overflow-hidden rounded-2xl border-2 border-emerald/25 bg-gradient-to-br from-page-bg-light to-card px-3 py-3 shadow-sm"
    >
      <div
        className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-emerald/10 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative rounded-2xl bg-card px-3.5 py-3 shadow-sm ring-1 ring-stroke-light">
        <h2
          id="daily-tip-title"
          className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-dark"
        >
          Dica do dia
        </h2>
        <p className="mt-1 text-sm font-semibold leading-snug text-foreground-dark">{tip}</p>
      </div>
    </section>
  )
})
