"use client";
import { useState, useEffect } from "react";
import { Flame, PlayCircle, History, CheckCircle2, Circle, Clock, ChevronDown, Activity, Loader2 } from "lucide-react";
import { WorkoutCompletionModal } from "@/components/student/WorkoutCompletionModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

export default function TodayWorkoutPage() {
    const [workoutName, setWorkoutName] = useState("Carregando Treino...");
    const [estimatedDuration, setEstimatedDuration] = useState(45);
    const [objective, setObjective] = useState("Hipertrofia");
    const [exercises, setExercises] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    // Timer de Descanso Ativo
    const [activeRest, setActiveRest] = useState(null);

    // Busca o treino real cadastrado pelo Personal no backend
    useEffect(() => {
        async function fetchTreinoDoDia() {
            try {
                const res = await fetch(`${API_URL}/treinos`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        const t = data[0]; // Pega o primeiro treino da biblioteca como o Treino do Dia
                        setWorkoutName(t.nome_treino || "Treino do Dia");
                        setEstimatedDuration(t.nivel === "Iniciante" ? 45 : t.nivel === "Avançado" ? 65 : 50);
                        setObjective(t.objetivo || "Hipertrofia Geral");

                        if (t.exercicios && t.exercicios.length > 0) {
                            const formattedExercises = t.exercicios.map((ex, idx) => ({
                                id: String(idx + 1),
                                name: ex.exerciseName || "Exercício",
                                sets: Number(ex.setsCount) || 4,
                                reps: ex.repsOrRpe || "10-12",
                                rest: Number(ex.restSeconds) || 60,
                                historicalLoad: ex.loadKg ? `${ex.loadKg}kg` : "18kg",
                                completedSets: new Array(Number(ex.setsCount) || 4).fill(false)
                            }));
                            setExercises(formattedExercises);
                            setExpandedId(formattedExercises[0]?.id);
                        }
                    } else {
                        // Fallback se não houver treinos cadastrados
                        setWorkoutName("Treino de Demonstração (Peito/Ombro)");
                        setExercises([
                            { id: "1", name: "Supino Reto com Halteres", sets: 4, reps: "8-10", rest: 90, historicalLoad: "22kg", completedSets: [false, false, false, false] },
                            { id: "2", name: "Desenvolvimento Arnold", sets: 3, reps: "10-12", rest: 60, historicalLoad: "14kg", completedSets: [false, false, false] }
                        ]);
                        setExpandedId("1");
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar treino do dia:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTreinoDoDia();
    }, []);

    useEffect(() => {
      let interval;
      if (activeRest !== null && activeRest > 0) {
        interval = setInterval(() => {
          setActiveRest(prev => prev - 1);
        }, 1000);
      } else if (activeRest === 0) {
        setActiveRest(null);
      }
      return () => clearInterval(interval);
    }, [activeRest]);

    const toggleSet = (exerciseIndex, setIndex, restSeconds) => {
        const newExercises = [...exercises];
        const isCurrentlyCompleted = newExercises[exerciseIndex].completedSets[setIndex];
        
        newExercises[exerciseIndex].completedSets[setIndex] = !isCurrentlyCompleted;
        setExercises(newExercises);

        // Se marcou como concluído, inicia o timer de descanso
        if (!isCurrentlyCompleted) {
          setActiveRest(restSeconds);
        }
    };

    const isWorkoutFinished = exercises.length > 0 && exercises.every(ex => ex.completedSets.every(set => set));

    return (<>
      <div className="space-y-6 mt-4">
        {/* Header & Streak */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hoje</h1>
            <p className="text-muted-foreground text-sm">Treino Sincronizado</p>
          </div>
          <div className="flex items-center gap-1 bg-orange-500/10 text-orange-500 px-3 py-1.5 rounded-full font-bold">
            <Flame size={18}/>
            <span>11 Dias</span>
          </div>
        </div>

        {/* Workout Info */}
        <div className="bg-card border border-border p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-black">{workoutName}</h2>
            <span className="text-xs font-semibold bg-secondary px-2 py-1 rounded-md text-muted-foreground">
              {estimatedDuration} min
            </span>
          </div>
          <p className="text-sm text-primary font-medium">Foco em {objective}. Bom treino!</p>
        </div>

        {/* Exercises Stack */}
        <div className="space-y-3 pb-24 max-w-md mx-auto">
          {isLoading ? (
            <div className="text-center py-16 bg-card border border-border rounded-2xl">
              <Loader2 className="animate-spin text-primary mx-auto mb-3" size={32} />
              <p className="text-sm font-bold text-muted-foreground">Carregando exercícios do Personal...</p>
            </div>
          ) : exercises.map((ex, index) => {
            const isExpanded = expandedId === ex.id;
            return (<div key={ex.id} className={`border border-border rounded-2xl overflow-hidden transition-all duration-300 ${isExpanded ? 'bg-card shadow-md' : 'bg-background'}`}>
                {/* Header (always visible) */}
                <div className="p-4 flex items-center justify-between cursor-pointer group" onClick={() => setExpandedId(isExpanded ? null : ex.id)}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors ${isExpanded ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground group-hover:bg-primary/20'}`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className={`font-bold text-base transition-colors ${isExpanded ? 'text-foreground' : 'text-foreground/80'}`}>{ex.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{ex.sets} séries x {ex.reps} reps • Desc. {ex.rest}s</p>
                    </div>
                  </div>
                  <ChevronDown size={20} className={`text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`}/>
                </div>

                {/* Expanded Content */}
                {isExpanded && (<div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                    
                    <div className="bg-secondary/50 rounded-xl p-3 mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <History size={16}/>
                        <span>Carga recomendada:</span>
                      </div>
                      <span className="font-bold text-primary">{ex.historicalLoad}</span>
                    </div>

                    <div className="space-y-3">
                      {ex.completedSets.map((isCompleted, setIndex) => (<div key={setIndex} className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 ${isCompleted ? 'border-primary/50 bg-primary/5 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'border-border bg-background hover:border-primary/30'}`}>
                          <div className="flex items-center gap-3">
                            <span className={`font-bold text-sm ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`}>
                              Série {setIndex + 1}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <span className="block text-[10px] text-muted-foreground uppercase font-bold mb-0.5">Reps</span>
                              <span className={`text-sm font-bold ${isCompleted ? 'text-foreground' : 'text-foreground/70'}`}>{ex.reps}</span>
                            </div>
                            <button onClick={() => toggleSet(index, setIndex, ex.rest)} className="transition-transform active:scale-90">
                              {isCompleted ? (<CheckCircle2 size={32} className="text-primary drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-in zoom-in duration-200"/>) : (<Circle size={32} className="text-muted-foreground/40 hover:text-primary/50 transition-colors"/>)}
                            </button>
                          </div>
                        </div>))}
                    </div>

                  </div>)}
              </div>);
          })}
        </div>
      </div>

      {/* Widget de Descanso Ativo (Flutuante) */}
      <div className={`fixed bottom-[140px] left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${activeRest !== null ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-card/90 backdrop-blur-md border border-primary/30 shadow-[0_0_30px_rgba(16,185,129,0.2)] rounded-full px-6 py-3 flex items-center gap-3">
          <Clock size={20} className="text-primary animate-pulse" />
          <span className="font-bold text-lg text-foreground">
            {activeRest !== null ? `${Math.floor(activeRest / 60)}:${String(activeRest % 60).padStart(2, '0')}` : '0:00'}
          </span>
          <span className="text-xs text-primary font-bold uppercase tracking-wider ml-1">Descanso</span>
        </div>
      </div>

      {/* Sticky Footer Button */}
      <div className="fixed bottom-[80px] left-0 w-full px-4 z-40 max-w-md mx-auto right-0">
        <button onClick={() => setIsModalOpen(true)} className={`w-full py-4 rounded-2xl font-black text-lg shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 ${isWorkoutFinished
            ? 'bg-primary text-primary-foreground scale-100 animate-bounce-slight'
            : 'bg-secondary text-muted-foreground scale-[0.98] border border-border hover:bg-secondary/80'}`}>
          {isWorkoutFinished ? (
            <>
              <Activity size={20} />
              FINALIZAR TREINO
            </>
          ) : "ENCERRAR ANTECIPADO"}
        </button>
      </div>

      <WorkoutCompletionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
    </>);
}
