import React from 'react';
import { LayoutDashboard, UtensilsCrossed, Dumbbell, Activity, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'nutrition', label: 'Nutrição', icon: UtensilsCrossed },
    { id: 'workout', label: 'Treino', icon: Dumbbell },
    { id: 'metrics', label: 'Evolução', icon: Activity },
    { id: 'settings', label: 'Perfil', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d1321]/95 backdrop-blur-md border-t border-white/10 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 ${
                isActive ? 'text-brand-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <div className="absolute -top-1.5 w-8 h-1 bg-brand-500 rounded-full shadow-[0_0_10px_#10b981]" />
              )}
              <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110 bg-brand-500/10' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
