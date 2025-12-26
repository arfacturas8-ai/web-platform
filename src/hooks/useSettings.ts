import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/services/settingsService';
import { QUERY_KEYS } from '@/utils/constants';
import type { Settings } from '@/types/user';

export const useSettings = () => {
  return useQuery<Settings>({
    queryKey: [QUERY_KEYS.SETTINGS],
    queryFn: settingsService.get,
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Settings>) => settingsService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETTINGS] });
    },
  });
};
