import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLocaleStore = create(
  persist(
    (set) => ({
      locale: 'en',
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'cc_locale',
    }
  )
);
