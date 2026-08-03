import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type {
  UserProfile,
  FoodItem,
  MealLogItem,
  WorkoutCheckin,
  BodyMetric,
  WaterLog
} from '../types';
import {
  INITIAL_USER_PROFILE,
  MOCK_FOODS,
  INITIAL_MEAL_LOGS,
  INITIAL_WORKOUT_CHECKINS,
  INITIAL_BODY_METRICS,
  getTodayDateString
} from '../services/mockData';

interface AppContextType {
  profile: UserProfile;
  foods: FoodItem[];
  mealLogs: MealLogItem[];
  workoutCheckins: WorkoutCheckin[];
  bodyMetrics: BodyMetric[];
  waterLogs: WaterLog[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  
  // Profile
  updateProfile: (updated: Partial<UserProfile>) => void;
  
  // Foods & Meals
  addCustomFood: (food: Omit<FoodItem, 'id' | 'created_at'>) => FoodItem;
  addMealLog: (log: Omit<MealLogItem, 'id'>) => void;
  deleteMealLog: (id: string) => void;
  
  // Workouts & Calendar
  toggleWorkoutCheckin: (dateStr: string, workoutName?: string, notes?: string) => void;
  isWorkoutDoneOnDate: (dateStr: string) => boolean;
  getWorkoutStreak: () => { currentStreak: number; totalMonthly: number };
  
  // Body Metrics
  addBodyMetric: (metric: Omit<BodyMetric, 'id'>) => void;
  
  // Water
  addWater: (amountMl: number, dateStr?: string) => void;
  resetWater: (dateStr?: string) => void;
  getWaterTotal: (dateStr?: string) => number;

  // Summaries
  getDailyTotals: (dateStr: string) => {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'vital_user_profile',
  FOODS: 'vital_custom_foods',
  MEALS: 'vital_meal_logs',
  WORKOUTS: 'vital_workout_checkins',
  METRICS: 'vital_body_metrics',
  WATER: 'vital_water_logs'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

  // Profile State
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  // Foods State
  const [foods, setFoods] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOODS);
    if (saved) {
      const custom: FoodItem[] = JSON.parse(saved);
      return [...MOCK_FOODS, ...custom];
    }
    return MOCK_FOODS;
  });

  // Meals State
  const [mealLogs, setMealLogs] = useState<MealLogItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEALS);
    return saved ? JSON.parse(saved) : INITIAL_MEAL_LOGS;
  });

  // Workouts State
  const [workoutCheckins, setWorkoutCheckins] = useState<WorkoutCheckin[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    return saved ? JSON.parse(saved) : INITIAL_WORKOUT_CHECKINS;
  });

  // Metrics State
  const [bodyMetrics, setBodyMetrics] = useState<BodyMetric[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.METRICS);
    return saved ? JSON.parse(saved) : INITIAL_BODY_METRICS;
  });

  // Water State
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WATER);
    return saved ? JSON.parse(saved) : [
      { id: 'w-log-1', amount_ml: 2250, logged_date: getTodayDateString() }
    ];
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    const customOnly = foods.filter(f => f.is_custom);
    localStorage.setItem(STORAGE_KEYS.FOODS, JSON.stringify(customOnly));
  }, [foods]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(mealLogs));
  }, [mealLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workoutCheckins));
  }, [workoutCheckins]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(bodyMetrics));
  }, [bodyMetrics]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATER, JSON.stringify(waterLogs));
  }, [waterLogs]);

  // Actions
  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
  };

  const addCustomFood = (foodData: Omit<FoodItem, 'id' | 'created_at'>): FoodItem => {
    const newFood: FoodItem = {
      ...foodData,
      id: `custom-f-${Date.now()}`,
      is_custom: true,
      created_at: new Date().toISOString()
    };
    setFoods(prev => [newFood, ...prev]);
    return newFood;
  };

  const addMealLog = (logData: Omit<MealLogItem, 'id'>) => {
    const newLog: MealLogItem = {
      ...logData,
      id: `meal-log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    setMealLogs(prev => [newLog, ...prev]);
  };

  const deleteMealLog = (id: string) => {
    setMealLogs(prev => prev.filter(m => m.id !== id));
  };

  const toggleWorkoutCheckin = (dateStr: string, workoutName = 'Treino Concluído', notes = '') => {
    const existing = workoutCheckins.find(w => w.workout_date === dateStr);
    if (existing) {
      setWorkoutCheckins(prev => prev.filter(w => w.workout_date !== dateStr));
    } else {
      const newCheckin: WorkoutCheckin = {
        id: `workout-${Date.now()}`,
        workout_date: dateStr,
        workout_name: workoutName,
        notes: notes,
        created_at: new Date().toISOString()
      };
      setWorkoutCheckins(prev => [newCheckin, ...prev]);

      // Confetti celebration!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore if canvas not supported
      }
    }
  };

  const isWorkoutDoneOnDate = (dateStr: string): boolean => {
    return workoutCheckins.some(w => w.workout_date === dateStr);
  };

  const getWorkoutStreak = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Total monthly count
    const totalMonthly = workoutCheckins.filter(w => {
      const d = new Date(w.workout_date + 'T00:00:00');
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    // Calculate consecutive streak back from today/yesterday
    let streak = 0;
    let checkDate = new Date();

    // Check if today is logged
    const todayStr = getTodayDateString();
    if (!isWorkoutDoneOnDate(todayStr)) {
      // If today not logged yet, start checking from yesterday
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const yyyy = checkDate.getFullYear();
      const mm = String(checkDate.getMonth() + 1).padStart(2, '0');
      const dd = String(checkDate.getDate()).padStart(2, '0');
      const dStr = `${yyyy}-${mm}-${dd}`;

      if (isWorkoutDoneOnDate(dStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return { currentStreak: streak, totalMonthly };
  };

  const addBodyMetric = (metricData: Omit<BodyMetric, 'id'>) => {
    const newMetric: BodyMetric = {
      ...metricData,
      id: `metric-${Date.now()}`
    };
    setBodyMetrics(prev => [newMetric, ...prev.filter(m => m.logged_at !== metricData.logged_at)]);
  };

  const addWater = (amountMl: number, dateStr = selectedDate) => {
    setWaterLogs(prev => {
      const existing = prev.find(w => w.logged_date === dateStr);
      if (existing) {
        return prev.map(w => w.logged_date === dateStr ? { ...w, amount_ml: w.amount_ml + amountMl } : w);
      } else {
        return [...prev, { id: `water-${Date.now()}`, amount_ml: amountMl, logged_date: dateStr }];
      }
    });
  };

  const resetWater = (dateStr = selectedDate) => {
    setWaterLogs(prev => prev.map(w => w.logged_date === dateStr ? { ...w, amount_ml: 0 } : w));
  };

  const getWaterTotal = (dateStr = selectedDate): number => {
    const log = waterLogs.find(w => w.logged_date === dateStr);
    return log ? log.amount_ml : 0;
  };

  const getDailyTotals = (dateStr: string) => {
    const dayMeals = mealLogs.filter(m => m.logged_at === dateStr);
    return dayMeals.reduce((acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
      fiber: acc.fiber + item.fiber
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  return (
    <AppContext.Provider value={{
      profile,
      foods,
      mealLogs,
      workoutCheckins,
      bodyMetrics,
      waterLogs,
      selectedDate,
      setSelectedDate,
      updateProfile,
      addCustomFood,
      addMealLog,
      deleteMealLog,
      toggleWorkoutCheckin,
      isWorkoutDoneOnDate,
      getWorkoutStreak,
      addBodyMetric,
      addWater,
      resetWater,
      getWaterTotal,
      getDailyTotals
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};
