import type { FoodItem, UserProfile, BodyMetric, WorkoutCheckin, MealLogItem } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'demo-user-1',
  full_name: 'Atleta Vital',
  goal_type: 'hypertrophy',
  target_calories: 2300,
  target_protein: 170,
  target_carbs: 240,
  target_fat: 65,
  target_water_ml: 3000,
};

export const MOCK_FOODS: FoodItem[] = [
  // Proteínas
  { id: 'f-1', name: 'Peito de Frango Grelhado', serving_size: '100g', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, category: 'proteinas' },
  { id: 'f-2', name: 'Ovo Cozido', serving_size: '1 unidade (50g)', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, fiber: 0, category: 'proteinas' },
  { id: 'f-3', name: 'Carne Moída Magra (Patinho)', serving_size: '100g', calories: 219, protein: 26, carbs: 0, fat: 12, fiber: 0, category: 'proteinas' },
  { id: 'f-4', name: 'Filé de Tilápia Grelhado', serving_size: '100g', calories: 128, protein: 26, carbs: 0, fat: 2.7, fiber: 0, category: 'proteinas' },
  { id: 'f-5', name: 'Whey Protein Concentrado', serving_size: '1 dosador (30g)', calories: 120, protein: 24, carbs: 3, fat: 1.8, fiber: 0, category: 'proteinas' },
  { id: 'f-6', name: 'Iogurte Natural Desnatado', serving_size: '1 pote (170g)', calories: 85, protein: 8.5, carbs: 12, fat: 0.5, fiber: 0, category: 'proteinas' },
  
  // Carboidratos
  { id: 'f-7', name: 'Arroz Branco Cozido', serving_size: '100g', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, category: 'carboidratos' },
  { id: 'f-8', name: 'Arroz Integral Cozido', serving_size: '100g', calories: 124, protein: 2.6, carbs: 25.8, fat: 1, fiber: 1.8, category: 'carboidratos' },
  { id: 'f-9', name: 'Feijão Preto Cozido', serving_size: '1 concha (100g)', calories: 90, protein: 6, carbs: 15, fat: 0.5, fiber: 5.5, category: 'carboidratos' },
  { id: 'f-10', name: 'Batata Doce Cozida', serving_size: '100g', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, category: 'carboidratos' },
  { id: 'f-11', name: 'Pão Francês', serving_size: '1 unidade (50g)', calories: 137, protein: 4, carbs: 28, fat: 1, fiber: 1.2, category: 'carboidratos' },
  { id: 'f-12', name: 'Aveia em Flocos', serving_size: '30g (2 col. sopa)', calories: 118, protein: 4.3, carbs: 20, fat: 2.1, fiber: 2.7, category: 'carboidratos' },
  { id: 'f-13', name: 'Tapioca Massa Pronta', serving_size: '50g (3 col. sopa)', calories: 120, protein: 0, carbs: 30, fat: 0, fiber: 0, category: 'carboidratos' },

  // Frutas e Vegetais
  { id: 'f-14', name: 'Banana Prata', serving_size: '1 unidade média (90g)', calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6, category: 'frutas_vegetais' },
  { id: 'f-15', name: 'Maçã Fuji', serving_size: '1 unidade média (130g)', calories: 72, protein: 0.3, carbs: 19, fat: 0.2, fiber: 3.1, category: 'frutas_vegetais' },
  { id: 'f-16', name: 'Brócolis Cozido', serving_size: '100g', calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4, fiber: 3.3, category: 'frutas_vegetais' },
  { id: 'f-17', name: 'Salada Verde (Alface + Tomate)', serving_size: '1 prato (100g)', calories: 20, protein: 1.2, carbs: 3.8, fat: 0.2, fiber: 1.5, category: 'frutas_vegetais' },

  // Gorduras
  { id: 'f-18', name: 'Azeite de Oliva Extra Virgem', serving_size: '1 colher de sopa (13ml)', calories: 119, protein: 0, carbs: 0, fat: 13.5, fiber: 0, category: 'gorduras' },
  { id: 'f-19', name: 'Pasta de Amendoim Integral', serving_size: '1 colher de sopa (15g)', calories: 95, protein: 4, carbs: 3, fat: 8, fiber: 1.2, category: 'gorduras' },
  { id: 'f-20', name: 'Abacate', serving_size: '100g', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7, category: 'gorduras' },

  // Pratos Prontos e Lanches
  { id: 'f-21', name: 'Crepioca (1 ovo + 2 col tapioca)', serving_size: '1 unidade (100g)', calories: 158, protein: 7, carbs: 16, fat: 6, fiber: 0, category: 'pratos_prontos' },
  { id: 'f-22', name: 'Café Preto sem Açúcar', serving_size: '1 xícara (150ml)', calories: 2, protein: 0.3, carbs: 0.2, fat: 0, fiber: 0, category: 'bebidas' }
];

