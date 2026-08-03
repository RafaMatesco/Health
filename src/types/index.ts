export type GoalType = 'hypertrophy' | 'weight_loss' | 'maintenance';

export interface UserProfile {
  id: string;
  full_name: string;
  goal_type: GoalType;
  target_calories: number;
  target_protein: number;
  target_carbs: number;
  target_fat: number;
  target_water_ml: number;
  supabase_url?: string;
  supabase_anon_key?: string;
  ai_api_key?: string;
}

export type FoodCategory = 
  | 'proteinas'
  | 'carboidratos'
  | 'gorduras'
  | 'frutas_vegetais'
  | 'bebidas'
  | 'pratos_prontos'
  | 'outros';

export interface FoodItem {
  id: string;
  name: string;
  serving_size: string; // ex: '100g', '1 unidade', '1 concha'
  calories: number; // Obrigatório
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  fiber?: number; // g
  category?: FoodCategory;
  is_custom?: boolean;
  created_at?: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealLogItem {
  id: string;
  meal_type: MealType;
  food_id?: string;
  food_name: string;
  serving_info: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  quantity: number; // Multiplicador de porção
  logged_at: string; // YYYY-MM-DD
}

export interface WorkoutCheckin {
  id: string;
  workout_date: string; // YYYY-MM-DD
  workout_name?: string; // ex: 'Treino A - Peito & Tríceps'
  notes?: string;
  created_at: string;
}

export interface BodyMetric {
  id: string;
  weight_kg: number;
  body_fat_percentage?: number;
  waist_cm?: number;
  chest_cm?: number;
  arms_cm?: number;
  legs_cm?: number;
  notes?: string;
  logged_at: string; // YYYY-MM-DD
}

export interface WaterLog {
  id: string;
  amount_ml: number;
  logged_date: string; // YYYY-MM-DD
}
