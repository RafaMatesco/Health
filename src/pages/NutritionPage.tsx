import React, { useState } from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { MealType } from '../types';
import { MealSection } from '../components/nutrition/MealSection';
import { AddFoodModal } from '../components/nutrition/AddFoodModal';
import { AiMealInputModal } from '../components/nutrition/AiMealInputModal';
import { CreateFoodModal } from '../components/nutrition/CreateFoodModal';

export const NutritionPage: React.FC = () => {
  const { profile, selectedDate, getDailyTotals } = useApp();
  const totals = getDailyTotals(selectedDate);

  const [activeMealType, setActiveMealType] = useState<MealType | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isCreateFoodOpen, setIsCreateFoodOpen] = useState(false);

  return (
    <div className="space-y-4 pb-12 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between py-1">
        <div>
          <h2 className="font-bold text-xl text-white">Diário de Nutrição</h2>
          <p className="text-xs text-slate-400">Data: {selectedDate}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="py-1.5 px-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            IA Texto
          </button>
          <button
            onClick={() => setIsCreateFoodOpen(true)}
            className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-brand-400" />
            Novo Alimento
          </button>
        </div>
      </div>

      {/* Top Daily Summary Strip */}
      <div className="grid grid-cols-4 gap-2">
        <div className="minimal-card p-3 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-medium block">Calorias</span>
          <span className="text-sm font-extrabold text-brand-400">{totals.calories}</span>
          <span className="text-[10px] text-slate-500 block">/ {profile.target_calories}</span>
        </div>
        <div className="minimal-card p-3 text-center">
          <span className="text-[10px] text-rose-400 uppercase font-medium block">Proteínas</span>
          <span className="text-sm font-extrabold text-white">{totals.protein.toFixed(0)}g</span>
          <span className="text-[10px] text-slate-500 block">/ {profile.target_protein}g</span>
        </div>
        <div className="minimal-card p-3 text-center">
          <span className="text-[10px] text-amber-400 uppercase font-medium block">Carbs</span>
          <span className="text-sm font-extrabold text-white">{totals.carbs.toFixed(0)}g</span>
          <span className="text-[10px] text-slate-500 block">/ {profile.target_carbs}g</span>
        </div>
        <div className="minimal-card p-3 text-center">
          <span className="text-[10px] text-indigo-400 uppercase font-medium block">Gorduras</span>
          <span className="text-sm font-extrabold text-white">{totals.fat.toFixed(0)}g</span>
          <span className="text-[10px] text-slate-500 block">/ {profile.target_fat}g</span>
        </div>
      </div>

      {/* Meal Sections */}
      <div className="space-y-3">
        <MealSection
          mealType="breakfast"
          title="Café da Manhã"
          onOpenAddModal={(type) => setActiveMealType(type)}
        />
        <MealSection
          mealType="lunch"
          title="Almoço"
          onOpenAddModal={(type) => setActiveMealType(type)}
        />
        <MealSection
          mealType="dinner"
          title="Jantar"
          onOpenAddModal={(type) => setActiveMealType(type)}
        />
        <MealSection
          mealType="snack"
          title="Lanches & Snacks"
          onOpenAddModal={(type) => setActiveMealType(type)}
        />
      </div>

      {/* Modals */}
      {activeMealType && (
        <AddFoodModal
          isOpen={!!activeMealType}
          onClose={() => setActiveMealType(null)}
          mealType={activeMealType}
          onOpenAiParser={() => setIsAiModalOpen(true)}
        />
      )}

      <AiMealInputModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        defaultMealType={activeMealType || 'lunch'}
      />

      <CreateFoodModal
        isOpen={isCreateFoodOpen}
        onClose={() => setIsCreateFoodOpen(false)}
      />
    </div>
  );
};
