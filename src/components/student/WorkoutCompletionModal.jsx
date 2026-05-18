"use client";
import { useState } from "react";
import { Check, Flame, BatteryFull, BatteryMedium, BatteryLow } from "lucide-react";
export function WorkoutCompletionModal({ isOpen, onClose }) {
    const [step, setStep] = useState(1);
    const [rpe, setRpe] = useState(null);
    const [energy, setEnergy] = useState(null);
    if (!isOpen)
        return null;
    const handleFinish = () => {
        // In a real app, POST /api/workouts/log
        setStep(3);
        setTimeout(() => {
            onClose();
            setStep(1);
        }, 2500);
    };
    return (<div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center">
      <div className="bg-card w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-border overflow-hidden animate-in slide-in-from-bottom-full duration-300">
        
        {step === 1 && (<div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Como foi o treino?</h2>
            
            <div className="space-y-4 mb-8">
              <p className="text-sm text-center text-muted-foreground">Percepção de Esforço (RPE)</p>
              <div className="grid grid-cols-5 gap-2">
                {[...Array(10)].map((_, i) => (<button key={i} onClick={() => setRpe(i + 1)} className={`h-12 rounded-lg font-bold text-lg transition-colors ${rpe === i + 1
                    ? 'bg-primary text-primary-foreground scale-105'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'}`}>
                    {i + 1}
                  </button>))}
              </div>
            </div>

            <button disabled={!rpe} onClick={() => setStep(2)} className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl disabled:opacity-50 transition-all text-lg">
              Próximo
            </button>
          </div>)}

        {step === 2 && (<div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Nível de Energia</h2>
            
            <div className="flex justify-between gap-4 mb-8">
              {[
                { val: 1, icon: BatteryLow, label: "Baixa", color: "text-destructive" },
                { val: 2, icon: BatteryMedium, label: "Normal", color: "text-yellow-500" },
                { val: 3, icon: BatteryFull, label: "Alta", color: "text-primary" },
            ].map(item => (<button key={item.val} onClick={() => setEnergy(item.val)} className={`flex-1 py-6 flex flex-col items-center gap-2 rounded-xl border-2 transition-all ${energy === item.val
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-secondary hover:bg-secondary/80'}`}>
                  <item.icon size={32} className={energy === item.val ? item.color : 'text-muted-foreground'}/>
                  <span className="font-semibold">{item.label}</span>
                </button>))}
            </div>

            <button disabled={!energy} onClick={handleFinish} className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl disabled:opacity-50 transition-all text-lg">
              Concluir Treino
            </button>
          </div>)}

        {step === 3 && (<div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center animate-bounce">
              <Check size={40} className="text-primary"/>
            </div>
            <h2 className="text-3xl font-bold">Treino Concluído!</h2>
            <div className="flex items-center justify-center gap-2 text-orange-500 font-bold bg-orange-500/10 px-4 py-2 rounded-full">
              <Flame size={20}/>
              Oficialmente 12 dias no foco!
            </div>
          </div>)}
      </div>
    </div>);
}
