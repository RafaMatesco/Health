import React from 'react';
import { LayoutDashboard, UtensilsCrossed, Dumbbell, Activity, Settings, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { profile } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'nutrition', label: 'Nutrição & Dieta', icon: UtensilsCrossed },
    { id: 'workout', label: 'Treino & Calendário', icon: Dumbbell },
    { id: 'metrics', label: 'Evolução Corporal', icon: Activity },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0d1321]/80 backdrop-blur-xl border-r border-white/10 p-4 min-h-screen sticky top-0">
      <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center font-black text-slate-950 text-2xl shadow-glow-emerald">
          V
        </div>
        <div>
          <h2 className="font-bold text-white text-lg tracking-wider">VITAL</h2>
          <span className="text-[11px] font-semibold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
            {profile.goal_type === 'hypertrophy' ? 'Hipertrofia' : profile.goal_type === 'weight_loss' ? 'Emagrecimento' : 'Manutenção'}
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info Footer */}
      <div className="pt-4 border-t border-white/10 flex items-center gap-3 px-2">
        <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-slate-300">
          <User className="w-5 h-5" />
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-semibold text-white truncate">{profile.full_name}</p>
          <p className="text-[10px] text-slate-400 truncate">{profile.target_calories} kcal / dia</p>
        </div>
      </div>
    </aside>
  );
};
