import { useNavigate } from "react-router-dom"
import * as Icons from "@/lib/icons"
import { ChevronRight } from "lucide-react"
import type { FavoriteSuggestion } from "@/data/favoritesData"

interface FavoriteSuggestionItemProps {
  suggestion: FavoriteSuggestion
}

/**
 * Single clickable row in the "Dicas para você" section.
 * Renders an icon, title + description, and a trailing chevron.
 */
export function FavoriteSuggestionItem({ suggestion }: FavoriteSuggestionItemProps) {
  const navigate = useNavigate()

  const IconComp = (
    Icons as unknown as Record<
      string,
      React.ComponentType<{ className?: string; strokeWidth?: number }>
    >
  )[suggestion.icon]

  return (
    <button
      onClick={() => navigate(suggestion.to)}
      className="flex w-full items-center gap-3 rounded-2xl border border-stroke-muted bg-white px-4 py-3.5 text-left shadow-sm transition-all hover:bg-surface-soft active:scale-[0.99]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pageBgLight">
        {IconComp ? (
          <IconComp className="h-5 w-5 text-emerald" strokeWidth={2} />
        ) : (
          <Icons.BookOpen className="h-5 w-5 text-emerald" strokeWidth={2} />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foregroundDark">{suggestion.title}</p>
        <p className="text-xs text-foregroundTertiary">{suggestion.description}</p>
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-foregroundMuted" strokeWidth={2} />
    </button>
  )
}
