"use client";
import { useState } from "react";
import { ArrowLeft, Dumbbell, Clock, Activity, Calendar, MessageCircle, Plus } from "lucide-react";
import Link from "next/link";
import { AssignWorkoutModal } from "@/components/trainer/AssignWorkoutModal";
export default function StudentProfilePage({ params }) {
    // Dados simulados
    const student = {
        id: params.id,
        name: params.id === "1" ? "Carlos Eduardo" : params.id === "2" ? "Ana Julia" : "Aluno Exemplo",
        plan: "Pro Anual",
        phone: "5511999999999",
        activeWorkouts: [
            { name: "Hipertrofia A (Push)", info: "Peito, Ombro, Tríceps" },
            { name: "Hipertrofia B (Pull)", info: "Costas, Bíceps" }
        ]
    };
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    return (<div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <Link href="/dashboard/students" className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors">
          <ArrowLeft size={20}/>
        </Link>
        <div className="flex-1 flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center text-2xl font-bold shadow-inner">
            {student.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{student.name}</h1>
            <span className="text-sm bg-secondary px-2 py-1 rounded-md text-muted-foreground mt-1 inline-block">
              Plano: {student.plan}
            </span>
          </div>
        </div>
        
        {/* Botão de Contato Rápido WhatsApp */}
        <a href={`https://wa.me/${student.phone}?text=Olá ${student.name}, tudo bem?`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#25D366] text-white font-bold px-4 py-2 rounded-lg hover:bg-[#25D366]/90 transition-colors shadow-md shadow-[#25D366]/20">
          <MessageCircle size={20}/>
          WhatsApp
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Métricas */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold">Métricas de Performance</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border p-6 rounded-xl flex flex-col gap-2 shadow-sm">
              <Dumbbell size={20} className="text-primary"/>
              <span className="text-3xl font-bold">4.200<span className="text-sm font-normal text-muted-foreground">kg</span></span>
              <span className="text-sm text-muted-foreground">Volume total levantado</span>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl flex flex-col gap-2 shadow-sm">
              <Clock size={20} className="text-primary"/>
              <span className="text-3xl font-bold">52<span className="text-sm font-normal text-muted-foreground">min</span></span>
              <span className="text-sm text-muted-foreground">Duração média/treino</span>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl flex flex-col gap-2 shadow-sm">
              <Activity size={20} className="text-primary"/>
              <span className="text-3xl font-bold">4<span className="text-sm font-normal text-muted-foreground">/5</span></span>
              <span className="text-sm text-muted-foreground">Frequência Semanal</span>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl flex flex-col gap-2 shadow-sm">
              <Calendar size={20} className="text-primary"/>
              <span className="text-3xl font-bold">18<span className="text-sm font-normal text-muted-foreground"> dias</span></span>
              <span className="text-sm text-muted-foreground">Frequência Mensal (Mês atual)</span>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Treinos Ativos */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Treinos do Aluno</h2>
            <button onClick={() => setIsAssignModalOpen(true)} className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm">
              <Plus size={16}/>
              Atribuir Treino
            </button>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
            {student.activeWorkouts.map((treino, i) => (<div key={i} className="bg-background border border-border p-4 rounded-xl flex flex-col gap-1 hover:border-primary/50 transition-colors">
                <h4 className="font-bold text-sm">{treino.name}</h4>
                <p className="text-xs text-muted-foreground">{treino.info}</p>
                <div className="mt-3 flex gap-2">
                  <button className="text-xs font-semibold bg-secondary text-foreground px-3 py-1.5 rounded-md hover:bg-secondary/80">Editar Tabela</button>
                  <button className="text-xs font-semibold text-destructive hover:underline px-2">Remover</button>
                </div>
              </div>))}
            {student.activeWorkouts.length === 0 && (<p className="text-sm text-muted-foreground text-center py-4">Nenhum treino atribuído no momento.</p>)}
          </div>
        </div>
      </div>

      <AssignWorkoutModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} studentName={student.name}/>
    </div>);
}
