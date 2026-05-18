"use client";
import { LineChart } from "lucide-react";
export default function EvolutionPage() {
    return (<div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Minha Evolução</h1>
        <p className="text-muted-foreground text-sm">Acompanhe seu progresso nos treinos.</p>
      </div>

      {/* Progress Charts (Mocked with divs for simplicity without a charting library) */}
      <div className="bg-card border border-border p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <LineChart size={20} className="text-primary"/>
          <h2 className="font-bold">Força no Supino</h2>
        </div>
        
        <div className="flex items-end justify-between h-32 gap-2 mt-4 px-2">
          {[12, 14, 16, 16, 18, 22].map((load, index) => (<div key={index} className="flex flex-col items-center flex-1 gap-1">
              <span className="text-[10px] text-muted-foreground font-bold">{load}kg</span>
              <div className="w-full bg-primary/20 rounded-t-sm" style={{ height: `${(load / 22) * 100}%` }}>
                <div className="w-full h-1 bg-primary rounded-t-sm"/>
              </div>
              <span className="text-[10px] text-muted-foreground">S{index + 1}</span>
            </div>))}
        </div>
      </div>
      
    </div>);
}
