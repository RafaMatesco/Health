# SYSTEM ARCHITECTURE & AI AGENT CONTEXT SPECIFICATION

<system_identity>
Name: Vital Health & Performance Management System
Target User: Mobile-first users tracking physical health, nutrition, workout consistency, and body metrics.
Design Philosophy: Ultra-minimalist, zero visual clutter, sleek dark mode (#0b0f19), typography-focused, fast touch interactions.
Data Strategy: Local-first persistence via LocalStorage + optional Supabase PostgreSQL sync.
</system_identity>

---

<product_specifications>
## Core Product Requirements & Constraints

1. MOBILE_FIRST_UI:
   - Primary target device: Mobile smartphones (360px - 420px viewport).
   - Desktop view: Secondary layout via `Sidebar.tsx`.
   - Mobile navigation: Pinned bottom bar (`BottomNav.tsx`).

2. MINIMALIST_DESIGN_SYSTEM:
   - Visual Style: Clean cards (`minimal-card`), dark background (`#0b0f19`), subtle borders (`border-white/5` or `border-white/10`).
   - STRICT NEGATIVE CONSTRAINT: NO redundant banners, NO heavy glowing neon blur circles, NO dense text cards, NO decorative badges. Keep screens airy with clean whitespace.

3. SIMPLIFIED_WORKOUT_MODULE:
   - Scope: Strictly a daily 1-click Check-in ("Treinei Hoje ✓").
   - Streak Calculation: Consecutive trained days tracking.
   - Heatmap: Monthly interactive calendar view (`WorkoutCalendar.tsx`).
   - STRICT NEGATIVE CONSTRAINT: DO NOT implement set/rep/load/volume logging per exercise unless explicitly commanded by the user in future prompts.

4. NUTRITION_MODULE_AND_AI:
   - Meal Logs: Categorized into `breakfast`, `lunch`, `dinner`, `snack`.
   - Food Item Fields:
     - REQUIRED: `name` (string), `calories` (number).
     - RECOMMENDED: `protein` (g), `carbs` (g), `fat` (g), `fiber` (g), `serving_size` (string).
   - Food Sourcing:
     - Mocked Traditional Foods: Pre-loaded Brazilian dictionary (`MOCK_FOODS` in `src/services/mockData.ts`).
     - User Custom Foods: Created via `CreateFoodModal.tsx`.
     - Natural Language AI Text Parser: `aiService.ts` executes a zero-cost local heuristic NLP engine matching foods and portion multipliers (or optional OpenAI API key if present).

5. HYDRATION_TRACKER:
   - Incremental additions: +250ml, +500ml, +750ml.
   - Reset capability per date.
</product_specifications>

---

<file_system_mapping>
## Workspace File Structure & Responsibilities

```
r:/Dev/Health/
├── index.html                           -> HTML5 root, meta tags, dark mode body class
├── package.json                         -> Dependencies: react, recharts, lucide-react, canvas-confetti, tailwindcss v3
├── tailwind.config.js                   -> Theme colors (background: #0b0f19, card: #121826)
├── tsconfig.app.json                    -> TypeScript compiler options (verbatimModuleSyntax: true)
├── supabase/
│   └── schema.sql                       -> PostgreSQL schema DDL with RLS policies
└── src/
    ├── main.tsx                         -> Application entrypoint
    ├── App.tsx                          -> Root component, AppProvider wrapper, tab state, modal management
    ├── index.css                        -> Tailwind directives & .minimal-card utility classes
    ├── types/
    │   └── index.ts                     -> Core TypeScript interfaces & types
    ├── services/
    │   ├── mockData.ts                  -> Pre-loaded food database & initial app state
    │   └── aiService.ts                 -> Natural language meal text parsing (Local NLP + LLM)
    ├── context/
    │   └── AppContext.tsx               -> Global state store & LocalStorage sync engine
    ├── components/
    │   ├── layout/
    │   │   ├── Header.tsx               -> Fixed header with logo, date picker, workout streak badge
    │   │   ├── BottomNav.tsx            -> Pinned mobile bottom navigation bar
    │   │   └── Sidebar.tsx              -> Desktop sidebar navigation
    │   ├── dashboard/
    │   │   ├── MacroCard.tsx            -> Minimalist daily calorie & macro summary
    │   │   ├── WaterTracker.tsx         -> Minimalist hydration card with quick add buttons
    │   │   └── WorkoutCheckInCard.tsx   -> 1-click workout check-in card
    │   ├── nutrition/
    │   │   ├── MealSection.tsx          -> Meal category logger (Breakfast, Lunch, Dinner, Snack)
    │   │   ├── AddFoodModal.tsx         -> Food search & portion multiplier selector
    │   │   ├── CreateFoodModal.tsx      -> Custom food creation modal
    │   │   └── AiMealInputModal.tsx     -> AI text prompt input modal for meals
    │   ├── workouts/
    │   │   └── WorkoutCalendar.tsx      -> Monthly interactive workout consistency calendar
    │   └── metrics/
    │       ├── WeightChart.tsx          -> Recharts line chart for weight & body fat history
    │       └── AddMetricModal.tsx       -> Modal to log body weight & measurements
    └── pages/
        ├── DashboardPage.tsx            -> Main overview tab
        ├── NutritionPage.tsx            -> Nutrition tab
        └── SettingsPage.tsx             -> Profile & API key settings tab
```
</file_system_mapping>

---

<type_definitions>
## Complete TypeScript Schema (`src/types/index.ts`)

```typescript
export type GoalType = 'hypertrophy' | 'weight_loss' | 'maintenance';
export type FoodCategory = 'proteinas' | 'carboidratos' | 'gorduras' | 'frutas_vegetais' | 'bebidas' | 'pratos_prontos' | 'outros';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

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

export interface FoodItem {
  id: string;
  name: string;          // Required
  serving_size: string;  // ex: '100g'
  calories: number;      // Required
  protein: number;       // g
  carbs: number;         // g
  fat: number;           // g
  fiber?: number;        // g
  category?: FoodCategory;
  is_custom?: boolean;
  created_at?: string;
}

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
  quantity: number;
  logged_at: string;     // Format: YYYY-MM-DD
}

export interface WorkoutCheckin {
  id: string;
  workout_date: string;  // Format: YYYY-MM-DD
  workout_name?: string;
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
  logged_at: string;     // Format: YYYY-MM-DD
}

export interface WaterLog {
  id: string;
  amount_ml: number;
  logged_date: string;   // Format: YYYY-MM-DD
}
```
</type_definitions>

---

<state_management_rules>
## State Store Mechanics (`src/context/AppContext.tsx`)

1. LocalStorage Keys:
   - `vital_user_profile` -> UserProfile
   - `vital_custom_foods` -> FoodItem[] (is_custom === true)
   - `vital_meal_logs`    -> MealLogItem[]
   - `vital_workout_checkins` -> WorkoutCheckin[]
   - `vital_body_metrics` -> BodyMetric[]
   - `vital_water_logs`   -> WaterLog[]

2. Essential API Methods:
   - `setSelectedDate(dateStr: string)`: Updates currently selected date (YYYY-MM-DD).
   - `addMealLog(logData)`: Appends meal item to selectedDate.
   - `deleteMealLog(id)`: Removes meal item.
   - `toggleWorkoutCheckin(dateStr)`: Toggles workout status for given date + triggers confetti animation on completion.
   - `getWorkoutStreak()`: Returns `{ currentStreak: number, totalMonthly: number }`.
   - `getDailyTotals(dateStr)`: Aggregates calories, protein, carbs, fat, fiber for all meals on dateStr.
   - `addWater(amountMl, dateStr)`: Increments water consumption for dateStr.
</state_management_rules>

---

<ai_prompt_handling_instructions>
## AI Execution Directives & Code Modification Rules

WHEN MODIFYING CODE OR EXPANDING FEATURES, YOU MUST OBEY THE FOLLOWING:

1. MAINTAIN_MINIMALISM:
   - Always verify if a visual element is strictly necessary. If an element adds clutter, omit it.
   - Use `.minimal-card` and `.minimal-card-interactive` for container elements.

2. VERBATIM_MODULE_SYNTAX:
   - TypeScript compiler has `"verbatimModuleSyntax": true`.
   - ALWAYS import types using explicit type modifier: `import type { FoodItem } from '../types';`.
   - NEVER mix value and type imports without `type` keyword.

3. PRESERVE_MOBILE_NAVIGATION:
   - Do NOT break or remove `BottomNav.tsx`. Active tabs: `'dashboard' | 'nutrition' | 'workout' | 'metrics' | 'settings'`.

4. BUILD_VALIDATION:
   - Any code edit must be clean and pass `npm run build` without any TypeScript or Vite compilation errors.
</ai_prompt_handling_instructions>
