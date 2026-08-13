import { useErrorRecovery } from "@/hooks/useErrorRecovery"
import { ErrorRecoveryContext } from "./ErrorRecoveryState"

export function ErrorRecoveryProvider({ children }: { children: React.ReactNode }) {
  const value = useErrorRecovery()
  return <ErrorRecoveryContext.Provider value={value}>{children}</ErrorRecoveryContext.Provider>
}
