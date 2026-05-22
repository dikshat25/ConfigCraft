import { useWarningStore } from '../store/warningStore';

export const logger = {
  warn: (message, meta = {}) => {
    console.warn(`[ConfigCraft] ${message}`, meta);
    // Push warning to store if it's a healing event
    if (meta.issue && meta.action) {
      useWarningStore.getState().addWarning({
        id: Date.now() + Math.random(),
        ...meta
      });
    }
  },
  error: (message, meta = {}) => {
    console.error(`[ConfigCraft] ${message}`, meta);
  },
  info: (message, meta = {}) => {
    if (import.meta.env.DEV) {
      console.log(`[ConfigCraft] ${message}`, meta);
    }
  }
};
