export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  instructions: string;
  cuisine: string;
  dietary_tags: string[];
  notes?: string;
  images: string[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type RecipeInput = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;
