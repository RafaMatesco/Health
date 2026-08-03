import React, { useState } from 'react';
import { PlusCircle, X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { FoodCategory, FoodItem } from '../../types';

interface CreateFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodCreated?: (food: FoodItem) => void;
}

export const CreateFoodModal: React.FC<CreateFoodModalProps> = ({
  isOpen,
  onClose,
  onFoodCreated
}) => {
  const { addCustomFood } = useApp();

  const [name, setName] = useState('');
  const [servingSize, setServingSize] = useState('100g');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [fiber, setFiber] = useState('');
  const [category, setCategory] = useState<FoodCategory>('proteinas');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('O nome do alimento é obrigatório.');
      return;
    }
    if (!calories || isNaN(Number(calories)) || Number(calories) < 0) {
      setErrorMsg('A quantidade de calorias é obrigatória.');
      return;
    }

    const newFood = addCustomFood({
      name: name.trim(),
      serving_size: servingSize.trim() || '100g',
      calories: Number(calories),
      protein: protein ? Number(protein) : 0,
      carbs: carbs ? Number(carbs) : 0,
      fat: fat ? Number(fat) : 0,
      fiber: fiber ? Number(fiber) : 0,
      category
    });

    if (onFoodCreated) {
      onFoodCreated(newFood);
    }

    // Reset
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setFiber('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-modal w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl relative border border-brand-500/30">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Cadastrar Novo Alimento</h3>
            <p className="text-xs text-slate-400">Adicione à sua base personalizada</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nome do Alimento (Obrigatório) */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Nome do Alimento <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Frango Desfiado com Milho"
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Porção e Categoria */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tamanho da Porção</label>
              <input
                type="text"
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
                placeholder="Ex: 100g ou 1 porção"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FoodCategory)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="proteinas">Proteínas</option>
                <option value="carboidratos">Carboidratos</option>
                <option value="gorduras">Gorduras</option>
                <option value="frutas_vegetais">Frutas e Vegetais</option>
                <option value="pratos_prontos">Pratos Prontos</option>
                <option value="bebidas">Bebidas</option>
                <option value="outros">Outros</option>
              </select>
            </div>
          </div>

          {/* Calorias (Obrigatório) */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Calorias (kcal por porção) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="Ex: 165"
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Macronutrientes (Opcionais / Recomendados) */}
          <div className="pt-2 border-t border-white/10">
            <p className="text-[11px] font-semibold text-slate-400 mb-2">Macronutrientes por porção (g):</p>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] text-rose-400 mb-1">Proteínas</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-amber-400 mb-1">Carbs</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-indigo-400 mb-1">Gorduras</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-emerald-400 mb-1">Fibras</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={fiber}
                  onChange={(e) => setFiber(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-glow-emerald transition-all"
          >
            <Check className="w-4 h-4" />
            Salvar Alimento na Minha Base
          </button>
        </form>
      </div>
    </div>
  );
};
