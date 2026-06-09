import Link from "next/link";
import { Home, Search, Bell, MessageCircle, User, Settings } from "lucide-react";

import { cn, PropsWithClassName } from "@/lib/utils";

import { Frame, FramePanel } from "@/components/ui/frame";

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/search", label: "Search", icon: Search },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/messages", label: "Messages", icon: MessageCircle },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/account", label: "Settings", icon: Settings },
  ];
  
  export async function LeftPanel({ className }: PropsWithClassName) {

    return (
      <Frame className={cn("hidden xl:block shrink-0 sticky top-0 h-screen overflow-y-auto", className)}>
        <FramePanel>
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="flex flex-row items-center gap-2 p-3 rounded-lg hover:bg-accent/50 transition-colors">
              <item.icon className="h-6 w-6" />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </FramePanel>
      </Frame>
    )
  }