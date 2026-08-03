import type { FoodItem, MealType } from '../types';

export interface ParsedAiItem {
  food_name: string;
  serving_info: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  quantity: number;
}

export interface ParseMealResult {
  items: ParsedAiItem[];
  detectedMealType?: MealType;
  confidenceMessage: string;
}

/**
 * Intelligent Meal Text Parser
 * Operates in two modes:
 * 1. Client-side Heuristic NLP (Free, instantaneous, works out-of-the-box with Brazilian food dictionary).
 * 2. OpenAI / OpenRouter API integration if an API key is provided in Settings.
 */
export async function parseMealTextWithAi(
  text: string,
  _targetMealType: MealType,
  availableFoods: FoodItem[],
  apiKey?: string
): Promise<ParseMealResult> {
  const cleanText = text.trim().toLowerCase();

  // If custom API key is present, attempt LLM call
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Você é um assistente nutricional especialista. Analise o texto do usuário em português sobre o que ele comeu e retorne estritamente um JSON no formato:
{
  "items": [
    {
      "food_name": "Nome do alimento",
      "serving_info": "ex: 150g ou 2 unidades",
      "calories": 250,
      "protein": 30,
      "carbs": 20,
      "fat": 5,
      "fiber": 2,
      "quantity": 1.5
    }
  ]
}`
            },
            {
              role: 'user',
              content: text
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const jsonContent = JSON.parse(data.choices[0].message.content);
        if (jsonContent.items && Array.isArray(jsonContent.items)) {
          return {
            items: jsonContent.items,
            confidenceMessage: 'Refeição identificada via IA GPT-4o Mini!'
          };
        }
      }
    } catch (err) {
      console.warn('Erro ao chamar API externa de IA. Utilizando parser inteligente local:', err);
    }
  }

  // Fallback / Default: Smart Heuristic Local NLP Parser
  const items: ParsedAiItem[] = [];

  // Match available foods against text
  for (const food of availableFoods) {
    const foodLower = food.name.toLowerCase();
    
    // Create keywords from food name (e.g., 'peito de frango' -> 'frango', 'peito')
    const keywords = foodLower.split(' ').filter(w => w.length > 2 && !['com', 'de', 'do', 'da', 'sem', 'em'].includes(w));
    
    let isMatched = false;

    if (cleanText.includes(foodLower)) {
      isMatched = true;
    } else {
      const matchedKeywords = keywords.filter(kw => cleanText.includes(kw));
      if (matchedKeywords.length >= 1 && keywords.length <= 2) {
        isMatched = true;
      } else if (matchedKeywords.length >= 2) {
        isMatched = true;
      }
    }

    if (isMatched) {
      // Extract quantity / portion estimate
      let multiplier = 1;
      
      // Look for numbers before/after the matched food name (e.g. 200g, 2 ovos, 1.5 conchas)
      const gramsRegex = new RegExp(`(\\d+(?:[.,]\\d+)?)\\s*(g|gramas|ml)\\s*(?:de\\s*)?${keywords.join('|')}`, 'i');
      const unitsRegex = new RegExp(`(\\d+(?:[.,]\\d+)?)\\s*(?:unidades?|ovos?|pães?|fatias?|colheres?|conchas?|dosador)?\\s*(?:de\\s*)?${keywords.join('|')}`, 'i');
      
      const gramsMatch = cleanText.match(gramsRegex);
      const unitsMatch = cleanText.match(unitsRegex);

      if (gramsMatch) {
        const val = parseFloat(gramsMatch[1].replace(',', '.'));
        if (!isNaN(val) && val > 0) {
          multiplier = val / 100; // Base 100g
        }
      } else if (unitsMatch) {
        const val = parseFloat(unitsMatch[1].replace(',', '.'));
        if (!isNaN(val) && val > 0) {
          multiplier = val;
        }
      }

      items.push({
        food_name: food.name,
        serving_info: `${Math.round(multiplier * 100)}g / porção`,
        calories: Math.round(food.calories * multiplier),
        protein: Math.round(food.protein * multiplier * 10) / 10,
        carbs: Math.round(food.carbs * multiplier * 10) / 10,
        fat: Math.round(food.fat * multiplier * 10) / 10,
        fiber: food.fiber ? Math.round(food.fiber * multiplier * 10) / 10 : 0,
        quantity: multiplier
      });
    }
  }

  // If no exact database food was matched, parse general input (e.g., "comi 300 kcal de salada")
  if (items.length === 0) {
    const calorieMatch = cleanText.match(/(\d+)\s*(kcal|calorias)/i);
    const estCalories = calorieMatch ? parseInt(calorieMatch[1], 10) : 250;

    items.push({
      food_name: text.length > 30 ? text.substring(0, 30) + '...' : text,
      serving_info: 'Porção estimada',
      calories: estCalories,
      protein: Math.round((estCalories * 0.3) / 4), // 30% protein
      carbs: Math.round((estCalories * 0.4) / 4), // 40% carbs
      fat: Math.round((estCalories * 0.3) / 9), // 30% fat
      fiber: 2,
      quantity: 1
    });
  }

  return {
    items,
    confidenceMessage: `Identificado(s) ${items.length} alimento(s) com base no seu texto.`
  };
}
