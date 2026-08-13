import { Link, useLocation } from "react-router-dom"
import * as Icons from "@/lib/icons"
import { cn } from "@/lib/utils"
import { BrandLogo } from "@/components/BrandLogo"
import { BOTTOM_NAV_ITEMS } from "@/components/AppBottomNav"

/**
 * Desktop sidebar navigation — visible on lg+ screens.
 * Mirrors the same items as AppBottomNav.
 */
export function AppDesktopSidebar() {
  const { pathname } = useLocation()

  const getIcon = (iconName: string) => {
    const IconComp = (
      Icons as unknown as Record<
        string,
        React.ComponentType<{ className?: string; strokeWidth?: number }>
      >
    )[iconName]
    return IconComp
  }

  return (
    <aside className="hidden lg:flex flex-col w-56 xl:w-64 shrink-0 min-h-screen bg-card border-r border-stroke-muted sticky top-0 self-start">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-stroke-muted">
        <BrandLogo className="text-xl" />
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1" aria-label="Navegação principal">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const IconComp = getIcon(item.icon)

          return (
            <Link
              key={item.key}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:outline-none",
                isActive
                  ? "bg-primary/10 text-primary-dark"
                  : "text-foreground-muted hover:bg-surface-soft hover:text-forest"
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <IconComp
                className={cn("h-5 w-5 shrink-0", isActive ? "fill-primary-dark/10" : "")}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span>{item.label}</span>
              {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-dark" />}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
