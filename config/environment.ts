/**
 * Environment configuration for the Savor web application
 * Centralizes all environment variable access and provides defaults
 */

export const config = {
  // API Configuration
  apiUrl: 'https://savor-server-production.up.railway.app',
//   'http://localhost:8080',
//   process.env.NEXT_PUBLIC_API_URL,
  
  // Environment detection
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // API endpoints
  endpoints: {
    home: '/api/home',
    bags: '/api/bags',
    users: '/api/users',
    reservations: '/api/reservations',
    reservationsGuest: '/api/reservations/guest',
    reservationsSession: '/api/reservations/session',
  }
} as const;

// Helper function to get full API URL
export const getApiUrl = (endpoint: string = ''): string => {
  return `${config.apiUrl}${endpoint}`;
};

// Helper function to get endpoint URL
export const getEndpointUrl = (endpoint: keyof typeof config.endpoints): string => {
  return getApiUrl(config.endpoints[endpoint]);
};

export default config;
