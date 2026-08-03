-- ===================================================
-- VITAL - Health & Performance Management System SQL
-- Database Schema for Supabase PostgreSQL
-- ===================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Perfis de Usuário
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  goal_type TEXT DEFAULT 'hypertrophy', -- 'hypertrophy', 'weight_loss', 'maintenance'
  target_calories INT DEFAULT 2200,
  target_protein INT DEFAULT 160,
  target_carbs INT DEFAULT 230,
  target_fat INT DEFAULT 70,
  target_water_ml INT DEFAULT 3000,
  created_at TIMESTAMP WITH TIMEZONE DEFAULT NOW()
);

-- 2. Tabela de Alimentos
CREATE TABLE IF NOT EXISTS foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  serving_size TEXT NOT NULL DEFAULT '100g',
  calories INT NOT NULL,
  protein FLOAT NOT NULL DEFAULT 0,
  carbs FLOAT NOT NULL DEFAULT 0,
  fat FLOAT NOT NULL DEFAULT 0,
  fiber FLOAT DEFAULT 0,
  is_custom BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIMEZONE DEFAULT NOW()
);

-- 3. Registro de Refeições
CREATE TABLE IF NOT EXISTS meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL, -- 'breakfast', 'lunch', 'dinner', 'snack'
  food_id UUID REFERENCES foods(id) ON DELETE SET NULL,
  food_name TEXT NOT NULL,
  serving_info TEXT DEFAULT '1 porção',
  calories INT NOT NULL,
  protein FLOAT DEFAULT 0,
  carbs FLOAT DEFAULT 0,
  fat FLOAT DEFAULT 0,
  quantity FLOAT NOT NULL DEFAULT 1,
  logged_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIMEZONE DEFAULT NOW()
);

-- 4. Check-ins de Treino (Frequência)
CREATE TABLE IF NOT EXISTS workout_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
  workout_name TEXT DEFAULT 'Treino Geral',
  notes TEXT,
  created_at TIMESTAMP WITH TIMEZONE DEFAULT NOW(),
  CONSTRAINT unique_user_date UNIQUE(user_id, workout_date)
);

-- 5. Métricas Corporais & Evolução
CREATE TABLE IF NOT EXISTS body_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  weight_kg FLOAT NOT NULL,
  body_fat_percentage FLOAT,
  waist_cm FLOAT,
  chest_cm FLOAT,
  arms_cm FLOAT,
  legs_cm FLOAT,
  notes TEXT,
  logged_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIMEZONE DEFAULT NOW()
);

-- 6. Log de Ingestão de Água Diária
CREATE TABLE IF NOT EXISTS water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount_ml INT NOT NULL,
  logged_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIMEZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;

-- Sample RLS Policies (Allow access to own rows)
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can read global foods" ON foods FOR SELECT USING (is_custom = FALSE OR created_by = auth.uid());
CREATE POLICY "Users can insert custom foods" ON foods FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "Users can read own meal logs" ON meal_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own meal logs" ON meal_logs FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own meal logs" ON meal_logs FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "Users can read own workouts" ON workout_checkins FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can log own workouts" ON workout_checkins FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can read own metrics" ON body_metrics FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can log own metrics" ON body_metrics FOR INSERT WITH CHECK (user_id = auth.uid());
