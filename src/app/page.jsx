"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, User, ArrowRight, CheckCircle2, Lock, Dumbbell } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

export default function LoginPage() {
    const router = useRouter();
    const [trainerCode, setTrainerCode] = useState("");
    const [studentCode, setStudentCode] = useState("");
    const [studentsList, setStudentsList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Carrega a lista de alunos para facilitar o login do aluno (seleção ou código)
    useEffect(() => {
        async function fetchAlunos() {
            try {
                const res = await fetch(`${API_URL}/alunos`);
                if (res.ok) {
                    const data = await res.json();
                    setStudentsList(data);
                }
            } catch (error) {
                console.error("Erro ao buscar alunos para login:", error);
            }
        }
        fetchAlunos();
    }, []);

    const handleTrainerLogin = (e) => {
        e.preventDefault();
        setErrorMsg("");
        setIsLoading(true);

        // Código de acesso simples para o Personal (ex: PRO-1234 ou 8888 ou admin)
        setTimeout(() => {
            if (trainerCode.toUpperCase() === "PRO-1234" || trainerCode === "8888" || trainerCode.toLowerCase() === "admin") {
                localStorage.setItem("repos_role", "trainer");
                router.push("/dashboard/students");
            } else {
                setErrorMsg("Código de Personal inválido. Dica: use PRO-1234 ou 8888");
                setIsLoading(false);
            }
        }, 800);
    };

    const handleStudentLogin = (e) => {
        e.preventDefault();
        setErrorMsg("");
        setIsLoading(true);

        setTimeout(() => {
            const found = studentsList.find(s => s.id === studentCode || s.nome.toLowerCase().includes(studentCode.toLowerCase()) || (s.status_presenca?.[0]?.codigo_acesso && s.status_presenca[0].codigo_acesso.toLowerCase() === studentCode.toLowerCase()));
            
            if (found) {
                localStorage.setItem("repos_role", "student");
                localStorage.setItem("repos_student_id", found.id);
                localStorage.setItem("repos_student_name", found.nome);
                router.push("/student/today");
            } else if (studentCode.toUpperCase() === "ALUNO-123" || studentCode === "1234") {
                // Fallback de demonstração
                localStorage.setItem("repos_role", "student");
                localStorage.setItem("repos_student_id", "1");
                localStorage.setItem("repos_student_name", "Carlos Eduardo");
                router.push("/student/today");
            } else {
                setErrorMsg("Código de Aluno não encontrado. Dica: digite seu nome ou ALUNO-123");
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Logo / Header */}
            <div className="text-center mb-10 z-10">
                <div className="inline-flex items-center gap-3 mb-4 bg-secondary/80 border border-border px-5 py-2 rounded-full shadow-lg">
                    <Dumbbell className="text-primary animate-pulse" size={24} />
                    <span className="font-black text-2xl tracking-wider text-foreground">Z<span className="text-primary">fit</span></span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-foreground max-w-md mx-auto leading-tight">
                    Portal de Acesso Integrado
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-sm mx-auto">
                    Selecione seu perfil e informe seu código de acesso rápido para entrar.
                </p>
            </div>

            {errorMsg && (
                <div className="mb-6 bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-xl text-sm font-bold max-w-md w-full text-center animate-in fade-in duration-200 z-10">
                    {errorMsg}
                </div>
            )}

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full z-10">
                
                {/* CARD 1: PERSONAL TRAINER */}
                <div className="bg-card border border-border rounded-3xl p-8 shadow-xl flex flex-col justify-between relative group hover:border-primary/50 transition-all duration-300">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-emerald-500 rounded-t-3xl opacity-80 group-hover:opacity-100 transition-opacity" />
                    
                    <div>
                        <div className="w-14 h-14 bg-primary/10 border border-primary/30 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-105 transition-transform shadow-lg shadow-primary/10">
                            <Shield size={28} />
                        </div>
                        <h2 className="text-2xl font-black text-foreground mb-2">Personal Trainer</h2>
                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                            Acesse o painel de gestão financeira, CRM de alunos, relatórios e construtor de treinos.
                        </p>

                        <form onSubmit={handleTrainerLogin} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                                    <Lock size={12} /> Código de Acesso do Personal
                                </label>
                                <input 
                                    type="password" 
                                    placeholder="Ex: PRO-1234 ou 8888" 
                                    value={trainerCode}
                                    onChange={(e) => setTrainerCode(e.target.value)}
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-bold tracking-widest placeholder:tracking-normal placeholder:font-normal"
                                    required 
                                />
                                <span className="text-[11px] text-muted-foreground mt-1.5 block">Dica de demonstração: digite <strong className="text-primary font-mono">PRO-1234</strong></span>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-primary/30 disabled:opacity-50"
                            >
                                {isLoading ? "Autenticando..." : "Entrar no Painel"} <ArrowRight size={18} />
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Acesso Administrativo</span>
                        <span className="bg-secondary px-2.5 py-1 rounded-full font-bold text-foreground">v2.0 Enterprise</span>
                    </div>
                </div>

                {/* CARD 2: ALUNO */}
                <div className="bg-card border border-border rounded-3xl p-8 shadow-xl flex flex-col justify-between relative group hover:border-primary/50 transition-all duration-300">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-3xl opacity-80 group-hover:opacity-100 transition-opacity" />
                    
                    <div>
                        <div className="w-14 h-14 bg-secondary border border-border rounded-2xl flex items-center justify-center text-foreground mb-6 group-hover:scale-105 transition-transform shadow-lg">
                            <User size={28} className="text-primary" />
                        </div>
                        <h2 className="text-2xl font-black text-foreground mb-2">Aplicativo do Aluno</h2>
                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                            Acesse seus treinos do dia, cronômetro de descanso, histórico de cargas e evolução física.
                        </p>

                        <form onSubmit={handleStudentLogin} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                                    <Lock size={12} /> Código do Aluno ou Nome
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Ex: Carlos ou ALUNO-123" 
                                    value={studentCode}
                                    onChange={(e) => setStudentCode(e.target.value)}
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-bold tracking-wide"
                                    required 
                                />
                                <span className="text-[11px] text-muted-foreground mt-1.5 block">Dica de demonstração: digite <strong className="text-primary font-mono">Carlos</strong></span>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full py-4 bg-secondary text-foreground border border-border rounded-xl font-bold text-sm shadow-xl hover:bg-secondary/80 hover:border-primary/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? "Autenticando..." : "Acessar Meu Treino"} <ArrowRight size={18} />
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Acesso Mobile Web</span>
                        <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold">100% Sincronizado</span>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-xs text-muted-foreground z-10">
                <p>Zfit © 2026 • Sistema de Gestão para Personal Trainers e Estúdios</p>
            </div>
        </div>
    );
}
