import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WaterTracker: React.FC = () => {
  const { profile, selectedDate, getWaterTotal, addWater, resetWater } = useApp();

  const total = getWaterTotal(selectedDate);
  const target = profile.target_water_ml || 3000;
  const percentage = Math.min(Math.round((total / target) * 100), 100);

  return (
    <div className="minimal-card p-5 space-y-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-xs text-slate-400 uppercase tracking-wider">Hidratação</h3>
          <button
            onClick={() => resetWater(selectedDate)}
            title="Zerar"
            className="text-slate-500 hover:text-slate-300 p-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {(total / 1000).toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ {(target / 1000).toFixed(1)} L</span>
          </div>
          <span className="text-xs font-semibold text-cyan-400">{percentage}%</span>
        </div>

        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 mt-3">
          <div
            className="h-full bg-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <button
          onClick={() => addWater(250)}
          className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-cyan-400" />
          250ml
        </button>
        <button
          onClick={() => addWater(500)}
          className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-cyan-400" />
          500ml
        </button>
        <button
          onClick={() => addWater(750)}
          className="py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-cyan-400" />
          750ml
        </button>
      </div>
    </div>
  );
};
