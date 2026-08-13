import { Link, useLocation } from "react-router-dom"
import { LayoutGrid, GraduationCap, FlaskConical, Target, Trophy, User } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { key: "home", label: "Início", href: "/home", Icon: LayoutGrid },
  { key: "tracks", label: "Trilha", href: "/learn", Icon: GraduationCap },
  { key: "lab", label: "Laboratório", href: "/lab", Icon: FlaskConical },
  { key: "challenges", label: "Missões", href: "/missions", Icon: Target },
  { key: "achievements", label: "Conquistas", href: "/achievements", Icon: Trophy },
  { key: "profile", label: "Perfil", href: "/profile", Icon: User },
]

/**
 * Desktop sidebar navigation.
 * Only visible on lg+ screens (hidden on mobile, where AppBottomNav takes over).
 */
export function DesktopSidebar() {
  const { pathname } = useLocation()

  return (
    <aside
      className="
        hidden lg:flex
        fixed left-0 top-0 bottom-0 z-40
        w-60 flex-col
        border-r border-stroke-muted bg-card/95 backdrop-blur-md
      "
      aria-label="Navegação principal"
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-stroke-muted">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald text-white font-extrabold text-sm shrink-0">
          PL
        </span>
        <span className="text-base font-extrabold tracking-tight">
          <span className="text-forest">Prompt</span>
          <span className="text-mint">Lab</span>
          <span className="text-forest">z</span>
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {NAV_ITEMS.map(({ key, label, href, Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={key}
              to={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isActive
                  ? "bg-primary/10 text-primary-dark"
                  : "text-foreground-muted hover:bg-surface-soft hover:text-forest"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn("h-5 w-5 shrink-0", isActive ? "text-primary-dark" : "")}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {label}
              {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-dark" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer hint */}
      <div className="border-t border-stroke-muted px-5 py-4">
        <p className="text-[11px] text-foreground-muted leading-relaxed">
          Aprenda prompt engineering de forma interativa e gamificada.
        </p>
      </div>
    </aside>
  )
}
