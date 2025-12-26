import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timeSlotService } from '@/services/timeSlotService';
import { QUERY_KEYS } from '@/utils/constants';
import type { TimeSlot, CreateTimeSlotDto, UpdateTimeSlotDto } from '@/types/reservation';

export const useTimeSlots = () => {
  return useQuery<TimeSlot[]>({
    queryKey: [QUERY_KEYS.TIME_SLOTS],
    queryFn: timeSlotService.getAll,
  });
};

export const useTimeSlot = (id: string) => {
  return useQuery<TimeSlot>({
    queryKey: [QUERY_KEYS.TIME_SLOTS, id],
    queryFn: () => timeSlotService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTimeSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTimeSlotDto) => timeSlotService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TIME_SLOTS] });
    },
  });
};

export const useUpdateTimeSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTimeSlotDto }) =>
      timeSlotService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TIME_SLOTS] });
    },
  });
};

export const useDeleteTimeSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => timeSlotService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TIME_SLOTS] });
    },
  });
};
