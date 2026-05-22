import { create } from 'zustand';

export const useWarningStore = create((set) => ({
  warnings: [],
  addWarning: (warning) => set((state) => ({ warnings: [...state.warnings, warning] })),
  setWarnings: (warnings) => set({ warnings }),
  clearWarnings: () => set({ warnings: [] }),
}));
