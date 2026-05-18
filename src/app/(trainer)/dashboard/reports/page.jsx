"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Activity, Filter, Download, MessageCircle } from "lucide-react";
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

export default function ReportsPage() {
    const [events, setEvents] = useState([]);
    const [studentsList, setStudentsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasSimulatedCron, setHasSimulatedCron] = useState(false);
    // Filtros
    const [filterStudent, setFilterStudent] = useState("ALL");
    const [filterPeriod, setFilterPeriod] = useState("TODAY");
    const [filterStatus, setFilterStatus] = useState("ALL");

    useEffect(() => {
        async function fetchRelatorios() {
            try {
                const res = await fetch(`${API_URL}/relatorios`);
                if (res.ok) {
                    const data = await res.json();
                    setEvents(data.feed_atividades || []);
                    setStudentsList(data.alunos_lista || []);
                }
            } catch (error) {
                console.error("Erro ao buscar relatórios:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchRelatorios();
    }, []);

    // Simula um Cron Job sendo executado no final do dia
    useEffect(() => {
        if (hasSimulatedCron || isLoading || events.length === 0)
            return;
        const timer = setTimeout(() => {
            const incompleteEvent = {
                id: Date.now().toString(),
                studentId: studentsList[0]?.id || "1",
                studentName: studentsList[0]?.name || "Carlos Eduardo",
                date: new Date().toISOString().split('T')[0], // Hoje
                time: "23:59",
                workoutName: "Mobilidade e Core",
                durationMinutes: 0,
                rpeRating: "N/A",
                type: "incomplete",
            };
            setEvents(prev => [incompleteEvent, ...prev]);
            setHasSimulatedCron(true);
        }, 4000);
        return () => clearTimeout(timer);
    }, [hasSimulatedCron, isLoading, studentsList]);
    // Aplicação dos Filtros
    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            // Filtro de Aluno
            if (filterStudent !== "ALL" && event.studentId !== filterStudent)
                return false;
            // Filtro de Status
            if (filterStatus !== "ALL" && event.type !== filterStatus)
                return false;
            // Filtro de Período (Simplificado para o mock)
            const today = new Date().toISOString().split('T')[0];
            if (filterPeriod === "TODAY" && event.date !== today)
                return false;
            // Para '7DAYS' ou 'MONTH', aceitamos datas passadas (no mock, todas passam para fins de demonstração)
            return true;
        });
    }, [events, filterStudent, filterStatus, filterPeriod]);
    // Cálculo Dinâmico para os Mini-cards de Sumário
    const totalCompleted = filteredEvents.filter(e => e.type === "completed").length;
    const totalIncomplete = filteredEvents.filter(e => e.type === "incomplete").length;
    const totalEvents = filteredEvents.length;
    // Aproveitamento: (Concluídos / Total) * 100
    const aproveitamento = totalEvents > 0 ? Math.round((totalCompleted / totalEvents) * 100) : 0;
    // Duração média de treinos concluídos
    const avgDuration = totalCompleted > 0
        ? Math.round(filteredEvents.filter(e => e.type === "completed").reduce((acc, curr) => acc + curr.durationMinutes, 0) / totalCompleted)
        : 0;
    return (<div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* CABEÇALHO SUPERIOR (Com Botão de Exportação) */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Relatórios Avançados</h1>
          <p className="text-muted-foreground mt-1">Filtre as atividades, check-ins e faltas dos seus alunos.</p>
        </div>
        <button className="flex items-center gap-2 border border-border bg-card hover:bg-secondary text-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm mt-1">
          <Download size={16}/>
          Exportar Relatório
        </button>
      </div>

      {/* PAINEL DE FILTROS FLEXÍVEL */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-2 text-muted-foreground mr-2">
          <Filter size={18}/>
          <span className="text-sm font-bold uppercase tracking-wider">Filtros:</span>
        </div>
        
        <select value={filterStudent} onChange={(e) => setFilterStudent(e.target.value)} className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary flex-1 font-medium">
          <option value="ALL">Todos os Alunos</option>
          {studentsList.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
        </select>

        <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)} className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary flex-1 font-medium">
          <option value="ALL">Todo o Período</option>
          <option value="TODAY">Hoje</option>
          <option value="7DAYS">Últimos 7 dias</option>
          <option value="MONTH">Este Mês</option>
        </select>

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary flex-1 font-medium">
          <option value="ALL">Todos os Status</option>
          <option value="completed">Concluídos</option>
          <option value="incomplete">Incompletos/Faltas</option>
        </select>
      </div>

      {/* COMPONENTES DE SUMÁRIO ANALÍTICO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Aproveitamento Diário</h3>
          <p className="text-3xl font-bold">{aproveitamento}%</p>
          <p className="text-xs text-muted-foreground mt-1">Dos alunos esperados no período</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Tempo Médio (Sessão)</h3>
          <p className="text-3xl font-bold">{avgDuration}<span className="text-lg font-normal text-muted-foreground ml-1">min</span></p>
          <p className="text-xs text-muted-foreground mt-1">Tempo médio dentro da academia</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider mb-2">Alertas Gerados</h3>
          <p className="text-3xl font-bold text-orange-500">{totalIncomplete}</p>
          <p className="text-xs text-muted-foreground mt-1">Treinos incompletos ou expirados</p>
        </div>
      </div>

      {/* LISTA / TIMELINE DINÂMICA */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm min-h-[500px]">
        <h2 className="text-lg font-bold mb-8 flex items-center gap-2">
          <Activity className="text-primary" size={20}/>
          Resultados da Análise
        </h2>

        {isLoading ? (
          <div className="text-center text-muted-foreground py-12 italic border border-dashed border-border rounded-xl">
            Carregando feed de atividades do servidor...
          </div>
        ) : filteredEvents.length === 0 ? (<div className="text-center text-muted-foreground py-12 italic border border-dashed border-border rounded-xl">
            Nenhum evento encontrado para os filtros selecionados.
          </div>) : (<div className="relative border-l border-border ml-4 space-y-8">
            {filteredEvents.map((event) => (<div key={event.id} className="relative pl-8 group">
                
                {/* Ícone / Indicador da Timeline */}
                <div className={`absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center border-4 border-card ${event.type === "completed" ? "bg-primary" : "bg-orange-500"}`}>
                  {event.type === "completed" ? (<CheckCircle2 size={12} className="text-primary-foreground"/>) : (<Clock size={12} className="text-primary-foreground"/>)}
                </div>

                {/* Conteúdo do Evento */}
                <div className={`p-4 rounded-xl border transition-colors ${event.type === "completed"
                    ? "bg-secondary/10 border-border hover:border-primary/30"
                    : "bg-orange-500/5 border-orange-500/20 hover:border-orange-500/50"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-base flex items-center gap-2">
                      {/* Interatividade nos Nomes dos Alunos */}
                      <Link href={`/dashboard/students/${event.studentId}`} className="text-foreground hover:text-primary transition-colors underline decoration-transparent hover:decoration-primary underline-offset-4">
                        {event.studentName}
                      </Link>
                      
                      {event.type === "incomplete" && (<span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-sm uppercase tracking-wider font-bold">
                          Não Concluiu
                        </span>)}
                    </h3>
                    <div className="text-xs font-medium text-muted-foreground flex items-center gap-3">
                      <span className="bg-background px-2 py-1 rounded-md border border-border/50">{event.date}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12}/>
                        {event.time}
                      </span>
                    </div>
                  </div>
                  
                  {/* Renderização Condicional baseada no Tipo de Evento */}
                  {event.type === "completed" ? (<div className="text-sm text-muted-foreground space-y-1">
                      <p>Concluiu o <strong className="text-foreground">{event.workoutName}</strong> com sucesso.</p>
                      <div className="flex gap-4 mt-3">
                        <span className="bg-background px-2 py-1 rounded text-xs border border-border/50 font-medium text-foreground">
                          ⏱ {event.durationMinutes} minutos
                        </span>
                        <span className="bg-background px-2 py-1 rounded text-xs border border-border/50 font-medium text-foreground">
                          🔥 RPE: {event.rpeRating}/10
                        </span>
                      </div>
                    </div>) : (<div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <p className="text-sm text-orange-400">
                        O treino agendado <strong className="text-orange-500">'{event.workoutName}'</strong> expirou às 23:59 sem marcação de conclusão.
                      </p>
                      {/* Botão Discreto de Notificação */}
                      <button className="flex items-center justify-center gap-2 bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white px-3 py-1.5 rounded-md text-xs font-bold transition-colors shrink-0">
                        <MessageCircle size={14}/>
                        Notificar Aluno
                      </button>
                    </div>)}
                </div>
              </div>))}

            <div className="relative pl-8 pt-4">
              <div className="absolute -left-2.5 top-5 w-5 h-5 rounded-full bg-border border-4 border-card"/>
              <p className="text-sm text-muted-foreground italic">Fim dos resultados</p>
            </div>
          </div>)}
      </div>
    </div>);
}
