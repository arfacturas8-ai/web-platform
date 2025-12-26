/**
 * Application Logger
 * 
 * Provides controlled logging that only logs in development mode.
 * In production, logs are silently ignored (can be extended to send to monitoring services).
 */

const isDev = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_APP_ENV === 'development';

export const logger = {
  error: (message: string, error?: unknown) => {
    if (isDev) {
      console.error('[ERROR]', message, error || '');
    }
  },

  warn: (message: string, data?: unknown) => {
    if (isDev) {
      console.warn('[WARN]', message, data || '');
    }
  },

  info: (message: string, data?: unknown) => {
    if (isDev) {
      console.info('[INFO]', message, data || '');
    }
  },

  debug: (message: string, data?: unknown) => {
    if (isDev) {
      console.debug('[DEBUG]', message, data || '');
    }
  },
};

export default logger;
