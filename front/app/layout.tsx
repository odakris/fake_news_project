import type { Metadata, Viewport } from "next";

import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Bluesky",
  description:
    "Bluesky - Social media as it should be. A decentralized social network built on the AT Protocol.",
};

export const viewport: Viewport = {
  themeColor: "#151d28",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans antialiased bg-[#151d28] text-foreground">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
