import { BarChart3, AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ErrorMetrics {
  totalErrors: number
  networkErrors: number
  authErrors: number
  apiErrors: number
  averageResponseTime: number
  successRate: number
  lastError?: {
    message: string
    timestamp: number
  }
}

interface ErrorTrackingDashboardProps {
  metrics: ErrorMetrics
  className?: string
}

export function ErrorTrackingDashboard({ metrics, className }: ErrorTrackingDashboardProps) {
  const errorPercentage =
    metrics.totalErrors > 0 ? (metrics.networkErrors / metrics.totalErrors) * 100 : 0

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const getSuccessColor = (rate: number): string => {
    if (rate >= 95) return "text-emerald-600"
    if (rate >= 80) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-primary-dark" />
        <h3 className="text-sm font-bold text-primary-dark">Análise de Erros</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {/* Total Errors */}
        <Card className="p-3 border-stroke-light">
          <p className="text-xs text-foreground-secondary mb-1">Total de Erros</p>
          <p
            className={cn(
              "text-lg font-bold",
              metrics.totalErrors > 5 ? "text-red-600" : "text-foreground-dark"
            )}
          >
            {metrics.totalErrors}
          </p>
          <p className="text-[10px] text-foreground-tertiary mt-1">última sessão</p>
        </Card>

        {/* Network Errors */}
        <Card className="p-3 border-stroke-light">
          <p className="text-xs text-foreground-secondary mb-1">Rede</p>
          <p className="text-lg font-bold text-foreground-dark">{metrics.networkErrors}</p>
          <p className="text-[10px] text-foreground-tertiary mt-1">
            {errorPercentage > 0 ? `${Math.round(errorPercentage)}%` : "0%"}
          </p>
        </Card>

        {/* Auth Errors */}
        <Card className="p-3 border-stroke-light">
          <p className="text-xs text-foreground-secondary mb-1">Autenticação</p>
          <p className="text-lg font-bold text-foreground-dark">{metrics.authErrors}</p>
          <p className="text-[10px] text-foreground-tertiary mt-1">problemas</p>
        </Card>

        {/* Success Rate */}
        <Card className="p-3 border-stroke-light">
          <p className="text-xs text-foreground-secondary mb-1">Taxa de Sucesso</p>
          <p className={cn("text-lg font-bold", getSuccessColor(metrics.successRate))}>
            {metrics.successRate}%
          </p>
          <p className="text-[10px] text-foreground-tertiary mt-1">operações</p>
        </Card>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {/* Response Time */}
        <Card className="p-4 border-stroke-light">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-foreground-secondary mb-2">Tempo Médio de Resposta</p>
              <p className="text-2xl font-bold text-foreground-dark">
                {formatTime(metrics.averageResponseTime)}
              </p>
            </div>
            <Clock className="h-5 w-5 text-primary-dark opacity-50" />
          </div>
          <div className="mt-3 w-full bg-surface-soft rounded-full h-1.5">
            <div
              className="bg-emerald h-1.5 rounded-full transition-all"
              style={{
                width: `${Math.min((1000 - metrics.averageResponseTime) / 10, 100)}%`,
              }}
            />
          </div>
        </Card>

        {/* Error Status */}
        <Card className="p-4 border-stroke-light">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-foreground-secondary mb-2">Status do Sistema</p>
              <p
                className={cn(
                  "text-lg font-bold",
                  metrics.totalErrors === 0 ? "text-emerald-600" : "text-amber-600"
                )}
              >
                {metrics.totalErrors === 0 ? "Operacional" : "Com Problemas"}
              </p>
            </div>
            {metrics.totalErrors === 0 ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            )}
          </div>
          <p className="text-xs text-foreground-tertiary mt-3">
            {metrics.lastError
              ? `Último erro: ${metrics.lastError.message}`
              : "Nenhum erro registrado"}
          </p>
        </Card>
      </div>

      {/* Error Distribution */}
      <Card className="p-4 border-stroke-light mt-4">
        <p className="text-xs font-bold text-foreground-secondary mb-3">Distribuição de Erros</p>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-foreground-secondary">Rede</span>
              <span className="text-xs font-bold text-foreground-dark">
                {metrics.networkErrors}
              </span>
            </div>
            <div className="w-full bg-surface-soft rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all"
                style={{
                  width: `${metrics.totalErrors > 0 ? (metrics.networkErrors / metrics.totalErrors) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-foreground-secondary">API</span>
              <span className="text-xs font-bold text-foreground-dark">{metrics.apiErrors}</span>
            </div>
            <div className="w-full bg-surface-soft rounded-full h-1.5">
              <div
                className="bg-orange-500 h-1.5 rounded-full transition-all"
                style={{
                  width: `${metrics.totalErrors > 0 ? (metrics.apiErrors / metrics.totalErrors) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-foreground-secondary">Autenticação</span>
              <span className="text-xs font-bold text-foreground-dark">{metrics.authErrors}</span>
            </div>
            <div className="w-full bg-surface-soft rounded-full h-1.5">
              <div
                className="bg-red-500 h-1.5 rounded-full transition-all"
                style={{
                  width: `${metrics.totalErrors > 0 ? (metrics.authErrors / metrics.totalErrors) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
