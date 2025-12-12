// Authentication Configuration
export const AUTH_CONFIG = {
  // Google Client ID from Google Cloud Console
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '321814641348-m4j1vkn468pjkac7oo4ug9tqaiacgc0m.apps.googleusercontent.com',
  
  // Backend API URL
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
  
  // OAuth redirect URLs
  GOOGLE_REDIRECT_URL: import.meta.env.VITE_GOOGLE_REDIRECT_URL || 'http://localhost:4000/auth/google/callback',
};