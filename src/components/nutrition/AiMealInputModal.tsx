import React, { useState } from 'react';
import { Sparkles, X, Loader2, Check, Utensils } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { MealType } from '../../types';
import { parseMealTextWithAi, type ParsedAiItem } from '../../services/aiService';

interface AiMealInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMealType?: MealType;
}

export const AiMealInputModal: React.FC<AiMealInputModalProps> = ({
  isOpen,
  onClose,
  defaultMealType = 'lunch'
}) => {
  const { foods, profile, selectedDate, addMealLog } = useApp();
  
  const [inputText, setInputText] = useState('');
  const [mealType, setMealType] = useState<MealType>(defaultMealType);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedAiItem[] | null>(null);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleProcessText = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setParsedResult(null);

    try {
      const result = await parseMealTextWithAi(
        inputText,
        mealType,
        foods,
        profile.ai_api_key
      );
      setParsedResult(result.items);
      setStatusMsg(result.confidenceMessage);
    } catch (err) {
      console.error('Erro ao processar texto com IA:', err);
      setStatusMsg('Erro ao processar texto. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmAdd = () => {
    if (!parsedResult || parsedResult.length === 0) return;

    for (const item of parsedResult) {
      addMealLog({
        meal_type: mealType,
        food_name: item.food_name,
        serving_info: item.serving_info,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        fiber: item.fiber,
        quantity: item.quantity,
        logged_at: selectedDate
      });
    }

    // Reset and close
    setInputText('');
    setParsedResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-modal w-full max-w-lg rounded-2xl p-5 sm:p-6 shadow-2xl relative border border-purple-500/30 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Assistente de Nutrição IA</h3>
            <p className="text-xs text-purple-300">Digite em texto natural o que você comeu</p>
          </div>
        </div>

        {/* Form Body */}
        <div className="space-y-4">
          {/* Meal Type selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Selecione a Refeição:</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'breakfast', label: 'Café' },
                { id: 'lunch', label: 'Almoço' },
                { id: 'dinner', label: 'Jantar' },
                { id: 'snack', label: 'Lanche' },
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMealType(m.id as MealType)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    mealType === m.id
                      ? 'bg-purple-600/30 border-purple-400 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                      : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea Input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Descrição da Refeição:</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ex: Comi 200g de peito de frango grelhado, 150g de arroz branco, 1 concha de feijão preto e salada verde no almoço."
              rows={3}
              className="w-full bg-slate-900/90 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Dica: Você pode informar porções em gramas (g), colheres, conchas ou unidades.
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleProcessText}
            disabled={isProcessing || !inputText.trim()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analisando Refeição...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analisar e Extrair Alimentos
              </>
            )}
          </button>

          {/* Result Preview */}
          {parsedResult && (
            <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-purple-500/30 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
                  <Utensils className="w-3.5 h-3.5" />
                  Alimentos Identificados ({parsedResult.length})
                </span>
                <span className="text-[10px] text-slate-400">{statusMsg}</span>
              </div>

              <div className="divide-y divide-white/5 max-h-48 overflow-y-auto pr-1">
                {parsedResult.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-white">{item.food_name}</p>
                      <p className="text-[10px] text-slate-400">{item.serving_info}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand-400">{item.calories} kcal</p>
                      <p className="text-[10px] text-slate-400">
                        P: {item.protein}g | C: {item.carbs}g | G: {item.fat}g
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Total Estimado:</span>
                <span className="text-purple-300">
                  {parsedResult.reduce((acc, i) => acc + i.calories, 0)} kcal | P: {parsedResult.reduce((acc, i) => acc + i.protein, 0).toFixed(1)}g
                </span>
              </div>

              <button
                onClick={handleConfirmAdd}
                className="w-full mt-2 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-glow-emerald transition-all"
              >
                <Check className="w-4 h-4" />
                Adicionar Todos à Refeição
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
