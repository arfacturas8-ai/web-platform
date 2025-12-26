// API URLs - use Next.js environment variables
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://116.203.208.28/api/v1';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://116.203.208.28';

// Helper to get full URL for uploaded images
export const getImageUrl = (path: string): string => {
  if (!path) return '';
  // Already a full URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Relative path from upload - prepend base URL
  return `${API_BASE_URL}${path}`;
};

export const QUERY_KEYS = {
  CATEGORIES: 'categories',
  MENU_ITEMS: 'menuItems',
  MENU_ITEM: 'menuItem',
  ALLERGENS: 'allergens',
  RESERVATIONS: 'reservations',
  RESERVATION: 'reservation',
  TABLES: 'tables',
  TIME_SLOTS: 'timeSlots',
  AVAILABILITY: 'availability',
  CUSTOMERS: 'customers',
  USER: 'user',
  SETTINGS: 'settings',
} as const;

export const ROUTES = {
  HOME: '/',
  MENU: '/menu',
  RESERVATIONS: '/reservations',
  STAFF_LOGIN: '/staff-portal-1973',  // Hidden admin login
  ADMIN: '/admin',
  ADMIN_MENU: '/admin/menu',
  ADMIN_RESERVATIONS: '/admin/reservations',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings',
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user',
  LANGUAGE: 'language',
} as const;

export const DEFAULT_LANGUAGE = 'es';

export const SUPPORTED_LANGUAGES = ['es', 'en', 'it', 'de', 'fr', 'sv'] as const;

export const LANGUAGE_NAMES: Record<string, string> = {
  es: 'Espanol',
  en: 'English',
  it: 'Italiano',
  de: 'Deutsch',
  fr: 'Francais',
  sv: 'Svenska',
};

export const LANGUAGE_FLAGS: Record<string, string> = {
  es: '🇨🇷',
  en: '🇺🇸',
  it: '🇮🇹',
  de: '🇩🇪',
  fr: '🇫🇷',
  sv: '🇸🇪',
};
