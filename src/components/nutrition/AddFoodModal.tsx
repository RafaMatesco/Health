import React, { useState } from 'react';
import { Search, X, PlusCircle, Sparkles, Check, Utensils } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { FoodItem, MealType } from '../../types';
import { CreateFoodModal } from './CreateFoodModal';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: MealType;
  onOpenAiParser?: () => void;
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  onClose,
  mealType,
  onOpenAiParser
}) => {
  const { foods, selectedDate, addMealLog } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (!isOpen) return null;

  const mealLabels: Record<MealType, string> = {
    breakfast: 'Café da Manhã',
    lunch: 'Almoço',
    dinner: 'Jantar',
    snack: 'Lanche'
  };

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddSelectedFood = () => {
    if (!selectedFood) return;

    addMealLog({
      meal_type: mealType,
      food_id: selectedFood.id,
      food_name: selectedFood.name,
      serving_info: `${selectedFood.serving_size}`,
      calories: Math.round(selectedFood.calories * quantity),
      protein: Math.round(selectedFood.protein * quantity * 10) / 10,
      carbs: Math.round(selectedFood.carbs * quantity * 10) / 10,
      fat: Math.round(selectedFood.fat * quantity * 10) / 10,
      fiber: selectedFood.fiber ? Math.round(selectedFood.fiber * quantity * 10) / 10 : 0,
      quantity,
      logged_at: selectedDate
    });

    setSelectedFood(null);
    setQuantity(1);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="glass-modal w-full max-w-lg rounded-2xl p-4 sm:p-6 shadow-2xl relative border border-white/10 max-h-[90vh] flex flex-col">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                Adicionar Alimento no <span className="text-brand-400">{mealLabels[mealType]}</span>
              </h3>
              <p className="text-xs text-slate-400">Busque na base tradicional ou cadastre alimentos</p>
            </div>
          </div>

          {/* Top Actions: AI & Custom Food */}
          <div className="flex gap-2 mb-3">
            {onOpenAiParser && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAiParser();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/30 hover:border-purple-400 text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Registrar via Texto / IA
              </button>
            )}
            <button
              onClick={() => setIsCreateOpen(true)}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-brand-400" />
              Criar Novo Alimento
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por arroz, frango, ovo, aveia..."
              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'proteinas', label: 'Proteínas' },
              { id: 'carboidratos', label: 'Carbs' },
              { id: 'gorduras', label: 'Gorduras' },
              { id: 'frutas_vegetais', label: 'Frutas/Horta' },
              { id: 'pratos_prontos', label: 'Pratos Prontos' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-1 px-2.5 rounded-lg text-[11px] font-semibold whitespace-nowrap border transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-brand-500/20 border-brand-500 text-brand-300'
                    : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Food List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 mb-3 max-h-60 border border-white/5 rounded-xl p-1 bg-slate-950/50">
            {filteredFoods.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                Nenhum alimento encontrado.
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="block mx-auto mt-2 text-brand-400 hover:underline font-semibold"
                >
                  + Cadastrar este alimento
                </button>
              </div>
            ) : (
              filteredFoods.map(food => {
                const isSelected = selectedFood?.id === food.id;
                return (
                  <div
                    key={food.id}
                    onClick={() => setSelectedFood(food)}
                    className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-brand-500/15 border-brand-500/50 text-white'
                        : 'bg-slate-900/80 border-white/5 hover:border-white/20 text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-white">{food.name}</span>
                        {food.is_custom && (
                          <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1 rounded font-medium">
                            Meu Alimento
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {food.serving_size} • P: {food.protein}g | C: {food.carbs}g | G: {food.fat}g
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-xs text-brand-400">{food.calories} kcal</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quantity Selector & Confirm */}
          {selectedFood && (
            <div className="p-3 rounded-xl bg-slate-900 border border-brand-500/30 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{selectedFood.name}</p>
                  <p className="text-[10px] text-slate-400">Multiplicador de Porção ({selectedFood.serving_size})</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(prev => Math.max(0.25, prev - 0.25))}
                    className="w-7 h-7 rounded-lg bg-slate-800 border border-white/10 text-white font-bold flex items-center justify-center hover:bg-slate-700"
                  >
                    -
                  </button>
                  <span className="text-sm font-extrabold text-brand-400 w-10 text-center">{quantity}x</span>
                  <button
                    onClick={() => setQuantity(prev => prev + 0.25)}
                    className="w-7 h-7 rounded-lg bg-slate-800 border border-white/10 text-white font-bold flex items-center justify-center hover:bg-slate-700"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                <span className="text-slate-400">Total a adicionar:</span>
                <span className="font-extrabold text-white">
                  {Math.round(selectedFood.calories * quantity)} kcal | P: {(selectedFood.protein * quantity).toFixed(1)}g
                </span>
              </div>

              <button
                onClick={handleAddSelectedFood}
                className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-glow-emerald transition-all"
              >
                <Check className="w-4 h-4" />
                Adicionar {selectedFood.name}
              </button>
            </div>
          )}
        </div>
      </div>

      <CreateFoodModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onFoodCreated={(newFood) => {
          setSelectedFood(newFood);
        }}
      />
    </>
  );
};
