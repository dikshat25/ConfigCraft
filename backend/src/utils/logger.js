/**
 * Simple structured logger
 */
export const logger = {
  info: (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(JSON.stringify({ level: 'info', message, timestamp: new Date().toISOString(), ...meta }));
    }
  },
  warn: (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(JSON.stringify({ level: 'warn', message, timestamp: new Date().toISOString(), ...meta }));
    }
  },
  error: (message, meta = {}) => {
    console.error(JSON.stringify({ level: 'error', message, timestamp: new Date().toISOString(), ...meta }));
  }
};
