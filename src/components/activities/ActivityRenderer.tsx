import { memo } from "react"
import { Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LessonActivity, FillBlankActivity, MatchActivity, OrderActivity, Question } from "@/lib/lessonContent"
import { isFillBlank, isMatch, isOrder, isEssay, isContentSlide } from "@/lib/lessonContent"
import { FillBlankCard } from "./FillBlankCard"
import { MatchCard } from "./MatchCard"
import { OrderCard } from "./OrderCard"
import { EssayCard, EssayBadge } from "./EssayCard"
import { SlideCard } from "./SlideCard"

interface Props {
  activity: LessonActivity
  selected: string | null
  answered: boolean
  step: number
  total: number
  onSelect: (id: string) => void
  onMatchAnswer: (pairs: Record<string, string>) => void
  onOrderAnswer: (pairs: Record<string, string>) => void
  onEssayAnswer: (text: string) => void
}

export const ActivityRenderer = memo(function ActivityRenderer({
  activity,
  selected,
  answered,
  step,
  total,
  onSelect,
  onMatchAnswer,
  onOrderAnswer,
  onEssayAnswer,
}: Props) {
  if (isContentSlide(activity)) {
    return <SlideCard slide={activity} />
  }

  if (isEssay(activity)) {
    return (
      <div className="flex flex-col gap-4">
        <div className="mb-1 flex items-center gap-2">
          <EssayBadge />
          <span className="text-[11px] font-semibold text-foreground-tertiary">
            {step + 1} de {total}
          </span>
        </div>
        <div className="mb-2 flex items-start gap-3">
          <img
            src="/assets/mascot-teacher.png" loading="lazy"
            alt=""
            className="h-20 w-20 shrink-0 object-contain"
          />
          <div className="relative rounded-2xl rounded-tl-none border-2 border-amber-300 bg-amber-100 px-4 py-3 shadow-sm dark:border-amber-700 dark:bg-amber-950/60">
            <p className="text-sm font-bold text-foreground-dark">{activity.prompt}</p>
          </div>
        </div>
        <EssayCard activity={activity} answered={answered} onAnswer={onEssayAnswer} />
      </div>
    )
  }

  const activityType = isFillBlank(activity) ? "fill-blank"
    : isMatch(activity) ? "match"
    : isOrder(activity) ? "order"
    : "multiple-choice"

  const typeLabel = {
    "multiple-choice": "Múltipla escolha",
    "fill-blank": "Complete a frase",
    "match": "Ligue as colunas",
    "order": "Conecte os itens",
  }[activityType]

  return (
    <div className="flex flex-col gap-4">
      {/* Tag do tipo */}
      <div className="mb-1 flex items-center gap-2">
        <span className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider",
          activityType === "multiple-choice" && "bg-emerald/15 text-emerald",
          activityType === "fill-blank" && "bg-luxury/15 text-luxury",
          activityType === "match" && "bg-blue-100 text-blue-700",
          activityType === "order" && "bg-purple-100 text-purple-700",
        )}>
          {typeLabel}
        </span>
        <span className="text-[11px] font-semibold text-foreground-tertiary">
          {step + 1} de {total}
        </span>
      </div>

      {/* Mascot + pergunta/instrução */}
      <div className="mb-2 flex items-start gap-3">
        <img
          src="/assets/mascot-teacher.png" loading="lazy"
          alt=""
          className="h-14 w-14 shrink-0 object-contain"
        />
        <div className="relative rounded-2xl rounded-tl-none border-2 border-stroke-light bg-card px-4 py-3 shadow-sm dark:border-emerald-dark/30 dark:bg-surface-soft">
          <p className="text-sm font-bold text-foreground-dark">
            {isFillBlank(activity)
              ? "Complete a frase abaixo:"
              : isMatch(activity) || isOrder(activity)
              ? activity.instruction || "Complete a atividade abaixo:"
              : (activity as Question).prompt}
          </p>
        </div>
      </div>

      {/* Render do tipo específico */}
      {isFillBlank(activity) && (
        <FillBlankCard
          activity={activity as FillBlankActivity}
          selected={selected}
          answered={answered}
          onSelect={onSelect}
        />
      )}

      {isMatch(activity) && (
        <MatchCard
          activity={activity as MatchActivity}
          answered={answered}
          onAnswer={onMatchAnswer}
        />
      )}

      {isOrder(activity) && (
        <OrderCard
          activity={activity as OrderActivity}
          answered={answered}
          onAnswer={onOrderAnswer}
        />
      )}

      {!isFillBlank(activity) && !isMatch(activity) && !isOrder(activity) && (
        <div className="flex flex-col gap-3">
          {(activity as Question).options.map((opt) => {
            const isSelected = selected === opt.id
            const isOptCorrect = answered && opt.id === (activity as Question).correct
            const isOptWrong = answered && isSelected && opt.id !== (activity as Question).correct
            return (
              <button
                key={opt.id}
                disabled={answered}
                onClick={() => onSelect(opt.id)}
                className={cn(
                  "rounded-2xl border-2 px-4 py-3 text-left text-sm font-medium transition-all active:scale-[0.99]",
                  !answered && "border-stroke-light bg-card hover:border-emerald",
                  isOptCorrect && "border-emerald bg-surface-success text-emerald-dark",
                  isOptWrong && "border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300",
                  answered && !isSelected && !isOptCorrect && "border-stroke-light bg-card opacity-60",
                )}
              >
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-page-bg-light text-xs font-extrabold text-forest">
                  {opt.id.toUpperCase()}
                </span>
                {opt.text}
              </button>
            )
          })}
        </div>
      )}

      {/* Explicação (só após responder) */}
      {answered && activity.explanation && (
        <div
          className={cn(
            "mt-2 rounded-2xl border-2 p-4",
            activityType === "multiple-choice" || activityType === "fill-blank"
              ? selected === (activity as Question).correct
                ? "border-emerald bg-surface-success"
                : "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/40"
              : "border-emerald bg-surface-success",
          )}
        >
          <div className="flex items-start gap-2">
            <Lightbulb className={cn(
              "h-5 w-5 shrink-0",
              selected === (activity as Question).correct || isMatch(activity) || isOrder(activity)
                ? "text-emerald-dark" : "text-red-500 dark:text-red-400",
            )} />
            <div>
              <p className={cn(
                "text-sm font-bold",
                selected === (activity as Question).correct || isMatch(activity) || isOrder(activity)
                  ? "text-emerald-dark" : "text-red-700 dark:text-red-300",
              )}>
                {activityType === "match" || activityType === "order"
                  ? "Atividade concluída!"
                  : selected === (activity as Question).correct
                    ? "Mandou bem!"
                    : "Quase lá!"}
              </p>
              <p className="mt-1 text-xs text-foreground-secondary">
                {activity.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
