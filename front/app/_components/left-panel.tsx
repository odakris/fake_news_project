import Link from "next/link";
import { Home, Search, Bell, MessageCircle, User, Settings } from "lucide-react";

import { cn, PropsWithClassName } from "@/lib/utils";

import { Frame, FramePanel } from "@/components/ui/frame";
import { ScrollArea } from "@/components/ui/scroll-area";
import FakeMessageTesterModal from "@/components/bsky/fake-message/fake-message-tester-modal";

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
      <div className={cn("hidden xl:flex shrink-0 sticky top-0 overflow-y-auto flex-col h-screen gap-4", className)} >
        <ScrollArea className={"gap-4"}>
          <Frame>
            <FramePanel>
              {navItems.map((item) => (
                <Link key={item.label} href={item.href} className="flex flex-row items-center gap-2 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <item.icon className="h-6 w-6" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </FramePanel>
          </Frame>
          
          <FakeMessageTesterModal />
        </ScrollArea>
      </div>
    )
  }