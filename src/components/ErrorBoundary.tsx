import { Component, ReactNode } from "react"
import * as Sentry from "@sentry/react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" }

  static getDerivedStateFromError(error: Error): State {
    Sentry.captureException(error)
    return { hasError: true, message: error.message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
          <img src="/assets/mascot-login-new.png" alt="Erro" className="h-32 w-auto opacity-80" />
          <h1 className="text-2xl font-extrabold text-primary-dark">Algo deu errado</h1>
          <p className="max-w-sm text-sm text-foregroundSecondary">{this.state.message}</p>
          <button
            onClick={() => window.location.replace("/")}
            className="mt-2 rounded-full bg-primary-dark px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Voltar ao início
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
