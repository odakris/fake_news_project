"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Bell, MessageCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"

const mobileNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-card border-t border-border px-2 py-2 safe-area-bottom">
      <div className="flex items-center justify-around">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors",
                isActive ? "text-bluesky" : "text-muted-foreground"
              )}
              aria-label={item.label}
            >
              <item.icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 1.75} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
