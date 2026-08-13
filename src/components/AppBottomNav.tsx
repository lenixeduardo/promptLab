import { memo, useMemo } from "react"
import { Link, useLocation } from "react-router-dom"
import * as Icons from "@/lib/icons"
import { cn } from "@/lib/utils"

export interface BottomNavItem {
  key: string
  label: string
  href: string
  icon: string // lucide-react icon name
}

export const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { key: "home", label: "Início", href: "/home", icon: "LayoutGrid" },
  { key: "tracks", label: "Trilha", href: "/learn", icon: "GraduationCap" },
  { key: "lab", label: "Laboratório", href: "/lab", icon: "FlaskConical" },
  { key: "challenges", label: "Missões", href: "/missions", icon: "Target" },
  { key: "achievements", label: "Conquistas", href: "/achievements", icon: "Trophy" },
  { key: "profile", label: "Perfil", href: "/profile", icon: "User" },
]

interface AppBottomNavProps {
  /** Optional custom items; defaults to BOTTOM_NAV_ITEMS */
  items?: BottomNavItem[]
}

/**
 * Mobile bottom navigation bar.
 * Shows 6 items with icons and labels. The active route is highlighted.
 */
export const AppBottomNav = memo(function AppBottomNav({
  items = BOTTOM_NAV_ITEMS,
}: AppBottomNavProps) {
  const { pathname } = useLocation()

  // Resolve icon components once per render (only changes when items changes)
  const resolvedItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        IconComp: (
          Icons as unknown as Record<
            string,
            React.ComponentType<{ className?: string; strokeWidth?: number }>
          >
        )[item.icon],
      })),
    [items]
  )

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-stroke-muted bg-card/95 backdrop-blur-md lg:hidden"
      aria-label="Navegação principal"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
        {resolvedItems.map((item) => {
          const isActive = pathname === item.href
          const IconComp = item.IconComp

          return (
            <Link
              key={item.key}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:outline-none",
                isActive ? "text-primary-dark" : "text-foreground-muted hover:text-forest"
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <IconComp
                className={cn("h-6 w-6", isActive ? "fill-primary-dark/10" : "")}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  "text-[10px] font-semibold leading-none",
                  isActive && "font-extrabold"
                )}
              >
                {item.label}
              </span>
              {isActive && <span className="mt-0.5 h-1 w-1 rounded-full bg-primary-dark" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
})
