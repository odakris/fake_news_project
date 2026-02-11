import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import "./globals.css"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import { AppShell } from "@/components/bluesky/app-shell"

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
    <html lang="en" className="light">
      <body className="font-sans antialiased bg-background text-foreground">
        <TooltipProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AppShell>
              {children}
            </AppShell>
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
