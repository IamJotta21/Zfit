"use client";
import { useState, useEffect } from "react";
import { User, Settings, Shield, LogOut, Bell, ChevronRight, X, Save, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

export default function StudentProfilePage() {
  const router = useRouter();

  // Estados dos modais e preferências
  const [pushEnabled, setPushEnabled] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // 'dados' | 'config' | null
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Estados dos Dados Pessoais (inicializados com o localStorage ou busca da API)
  const [nome, setNome] = useState("Carlos Eduardo");
  const [email, setEmail] = useState("carlos.edu@email.com");
  const [telefone, setTelefone] = useState("(11) 99999-9999");
  const [planoNome, setPlanoNome] = useState("Plano Pro Anual Ativo");

  // Estados das Configurações do App
  const [tema, setTema] = useState("Escuro");
  const [idioma, setIdioma] = useState("Português (BR)");
  const [economiaDados, setEconomiaDados] = useState(false);

  useEffect(() => {
    const studentId = localStorage.getItem("repos_student_id");
    const storedName = localStorage.getItem("repos_student_name");
    if (storedName) setNome(storedName);

    // Busca dados reais do aluno na API
    async function fetchAlunoInfo() {
      try {
        const res = await fetch(`${API_URL}/alunos`);
        if (res.ok) {
          const data = await res.json();
          const current = data.find(s => s.id === studentId || s.nome === storedName);
          if (current) {
            setNome(current.nome);
            setEmail(current.email || `${current.nome.toLowerCase().replace(/\s+/g, '')}@email.com`);
            setTelefone(current.telefone || "(11) 99999-9999");
            setPlanoNome(current.plano ? `Plano ${current.plano} Ativo` : "Plano Pro Ativo");
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do perfil do aluno:", error);
      }
    }
    fetchAlunoInfo();
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSaveDados = (e) => {
    e.preventDefault();
    localStorage.setItem("repos_student_name", nome);
    setActiveModal(null);
    triggerToast("Dados pessoais atualizados com sucesso!");
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setActiveModal(null);
    triggerToast("Configurações do aplicativo salvas!");
  };

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair da sua conta?")) {
      localStorage.removeItem("repos_role");
      localStorage.removeItem("repos_student_id");
      localStorage.removeItem("repos_student_name");
      router.push('/');
    }
  };

  return (
    <div className="space-y-6 pb-24 relative mt-4">
      {/* Toast Simulado de Sucesso */}
      <div className={`fixed top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 transform transition-all duration-300 z-50 ${showToast ? "translate-y-0 opacity-100" : "-translate-y-16 opacity-0 pointer-events-none"}`}>
        <CheckCircle2 size={20} />
        <span className="font-bold text-sm">{toastMessage}</span>
      </div>

      {/* Header Profile */}
      <div className="flex flex-col items-center justify-center text-center mt-4">
        <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/50 text-primary flex items-center justify-center text-3xl font-black mb-3 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          {nome.charAt(0)}
        </div>
        <h1 className="text-2xl font-bold text-foreground">{nome}</h1>
        <p className="text-sm text-muted-foreground mt-1">{email}</p>
        
        <div className="mt-4 inline-flex items-center gap-2 bg-secondary/80 border border-border px-4 py-1.5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse" />
          <span className="text-xs font-bold text-foreground">{planoNome}</span>
        </div>
      </div>

      <div className="space-y-6 mt-8 max-w-md mx-auto">
        
        {/* Sessão de Ajustes */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border/50 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-background/50">
            Minha Conta
          </div>
          
          <div className="divide-y divide-border/50">
            <button onClick={() => setActiveModal('dados')} className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-secondary/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground">
                  <User size={16} />
                </div>
                <span className="font-medium text-sm">Dados Pessoais</span>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Sessão de Preferências */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border/50 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-background/50">
            Preferências
          </div>
          
          <div className="divide-y divide-border/50">
            <div onClick={() => { setPushEnabled(!pushEnabled); triggerToast(pushEnabled ? "Notificações desativadas." : "Notificações ativadas!"); }} className="w-full flex items-center justify-between p-4 bg-transparent cursor-pointer hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground">
                  <Bell size={16} />
                </div>
                <span className="font-medium text-sm">Notificações Push</span>
              </div>
              <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${pushEnabled ? 'bg-primary' : 'bg-secondary border border-border'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${pushEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </div>
            
            <button onClick={() => setActiveModal('config')} className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-secondary/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground">
                  <Settings size={16} />
                </div>
                <span className="font-medium text-sm">Configurações do App</span>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Botão Sair */}
        <button 
          onClick={handleLogout}
          className="w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-xl text-destructive font-bold bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 transition-colors"
        >
          <LogOut size={18} />
          Sair da Conta
        </button>

      </div>

      {/* MODAL 1: DADOS PESSOAIS */}
      {activeModal === 'dados' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
              <h3 className="font-bold text-lg">Editar Dados Pessoais</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveDados} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Nome Completo</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">E-mail</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Telefone / WhatsApp</label>
                <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium" required />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setActiveModal(null)} className="px-5 py-2.5 rounded-xl border border-border hover:bg-secondary text-sm font-bold transition-colors">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
                  <Save size={16} /> Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIGURAÇÕES DO APP */}
      {activeModal === 'config' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
              <h3 className="font-bold text-lg">Configurações do App</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveConfig} className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Tema Visual</label>
                <select value={tema} onChange={(e) => setTema(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium">
                  <option value="Escuro">Modo Escuro (Padrão Zfit)</option>
                  <option value="Sistema">Automático do Sistema</option>
                  <option value="Claro">Modo Claro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Idioma</label>
                <select value={idioma} onChange={(e) => setIdioma(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium">
                  <option value="Português (BR)">Português (Brasil)</option>
                  <option value="English">English</option>
                  <option value="Español">Español</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
                <div>
                  <span className="block text-sm font-bold">Economia de Dados</span>
                  <span className="block text-xs text-muted-foreground mt-0.5">Reduz a qualidade de vídeos explicativos nos treinos</span>
                </div>
                <div onClick={() => setEconomiaDados(!economiaDados)} className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${economiaDados ? 'bg-primary' : 'bg-secondary border border-border'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${economiaDados ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>

              <div className="pt-2 flex gap-3 justify-end">
                <button type="button" onClick={() => setActiveModal(null)} className="px-5 py-2.5 rounded-xl border border-border hover:bg-secondary text-sm font-bold transition-colors">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
                  <Save size={16} /> Salvar Configurações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
