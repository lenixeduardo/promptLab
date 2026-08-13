import { useNavigate } from "react-router-dom"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FavoritesEmptyStateProps {
  /** CTA target route */
  ctaTo?: string
  /** CTA label */
  ctaLabel?: string
}

/**
 * Central empty-state shown when the user has no favorites yet.
 * Features a mascot illustration, explanatory text, and a primary CTA.
 */
export function FavoritesEmptyState({
  ctaTo = "/lab",
  ctaLabel = "Explorar conteúdo",
}: FavoritesEmptyStateProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center gap-5 py-12 text-center">
      {/* Mascot illustration */}
      <div className="relative flex items-center justify-center">
        <img
          src="/assets/mascot-teacher.png"
          alt="Mascot ensinando"
          className="h-28 w-auto object-contain opacity-80"
          style={{ mixBlendMode: "multiply" }}
        />
        {/* Floating document icon */}
        <div className="absolute -right-2 top-0 flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-md ring-2 ring-pageBgLight">
          <FileText className="h-5 w-5 text-emerald" strokeWidth={2.2} />
        </div>
      </div>

      <div className="max-w-xs space-y-1">
        <h2 className="text-lg font-extrabold text-foregroundDark">Você ainda não tem favoritos</h2>
        <p className="text-sm leading-relaxed text-foregroundMuted">
          Salve prompts, templates e conteúdos favoritos para acessar rápido depois.
        </p>
      </div>

      <Button size="lg" className="px-8 shadow-md" onClick={() => navigate(ctaTo)}>
        <FileText className="h-5 w-5" />
        {ctaLabel}
      </Button>
    </div>
  )
}
