import { LeftPanel } from "../_components/left-panel";
import { RightPanel } from "../_components/right-panel";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (

    <div className="mx-auto flex justify-center max-w-7xl">
        <LeftPanel className="w-[330px]" />
        <main className="w-[600px] border-x border-border">
        {children}
        </main>
        <RightPanel className="w-[330px]" />
    </div>

  )
}