import { Heart } from "lucide-react"
import { useLives } from "@/contexts/useLives"
import { MAX_LIVES } from "@/contexts/lives-config"
import { cn } from "@/lib/utils"

interface LivesBarProps {
  className?: string
  size?: "sm" | "md"
}

export function LivesBar({ className, size = "md" }: LivesBarProps) {
  const { lives } = useLives()
  const dim = size === "sm" ? "h-4 w-4" : "h-5 w-5"

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: MAX_LIVES }).map((_, i) => (
        <Heart
          key={i}
          className={cn(
            dim,
            "transition-all duration-300",
            i < lives ? "fill-red text-red drop-shadow-sm" : "fill-none text-[#D1D5D3]"
          )}
        />
      ))}
    </div>
  )
}
