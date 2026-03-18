import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Safe storage fallback
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
      const testKey = '__rv_llm_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    }
  } catch {}
  return memoryStore;
}

export interface LLMConfig {
  baseUrl: string; // OpenAI-compatible endpoint base (no trailing /v1)
  apiKey: string; // Client-provided key (stored locally)
  model: string;   // Model name
  provider?: 'openai' | 'openrouter' | 'custom';
}

interface LLMState {
  config: LLMConfig;
  setConfig: (cfg: Partial<LLMConfig>) => void;
}

export const useLLMStore = create<LLMState>()(
  persist(
    (set, get) => ({
      config: {
        provider: 'openai',
        baseUrl: 'https://api.openai.com',
        apiKey: '',
        model: 'gpt-4o-mini',
      },
      setConfig: (cfg) => set({ config: { ...get().config, ...cfg } }),
    }),
    {
      name: 'recipe-vault-llm-config',
      storage: createJSONStorage(() => getSafeStorage()),
      version: 2,
    }
  )
);
