import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';

import { DashboardPage } from './pages/DashboardPage';
import { NutritionPage } from './pages/NutritionPage';
import { WorkoutCalendar } from './components/workouts/WorkoutCalendar';
import { WeightChart } from './components/metrics/WeightChart';
import { SettingsPage } from './pages/SettingsPage';

import { AiMealInputModal } from './components/nutrition/AiMealInputModal';
import { AddFoodModal } from './components/nutrition/AddFoodModal';
import { AddMetricModal } from './components/metrics/AddMetricModal';

export function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [isAddMetricOpen, setIsAddMetricOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <Header onOpenAiModal={() => setIsAiModalOpen(true)} />

        {/* Page Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 mb-16 md:mb-0">
          {activeTab === 'dashboard' && (
            <DashboardPage
              onOpenAddMeal={() => setIsAddMealOpen(true)}
              onOpenAiParser={() => setIsAiModalOpen(true)}
              onOpenAddMetric={() => setIsAddMetricOpen(true)}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'nutrition' && <NutritionPage />}

          {activeTab === 'workout' && <WorkoutCalendar />}

          {activeTab === 'metrics' && <WeightChart />}

          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Global Modals */}
      <AiMealInputModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      <AddFoodModal
        isOpen={isAddMealOpen}
        onClose={() => setIsAddMealOpen(false)}
        mealType="lunch"
        onOpenAiParser={() => {
          setIsAddMealOpen(false);
          setIsAiModalOpen(true);
        }}
      />

      <AddMetricModal
        isOpen={isAddMetricOpen}
        onClose={() => setIsAddMetricOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
