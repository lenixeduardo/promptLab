import { useState } from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MatchActivity } from "@/lib/lessonContent"

interface Props {
  activity: MatchActivity
  answered: boolean
  onAnswer: (pairs: Record<string, string>) => void
}

export function MatchCard({ activity, answered, onAnswer }: Props) {
  // shuffledDefinitions: estado inicial embaralhado
  const [shuffledDefs] = useState(() =>
    [...activity.pairs]
      .map((p) => ({ ...p, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((p) => p.definition)
  )
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [connections, setConnections] = useState<Record<string, string>>({}) // word → definition

  function handleWordClick(word: string) {
    if (answered) return
    setSelectedWord(word === selectedWord ? null : word)
  }

  function handleDefClick(def: string) {
    if (answered || !selectedWord) return
    const newConn = { ...connections }

    // Se a palavra já tem conexão, remove a anterior
    if (newConn[selectedWord]) {
      delete newConn[selectedWord]
    }

    // Se a definição já está ligada a outra palavra, remove a ligação anterior
    const prevWord = Object.entries(newConn).find(([, d]) => d === def)?.[0]
    if (prevWord) delete newConn[prevWord]

    newConn[selectedWord] = def
    setConnections(newConn)
    setSelectedWord(null)

    // Se todas as palavras estão conectadas, notifica
    if (Object.keys(newConn).length === activity.pairs.length) {
      onAnswer(newConn)
    }
  }

  function isCorrect(word: string): boolean {
    if (!answered) return false
    const pair = activity.pairs.find((p) => p.word === word)!
    return connections[word] === pair.definition
  }

  function isWrong(word: string): boolean {
    if (!answered) return false
    if (!connections[word]) return false
    return !isCorrect(word)
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-bold text-foreground-dark">{activity.instruction}</p>

      <div className="flex gap-4">
        {/* Coluna A — palavras */}
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-tertiary">
            Palavras
          </p>
          {activity.pairs.map((pair) => (
            <button
              key={pair.word}
              disabled={answered}
              onClick={() => handleWordClick(pair.word)}
              className={cn(
                "rounded-xl border-2 px-3 py-2.5 text-left text-sm font-semibold transition-all",
                !answered &&
                  selectedWord === pair.word &&
                  "border-emerald bg-emerald/10 ring-2 ring-emerald/30",
                !answered &&
                  selectedWord !== pair.word &&
                  "border-stroke-light bg-card hover:border-emerald",
                answered && isCorrect(pair.word) && "border-emerald bg-emerald/15",
                answered &&
                  isWrong(pair.word) &&
                  "border-red-400 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300",
                answered && !connections[pair.word] && "border-stroke-light bg-card opacity-50"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="flex-1">{pair.word}</span>
                {answered && isCorrect(pair.word) && (
                  <Check className="h-4 w-4 text-emerald" strokeWidth={3} />
                )}
                {answered && isWrong(pair.word) && (
                  <X className="h-4 w-4 text-red-400" strokeWidth={3} />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Coluna B — definições (embaralhadas) */}
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-tertiary">
            Significados
          </p>
          {shuffledDefs.map((def, i) => {
            const isConnected = Object.values(connections).includes(def)
            const connectedWord = Object.entries(connections).find(([, d]) => d === def)?.[0]
            const isDefCorrect = connectedWord
              ? activity.pairs.find((p) => p.word === connectedWord)?.definition === def
              : false
            return (
              <button
                key={`${def}-${i}`}
                disabled={answered}
                onClick={() => handleDefClick(def)}
                className={cn(
                  "rounded-xl border-2 px-3 py-2.5 text-left text-xs leading-relaxed transition-all",
                  !answered &&
                    selectedWord &&
                    !isConnected &&
                    "border-emerald/50 bg-emerald/5 cursor-pointer",
                  !answered && !selectedWord && "border-stroke-light bg-card",
                  !answered && isConnected && "border-forest bg-forest/10",
                  answered && isDefCorrect && "border-emerald bg-emerald/15",
                  answered &&
                    isConnected &&
                    !isDefCorrect &&
                    "border-red-400 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300",
                  answered && !isConnected && "border-stroke-light bg-card opacity-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="flex-1">{def}</span>
                  {answered && isDefCorrect && (
                    <Check className="h-4 w-4 text-emerald" strokeWidth={3} />
                  )}
                  {answered && isConnected && !isDefCorrect && (
                    <X className="h-4 w-4 text-red-400" strokeWidth={3} />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Status helper */}
      {selectedWord && !answered && (
        <p className="text-center text-xs font-semibold text-forest">
          Toque no significado correspondente para conectar
        </p>
      )}
      {!selectedWord && !answered && Object.keys(connections).length > 0 && (
        <p className="text-center text-xs text-foreground-tertiary">
          {activity.pairs.length - Object.keys(connections).length} conexão(ões) restante(s)
        </p>
      )}
    </div>
  )
}
