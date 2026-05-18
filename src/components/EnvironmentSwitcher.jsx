"use client";
import { useState, useEffect } from "react";
import { Monitor, Smartphone, LogOut, Shield, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function EnvironmentSwitcher() {
    const pathname = usePathname();
    const router = useRouter();
    const [role, setRole] = useState(null);
    const [studentName, setStudentName] = useState("");

    useEffect(() => {
        const storedRole = localStorage.getItem("repos_role");
        const storedName = localStorage.getItem("repos_student_name");
        if (storedRole) setRole(storedRole);
        if (storedName) setStudentName(storedName);
    }, [pathname]);

    // Se estiver na tela de login, não exibe a barra
    if (pathname === "/") return null;

    const handleLogout = () => {
        localStorage.removeItem("repos_role");
        localStorage.removeItem("repos_student_id");
        localStorage.removeItem("repos_student_name");
        router.push("/");
    };

    return (
        <div className="fixed top-0 left-0 w-full z-50 bg-[#141416]/90 backdrop-blur-md border-b border-[#27272a] text-xs text-[#a1a1aa] px-4 py-2 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
                {role === "trainer" ? (
                    <div className="flex items-center gap-1.5 text-primary font-bold">
                        <Shield size={14} />
                        <span className="text-white font-semibold hidden sm:inline">Sessão Ativa:</span>
                        <span>Personal Trainer</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <User size={14} />
                        <span className="text-white font-semibold hidden sm:inline">Sessão do Aluno:</span>
                        <span>{studentName || "Aluno"}</span>
                    </div>
                )}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                    {role === "trainer" ? "Dashboard" : "Mobile App"}
                </span>
            </div>
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 bg-secondary hover:bg-destructive/20 hover:text-destructive text-muted-foreground hover:border-destructive/30 border border-border px-3 py-1 rounded-md transition-all font-semibold"
                >
                    <LogOut size={13} />
                    <span>Trocar de Conta / Sair</span>
                </button>
            </div>
        </div>
    );
}
