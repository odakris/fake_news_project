import {
    Sidebar,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
  } from "@/components/ui/sidebar";
import { logger } from "@/lib/logger";
import { cn, PropsWithClassName } from "@/lib/utils";
  import { Home, Search, Bell, MessageCircle, User, Settings } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/search", label: "Search", icon: Search },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/messages", label: "Messages", icon: MessageCircle },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/account", label: "Settings", icon: Settings },
  ]
  
  export async function BlueskySidebar({ className }: PropsWithClassName) {

    const pathname = "/" //await headers().then((headers) => headers.get("x-current-path"));

    return (
      <div className={cn(className as string | undefined, "flex justify-end")}>
        <Sidebar variant="inset" side="right" className="sticky top-0">
          <SidebarHeader>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link
                    href={item.href}
                    className={cn("hover:bg-[#2c3a4e] w-[176px] flex flex-row items-center p-3 rounded-lg gap-2 -outline-offset-1 transition-colors transition-background-color transition-border-color transition-text-decoration-color transition-fill transition-stroke duration-100",
                      pathname === item.href && "bg-accent font-bold"
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            </SidebarHeader>
        </Sidebar>
      </div>
    )
  }