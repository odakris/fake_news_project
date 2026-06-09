"use client";
 
import { ThemeProvider } from "next-themes";
import { getQueryClient } from "@/lib/query-client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
 
export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
 
  return (
    <TooltipProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </TooltipProvider>
  );
}