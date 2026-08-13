import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface AppPageHeaderProps {
  title: string
  subtitle?: string
  /** Pass a path to use a <Link> back button, or omit to use navigate(-1) */
  back?: string
  /** Override navigate(-1) with a custom callback (only used when back is not set) */
  onBack?: () => void
  /** Right-side slot */
  right?: ReactNode
  /** @deprecated use right */
  rightSlot?: ReactNode
  className?: string
}

export function AppPageHeader({
  title,
  subtitle,
  back,
  onBack,
  right,
  rightSlot,
  className,
}: AppPageHeaderProps) {
  const navigate = useNavigate()
  const rightContent = right ?? rightSlot

  const backBtn = back ? (
    <Link
      to={back}
      className="rounded-full p-1.5 text-forest transition-colors hover:bg-surface-success focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label="Voltar"
    >
      <ArrowLeft className="h-5 w-5" />
    </Link>
  ) : (
    <button
      onClick={onBack ?? (() => navigate(-1))}
      className="rounded-full p-1.5 text-forest transition-colors hover:bg-surface-success focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label="Voltar"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  )

  return (
    <div
      className={cn(
        "sticky top-0 z-10 border-b border-stroke-muted bg-card px-4 lg:px-8 py-3",
        className
      )}
    >
      <div className="flex items-center gap-3 lg:max-w-5xl lg:mx-auto">
        {backBtn}
        <div className="flex-1">
          <h1 className="text-lg font-bold text-primary-dark">{title}</h1>
          {subtitle && <p className="text-xs text-foreground-tertiary">{subtitle}</p>}
        </div>
        {rightContent}
      </div>
    </div>
  )
}
