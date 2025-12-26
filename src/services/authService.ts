import api from './api';
import type { LoginDto, LoginResponse, User } from '@/types/user';
import { STORAGE_KEYS } from '@/utils/constants';

// Helper to check if we're on the client side
const isClient = typeof window !== 'undefined';

export const authService = {
  async login(credentials: LoginDto): Promise<LoginResponse> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await api.post<LoginResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Save token to localStorage
    if (response.data.access_token && isClient) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.access_token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    }

    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  logout(): void {
    if (isClient) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  getStoredUser(): User | null {
    if (!isClient) return null;
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  getToken(): string | null {
    if (!isClient) return null;
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
