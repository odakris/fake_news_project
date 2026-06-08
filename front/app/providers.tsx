"use client";
 
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/src/lib/query-client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
 
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