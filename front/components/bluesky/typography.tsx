import { cn } from "@/src/lib/utils"
import { ComponentProps } from "react"

export function TypographyTinyText({ children, className, ...props }: ComponentProps<"p">) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)} {...props}>
      {children}
    </p>
  )
}

export function TypographySemiBoldText({ children, className, ...props }: ComponentProps<"p">) {
  return (
    <p className={cn("text-sm font-semibold text-foreground", className)} {...props}>
      {children}
    </p>
  )
}

export function TypographyBoldText({ children, className, ...props }: ComponentProps<"h2">) {
  return (
    <h2 className={cn("text-base font-bold text-foreground", className)} {...props}>
      {children}
    </h2>
  )
}

export function TypographyRegularText({ children, className, ...props }: ComponentProps<"p">) {
  return (
    <p className={cn("text-[15px] text-foreground", className)} {...props}>
      {children}
    </p>
  )
}