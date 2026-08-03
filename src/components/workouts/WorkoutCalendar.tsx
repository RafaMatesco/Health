import React, { useState } from 'react';
import { Dumbbell, Flame, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../services/mockData';

export const WorkoutCalendar: React.FC = () => {
  const { setSelectedDate, toggleWorkoutCheckin, isWorkoutDoneOnDate, getWorkoutStreak } = useApp();

  const [currentViewDate, setCurrentViewDate] = useState<Date>(new Date());
  const { currentStreak, totalMonthly } = getWorkoutStreak();

  const todayStr = getTodayDateString();

  const year = currentViewDate.getFullYear();
  const month = currentViewDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentViewDate(new Date(year, month + 1, 1));

  const calendarCells = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarCells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    calendarCells.push({ day, fullDateStr: `${year}-${monthStr}-${dayStr}` });
  }

  const isTodayTrained = isWorkoutDoneOnDate(todayStr);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="minimal-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              Frequência de Treino
              <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                {currentStreak}d streak
              </span>
            </h3>
            <p className="text-xs text-slate-400">{totalMonthly} treinos realizados este mês</p>
          </div>
        </div>

        <button
          onClick={() => toggleWorkoutCheckin(todayStr)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            isTodayTrained
              ? 'bg-brand-500 text-slate-950 hover:bg-brand-400'
              : 'bg-slate-900 border border-white/10 text-white hover:bg-slate-800'
          }`}
        >
          {isTodayTrained ? 'Hoje Concluído ✓' : '+ Treinei Hoje'}
        </button>
      </div>

      {/* Calendar Grid Container */}
      <div className="minimal-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-sm text-white">
            {monthNames[month]} <span className="text-slate-400 font-normal">{year}</span>
          </h4>

          <div className="flex items-center gap-1">
            <button onClick={prevMonth} className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setCurrentViewDate(new Date())} className="px-2 py-1 text-xs font-semibold text-brand-400">
              Hoje
            </button>
            <button onClick={nextMonth} className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
            <span key={d} className="text-[11px] font-semibold text-slate-500 uppercase">{d}</span>
          ))}
        </div>

        {/* Calendar Cells */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarCells.map((cell, idx) => {
            if (!cell) return <div key={`empty-${idx}`} className="h-10 sm:h-12 rounded-lg bg-transparent" />;

            const { day, fullDateStr } = cell;
            const isTrained = isWorkoutDoneOnDate(fullDateStr);
            const isCurrentToday = todayStr === fullDateStr;

            return (
              <button
                key={fullDateStr}
                onClick={() => {
                  setSelectedDate(fullDateStr);
                  toggleWorkoutCheckin(fullDateStr);
                }}
                className={`h-10 sm:h-12 rounded-xl p-1 flex flex-col items-center justify-between border transition-all text-xs font-semibold ${
                  isTrained
                    ? 'bg-brand-500/15 border-brand-500/40 text-brand-300 font-bold'
                    : isCurrentToday
                    ? 'bg-slate-900 border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-900/40 border-white/[0.04] text-slate-400 hover:border-white/20'
                }`}
              >
                <span>{day}</span>
                {isTrained && <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
