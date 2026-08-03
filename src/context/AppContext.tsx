import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { initSupabase, getSupabase } from '../services/supabaseClient';
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

  // Auth & Cloud State
  isAuthenticated: boolean;
  isSupabaseConfigured: boolean;
  isLoadingData: boolean;
  user: any;

  // Profile
  updateProfile: (updated: Partial<UserProfile>) => void;

  // Foods & Meals
  addCustomFood: (food: Omit<FoodItem, 'id' | 'created_at'>) => Promise<FoodItem | null>;
  addMealLog: (log: Omit<MealLogItem, 'id'>) => Promise<void>;
  deleteMealLog: (id: string) => Promise<void>;

  // Workouts & Calendar
  toggleWorkoutCheckin: (dateStr: string, workoutName?: string, notes?: string) => Promise<void>;
  isWorkoutDoneOnDate: (dateStr: string) => boolean;
  getWorkoutStreak: () => { currentStreak: number; totalMonthly: number };

  // Body Metrics
  addBodyMetric: (metric: Omit<BodyMetric, 'id'>) => Promise<void>;

  // Water
  addWater: (amountMl: number, dateStr?: string) => Promise<void>;
  resetWater: (dateStr?: string) => Promise<void>;
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
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

  // Cloud State
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Profile State (We keep localStorage ONLY for API Keys/Supabase URL before login)
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  // Data States (Initialize empty, NO localStorage)
  const [foods, setFoods] = useState<FoodItem[]>(MOCK_FOODS); 
  const [mealLogs, setMealLogs] = useState<MealLogItem[]>([]);
  const [workoutCheckins, setWorkoutCheckins] = useState<WorkoutCheckin[]>([]);
  const [bodyMetrics, setBodyMetrics] = useState<BodyMetric[]>([]);
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);

  // Persistence Effects for Profile Keys Only
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  // Auth & Supabase Setup
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envSupabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const activeSupabaseUrl = profile.supabase_url || envSupabaseUrl;
  const activeSupabaseKey = profile.supabase_anon_key || envSupabaseKey;
  const isSupabaseConfigured = Boolean(activeSupabaseUrl && activeSupabaseKey);

  useEffect(() => {
    if (isSupabaseConfigured && activeSupabaseUrl && activeSupabaseKey) {
      const supabase = initSupabase(activeSupabaseUrl, activeSupabaseKey);
      if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setIsAuthenticated(!!session);
          setUser(session?.user || null);
        });
        const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
          setIsAuthenticated(!!session);
          setUser(session?.user || null);
        });
        return () => {
          authListener.subscription.unsubscribe();
        };
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [isSupabaseConfigured, activeSupabaseUrl, activeSupabaseKey]);

  // Fetching Data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user) return;
      
      setIsLoadingData(true);
      const supabase = getSupabase();
      if (!supabase) {
        setIsLoadingData(false);
        return;
      }

      try {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profileData) {
          setProfile(prev => ({
            ...prev,
            full_name: profileData.full_name || prev.full_name,
            goal_type: profileData.goal_type || prev.goal_type,
            target_calories: profileData.target_calories || prev.target_calories,
            target_protein: profileData.target_protein || prev.target_protein,
            target_carbs: profileData.target_carbs || prev.target_carbs,
            target_fat: profileData.target_fat || prev.target_fat,
            target_water_ml: profileData.target_water_ml || prev.target_water_ml,
          }));
        } else {
          await supabase.from('profiles').insert([{
            id: user.id,
            full_name: profile.full_name,
            goal_type: profile.goal_type,
            target_calories: profile.target_calories,
            target_protein: profile.target_protein,
            target_carbs: profile.target_carbs,
            target_fat: profile.target_fat,
            target_water_ml: profile.target_water_ml
          }]);
        }

        const { data: mealsData } = await supabase.from('meal_logs').select('*').eq('user_id', user.id);
        if (mealsData) setMealLogs(mealsData);

        const { data: workoutsData } = await supabase.from('workout_checkins').select('*').eq('user_id', user.id);
        if (workoutsData) setWorkoutCheckins(workoutsData);

        const { data: metricsData } = await supabase.from('body_metrics').select('*').eq('user_id', user.id);
        if (metricsData) setBodyMetrics(metricsData);

        const { data: waterData } = await supabase.from('water_logs').select('*').eq('user_id', user.id);
        if (waterData) setWaterLogs(waterData);

        const { data: foodsData } = await supabase.from('foods').select('*').or(`is_custom.eq.false,created_by.eq.${user.id}`);
        if (foodsData) {
          const mergedFoods = [...MOCK_FOODS];
          foodsData.forEach((dbFood: any) => {
            if (!mergedFoods.find(f => f.name === dbFood.name)) {
              mergedFoods.push(dbFood);
            }
          });
          setFoods(mergedFoods);
        }
      } catch (err) {
        console.error("Error fetching data from Supabase:", err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  // Actions
  const updateProfile = async (updated: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
    
    if (isAuthenticated && user && getSupabase()) {
      const supabase = getSupabase()!;
      const { full_name, goal_type, target_calories, target_protein, target_carbs, target_fat, target_water_ml } = updated;
      
      const payload: any = {};
      if (full_name !== undefined) payload.full_name = full_name;
      if (goal_type !== undefined) payload.goal_type = goal_type;
      if (target_calories !== undefined) payload.target_calories = target_calories;
      if (target_protein !== undefined) payload.target_protein = target_protein;
      if (target_carbs !== undefined) payload.target_carbs = target_carbs;
      if (target_fat !== undefined) payload.target_fat = target_fat;
      if (target_water_ml !== undefined) payload.target_water_ml = target_water_ml;

      if (Object.keys(payload).length > 0) {
        await supabase.from('profiles').update(payload).eq('id', user.id);
      }
    }
  };

  const addCustomFood = async (foodData: Omit<FoodItem, 'id' | 'created_at'>): Promise<FoodItem | null> => {
    if (!isAuthenticated || !user || !getSupabase()) return null;
    const supabase = getSupabase()!;
    
    const { data, error } = await supabase.from('foods').insert([{
      ...foodData,
      is_custom: true,
      created_by: user.id
    }]).select().single();

    if (error || !data) {
      console.error("Error adding food:", error);
      return null;
    }

    setFoods(prev => [data, ...prev]);
    return data;
  };

  const addMealLog = async (logData: Omit<MealLogItem, 'id'>) => {
    if (!isAuthenticated || !user || !getSupabase()) return;
    const supabase = getSupabase()!;

    const payload = {
      user_id: user.id,
      meal_type: logData.meal_type,
      food_id: logData.food_id,
      food_name: logData.food_name,
      serving_info: logData.serving_info,
      calories: logData.calories,
      protein: logData.protein,
      carbs: logData.carbs,
      fat: logData.fat,
      quantity: logData.quantity,
      logged_at: logData.logged_at
    };

    const { data, error } = await supabase.from('meal_logs').insert([payload]).select().single();
    if (error) {
      console.error("Supabase sync error:", error);
      return;
    }
    setMealLogs(prev => [data, ...prev]);
  };

  const deleteMealLog = async (id: string) => {
    if (!isAuthenticated || !user || !getSupabase()) return;
    const supabase = getSupabase()!;
    
    const { error } = await supabase.from('meal_logs').delete().eq('id', id).eq('user_id', user.id);
    if (error) {
      console.error("Supabase delete error:", error);
      return;
    }
    setMealLogs(prev => prev.filter(m => m.id !== id));
  };

  const toggleWorkoutCheckin = async (dateStr: string, workoutName = 'Treino Concluído', notes = '') => {
    if (!isAuthenticated || !user || !getSupabase()) return;
    const supabase = getSupabase()!;

    const existing = workoutCheckins.find(w => w.workout_date === dateStr);
    
    if (existing) {
      const { error } = await supabase.from('workout_checkins').delete().eq('id', existing.id);
      if (error) console.error("Error deleting checkin:", error);
      else setWorkoutCheckins(prev => prev.filter(w => w.workout_date !== dateStr));
    } else {
      const { data, error } = await supabase.from('workout_checkins').insert([{
        user_id: user.id,
        workout_date: dateStr,
        workout_name: workoutName,
        notes: notes
      }]).select().single();

      if (error) {
        console.error("Supabase sync error:", error);
        return;
      }
      setWorkoutCheckins(prev => [data, ...prev]);

      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const isWorkoutDoneOnDate = (dateStr: string): boolean => {
    return workoutCheckins.some(w => w.workout_date === dateStr);
  };

  const getWorkoutStreak = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const totalMonthly = workoutCheckins.filter(w => {
      const d = new Date(w.workout_date + 'T00:00:00');
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    let streak = 0;
    let checkDate = new Date();

    const todayStr = getTodayDateString();
    if (!isWorkoutDoneOnDate(todayStr)) {
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

  const addBodyMetric = async (metricData: Omit<BodyMetric, 'id'>) => {
    if (!isAuthenticated || !user || !getSupabase()) return;
    const supabase = getSupabase()!;

    const { data, error } = await supabase.from('body_metrics').insert([{
      user_id: user.id,
      ...metricData
    }]).select().single();

    if (error) {
      console.error("Error saving metric:", error);
      return;
    }
    setBodyMetrics(prev => [data, ...prev.filter(m => m.logged_at !== metricData.logged_at)]);
  };

  const addWater = async (amountMl: number, dateStr = selectedDate) => {
    if (!isAuthenticated || !user || !getSupabase()) return;
    const supabase = getSupabase()!;

    const existing = waterLogs.find(w => w.logged_date === dateStr);
    
    if (existing) {
      const newAmount = existing.amount_ml + amountMl;
      const { data, error } = await supabase.from('water_logs').update({ amount_ml: newAmount }).eq('id', existing.id).select().single();
      if (!error && data) {
        setWaterLogs(prev => prev.map(w => w.id === existing.id ? data : w));
      }
    } else {
      const { data, error } = await supabase.from('water_logs').insert([{
        user_id: user.id,
        amount_ml: amountMl,
        logged_date: dateStr
      }]).select().single();
      
      if (!error && data) {
        setWaterLogs(prev => [...prev, data]);
      }
    }
  };

  const resetWater = async (dateStr = selectedDate) => {
    if (!isAuthenticated || !user || !getSupabase()) return;
    const supabase = getSupabase()!;

    const existing = waterLogs.find(w => w.logged_date === dateStr);
    if (existing) {
      await supabase.from('water_logs').delete().eq('id', existing.id);
      setWaterLogs(prev => prev.filter(w => w.id !== existing.id));
    }
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
      isAuthenticated,
      isSupabaseConfigured,
      isLoadingData,
      user,
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
