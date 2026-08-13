import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface MascotGlowProps {
  /** Diameter of the glow circle in px */
  size?: number
  className?: string
  children: React.ReactNode
}

/**
 * Decorative animated halo placed behind the cat mascot: a pulsing radial
 * glow, a rotating conic "shine" sweep, a counter-rotating dashed ring and
 * twinkling sparkles. Honours prefers-reduced-motion (animations disabled).
 */
export function MascotGlow({ size = 260, className, children }: MascotGlowProps) {
  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {/* Pulsing radial glow */}
      <div
        className="animate-glow absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(150,225,182,0.85) 0%, rgba(150,225,182,0.35) 45%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      {/* Rotating conic shine sweep */}
      <div
        className="animate-shine absolute inset-2 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(124,199,154,0.65) 60deg, transparent 150deg, transparent 360deg)",
          filter: "blur(6px)",
        }}
      />

      {/* Counter-rotating dashed ring */}
      <div className="animate-ring absolute inset-1 rounded-full border-2 border-dashed border-[#7CC79A]/70" />

      {/* Twinkling sparkles around the circle */}
      <Sparkles
        className="animate-twinkle absolute right-3 top-6 h-5 w-5 text-emerald"
        style={{ animationDelay: "0s" }}
      />
      <Sparkles
        className="animate-twinkle absolute bottom-7 left-4 h-4 w-4 text-[#7CC79A]"
        style={{ animationDelay: "0.9s" }}
      />
      <Sparkles
        className="animate-twinkle absolute right-8 bottom-4 h-3.5 w-3.5 text-emerald"
        style={{ animationDelay: "1.6s" }}
      />

      {/* Mascot */}
      <div className="relative z-10 flex items-center justify-center">{children}</div>
    </div>
  )
}
