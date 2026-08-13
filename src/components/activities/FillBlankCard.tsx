import { cn } from "@/lib/utils"
import type { FillBlankActivity } from "@/lib/lessonContent"

interface Props {
  activity: FillBlankActivity
  selected: string | null
  answered: boolean
  onSelect: (id: string) => void
}

export function FillBlankCard({ activity, selected, answered, onSelect }: Props) {
  const parts = activity.sentence.split("{___}")

  return (
    <div className="flex flex-col gap-5">
      {/* Sentence with highlighted blank */}
      <div className="rounded-2xl border-2 border-stroke-light bg-card p-5 text-base leading-relaxed text-foreground-dark">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < parts.length - 1 && (
              <span
                className={cn(
                  "mx-1 inline-block min-w-[100px] border-b-2 px-2 py-0.5 text-center font-extrabold transition-all",
                  answered && selected
                    ? selected === activity.correct
                      ? "border-emerald bg-emerald/10 text-emerald"
                      : "border-red-400 bg-red-50 text-red-500 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
                    : "border-dashed border-forest text-forest"
                )}
              >
                {selected ? activity.options.find((o) => o.id === selected)?.text : "______"}
              </span>
            )}
          </span>
        ))}
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-2.5">
        {activity.options.map((opt) => {
          const isSelected = selected === opt.id
          const isCorrect = answered && opt.id === activity.correct
          const isWrong = answered && isSelected && opt.id !== activity.correct
          return (
            <button
              key={opt.id}
              disabled={answered}
              onClick={() => onSelect(opt.id)}
              className={cn(
                "rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all",
                !answered &&
                  "border-stroke-light bg-card hover:border-emerald hover:bg-surface-success",
                isCorrect && "border-emerald bg-emerald/15 text-emerald-dark",
                isWrong &&
                  "border-red-400 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300",
                answered && !isSelected && !isCorrect && "border-stroke-light bg-card opacity-50"
              )}
            >
              {opt.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}
