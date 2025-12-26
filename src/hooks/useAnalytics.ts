import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analyticsService';
import { QUERY_KEYS } from '@/utils/constants';
import type { DashboardStats, Analytics } from '@/types/analytics';

export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: [QUERY_KEYS.SETTINGS, 'dashboard'],
    queryFn: analyticsService.getDashboardStats,
  });
};

export const useAnalytics = (startDate?: string, endDate?: string) => {
  return useQuery<Analytics>({
    queryKey: [QUERY_KEYS.SETTINGS, 'analytics', startDate, endDate],
    queryFn: () => analyticsService.getAnalytics(startDate, endDate),
  });
};
