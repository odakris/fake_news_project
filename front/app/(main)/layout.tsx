import { SidebarProvider } from "@/components/ui/sidebar";
import { RightPanel } from "../_components/right-panel";
import { BlueskySidebar } from "../_components/bluesky-sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="bg-[#151d28]">

      <div className="mx-auto flex justify-center max-w-7xl">
          <BlueskySidebar className="w-[330px]" />
          <main className="w-[600px] border-x border-border">
          {children}
          </main>
          <RightPanel className="w-[330px]" />
      </div>

    </SidebarProvider>
  )
}