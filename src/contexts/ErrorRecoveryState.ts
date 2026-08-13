import { createContext } from "react"
import type { useErrorRecovery } from "@/hooks/useErrorRecovery"

export type ErrorRecoveryCtx = ReturnType<typeof useErrorRecovery>

export const ErrorRecoveryContext = createContext<ErrorRecoveryCtx | undefined>(undefined)
