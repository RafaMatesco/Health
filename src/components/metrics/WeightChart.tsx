import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Plus, TrendingDown, TrendingUp, Scale, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AddMetricModal } from './AddMetricModal';

export const WeightChart: React.FC = () => {
  const { bodyMetrics } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sort metrics chronologically for chart
  const sortedMetrics = [...bodyMetrics].sort((a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime());

  // Format data for Recharts
  const chartData = sortedMetrics.map(m => ({
    date: m.logged_at.split('-').slice(1).join('/'),
    fullDate: m.logged_at,
    peso: m.weight_kg,
    gordura: m.body_fat_percentage,
    cintura: m.waist_cm
  }));

  const latest = sortedMetrics[sortedMetrics.length - 1];
  const previous = sortedMetrics.length > 1 ? sortedMetrics[sortedMetrics.length - 2] : null;

  const weightDiff = previous ? (latest.weight_kg - previous.weight_kg).toFixed(1) : 0;
  const isLoss = Number(weightDiff) <= 0;

  return (
    <div className="space-y-4">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Peso Atual</span>
            <Scale className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-extrabold text-white">{latest?.weight_kg || 0}</span>
            <span className="text-xs text-slate-400 font-medium">kg</span>
          </div>
          {previous && (
            <span className={`text-[10px] font-semibold flex items-center gap-0.5 mt-1 ${isLoss ? 'text-brand-400' : 'text-rose-400'}`}>
              {isLoss ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
              {weightDiff} kg última medição
            </span>
          )}
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Gordura</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-extrabold text-white">{latest?.body_fat_percentage || '--'}</span>
            <span className="text-xs text-slate-400 font-medium">%</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Percentual estimado</span>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Cintura</span>
            <Scale className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-extrabold text-white">{latest?.waist_cm || '--'}</span>
            <span className="text-xs text-slate-400 font-medium">cm</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Circunferência abdominal</span>
        </div>

        <div className="glass-panel p-3.5 rounded-2xl border border-white/5 flex flex-col justify-between bg-gradient-to-br from-cyan-950/40 to-slate-900 border-cyan-500/30">
          <div className="flex items-center justify-between text-cyan-300 text-xs mb-1">
            <span>Ação</span>
            <Plus className="w-4 h-4 text-cyan-400" />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all mt-1"
          >
            + Nova Medição
          </button>
        </div>
      </div>

      {/* Main Recharts Area */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-base text-white">Evolução de Peso Corporal (kg)</h3>
            <p className="text-xs text-slate-400">Tendência ao longo do tempo</p>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Area type="monotone" dataKey="peso" name="Peso (kg)" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History Table */}
      <div className="glass-panel p-4 rounded-2xl">
        <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          Histórico de Medições
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] border-b border-white/5">
              <tr>
                <th className="py-2 px-3">Data</th>
                <th className="py-2 px-3">Peso (kg)</th>
                <th className="py-2 px-3">Gordura (%)</th>
                <th className="py-2 px-3">Cintura (cm)</th>
                <th className="py-2 px-3">Braços (cm)</th>
                <th className="py-2 px-3">Tórax (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedMetrics.slice().reverse().map((m) => (
                <tr key={m.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-white">{m.logged_at}</td>
                  <td className="py-2.5 px-3 font-bold text-cyan-400">{m.weight_kg} kg</td>
                  <td className="py-2.5 px-3">{m.body_fat_percentage ? `${m.body_fat_percentage}%` : '--'}</td>
                  <td className="py-2.5 px-3">{m.waist_cm ? `${m.waist_cm} cm` : '--'}</td>
                  <td className="py-2.5 px-3">{m.arms_cm ? `${m.arms_cm} cm` : '--'}</td>
                  <td className="py-2.5 px-3">{m.chest_cm ? `${m.chest_cm} cm` : '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddMetricModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
