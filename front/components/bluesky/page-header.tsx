"use client"

import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  children?: ReactNode
}

export function PageHeader({
  title,
  subtitle,
  showBack = false,
  children,
}: PageHeaderProps) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-3 px-4 h-14">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-foreground truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </header>
  )
}
