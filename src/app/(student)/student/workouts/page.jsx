"use client";
import { useState, useEffect } from "react";
import { Calendar, Play, Clock, Dumbbell, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

export default function StudentWorkoutsPage() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTreinos() {
      try {
        const res = await fetch(`${API_URL}/treinos`);
        if (res.ok) {
          const data = await res.json();
          // Mapeia os dados reais do Supabase (treinos_biblioteca)
          const formatted = data.map((t, index) => ({
            id: t.id,
            name: t.nome_treino,
            category: t.objetivo || "Hipertrofia Geral",
            duration: t.nivel === "Iniciante" ? 45 : t.nivel === "Avançado" ? 65 : 50,
            exercises: t.exercicios ? t.exercicios.length : 0,
            lastCompleted: index === 0 ? "Há 2 dias" : index === 1 ? "Há 4 dias" : "Ontem",
            isNext: index === 0 // Define o primeiro da biblioteca como o próximo treino do dia
          }));
          setWorkouts(formatted);
        }
      } catch (error) {
        console.error("Erro ao buscar treinos do aluno:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTreinos();
  }, []);

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mt-4">
        <div>
          <h1 className="text-2xl font-bold">Meus Treinos</h1>
          <p className="text-muted-foreground text-sm">Sua rotina programada pelo Personal</p>
        </div>
        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
          <Calendar size={20} className="text-primary" />
        </div>
      </div>

      {/* Lista de Treinos */}
      <div className="space-y-4 max-w-md mx-auto">
        {isLoading ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <Loader2 className="animate-spin text-primary mx-auto mb-3" size={32} />
            <p className="text-sm font-bold text-muted-foreground">Sincronizando com o Personal...</p>
          </div>
        ) : workouts.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl p-6">
            <p className="text-sm font-bold text-muted-foreground">Nenhum treino disponível no momento.</p>
            <p className="text-xs text-muted-foreground mt-1">Seu personal ainda não cadastrou treinos na biblioteca.</p>
          </div>
        ) : (
          workouts.map((workout) => (
            <div 
              key={workout.id} 
              className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${workout.isNext ? 'bg-card border-primary/50 shadow-[0_4px_20px_rgba(16,185,129,0.1)]' : 'bg-background border-border hover:border-primary/30'}`}
            >
              {workout.isNext && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-400" />
              )}
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    {workout.isNext && (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary mb-2">
                        Treino do Dia
                      </span>
                    )}
                    <h2 className="text-lg font-bold text-foreground">{workout.name}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{workout.category}</p>
                  </div>
                  
                  {workout.isNext ? (
                    <button 
                      onClick={() => router.push('/student/today')}
                      className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                    >
                      <Play size={18} className="ml-0.5" />
                    </button>
                  ) : (
                    <button onClick={() => router.push('/student/today')} className="w-8 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center hover:bg-secondary/80 transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-border mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Clock size={14} />
                    <span>{workout.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Dumbbell size={14} />
                    <span>{workout.exercises} exercícios</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground ml-auto bg-secondary px-2 py-1 rounded-md">
                    Último: {workout.lastCompleted}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
