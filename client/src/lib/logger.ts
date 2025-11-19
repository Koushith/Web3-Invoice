/**
 * Logger utility that disables console logs in production
 * Server console.logs are intentionally kept for debugging
 */

const isProduction = import.meta.env.PROD;

// Store original console methods
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
  debug: console.debug,
};

/**
 * Custom logger that respects environment settings
 */
export const logger = {
  log: (...args: any[]) => {
    if (!isProduction) {
      originalConsole.log(...args);
    }
  },
  warn: (...args: any[]) => {
    // Always show warnings
    originalConsole.warn(...args);
  },
  error: (...args: any[]) => {
    // Always show errors
    originalConsole.error(...args);
  },
  info: (...args: any[]) => {
    if (!isProduction) {
      originalConsole.info(...args);
    }
  },
  debug: (...args: any[]) => {
    if (!isProduction) {
      originalConsole.debug(...args);
    }
  },
};

/**
 * Initialize logger - call this at app startup to disable console in production
 */
export const initLogger = () => {
  if (isProduction) {
    // Override global console methods in production
    console.log = () => {};
    console.info = () => {};
    console.debug = () => {};

    // Keep warn and error for important issues
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  }
};

// Auto-initialize
initLogger();
