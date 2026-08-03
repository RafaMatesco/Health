import React from 'react';
import { Sparkles, Utensils, Dumbbell, Scale, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MacroCard } from '../components/dashboard/MacroCard';
import { WaterTracker } from '../components/dashboard/WaterTracker';
import { WorkoutCheckInCard } from '../components/dashboard/WorkoutCheckInCard';

interface DashboardPageProps {
  onOpenAddMeal: () => void;
  onOpenAiParser: () => void;
  onOpenAddMetric: () => void;
  setActiveTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenAddMeal,
  onOpenAiParser,
  setActiveTab
}) => {
  const { profile, selectedDate, getDailyTotals } = useApp();
  const totals = getDailyTotals(selectedDate);

  return (
    <div className="space-y-4 pb-12 max-w-4xl mx-auto">
      {/* Top Header Greeting */}
      <div className="flex items-center justify-between py-1">
        <div>
          <h2 className="font-bold text-xl text-white">
            Olá, {profile.full_name.split(' ')[0]} 👋
          </h2>
          <p className="text-xs text-slate-400">Resumo de saúde do dia {selectedDate}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAiParser}
            className="py-1.5 px-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            IA Texto
          </button>
          <button
            onClick={onOpenAddMeal}
            className="py-1.5 px-3 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 text-brand-300 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-brand-400" />
            Refeição
          </button>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MacroCard />
        <WaterTracker />
      </div>

      {/* Workout Check-in */}
      <WorkoutCheckInCard />

      {/* Navigation Pills */}
      <div className="grid grid-cols-3 gap-2 pt-2">
        <button
          onClick={() => setActiveTab('nutrition')}
          className="minimal-card-interactive p-3.5 text-left flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-white">Diário</h4>
            <p className="text-[10px] text-slate-400">{totals.calories} kcal</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('workout')}
          className="minimal-card-interactive p-3.5 text-left flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Dumbbell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-white">Calendário</h4>
            <p className="text-[10px] text-slate-400">Frequência</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('metrics')}
          className="minimal-card-interactive p-3.5 text-left flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-white">Evolução</h4>
            <p className="text-[10px] text-slate-400">Peso & Medidas</p>
          </div>
        </button>
      </div>
    </div>
  );
};
