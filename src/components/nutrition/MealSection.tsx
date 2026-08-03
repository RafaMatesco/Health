import React from 'react';
import { Plus, Trash2, Coffee, Sun, Moon, Apple } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { MealType } from '../../types';

interface MealSectionProps {
  mealType: MealType;
  title: string;
  onOpenAddModal: (mealType: MealType) => void;
}

export const MealSection: React.FC<MealSectionProps> = ({ mealType, title, onOpenAddModal }) => {
  const { selectedDate, mealLogs, deleteMealLog } = useApp();

  const dayMealLogs = mealLogs.filter(
    m => m.logged_at === selectedDate && m.meal_type === mealType
  );

  const totalCalories = dayMealLogs.reduce((acc, item) => acc + item.calories, 0);
  const totalProtein = dayMealLogs.reduce((acc, item) => acc + item.protein, 0);

  const getMealIcon = () => {
    switch (mealType) {
      case 'breakfast': return <Coffee className="w-4 h-4 text-amber-400" />;
      case 'lunch': return <Sun className="w-4 h-4 text-orange-400" />;
      case 'dinner': return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'snack': return <Apple className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="minimal-card p-4 space-y-3">
      {/* Meal Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          {getMealIcon()}
          <h4 className="font-bold text-sm text-white">{title}</h4>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-extrabold text-xs text-brand-400">{totalCalories} kcal</span>
          <span className="text-[11px] text-slate-400 font-medium">P: {totalProtein.toFixed(0)}g</span>
          <button
            onClick={() => onOpenAddModal(mealType)}
            className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-brand-400 transition-colors"
            title="Adicionar alimento"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Items list */}
      {dayMealLogs.length === 0 ? (
        <div className="py-2 text-center text-xs text-slate-500">
          Nenhum alimento no {title.toLowerCase()}.
        </div>
      ) : (
        <div className="space-y-1">
          {dayMealLogs.map((item) => (
            <div
              key={item.id}
              className="py-1.5 px-2 rounded-lg hover:bg-slate-900/60 flex items-center justify-between text-xs transition-colors"
            >
              <div>
                <span className="font-medium text-white">{item.food_name}</span>
                <span className="text-[10px] text-slate-400 ml-2">
                  {item.serving_info} • P: {item.protein}g | C: {item.carbs}g | G: {item.fat}g
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-300">{item.calories} kcal</span>
                <button
                  onClick={() => deleteMealLog(item.id)}
                  className="text-slate-600 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
