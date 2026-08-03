import React from 'react';
import { CheckCircle2, Circle, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../services/mockData';

export const WorkoutCheckInCard: React.FC = () => {
  const { selectedDate, isWorkoutDoneOnDate, toggleWorkoutCheckin, getWorkoutStreak } = useApp();
  const isDone = isWorkoutDoneOnDate(selectedDate);
  const { currentStreak, totalMonthly } = getWorkoutStreak();

  const isToday = selectedDate === getTodayDateString();

  return (
    <div className={`minimal-card p-5 flex items-center justify-between gap-4 transition-colors ${
      isDone ? 'border-brand-500/30 bg-brand-500/[0.03]' : ''
    }`}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => toggleWorkoutCheckin(selectedDate, 'Treino Concluído', '')}
          className="text-slate-400 hover:text-white transition-colors"
        >
          {isDone ? (
            <CheckCircle2 className="w-7 h-7 text-brand-500 fill-brand-500/20" />
          ) : (
            <Circle className="w-7 h-7 text-slate-600 hover:text-slate-400" />
          )}
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-white">
              {isDone ? 'Treino Concluído! 💪' : 'Registrar Treino do Dia'}
            </h4>
            {isDone && (
              <span className="text-[10px] bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded-full font-semibold">
                Feito
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isToday ? 'Toque para alternar o check-in de hoje' : `Data: ${selectedDate}`}
          </p>
        </div>
      </div>

      <div className="text-right shrink-0">
        <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
          <Flame className="w-4 h-4 fill-amber-400" />
          <span>{currentStreak} dias</span>
        </div>
        <span className="text-[10px] text-slate-500 block mt-0.5">{totalMonthly} este mês</span>
      </div>
    </div>
  );
};
