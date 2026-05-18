import Link from "next/link";
import { LayoutDashboard, Users, Dumbbell, CircleDollarSign, Settings, LogOut, FileText } from "lucide-react";
export function Sidebar() {
    const menuItems = [
        { name: "Visão Geral", href: "/dashboard", icon: LayoutDashboard },
        { name: "Alunos", href: "/dashboard/students", icon: Users },
        { name: "Treinos", href: "/dashboard/workouts", icon: Dumbbell },
        { name: "Relatórios", href: "/dashboard/reports", icon: FileText },
        { name: "Financeiro", href: "/dashboard/finance", icon: CircleDollarSign },
        { name: "Configurações", href: "/dashboard/settings", icon: Settings },
    ];
    return (<aside className="w-64 border-r border-border bg-card flex flex-col justify-between hidden md:flex h-[calc(100vh-56px)]">
      <div>
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight">Z<span className="text-primary">fit</span></h1>
        </div>
        
        <nav className="space-y-1 px-4 mt-6">
          {menuItems.map((item) => (<Link key={item.name} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <item.icon size={20}/>
              <span className="font-medium">{item.name}</span>
            </Link>))}
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-md text-muted-foreground w-full hover:text-destructive hover:bg-secondary transition-colors">
          <LogOut size={20}/>
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>);
}