export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getPastDateString = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_MEAL_LOGS: MealLogItem[] = [
  {
    id: 'ml-1',
    meal_type: 'breakfast',
    food_id: 'f-11',
    food_name: 'Pão Francês',
    serving_info: '1 unidade (50g)',
    calories: 137,
    protein: 4,
    carbs: 28,
    fat: 1,
    fiber: 1.2,
    quantity: 1,
    logged_at: getTodayDateString()
  },
  {
    id: 'ml-2',
    meal_type: 'breakfast',
    food_id: 'f-2',
    food_name: 'Ovo Cozido',
    serving_info: '2 unidades (100g)',
    calories: 156,
    protein: 12.6,
    carbs: 1.2,
    fat: 10.6,
    fiber: 0,
    quantity: 2,
    logged_at: getTodayDateString()
  },
  {
    id: 'ml-3',
    meal_type: 'breakfast',
    food_id: 'f-22',
    food_name: 'Café Preto sem Açúcar',
    serving_info: '1 xícara (150ml)',
    calories: 2,
    protein: 0.3,
    carbs: 0.2,
    fat: 0,
    fiber: 0,
    quantity: 1,
    logged_at: getTodayDateString()
  },
  {
    id: 'ml-4',
    meal_type: 'lunch',
    food_id: 'f-1',
    food_name: 'Peito de Frango Grelhado',
    serving_info: '150g',
    calories: 247,
    protein: 46.5,
    carbs: 0,
    fat: 5.4,
    fiber: 0,
    quantity: 1.5,
    logged_at: getTodayDateString()
  },
  {
    id: 'ml-5',
    meal_type: 'lunch',
    food_id: 'f-7',
    food_name: 'Arroz Branco Cozido',
    serving_info: '150g',
    calories: 195,
    protein: 4,
    carbs: 42,
    fat: 0.45,
    fiber: 0.6,
    quantity: 1.5,
    logged_at: getTodayDateString()
  },
  {
    id: 'ml-6',
    meal_type: 'lunch',
    food_id: 'f-9',
    food_name: 'Feijão Preto Cozido',
    serving_info: '1 concha (100g)',
    calories: 90,
    protein: 6,
    carbs: 15,
    fat: 0.5,
    fiber: 5.5,
    quantity: 1,
    logged_at: getTodayDateString()
  }
];

export const INITIAL_WORKOUT_CHECKINS: WorkoutCheckin[] = [
  { id: 'w-1', workout_date: getTodayDateString(), workout_name: 'Treino A - Peito & Tríceps', notes: 'Carga excelente no supino reto!', created_at: new Date().toISOString() },
  { id: 'w-2', workout_date: getPastDateString(1), workout_name: 'Treino B - Costas & Bíceps', notes: 'Puxada articulada 70kg', created_at: new Date().toISOString() },
  { id: 'w-3', workout_date: getPastDateString(2), workout_name: 'Treino C - Pernas & Ombro', notes: 'Agachamento 100kg', created_at: new Date().toISOString() },
  { id: 'w-4', workout_date: getPastDateString(4), workout_name: 'Treino A - Peito & Tríceps', notes: 'Foco em execução controlada', created_at: new Date().toISOString() },
  { id: 'w-5', workout_date: getPastDateString(5), workout_name: 'Treino B - Costas & Bíceps', notes: '', created_at: new Date().toISOString() },
  { id: 'w-6', workout_date: getPastDateString(7), workout_name: 'Treino C - Pernas Completo', notes: '', created_at: new Date().toISOString() },
  { id: 'w-7', workout_date: getPastDateString(8), workout_name: 'Treino Cardio + Abdômen', notes: '30min esteira', created_at: new Date().toISOString() },
];

export const INITIAL_BODY_METRICS: BodyMetric[] = [
  { id: 'bm-1', weight_kg: 81.5, body_fat_percentage: 16.2, waist_cm: 84, chest_cm: 104, arms_cm: 38.5, legs_cm: 60, logged_at: getPastDateString(30) },
  { id: 'bm-2', weight_kg: 80.8, body_fat_percentage: 15.8, waist_cm: 83.5, chest_cm: 104.5, arms_cm: 38.8, legs_cm: 60.5, logged_at: getPastDateString(21) },
  { id: 'bm-3', weight_kg: 80.1, body_fat_percentage: 15.4, waist_cm: 83, chest_cm: 105, arms_cm: 39, legs_cm: 61, logged_at: getPastDateString(14) },
  { id: 'bm-4', weight_kg: 79.6, body_fat_percentage: 15.0, waist_cm: 82.2, chest_cm: 105.5, arms_cm: 39.2, legs_cm: 61.5, logged_at: getPastDateString(7) },
  { id: 'bm-5', weight_kg: 79.2, body_fat_percentage: 14.7, waist_cm: 81.8, chest_cm: 106, arms_cm: 39.5, legs_cm: 62, logged_at: getTodayDateString() },
];
