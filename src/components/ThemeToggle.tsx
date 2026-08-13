import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/ThemeProvider"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      className={cn(
        "relative flex h-8 w-14 items-center rounded-full border border-border bg-muted transition-colors duration-300",
        !isDark ? "bg-emerald/20 border-emerald/30" : "",
        className
      )}
    >
      <span
        className={cn(
          "absolute flex h-6 w-6 items-center justify-center rounded-full bg-card shadow-md transition-all duration-300",
          isDark ? "left-1" : "left-7"
        )}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-foreground" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-amber-500" />
        )}
      </span>
    </button>
  )
}
