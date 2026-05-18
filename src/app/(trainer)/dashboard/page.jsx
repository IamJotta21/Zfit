"use client";
import Link from "next/link";
import { Users, TrendingUp, CheckCircle, AlertTriangle, Check, Info, CreditCard, MessageCircle } from "lucide-react";
// Componente para desenhar o mini-gráfico (Sparkline) sutil
const Sparkline = ({ data, color }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    // Normaliza os pontos para encaixar num SVG de 100x30
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 30 - ((val - min) / range) * 30;
        return `${x},${y}`;
    }).join(" ");
    return (<svg className="w-16 h-8 opacity-40" viewBox="0 -5 100 40" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points}/>
    </svg>);
};
export default function DashboardOverviewPage() {
    // Dados simulados para os mini-gráficos
    const alunosData = [35, 36, 38, 38, 40, 40, 41];
    const treinosData = [2, 4, 3, 7, 5, 8, 12];
    const frequenciaData = [75, 78, 80, 82, 81, 85, 87];
    // Dados simulados para Ações Críticas
    const criticalAlerts = [
        { id: 1, name: "Marcos Silva", days: 8, phone: "5511999999999" },
        { id: 2, name: "Juliana Costa", days: 12, phone: "5511999999998" },
        { id: 3, name: "Roberto Alves", days: 7, phone: "5511999999997" },
    ];
    return (<div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold">Visão Geral</h1>
        <p className="text-muted-foreground">Bem-vindo de volta! Aqui está o resumo analítico da sua operação.</p>
      </div>

      {/* Grade Principal de Indicadores (KPIs) com textura sutil e Sparklines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card Interativo: Total de Alunos Ativos */}
        <Link href="/dashboard/students" className="bg-card border border-border p-6 rounded-xl shadow-sm hover:border-primary/50 hover:bg-secondary/30 transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden">
          {/* Fundo de textura premium sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"/>
          
          <div className="flex items-center justify-between mb-2 relative z-10">
            <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Alunos Ativos
            </h3>
            <Users size={20} className="text-primary"/>
          </div>
          <div className="flex items-end justify-between mt-auto relative z-10">
            <div>
              <p className="text-3xl font-bold">41</p>
              <p className="text-xs text-muted-foreground mt-1 group-hover:text-primary transition-colors">Acessar CRM</p>
            </div>
            {/* Mini gráfico verde esmeralda */}
            <Sparkline data={alunosData} color="#10b981"/>
          </div>
        </Link>
        
        {/* Card: Treinos Concluídos */}
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"/>
          <div className="flex items-center justify-between mb-2 relative z-10">
            <h3 className="text-sm font-medium text-muted-foreground">Treinos Concluídos Hoje</h3>
            <CheckCircle size={20} className="text-primary"/>
          </div>
          <div className="flex items-end justify-between mt-auto relative z-10">
            <div>
              <p className="text-3xl font-bold">12</p>
              <p className="text-xs text-primary mt-1">+4 na última hora</p>
            </div>
            {/* Mini gráfico verde esmeralda */}
            <Sparkline data={treinosData} color="#10b981"/>
          </div>
        </div>

        {/* Card: Taxa de Frequência */}
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"/>
          <div className="flex items-center justify-between mb-2 relative z-10">
            <h3 className="text-sm font-medium text-muted-foreground">Taxa de Frequência</h3>
            <TrendingUp size={20} className="text-primary"/>
          </div>
          <div className="flex items-end justify-between mt-auto relative z-10">
            <div>
              <p className="text-3xl font-bold">87%</p>
              <p className="text-xs text-muted-foreground mt-1">Média ideal semanal</p>
            </div>
            {/* Mini gráfico verde esmeralda */}
            <Sparkline data={frequenciaData} color="#10b981"/>
          </div>
        </div>

        {/* Card: Alertas de Ausência */}
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm border-l-4 border-l-orange-500 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"/>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-sm font-medium text-orange-500">Alertas de Ausência</h3>
            <AlertTriangle size={20} className="text-orange-500"/>
          </div>
          <div className="relative z-10">
            <p className="text-3xl font-bold">{criticalAlerts.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Alunos inativos nos últimos 7 dias</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Seção 1: Atividade em Tempo Real (Feed de Eventos) */}
        <section className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col h-full">
          <h2 className="text-lg font-bold mb-6 border-b border-border pb-2">Atividade Recente</h2>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            
            {/* Exemplo 1: Sucesso (Treino Concluído) */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border border-card bg-primary/20 text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Check size={14} strokeWidth={3}/>
              </div>
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2rem)] p-3 rounded-lg border border-border bg-background shadow-sm ml-4 md:ml-0">
                <p className="text-sm text-foreground">
                  <span className="font-bold">Ana Beatriz</span> concluiu o &apos;Treino A — Força&apos;
                </p>
                <span className="text-xs text-muted-foreground mt-1 block">há 5 min</span>
              </div>
            </div>

            {/* Exemplo 2: Feedback (Alerta de Carga) */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border border-card bg-blue-500/20 text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Info size={14} strokeWidth={3}/>
              </div>
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2rem)] p-3 rounded-lg border border-border bg-background shadow-sm ml-4 md:ml-0">
                <p className="text-sm text-foreground">
                  <span className="font-bold">Carlos Mota</span> reportou carga &apos;Muito Pesada&apos; no Agachamento
                </p>
                <span className="text-xs text-muted-foreground mt-1 block">há 20 min</span>
              </div>
            </div>

            {/* Exemplo 3: Financeiro (Assinatura Confirmada) */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border border-card bg-secondary text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <CreditCard size={14} strokeWidth={3}/>
              </div>
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2rem)] p-3 rounded-lg border border-border bg-background shadow-sm ml-4 md:ml-0">
                <p className="text-sm text-foreground">
                  Nova assinatura confirmada para <span className="font-bold">Diego Fonseca</span>
                </p>
                <span className="text-xs text-muted-foreground mt-1 block">há 1 hora</span>
              </div>
            </div>

          </div>
        </section>

        {/* Seção 2: Painel de Resolução de Alertas (Ações Críticas Necessárias) */}
        <section className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6 border-b border-border pb-2">
            <h2 className="text-lg font-bold">Ações Críticas Necessárias</h2>
            <span className="bg-orange-500/20 text-orange-500 text-xs font-bold px-2 py-1 rounded-md">
              {criticalAlerts.length} Pendências
            </span>
          </div>

          <div className="space-y-4">
            {criticalAlerts.map(alert => (<div key={alert.id} className="bg-background border border-border rounded-lg p-4 flex items-center justify-between hover:border-orange-500/50 transition-colors group">
                <div>
                  <h4 className="font-bold text-sm text-foreground">{alert.name}</h4>
                  <p className="text-xs text-orange-400 mt-1 flex items-center gap-1">
                    <AlertTriangle size={12}/>
                    Inativo há {alert.days} dias
                  </p>
                </div>
                
                {/* Botão de Ação Rápida WhatsApp */}
                <a href={`https://wa.me/${alert.phone}?text=Olá ${alert.name}, notamos que você não treina há alguns dias. Está tudo bem?`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-secondary text-foreground hover:bg-secondary/80 text-xs font-bold px-3 py-2 rounded-md transition-colors">
                  <MessageCircle size={14} className="text-[#25D366]"/>
                  Contatar Aluno
                </a>
              </div>))}
          </div>

          {criticalAlerts.length === 0 && (<div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground py-8">
              <CheckCircle size={32} className="text-primary/50 mb-2"/>
              <p className="text-sm">Nenhum aluno em risco de abandono.</p>
              <p className="text-xs mt-1">Sua retenção está excelente!</p>
            </div>)}
        </section>

      </div>
    </div>);
}
