/**
 * Get the base API URL based on the current environment
 */
export const getApiBaseUrl = (): string => {
  // Check if we're in production mode
  const isProduction = import.meta.env.PROD;

  // Return production URL if in production, otherwise local
  if (isProduction) {
    return 'https://definvoice-production.up.railway.app/api';
  }

  return 'http://localhost:5001/api';
};

/**
 * Get the frontend base URL based on the current environment
 */
export const getFrontendBaseUrl = (): string => {
  const isProduction = import.meta.env.PROD;

  if (isProduction) {
    return 'https://www.definvoice.xyz';
  }

  return 'http://localhost:5173';
};

/**
 * Configuration constants
 */
export const config = {
  apiUrl: getApiBaseUrl(),
  frontendUrl: getFrontendBaseUrl(),
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
} as const;
