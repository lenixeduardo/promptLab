import * as Icons from "@/lib/icons"
import { cn } from "@/lib/utils"
import type { PremiumPlan } from "@/data/premiumData"

interface PremiumPlanCardProps {
  plan: PremiumPlan
  selected: boolean
  onSelect: () => void
}

/**
 * Pricing plan card with radio-style selection.
 * Highlights the selected plan with a green border + ring.
 * Shows an optional "Mais escolhido" badge for the yearly plan.
 */
export function PremiumPlanCard({ plan, selected, onSelect }: PremiumPlanCardProps) {
  const IconComp = (
    Icons as unknown as Record<
      string,
      React.ComponentType<{ className?: string; strokeWidth?: number }>
    >
  )[plan.icon]

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "relative w-full rounded-2xl border bg-white px-5 py-4 text-left shadow-sm transition-all",
        selected
          ? "border-emerald ring-2 ring-emerald/20"
          : "border-stroke-muted hover:border-foregroundMuted"
      )}
    >
      {/* Badge */}
      {plan.badge && (
        <span className="absolute -top-2.5 right-4 rounded-full bg-emerald px-3 py-0.5 text-[10px] font-bold text-white shadow-sm">
          {plan.badge}
        </span>
      )}

      <div className="flex items-start gap-3">
        {/* Icon circle */}
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-success">
          {IconComp ? (
            <IconComp className="h-5 w-5 text-emerald" strokeWidth={2} />
          ) : (
            <Icons.Star className="h-5 w-5 text-emerald" strokeWidth={2} />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <p className="text-sm font-bold text-foregroundDark">{plan.title}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-foregroundDark">
                  {plan.monthlyPrice}
                </span>
                <span className="text-xs font-medium text-foregroundTertiary">/mês</span>
              </div>
              {plan.oldPrice && (
                <p className="text-xs text-foregroundMuted line-through">{plan.oldPrice}/mês</p>
              )}
            </div>

            {/* Radio ring + dot */}
            <span
              className={cn(
                "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                selected ? "border-emerald" : "border-stroke-light"
              )}
            >
              {selected && <span className="h-2.5 w-2.5 rounded-full bg-emerald" />}
            </span>
          </div>

          <p className="mt-2 text-[11px] font-semibold text-emerald">
            {plan.description} {plan.fullPrice}
          </p>
        </div>
      </div>
    </button>
  )
}
