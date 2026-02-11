"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Search,
  Bell,
  MessageCircle,
  User,
  Settings,
  Feather,
  CloudSun,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/account", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:w-[72px] lg:w-[240px] shrink-0 sticky top-0 h-screen">
      <nav className="flex flex-col items-center lg:items-stretch gap-1 py-4 px-2 lg:px-4 w-full h-full">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl hover:bg-accent transition-colors"
          aria-label="Bluesky Home"
        >
          <CloudSun className="h-7 w-7 text-bluesky shrink-0" />
          <span className="text-xl font-bold text-foreground hidden lg:block">
            Bluesky
          </span>
        </Link>

        {/* Nav items */}
        <div className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-base transition-colors",
                  "hover:bg-accent",
                  isActive
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-6 w-6 shrink-0",
                    isActive ? "text-bluesky" : "text-muted-foreground"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            )
          })}

          {/* New Post Button */}
          <Button
            className="mt-4 rounded-full bg-bluesky hover:bg-bluesky/90 text-white h-12 text-base font-semibold hidden lg:flex"
            size="lg"
          >
            <Feather className="h-5 w-5 mr-2" />
            New Post
          </Button>
          <Button
            className="mt-4 rounded-full bg-bluesky hover:bg-bluesky/90 text-white h-12 w-12 lg:hidden flex items-center justify-center"
            size="icon"
            aria-label="New Post"
          >
            <Feather className="h-5 w-5" />
          </Button>
        </div>

        {/* User profile pill */}
        <Link
          href="/profile"
          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-accent transition-colors mt-auto"
        >
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Your avatar" />
            <AvatarFallback className="bg-bluesky/10 text-bluesky text-sm font-semibold">
              AS
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:block min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              Alice Sky
            </p>
            <p className="text-xs text-muted-foreground truncate">
              @alice.bsky.social
            </p>
          </div>
        </Link>
      </nav>
    </aside>
  )
}
