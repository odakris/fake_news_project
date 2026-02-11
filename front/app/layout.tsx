import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import "./globals.css"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import { RightPanel } from "@/app/_components/right-panel"
import { BlueskySidebar } from "@/app/_components/bluesky-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Bluesky",
  description:
    "Bluesky - Social media as it should be. A decentralized social network built on the AT Protocol.",
}

export const viewport: Viewport = {
  themeColor: "#151d28",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#151d28] text-foreground">
        <TooltipProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SidebarProvider className="bg-[#151d28]">

              <div className="mx-auto flex justify-center max-w-7xl">
                <BlueskySidebar className="w-[330px]" />
                <main className="w-[600px] border-x border-border">
                  {children}
                </main>
                <RightPanel className="w-[330px]" />
              </div>

            </SidebarProvider>
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
