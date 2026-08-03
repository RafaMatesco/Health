import React from 'react';
import { Flame, Calendar, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../services/mockData';

interface HeaderProps {
  onOpenAiModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAiModal }) => {
  const { selectedDate, setSelectedDate, getWorkoutStreak } = useApp();
  const { currentStreak } = getWorkoutStreak();

  const isToday = selectedDate === getTodayDateString();

  return (
    <header className="sticky top-0 z-30 bg-[#0b0f19]/80 backdrop-blur-lg border-b border-white/[0.06] px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-black text-slate-950 text-base">
            V
          </div>
          <span className="font-bold text-white text-base tracking-tight">VITAL</span>
        </div>

        {/* Right side tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick AI Button */}
          {onOpenAiModal && (
            <button
              onClick={onOpenAiModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:text-white text-xs font-medium transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden xs:inline">Refeição via IA</span>
            </button>
          )}

          {/* Workout Streak */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{currentStreak}d</span>
          </div>

          {/* Date Picker */}
          <div className="relative flex items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="bg-slate-900/90 text-white text-xs font-medium pl-8 pr-2 py-1.5 rounded-lg border border-white/10 focus:outline-none focus:border-brand-500"
            />
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          </div>

          {!isToday && (
            <button
              onClick={() => setSelectedDate(getTodayDateString())}
              className="text-[11px] font-semibold text-brand-400 hover:underline"
            >
              Hoje
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
