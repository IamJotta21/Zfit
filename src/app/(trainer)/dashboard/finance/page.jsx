"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Activity, DollarSign, Users, AlertCircle, Link as LinkIcon, MoreHorizontal, Save, Loader2, AlertTriangle } from "lucide-react";
// Definição dos Planos Comerciais Fixos
const FIXED_PLANS = [
    { id: "base", name: "Plano Base", price: 49.90, limitText: "Até 10 alunos matriculados", currentStudents: 8, maxStudents: 10, isActive: true },
    { id: "ouro", name: "Plano Ouro", price: 69.90, limitText: "Até 25 alunos matriculados", currentStudents: 18, maxStudents: 25, isActive: true },
    { id: "platina", name: "Plano Platina", price: 79.90, limitText: "Até 50 alunos matriculados", currentStudents: 41, maxStudents: 50, isActive: true },
];
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';
export default function FinancePage() {
    const router = useRouter();
    // Estado da tabela de faturamento individual (editável inline)
    const [billings, setBillings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    
    // Rastreia apenas as linhas modificadas
    const [modifiedRows, setModifiedRows] = useState({});

    useEffect(() => {
        async function fetchFinanceiro() {
            try {
                const res = await fetch(`${API_URL}/financeiro`);
                if (res.ok) {
                    const data = await res.json();
                    const formatted = data.map(f => ({
                        id: f.id,
                        aluno_id: f.aluno_id,
                        studentName: f.alunos?.nome || "Aluno",
                        planId: f.plano.toLowerCase(),
                        startDate: f.data_inicio,
                        dueDate: f.data_vencimento,
                        customValue: Number(f.valor_personalizado),
                        status: f.status_pagamento
                    }));
                    setBillings(formatted);
                }
            } catch (error) {
                console.error("Erro ao buscar financeiro:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchFinanceiro();
    }, []);
    // Atualiza um campo específico de uma linha da tabela
    const updateBilling = (id, field, value) => {
        setIsDirty(true);
        setModifiedRows(prev => ({ ...prev, [id]: true }));
        setBillings(prev => prev.map(row => {
            if (row.id !== id)
                return row;
            const newRow = { ...row, [field]: value };
            if (field === "planId") {
                const planObj = FIXED_PLANS.find(p => p.id === value);
                if (planObj)
                    newRow.customValue = planObj.price;
            }
            return newRow;
        }));
    };
    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const rowsToUpdate = billings.filter(row => modifiedRows[row.id]);
            
            for (const row of rowsToUpdate) {
                // Envia PUT iterativo para os registros modificados
                await fetch(`${API_URL}/financeiro/${row.aluno_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        plano: row.planId.toUpperCase(),
                        data_inicio: row.startDate,
                        data_vencimento: row.dueDate,
                        valor_personalizado: row.customValue,
                        status_pagamento: row.status
                    })
                });
            }
            
            setIsDirty(false);
            setModifiedRows({});
        } catch (error) {
            console.error("Erro ao salvar faturamento:", error);
            alert("Ocorreu um erro ao salvar as alterações no banco de dados.");
        } finally {
            setIsSaving(false);
        }
    };
    // Cálculo de Inadimplentes baseado no estado atual da tabela
    const defaultersCount = billings.filter(b => b.status === "INADIMPLENTE").length;
    const pendingRevenue = billings.filter(b => b.status === "INADIMPLENTE" || b.status === "PENDENTE")
        .reduce((acc, curr) => acc + curr.customValue, 0);
    return (<div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold">Faturamento & Planos</h1>
        <p className="text-muted-foreground mt-1">Gerencie a capacidade dos seus planos e os contratos individuais dos alunos.</p>
      </div>

      {/* Grade Principal de Indicadores (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">MRR (Mensal)</h3>
            <DollarSign size={20} className="text-primary"/>
          </div>
          <p className="text-3xl font-bold">R$ 8.420</p>
          <p className="text-xs text-primary mt-1 font-medium">+12% este mês</p>
        </div>
        
        {/* Card Interativo: Redireciona para Alunos */}
        <div onClick={() => router.push('/dashboard/students')} className="bg-card border border-border p-6 rounded-xl shadow-sm hover:border-primary/50 hover:bg-secondary/30 transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Alunos Ativos
            </h3>
            <Users size={20} className="text-primary"/>
          </div>
          <p className="text-3xl font-bold">41</p>
          <p className="text-xs text-primary mt-1 font-medium group-hover:underline underline-offset-2">+3 novos. Ver todos</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Churn Rate</h3>
            <Activity size={20} className="text-destructive"/>
          </div>
          <p className="text-3xl font-bold">2.4%</p>
          <p className="text-xs text-muted-foreground mt-1 font-medium">Normal (abaixo de 5%)</p>
        </div>

        {/* Card Interativo: Inadimplentes (Calculado dinamicamente) */}
        <div onClick={() => router.push('/dashboard/students')} className="bg-card border border-border p-6 rounded-xl shadow-sm border-l-4 border-l-destructive hover:bg-secondary/30 transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-destructive group-hover:text-red-400 transition-colors">
              Inadimplentes
            </h3>
            <AlertCircle size={20} className="text-destructive"/>
          </div>
          <p className="text-3xl font-bold">{defaultersCount}</p>
          <p className="text-xs text-muted-foreground mt-1 font-medium group-hover:text-foreground transition-colors">
            R$ {pendingRevenue.toFixed(2).replace('.', ',')} pendentes. Filtrar
          </p>
        </div>
      </div>

      {/* Planos Ativos Comerciais Fixos */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Planos Comerciais (Regras Base)</h2>
            <p className="text-sm text-muted-foreground mt-1">Sua estrutura fixa de vendas. (Não é possível adicionar planos avulsos na versão atual).</p>
          </div>
          {/* REMOVIDO: O botão "+ Novo Plano" foi removido conforme a regra de interface. */}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FIXED_PLANS.map(plan => {
            const fillPercentage = Math.round((plan.currentStudents / plan.maxStudents) * 100);
            return (<div key={plan.id} className="bg-background border border-primary/40 p-5 rounded-xl flex flex-col relative group hover:border-primary transition-colors shadow-sm ring-1 ring-primary/10">
                <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-secondary transition-colors">
                  <MoreHorizontal size={18}/>
                </button>

                <div className="flex justify-between items-start mb-2 pr-8">
                  <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
                </div>
                <p className="text-3xl font-bold my-2">R$ {plan.price.toFixed(2).replace('.', ',')}<span className="text-sm font-normal text-muted-foreground">/ciclo</span></p>
                <p className="text-xs text-muted-foreground font-medium mb-4">{plan.limitText}</p>
                
                {/* Barra de Progresso de Ocupação Sutil Esmeralda */}
                <div className="mb-6">
                  <div className="flex justify-between text-[11px] font-bold text-muted-foreground mb-1">
                    <span>Ocupação Atual</span>
                    <span className="text-foreground">{plan.currentStudents} / {plan.maxStudents} alunos</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: `${fillPercentage}%` }}/>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-border flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-5 rounded-full p-1 cursor-not-allowed bg-primary transition-colors opacity-80">
                      <div className="w-3 h-3 bg-white rounded-full translate-x-4 transition-transform"/>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ativo Fixo</span>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs font-bold bg-secondary text-foreground px-3 py-1.5 rounded hover:bg-secondary/80 transition-colors">
                    <LinkIcon size={14}/>
                    Copiar Link
                  </button>
                </div>
              </div>);
        })}
        </div>
      </div>

      {/* NOVA SEÇÃO: Gestão de Cobranças por Aluno (Ecossistema Direto) */}
      <div className={`bg-card border rounded-xl shadow-sm flex flex-col overflow-hidden transition-colors duration-300 ${isDirty ? 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'border-border'}`}>
        
        {/* Aviso de Alterações Pendentes */}
        {isDirty && (<div className="bg-orange-500/10 border-b border-orange-500/20 p-3 flex items-center justify-center gap-2 text-orange-500 text-sm font-bold animate-in fade-in slide-in-from-top-2">
            <AlertTriangle size={16}/>
            ⚠️ Alterações pendentes de salvamento
          </div>)}

        <div className="p-6 border-b border-border flex items-center justify-between bg-background/50">
          <div>
            <h2 className="text-xl font-bold text-foreground">Gestão de Cobranças por Aluno</h2>
            <p className="text-sm text-muted-foreground mt-1">Gerencie contratos, valores individuais e vencimentos. Alunos do CRM aparecem aqui automaticamente.</p>
          </div>
          <button onClick={handleSaveChanges} disabled={isSaving || !isDirty} className="flex items-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded-md hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px] justify-center">
            {isSaving ? (<>
                <Loader2 size={16} className="animate-spin"/>
                Salvando...
              </>) : (<>
                <Save size={16}/>
                Salvar Alterações
              </>)}
          </button>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[900px]">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="p-3 font-bold">Aluno</th>
                <th className="p-3 font-bold">Plano Contratado</th>
                <th className="p-3 font-bold">Data de Início</th>
                <th className="p-3 font-bold">Data Vencimento</th>
                <th className="p-3 font-bold text-center">Valor Cobrado (R$)</th>
                <th className="p-3 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-muted-foreground">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-primary" />
                    Buscando dados financeiros no servidor...
                  </td>
                </tr>
              ) : billings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-muted-foreground">
                    Nenhum contrato financeiro encontrado. Cadastre um aluno primeiro.
                  </td>
                </tr>
              ) : billings.map((row) => (<tr key={row.id} className="hover:bg-secondary/20 transition-colors group">
                  
                  {/* ALUNO: Avatar e Nome */}
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 border border-primary/30 text-xs">
                        {row.studentName.charAt(0)}
                      </div>
                      <span className="font-bold text-sm text-foreground">
                        {row.studentName}
                      </span>
                    </div>
                  </td>

                  {/* PLANO SELECIONADO: Dropdown */}
                  <td className="p-3">
                    <select value={row.planId} onChange={(e) => updateBilling(row.id, "planId", e.target.value)} className="bg-background border border-border rounded-md px-2 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary w-[140px]">
                      {FIXED_PLANS.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                    </select>
                  </td>

                  {/* DATA DE INÍCIO */}
                  <td className="p-3">
                    <input type="date" value={row.startDate} onChange={(e) => updateBilling(row.id, "startDate", e.target.value)} className="bg-background border border-border rounded-md px-2 py-1.5 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-[130px] custom-date-input"/>
                  </td>

                  {/* DATA DE VENCIMENTO */}
                  <td className="p-3">
                    <input type="date" value={row.dueDate} onChange={(e) => updateBilling(row.id, "dueDate", e.target.value)} className="bg-background border border-border rounded-md px-2 py-1.5 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-[130px] custom-date-input"/>
                  </td>

                  {/* VALOR PERSONALIZADO */}
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs text-muted-foreground font-bold">R$</span>
                      <input type="number" step="0.01" value={row.customValue} onChange={(e) => updateBilling(row.id, "customValue", parseFloat(e.target.value) || 0)} className="bg-background border border-border rounded-md px-2 py-1.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary w-[80px] text-right"/>
                    </div>
                  </td>

                  {/* STATUS DE PAGAMENTO */}
                  <td className="p-3 text-center">
                    <select value={row.status} onChange={(e) => updateBilling(row.id, "status", e.target.value)} className={`rounded-md px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider focus:outline-none appearance-none cursor-pointer text-center w-[120px] ${row.status === "PAGO" ? "bg-primary/10 text-primary border border-primary/20" :
                row.status === "INADIMPLENTE" ? "bg-destructive/10 text-destructive border border-destructive/20" :
                    "bg-orange-500/10 text-orange-500 border border-orange-500/20"}`}>
                      <option value="PAGO">Pago</option>
                      <option value="PENDENTE">Pendente</option>
                      <option value="INADIMPLENTE">Inadimplente</option>
                    </select>
                  </td>

                </tr>))}
            </tbody>
          </table>
        </div>
      </div>

    </div>);
}
