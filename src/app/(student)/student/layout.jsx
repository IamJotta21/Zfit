import { BottomNav } from "@/components/student/BottomNav";
export default function StudentLayout({ children, }) {
    return (<div className="bg-background min-h-[calc(100vh-56px)] pb-20">
      <main className="max-w-md mx-auto h-full px-4 pt-6 pb-24 relative">
        {children}
      </main>
      <BottomNav />
    </div>);
}
