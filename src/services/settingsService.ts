import api from './api';
import type { Settings } from '@/types/user';

export const settingsService = {
  get: async (): Promise<Settings> => {
    const response = await api.get('/settings');
    return response.data;
  },

  update: async (data: Partial<Settings>): Promise<Settings> => {
    const response = await api.put('/settings', data);
    return response.data;
  },
};
