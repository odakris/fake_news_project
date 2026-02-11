import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import "./globals.css"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import { AppShell } from "@/components/bluesky/app-shell"
import { RightPanel } from "@/components/bluesky/right-panel"
import { Sidebar } from "@/components/bluesky/sidebar"

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Bluesky",
  description:
    "Bluesky - Social media as it should be. A decentralized social network built on the AT Protocol.",
}

export const viewport: Viewport = {
  themeColor: "#0085FF",
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
      <body className="font-sans antialiased bg-background text-foreground">
        <TooltipProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="mx-auto flex justify-center max-w-7xl">
              <Sidebar className="w-[200px]" />
              <main className="w-[600px] border-x border-border">
                {children}
              </main>
              <RightPanel className="w-[300px]" />
            </div>
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
