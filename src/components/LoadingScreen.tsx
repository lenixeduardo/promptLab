import { MessageCircle, Sparkles, Star } from "@/lib/icons"
import { BrandLogo } from "@/components/BrandLogo"
import { cn } from "@/lib/utils"

interface LoadingScreenProps {
  title?: string
  subtitle?: string
  className?: string
}

/**
 * Full-screen loading state shown during route transitions and auth checks:
 * mascot illustration, indeterminate progress bar, dot indicator and wordmark.
 */
export function LoadingScreen({
  title = "Carregando ideias incríveis...",
  subtitle = "Preparando os melhores prompts para você.",
  className,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex h-screen flex-col items-center justify-center gap-6 bg-white px-6 text-center",
        className
      )}
    >
      <div className="relative">
        <img
          src="/assets/mascot-loading.png"
          alt=""
          className="mx-auto h-40 w-auto animate-mascot-float sm:h-48"
        />
        <Sparkles
          className="animate-twinkle absolute -left-2 top-2 h-4 w-4 text-mint"
          style={{ animationDelay: "0s" }}
        />
        <Sparkles
          className="animate-twinkle absolute right-0 top-8 h-3 w-3 text-emerald"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 shrink-0 text-emerald" />
        <p className="text-lg font-bold text-primary-dark sm:text-xl">{title}</p>
        <Sparkles className="h-5 w-5 shrink-0 text-emerald" />
      </div>

      <div className="w-full max-w-xs">
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-primary/15">
          <div className="animate-progress-stripes absolute inset-y-0 left-0 w-3/4 rounded-full bg-[linear-gradient(90deg,theme(colors.forest),theme(colors.emerald))] bg-[length:1rem_1rem] bg-[image:repeating-linear-gradient(45deg,rgba(255,255,255,0.35)_0,rgba(255,255,255,0.35)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.35)_75%,transparent_75%,transparent)]" />
        </div>
        <Star className="mx-auto -mt-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
      </div>

      <p className="text-sm font-medium text-foregroundMuted">{subtitle}</p>

      <div className="flex items-center gap-1.5" role="status" aria-label={title}>
        <span
          className="h-2 w-2 animate-dot-pulse rounded-full bg-primary"
          style={{ animationDelay: "0s" }}
        />
        <span
          className="h-2 w-2 animate-dot-pulse rounded-full bg-primary"
          style={{ animationDelay: "0.2s" }}
        />
        <span
          className="h-2 w-2 animate-dot-pulse rounded-full bg-primary"
          style={{ animationDelay: "0.4s" }}
        />
      </div>

      <div className="mt-2 flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-7 w-7 shrink-0 items-center justify-center">
            <MessageCircle className="absolute inset-0 h-full w-full text-mint" strokeWidth={2} />
            <Sparkles className="relative h-3.5 w-3.5 text-primary-light" />
          </span>
          <BrandLogo className="text-lg" />
        </div>
        <p className="text-xs text-foregroundMuted">Crie. Inspire. Transforme.</p>
      </div>
    </div>
  )
}
