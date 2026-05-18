"use client";
import { useState, useEffect } from "react";
import { Save, UploadCloud, Database, Loader2, CheckCircle2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [primaryColor, setPrimaryColor] = useState("#10b981");
    // Estados dos Toggles (Switches)
    const [rpeEnabled, setRpeEnabled] = useState(true);
    const [fractionalLoadEnabled, setFractionalLoadEnabled] = useState(false);
    const [reminderEnabled, setReminderEnabled] = useState(true);
    const [blockNotificationEnabled, setBlockNotificationEnabled] = useState(true);
    const [diasTolerancia, setDiasTolerancia] = useState(3);
    const [isLoading, setIsLoading] = useState(true);

    // Carrega as configurações do servidor
    useEffect(() => {
        async function fetchConfig() {
            try {
                const res = await fetch(`${API_URL}/configuracoes`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.cor_primaria) setPrimaryColor(data.cor_primaria);
                    if (data.dias_tolerancia !== undefined) setDiasTolerancia(data.dias_tolerancia);
                    if (data.lembrete_vencimento !== undefined) setReminderEnabled(data.lembrete_vencimento);
                    if (data.notificacao_bloqueio !== undefined) setBlockNotificationEnabled(data.notificacao_bloqueio);
                    if (data.escala_rpe !== undefined) setRpeEnabled(data.escala_rpe);
                    if (data.carga_fracionada !== undefined) setFractionalLoadEnabled(data.carga_fracionada);
                }
            } catch (error) {
                console.error("Erro ao buscar configurações:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchConfig();
    }, []);

    // Envia PUT para salvar no Supabase
    const handleSave = async () => {
        setIsSaving(true);
        setShowSuccess(false);
        try {
            const payload = {
                cor_primaria: primaryColor,
                dias_tolerancia: diasTolerancia,
                lembrete_vencimento: reminderEnabled,
                notificacao_bloqueio: blockNotificationEnabled,
                escala_rpe: rpeEnabled,
                carga_fracionada: fractionalLoadEnabled
            };

            const res = await fetch(`${API_URL}/configuracoes`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                alert("Erro ao salvar configurações no servidor.");
            }
        } catch (error) {
            console.error("Erro no salvamento:", error);
            alert("Falha de conexão com o backend.");
        } finally {
            setIsSaving(false);
        }
    };
    return (<div className="space-y-6 max-w-4xl mx-auto pb-12 relative">
      
      {/* Alerta Temporário de Sucesso (Toast Simulado) */}
      <div className={`fixed top-4 right-4 bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 transform transition-all duration-300 z-50 ${showSuccess ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none"}`}>
        <CheckCircle2 size={20}/>
        <span className="font-bold text-sm">Configurações salvas com sucesso!</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Configurações Avançadas</h1>
          <p className="text-muted-foreground mt-1">Personalize a experiência dos seus alunos e automatize regras de negócio.</p>
        </div>
        
        {/* 4. FEEDBACK VISUAL NO BOTÃO SALVAR */}
        <button onClick={handleSave} disabled={isSaving} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 min-w-[140px] disabled:opacity-70 disabled:cursor-not-allowed">
          {isSaving ? (<>
              <Loader2 size={18} className="animate-spin"/>
              Salvando...
            </>) : (<>
              <Save size={18}/>
              Salvar Alterações
            </>)}
        </button>
      </div>

      <div className="grid gap-8">
        
        {/* 1. REFORMA DO BLOCO A: WHITE-LABELING & MARCA */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-6 border-b border-border pb-2 text-foreground">A. White-labeling & Marca</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Upload de Logo (Dropzone) */}
            <div>
              <label className="block text-sm font-bold mb-2 text-foreground uppercase tracking-wider">Logotipo da Marca</label>
              <div className="w-full border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-secondary/30 hover:border-primary/50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  <UploadCloud size={24} className="text-muted-foreground group-hover:text-primary"/>
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Arraste sua logo aqui ou <span className="text-primary underline">clique para fazer upload</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  (PNG, SVG de até 2MB. Fundo transparente recomendado.)
                </p>
              </div>
            </div>

            {/* Cor Primária com Preview */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-foreground uppercase tracking-wider">Cor Primária (Hex)</label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded-md bg-transparent border-none cursor-pointer absolute opacity-0 inset-0"/>
                    <div className="w-10 h-10 rounded-md border border-border shadow-sm ring-2 ring-offset-2 ring-offset-background ring-transparent focus-within:ring-primary" style={{ backgroundColor: primaryColor }}/>
                  </div>
                  <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-32 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono uppercase"/>
                </div>
              </div>

              {/* Preview Simulado do App */}
              <div className="bg-background border border-border rounded-lg p-4 mt-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3 block">Preview no App do Aluno</span>
                <div className="flex items-center gap-3 justify-center bg-secondary/20 p-4 rounded-md">
                  <button className="w-full py-2.5 rounded-full text-white font-bold text-sm shadow-md transition-transform hover:scale-[1.02]" style={{ backgroundColor: primaryColor }}>
                    Iniciar Treino de Hoje
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. EXPANSÃO DO BLOCO B: AUTOMAÇÃO FINANCEIRA */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-6 border-b border-border pb-2 text-foreground">B. Automação Financeira</h2>
          
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-bold mb-2 text-foreground">Dias de tolerância antes do bloqueio (Inadimplência)</label>
              <div className="flex items-center gap-3">
                <input type="number" value={diasTolerancia} onChange={(e) => setDiasTolerancia(parseInt(e.target.value) || 0)} className="w-24 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-center font-bold"/>
                <span className="text-sm text-muted-foreground">Dias após o vencimento</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 max-w-xl">
                O acesso aos treinos será restrito automaticamente para alunos com pagamentos não identificados (Cartão/Pix) após o fim desta tolerância.
              </p>
            </div>

            {/* Subseção de Alertas e Notificações */}
            <div className="bg-background border border-border rounded-xl p-5 space-y-5">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Alertas e Notificações de Cobrança</h3>
              
              <div className="flex items-start gap-4">
                <div className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors mt-0.5 shrink-0 ${reminderEnabled ? 'bg-primary' : 'bg-secondary'}`} onClick={() => setReminderEnabled(!reminderEnabled)}>
                  <div className={`w-3 h-3 bg-white rounded-full transition-transform ${reminderEnabled ? 'translate-x-5' : 'translate-x-0'}`}/>
                </div>
                <div>
                  <span className="block font-bold text-sm text-foreground">Lembrete de Vencimento Antecipado</span>
                  <span className="block text-xs text-muted-foreground mt-1">Enviar aviso automático no WhatsApp do aluno 2 dias antes da data de vencimento.</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors mt-0.5 shrink-0 ${blockNotificationEnabled ? 'bg-primary' : 'bg-secondary'}`} onClick={() => setBlockNotificationEnabled(!blockNotificationEnabled)}>
                  <div className={`w-3 h-3 bg-white rounded-full transition-transform ${blockNotificationEnabled ? 'translate-x-5' : 'translate-x-0'}`}/>
                </div>
                <div>
                  <span className="block font-bold text-sm text-foreground">Notificação de Bloqueio por Inadimplência</span>
                  <span className="block text-xs text-muted-foreground mt-1">Disparar mensagem alertando sobre a restrição de acesso assim que o prazo de tolerância expirar.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. EXPANSÃO DO BLOCO C: MOTOR DE TREINOS */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-6 border-b border-border pb-2 text-foreground">C. Motor de Treinos</h2>
          
          <div className="space-y-6">
            
            <div className="flex items-start gap-4">
              <div className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors mt-0.5 shrink-0 ${rpeEnabled ? 'bg-primary' : 'bg-secondary'}`} onClick={() => setRpeEnabled(!rpeEnabled)}>
                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${rpeEnabled ? 'translate-x-5' : 'translate-x-0'}`}/>
              </div>
              <div>
                <span className="block font-bold text-sm text-foreground">Habilitar Escala RPE (Percepção de Esforço)</span>
                <span className="block text-xs text-muted-foreground mt-1">Permite que alunos reportem a sensação de esforço (0-10) após cada série. Essencial para treinos de progressão.</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors mt-0.5 shrink-0 ${fractionalLoadEnabled ? 'bg-primary' : 'bg-secondary'}`} onClick={() => setFractionalLoadEnabled(!fractionalLoadEnabled)}>
                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${fractionalLoadEnabled ? 'translate-x-5' : 'translate-x-0'}`}/>
              </div>
              <div>
                <span className="block font-bold text-sm text-foreground">Permitir Carga Fracionada (0.5 kg)</span>
                <span className="block text-xs text-muted-foreground mt-1">Habilita a inserção de valores decimais nos campos de carga do construtor de treinos para micro-progressão.</span>
              </div>
            </div>

            {/* Botão de Dicionário de Exercícios no Rodapé do Bloco */}
            <div className="pt-6 mt-4 border-t border-border flex justify-start">
              <button className="flex items-center gap-2 bg-secondary text-foreground hover:bg-secondary/80 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors group">
                <Database size={16} className="text-muted-foreground group-hover:text-primary transition-colors"/>
                Customizar Dicionário de Exercícios
                <span className="ml-2 bg-background border border-border text-[10px] px-2 py-0.5 rounded-full font-bold">
                  342 exercícios ativos
                </span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>);
}
