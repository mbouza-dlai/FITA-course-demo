import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Safe storage fallback (duplicate to avoid cross-file coupling)
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
      const testKey = '__rv_settings_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    }
  } catch {}
  return memoryStore;
}

interface SettingsState {
  proxyUrl: string;
  setProxyUrl: (url: string) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      proxyUrl: '',
      setProxyUrl: (url) => set({ proxyUrl: url }),
    }),
    {
      name: 'recipe-vault-settings',
      storage: createJSONStorage(() => getSafeStorage()),
      version: 1,
    }
  )
);
