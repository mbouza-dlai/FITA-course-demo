import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
      const testKey = '__rv_app_store_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    }
  } catch {}
  return memoryStore;
}

interface AppState {
  suggestionsEndpoint?: string;
  setSuggestionsEndpoint: (u?: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      suggestionsEndpoint: undefined,
      setSuggestionsEndpoint: (u) => set({ suggestionsEndpoint: u || undefined }),
    }),
    {
      name: 'recipe-vault-app-store',
      storage: createJSONStorage(() => getSafeStorage()),
    }
  )
);
