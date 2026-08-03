import React, { useState } from 'react';
import { Activity, X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AddMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMetricModal: React.FC<AddMetricModalProps> = ({ isOpen, onClose }) => {
  const { selectedDate, addBodyMetric } = useApp();

  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [waist, setWaist] = useState('');
  const [chest, setChest] = useState('');
  const [arms, setArms] = useState('');
  const [legs, setLegs] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!weight || isNaN(Number(weight)) || Number(weight) <= 0) {
      setErrorMsg('O peso corporal é obrigatório.');
      return;
    }

    addBodyMetric({
      weight_kg: Number(weight),
      body_fat_percentage: bodyFat ? Number(bodyFat) : undefined,
      waist_cm: waist ? Number(waist) : undefined,
      chest_cm: chest ? Number(chest) : undefined,
      arms_cm: arms ? Number(arms) : undefined,
      legs_cm: legs ? Number(legs) : undefined,
      logged_at: selectedDate
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-modal w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl relative border border-cyan-500/30">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Registrar Medidas Corporais</h3>
            <p className="text-xs text-slate-400">Acompanhe sua evolução física</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Peso (kg) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ex: 79.5"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Gordura Corporal (%)</label>
              <input
                type="number"
                step="0.1"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                placeholder="Ex: 14.5"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Cintura (cm)</label>
              <input
                type="number"
                step="0.5"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                placeholder="Ex: 81.5"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tórax (cm)</label>
              <input
                type="number"
                step="0.5"
                value={chest}
                onChange={(e) => setChest(e.target.value)}
                placeholder="Ex: 105"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Braços (cm)</label>
              <input
                type="number"
                step="0.5"
                value={arms}
                onChange={(e) => setArms(e.target.value)}
                placeholder="Ex: 39.5"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Pernas (cm)</label>
              <input
                type="number"
                step="0.5"
                value={legs}
                onChange={(e) => setLegs(e.target.value)}
                placeholder="Ex: 61"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
          >
            <Check className="w-4 h-4" />
            Salvar Medidas para {selectedDate}
          </button>
        </form>
      </div>
    </div>
  );
};
