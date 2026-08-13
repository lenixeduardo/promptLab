import { useState } from "react"
import { Check, X, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { OrderActivity } from "@/lib/lessonContent"

interface Props {
  activity: OrderActivity
  answered: boolean
  onAnswer: (pairs: Record<string, string>) => void
}

export function OrderCard({ activity, answered, onAnswer }: Props) {
  const [shuffledRight] = useState(() =>
    [...activity.rightItems]
      .map((item) => ({ ...item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
  )
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [connections, setConnections] = useState<Record<string, string>>({}) // leftId → rightId

  function handleLeftClick(id: string) {
    if (answered) return
    setSelectedLeft(id === selectedLeft ? null : id)
  }

  function handleRightClick(id: string) {
    if (answered || !selectedLeft) return
    const newConn = { ...connections }

    // Se o left já tem conexão, remove
    if (newConn[selectedLeft]) {
      delete newConn[selectedLeft]
      // Se o right clicado já estava conectado a outro left, remove também
      const otherLeft = Object.entries(newConn).find(([, r]) => r === id)?.[0]
      if (otherLeft) delete newConn[otherLeft]
      // O right antigo fica livre para ser reconectado depois
      newConn[selectedLeft] = id
    } else {
      // Se o right já está em uso, remove a conexão anterior
      const prevLeft = Object.entries(newConn).find(([, r]) => r === id)?.[0]
      if (prevLeft) delete newConn[prevLeft]
      newConn[selectedLeft] = id
    }

    setConnections(newConn)
    setSelectedLeft(null)

    if (Object.keys(newConn).length === activity.leftItems.length) {
      onAnswer(newConn)
    }
  }

  function getConnectedRight(leftId: string): string | undefined {
    return connections[leftId]
  }

  function getConnectedLeft(rightId: string): string | undefined {
    return Object.entries(connections).find(([, r]) => r === rightId)?.[0]
  }

  function isLeftCorrect(leftId: string): boolean {
    if (!answered) return false
    return connections[leftId] === activity.correctPairs[leftId]
  }

  function isLeftWrong(leftId: string): boolean {
    if (!answered || !connections[leftId]) return false
    return connections[leftId] !== activity.correctPairs[leftId]
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-bold text-foreground-dark">{activity.instruction}</p>

      <div className="flex gap-3">
        {/* Coluna A */}
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-tertiary">
            Conceito
          </p>
          {activity.leftItems.map((item) => {
            const connectedRight = getConnectedRight(item.id)
            const rightLabel = connectedRight
              ? activity.rightItems.find((r) => r.id === connectedRight)?.text
              : undefined
            return (
              <button
                key={item.id}
                disabled={answered}
                onClick={() => handleLeftClick(item.id)}
                className={cn(
                  "rounded-xl border-2 px-3 py-2.5 text-left text-sm font-semibold transition-all",
                  !answered &&
                    selectedLeft === item.id &&
                    "border-emerald bg-emerald/10 ring-2 ring-emerald/30",
                  !answered &&
                    selectedLeft !== item.id &&
                    "border-stroke-light bg-card hover:border-emerald",
                  answered && isLeftCorrect(item.id) && "border-emerald bg-emerald/15",
                  answered &&
                    isLeftWrong(item.id) &&
                    "border-red-400 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300",
                  answered && !connections[item.id] && "border-stroke-light bg-card opacity-50"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <span className="flex-1">{item.text}</span>
                  {connectedRight && !answered && (
                    <ArrowRight className="h-3.5 w-3.5 text-forest shrink-0" />
                  )}
                  {answered && isLeftCorrect(item.id) && (
                    <Check className="h-4 w-4 text-emerald shrink-0" strokeWidth={3} />
                  )}
                  {answered && isLeftWrong(item.id) && (
                    <X className="h-4 w-4 text-red-400 shrink-0" strokeWidth={3} />
                  )}
                </div>
                {rightLabel && !answered && (
                  <p className="mt-1 text-[10px] text-foreground-tertiary leading-tight">
                    → {rightLabel}
                  </p>
                )}
              </button>
            )
          })}
        </div>

        {/* Coluna B */}
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-tertiary">
            Descrição
          </p>
          {shuffledRight.map((item) => {
            const connectedLeft = getConnectedLeft(item.id)
            const isUsed = !!connectedLeft
            const isItemCorrect =
              answered && connectedLeft ? activity.correctPairs[connectedLeft] === item.id : false
            return (
              <button
                key={item.id}
                disabled={answered}
                onClick={() => handleRightClick(item.id)}
                className={cn(
                  "rounded-xl border-2 px-3 py-2.5 text-left text-xs leading-relaxed transition-all",
                  !answered &&
                    selectedLeft &&
                    !isUsed &&
                    "border-emerald/50 bg-emerald/5 cursor-pointer",
                  !answered && !selectedLeft && "border-stroke-light bg-card",
                  !answered && isUsed && "border-forest bg-forest/10",
                  answered && isItemCorrect && "border-emerald bg-emerald/15",
                  answered &&
                    isUsed &&
                    !isItemCorrect &&
                    "border-red-400 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300",
                  answered && !isUsed && "border-stroke-light bg-card opacity-50"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <span className="flex-1">{item.text}</span>
                  {answered && isItemCorrect && (
                    <Check className="h-4 w-4 text-emerald shrink-0" strokeWidth={3} />
                  )}
                  {answered && isUsed && !isItemCorrect && (
                    <X className="h-4 w-4 text-red-400 shrink-0" strokeWidth={3} />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {selectedLeft && !answered && (
        <p className="text-center text-xs font-semibold text-forest">
          Toque na descrição correspondente para conectar
        </p>
      )}
      {!selectedLeft && !answered && Object.keys(connections).length > 0 && (
        <p className="text-center text-xs text-foreground-tertiary">
          {activity.leftItems.length - Object.keys(connections).length} conexão(ões) restante(s)
        </p>
      )}
    </div>
  )
}
