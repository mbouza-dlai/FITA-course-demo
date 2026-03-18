import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Recipe, RecipeInput } from '../types';

interface RecipesState {
  recipes: Recipe[];
  addRecipe: (input: RecipeInput) => Recipe;
  updateRecipe: (id: string, update: Partial<RecipeInput>) => void;
  deleteRecipe: (id: string) => void;
  getRecipe: (id: string) => Recipe | undefined;
}

// Safe storage: fall back to in-memory if localStorage is unavailable (sandboxed envs)
const memoryStore = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (name: string) => (name in store ? store[name] : null),
    setItem: (name: string, value: string) => {
      store[name] = value;
    },
    removeItem: (name: string) => {
      delete store[name];
    },
  } as Storage;
})();

function getSafeStorage(): Storage {
  try {
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      const testKey = '__rv_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    }
  } catch (e) {
    // ignore
  }
  return memoryStore;
}

function uuid(): string {
  // UUID v4 generator with crypto fallback
  const tmpl = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  const hasCrypto = typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function';
  const getRand = () => (hasCrypto ? crypto.getRandomValues(new Uint8Array(1))[0] : Math.floor(Math.random() * 256));
  return tmpl.replace(/[xy]/g, (c) => {
    const r = getRand() & 0xf;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const useRecipesStore = create<RecipesState>()(
  persist(
    (set, get) => ({
      recipes: [],
      addRecipe: (input) => {
        const now = new Date().toISOString();
        const recipe: Recipe = {
          id: uuid(),
          ...input,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ recipes: [recipe, ...state.recipes] }));
        return recipe;
      },
      updateRecipe: (id, update) => {
        const now = new Date().toISOString();
        set((state) => ({
          recipes: state.recipes.map((r) => (r.id === id ? { ...r, ...update, updatedAt: now } : r)),
        }));
      },
      deleteRecipe: (id) => {
        set((state) => ({ recipes: state.recipes.filter((r) => r.id !== id) }));
      },
      getRecipe: (id) => get().recipes.find((r) => r.id === id),
    }),
    {
      name: 'recipe-vault-store',
      storage: createJSONStorage(() => getSafeStorage()),
      version: 1,
    }
  )
);
