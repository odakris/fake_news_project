import type { PropsWithChildren } from "react"
import { Sidebar } from "./sidebar"
import { MobileNav } from "./mobile-nav"
import { RightPanel } from "./right-panel"

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-7xl">
        {/* Left sidebar - hidden on mobile */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 min-w-0 border-x border-border">
          {children}
        </main>

        {/* Right panel - hidden on mobile and tablet */}
        <RightPanel />
      </div>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50">
        <MobileNav />
      </div>
    </div>
  )
}
