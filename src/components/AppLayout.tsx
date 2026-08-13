import type { ReactNode } from "react"
import { AppDesktopSidebar } from "@/components/AppDesktopSidebar"

interface AppLayoutProps {
  children: ReactNode
}

/**
 * AppLayout wraps authenticated app pages with a desktop sidebar on lg+ screens.
 * On mobile the sidebar is hidden and AppBottomNav (inside each page) takes over.
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <AppDesktopSidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
