import api from './api';
import type { DashboardStats, Analytics } from '@/types/analytics';

export const analyticsService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  getAnalytics: async (startDate?: string, endDate?: string): Promise<Analytics> => {
    const params: Record<string, string> = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    const response = await api.get('/admin/analytics', { params });
    return response.data;
  },
};
