import React from 'react';
import { useApp } from '../../context/AppContext';

export const MacroCard: React.FC = () => {
  const { profile, selectedDate, getDailyTotals } = useApp();
  const totals = getDailyTotals(selectedDate);

  const calTarget = profile.target_calories;
  const calConsumed = totals.calories;
  const calRemaining = calTarget - calConsumed;
  const calPercent = Math.min(Math.round((calConsumed / calTarget) * 100), 100);

  const pTarget = profile.target_protein;
  const pConsumed = Math.round(totals.protein);
  const pPercent = Math.min(Math.round((pConsumed / pTarget) * 100), 100);

  const cTarget = profile.target_carbs;
  const cConsumed = Math.round(totals.carbs);
  const cPercent = Math.min(Math.round((cConsumed / cTarget) * 100), 100);

  const fTarget = profile.target_fat;
  const fConsumed = Math.round(totals.fat);
  const fPercent = Math.min(Math.round((fConsumed / fTarget) * 100), 100);

  return (
    <div className="minimal-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <h3 className="font-semibold text-xs text-slate-400 uppercase tracking-wider">Calorias & Nutrição</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-white tracking-tight">{calConsumed}</span>
            <span className="text-xs text-slate-400 font-medium">/ {calTarget} kcal</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-400">
            {calRemaining >= 0 ? `${calRemaining} kcal restantes` : `${Math.abs(calRemaining)} kcal acima`}
          </span>
          <span className="block text-[11px] text-brand-400 font-semibold">{calPercent}% da meta</span>
        </div>
      </div>

      {/* Main Calorie Progress Bar */}
      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
        <div
          className="h-full bg-brand-500 rounded-full transition-all duration-500"
          style={{ width: `${calPercent}%` }}
        />
      </div>

      {/* Minimal Macros Grid */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        {/* Proteínas */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 text-[11px]">Proteínas</span>
            <span className="text-white font-semibold text-[11px]">{pConsumed}g</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${pPercent}%` }} />
          </div>
        </div>

        {/* Carboidratos */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 text-[11px]">Carbs</span>
            <span className="text-white font-semibold text-[11px]">{cConsumed}g</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${cPercent}%` }} />
          </div>
        </div>

        {/* Gorduras */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 text-[11px]">Gorduras</span>
            <span className="text-white font-semibold text-[11px]">{fConsumed}g</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${fPercent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
