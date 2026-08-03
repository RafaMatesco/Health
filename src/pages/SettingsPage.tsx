import React, { useState } from 'react';
import { Settings, User, Target, Save, Check, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { GoalType } from '../types';

export const SettingsPage: React.FC = () => {
  const { profile, updateProfile } = useApp();

  const [fullName, setFullName] = useState(profile.full_name);
  const [goalType, setGoalType] = useState<GoalType>(profile.goal_type);
  const [targetCalories, setTargetCalories] = useState(String(profile.target_calories));
  const [targetProtein, setTargetProtein] = useState(String(profile.target_protein));
  const [targetCarbs, setTargetCarbs] = useState(String(profile.target_carbs));
  const [targetFat, setTargetFat] = useState(String(profile.target_fat));
  const [targetWater, setTargetWater] = useState(String(profile.target_water_ml));
  const [aiApiKey, setAiApiKey] = useState(profile.ai_api_key || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName,
      goal_type: goalType,
      target_calories: Number(targetCalories),
      target_protein: Number(targetProtein),
      target_carbs: Number(targetCarbs),
      target_fat: Number(targetFat),
      target_water_ml: Number(targetWater),
      ai_api_key: aiApiKey
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const setPresetGoal = (type: GoalType) => {
    setGoalType(type);
    if (type === 'hypertrophy') {
      setTargetCalories('2400');
      setTargetProtein('170');
      setTargetCarbs('250');
      setTargetFat('70');
    } else if (type === 'weight_loss') {
      setTargetCalories('1800');
      setTargetProtein('160');
      setTargetCarbs('150');
      setTargetFat('55');
    } else {
      setTargetCalories('2100');
      setTargetProtein('150');
      setTargetCarbs('220');
      setTargetFat('60');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden flex items-center justify-between border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-slate-950 font-extrabold shadow-glow-emerald">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-white">Configurações & Perfil</h2>
            <p className="text-xs text-slate-400">Personalize suas metas diárias, tema e conexões de API</p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/40 text-xs font-bold animate-fadeIn">
            <Check className="w-4 h-4 text-brand-400" />
            Configurações Salvas!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile & Objectives */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 border border-white/5">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <User className="w-5 h-5 text-brand-400" />
            Perfil do Usuário
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nome Completo</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Objetivo de Saúde</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'hypertrophy', label: 'Hipertrofia' },
                  { id: 'weight_loss', label: 'Emagrecimento' },
                  { id: 'maintenance', label: 'Manutenção' },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setPresetGoal(g.id as GoalType)}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all ${
                      goalType === g.id
                        ? 'bg-brand-500/20 border-brand-500 text-brand-300'
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Nutritional & Water Targets */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 border border-white/5">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Metas Diárias de Nutrição & Água
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-medium text-brand-400 mb-1">Calorias (kcal)</label>
              <input
                type="number"
                value={targetCalories}
                onChange={(e) => setTargetCalories(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-rose-400 mb-1">Proteínas (g)</label>
              <input
                type="number"
                value={targetProtein}
                onChange={(e) => setTargetProtein(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-amber-400 mb-1">Carboidratos (g)</label>
              <input
                type="number"
                value={targetCarbs}
                onChange={(e) => setTargetCarbs(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-indigo-400 mb-1">Gorduras (g)</label>
              <input
                type="number"
                value={targetFat}
                onChange={(e) => setTargetFat(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-cyan-400 mb-1">Água (ml)</label>
              <input
                type="number"
                step="250"
                value={targetWater}
                onChange={(e) => setTargetWater(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* AI & Supabase Integrations */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 border border-purple-500/20">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Integração com IA (Opcional)
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-purple-300 mb-1">Chave de API OpenAI (Para IA de Nutrição)</label>
              <input
                type="password"
                value={aiApiKey}
                onChange={(e) => setAiApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Se deixar em branco, o Vital utiliza o motor inteligente de leitura de texto local pré-instalado gratuitamente.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-emerald transition-all"
        >
          <Save className="w-5 h-5" />
          Salvar Alterações de Configuração
        </button>
      </form>
    </div>
  );
};
