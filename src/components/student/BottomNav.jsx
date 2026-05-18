"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Activity, User } from "lucide-react";
export function BottomNav() {
    const pathname = usePathname();
    const navItems = [
        { name: "Hoje", href: "/student/today", icon: Activity },
        { name: "Treinos", href: "/student/workouts", icon: Calendar },
        { name: "Perfil", href: "/student/profile", icon: User },
    ];
    return (<nav className="fixed bottom-0 left-0 w-full bg-card border-t border-border z-40 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (<Link key={item.name} href={item.href} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <item.icon size={24} className={isActive ? "fill-primary/20" : ""}/>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>);
        })}
      </div>
    </nav>);
}
