import * as Icons from "@/lib/icons"
import { cn } from "@/lib/utils"
import type { PremiumFeature } from "@/data/premiumData"

interface PremiumBenefitCardProps {
  feature: PremiumFeature
  variant?: "card" | "row"
}

/**
 * A single benefit/feature item in the premium feature list.
 * Renders an icon, title, and optional description.
 * "card" is a standalone bordered tile; "row" is a divider-separated list row.
 */
export function PremiumBenefitCard({ feature, variant = "card" }: PremiumBenefitCardProps) {
  const IconComp = (
    Icons as unknown as Record<
      string,
      React.ComponentType<{ className?: string; strokeWidth?: number }>
    >
  )[feature.icon]

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        variant === "card"
          ? "rounded-2xl border border-pageBgLight bg-white px-4 py-3.5 shadow-sm"
          : "py-3.5 first:pt-0 last:pb-0"
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center bg-surface-success",
          variant === "card" ? "rounded-xl" : "rounded-full"
        )}
      >
        {IconComp ? (
          <IconComp className="h-5 w-5 text-emerald" strokeWidth={2} />
        ) : (
          <Icons.Sparkles className="h-5 w-5 text-emerald" strokeWidth={2} />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foregroundDark">{feature.title}</p>
        {feature.description && (
          <p className="text-xs text-foregroundTertiary">{feature.description}</p>
        )}
      </div>
    </div>
  )
}
