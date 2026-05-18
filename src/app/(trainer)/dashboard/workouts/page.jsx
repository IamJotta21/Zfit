"use client";
import { useState, useMemo, useEffect } from "react";
import { Plus, Search, GripVertical, Trash2, Video, Save, X, Dumbbell, Activity } from "lucide-react";
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

export default function WorkoutConstructorPage() {
    const [isCreating, setIsCreating] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Estados do formulário de treino
    const [workoutName, setWorkoutName] = useState("");
    const [objective, setObjective] = useState("Hipertrofia");
    const [level, setLevel] = useState("Intermediário");
    const [coachNotes, setCoachNotes] = useState("");
    const [exercises, setExercises] = useState([
        { id: "1", exerciseName: "Supino Reto com Barra", setsCount: 4, repsOrRpe: "8-10", loadKg: 60, restSeconds: 90, videoUrl: "" }
    ]);
    // Carrega os treinos do backend
    const fetchTemplates = async () => {
        try {
            const res = await fetch(`${API_URL}/treinos`);
            if (res.ok) {
                const data = await res.json();
                setTemplates(data);
            }
        } catch (error) {
            console.error("Erro ao buscar treinos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    // Abre o editor limpando os campos
    const handleNewWorkout = () => {
        setIsCreating(true);
        setSelectedTemplateId(null);
        setWorkoutName("");
        setObjective("Hipertrofia");
        setLevel("Iniciante");
        setCoachNotes("");
        setExercises([
            { id: Date.now().toString(), exerciseName: "", setsCount: 3, repsOrRpe: "10", loadKg: "", restSeconds: 60, videoUrl: "" }
        ]);
    };
    // Abre o editor carregando um template real
    const handleSelectTemplate = (id) => {
        const tpl = templates.find(t => t.id === id);
        if (!tpl) return;
        
        setIsCreating(true);
        setSelectedTemplateId(id);
        setWorkoutName(tpl.nome_treino);
        setObjective(tpl.objetivo || "Hipertrofia");
        setLevel(tpl.nivel || "Intermediário");
        setCoachNotes(tpl.observacoes || "");
        
        // Carrega a matriz JSONB salva
        if (tpl.exercicios && tpl.exercicios.length > 0) {
            setExercises(tpl.exercicios);
        } else {
            setExercises([
                { id: Date.now().toString(), exerciseName: "", setsCount: 3, repsOrRpe: "10", loadKg: "", restSeconds: 60, videoUrl: "" }
            ]);
        }
    };
    const addExercise = () => {
        setExercises([
            ...exercises,
            { id: Date.now().toString(), exerciseName: "", setsCount: 3, repsOrRpe: "10", loadKg: "", restSeconds: 60, videoUrl: "" }
        ]);
    };
    const removeExercise = (id) => {
        setExercises(exercises.filter(ex => ex.id !== id));
    };
    const updateExercise = (id, field, value) => {
        setExercises(exercises.map(ex => ex.id === id ? { ...ex, [field]: value } : ex));
    };
    const moveUp = (index) => {
        if (index === 0)
            return;
        const newExercises = [...exercises];
        const temp = newExercises[index - 1];
        newExercises[index - 1] = newExercises[index];
        newExercises[index] = temp;
        setExercises(newExercises);
    };
    const handleSave = async () => {
        if (!workoutName) {
            alert("Por favor, insira um nome para o treino.");
            return;
        }
        setIsSaving(true);
        try {
            const payload = {
                nome_treino: workoutName,
                objetivo,
                nivel,
                observacoes: coachNotes,
                exercicios,
                aluno_id: null // Modelo global da biblioteca
            };

            const res = await fetch(`${API_URL}/treinos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Treino salvo na biblioteca com sucesso!");
                fetchTemplates(); // Recarrega a lista
                setIsCreating(false);
                setSelectedTemplateId(null);
            } else {
                alert("Erro ao salvar o treino.");
            }
        } catch (error) {
            console.error("Erro no salvamento:", error);
            alert("Falha ao comunicar com o servidor.");
        } finally {
            setIsSaving(false);
        }
    };
    const handleCancel = () => {
        setIsCreating(false);
        setSelectedTemplateId(null);
    };
    // Cálculo de Carga de Volume Total: SUM(Séries * Reps * Carga)
    const totalVolume = useMemo(() => {
        return exercises.reduce((acc, ex) => {
            const sets = parseInt(ex.setsCount) || 0;
            // Extrai o primeiro número encontrado no campo de Reps/RPE (ex: "8-10" -> 8)
            const repsMatch = String(ex.repsOrRpe).match(/\d+/);
            const reps = repsMatch ? parseInt(repsMatch[0]) : 0;
            const load = parseFloat(ex.loadKg) || 0;
            return acc + (sets * reps * load);
        }, 0);
    }, [exercises]);
    return (<div className="h-full flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Biblioteca de Treinos</h1>
          <p className="text-muted-foreground mt-1">Crie modelos globais ou treinos avulsos para atribuir aos seus alunos.</p>
        </div>
        
        <button onClick={handleNewWorkout} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-bold flex items-center gap-2 hover:bg-primary/90 transition shadow-lg shadow-primary/20 shrink-0">
          <Plus size={18}/>
          Novo Treino na Biblioteca
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start h-[calc(100vh-180px)]">
        
        {/* COLUNA ESQUERDA: Lista da Biblioteca */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-4 h-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16}/>
            <input type="text" placeholder="Buscar treinos salvos..." className="w-full bg-card border border-border rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/70"/>
          </div>
          
          <div className="flex-1 bg-card border border-border rounded-xl flex flex-col overflow-hidden shadow-sm">
            <div className="p-3 bg-secondary/50 border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Treinos Salvos ({templates.length})
            </div>
            <div className="overflow-y-auto p-2 flex-1 space-y-1">
              {isLoading ? (
                <div className="text-center py-4 text-xs text-muted-foreground">Carregando biblioteca...</div>
              ) : templates.length === 0 ? (
                <div className="text-center py-4 text-xs text-muted-foreground">Nenhum treino na biblioteca.</div>
              ) : (
                templates.map((tpl) => (<div key={tpl.id} onClick={() => handleSelectTemplate(tpl.id)} className={`p-3 rounded-lg cursor-pointer transition-colors border ${selectedTemplateId === tpl.id
                  ? "bg-primary/10 border-primary/30"
                  : "bg-transparent border-transparent hover:bg-secondary/60"}`}>
                    <h4 className={`font-bold text-sm ${selectedTemplateId === tpl.id ? "text-primary" : "text-foreground"}`}>
                      {tpl.nome_treino}
                    </h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] bg-background border border-border text-muted-foreground px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                        <Dumbbell size={10}/>
                        {tpl.exercicios ? tpl.exercicios.length : 0} Excs
                      </span>
                      <span className="text-[10px] bg-background border border-border text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                        {tpl.objetivo}
                      </span>
                    </div>
                  </div>))
              )}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: Construtor (Estúdio de Montagem) */}
        <div className="flex-1 w-full flex flex-col bg-card border border-border rounded-xl shadow-sm h-full overflow-hidden">
          {!isCreating ? (<div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-6">
              <Dumbbell size={48} className="mb-4 opacity-20"/>
              <h2 className="text-xl font-bold mb-2 text-foreground">Selecione ou Crie um Treino</h2>
              <p className="max-w-sm text-sm">
                Selecione um modelo salvo na lista ao lado para editá-lo ou clique em "Novo Treino" para iniciar uma montagem do zero.
              </p>
            </div>) : (<div className="flex flex-col h-full relative">
              
              {/* 1. CABEÇALHO DO CONSTRUTOR */}
              <div className="p-6 border-b border-border bg-background/50 space-y-4 shrink-0">
                <input type="text" value={workoutName} onChange={(e) => setWorkoutName(e.target.value)} placeholder="Nome do Treino (Ex: Força Pura - Pernas)" className="w-full text-2xl font-bold bg-transparent border-none p-0 focus:outline-none focus:ring-0 placeholder:text-muted-foreground/50"/>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Objetivo</label>
                    <select value={objective} onChange={(e) => setObjective(e.target.value)} className="bg-card border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground">
                      <option value="Hipertrofia">Hipertrofia</option>
                      <option value="Força">Força</option>
                      <option value="Emagrecimento">Emagrecimento</option>
                      <option value="Condicionamento">Condicionamento</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nível</label>
                    <select value={level} onChange={(e) => setLevel(e.target.value)} className="bg-card border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground">
                      <option value="Iniciante">Iniciante</option>
                      <option value="Intermediário">Intermediário</option>
                      <option value="Avançado">Avançado</option>
                    </select>
                  </div>
                  
                  {/* Widget: Carga de Volume Total */}
                  <div className="flex flex-col gap-1 ml-auto bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-lg">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                      <Activity size={12}/> Carga de Volume Total
                    </label>
                    <span className="text-xl font-bold text-primary text-right">{totalVolume.toLocaleString('pt-BR')} kg</span>
                  </div>
                </div>

                {/* Bloco de Observações */}
                <div className="mt-4 bg-secondary/30 border-l-2 border-primary p-3 rounded-r-lg">
                  <textarea value={coachNotes} onChange={(e) => setCoachNotes(e.target.value)} placeholder="Observações Gerais do Personal (ex: Aquecimento no elíptico por 10min; Focar na cadência 3-0-1-0)." className="w-full bg-transparent border-none text-sm focus:outline-none resize-none placeholder:text-muted-foreground" rows={2}/>
                </div>
              </div>

              {/* 2. MATRIZ DINÂMICA DE EXERCÍCIOS */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3 pb-32">
                <div className="flex gap-2 text-[11px] font-bold text-muted-foreground px-8 uppercase tracking-wider mb-2">
                  <div className="flex-1">Exercício</div>
                  <div className="w-16 text-center">Séries</div>
                  <div className="w-20 text-center">Reps/RPE</div>
                  <div className="w-16 text-center">Carga(kg)</div>
                  <div className="w-16 text-center">Desc (s)</div>
                  <div className="w-16"></div>
                </div>

                {exercises.map((ex, index) => (<div key={ex.id} className="flex gap-3 items-start bg-secondary/20 p-3 rounded-lg border border-transparent hover:border-border group transition-all">
                    <button onClick={() => moveUp(index)} className="mt-1.5 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 transition-opacity" title="Mover para cima">
                      <GripVertical size={16}/>
                    </button>
                    
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex gap-2">
                        {/* Seletor do Exercício - Sugestão visual de select mas text field funcional por simplicidade */}
                        <div className="flex-1 relative">
                          <input type="text" value={ex.exerciseName} onChange={(e) => updateExercise(ex.id, "exerciseName", e.target.value)} placeholder="Buscar exercício..." className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium"/>
                        </div>
                        
                        <input type="number" value={ex.setsCount} onChange={(e) => updateExercise(ex.id, "setsCount", parseInt(e.target.value))} className="w-16 bg-background border border-border rounded-md px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary"/>
                        <input type="text" value={ex.repsOrRpe} onChange={(e) => updateExercise(ex.id, "repsOrRpe", e.target.value)} placeholder="Ex: 10" className="w-20 bg-background border border-border rounded-md px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary"/>
                        <input type="number" value={ex.loadKg} onChange={(e) => updateExercise(ex.id, "loadKg", e.target.value)} placeholder="Kg" className="w-16 bg-background border border-border rounded-md px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary"/>
                        <input type="number" value={ex.restSeconds} onChange={(e) => updateExercise(ex.id, "restSeconds", parseInt(e.target.value))} placeholder="Segs" className="w-16 bg-background border border-border rounded-md px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary"/>
                      </div>
                      
                      {/* URL do Video Embutido em collapse elegante */}
                      <div className="flex items-center gap-2">
                        <Video size={14} className="text-muted-foreground shrink-0"/>
                        <input type="text" value={ex.videoUrl} onChange={(e) => updateExercise(ex.id, "videoUrl", e.target.value)} placeholder="Link da execução no YouTube ou Vimeo (Opcional)" className="flex-1 bg-transparent border-none text-[11px] text-muted-foreground focus:outline-none placeholder:text-muted-foreground/40"/>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 mt-1">
                      <button onClick={() => removeExercise(ex.id)} className="text-muted-foreground hover:text-destructive p-1.5 rounded-md hover:bg-destructive/10 transition-colors" title="Remover exercício">
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </div>))}

                <button onClick={addExercise} className="w-full mt-4 py-3 border-2 border-dashed border-border rounded-lg text-sm text-muted-foreground font-bold hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                  <Plus size={16}/>
                  Adicionar Exercício
                </button>
              </div>

              {/* 3. RODAPÉ DE AÇÕES DA BIBLIOTECA */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card/95 backdrop-blur-sm flex items-center justify-end gap-3 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
                <button onClick={handleCancel} className="px-4 py-2 border border-border bg-transparent hover:bg-secondary text-foreground text-sm font-bold rounded-md transition-colors flex items-center gap-2">
                  <X size={16}/>
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50">
                  <Save size={16}/>
                  {isSaving ? "Salvando..." : "Salvar na Biblioteca"}
                </button>
              </div>

            </div>)}
        </div>

      </div>
    </div>);
}
