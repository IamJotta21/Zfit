import { Sidebar } from "@/components/trainer/Sidebar";
export default function TrainerDashboardLayout({ children, }) {
    return (<div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background p-8">
        {children}
      </main>
    </div>);
}
