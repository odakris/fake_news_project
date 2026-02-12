import type { PropsWithChildren } from "react";
import { GoBackButton } from "./go-back-button";
import { cn } from "@/lib/utils";

type PageHeaderProps = PropsWithChildren<{
  title: string
  subtitle?: string
  showBack?: boolean
  sticky?: boolean
}>;

export function PageHeader({
  title,
  subtitle,
  showBack = false,
  children,
  sticky = true,
}: PageHeaderProps) {

  return (
    <header className={cn("top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border", sticky && "sticky")}>
      <div className="flex items-center gap-3 px-4 h-14">
        {showBack && <GoBackButton />}
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
