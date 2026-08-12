import { useState } from "react"
import { BookOpen, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { EssayActivity } from "@/lib/lessonContent"

interface EssayCardProps {
  activity: EssayActivity
  answered: boolean
  onAnswer: (text: string) => void
}

export function EssayCard({ activity, answered, onAnswer }: EssayCardProps) {
  const [text, setText] = useState("")

  return (
    <div className="flex flex-col gap-4">
      <textarea
        rows={4}
        disabled={answered}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={activity.placeholder ?? "Escreva sua resposta aqui..."}
        className={cn(
          "w-full resize-none rounded-2xl border-2 bg-card px-4 py-3 text-sm text-foreground-dark transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400",
          answered
            ? "border-stroke-muted opacity-70"
            : "border-stroke-light hover:border-amber-300",
        )}
      />

      {!answered && (
        <button
          onClick={() => onAnswer(text.trim())}
          disabled={text.trim().length < 5}
          className={cn(
            "w-full rounded-2xl py-3 text-sm font-extrabold uppercase tracking-wide transition-colors",
            text.trim().length >= 5
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "cursor-not-allowed bg-stroke-light text-neutral",
          )}
        >
          Verificar resposta
        </button>
      )}

      {answered && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/40">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-300" />
            <p className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              Gabarito de referência
            </p>
          </div>
          <p className="text-sm leading-relaxed text-foreground-dark">
            {activity.referenceAnswer}
          </p>
          <p className="mt-3 text-[11px] text-foreground-tertiary">
            Compare com a sua resposta. O importante é ter refletido sobre o tema!
          </p>
        </div>
      )}
    </div>
  )
}

export function EssayBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
      <BookOpen className="h-3 w-3" />
      Revisão dissertativa
    </span>
  )
}
