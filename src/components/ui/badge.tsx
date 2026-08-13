import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  /* Duolingo badge: radius 2px (hairline corner), duolingo-sans bold 13px */
  "inline-flex items-center rounded-[2px] border px-2.5 py-0.5 text-[13px] font-bold leading-[16px] tracking-[0.3px] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#58cc02] text-white shadow hover:bg-[#58cc02]/80",
        secondary:
          "border-transparent bg-[#d7ffb8] text-[#3c3c3c] dark:bg-[#58cc02]/20 dark:text-[#a5ed6e] hover:bg-[#d7ffb8]/80 dark:hover:bg-[#58cc02]/30",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "border-[#e5e5e5] dark:border-[#3a3a3a] text-[#4b4b4b] dark:text-foreground",
        sky: "border-transparent bg-[#1cb0f6]/15 text-[#1cb0f6]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
