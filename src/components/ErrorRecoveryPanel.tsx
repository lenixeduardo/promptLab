import { X, AlertCircle, Wifi, WifiOff, RotateCw, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorState {
  message: string
  code?: string
  timestamp: number
  recoveryActions: Array<{ label: string; action: () => Promise<void>; icon?: string }>
  isRetrying: boolean
}

interface ErrorRecoveryPanelProps {
  errors: ErrorState[]
  isOnline: boolean
  onRemoveError: (timestamp: number) => void
  onExecuteRecovery: (errorIndex: number, actionIndex: number) => void
}

export function ErrorRecoveryPanel({
  errors,
  isOnline,
  onRemoveError,
  onExecuteRecovery,
}: ErrorRecoveryPanelProps) {
  if (errors.length === 0 && isOnline) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 space-y-2 p-3">
      {!isOnline && (
        <div className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-200 p-3 shadow-md dark:bg-amber-950/40 dark:border-amber-800">
          <WifiOff className="h-5 w-5 text-amber-600 shrink-0 mt-0.5 dark:text-amber-400" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">Sem conexão</p>
            <p className="text-xs text-amber-700 mt-1 dark:text-amber-400">
              Você está offline. Suas mudanças serão sincronizadas quando estiver online novamente.
            </p>
          </div>
        </div>
      )}

      {errors.map((error, index) => {
        const isNetworkError = error.code === "NETWORK_ERROR"
        const isAuthError = error.code === "AUTH_ERROR"
        const bgColor = isAuthError ? "bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800" : "bg-orange-50 border-orange-200 dark:bg-orange-950/40 dark:border-orange-800"
        const iconColor = isAuthError ? "text-red-600 dark:text-red-400" : "text-orange-600 dark:text-orange-400"
        const textColor = isAuthError ? "text-red-900 dark:text-red-300" : "text-orange-900 dark:text-orange-300"
        const textSecondary = isAuthError ? "text-red-700 dark:text-red-400" : "text-orange-700 dark:text-orange-400"

        return (
          <div
            key={error.timestamp}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-3 shadow-md",
              bgColor
            )}
            role="alert"
            aria-live="assertive"
            aria-label={`Erro: ${error.message}`}
          >
            <AlertCircle className={cn("h-5 w-5 shrink-0 mt-0.5", iconColor)} />
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-semibold", textColor)}>{error.message}</p>
              {error.recoveryActions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {error.recoveryActions.map((action, actionIndex) => (
                    <Button
                      key={actionIndex}
                      size="sm"
                      variant="outline"
                      onClick={() => onExecuteRecovery(index, actionIndex)}
                      disabled={error.isRetrying}
                      className="text-xs h-7"
                      aria-label={action.label}
                    >
                      {error.isRetrying ? (
                        <>
                          <Clock className="h-3 w-3 animate-spin mr-1" />
                          Tentando...
                        </>
                      ) : (
                        <>
                          <RotateCw className="h-3 w-3 mr-1" />
                          {action.label}
                        </>
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => onRemoveError(error.timestamp)}
              className={cn("shrink-0 hover:opacity-70 mt-0.5", textSecondary)}
              aria-label="Fechar erro"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
