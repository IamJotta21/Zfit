"use client";
import { useState } from "react";
import { Plus, CheckCircle2 } from "lucide-react";
const TEMPLATES = [
    { id: "1", name: "Hipertrofia A (Push)" },
    { id: "2", name: "Hipertrofia B (Pull)" },
    { id: "3", name: "Hipertrofia C (Legs)" },
    { id: "4", name: "Full Body Iniciante" },
];
export function AssignWorkoutModal({ isOpen, onClose, studentName }) {
    const [assigned, setAssigned] = useState(null);
    if (!isOpen)
        return null;
    const handleAssign = (tplId) => {
        // Na prática faria um POST /api/students/workouts/assign com o template ID e o student ID
        setAssigned(tplId);
        setTimeout(() => {
            setAssigned(null);
            onClose();
        }, 1500);
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card w-full max-w-md rounded-xl shadow-xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/20">
          <h2 className="text-xl font-bold">Atribuir Treino</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            &times;
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-4">
            Selecione um treino da biblioteca para vincular ao aluno <strong className="text-foreground">{studentName}</strong>.
          </p>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {TEMPLATES.map(tpl => (<div key={tpl.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${assigned === tpl.id
                ? "border-primary bg-primary/10"
                : "border-border bg-background hover:border-primary/50"}`}>
                <span className="font-medium text-sm">{tpl.name}</span>
                {assigned === tpl.id ? (<CheckCircle2 size={20} className="text-primary"/>) : (<button onClick={() => handleAssign(tpl.id)} className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Plus size={14}/> Atribuir
                  </button>)}
              </div>))}
          </div>
        </div>
      </div>
    </div>);
}
