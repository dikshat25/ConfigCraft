import { create } from 'zustand';

export const useConfigStore = create((set) => ({
  configs: [],
  activeConfig: null,
  healedConfig: null,
  
  setConfigs: (configs) => set({ configs }),
  setActiveConfig: (config, healedConfig = null) => set({ activeConfig: config, healedConfig: healedConfig || config?.normalizedConfig }),
  clearActiveConfig: () => set({ activeConfig: null, healedConfig: null }),
}));
