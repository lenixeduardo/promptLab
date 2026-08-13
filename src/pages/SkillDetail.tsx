import { useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import * as Icons from "@/lib/icons"
import { Button } from "@/components/ui/button"
import { type TrendingSkill } from "@/data/trendingSkillsData"
import { useTrendingSkills } from "@/hooks/useTrendingSkills"
import { useFavorites } from "@/hooks/useFavorites"
import { trackSkillViewed } from "@/lib/analytics"

function SkillIcon({ iconName, className }: { iconName: string; className?: string }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[iconName] || Icons.BookOpen
  return <Icon className={className || "h-6 w-6 text-emerald"} strokeWidth={2} />
}

export default function SkillDetail() {
  const navigate = useNavigate()
  const { skillName } = useParams()
  const location = useLocation()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { skills: allSkills } = useTrendingSkills()

  const stateSkill = (location.state as { skill?: TrendingSkill })?.skill
  const skill: TrendingSkill | null =
    stateSkill ?? allSkills.find((s) => s.name === skillName) ?? null

  useEffect(() => {
    if (skill) {
      trackSkillViewed(skill.name, skill.category)
    }
  }, [skill?.name])

  if (!skill) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6">
        <Icons.Frown className="h-16 w-16 text-foregroundMuted" />
        <h1 className="text-xl font-bold text-foregroundDark">Skill não encontrada</h1>
        <p className="text-sm text-foregroundMuted">
          A skill que você procura não está disponível.
        </p>
        <Button onClick={() => navigate("/lab")}>Voltar para Skills</Button>
      </div>
    )
  }

  const rankedIndex = [...allSkills]
    .sort((a, b) => b.installsCount - a.installsCount)
    .findIndex((s) => s.name === skill.name)
  const rank = rankedIndex + 1
  const total = allSkills.length

  return (
    <div className="min-h-screen bg-white">
      {/* Top gradient bar */}
      <div className="bg-gradient-to-r from-stroke-light to-stroke-muted px-4 pb-12 pt-6">
        <div className="mx-auto w-full max-w-3xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-forest transition-colors hover:text-foregroundDark"
          >
            <Icons.ChevronLeft className="h-5 w-5" />
            Voltar
          </button>

          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md">
              <SkillIcon iconName={skill.icon} className="h-8 w-8 text-emerald" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-foregroundDark">{skill.name}</h1>
                <button
                  onClick={() => toggleFavorite(skill.name)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/70"
                  aria-label={isFavorite(skill.name) ? "Remover dos favoritos" : "Favoritar"}
                >
                  <Icons.Heart
                    className={`h-5 w-5 transition-all ${
                      isFavorite(skill.name) ? "fill-red-500 text-red-500" : "text-[#5A7A68]"
                    }`}
                    strokeWidth={isFavorite(skill.name) ? 2.5 : 2}
                  />
                </button>
              </div>
              <div className="mt-1 flex items-center gap-2.5">
                <span className="rounded-full bg-white/70 px-3 py-0.5 text-xs font-semibold text-[#2E7A4E]">
                  {skill.category}
                </span>
                <span className="text-xs font-medium text-forest">por {skill.author}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-3xl px-4 -mt-6 pb-12">
        <div className="flex flex-col gap-5">
          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-stroke-muted bg-white p-4 text-center shadow-sm">
              <Icons.Download className="mx-auto mb-1 h-5 w-5 text-emerald" />
              <p className="text-lg font-extrabold text-foregroundDark">{skill.installs}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-foregroundMuted">
                Instalações
              </p>
            </div>
            <div className="rounded-2xl border border-stroke-muted bg-white p-4 text-center shadow-sm">
              <Icons.Trophy className="mx-auto mb-1 h-5 w-5 text-emerald" />
              <p className="text-lg font-extrabold text-foregroundDark">
                #{rank}
                <span className="text-sm font-medium text-foregroundMuted">/{total}</span>
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-foregroundMuted">
                Ranking
              </p>
            </div>
            <div className="rounded-2xl border border-stroke-muted bg-white p-4 text-center shadow-sm">
              <Icons.User className="mx-auto mb-1 h-5 w-5 text-emerald" />
              <p className="text-sm font-extrabold text-foregroundDark capitalize">
                {skill.author}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-foregroundMuted">
                Autor
              </p>
            </div>
            <div className="rounded-2xl border border-stroke-muted bg-white p-4 text-center shadow-sm">
              <Icons.Tag className="mx-auto mb-1 h-5 w-5 text-emerald" />
              <p className="text-sm font-extrabold text-foregroundDark line-clamp-1">
                {skill.category}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-foregroundMuted">
                Categoria
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-stroke-muted bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-primary-dark">
              Descrição
            </h2>
            <p className="text-sm leading-relaxed text-foregroundSecondary">{skill.description}</p>
          </div>

          {/* Tags */}
          <div className="rounded-2xl border border-stroke-muted bg-transparent p-5">
            <h2 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-primary-dark">
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {skill.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-stroke-muted bg-transparent px-3 py-1.5 text-xs font-medium text-primary-dark transition-colors hover:bg-surface-success hover:border-emerald"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Install info */}
          <div className="rounded-2xl border border-stroke-muted bg-transparent p-5">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-primary-dark">
              Como instalar
            </h2>
            <p className="text-sm text-foregroundSecondary">
              Esta skill está disponível no{" "}
              <a
                href="https://www.skills.sh/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-link hover:underline"
              >
                skills.sh
              </a>
              , o diretório oficial de skills para agentes de IA. Para instalar em seu agente:
            </p>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-transparent border border-stroke-muted p-3 text-xs font-mono text-primary-dark">
              npx skills add {skill.author}/{skill.name.toLowerCase().replace(/\s+/g, "-")}
            </pre>
            <p className="mt-2 text-xs text-foregroundMuted">
              Compatível com Claude Code, Cursor e outros agentes que suportam o protocolo de
              skills.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex-1 border-stroke-muted text-forest"
            >
              <Icons.ArrowLeft className="h-4 w-4" /> Voltar
            </Button>
            <Button onClick={() => navigate("/lab")} className="flex-1 bg-link hover:bg-[#236b43]">
              <Icons.Grid3x3 className="h-4 w-4" /> Explorar Skills
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
