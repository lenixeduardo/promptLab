// ═══════════════════════════════════════════════════════════════════════════
// Shared Skill Components — used by both Skills page & SkillsSection (LearningLab)
// ═══════════════════════════════════════════════════════════════════════════

import { memo, type ReactNode } from "react"
import * as Icons from "@/lib/icons"
import { type TrendingSkill, type SkillCategory } from "@/data/trendingSkillsData"

// ─── Category definitions ────────────────────────────────────────────────

export const SKILL_CATEGORIES: { label: SkillCategory; icon: ReactNode }[] = [
  { label: "Desenvolvimento", icon: <Icons.Code2 className="h-4 w-4" /> },
  { label: "Design & UI", icon: <Icons.Palette className="h-4 w-4" /> },
  { label: "IA & Media", icon: <Icons.Image className="h-4 w-4" /> },
  { label: "Cloud & Infra", icon: <Icons.Server className="h-4 w-4" /> },
  { label: "Marketing", icon: <Icons.TrendingUp className="h-4 w-4" /> },
  { label: "Produtividade", icon: <Icons.ClipboardList className="h-4 w-4" /> },
  { label: "Agentes & Workflows", icon: <Icons.GitBranch className="h-4 w-4" /> },
]

// ─── Skill Icon ──────────────────────────────────────────────────────────

export function SkillIcon({ iconName, className }: { iconName: string; className?: string }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[iconName] || Icons.BookOpen
  return <Icon className={className || "h-5 w-5 text-emerald"} strokeWidth={2} />
}

// ─── Count Badge ─────────────────────────────────────────────────────────

export function CountBadge({ count }: { count: number }) {
  return (
    <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white/30 px-1 text-[10px] font-bold leading-none">
      {count}
    </span>
  )
}

// ─── Skill Card ──────────────────────────────────────────────────────────

export const SkillCard = memo(function SkillCard({
  skill,
  isFav,
  onToggleFav,
  onClick,
}: {
  skill: TrendingSkill
  isFav: boolean
  onToggleFav: () => void
  onClick: () => void
}) {
  return (
    <div className="group relative flex flex-col gap-2 rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md active:scale-95">
      {/* Favorite heart button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleFav()
        }}
        className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-red-100"
        aria-label={isFav ? "Remover dos favoritos" : "Favoritar"}
      >
        <Icons.Heart
          className={`h-4 w-4 transition-all ${
            isFav ? "fill-red-500 text-red-500" : "text-stroke-light group-hover:text-red-300"
          }`}
          strokeWidth={isFav ? 2.5 : 2}
        />
      </button>

      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onClick()
          }
        }}
        className="flex flex-col gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald rounded-lg"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pageBgLight">
            <SkillIcon iconName={skill.icon} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold leading-tight text-foregroundDark line-clamp-2">
              {skill.name}
            </p>
            <p className="text-[11px] font-medium text-foregroundMuted">por {skill.author}</p>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-foregroundSecondary line-clamp-2">
          {skill.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {skill.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#F4F9F5] px-2 py-0.5 text-[10px] font-medium text-primary-dark"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="flex items-center gap-0.5 text-[11px] font-semibold text-foregroundMuted">
            <Icons.Download className="h-3 w-3" />
            {skill.installs}
          </span>
        </div>
      </div>
    </div>
  )
})

// ─── Grid View ───────────────────────────────────────────────────────────

export const SkillsGridView = memo(function SkillsGridView({
  skills,
  favorites,
  onToggleFav,
  onSkillClick,
}: {
  skills: TrendingSkill[]
  favorites: string[]
  onToggleFav: (name: string) => void
  onSkillClick: (s: TrendingSkill) => void
}) {
  if (skills.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center gap-3 py-16 text-foregroundMuted">
        <Icons.Search className="h-16 w-16 text-stroke-muted" />
        <p className="text-base font-semibold">Nenhuma skill encontrada</p>
        <p className="text-sm opacity-70">Tente ajustar o filtro ou a busca.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {skills.map((skill) => (
        <SkillCard
          key={skill.name}
          skill={skill}
          isFav={favorites.includes(skill.name)}
          onToggleFav={() => onToggleFav(skill.name)}
          onClick={() => onSkillClick(skill)}
        />
      ))}
    </div>
  )
})
