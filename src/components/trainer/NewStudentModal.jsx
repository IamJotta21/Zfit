"use client";
import { useState } from "react";
import { Copy, Check, Key } from "lucide-react";
export function NewStudentModal({ isOpen, onClose }) {
    const [copied, setCopied] = useState(false);
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
      nome: "",
      email: "",
      telefone: "",
      codigo_acesso: ""
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

    if (!isOpen)
        return null;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Gera um código de acesso automático baseado no nome se o personal deixar em branco
    const handleCreateStudent = async () => {
      if (!formData.nome) return alert("O nome é obrigatório!");
      setIsLoading(true);

      const finalCodigo = formData.codigo_acesso.trim() || formData.nome.toUpperCase().replace(/\s+/g, '-');
      const payload = { ...formData, codigo_acesso: finalCodigo };

      try {
        const res = await fetch(`${API_URL}/alunos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setFormData(payload);
          setStep(2); // Vai para o passo de convite gerado
        } else {
          alert("Erro ao cadastrar aluno no backend.");
        }
      } catch (error) {
        console.error(error);
        alert("Falha de conexão com o backend.");
      } finally {
        setIsLoading(false);
      }
    };

    const inviteMessage = `Olá ${formData.nome}! Seu treino já está disponível no app Zfit.\n\n📱 Acesse: https://zfit.app\n🔑 Seu Código de Acesso: ${formData.codigo_acesso}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteMessage);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border flex justify-between items-center bg-background/50">
          <h2 className="text-xl font-black text-foreground flex items-center gap-2">
            <Key className="text-primary" size={20} /> Adicionar Novo Aluno
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            &times;
          </button>
        </div>

        <div className="p-6">
          {step === 1 ? (<div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Nome Completo *</label>
                <input name="nome" value={formData.nome} onChange={handleChange} type="text" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium" placeholder="Ex: Carlos Eduardo"/>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Código de Acesso (Login do Aluno) *</label>
                <input name="codigo_acesso" value={formData.codigo_acesso} onChange={handleChange} type="text" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-bold tracking-wide text-primary" placeholder="Ex: CARLOS-123 (ou deixe em branco para gerar auto)"/>
                <span className="text-[11px] text-muted-foreground mt-1 block">O aluno usará este código para entrar no aplicativo.</span>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Email</label>
                <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium" placeholder="carlos@example.com"/>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">WhatsApp</label>
                <input name="telefone" value={formData.telefone} onChange={handleChange} type="tel" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium" placeholder="(11) 99999-9999"/>
              </div>
              <button 
                onClick={handleCreateStudent} 
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/20 disabled:opacity-50 mt-2"
              >
                {isLoading ? "Criando Acesso..." : "Criar Login & Cadastrar Aluno"}
              </button>
            </div>) : (<div className="space-y-4 text-center">
              <div className="w-14 h-14 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce-slight">
                <Check size={28}/>
              </div>
              <h3 className="text-xl font-black text-foreground">Acesso Criado com Sucesso!</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                O aluno já pode acessar o sistema com o código exclusivo gerado abaixo.
              </p>
              
              <div className="bg-background border border-border p-4 rounded-xl text-left space-y-2 mb-4">
                <div className="flex justify-between items-center text-xs text-muted-foreground border-b border-border/50 pb-2">
                  <span>Portal: <strong className="text-foreground">https://zfit.app</strong></span>
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase text-[10px]">Ativo</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-muted-foreground">Código de Login do Aluno</span>
                  <span className="text-lg font-black text-primary tracking-wider">{formData.codigo_acesso}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={copyToClipboard} className="flex-1 py-3 bg-secondary text-foreground rounded-xl font-bold text-sm hover:bg-secondary/80 flex items-center justify-center gap-2 border border-border transition-colors">
                  {copied ? <Check size={16} className="text-primary"/> : <Copy size={16}/>}
                  {copied ? "Copiado!" : "Copiar Dados"}
                </button>
                <a href={`https://wa.me/?text=${encodeURIComponent(inviteMessage)}`} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-[#25D366] text-white font-bold text-sm rounded-xl hover:bg-[#25D366]/90 transition-colors flex items-center justify-center shadow-lg shadow-[#25D366]/20">
                  Enviar WhatsApp
                </a>
              </div>
            </div>)}
        </div>
      </div>
    </div>);
}
