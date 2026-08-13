import { Link, useLocation } from "react-router-dom"
import * as Icons from "@/lib/icons"
import { cn } from "@/lib/utils"

export type NavTab = "home" | "trilha" | "lab" | "ranking" | "perfil"

const NAV_ITEMS = [
  { key: "home" as const, label: "Início", icon: Icons.Home, path: "/home" },
  { key: "trilha" as const, label: "Trilha", icon: Icons.Scissors, path: "/learn" },
  { key: "lab" as const, label: "Laboratório", icon: Icons.FlaskConical, path: "/lab" },
  { key: "ranking" as const, label: "Ranking", icon: Icons.Trophy, path: "/ranking" },
  { key: "perfil" as const, label: "Perfil", icon: Icons.UserCircle, path: "/profile" },
]

export function BottomNav({ active }: { active: NavTab }) {
  const { pathname } = useLocation()
  const resolvedActive = active ?? NAV_ITEMS.find((item) => pathname === item.path)?.key

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-page-bg-light bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden">
      <div className="mx-auto flex max-w-[460px] items-center justify-around px-1 pb-5 pt-2">
        {NAV_ITEMS.map(({ key, label, icon: Icon, path }) => (
          <Link
            key={key}
            to={path}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1 transition-colors",
              resolvedActive === key ? "text-primary-dark" : "text-neutral hover:text-emerald"
            )}
            aria-label={label}
            aria-current={resolvedActive === key ? "page" : undefined}
          >
            <Icon className="h-6 w-6" strokeWidth={resolvedActive === key ? 2.5 : 1.8} />
            <span
              className={cn("text-[10px]", resolvedActive === key ? "font-bold" : "font-medium")}
            >
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
