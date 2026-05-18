"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, MoreVertical, SlidersHorizontal, Download } from "lucide-react";
import { NewStudentModal } from "@/components/trainer/NewStudentModal";
// Dados simulados com alta densidade (Enterprise)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

export default function StudentsCRMPage() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("ALL");
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Estados Reais da API
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStudents() {
        try {
            const res = await fetch(`${API_URL}/alunos`);
            if (res.ok) {
            const data = await res.json();
            // Mapeia os dados do Supabase para o formato do frontend
            const formatted = data.map(aluno => ({
                id: aluno.id,
                name: aluno.nome,
                email: aluno.email || '-',
                phone: aluno.telefone || '-',
                // Simulando plano e status para manter UI (Idealmente viriam do backend via JOIN)
                plan: "Plano Base", 
                status: "ACTIVE",
                attendance: [true, true, false, true, true, false, true],
                streak: "🔥 5 dias",
                expiresAt: "Expira em 12/12/2026"
            }));
            setStudents(formatted);
            }
        } catch (error) {
            console.error("Erro ao buscar alunos:", error);
        } finally {
            setIsLoading(false);
        }
        }
        fetchStudents();
    }, []);

    // Atalho Global Ctrl + K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandPaletteOpen(true);
            }
            if (e.key === 'Escape') {
                setIsCommandPaletteOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    return (<div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Cabeçalho Superior */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">CRM de Alunos</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus alunos e acompanhe a frequência.</p>
          
          {/* 1. BARRA DE FILTROS SEGMENTADOS */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <button onClick={() => setActiveTab("ALL")} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === "ALL"
            ? "bg-secondary text-foreground ring-1 ring-border"
            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}>
              Todos
              <span className="bg-background px-1.5 py-0.5 rounded text-xs">48</span>
            </button>
            <button onClick={() => setActiveTab("ACTIVE")} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === "ACTIVE"
            ? "bg-primary/10 text-primary ring-1 ring-primary/30"
            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}>
              Ativos
              <span className="bg-background px-1.5 py-0.5 rounded text-xs">41</span>
            </button>
            <button onClick={() => setActiveTab("PENDING")} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === "PENDING"
            ? "bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/30"
            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}>
              Pagamento Pendente
              <span className="bg-background px-1.5 py-0.5 rounded text-xs">3</span>
            </button>
            <button onClick={() => setActiveTab("NO_WORKOUT")} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === "NO_WORKOUT"
            ? "bg-secondary text-foreground ring-1 ring-border"
            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}>
              Sem Treino Ativo
              <span className="bg-background px-1.5 py-0.5 rounded text-xs">4</span>
            </button>
          </div>
        </div>

        {/* Botão Global Adicionar Aluno */}
        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-bold flex items-center gap-2 hover:bg-primary/90 transition shadow-lg shadow-primary/20 shrink-0 mt-1">
          <Plus size={18}/>
          Novo Aluno
        </button>
      </div>

      {/* Tabela de Alta Densidade (Enterprise) */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        
        {/* 4. BARRA DE BUSCA E AÇÕES GLOBAIS */}
        <div className="p-4 border-b border-border flex items-center justify-between gap-4 bg-background/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16}/>
            <input type="text" placeholder="Buscar por nome, email ou telefone..." className="w-full bg-card border border-border rounded-md pl-9 pr-14 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/70"/>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              <kbd className="hidden sm:inline-flex bg-secondary text-muted-foreground rounded px-1.5 py-0.5 text-[10px] font-bold border border-border">Ctrl K</kbd>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 border border-border bg-card rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition flex items-center gap-2 text-sm font-medium">
              <SlidersHorizontal size={16}/>
              <span className="hidden sm:inline">Filtrar</span>
            </button>
            <button className="p-2 border border-border bg-card rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition flex items-center gap-2 text-sm font-medium">
              <Download size={16}/>
              <span className="hidden sm:inline">Exportar</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-muted-foreground text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">Nome do Aluno</th>
                <th className="p-4 font-bold">Plano Ativo</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Últimos 7 Dias</th>
                <th className="p-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-muted-foreground">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Carregando alunos do servidor...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-muted-foreground">
                    Nenhum aluno encontrado no banco de dados.
                  </td>
                </tr>
              ) : students.map((student) => (<tr key={student.id} className="hover:bg-secondary/40 hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-200 cursor-pointer group" 
        // 3. INTERAÇÃO E NAVEGAÇÃO DIRETA
        onClick={() => router.push(`/dashboard/students/${student.id}`)}>
                  {/* 2. ENRIQUECIMENTO: Avatar + Nome + Contato */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 border border-primary/30">
                        {student.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {student.name}
                        </span>
                        <span className="text-xs text-[#71717a] mt-0.5">
                          {student.phone}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  {/* 2. ENRIQUECIMENTO: Badge do Plano + Validade */}
                  <td className="p-4">
                    <div className="flex flex-col items-start gap-1">
                      <span className="bg-secondary text-xs px-2 py-0.5 rounded-md text-foreground border border-border font-medium">
                        {student.plan}
                      </span>
                      <span className="text-[11px] text-[#71717a]">
                        {student.expiresAt}
                      </span>
                    </div>
                  </td>

                  {/* Status (Inalterado) */}
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${student.status === "Treinou Hoje"
                ? "bg-primary/10 text-primary"
                : student.status === "Sem Treino"
                    ? "bg-secondary text-muted-foreground"
                    : "bg-destructive/10 text-destructive"}`}>
                      {student.status}
                    </span>
                  </td>
                  
                  {/* 2. ENRIQUECIMENTO: Frequência + Sequência (Streak) */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {student.attendance.map((attended, i) => (<div key={i} className={`w-2.5 h-2.5 rounded-[2px] ${attended ? "bg-primary shadow-[0_0_4px_rgba(16,185,129,0.4)]" : "bg-secondary border border-border/50"}`} title={attended ? "Treinou" : "Não treinou"}/>))}
                      </div>
                      <span className="text-xs font-bold text-foreground bg-secondary px-2 py-0.5 rounded">
                        {student.streak}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    <button onClick={(e) => { e.stopPropagation(); /* Prevents row click */ }} className="text-muted-foreground hover:text-foreground p-1.5 rounded hover:bg-secondary transition-colors">
                      <MoreVertical size={18}/>
                    </button>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>

      <NewStudentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>

      {/* COMMAND PALETTE (Ctrl+K) */}
      {isCommandPaletteOpen && (<div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsCommandPaletteOpen(false)}/>
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center px-4 border-b border-border bg-background/50">
              <Search className="text-primary" size={20}/>
              <input autoFocus type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Busque por um aluno (Ex: Carlos, Ana...)" className="w-full bg-transparent border-none px-4 py-4 text-lg focus:outline-none focus:ring-0 placeholder:text-muted-foreground"/>
              <kbd className="hidden sm:inline-flex bg-secondary text-muted-foreground rounded px-2 py-1 text-[10px] font-bold border border-border uppercase tracking-wider">ESC</kbd>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-2">
              <div className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Alunos Recentes
              </div>
              
              {students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map(student => (<div key={student.id} onClick={() => router.push(`/dashboard/students/${student.id}`)} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 cursor-pointer group transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center border border-primary/20 text-xs">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm group-hover:text-primary transition-colors">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.plan}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium bg-background border border-border px-2 py-1 rounded text-muted-foreground">
                    Acessar Perfil ↵
                  </span>
                </div>))}
              
              {students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (<div className="p-8 text-center text-muted-foreground text-sm">
                  Nenhum aluno encontrado com "{searchQuery}".
                </div>)}
            </div>
          </div>
        </div>)}
    </div>);
}
